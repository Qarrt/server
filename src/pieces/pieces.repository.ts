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

  async getTempPiece(id: string): Promise<TempPiece | null> {
    return this.prisma.tempPiece.findUnique({
      where: {
        id,
      },
    });
  }

  async getTempPieces(userId: string): Promise<TempPiece[]> {
    return this.prisma.tempPiece.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteTempPiece(id: string): Promise<TempPiece> {
    return this.prisma.tempPiece.delete({
      where: {
        id,
      },
    });
  }
}
