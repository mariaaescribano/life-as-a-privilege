import { Body, Controller, Get, Post, Put, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { MariaGuard, esMaria } from '../auth/maria.guard';
import { NotasPaginaService, paginaLimpia } from './notasPagina.service';

// La nota de María en cada página del recorrido. La persona solo lee lo
// PUBLICADO; el borrador (y escribir, publicar y retirar) es solo de María.
@Controller('notas-pagina')
export class NotasPaginaController {
  constructor(private readonly service: NotasPaginaService) {}

  // María recibe la nota entera; la persona, únicamente lo publicado.
  @Get(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async leer(@Param('userId') userId: string, @Query('pagina') pagina: string, @Req() req: any) {
    const p = paginaLimpia(pagina);
    if (esMaria(req)) return { ...(await this.service.completa(userId, p)), esMaria: true };
    return { ...(await this.service.publicadaPara(userId, p)), esMaria: false };
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard, MariaGuard)
  async guardar(@Param('userId') userId: string, @Body() body: { pagina?: string; borrador?: string }) {
    return await this.service.guardarBorrador(userId, paginaLimpia(body?.pagina), body?.borrador);
  }

  @Post(':userId/publicar')
  @UseGuards(JwtAuthGuard, OwnerGuard, MariaGuard)
  async publicar(@Param('userId') userId: string, @Body() body: { pagina?: string }) {
    return await this.service.publicar(userId, paginaLimpia(body?.pagina));
  }

  @Post(':userId/retirar')
  @UseGuards(JwtAuthGuard, OwnerGuard, MariaGuard)
  async retirar(@Param('userId') userId: string, @Body() body: { pagina?: string }) {
    return await this.service.retirar(userId, paginaLimpia(body?.pagina));
  }
}
