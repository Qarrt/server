import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtRequest } from 'src/types/request';
import { CreateTempPieceDto } from './dto/request/create-temp-piece.dto';
import { PieceDto } from './dto/response/piece.dto';
import { PiecesService } from './pieces.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('temp-pieces')
@Controller('temp-pieces')
export class TempPiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @ApiOperation({ summary: '작품 임시 저장' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '임시 작품 저장',
    type: CreateTempPieceDto,
  })
  @ApiResponse({
    status: 201,
    description: '임시 작품 저장 성공',
    type: PieceDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageFile'))
  async createTempPiece(
    @Body() createTempPieceDto: CreateTempPieceDto,
    @UploadedFile() imageFile: Express.Multer.File,
    @Req() req: JwtRequest,
  ) {
    return this.piecesService.createTempPiece(req.user.userId, {
      ...createTempPieceDto,
      imageFile,
    });
  }
}
