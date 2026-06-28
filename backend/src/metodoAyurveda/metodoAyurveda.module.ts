import { Module } from '@nestjs/common';
import { MetodoAyurvedaController } from './metodoAyurveda.controller';
import { MetodoAyurvedaService } from './metodoAyurveda.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoAyurvedaController],
  providers: [MetodoAyurvedaService, DatabaseService],
})
export class MetodoAyurvedaModule {}
