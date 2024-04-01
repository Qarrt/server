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

@Controller('temp-pieces')
export class TempPiecesController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageFile'))
  async createTempPiece(
    @Body() createTempPieceDto: CreateTempPieceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: JwtRequest,
  ) {
    console.log(createTempPieceDto);
  }
}
