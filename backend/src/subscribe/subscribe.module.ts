import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService, DatabaseService],
})
export class SubscribeModule {}
