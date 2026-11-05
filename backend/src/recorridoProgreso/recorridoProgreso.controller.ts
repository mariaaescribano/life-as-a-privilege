import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CONSENTIMIENTO_SALUD, DISCIPLINAS_MAPA_ADMIN, RecorridoProgresoService } from './recorridoProgreso.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

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
    // Desde el camino de María NO: el consentimiento solo lo puede dar la persona.
    if (req.user?.suplantadoPor) {
      throw new ForbiddenException('El consentimiento solo puede darlo la persona titular de la cuenta');
    }
    const fecha = await this.service.darConsentimientoSalud(req.user.userId);
    if (!fecha) throw new BadRequestException('No se ha podido guardar');
    return { fecha };
  }

  // ── Páginas del camino ya vistas (el tick de las cajitas) ────────────────
  // Antes de las rutas con `:disciplina`, para que «vistos» no se tome por una disciplina.
  @Get('vistos')
  @UseGuards(JwtAuthGuard)
  async getVistos(@Req() req: any) {
    return await this.service.getVistos(req.user.userId);
  }

  @Post('visto')
  @UseGuards(JwtAuthGuard)
  async marcarVisto(@Req() req: any, @Body() body: { disciplina?: string; ruta?: string }) {
    // María mirando el camino de una persona no marca nada por ella.
    if (req.user?.suplantadoPor) return { ok: false };
    const disciplina = String(body?.disciplina ?? '');
    const ruta = String(body?.ruta ?? '');
    if (!DISCIPLINAS_MAPA_ADMIN.includes(disciplina)) throw new BadRequestException('disciplina inválida');
    if (!ruta.startsWith('/metodo/') || ruta.length > 300) throw new BadRequestException('ruta inválida');
    await this.service.marcarVisto(req.user.userId, disciplina, ruta.toLowerCase());
    return { ok: true };
  }

  // ── El mapa lo abre la admin ───────────────────────────────────────────────
  // Progreso de UNA usuaria (para el panel) y fijar hasta qué paso llega.
  @Get('admin/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getDeUsuaria(@Param('userId') userId: string) {
    return await this.service.getTodo(userId);
  }

  @Post('admin/:userId/:disciplina')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async fijar(
    @Param('userId') userId: string,
    @Param('disciplina') disciplina: string,
    @Body() body: { paso?: number },
  ) {
    if (!DISCIPLINAS_MAPA_ADMIN.includes(disciplina)) throw new BadRequestException('disciplina inválida');
    const paso = Number(body?.paso);
    if (!Number.isFinite(paso) || paso < 1) throw new BadRequestException('paso inválido');
    const pasoMax = await this.service.fijar(userId, disciplina, paso);
    return { pasoMax };
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
    // El mapa de estas disciplinas solo lo abre la admin: la usuaria no lo sube.
    if (DISCIPLINAS_MAPA_ADMIN.includes(disciplina)) {
      return { pasoMax: await this.service.getPasoMax(req.user.userId, disciplina) };
    }
    const paso = Number(body?.paso);
    if (!Number.isFinite(paso) || paso < 1) {
      throw new BadRequestException('paso inválido');
    }
    const pasoMax = await this.service.avanzar(req.user.userId, disciplina, paso);
    return { pasoMax };
  }
}
