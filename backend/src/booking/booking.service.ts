import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from 'src/database.service';
import { BookingDto } from './booking.controller';


@Injectable()
export class BookingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTaken(): Promise<{ fecha: string; slot: string }[]> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await this.databaseService.getClient()
      .from('bookings')
      .select('fecha, slot')
      .gte('fecha', today);
    if (error) {
      console.error('Error en BookingService.getTaken:', error);
      return [];
    }
    return data ?? [];
  }

  async create(dto: BookingDto): Promise<'ok' | 'duplicate' | 'error'> {
    const db = this.databaseService.getClient();

    const { error } = await db.from('bookings').insert({
      nombre: dto.nombre.trim(),
      email: dto.email.trim(),
      fecha: dto.fecha,
      slot: dto.slot,
      tema: dto.tema?.trim() || null,
    });

    if (error) {
      // 23505 = unique_violation en PostgreSQL
      if (error.code === '23505') return 'duplicate';
      console.error('Error insertando booking:', error);
      return 'error';
    }

    // Envío de email (no bloqueante: si falla, la reserva ya está guardada)
    this.sendNotification(dto).catch((err) => {
      console.error('Error enviando email de reserva:', err);
    });

    return 'ok';
  }

  private async sendNotification(dto: BookingDto): Promise<void> {
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
      console.warn('[BookingService] NOTIFY_EMAIL no configurado — no se envía notificación');
      return;
    }

    const temaHtml = dto.tema?.trim()
      ? `<p><strong>Tema a tratar:</strong><br>${dto.tema.replace(/\n/g, '<br>')}</p>`
      : '';

    await transporter.sendMail({
      from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
      to: notifyEmail,
      replyTo: dto.email,
      subject: `Nueva reserva — ${dto.fecha} ${dto.slot}`,
      html: `
        <h2>Nueva llamada agendada</h2>
        <p><strong>Fecha:</strong> ${dto.fecha} a las ${dto.slot} (horario España)</p>
        <p><strong>Nombre:</strong> ${dto.nombre}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        ${temaHtml}
      `,
    });
  }
}
