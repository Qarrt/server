import { Injectable } from '@nestjs/common';
import { Piece, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PiecesRepository {
  constructor(private prisma: PrismaService) {}

  async createPiece(
    userId: string,
    data: Prisma.PieceCreateWithoutUserInput,
  ): Promise<Piece> {
    return this.prisma.piece.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updatePiece(id: string, data: Prisma.PieceUpdateInput): Promise<Piece> {
    return this.prisma.piece.update({
      where: {
        id,
      },
      data,
    });
  }
}
