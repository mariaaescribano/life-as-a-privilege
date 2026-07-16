import { Module } from '@nestjs/common';
import { MetodoCabalaController } from './metodoCabala.controller';
import { MetodoCabalaService } from './metodoCabala.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoCabalaController],
  providers: [MetodoCabalaService, DatabaseService],
})
export class MetodoCabalaModule {}
