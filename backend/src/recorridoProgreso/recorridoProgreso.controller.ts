import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CONSENTIMIENTO_SALUD, RecorridoProgresoService } from './recorridoProgreso.service';
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

  // ── Consentimiento explícito para los datos de salud (art. 9 RGPD) ────────
  // Van ANTES de las rutas con `:disciplina` para que Nest no confunda
  // «consentimiento/salud» con «<disciplina>/avanzar».
  @Get('consentimiento/salud')
  @UseGuards(JwtAuthGuard)
  async getConsentimiento(@Req() req: any) {
    return { fecha: await this.service.getConsentimientoSalud(req.user.userId) };
  }

  @Post('consentimiento/salud')
  @UseGuards(JwtAuthGuard)
  async darConsentimiento(@Req() req: any) {
    // Desde «entrar como» NO: el consentimiento solo lo puede dar la persona.
    if (req.user?.suplantadoPor) {
      throw new ForbiddenException('El consentimiento solo puede darlo la persona titular de la cuenta');
    }
    const fecha = await this.service.darConsentimientoSalud(req.user.userId);
    if (!fecha) throw new BadRequestException('No se ha podido guardar');
    return { fecha };
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
    // La fila del consentimiento solo se escribe por su propia ruta.
    if (disciplina === CONSENTIMIENTO_SALUD) throw new BadRequestException('disciplina inválida');
    const paso = Number(body?.paso);
    if (!Number.isFinite(paso) || paso < 1) {
      throw new BadRequestException('paso inválido');
    }
    const pasoMax = await this.service.avanzar(req.user.userId, disciplina, paso);
    return { pasoMax };
  }
}
