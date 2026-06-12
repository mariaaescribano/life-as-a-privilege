import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MetodoPsicologiaService } from './metodoPsicologia.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('metodo-psicologia')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class MetodoPsicologiaController {
  constructor(private readonly service: MetodoPsicologiaService) {}

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return await this.service.get(userId);
  }

  @Patch(':userId')
  async patch(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.actualizar(userId, body);
  }
}
