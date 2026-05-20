import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './contact.controller';

@Injectable()
export class ContactService {
  async sendContactEmail(dto: ContactDto) {
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

    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (!notifyEmail) {
      throw new InternalServerErrorException('NOTIFY_EMAIL no está configurado');
    }

    try {
      await transporter.sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: notifyEmail,
        replyTo: dto.email,
        subject: `[Contacto web] ${dto.titulo}`,
        html: `
          <p><strong>Nombre:</strong> ${dto.nombre}</p>
          <p><strong>Email:</strong> ${dto.email}</p>
          <p><strong>Asunto:</strong> ${dto.titulo}</p>
          <hr>
          <p>${dto.mensaje.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (err) {
      console.error('Error enviando email:', err);
      throw new InternalServerErrorException('No se pudo enviar el email');
    }
  }
}
