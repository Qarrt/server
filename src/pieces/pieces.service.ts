import { Injectable } from '@nestjs/common';
import { PiecesRepository } from './pieces.repository';
import { type CreateTempPieceDto } from './dto/request/create-temp-piece.dto';
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
}
