import { Module } from '@nestjs/common';
import { PiecesController } from './pieces.controller';
import { PiecesService } from './pieces.service';
import { PiecesRepository } from './pieces.repository';
import { AwsModule } from 'src/utils/aws/aws.module';
import { TempPiecesModule } from 'src/temp-pieces/temp-pieces.module';

@Module({
  imports: [AwsModule, TempPiecesModule],
  controllers: [PiecesController],
  providers: [PiecesService, PiecesRepository],
})
export class PiecesModule {}
