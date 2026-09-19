import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DiarioSesionService } from './diarioSesion.service';
import type { EntradaInput } from './diarioSesion.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { AdminGuard } from '../auth/admin.guard';

// El diario que la admin escribe para una persona. Dos caras:
//   · /diario/:userId          → lo que lee la persona (solo lo publicado)
//   · /diario/admin/:userId    → lo que escribe la admin (todo, con borradores)
// Las rutas `admin/...` van ANTES que `:userId`, o Nest se tragaría «admin»
// como si fuera un id de usuario.
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

  // ── LA PERSONA ──────────────────────────────────────────────────────────
  @Get(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async listar(@Param('userId') userId: string) {
    return await this.service.listarPublicadas(userId);
  }

  // Se llama al abrir /diario: apaga la marca de «nuevo».
  @Patch(':userId/leidas')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async marcarLeidas(@Param('userId') userId: string) {
    return await this.service.marcarLeidas(userId);
  }
}
