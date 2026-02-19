import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [AuthModule], 
  controllers: [UploadController],
  providers: [UploadService, DatabaseService],
})
export class UploadModule {}
