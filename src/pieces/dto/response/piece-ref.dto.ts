import { ApiProperty } from '@nestjs/swagger';
import { CommonPiece } from './piece.dto';
import { UserDto } from 'src/users/dto/response';

export class PieceRefDto extends CommonPiece {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
