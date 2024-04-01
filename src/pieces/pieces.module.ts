import { Module } from '@nestjs/common';
import { PiecesController } from './pieces.controller';
import { TempPiecesController } from './temp-pieces.controller';
import { PiecesService } from './pieces.service';
import { PiecesRepository } from './pieces.repository';

@Module({
  controllers: [PiecesController, TempPiecesController],
  providers: [PiecesService, PiecesRepository],
})
export class PiecesModule {}
