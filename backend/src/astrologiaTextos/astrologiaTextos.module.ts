import { Module } from '@nestjs/common';
import { AstrologiaTextosController } from './astrologiaTextos.controller';
import { AstrologiaTextosService } from './astrologiaTextos.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [AstrologiaTextosController],
  providers: [AstrologiaTextosService, DatabaseService],
})
export class AstrologiaTextosModule {}
