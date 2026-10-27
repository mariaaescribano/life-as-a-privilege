// ─────────────────────────────────────────────────────────────────────────────
// SUSCRIPTORES — los correos que deja la gente en el formulario (y los
// voluntarios, que llegan con origen='voluntario').
//
// OJO con la historia: esto se guardaba en backend/data/subscribers.txt. Un
// fichero dentro del servidor NO sirve: el disco de Render se borra en cada
// despliegue y nunca llega al repositorio, así que los correos nuevos se
// perdían. Ahora van a la tabla `suscriptor` de Supabase (backend/sql/suscriptor.sql)
// y se leen desde /admin/suscriptores.
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from '../database.service';
import { enlaceBaja, firmaBajaValida, normalizarEmail } from './baja.util';

const TABLE = 'suscriptor';

// Destinatario por defecto de las notificaciones de nuevos suscriptores
// (se usa si NOTIFY_EMAIL no está configurado en el entorno).
const DEFAULT_NOTIFY_EMAIL = 'mariaa.escribano.arce@gmail.com';

export interface SuscriptorDB {
  id: string;
  email: string;
  origen: string | null;
  created_at: string;
}

@Injectable()
export class SubscribeService {
  constructor(private readonly db: DatabaseService) {}

  async addEmail(email: string, origen?: string, nombre?: string, idioma?: string): Promise<void> {
    // ¿Ya estaba apuntado? Solo a quien llega nuevo se le manda la bienvenida:
    // volver a pulsar el botón no puede llenarle el buzón.
    const { data: previo } = await this.db.getClient().from(TABLE).select(email).eq(email, email).maybeSingle();
    const esNuevo = !previo;

    // upsert por email: si vuelve a apuntarse, no se duplica ni da error.
    const fila: Record<string, unknown> = { email, origen: origen ?? null };
    // Solo se toca `nombre` si llega: volver a apuntarse sin él no borra el que ya había.
    if (nombre) fila.nombre = nombre;
    let { error } = await this.db.getClient()
      .from(TABLE)
      .upsert(fila, { onConflict: 'email' });

    // Hasta que se corra backend/sql/suscriptor-nombre.sql la columna no existe:
    // se guarda el correo igualmente en vez de perderlo.
    if (error && nombre) {
      delete fila.nombre;
      ({ error } = await this.db.getClient().from(TABLE).upsert(fila, { onConflict: 'email' }));
    }

    if (error) {
      // Que no se pierda aunque la tabla falle: queda en el log del servidor.
      console.error('[subscribe] no se pudo guardar el suscriptor', email, error.message);
    }

    this.anadirAlFichero(email);

    await this.sendNotification(email, origen, nombre, esNuevo);
    // La bienvenida solo sale de la portada (la «introducción gratuita»).
    if (esNuevo && !error && origen === 'portada') {
      await this.sendBienvenida(email, nombre, idioma === 'en' ? 'en' : 'es');
    }
  }

  /** Copia en backend/data/subscribers.txt (la BD manda; el fichero es solo copia). */
  private anadirAlFichero(email: string): void {
    const ruta = path.join(process.cwd(), 'data', 'subscribers.txt');
    try {
      if (!fs.existsSync(ruta)) return;
      const contenido = fs.readFileSync(ruta, 'utf-8');
      const ya = contenido.split(/\r?\n/).some((l) => l.trim().toLowerCase() === email.toLowerCase());
      if (ya) return;
      fs.appendFileSync(ruta, (contenido.endsWith('\n') ? '' : '\n') + email + '\n', 'utf-8');
    } catch (err) {
      console.warn('[subscribe.addEmail] no se pudo tocar subscribers.txt:', err);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // BAJA de la lista. La pide la propia persona desde el enlace del correo, así
  // que aquí no hay sesión: lo que autoriza es la firma del enlace (baja.util).
  //
  // Devuelve true tanto si estaba como si no: quien se da de baja dos veces
  // tiene que ver lo mismo la segunda vez, no un error.
  // ───────────────────────────────────────────────────────────────────────────
  async darDeBaja(
    emailCrudo: string,
    token: string,
    /** El formulario de «escribe tu correo» no trae firma: ahí el correo lo
     *  teclea la propia persona y lo peor que puede pasar es que alguien saque
     *  de la lista a otro, que se vuelve a apuntar en dos clics. */
    opciones?: { sinFirma?: boolean },
  ): Promise<boolean> {
    const email = normalizarEmail(emailCrudo ?? '');
    if (!email || !email.includes('@')) return false;
    if (!opciones?.sinFirma && !firmaBajaValida(email, token)) return false;

    const { error } = await this.db.getClient().from(TABLE).delete().eq('email', email);
    if (error) {
      console.error('[subscribe.darDeBaja] no se pudo borrar', email, error.message);
      return false;
    }

    this.borrarDelFichero(email);
    return true;
  }

  /** La lista vieja (backend/data/subscribers.txt). Ya no se usa para nada, pero
   *  mientras siga ahí el correo también sale de ella, para que no reaparezca. */
  private borrarDelFichero(email: string): void {
    const ruta = path.join(process.cwd(), 'data', 'subscribers.txt');
    try {
      if (!fs.existsSync(ruta)) return;
      const lineas = fs.readFileSync(ruta, 'utf-8').split(/\r?\n/);
      const quedan = lineas.filter((l) => l.trim().toLowerCase() !== email);
      if (quedan.length !== lineas.length) fs.writeFileSync(ruta, quedan.join('\n'), 'utf-8');
    } catch (err) {
      console.warn('[subscribe.darDeBaja] no se pudo tocar subscribers.txt:', err);
    }
  }

  /** Todos los suscriptores, del más nuevo al más viejo (panel de admin). */
  async listar(): Promise<SuscriptorDB[]> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[subscribe.listar] error:', error.message);
      return [];
    }
    return (data ?? []) as SuscriptorDB[];
  }

