import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  ProviderInfo,
  type UpdateUserInfoDto,
  type ReturnUserInfoDto,
} from './users.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async updateUserInfo(
    userId: string,
    data: UpdateUserInfoDto,
  ): Promise<ReturnUserInfoDto> {
    return this.usersRepository.updateUserInfo(userId, data);
  }

  async getUserById(id: string): Promise<ReturnUserInfoDto> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
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
