import { Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import * as crypto from 'crypto';
import { CumpleService } from './cumple.service';

/**
 * La llamada diaria que lanza las felicitaciones. No hay reloj dentro del
 * servidor a propósito: en Render se duerme y se reinicia en cada despliegue,
 * así que un servicio externo (cron-job.org) llama aquí cada mañana con la
 * cabecera `x-cron-secret` = CRON_SECRET. Esa misma llamada lo despierta.
 */
@Controller('cron')
export class CumpleController {
  constructor(private readonly cumpleService: CumpleService) {}

  @Post('cumpleanos')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async cumpleanos(@Headers('x-cron-secret') secreto: string) {
    const esperado = process.env.CRON_SECRET;
    const a = Buffer.from(secreto ?? '', 'utf8');
    const b = Buffer.from(esperado ?? '', 'utf8');
    if (!esperado || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new UnauthorizedException();
    }
    return await this.cumpleService.felicitarCumpleanosDeHoy();
  }
}
