import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type Stripe from 'stripe';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { MetodoAstrologiaService } from '../metodoAstrologia/metodoAstrologia.service';
import { ESTADOS_LECTURA, findLectura, LecturaEstado } from './lectura.data';

const TABLE = 'lectura_pedido';

export interface DatosLectura {
  servicio: string;
  nombre: string;
  email: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  lugar: string;
}

@Injectable()
export class LecturaService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mail: MailService,
    private readonly users: UserService,
    // Opcional a propósito (los tests no lo montan): sin él, simplemente no se precarga la carta.
    private readonly astrologia?: MetodoAstrologiaService,
  ) {}

  /**
   * La cuenta de «plataforma» entra en un recorrido de Astrología que ya tiene SU carta: se le guardan (y se calcula la
   * carta con) los datos de nacimiento que dio al pedir, para que no tenga que escribirlos otra vez. No manda ningún
   * correo ni abre nada. Por detrás y sin romper nada: si falla (p. ej. el geocoding), el pedido y la cuenta siguen bien.
   */
  private precargarCarta(userId: string, d: { fecha: string; hora: string; lugar: string }): void {
    if (!this.astrologia) return;
    // El formulario manda el lugar como «ciudad, región, país».
    const partes = d.lugar.split(',').map((x) => x.trim()).filter(Boolean);
    const [lugar, region, pais] = partes.length >= 3 ? [partes[0], partes[1], partes.slice(2).join(', ')] : [d.lugar, '', ''];
    void this.astrologia
      .guardarNacimientoAdmin(userId, { fecha_nacimiento: d.fecha, hora_nacimiento: d.hora, lugar, region, pais })
      .catch((err) => console.error('[lectura] no se pudo precargar la carta:', err instanceof Error ? err.message : err));
  }

  /** Valida lo que manda el formulario (TODOS los datos de nacimiento son obligatorios) y lo deja limpio. */
  validar(body: Partial<Record<keyof DatosLectura | 'acepta', unknown>>): DatosLectura {
    const txt = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const servicio = txt(body?.servicio, 40);
    const nombre = txt(body?.nombre, 120);
    const email = txt(body?.email, 254).toLowerCase();
    const fecha = txt(body?.fecha, 10);
    const hora = txt(body?.hora, 5);
    const lugar = txt(body?.lugar, 160);

    if (!findLectura(servicio)) throw new BadRequestException('Servicio desconocido');
    if (!nombre || !email || !fecha || !hora || !lugar) {
      throw new BadRequestException('Faltan datos: el nombre, el email y la fecha, la hora y el lugar de nacimiento son obligatorios');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('El email no es válido');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
      Number.isNaN(Date.parse(`${fecha}T12:00:00Z`)) ||
      fecha > new Date().toISOString().slice(0, 10) ||
      fecha < '1900-01-01'
    ) {
      throw new BadRequestException('La fecha de nacimiento no es válida');
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) throw new BadRequestException('La hora de nacimiento no es válida');
    if (body?.acepta !== true) throw new BadRequestException('Tienes que aceptar el aviso sobre la hora de nacimiento');
    return { servicio, nombre, email, fecha, hora, lugar };
  }

  /**
   * Un pago de Stripe de una carta ya está cobrado: se crea el pedido (una sola vez, aunque lleguen el verify
   * y el webhook), se crea la cuenta «solo carta» SIN acceso y sale el correo. Idempotente.
   */
  async confirmarPago(session: Stripe.Checkout.Session): Promise<{ ok: boolean; nombre?: string; creado?: boolean }> {
    const m = session.metadata ?? {};
    const tarifa = findLectura(m.servicio);
    if (!tarifa || !m.nombre || !m.email || !m.fecha || !m.hora || !m.lugar) return { ok: false };

    const client = this.db.getClient();
    const { data: previo } = await client.from(TABLE).select('id, nombre').eq('stripe_session_id', session.id).maybeSingle();
    if (previo) return { ok: true, nombre: (previo as { nombre: string }).nombre, creado: false };

    const fila = {
      nombre: m.nombre,
      email: m.email,
      servicio: tarifa.servicio,
      precio_centimos: tarifa.precioCentimos,
      fecha_nacimiento: m.fecha,
      hora_nacimiento: m.hora,
      lugar_nacimiento: m.lugar,
      stripe_session_id: session.id,
      pagado: true,
    };
    const { data: ins, error } = await client.from(TABLE).insert(fila).select('id').single();
    if (error) {
      // 23505 = otro camino (webhook / verify) ya lo creó entre medias.
      if (error.code === '23505') return { ok: true, nombre: m.nombre, creado: false };
      console.error('[lectura] no se pudo guardar el pedido:', error.message);
      return { ok: false };
    }
    const id = (ins as { id: string }).id;

    // Solo «plataforma» da entrada a la cuenta (Astrología). Las cartas en PDF se entregan por correo: sin cuenta.
    if (tarifa.servicio === 'plataforma') {
      try {
        const cuenta = await this.users.crearCuentaLectura({ name: m.nombre, email: m.email });
        await client.from(TABLE).update({ user_id: cuenta.id }).eq('id', id);
        this.precargarCarta(cuenta.id, { fecha: m.fecha, hora: m.hora, lugar: m.lugar });
      } catch (err) {
        console.error('[lectura] pedido guardado pero no se pudo crear la cuenta:', err);
      }
    }

    // Un solo correo a la persona, con sus datos: a ella le llega la confirmación y a María la copia oculta con lo mismo.
    void this.mail
      .enviarLecturaRecibida(m.email, m.nombre, tarifa.nombre, { fecha: m.fecha, hora: m.hora, lugar: m.lugar }, tarifa.servicio === 'plataforma')
      .catch((e) => console.error('[lectura] correo de confirmación:', e));
    return { ok: true, nombre: m.nombre, creado: true };
  }

  // ── Admin ────────────────────────────────────────────────────────────────
  async listar() {
    const { data, error } = await this.db.getClient().from(TABLE).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('[lectura] listar:', error.message);
      return [];
    }
    return data ?? [];
  }

  /**
   * María crea una carta a mano (cliente que no la pidió por la web): mismos datos de nacimiento obligatorios,
   * mismo pedido y misma cuenta «solo carta» SIN acceso, pero sin cobro de Stripe y SIN ningún correo: el acceso lo
   * manda ella con «Enviar acceso» cuando la carta esté escrita.
   */
  async crearManual(body: Partial<Record<keyof DatosLectura, unknown>>) {
    const d = this.validar({ ...body, acepta: true });
    const tarifa = findLectura(d.servicio)!;
    const client = this.db.getClient();
    const { data: ins, error } = await client
      .from(TABLE)
      .insert({
        nombre: d.nombre,
        email: d.email,
        servicio: tarifa.servicio,
        precio_centimos: tarifa.precioCentimos,
        fecha_nacimiento: d.fecha,
        hora_nacimiento: d.hora,
        lugar_nacimiento: d.lugar,
        pagado: false,
      })
      .select('id')
      .single();
    if (error) {
      console.error('[lectura] no se pudo crear el pedido a mano:', error.message);
      throw new BadRequestException('No se pudo crear la carta');
    }
    const id = (ins as { id: string }).id;
    if (tarifa.servicio === 'plataforma') {
      try {
        const cuenta = await this.users.crearCuentaLectura({ name: d.nombre, email: d.email });
        await client.from(TABLE).update({ user_id: cuenta.id }).eq('id', id);
        this.precargarCarta(cuenta.id, { fecha: d.fecha, hora: d.hora, lugar: d.lugar });
      } catch (err) {
        console.error('[lectura] pedido creado pero no se pudo crear la cuenta:', err);
      }
    }
    return { id };
  }

  async setEstado(id: string, estado: string) {
    if (!ESTADOS_LECTURA.includes(estado as LecturaEstado)) throw new BadRequestException('Estado no válido');
    const { data, error } = await this.db.getClient().from(TABLE).update({ estado }).eq('id', id).select('id, estado').maybeSingle();
    if (error) throw new BadRequestException('No se pudo cambiar el estado');
    if (!data) throw new NotFoundException('Ese pedido no existe');
    return data;
  }

  /** Cuando la carta está escrita: se le manda el correo con el botón para entrar en su cuenta (sin contraseña; ver `enviarAccesoLectura`). */
  async darAcceso(id: string) {
    const client = this.db.getClient();
    const { data } = await client.from(TABLE).select('id, user_id').eq('id', id).maybeSingle();
    const pedido = data as { id: string; user_id: string | null } | null;
    if (!pedido) throw new NotFoundException('Ese pedido no existe');
    if (!pedido.user_id) throw new BadRequestException('Este pedido no tiene cuenta asociada');
    const correoEnviado = await this.users.enviarAccesoLectura(pedido.user_id);
    if (correoEnviado) {
      await client.from(TABLE).update({ estado: 'lista', acceso_enviado_at: new Date().toISOString() }).eq('id', id);
    }
    return { id, correoEnviado };
  }
}
