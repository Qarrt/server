import { Injectable } from '@nestjs/common';
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
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async validateUser(info: ProviderInfo) {
    const user = await this.usersService.getUserByProvider(info);
    if (!user) {
      return this.usersService.create(info);
    }
    return user;
  }

  generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
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

    await this.usersService.setCurrentRefreshToken(
      payload.userId,
      currentRefreshToken,
    );

    return refreshToken;
  }
}
