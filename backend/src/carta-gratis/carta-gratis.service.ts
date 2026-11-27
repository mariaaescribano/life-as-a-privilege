import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CartaGratisDto } from './carta-gratis.controller';
import { SubscribeService } from '../subscribe/subscribe.service';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** «1990-03-27» → «27/03/1990». */
const fechaDMA = (iso: string) => iso.split('-').reverse().join('/');

@Injectable()
export class CartaGratisService {
  constructor(private readonly suscriptores: SubscribeService) {}

  /** Manda a María (NOTIFY_EMAIL) la petición de carta gratis con todos los datos. Responder = escribir a la persona. */
  async enviar(dto: CartaGratisDto) {
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (!notifyEmail) throw new InternalServerErrorException('NOTIFY_EMAIL no está configurado');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: (process.env.EMAIL_PASS ?? '').replace(/\s/g, '') },
    });

    const fila = (k: string, v: string) =>
      `<tr><td style="padding:4px 14px 4px 0;color:#555;">${k}</td><td style="padding:4px 0;"><strong>${esc(v)}</strong></td></tr>`;

    try {
      await transporter.sendMail({
        from: `"María Escribano" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: notifyEmail,
        replyTo: dto.email,
        subject: `[Carta gratis] ${dto.nombre}`,
        html: `
          <p>Nueva petición de <strong>carta astral gratis</strong>:</p>
          <table style="border-collapse:collapse;font-size:15px;">
            ${fila('Nombre', dto.nombre)}
            ${fila('Email', dto.email)}
            ${fila('Fecha de nacimiento', fechaDMA(dto.fecha))}
            ${fila('Hora de nacimiento', dto.hora)}
            ${fila('País', dto.pais)}
            ${fila('Región', dto.region)}
            ${fila('Ciudad', dto.ciudad)}
          </table>
          <p style="color:#777;font-size:13px;">Ha dado su consentimiento para tratar estos datos y elaborar su carta. Puedes responder a este correo para escribirle.</p>
        `,
      });
    } catch (err) {
      console.error('Error enviando la petición de carta gratis:', err);
      throw new InternalServerErrorException('No se pudo enviar la petición');
    }

    // Quien pide su carta queda apuntado como SUSCRIPTOR (origen «carta-gratis»), con su nombre. Si ya estaba, no se
    // duplica. Si esto fallara, la petición no se pierde: el correo a María ya ha salido.
    try {
      await this.suscriptores.addEmail(dto.email.trim().toLowerCase(), 'carta-gratis', dto.nombre);
    } catch (err) {
      console.error('[carta-gratis] no se pudo apuntar como suscriptor', dto.email, err);
    }
  }
}
