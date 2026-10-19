import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { ConsentimientoSaludGuard } from '../auth/consentimiento-salud.guard';
import type { Respuesta } from 'src/dtos/respuesta.types';
import { CabalaService } from './cabala.service';

// Antes estaba abierto a cualquiera (leer y escribir respuestas de otra persona).
@Controller('cabala')
@UseGuards(JwtAuthGuard, OwnerGuard, ConsentimientoSaludGuard)
export class CabalaController {
  constructor(private readonly cabalaService: CabalaService) {}

  @Post('')
  async create(@Body() body: Respuesta) {
    return await this.cabalaService.postRespuesta(body);
  }

  @Get(':pregId/:userId')
  async getRespuestaDePregunta(@Param('pregId') pregId: string, @Param('userId') userId: string) {
    return await this.cabalaService.getRespuestaDePregunta(pregId, userId);
  }
}
