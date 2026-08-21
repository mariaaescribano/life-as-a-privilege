import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, DatabaseService],
})
export class VideosModule {}
