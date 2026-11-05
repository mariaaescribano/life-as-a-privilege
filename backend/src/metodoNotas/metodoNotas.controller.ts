import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MetodoNotasService } from './metodoNotas.service';
import type { NuevaNota } from './metodoNotas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { ConsentimientoSaludGuard } from '../auth/consentimiento-salud.guard';
import { esMaria } from '../auth/maria.guard';

@Controller('notas')
export class MetodoNotasController {
  constructor(private readonly service: MetodoNotasService) {}

  // Lista de notas del usuario (más recientes primero)
  @Get(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async listar(@Param('userId') userId: string) {
    return await this.service.listar(userId);
  }

  // Crear una nota nueva. «Notas» es un bloc compartido: lo escriben la persona y
  // María, y cada nota recuerda quién la escribió.
  @Post(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard, ConsentimientoSaludGuard)
  async crear(@Param('userId') userId: string, @Body() body: NuevaNota, @Req() req: any) {
    return await this.service.crear(userId, body, esMaria(req) ? 'maria' : null);
  }

  // Borrar una nota: la persona las suyas; María, cualquiera.
  @Delete(':userId/:notaId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async eliminar(@Param('userId') userId: string, @Param('notaId') notaId: string, @Req() req: any) {
    return await this.service.eliminar(userId, notaId, esMaria(req));
  }
}
