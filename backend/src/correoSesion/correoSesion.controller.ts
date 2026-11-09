import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MariaGuard } from '../auth/maria.guard';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';

interface CuerpoCorreo {
  asunto?: string;
  titulo?: string;
  /** Los bloques de texto, cada uno de su disciplina (vacía = directo sobre el mármol). */
  bloques?: { disciplina?: string; texto?: string }[];
  /** true = se manda a María (NOTIFY_EMAIL) en vez de a la persona, para ver cómo llega. */
  prueba?: boolean;
}

const limpiarBloques = (bs: CuerpoCorreo['bloques']) =>
  (Array.isArray(bs) ? bs : []).slice(0, 40).map((b) => ({
    disciplina: typeof b?.disciplina === 'string' ? b.disciplina : '',
    texto: typeof b?.texto === 'string' ? b.texto : '',
  }));

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

  /** Las disciplinas que se pueden elegir para un bloque (el servidor solo acepta estas). */
  @Get('opciones')
  opciones() {
    return {
      disciplinas: Object.entries(MailService.DISCIPLINAS_SESION).map(([clave, d]) => ({
        clave,
        nombre: d.nombre,
        foto: `/img/correo/${d.foto}.jpg`,
        velo: d.velo,
        txt: d.txt,
      })),
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
    return { html: this.mail.construirResumenSesion({ titulo: b.titulo ?? '', bloques: limpiarBloques(b.bloques) }) };
  }

  @Post(':userId/enviar')
  async enviar(@Param('userId') userId: string, @Body() b: CuerpoCorreo) {
    const asunto = (b.asunto ?? '').trim();
    const titulo = (b.titulo ?? '').trim();
    const bloques = limpiarBloques(b.bloques);
    if (!asunto) return { success: false, error: 'Falta el asunto' };
    if (!titulo && !bloques.some((x) => x.texto.trim())) return { success: false, error: 'El correo está vacío' };

    const { data } = await this.db.getClient().from('user').select('name, email').eq('id', userId).limit(1);
    const u = data?.[0];
    if (!u?.email) return { success: false, error: 'Esta cuenta no tiene email' };

    const destino = b.prueba ? (process.env.NOTIFY_EMAIL || u.email) : u.email;
    const html = this.mail.construirResumenSesion({ titulo, bloques });
    const ok = await this.mail.enviarResumenSesion(destino, b.prueba ? `[Prueba] ${asunto}` : asunto, html);
    return ok ? { success: true, a: destino } : { success: false, error: 'No se pudo enviar el correo' };
  }
}
