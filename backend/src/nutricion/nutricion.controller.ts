import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NutricionService } from './nutricion.service';
import type { NutricionData } from './nutricion.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('nutricion')
@UseGuards(JwtAuthGuard, OwnerGuard)
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
