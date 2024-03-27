import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { ProviderInfo } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByProvider(provider: ProviderInfo): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...provider,
      },
    });
  }
}
