import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Piece, TempPiece, Prisma } from '@prisma/client';

@Injectable()
export class PiecesRepository {
  constructor(private prisma: PrismaService) {}
}
