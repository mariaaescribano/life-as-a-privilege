import { Module } from '@nestjs/common';
import { DiarioSesionController } from './diarioSesion.controller';
import { DiarioSesionService } from './diarioSesion.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [DiarioSesionController],
  providers: [DiarioSesionService, DatabaseService],
})
export class DiarioSesionModule {}
