import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// Destinatario de las solicitudes de carta astral (lecturas de /metodo/astrologia).
// Usa NOTIFY_EMAIL (igual que contacto/reservas/suscripción); el hardcode solo
// como último recurso si la variable no estuviera configurada.
const CARTA_ASTRAL_FALLBACK = 'darkcake141@gmail.com';

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

  // Envuelve el HTML en la tarjeta turquesa común a todos los correos.
  private plantilla(titulo: string, cuerpo: string): string {
    return `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">${titulo}</h1>
        ${cuerpo}
      </div>
    `;
  }

  private async enviar(to: string, subject: string, html: string, etiqueta: string): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(`[MailService] EMAIL_USER / EMAIL_PASS no configurados — ${etiqueta} no enviado.`);
      return;
    }
    try {
      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error(`[MailService] Error enviando ${etiqueta}:`, err);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Recuperación de contraseña. El enlace lleva un token de un solo uso que
  // caduca en una hora (ver UserService.crearTokenRecuperacion).
  // ───────────────────────────────────────────────────────────────────────────
  async enviarRecuperacionPassword(email: string, nombre: string, enlace: string): Promise<void> {
    const html = this.plantilla(
      'Recupera tu contraseña',
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Hola <strong>${nombre}</strong>, has pedido restablecer la contraseña de tu cuenta.
        </p>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Pulsa el botón para elegir una nueva. El enlace <strong>caduca en 1 hora</strong> y
          solo se puede usar una vez.
        </p>
        <p style="margin: 28px 0;">
          <a href="${enlace}"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Elegir nueva contraseña
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; opacity: 0.75;">
          Si el botón no funciona, copia esta dirección en tu navegador:<br />
          <span style="word-break: break-all;">${enlace}</span>
        </p>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Si no has pedido tú este cambio, puedes ignorar este correo: tu contraseña
          seguirá siendo la misma.
        </p>
      `,
    );
    await this.enviar(email, 'Recupera tu contraseña — Life as a Privilege', html, 'email de recuperación');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Confirmación de compra de un libro. Lo dispara el webhook de Stripe, así que
  // llega aunque la persona cierre la pestaña nada más pagar.
  // ───────────────────────────────────────────────────────────────────────────
  async enviarLibroComprado(email: string, titulo: string, pdfLink: string): Promise<void> {
    const html = this.plantilla(
      'Tu libro está listo',
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Gracias por tu compra de <strong>${titulo}</strong>. Aquí tienes tu descarga:
        </p>
        <p style="margin: 28px 0;">
          <a href="${pdfLink}"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Descargar el PDF
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; opacity: 0.75;">
          Si el botón no funciona, copia esta dirección en tu navegador:<br />
          <span style="word-break: break-all;">${pdfLink}</span>
        </p>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Guarda este correo: es tu copia del enlace de descarga.
        </p>
      `,
    );
    await this.enviar(email, `Tu libro: ${titulo}`, html, 'email de libro comprado');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Confirmación de que una disciplina de El Recorrido ha quedado desbloqueada.
  // También la dispara el webhook, por el mismo motivo.
  // ───────────────────────────────────────────────────────────────────────────
  async enviarDisciplinaDesbloqueada(email: string, nombre: string, disciplina: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const html = this.plantilla(
      `${disciplina} ya es tuya`,
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Hola <strong>${nombre}</strong>, tu pago se ha confirmado y
          <strong>${disciplina}</strong> ya está abierta en tu Mapa.
        </p>
        <p style="margin: 28px 0;">
          <a href="${frontendUrl}/home"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Entrar en El Mapa
          </a>
        </p>
      `,
    );
    await this.enviar(email, `${disciplina} desbloqueada — Life as a Privilege`, html, 'email de disciplina');
  }

  // Notifica a la creadora cuando un usuario solicita su carta astral.
  // La fecha llega en ISO (YYYY-MM-DD) y en el email se muestra DD-MM-YYYY.
  async enviarSolicitudCarta(
    userEmail: string,
    userName: string,
    datos: { fecha_nacimiento: string; hora_nacimiento: string; pais: string; lugar: string; region: string },
    // true cuando el usuario ya había enviado su solicitud y ahora CORRIGE los datos.
    esCorreccion = false,
  ): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[MailService] EMAIL_USER / EMAIL_PASS no configurados — solicitud de carta no enviada.');
      return;
    }

    // YYYY-MM-DD → DD-MM-YYYY (si no viene en ese formato, se deja tal cual).
    const fechaLegible = /^\d{4}-\d{2}-\d{2}/.test(datos.fecha_nacimiento)
      ? datos.fecha_nacimiento.slice(0, 10).split('-').reverse().join('-')
      : datos.fecha_nacimiento;

    const html = `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">${
          esCorreccion ? 'Datos corregidos de carta astral' : 'Nueva solicitud de carta astral'
        }</h1>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          <strong>${userName}</strong> (${userEmail}) ${
            esCorreccion
              ? 'ha corregido sus datos de nacimiento. Estos son los datos buenos:'
              : 'ha pedido su lectura de carta.'
          }
        </p>
        <div style="margin-top: 20px; padding: 16px 20px; background: rgba(255,255,255,0.12); border-radius: 12px;">
          <p style="margin: 6px 0; font-size: 15px;"><strong>Fecha:</strong> ${fechaLegible}</p>
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

    const to = process.env.NOTIFY_EMAIL || CARTA_ASTRAL_FALLBACK;
    try {
      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to,
        replyTo: userEmail,
        subject: `${esCorreccion ? 'Datos corregidos' : 'Carta Astral'} de ${userEmail}`,
        html,
      });
    } catch (err) {
      console.error('[MailService] Error enviando solicitud de carta:', err);
    }
  }
}
