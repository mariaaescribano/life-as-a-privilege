import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import type { VideoInput } from './videos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  // ── Público: los vídeos publicados ──
  @Get()
  async listar() {
    return await this.service.listarPublicados();
  }

  // ── Admin: todos (incluidos los ocultos) ──
  // Antes de :id para que no colisione con esa ruta.
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
  async crear(@Body() body: VideoInput) {
    return await this.service.crear(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async actualizar(@Param('id') id: string, @Body() body: VideoInput) {
    return await this.service.actualizar(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async borrar(@Param('id') id: string) {
    return await this.service.borrar(id);
  }
}
