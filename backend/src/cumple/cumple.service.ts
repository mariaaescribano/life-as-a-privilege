import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { crearTokenCumple } from '../auth/cumple.util';

/**
 * Días hacia atrás que se miran en cada pasada. El cron corre una vez al día,
 * pero si un día falla (Render caído, el servicio externo sin llamar) no se
 * pierde el cumpleaños: al día siguiente se recupera. `cumple_enviado_anio`
 * evita que salga dos veces.
 */
const DIAS_DE_MARGEN = 2;

/** Hoy en España como [año, mes, día]. */
function hoyEnEspana(): [number, number, number] {
  const txt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
  const [a, m, d] = txt.split('-').map(Number);
  return [a, m, d];
}

const esBisiesto = (a: number) => (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;

@Injectable()
export class CumpleService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Busca a quien cumple años hoy (o en los últimos DIAS_DE_MARGEN días sin
   * felicitar), le manda la felicitación con su enlace al 50 % y a la creadora
   * el aviso. Devuelve cuántos ha procesado.
   */
  async felicitarCumpleanosDeHoy(): Promise<{ felicitados: number }> {
    const db = this.databaseService.getClient();
    const { data: users, error } = await db
      .from('user')
      .select('id, name, email, telefono, fecha_nacimiento, email_confirmado, cumple_enviado_anio')
      .not('fecha_nacimiento', 'is', null);
    if (error) {
      console.error('[cumple] no se pudo leer la lista:', error.message);
      throw error;
    }

    const [ha, hm, hd] = hoyEnEspana();
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    let felicitados = 0;

    for (const u of users ?? []) {
      const [na, nm, nd] = String(u.fecha_nacimiento).split('-').map(Number);

      for (let atras = 0; atras <= DIAS_DE_MARGEN; atras++) {
        const dia = new Date(Date.UTC(ha, hm - 1, hd - atras));
        const a = dia.getUTCFullYear(), m = dia.getUTCMonth() + 1, d = dia.getUTCDate();
        // Nacidos un 29 de febrero: los años que no son bisiestos, el 28.
        const cumpleEsEseDia =
          (nm === m && nd === d) || (nm === 2 && nd === 29 && !esBisiesto(a) && m === 2 && d === 28);
        if (!cumpleEsEseDia) continue;
        if (u.cumple_enviado_anio === a) break;

        // Se «reserva» el año antes de mandar nada, con la condición en la
        // propia consulta: si el cron se lanza dos veces a la vez, solo una
        // pasada consigue la fila y el correo no sale duplicado.
        const { data: reservada } = await db
          .from('user')
          .update({ cumple_enviado_anio: a })
          .eq('id', u.id)
          .or(`cumple_enviado_anio.is.null,cumple_enviado_anio.neq.${a}`)
          .select('id');
        if (!reservada?.length) break;

        // Solo a cuentas confirmadas: el correo tiene que ser suyo de verdad.
        const felicitar = u.email_confirmado !== false;
        try {
          if (felicitar) {
            const enlace = `${frontendUrl}/cumple?t=${encodeURIComponent(crearTokenCumple(u.id, a))}`;
            await this.mailService.enviarFelicitacionCumple(u.email, u.name ?? '', enlace);
          }
          await this.mailService.enviarAvisoCumple(u.email, u.name ?? '', {
            edad: na ? a - na : null,
            telefono: u.telefono ?? null,
            felicitado: felicitar,
          });
          felicitados++;
        } catch (err) {
          console.error(`[cumple] fallo al felicitar a ${u.id}:`, err);
        }
        break;
      }
    }

    console.log(`[cumple] ${ha}-${hm}-${hd}: ${felicitados} cumpleaños`);
    return { felicitados };
  }
}
