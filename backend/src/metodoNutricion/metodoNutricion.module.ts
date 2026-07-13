import { Module } from '@nestjs/common';
import { MetodoNutricionController } from './metodoNutricion.controller';
import { MetodoNutricionService } from './metodoNutricion.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [MetodoNutricionController],
  providers: [MetodoNutricionService, DatabaseService],
})
export class MetodoNutricionModule {}
