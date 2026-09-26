import { Module } from '@nestjs/common';
import { ActividadController } from './actividad.controller';
import { ActividadService } from './actividad.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [ActividadController],
  providers: [ActividadService, DatabaseService],
})
export class ActividadModule {}
