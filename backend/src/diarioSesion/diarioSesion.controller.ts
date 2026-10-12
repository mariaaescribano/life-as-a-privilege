import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DiarioSesionService } from './diarioSesion.service';
import type { EntradaInput } from './diarioSesion.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

// El diario que la admin escribe sobre una persona. SOLO lo ve la admin: la
// persona no tiene ninguna ruta de lectura (ni lo lee ni sabe que existe).
@Controller('diario')
export class DiarioSesionController {
  constructor(private readonly service: DiarioSesionService) {}

  // ── ADMIN ───────────────────────────────────────────────────────────────
  @Get('admin/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listarTodas(@Param('userId') userId: string) {
    return await this.service.listarTodas(userId);
  }

  @Post('admin/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async crear(@Param('userId') userId: string, @Body() body: EntradaInput) {
    return await this.service.crear(userId, body);
  }

  @Patch('admin/:userId/:entradaId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async actualizar(
    @Param('userId') userId: string,
    @Param('entradaId') entradaId: string,
    @Body() body: EntradaInput,
  ) {
    return await this.service.actualizar(userId, entradaId, body);
  }

  @Delete('admin/:userId/:entradaId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async eliminar(@Param('userId') userId: string, @Param('entradaId') entradaId: string) {
    return await this.service.eliminar(userId, entradaId);
  }
}
