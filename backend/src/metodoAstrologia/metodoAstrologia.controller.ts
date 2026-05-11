import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MetodoAstrologiaService } from './metodoAstrologia.service';
import type { SolicitudCarta } from './metodoAstrologia.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('metodo-astrologia')
export class MetodoAstrologiaController {
  constructor(private readonly service: MetodoAstrologiaService) {}

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
}
