import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { OpinionController } from './opinion.controller';
import { OpinionService } from './opinion.service';

@Module({
  imports: [],
  controllers: [OpinionController],
  providers: [OpinionService, DatabaseService],
})
export class OpinionModule {}
