import { Injectable } from '@nestjs/common';
import { TempPiecesRepository } from './temp-pieces.repository';
import type { CreateTempPieceDto, UpdateTempPieceDto } from './dto/request';
import { AwsService } from 'src/utils/aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TempPiecesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tempPiecesRepository: TempPiecesRepository,
    private readonly awsService: AwsService,
  ) {}

  async createTempPiece(
    userId: string,
    createTempPieceDto: CreateTempPieceDto,
  ) {
    const { file, ...data } = { ...createTempPieceDto };
    const tempPiece = await this.tempPiecesRepository.createTempPiece(
      userId,
      data,
    );
    if (file) {
      const key = `temp-pieces/${tempPiece.id}.${file.mimetype.split('/')[1]}`;
      await this.awsService.s3UploadObject(key, file);
      return this.tempPiecesRepository.updateTempPiece(tempPiece.id, {
        image: `${this.configService.get('CLOUDFRONT_URL')}/${key}`,
      });
    }
    return tempPiece;
  }

  async getTempPiece(id: string) {
    return this.tempPiecesRepository.getTempPiece(id);
  }

  async getTempPieces(userId: string) {
    return this.tempPiecesRepository.getTempPieces(userId);
  }

  async updateTempPiece(id: string, updateTempPieceDto: UpdateTempPieceDto) {
    const { file, ...data } = { ...updateTempPieceDto };

    if (file) {
      const key = `temp-pieces/${id}.${file.mimetype.split('/')[1]}`;
      this.awsService.s3UploadObject(key, file);
      data.image = `${this.configService.get('CLOUDFRONT_URL')}/${key}`;
      if (data.image) {
        await this.awsService.createInvalidation(key);
      }
    }

    return this.tempPiecesRepository.updateTempPiece(id, data);
  }

  async deleteTempPiece(id: string) {
    const tempPiece = await this.tempPiecesRepository.getTempPiece(id);
    if (!tempPiece) {
      return;
    }
    if (tempPiece.image) {
      const ext = tempPiece.image.split('.').pop();
      const key = `temp-pieces/${id}.${ext}`;
      this.awsService.s3DeleteObject(key);
    }
    return this.tempPiecesRepository.deleteTempPiece(id);
  }
}
