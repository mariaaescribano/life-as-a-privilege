import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NutricionService } from './nutricion.service';
import type { NutricionData } from './nutricion.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { ConsentimientoSaludGuard } from '../auth/consentimiento-salud.guard';

@Controller('nutricion')
@UseGuards(JwtAuthGuard, OwnerGuard, ConsentimientoSaludGuard)
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