  /** Transporte SMTP común; null si el correo no está configurado. */
  private transporte() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[SubscribeService] EMAIL_USER / EMAIL_PASS no configurados — no se envía correo');
      return null;
    }
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: (process.env.EMAIL_PASS ?? '').replace(/s/g, '') },
    });
  }

  private esc(v: string): string {
    return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** Aviso a María: quién se ha apuntado y cuántos hay ya en la lista. */
  private async sendNotification(email: string, origen?: string, nombre?: string, esNuevo = true): Promise<void> {
    const transporter = this.transporte();
    if (!transporter) return;
    const notifyEmail = process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

    const esVoluntario = origen === 'voluntario';
    const etiqueta = esVoluntario ? 'Nuevo voluntario' : esNuevo ? 'Nuevo suscriptor' : 'Suscriptor que vuelve a apuntarse';

    const { count } = await this.db.getClient().from(TABLE).select('*', { count: 'exact', head: true });
    const total = typeof count === 'number' ? `<p>Ya son <strong>${count}</strong> en la lista.</p>` : '';
    const quien = nombre ? `${this.esc(nombre)} · ` : '';
    const desde = origen ? `<p>Desde: ${this.esc(origen)}</p>` : '';

    try {
      await transporter.sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: notifyEmail,
        subject: etiqueta,
        html: `<p>${etiqueta}: <strong>${quien}${this.esc(email)}</strong></p>${desde}${total}`,
      });
    } catch (err) {
      console.error('Error enviando notificación de suscripción:', err);
    }
  }

  /**
   * Correo a la persona que acaba de dejar sus datos para la introducción gratuita.
   * BORRADOR de texto: lo aprueba María antes de darlo por bueno (ver TEXTOS abajo).
   */
  private async sendBienvenida(email: string, nombre: string | undefined, idioma: 'es' | 'en'): Promise<void> {
    const transporter = this.transporte();
    if (!transporter) return;

    const TEXTOS = {
      es: {
        asunto: 'Tu introducción gratuita',
        hola: nombre ? `Hola, ${this.esc(nombre)}` : 'Hola',
        cuerpo: 'Gracias por apuntarte. Descubre nuevas perspectivas de ti a través de una mirada multidisciplinar.',
        firma: 'María Escribano',
        baja: 'Darme de baja',
      },
      en: {
        asunto: 'Your free introduction',
        hola: nombre ? `Hello, ${this.esc(nombre)}` : 'Hello',
        cuerpo: 'Thank you for signing up. Discover new perspectives of yourself through a multidisciplinary lens.',
        firma: 'María Escribano',
        baja: 'Unsubscribe',
      },
    }[idioma];

    try {
      await transporter.sendMail({
        from: `"María Escribano · Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: TEXTOS.asunto,
        html: `<div style="font-family:Georgia,'EB Garamond',serif;color:#2a2622;font-size:17px;line-height:1.7;max-width:520px">
<p><strong>${TEXTOS.hola}</strong></p>
<p>${TEXTOS.cuerpo}</p>
<p>${TEXTOS.firma}</p>
<p style="font-size:12px;color:#8a8278"><a href="${enlaceBaja(email)}" style="color:#8a8278">${TEXTOS.baja}</a></p>
</div>`,
      });
    } catch (err) {
      console.error('Error enviando la bienvenida:', email, err);
    }
  }
}
