import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from 'src/users/dto/response';

export class PieceDto {
  @ApiProperty({ example: '85075472-3696-43f1-8db4-410887d24339' })
  id: string;

  @ApiProperty({ example: '모나리자' })
  title: string;

  @ApiProperty({ example: '유화' })
  material: string;

  @ApiProperty({ example: 2024 })
  year: number;

  @ApiProperty({ example: 100 })
  width: number;

  @ApiProperty({ example: 100 })
  height: number;

  @ApiProperty({ example: true })
  exhibited: boolean;

  @ApiProperty({ example: '**작가**의 코멘트' })
  authorComment: string;

  @ApiProperty({ example: '작품 설명' })
  description: string;

  @ApiProperty({
    example:
      'https://image.leemhoon00.com/pieces/85075472-3696-43f1-8db4-410887d24339.jpeg',
  })
  image: string;

  @ApiProperty({ example: '2021-08-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-08-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
