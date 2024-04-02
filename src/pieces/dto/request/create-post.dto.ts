import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePieceDto {
  @ApiProperty({
    required: false,
    nullable: true,
    description: '임시 저장된 이력이 있다면 그 임시 작품의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  tempPieceId?: string;

  @ApiProperty()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @ApiProperty()
  @MinLength(1)
  @MaxLength(30)
  material: string;

  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  year: number;

  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  width: number;

  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  height: number;

  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  exhibited: boolean;

  @ApiProperty()
  @IsString()
  authorComment: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'file',
    required: false,
    description:
      '이미지 파일. image URL이 있다면 필수값은 아니지만 image URL이 없다면 필수값입니다.',
  })
  file?: Express.Multer.File;

  @ApiProperty({
    required: false,
    description:
      '임시 저장된 이력이 있고, 그 때 이미지까지 저장했다면 image URL이 있을텐데 그걸 주시면 됩니다. file이 있을때도 주셔야합니다.',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
