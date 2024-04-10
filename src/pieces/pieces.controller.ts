import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
  Param,
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
import { PieceDto, MyPieceRefDto, PieceRefDto } from './dto/response';
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

  @ApiOperation({ summary: '작품 목록 조회' })
  @ApiResponse({ status: 200, type: [PieceRefDto] })
  @Get()
  async getPieces(): Promise<PieceRefDto[]> {
    return this.piecesService.getPieces();
  }

  @ApiOperation({ summary: '내가 등록한 작품 조회' })
  @ApiResponse({ status: 200, type: [MyPieceRefDto] })
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyPieces(@Req() req: JwtRequest): Promise<MyPieceRefDto[]> {
    return this.piecesService.getMyPieces(req.user.userId);
  }

  @ApiOperation({ summary: '작품 조회' })
  @ApiResponse({ status: 200, type: PieceDto })
  @Get(':id')
  async getPiece(@Param('id') id: string) {
    return this.piecesService.getPiece(id);
  }
}
