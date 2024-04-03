import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ProviderInfo } from './type';
import type { UpdateUserDto, UploadImageDto } from './dto/request';
import type { UserDto } from './dto/response';

import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/utils/aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    private awsService: AwsService,
  ) {}

  async updateUserInfo(userId: string, data: UpdateUserDto): Promise<UserDto> {
    return this.usersRepository.updateUserInfo(userId, data);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUploadUrl(userId: string, type: string): Promise<string> {
    const extName = type.split('/')[1];
    const key = `profile/${userId}.${extName}`;
    const signedUrl = await this.awsService.getUploadUrl(key, type);
    return signedUrl;
  }

  async ProfileUploadComplete(userId: string, uploadImageDto: UploadImageDto) {
    const currentExtName = uploadImageDto.type.split('/')[1];

    if (uploadImageDto.previousImage) {
      const previousExtName = uploadImageDto.previousImage.split('.').pop();
      await this.awsService.createInvalidation(
        `profile/${userId}.${previousExtName}`,
      );
      if (currentExtName !== previousExtName) {
        await this.awsService.s3DeleteObject(
          `profile/${userId}.${previousExtName}`,
        );
      }
    }
    return this.usersRepository.updateUserInfo(userId, {
      image: `${this.configService.get('CLOUDFRONT_URL')}/profile/${userId}.${currentExtName}`,
    });
  }

  async getUserByProvider(provider: ProviderInfo) {
    return this.usersRepository.getUserByProvider(provider);
  }

  generateUserName(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = 10;
    let result = '';
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async create(provider: ProviderInfo) {
    const name = this.generateUserName();
    return this.usersRepository.create({ ...provider, name });
  }

  async setRefreshToken(userId: string, refreshToken: string | null) {
    return this.usersRepository.setRefreshToken(userId, refreshToken);
  }

  async getRefreshToken(userId: string) {
    return this.usersRepository.getRefreshToken(userId);
  }
}
