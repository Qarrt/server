import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ProviderInfo } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

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

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    return this.usersRepository.setCurrentRefreshToken(userId, refreshToken);
  }
}
