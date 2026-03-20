import { Module } from '@nestjs/common';
import { NutricionController } from './nutricion.controller';
import { NutricionService } from './nutricion.service';
import { DatabaseService } from 'src/database.service';

@Module({
  controllers: [NutricionController],
  providers: [NutricionService, DatabaseService],
})
export class NutricionModule {}
