import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Piece, TempPiece, Prisma } from '@prisma/client';

@Injectable()
export class PiecesRepository {
  constructor(private prisma: PrismaService) {}

  async createTempPiece(
    userId: string,
    data: Prisma.TempPieceCreateWithoutUserInput,
  ): Promise<TempPiece> {
    return this.prisma.tempPiece.create({
      data: {
        ...data,
        userId: userId,
      },
    });
  }

  async updateTempPiece(
    id: string,
    data: Prisma.TempPieceUpdateInput,
  ): Promise<TempPiece> {
    return this.prisma.tempPiece.update({
      where: {
        id,
      },
      data,
    });
  }
}
