import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MetodoNotasService } from './metodoNotas.service';
import type { NuevaNota } from './metodoNotas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('notas')
export class MetodoNotasController {
  constructor(private readonly service: MetodoNotasService) {}

  // Lista de notas del usuario (más recientes primero)
  @Get(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async listar(@Param('userId') userId: string) {
    return await this.service.listar(userId);
  }

  // Crear una nota nueva
  @Post(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async crear(@Param('userId') userId: string, @Body() body: NuevaNota) {
    return await this.service.crear(userId, body);
  }

  // Borrar una nota propia
  @Delete(':userId/:notaId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async eliminar(@Param('userId') userId: string, @Param('notaId') notaId: string) {
    return await this.service.eliminar(userId, notaId);
  }
}
