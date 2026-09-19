import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RecorridoProgresoService } from './recorridoProgreso.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('recorrido-progreso')
export class RecorridoProgresoController {
  constructor(private readonly service: RecorridoProgresoService) {}

  // Sin parámetro: el progreso de TODAS las disciplinas. Va antes que
  // `@Get(':disciplina')` por claridad; Nest ya los distingue por la forma de
  // la ruta.
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTodo(@Req() req: any) {
    return await this.service.getTodo(req.user.userId);
  }

  @Get(':disciplina')
  @UseGuards(JwtAuthGuard)
  async get(@Req() req: any, @Param('disciplina') disciplina: string) {
    const pasoMax = await this.service.getPasoMax(req.user.userId, disciplina);
    return { pasoMax };
  }

  @Post(':disciplina/avanzar')
  @UseGuards(JwtAuthGuard)
  async avanzar(
    @Req() req: any,
    @Param('disciplina') disciplina: string,
    @Body() body: { paso?: number },
  ) {
    const paso = Number(body?.paso);
    if (!Number.isFinite(paso) || paso < 1) {
      throw new BadRequestException('paso inválido');
    }
    const pasoMax = await this.service.avanzar(req.user.userId, disciplina, paso);
    return { pasoMax };
  }
}
