import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

@Module({
  providers: [AwsService, S3Client, CloudFrontClient],
  exports: [AwsService],
})
export class AwsModule {}
