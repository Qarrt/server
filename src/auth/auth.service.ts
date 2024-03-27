import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProviderInfo } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(info: ProviderInfo) {
    const user = await this.validateUser(info);
    console.log(user);
  }

  async validateUser(info: ProviderInfo) {
    const user = await this.usersService.getUserByProvider(info);
    if (!user) {
      return this.usersService.create(info);
    }
    return user;
  }
}
