import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProviderInfo } from 'src/users/users.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '.prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(info: ProviderInfo) {
    const user = await this.validateUser(info);
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      // 1차 검증
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const userId = decodedRefreshToken.userId;

      // 데이터베이스에서 User 객체 가져오기
      const savedToken = await this.usersService.getRefreshToken(userId);

      if (!savedToken) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // 2차 검증
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        savedToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // 새로운 accessToken 생성
      const accessToken = this.generateAccessToken(userId);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  async logout(userId: string) {
    return this.usersService.setRefreshToken(userId, null);
  }

  async validateUser(info: ProviderInfo) {
    const user = await this.usersService.getUserByProvider(info);
    if (!user) {
      return this.usersService.create(info);
    }
    return user;
  }

  generateAccessToken(userId: string): string {
    const payload = {
      userId,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);

    await this.usersService.setRefreshToken(
      payload.userId,
      currentRefreshToken,
    );

    return refreshToken;
  }
}
