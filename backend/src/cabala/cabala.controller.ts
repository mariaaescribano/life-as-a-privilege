import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import type { Respuesta } from 'src/dtos/respuesta.types';
import { CabalaService } from './cabala.service';

@Controller('cabala')
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
