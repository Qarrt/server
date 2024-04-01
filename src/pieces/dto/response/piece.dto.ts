import { ApiProperty } from '@nestjs/swagger';

export class PieceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  material?: string;

  @ApiProperty({ required: false, nullable: true })
  year?: number;

  @ApiProperty({ required: false, nullable: true })
  width?: number;

  @ApiProperty({ required: false, nullable: true })
  height?: number;

  @ApiProperty()
  exhibited: boolean;

  @ApiProperty({ required: false, nullable: true })
  authorComment?: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
