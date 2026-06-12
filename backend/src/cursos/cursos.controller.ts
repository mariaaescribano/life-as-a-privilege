import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CursosService } from './cursos.service';
import type { CursoInput } from './cursos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('cursos')
export class CursosController {
  constructor(private readonly service: CursosService) {}

  // ── Público: cursos publicados (para la web) ──
  @Get()
  async listar() {
    return await this.service.listarPublicados();
  }

  // ── Admin: todos los cursos (incluidos los no publicados) ──
  // (antes de :id para que no colisione con esa ruta)
  @Get('admin/todos')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listarTodos() {
    return await this.service.listarTodos();
  }

  @Get(':id')
  async getUno(@Param('id') id: string) {
    return await this.service.getUno(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async crear(@Body() body: CursoInput) {
    return await this.service.crear(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async actualizar(@Param('id') id: string, @Body() body: CursoInput) {
    return await this.service.actualizar(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async borrar(@Param('id') id: string) {
    return await this.service.borrar(id);
  }
}
