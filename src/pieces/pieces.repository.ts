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

  async getPieceWithAuthor(id: string): Promise<Omit<Piece, 'userId'> | null> {
    return this.prisma.piece.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        material: true,
        year: true,
        width: true,
        height: true,
        exhibited: true,
        authorComment: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getMyPieces(userId: string) {
    return this.prisma.piece.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        material: true,
        year: true,
        width: true,
        height: true,
        exhibited: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPieces() {
    return this.prisma.piece.findMany({
      select: {
        id: true,
        title: true,
        material: true,
        year: true,
        width: true,
        height: true,
        exhibited: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
