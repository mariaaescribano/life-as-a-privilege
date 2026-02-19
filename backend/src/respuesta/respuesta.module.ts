import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { RespuestaController } from './respuesta.controller';
import { RespuestaService } from './respuesta.service';

@Module({
  imports: [], 
  controllers: [RespuestaController],
  providers: [RespuestaService, DatabaseService],
})

export class RespuestaModule {}
