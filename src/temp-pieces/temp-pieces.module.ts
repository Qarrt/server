import { Module } from '@nestjs/common';
import { TempPiecesController } from './temp-pieces.controller';
import { TempPiecesService } from './temp-pieces.service';
import { TempPiecesRepository } from './temp-pieces.repository';
import { AwsModule } from 'src/utils/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [TempPiecesController],
  providers: [TempPiecesService, TempPiecesRepository],
  exports: [TempPiecesService],
})
export class TempPiecesModule {}
