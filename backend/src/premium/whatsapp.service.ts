import { Injectable } from '@nestjs/common';

/**
 * Avisos por WhatsApp, con la API de WhatsApp de Twilio (una sola llamada REST, sin librería).
 *
 * Variables:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
 *   TWILIO_WHATSAPP_FROM            el número de WhatsApp Business, p. ej. +34600000000
 *                                   (el sandbox de Twilio usa +14155238886)
 *   TWILIO_WHATSAPP_TEMPLATE_SID    (recomendado) el SID de la plantilla aprobada, HX…
 *
 * OJO: WhatsApp NO deja escribir primero con texto libre. Para avisar a alguien que no ha
 * escrito en las últimas 24 h hace falta una PLANTILLA aprobada por Meta. La plantilla lleva
 * una variable, {{1}}, donde va el mensaje de María: p. ej. «{{1}}». Sin plantilla se manda
 * texto libre, que solo llega dentro de esa ventana de 24 h (o en el sandbox de pruebas).
 * Sin las variables obligatorias no se manda nada y se avisa en el log, como con el correo.
 */
@Injectable()
export class WhatsappService {
  /** Formato internacional: un móvil español de 9 cifras lleva +34. */
  normalizar(telefono: string): string {
    const limpio = telefono.replace(/[\s().-]/g, '');
    if (limpio.startsWith('+')) return limpio;
    if (limpio.startsWith('00')) return `+${limpio.slice(2)}`;
    return /^\d{9}$/.test(limpio) ? `+34${limpio}` : `+${limpio}`;
  }

  get configurado(): boolean {
    return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
  }

  async enviar(telefono: string, texto: string): Promise<boolean> {
    if (!this.configurado) {
      console.warn('[WhatsappService] TWILIO_* / TWILIO_WHATSAPP_FROM no configurado — WhatsApp no enviado.');
      return false;
    }
    const sid = process.env.TWILIO_ACCOUNT_SID!;
    const from = this.normalizar(process.env.TWILIO_WHATSAPP_FROM!);
    const cuerpo = new URLSearchParams({ To: `whatsapp:${this.normalizar(telefono)}`, From: `whatsapp:${from}` });
    const plantilla = process.env.TWILIO_WHATSAPP_TEMPLATE_SID?.trim();
    if (plantilla) {
      cuerpo.set('ContentSid', plantilla);
      cuerpo.set('ContentVariables', JSON.stringify({ 1: texto }));
    } else {
      cuerpo.set('Body', texto);
    }
    try {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: cuerpo,
      });
      if (!res.ok) {
        console.error(`[WhatsappService] Twilio ${res.status}:`, await res.text());
        return false;
      }
      return true;
    } catch (err) {
      console.error('[WhatsappService] Error enviando WhatsApp:', err);
      return false;
    }
  }
}
