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
import { firmaBajaValida, normalizarEmail } from './baja.util';

const TABLE = 'suscriptor';

// Destinatario por defecto de las notificaciones de nuevos suscriptores
// (se usa si NOTIFY_EMAIL no está configurado en el entorno).
const DEFAULT_NOTIFY_EMAIL = 'darkcake141@gmail.com';

export interface SuscriptorDB {
  id: string;
  email: string;
  origen: string | null;
  created_at: string;
}

@Injectable()
export class SubscribeService {
  constructor(private readonly db: DatabaseService) {}

  async addEmail(email: string, origen?: string): Promise<void> {
    // upsert por email: si vuelve a apuntarse, no se duplica ni da error.
    const { error } = await this.db.getClient()
      .from(TABLE)
      .upsert({ email, origen: origen ?? null }, { onConflict: 'email' });

    if (error) {
      // Que no se pierda aunque la tabla falle: queda en el log del servidor.
      console.error('[subscribe] no se pudo guardar el suscriptor', email, error.message);
    }

    await this.sendNotification(email, origen);
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

  private async sendNotification(email: string, origen?: string): Promise<void> {
    const pass = (process.env.EMAIL_PASS ?? '').replace(/\s/g, '');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass,
      },
    });

    const notifyEmail = process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[SubscribeService] EMAIL_USER / EMAIL_PASS no configurados — no se envía notificación');
      return;
    }

    const esVoluntario = origen === 'voluntario';
    const subject = esVoluntario ? 'Nuevo voluntario' : 'Nuevo suscriptor';
    const etiqueta = esVoluntario ? 'Nuevo voluntario' : 'Nuevo suscriptor';

    try {
      await transporter.sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: notifyEmail,
        subject,
        html: `<p>${etiqueta}: <strong>${email}</strong></p>`,
      });
    } catch (err) {
      console.error('Error enviando notificación de suscripción:', err);
    }
  }
}
