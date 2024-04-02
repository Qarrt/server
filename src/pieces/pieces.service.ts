import { Injectable } from '@nestjs/common';
import { PiecesRepository } from './pieces.repository';
import type { CreateTempPieceDto, UpdateTempPieceDto } from './dto/request';
import { AwsService } from 'src/utils/aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PiecesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly piecesRepository: PiecesRepository,
    private readonly awsService: AwsService,
  ) {}

  async createTempPiece(
    userId: string,
    createTempPieceDto: CreateTempPieceDto,
  ) {
    const { file, ...data } = { ...createTempPieceDto };
    const tempPiece = await this.piecesRepository.createTempPiece(userId, data);
    if (file) {
      const key = `temp-pieces/${tempPiece.id}.${file.mimetype.split('/')[1]}`;
      await this.awsService.s3UploadObject(key, file);
      return this.piecesRepository.updateTempPiece(tempPiece.id, {
        image: `${this.configService.get('CLOUDFRONT_URL')}/${key}`,
      });
    }
    return tempPiece;
  }

  async getTempPiece(id: string) {
    return this.piecesRepository.getTempPiece(id);
  }

  async getTempPieces(userId: string) {
    return this.piecesRepository.getTempPieces(userId);
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

    return this.piecesRepository.updateTempPiece(id, data);
  }

  async deleteTempPiece(id: string) {
    const tempPiece = await this.piecesRepository.getTempPiece(id);
    if (!tempPiece) {
      return;
    }
    if (tempPiece.image) {
      const ext = tempPiece.image.split('.').pop();
      const key = `temp-pieces/${id}.${ext}`;
      this.awsService.s3DeleteObject(key);
    }
    return this.piecesRepository.deleteTempPiece(id);
  }
}
