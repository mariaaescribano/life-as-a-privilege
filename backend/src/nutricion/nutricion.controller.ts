import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NutricionService } from './nutricion.service';
import type { NutricionData } from './nutricion.service';

@Controller('nutricion')
export class NutricionController {
  constructor(private readonly nutricionService: NutricionService) {}

  @Post()
  async save(@Body() body: NutricionData) {
    return await this.nutricionService.save(body);
  }

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return await this.nutricionService.get(userId);
  }
}
