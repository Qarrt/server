import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
} from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreatePieceDto } from './dto/request';
import { JwtRequest } from 'src/types/request';

@ApiTags('pieces')
@Controller('pieces')
export class PiecesController {
  constructor(private piecesService: PiecesService) {}

  @ApiOperation({ summary: '작품 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePieceDto })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPiece(
    @Body() createPieceDto: CreatePieceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: JwtRequest,
  ) {
    return this.piecesService.createPiece(req.user.userId, {
      ...createPieceDto,
      file,
    });
  }
}
