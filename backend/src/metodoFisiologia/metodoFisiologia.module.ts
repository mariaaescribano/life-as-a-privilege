import { Module } from '@nestjs/common';
import { MetodoFisiologiaController } from './metodoFisiologia.controller';
import { MetodoFisiologiaService } from './metodoFisiologia.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoFisiologiaController],
  providers: [MetodoFisiologiaService, DatabaseService],
})
export class MetodoFisiologiaModule {}
