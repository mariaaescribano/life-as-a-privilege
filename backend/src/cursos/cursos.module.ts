import { Module } from '@nestjs/common';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [CursosController],
  providers: [CursosService, DatabaseService],
})
export class CursosModule {}
