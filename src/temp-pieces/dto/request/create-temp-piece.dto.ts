import {
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

export class CreateTempPieceDto {
  @ApiProperty()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  material: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  width: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  height: number;

  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  exhibited: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  authorComment: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ type: 'file', required: false })
  file?: Express.Multer.File;
}
