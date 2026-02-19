import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import type { Respuesta } from 'src/dtos/respuesta.types';
import { RespuestaService } from './respuesta.service';

@Controller('/respuesta')
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Post("/npmn")
  async create(@Body() body: Respuesta) {
    return await this.respuestaService.npmnPostRespuesta(body);
  }

  @Get("/npmn/:pregId/:userId")
  async getRespuestaDePregunta(@Param('pregId') pregId: string, @Param('userId') userId: string) {
    return await this.respuestaService.getRespuestaDePregunta(pregId, userId);
  }

}
