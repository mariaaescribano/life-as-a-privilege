import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AstrologiaTextosService } from './astrologiaTextos.service';
import type { ArquetiposOverrides } from './astrologiaTextos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('astrologia-arquetipos')
export class AstrologiaTextosController {
  constructor(private readonly service: AstrologiaTextosService) {}

  /**
   * Los textos PÚBLICOS: lo que ven los usuarios en el recorrido. Sin guard a
   * propósito: son los textos del propio producto y el recorrido tiene que poder
   * pintarlos sin que un token caducado le deje la página en blanco.
   * `overrides: null` = nada escrito todavía → el front usa los textos originales.
   */
  @Get()
  async leer() {
    return { overrides: await this.service.leerOverrides('publico') };
  }

  // ── Admin: los textos PRIVADOS (lo escrito por María). Los usuarios nunca los ven. ──
  @Get('privado')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async leerPrivado() {
    return { overrides: await this.service.leerOverrides('privado') };
  }

  // ── Admin: guarda el conjunto completo, privado o público ──
  @Put('privado')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardarPrivado(@Body() body: { overrides: ArquetiposOverrides }) {
    return await this.service.guardarOverrides(body?.overrides, 'privado');
  }

  @Put('publico')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardarPublico(@Body() body: { overrides: ArquetiposOverrides }) {
    return await this.service.guardarOverrides(body?.overrides, 'publico');
  }
}
