import {
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateTempPieceDto {
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  material: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  year: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  width: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  height: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  exhibited: boolean;

  @IsOptional()
  authorComment: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;
}
