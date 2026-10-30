import { Body, Controller, Delete, ForbiddenException, Get, Headers, HttpCode, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import * as crypto from 'crypto';
import { PremiumService } from './premium.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('premium')
export class PremiumController {
  constructor(private readonly service: PremiumService) {}

  // ── Pago ──
  // Sin sesión a propósito: se paga ANTES de crear la cuenta.
  @Post('checkout')
  async checkout() {
    return await this.service.crearCheckout();
  }

  // Renovar con la cuenta ya creada: el pago queda ligado a ella.
  @Post('renovar')
  @UseGuards(JwtAuthGuard)
  async renovar(@Req() req: any) {
    return await this.service.crearCheckout(req.user.userId);
  }

  @Get('verify')
  async verify(@Query('session_id') sessionId: string) {
    return await this.service.verificar(sessionId);
  }

  @Post('reclamar')
  @UseGuards(JwtAuthGuard)
  async reclamar(@Req() req: any, @Body() body: { session_id?: string }) {
    return await this.service.reclamar(body?.session_id ?? '', req.user.userId);
  }

  @Post('avisos')
  @UseGuards(JwtAuthGuard)
  async avisos(@Req() req: any, @Body() body: { email?: boolean; whatsapp?: boolean; telefono?: string }) {
    return await this.service.guardarAvisos(req.user.userId, body);
  }

  // ── Ver y escuchar ──
  @Get('contenido')
  @UseGuards(JwtAuthGuard)
  async contenido(@Req() req: any, @Query('tipo') tipo: string) {
    if (!(await this.service.tieneAcceso(req.user.userId, req.user.email))) {
      throw new ForbiddenException('Necesitas el acceso premium');
    }
    return await this.service.listar(tipo);
  }

  // ── Admin: publicar un enlace de YouTube ──
  @Post('admin/contenido')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async publicar(@Body() body: { tipo?: string; titulo?: string; video?: string; mensaje?: string }) {
    return await this.service.publicar(body);
  }

  @Get('admin/whatsapp')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listarWhatsapp() {
    return await this.service.listarWhatsapp();
  }

  @Get('admin/contenido')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listarAdmin() {
    return await this.service.listarAdmin();
  }

  @Delete('admin/contenido/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async borrar(@Param('id') id: string) {
    return await this.service.borrar(id);
  }
}

/** Misma llamada diaria externa que las felicitaciones: cabecera `x-cron-secret` = CRON_SECRET. */
@Controller('cron')
export class PremiumCronController {
  constructor(private readonly service: PremiumService) {}

  @Post('premium-renovacion')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async renovacion(@Headers('x-cron-secret') secreto: string) {
    const esperado = process.env.CRON_SECRET;
    const a = Buffer.from(secreto ?? '', 'utf8');
    const b = Buffer.from(esperado ?? '', 'utf8');
    if (!esperado || a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new UnauthorizedException();
    return await this.service.avisarRenovaciones();
  }
}
