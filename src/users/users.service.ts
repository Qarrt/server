import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  ProviderInfo,
  type UpdateUserInfoDto,
  type ReturnUserInfoDto,
  type UploadImageDto,
} from './users.dto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    private s3Client: S3Client,
    private cloudFrontClient: CloudFrontClient,
  ) {}

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

  async getUploadUrl(userId: string, type: string): Promise<string> {
    const extName = type.split('/')[1];
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `profile/${userId}.${extName}`,
      ContentType: type,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    return signedUrl;
  }

  async ProfileUploadComplete(userId: string, uploadImageDto: UploadImageDto) {
    const currentExtName = uploadImageDto.type.split('/')[1];

    if (uploadImageDto.previousImage) {
      const previousExtName = uploadImageDto.previousImage.split('.').pop();
      await this.createInvalidation(`profile/${userId}.${previousExtName}`);
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: `profile/${userId}.${previousExtName}`,
      });
      await this.s3Client.send(command);
    }
    return this.usersRepository.updateUserInfo(userId, {
      image: `${this.configService.get('CLOUDFRONT_URL')}/profile/${userId}.${currentExtName}`,
    });
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
