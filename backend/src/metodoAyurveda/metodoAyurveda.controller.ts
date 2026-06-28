import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MetodoAyurvedaService } from './metodoAyurveda.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('metodo-ayurveda')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class MetodoAyurvedaController {
  constructor(private readonly service: MetodoAyurvedaService) {}

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return await this.service.get(userId);
  }

  @Patch(':userId')
  async patch(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.actualizar(userId, body);
  }
}
