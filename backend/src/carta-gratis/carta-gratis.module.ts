import { Module } from '@nestjs/common';
import { CartaGratisController } from './carta-gratis.controller';
import { CartaGratisService } from './carta-gratis.service';
import { SubscribeService } from '../subscribe/subscribe.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [CartaGratisController],
  providers: [CartaGratisService, SubscribeService, DatabaseService],
})
export class CartaGratisModule {}
