import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { AyurvedaController } from './ayurveda.controller';
import { AyurvedaService } from './ayurveda.service';

@Module({
  controllers: [AyurvedaController],
  providers: [AyurvedaService, DatabaseService],
})
export class AyurvedaModule {}
