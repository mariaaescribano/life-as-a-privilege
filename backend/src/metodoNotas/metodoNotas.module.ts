import { Module } from '@nestjs/common';
import { MetodoNotasController } from './metodoNotas.controller';
import { MetodoNotasService } from './metodoNotas.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoNotasController],
  providers: [MetodoNotasService, DatabaseService],
})
export class MetodoNotasModule {}
