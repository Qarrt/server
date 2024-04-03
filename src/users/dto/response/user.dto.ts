import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '85075472-3696-43f1-8db4-410887d24339' })
  id: string;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty({
    example:
      'https://image.leemhoon00.com/profile/85075472-3696-43f1-8db4-410887d24339.jpeg',
  })
  image: string | null;
}
