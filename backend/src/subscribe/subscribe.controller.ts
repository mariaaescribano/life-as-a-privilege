import { Body, Controller, Get, Post, Query, Header, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SubscribeService } from './subscribe.service';
import { LIMITE_FORMULARIO } from '../rate-limit';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { enlaceBaja } from './baja.util';
import { paginaBaja } from './baja.pagina';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() body: { email: string; origen?: string; nombre?: string; idioma?: string }) {
    const correo = (body.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 254) return { success: false };
    const { enviado } = await this.subscribeService.addEmail(
      correo,
      body.origen,
      typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 120) : undefined,
      body.idioma,
    );
    return { success: true, enviado };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // BAJA — el enlace del pie de los correos. Es público (quien se da de baja no
  // tiene por qué tener cuenta ni sesión): lo que autoriza es la firma `t`.
  //
  // Responde con una página completa, no con JSON: se abre en el navegador
  // desde el correo y la persona tiene que leer que ya está fuera.
  // ───────────────────────────────────────────────────────────────────────────
  @Get('baja')
  @Throttle(LIMITE_FORMULARIO)
  @Header('Content-Type', 'text/html; charset=utf-8')
  async baja(@Query('email') email?: string, @Query('t') token?: string) {
    // Sin correo en el enlace (el pie genérico de un envío a toda la lista):
    // se pide en un formulario en vez de dar la baja por hecha.
    if (!email) return paginaBaja('formulario', '');
    const hecho = await this.subscribeService.darDeBaja(email, token ?? '');
    return paginaBaja(hecho ? 'hecha' : 'error', email);
  }

  /** El formulario de la página de arriba. */
  @Post('baja')
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/html; charset=utf-8')
  async bajaFormulario(@Body() body: { email?: string }) {
    const email = (body?.email ?? '').trim();
    const hecho = await this.subscribeService.darDeBaja(email, '', { sinFirma: true });
    return paginaBaja(hecho ? 'hecha' : 'error', email);
  }

  // La baja que usa la página /baja de la web: responde JSON. Con firma `t` (enlace del correo) la
  // exige; sin ella es el formulario de «escribe tu correo».
  @Post('baja/confirmar')
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  async bajaConfirmar(@Body() body: { email?: string; t?: string }) {
    const email = (body?.email ?? '').trim();
    const token = typeof body?.t === 'string' ? body.t : '';
    const ok = await this.subscribeService.darDeBaja(email, token, { sinFirma: !token });
    return { ok };
  }

  // ── Admin: la lista entera, para /admin/suscriptores ──
  @Get('admin/todos')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listar() {
    const lista = await this.subscribeService.listar();
    // Cada uno con su enlace de baja ya firmado, para poder pegarlo en el correo.
    return lista.map((s) => ({ ...s, baja: enlaceBaja(s.email) }));
  }
}
