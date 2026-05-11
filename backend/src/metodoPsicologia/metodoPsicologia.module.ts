import { Module } from '@nestjs/common';
import { MetodoPsicologiaController } from './metodoPsicologia.controller';
import { MetodoPsicologiaService } from './metodoPsicologia.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoPsicologiaController],
  providers: [MetodoPsicologiaService, DatabaseService],
})
export class MetodoPsicologiaModule {}
