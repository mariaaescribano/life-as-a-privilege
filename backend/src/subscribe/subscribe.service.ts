import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import * as nodemailer from 'nodemailer';

const FILE_PATH = join(__dirname, '..', '..', 'data', 'subscribers.txt');
const NOTIFY_EMAIL = 'mariaescribanoarce3@gmail.com';

@Injectable()
export class SubscribeService {
  async addEmail(email: string): Promise<void> {
    await fs.mkdir(dirname(FILE_PATH), { recursive: true });
    await fs.appendFile(FILE_PATH, `${email}\n`, 'utf-8');
    await this.sendNotification(email);
  }

  private async sendNotification(email: string): Promise<void> {
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

    try {
      await transporter.sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to: NOTIFY_EMAIL,
        subject: 'Nuevo suscriptor',
        html: `<p>Nuevo suscriptor: <strong>${email}</strong></p>`,
      });
    } catch (err) {
      console.error('Error enviando notificación de suscripción:', err);
    }
  }
}
