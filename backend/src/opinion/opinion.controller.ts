import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LIMITE_FORMULARIO } from '../rate-limit';
import type { OpinionInput } from 'src/dtos/opinion.types';
import { OpinionService } from './opinion.service';

@Controller('opinion')
export class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}

  @Post('')
  @Throttle(LIMITE_FORMULARIO)
  async create(@Body() body: OpinionInput) {
    return await this.opinionService.create(body);
  }

  @Get('')
  async findAprobadas() {
    return await this.opinionService.findAprobadas();
  }
}
