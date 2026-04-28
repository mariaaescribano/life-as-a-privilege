import { Body, Controller, Get, Post } from '@nestjs/common';
import type { OpinionInput } from 'src/dtos/opinion.types';
import { OpinionService } from './opinion.service';

@Controller('opinion')
export class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}

  @Post('')
  async create(@Body() body: OpinionInput) {
    return await this.opinionService.create(body);
  }

  @Get('')
  async findAprobadas() {
    return await this.opinionService.findAprobadas();
  }
}
