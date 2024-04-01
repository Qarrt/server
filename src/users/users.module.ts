import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MyInfoController } from './my-info.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { AwsModule } from '../utils/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [UsersController, MyInfoController],
  providers: [UsersService, UsersRepository, S3Client, CloudFrontClient],
  exports: [UsersService],
})
export class UsersModule {}
