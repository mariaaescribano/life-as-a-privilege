import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [AuthModule], 
  controllers: [VideoController],
  providers: [VideoService, DatabaseService],
})
export class VideoModule {}
