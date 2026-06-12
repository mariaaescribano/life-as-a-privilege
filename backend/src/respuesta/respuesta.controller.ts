import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import type { Respuesta } from 'src/dtos/respuesta.types';
import { RespuestaService } from './respuesta.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('respuesta')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Post("")
  async create(@Body() body: Respuesta) {
    return await this.respuestaService.postRespuesta(body);
  }

  @Get(":pregId/:userId")
  async getRespuestaDePregunta(@Param('pregId') pregId: string, @Param('userId') userId: string) {
    return await this.respuestaService.getRespuestaDePregunta(pregId, userId);
  }
}
