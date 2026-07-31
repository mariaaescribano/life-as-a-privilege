import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AstrologiaTextosService } from './astrologiaTextos.service';
import type { ArquetiposOverrides } from './astrologiaTextos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('astrologia-arquetipos')
export class AstrologiaTextosController {
  constructor(private readonly service: AstrologiaTextosService) {}

  /**
   * Los overrides guardados. Sin guard a propósito: son los textos del propio
   * producto, que ya viajan dentro del bundle del front, y el recorrido tiene
   * que poder pintarlos sin que un token caducado le deje la página en blanco.
   * `overrides: null` = no hay nada guardado → el front usa los del proyecto.
   */
  @Get()
  async leer() {
    return { overrides: await this.service.leerOverrides() };
  }

  // ── Admin: guarda el conjunto completo (BD + archivo del proyecto en local) ──
  @Put()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardar(@Body() body: { overrides: ArquetiposOverrides }) {
    return await this.service.guardarOverrides(body?.overrides);
  }
}
