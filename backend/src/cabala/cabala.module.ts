import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { CabalaController } from './cabala.controller';
import { CabalaService } from './cabala.service';

@Module({
  imports: [],
  controllers: [CabalaController],
  providers: [CabalaService, DatabaseService],
})
export class CabalaModule {}
