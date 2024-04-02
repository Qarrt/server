import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
    private readonly cloudFrontClient: CloudFrontClient,
  ) {}

  async getUploadUrl(key: string, type: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
      ContentType: type,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    return signedUrl;
  }

  async s3DeleteObject(key: string): Promise<boolean> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
    });
    await this.s3Client.send(command);
    return true;
  }

  async s3UploadObject(
    key: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);
    return true;
  }

  async createInvalidation(key: string): Promise<boolean> {
    const command = new CreateInvalidationCommand({
      DistributionId: this.configService.get('CLOUDFRONT_DISTRIBUTION_ID'),
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: [`/${key}`],
        },
      },
    });
    await this.cloudFrontClient.send(command);
    return true;
  }

  async copyObject(
    sourceKey: string,
    destinationKey: string,
  ): Promise<boolean> {
    const command = new CopyObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      CopySource: `${this.configService.get('S3_BUCKET_NAME')}/${sourceKey}`,
      Key: destinationKey,
    });
    await this.s3Client.send(command);
    return true;
  }
}
