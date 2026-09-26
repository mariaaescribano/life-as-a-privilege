import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import type { ActividadInput } from './actividad.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

// Qué recursos gratuitos abre cada persona con cuenta (tabla actividad_recurso).
@Controller('actividad')
export class ActividadController {
  constructor(private readonly service: ActividadService) {}

  @Get('admin/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deUsuario(@Param('userId') userId: string) {
    return await this.service.deUsuario(userId);
  }

  // El front lo llama sin esperar respuesta: nunca debe molestar a quien navega.
  @Post()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async registrar(@Req() req: any, @Body() body: ActividadInput) {
    await this.service.registrar(req.user.userId, body);
  }
}
