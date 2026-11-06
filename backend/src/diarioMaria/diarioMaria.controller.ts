import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DiarioMariaService } from './diarioMaria.service';
import type { EntradaMaria } from './diarioMaria.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MariaGuard } from '../auth/maria.guard';

// El DIARIO de María sobre sí misma. SOLO ella: ninguna persona tiene ruta de
// lectura ni de escritura (MariaGuard también vale con una persona abierta).
@Controller('diario-maria')
export class DiarioMariaController {
  constructor(private readonly service: DiarioMariaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, MariaGuard)
  async listar() {
    return await this.service.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard, MariaGuard)
  async crear(@Body() body: EntradaMaria) {
    return await this.service.crear(body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, MariaGuard)
  async eliminar(@Param('id') id: string) {
    return await this.service.eliminar(id);
  }
}
