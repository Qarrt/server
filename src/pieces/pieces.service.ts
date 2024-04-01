import { Injectable } from '@nestjs/common';
import { PiecesRepository } from './pieces.repository';
import { CreateTempPieceDto } from './dto/request/create-temp-piece.dto';

@Injectable()
export class PiecesService {
  constructor(private readonly piecesRepository: PiecesRepository) {}

  createTempPiece(userId: string, createTempPieceDto: CreateTempPieceDto) {}
}
