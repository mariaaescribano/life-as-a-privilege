import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

  async enviarBienvenidaMetodo(email: string, name: string): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[MailService] EMAIL_USER / EMAIL_PASS no configurados — email de bienvenida no enviado.');
      return;
    }

    const html = `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">Bienvenido al Método</h1>
        <p style="font-size: 17px; line-height: 1.7; opacity: 0.92;">
          Hola ${name},
        </p>
        <p style="font-size: 17px; line-height: 1.7; opacity: 0.92;">
          Gracias por unirte a <strong>Life as a Privilege</strong>. Tu acceso ya está activo
          y puedes empezar el camino cuando quieras.
        </p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${FRONTEND_URL}/home"
             style="display: inline-block; padding: 14px 32px; background: #ffffff; color: #008080;
                    border-radius: 999px; text-decoration: none; font-weight: 700; letter-spacing: 0.06em;">
            Entrar a mi espacio
          </a>
        </p>
        <p style="font-size: 14px; line-height: 1.6; opacity: 0.7; margin-top: 24px;">
          Si el botón no funciona, copia este enlace en tu navegador:<br/>
          ${FRONTEND_URL}/home
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Bienvenido al Método — Life as a Privilege',
        html,
      });
    } catch (err) {
      console.error('[MailService] Error enviando bienvenida del Método:', err);
    }
  }
}
