import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtRequest } from 'src/types/request';
import { CreateTempPieceDto, UpdateTempPieceDto } from './dto/request';
import { TempPieceDto } from './dto/response/temp-piece.dto';
import { TempPiecesService } from './temp-pieces.service';

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
  constructor(private readonly tempPiecesService: TempPiecesService) {}

  @ApiOperation({ summary: '작품 임시 저장' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '임시 작품 저장',
    type: CreateTempPieceDto,
  })
  @ApiResponse({
    status: 201,
    description: '임시 작품 저장 성공',
    type: TempPieceDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createTempPiece(
    @Body() createTempPieceDto: CreateTempPieceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: JwtRequest,
  ) {
    return this.tempPiecesService.createTempPiece(req.user.userId, {
      ...createTempPieceDto,
      file,
    });
  }

  @ApiOperation({ summary: '임시 작품 조회' })
  @ApiResponse({
    status: 200,
    description: '임시 작품 조회 성공',
    type: TempPieceDto,
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTempPiece(@Param('id') id: string) {
    return this.tempPiecesService.getTempPiece(id);
  }

  @ApiOperation({ summary: '임시 작품 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '임시 작품 리스트 조회 성공',
    type: [TempPieceDto],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTempPieces(@Req() req: JwtRequest) {
    return this.tempPiecesService.getTempPieces(req.user.userId);
  }

  @ApiOperation({ summary: '임시 작품 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '임시 작품 수정',
    type: UpdateTempPieceDto,
  })
  @ApiResponse({
    status: 201,
    description: '임시 작품 수정 성공',
    type: TempPieceDto,
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateTempPiece(
    @Param('id') id: string,
    @Body() updateTempPieceDto: UpdateTempPieceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tempPiecesService.updateTempPiece(id, {
      ...updateTempPieceDto,
      file,
    });
  }

  @ApiOperation({ summary: '임시 작품 삭제' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTempPiece(@Param('id') id: string) {
    return this.tempPiecesService.deleteTempPiece(id);
  }
}
