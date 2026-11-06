import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MariaGuard } from '../auth/maria.guard';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';

interface CuerpoCorreo {
  asunto?: string;
  titulo?: string;
  texto?: string;
  fondo?: string;
  colorTitulo?: string;
  colorTexto?: string;
  /** true = se manda a María (NOTIFY_EMAIL) en vez de a la persona, para ver cómo llega. */
  prueba?: boolean;
}

// «Resumen de sesión»: el correo que María escribe tras una sesión y manda al email de la cuenta de
// la persona. No se guarda nada en la base de datos: queda en el correo (copia oculta a NOTIFY_EMAIL).
// SOLO María. El HTML lo construye el servidor a partir de datos; del navegador nunca llega HTML.
@Controller('correo-sesion')
@UseGuards(JwtAuthGuard, MariaGuard)
export class CorreoSesionController {
  constructor(
    private readonly db: DatabaseService,
    private readonly mail: MailService,
  ) {}

  /** Los fondos y colores que se pueden elegir (el servidor solo acepta estos). */
  @Get('opciones')
  opciones() {
    return {
      fondos: Object.entries(MailService.FONDOS_SESION).map(([clave, f]) => ({
        clave,
        nombre: f.nombre,
        foto: f.foto ? `/img/correo/${f.foto}.jpg` : null,
        velo: f.velo,
        txt: f.txt,
      })),
      colores: MailService.COLORES_SESION,
    };
  }

  /** A quién le llegaría: el nombre y el email de la cuenta. */
  @Get(':userId/destinatario')
  async destinatario(@Param('userId') userId: string) {
    const { data } = await this.db.getClient().from('user').select('name, email').eq('id', userId).limit(1);
    const u = data?.[0];
    return u ? { success: true, nombre: u.name ?? '', email: u.email ?? '' } : { success: false };
  }

  /** La vista previa: el HTML exacto que se enviaría. */
  @Post('vista')
  vista(@Body() b: CuerpoCorreo) {
    return { html: this.mail.construirResumenSesion({ titulo: b.titulo ?? '', texto: b.texto ?? '', fondo: b.fondo, colorTitulo: b.colorTitulo, colorTexto: b.colorTexto }) };
  }

  @Post(':userId/enviar')
  async enviar(@Param('userId') userId: string, @Body() b: CuerpoCorreo) {
    const asunto = (b.asunto ?? '').trim();
    const titulo = (b.titulo ?? '').trim();
    const texto = (b.texto ?? '').trim();
    if (!asunto) return { success: false, error: 'Falta el asunto' };
    if (!titulo && !texto) return { success: false, error: 'El correo está vacío' };

    const { data } = await this.db.getClient().from('user').select('name, email').eq('id', userId).limit(1);
    const u = data?.[0];
    if (!u?.email) return { success: false, error: 'Esta cuenta no tiene email' };

    const destino = b.prueba ? (process.env.NOTIFY_EMAIL || u.email) : u.email;
    const html = this.mail.construirResumenSesion({ titulo, texto, fondo: b.fondo, colorTitulo: b.colorTitulo, colorTexto: b.colorTexto });
    const ok = await this.mail.enviarResumenSesion(destino, b.prueba ? `[Prueba] ${asunto}` : asunto, html);
    return ok ? { success: true, a: destino } : { success: false, error: 'No se pudo enviar el correo' };
  }
}
