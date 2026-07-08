import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { AstrologiaTextosService } from './astrologiaTextos.service';
import type { AstroTextoInput } from './astrologiaTextos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('astrologia-textos')
export class AstrologiaTextosController {
  constructor(private readonly service: AstrologiaTextosService) {}

  // ── Admin: todas las interpretaciones (para el editor) ──
  // (antes de la ruta con params para que no colisione)
  @Get('todos')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listarTodos() {
    return await this.service.listarTodos();
  }

  // ── Público: un texto concreto (para el popup «saber más») ──
  @Get('item/:cuerpo/:faceta/:valor')
  async getUno(
    @Param('cuerpo') cuerpo: string,
    @Param('faceta') faceta: string,
    @Param('valor') valor: string,
  ) {
    return await this.service.getUno(cuerpo, faceta, valor);
  }

  // ── Admin: guardar una interpretación ──
  @Patch()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardar(@Body() body: AstroTextoInput) {
    return await this.service.guardar(body);
  }

  // ── Admin: importar en bloque (siembra inicial) ──
  @Put('bulk')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardarBloque(@Body() body: { textos: AstroTextoInput[] }) {
    return await this.service.guardarBloque(body?.textos ?? []);
  }
}
