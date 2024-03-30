import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type ProviderInfo = {
  provider: string;
  providerId: string;
};

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class ReturnUserInfoDto {
  @ApiProperty({ example: 'clucnrnwh0000xgk4z8r5aecq' })
  id: string;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty({
    example:
      'https://image.leemhoon00.com/profile/clucnrnwh0000xgk4z8r5aecq.jpeg',
  })
  image: string | null;
}

export class UploadImageDto {
  @ApiProperty()
  type: string;

  @ApiProperty({
    required: false,
    example:
      'https://image.leemhoon00.com/profile/clucnrnwh0000xgk4z8r5aecq.jpeg',
  })
  previousImage?: string;
}
