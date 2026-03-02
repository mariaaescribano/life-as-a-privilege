import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { FitoterapiaController } from './fitoterapia.controller';
import { FitoterapiaService } from './fitoterapia.service';

@Module({
  controllers: [FitoterapiaController],
  providers: [FitoterapiaService, DatabaseService],
})
export class FitoterapiaModule {}
