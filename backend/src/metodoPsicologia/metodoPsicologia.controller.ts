import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
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

  // ── Resultado del test DES-II (tabla `psicologia_des`) ──
  // Las respuestas van en el blob `data` (el PATCH de arriba); esto es el
  // resultado. Los guards de la clase (JWT + Owner) valen también aquí: solo se
  // puede escribir el resultado del propio :userId.

  @Put(':userId/des')
  async putDes(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.guardarDes(userId, body);
  }

  @Get(':userId/des')
  async getDes(@Param('userId') userId: string) {
    return await this.service.getDes(userId);
  }
}
