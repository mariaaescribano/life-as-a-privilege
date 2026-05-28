import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MetodoAstrologiaService } from './metodoAstrologia.service';
import type { SolicitudCarta } from './metodoAstrologia.service';
import type { CuerpoKey } from './cartaNatal.types';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('metodo-astrologia')
export class MetodoAstrologiaController {
  constructor(private readonly service: MetodoAstrologiaService) {}

  // JSON de la carta natal calculada para el componente 3D (debe ir antes de :userId)
  @Get('carta-natal/:userId')
  @UseGuards(JwtAuthGuard)
  async getCartaNatal(@Param('userId') userId: string) {
    return await this.service.getCartaNatal(userId);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async get(@Param('userId') userId: string) {
    return await this.service.getMetodoAstrologia(userId);
  }

  // Actualiza campos individuales: aviso_visto, data (planetas elegidos), link_carta…
  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async patch(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.actualizar(userId, body);
  }

  // Solicitud de carta astral + email a la creadora
  @Post('solicitud/:userId')
  @UseGuards(JwtAuthGuard)
  async solicitar(@Param('userId') userId: string, @Body() body: SolicitudCarta) {
    return await this.service.solicitarCarta(userId, body);
  }

  // Ajuste manual de Quirón / nodos en el JSON cacheado
  @Patch('carta-natal/:userId/cuerpo')
  @UseGuards(JwtAuthGuard)
  async setCuerpoManual(
    @Param('userId') userId: string,
    @Body() body: { planeta: CuerpoKey; grado: number },
  ) {
    return await this.service.setCuerpoManual(userId, body.planeta, body.grado);
  }

  // Fuerza recálculo de la carta natal a partir de los datos guardados
  @Post('carta-natal/:userId/recalcular')
  @UseGuards(JwtAuthGuard)
  async recalcular(@Param('userId') userId: string) {
    return await this.service.recalcular(userId);
  }
}
