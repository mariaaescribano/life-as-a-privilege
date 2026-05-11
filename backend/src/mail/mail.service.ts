import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'dev@savimbo.com';

@Injectable()
export class MailService {
  private getTransporter() {
    const pass = (process.env.EMAIL_PASS ?? '').replace(/\s/g, '');
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass,
      },
    });
  }

  // Notifica a la creadora cuando un usuario solicita su carta astral
  async enviarSolicitudCarta(
    userEmail: string,
    userName: string,
    datos: { fecha_nacimiento: string; hora_nacimiento: string; pais: string; lugar: string; region: string },
  ): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[MailService] EMAIL_USER / EMAIL_PASS no configurados — solicitud de carta no enviada.');
      return;
    }

    const html = `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">Nueva solicitud de carta astral</h1>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          <strong>${userName}</strong> (${userEmail}) ha pedido su lectura de carta.
        </p>
        <div style="margin-top: 20px; padding: 16px 20px; background: rgba(255,255,255,0.12); border-radius: 12px;">
          <p style="margin: 6px 0; font-size: 15px;"><strong>Fecha:</strong> ${datos.fecha_nacimiento}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Hora:</strong> ${datos.hora_nacimiento}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>País:</strong> ${datos.pais}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Lugar:</strong> ${datos.lugar}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Región:</strong> ${datos.region}</p>
        </div>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Cuando tengas la lectura lista, sube el PDF a Drive y pega el enlace de compartir
          en el campo <code>link_carta</code> de la fila de este usuario en
          <code>metodo_astrologia</code>.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: `Carta Astral de ${userEmail}`,
        html,
      });
    } catch (err) {
      console.error('[MailService] Error enviando solicitud de carta:', err);
    }
  }
}
