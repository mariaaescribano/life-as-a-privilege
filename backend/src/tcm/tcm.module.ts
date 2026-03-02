import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { TcmController } from './tcm.controller';
import { TcmService } from './tcm.service';

@Module({
  controllers: [TcmController],
  providers: [TcmService, DatabaseService],
})
export class TcmModule {}
