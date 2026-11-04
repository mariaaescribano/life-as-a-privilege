import { Module } from '@nestjs/common';
import { NotasPaginaController } from './notasPagina.controller';
import { NotasPaginaService } from './notasPagina.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [NotasPaginaController],
  providers: [NotasPaginaService, DatabaseService],
})
export class NotasPaginaModule {}
