import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TempPiecesModule } from './temp-pieces/temp-pieces.module';
import { PiecesModule } from './pieces/pieces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TempPiecesModule,
    PiecesModule,
  ],
})
export class AppModule {}
