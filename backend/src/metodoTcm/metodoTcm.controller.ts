import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MetodoTcmService } from './metodoTcm.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('metodo-tcm')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class MetodoTcmController {
  constructor(private readonly service: MetodoTcmService) {}

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return await this.service.get(userId);
  }

  @Patch(':userId')
  async patch(@Param('userId') userId: string, @Body() body: Record<string, any>) {
    return await this.service.actualizar(userId, body);
  }
}
