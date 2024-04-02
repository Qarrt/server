import { ApiProperty } from '@nestjs/swagger';

export class PieceDto {
  @ApiProperty({ example: '2c120a38-73ec-4b34-be78-a9c5404ffe4c' })
  id: string;

  @ApiProperty({ example: '모나리자' })
  title: string;

  @ApiProperty({ required: false, nullable: true, example: '캔버스에 유채' })
  material?: string;

  @ApiProperty({ required: false, nullable: true, example: 2024 })
  year?: number;

  @ApiProperty({ required: false, nullable: true, example: 100 })
  width?: number;

  @ApiProperty({ required: false, nullable: true, example: 100 })
  height?: number;

  @ApiProperty({ example: true })
  exhibited: boolean;

  @ApiProperty({ required: false, nullable: true, example: '**작가 한마디**' })
  authorComment?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '`모나리자`를 그려보았습니다.',
  })
  description?: string;

  @ApiProperty({
    example:
      'https://img.leemhoon00.com/temp-pieces/2c120a38-73ec-4b34-be78-a9c5404ffe4c.png',
  })
  image: string;

  @ApiProperty({ example: '2024-04-02T06:15:55.490Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-04-02T06:15:55.490Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'ab120a38-73ec-4b34-be78-a9c5404ffe6d' })
  userId: string;
}
