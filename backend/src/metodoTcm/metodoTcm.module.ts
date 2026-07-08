import { Module } from '@nestjs/common';
import { MetodoTcmController } from './metodoTcm.controller';
import { MetodoTcmService } from './metodoTcm.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoTcmController],
  providers: [MetodoTcmService, DatabaseService],
})
export class MetodoTcmModule {}
