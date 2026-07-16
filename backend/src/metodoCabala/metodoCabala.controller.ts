import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MetodoCabalaService } from './metodoCabala.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('metodo-cabala')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class MetodoCabalaController {
  constructor(private readonly service: MetodoCabalaService) {}

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return await this.service.get(userId);
  }

  @Patch(':userId')
  async patch(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.actualizar(userId, body);
  }
}
