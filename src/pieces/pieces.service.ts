import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AwsService } from 'src/utils/aws/aws.service';
import { PiecesRepository } from './pieces.repository';
import type { CreatePieceDto } from './dto/request';
import { TempPiecesService } from 'src/temp-pieces/temp-pieces.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PiecesService {
  constructor(
    private piecesRepository: PiecesRepository,
    private awsService: AwsService,
    private tempPiecesService: TempPiecesService,
    private configService: ConfigService,
  ) {}

  async createPiece(userId: string, createPieceDto: CreatePieceDto) {
    const { file, tempPieceId, ...data } = createPieceDto;
    const id = uuidv4();
    let ext;
    let key;

    if (!file && !data.image) {
      throw new HttpException(
        '이미지 파일이 필요합니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file) {
      ext = file.originalname.split('.').pop();
      key = `pieces/${id}.${ext}`;
      await this.awsService.s3UploadObject(key, file);
    } else {
      ext = data.image!.split('.').pop();
      key = `pieces/${id}.${ext}`;
      const previousKey = `temp-pieces/${tempPieceId}.${ext}`;
      await this.awsService.copyObject(previousKey, key);
    }

    if (tempPieceId) {
      await this.tempPiecesService.deleteTempPiece(tempPieceId);
    }

    return this.piecesRepository.createPiece(userId, {
      ...data,
      image: `${this.configService.get('CLOUDFRONT_URL')}/${key}`,
      id,
    });
  }

  async getPiece(id: string) {
    const piece = await this.piecesRepository.getPieceWithAuthor(id);

    if (!piece) {
      throw new HttpException('작품을 찾을 수 없습니다', HttpStatus.NOT_FOUND);
    }

    return piece;
  }

  async getMyPieces(userId: string) {
    return this.piecesRepository.getMyPieces(userId);
  }
}
