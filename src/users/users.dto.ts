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
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  name: string;
}
