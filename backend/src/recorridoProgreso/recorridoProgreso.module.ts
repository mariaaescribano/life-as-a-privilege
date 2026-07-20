import { Module } from '@nestjs/common';
import { RecorridoProgresoController } from './recorridoProgreso.controller';
import { RecorridoProgresoService } from './recorridoProgreso.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [RecorridoProgresoController],
  providers: [RecorridoProgresoService, DatabaseService],
})
export class RecorridoProgresoModule {}
