import { Module } from '@nestjs/common';
import { EstudioController } from './estudio.controller';
import { EstudioService } from './estudio.service';
import { CartaNatalService } from '../metodoAstrologia/cartaNatal.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [EstudioController],
  providers: [EstudioService, CartaNatalService, DatabaseService],
})
export class EstudioModule {}
