import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty()
  @IsString()
  type: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    example:
      'https://image.leemhoon00.com/profile/clucnrnwh0000xgk4z8r5aecq.jpeg',
  })
  previousImage?: string;
}
