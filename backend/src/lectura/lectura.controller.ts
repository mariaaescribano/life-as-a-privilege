import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

// Solo la admin: la lista de pedidos de cartas, su estado y el envío del acceso a la cuenta.
@Controller('lectura')
export class LecturaController {
  constructor(private readonly lectura: LecturaService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listar() {
    return await this.lectura.listar();
  }

  @Post('admin/crear')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async crear(@Body() body: Record<string, unknown>) {
    return await this.lectura.crearManual(body ?? {});
  }

  @Post('admin/estado')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async estado(@Body() body: { id?: string; estado?: string }) {
    if (!body?.id || !body?.estado) throw new BadRequestException('id y estado requeridos');
    return await this.lectura.setEstado(body.id, body.estado);
  }

  @Post('admin/acceso')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async acceso(@Body() body: { id?: string }) {
    if (!body?.id) throw new BadRequestException('id requerido');
    return await this.lectura.darAcceso(body.id);
  }
}
