import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { CartaNatalService } from './cartaNatal.service';
import type { CartaNatal, CuerpoKey, PosicionPlaneta } from './cartaNatal.types';

const CUERPOS_MANUALES: CuerpoKey[] = ['quiron', 'nodoNorte', 'nodoSur'];

function norm360Local(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function casaDeLocal(lonDeg: number, cusps: number[]): number {
  const lon = norm360Local(lonDeg);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const span = norm360Local(b - a);
    const offset = norm360Local(lon - a);
    if (offset >= 0 && offset < span) return i + 1;
  }
  return 1;
}

export interface SolicitudCarta {
  fecha_nacimiento: string; // YYYY-MM-DD
  hora_nacimiento: string;  // HH:MM
  pais: string;
  lugar: string;
  region: string;
}

@Injectable()
export class MetodoAstrologiaService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly cartaNatalService: CartaNatalService,
  ) {}

  // ── GET completo ──
  async getMetodoAstrologia(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoAstrologia.get] error:', error.message);
      return null;
    }
    return data ?? null;
  }

  // ── GET solo del JSON de la carta natal calculada ──
  async getCartaNatal(userId: string): Promise<CartaNatal | null> {
    const row = await this.getMetodoAstrologia(userId);
    if (!row) return null;

    // Si ya está cacheada, devolvemos directamente.
    if (row.carta_natal_json) return row.carta_natal_json as CartaNatal;

    // Si tenemos datos suficientes, intentamos calcularla al vuelo y cachear.
    if (row.fecha_nacimiento && row.hora_nacimiento && row.latitud != null && row.longitud != null && row.timezone) {
      const carta = await this.calcularYGuardar(userId, row);
      return carta;
    }
    return null;
  }

  // ── PATCH parcial (aviso_visto, data, link_carta…) ──
  async actualizar(userId: string, patch: Record<string, any>): Promise<{ success: boolean }> {
    const update = { ...patch, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoAstrologia.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  // ── Solicitud de carta astral + email a la creadora + cálculo carta natal ──
  async solicitarCarta(userId: string, datos: SolicitudCarta): Promise<{ success: boolean }> {
    const user = await this.userService.getUserById(userId).catch(() => null);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Geocoding + timezone + cálculo (best-effort, no rompe la solicitud si falla)
    let latitud: number | null = null;
    let longitud: number | null = null;
    let timezone: string | null = null;
    let carta_natal_json: CartaNatal | null = null;

    try {
      const geo = await this.cartaNatalService.geocode(datos.lugar, datos.region, datos.pais);
      if (geo) {
        latitud = geo.lat;
        longitud = geo.lng;
        timezone = this.cartaNatalService.getTimezone(geo.lat, geo.lng);
        const utc = this.cartaNatalService.localToUtc(datos.fecha_nacimiento, datos.hora_nacimiento, timezone);
        if (utc) {
          carta_natal_json = this.cartaNatalService.calcular(utc, { lat: geo.lat, lng: geo.lng, timezone });
        }
      }
    } catch (err: unknown) {
      console.warn('[metodoAstrologia.solicitar] error cálculo carta:', err instanceof Error ? err.message : err);
    }

    // Si calculamos la carta, pre-llenamos también el `data` (signos/casas por planeta)
    // sin sobrescribir lo que el usuario ya hubiese completado.
    const existingRow = await this.getMetodoAstrologia(userId);
    const existingData = (existingRow?.data ?? null) as Record<string, any> | null;
    const data = carta_natal_json
      ? this.cartaNatalService.mergeWithCartaData(existingData, carta_natal_json)
      : existingData;

    const { error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .upsert(
        {
          user_id: userId,
          fecha_nacimiento: datos.fecha_nacimiento,
          hora_nacimiento: datos.hora_nacimiento,
          pais: datos.pais,
          lugar: datos.lugar,
          region: datos.region,
          latitud,
          longitud,
          timezone,
          carta_natal_json,
          data,
          solicitud_enviada_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    if (error) {
      console.warn('[metodoAstrologia.solicitar] error BD:', error.message);
      return { success: false };
    }

    // Email a la creadora — silencioso si el SMTP no está configurado
    await this.mailService.enviarSolicitudCarta(user.email, user.name, datos);

    return { success: true };
  }

  // ── Fuerza el recálculo de la carta natal a partir de los datos ya guardados.
  // Útil tras un cambio en el algoritmo de cusps (sin tener que reabrir el cuadro de datos). ──
  async recalcular(userId: string): Promise<{ success: boolean; message?: string; carta?: CartaNatal }> {
    const row = await this.getMetodoAstrologia(userId);
    if (!row) return { success: false, message: 'Usuario sin datos de carta' };
    if (!row.fecha_nacimiento || !row.hora_nacimiento || row.latitud == null || row.longitud == null || !row.timezone) {
      return { success: false, message: 'Faltan datos de nacimiento (fecha/hora/lat/lng/timezone) para recalcular' };
    }
    const carta = await this.calcularYGuardar(userId, row);
    if (!carta) return { success: false, message: 'No se pudo calcular la carta' };
    return { success: true, carta };
  }

  // ── Ajuste manual de Quirón / nodos en el JSON cacheado ──
  async setCuerpoManual(userId: string, planeta: CuerpoKey, grado: number): Promise<{ success: boolean; message?: string; carta?: CartaNatal }> {
    if (!CUERPOS_MANUALES.includes(planeta)) {
      return { success: false, message: 'Solo se pueden ajustar manualmente: quiron, nodoNorte, nodoSur' };
    }
    if (!Number.isFinite(grado) || grado < 0 || grado >= 360) {
      return { success: false, message: 'El grado debe ser un número entre 0 y 360' };
    }

    const row = await this.getMetodoAstrologia(userId);
    if (!row || !row.carta_natal_json) {
      return { success: false, message: 'No hay carta natal calculada para este usuario' };
    }

    const carta: CartaNatal = row.carta_natal_json;
    const lon = norm360Local(grado);
    const signoIdx = Math.floor(lon / 30) % 12;
    const casa = casaDeLocal(lon, carta.cusps);

    const nuevoCuerpo: PosicionPlaneta = { planeta, grado: lon, signoIdx, casa };

    // Reemplaza o añade el cuerpo
    const idx = carta.planetas.findIndex(p => p.planeta === planeta);
    if (idx >= 0) carta.planetas[idx] = nuevoCuerpo;
    else carta.planetas.push(nuevoCuerpo);

    // Si edita el Nodo Norte, sincroniza el Sur (siempre 180° opuesto)
    if (planeta === 'nodoNorte') {
      const sur = norm360Local(lon + 180);
      const surCuerpo: PosicionPlaneta = {
        planeta: 'nodoSur',
        grado: sur,
        signoIdx: Math.floor(sur / 30) % 12,
        casa: casaDeLocal(sur, carta.cusps),
      };
      const iSur = carta.planetas.findIndex(p => p.planeta === 'nodoSur');
      if (iSur >= 0) carta.planetas[iSur] = surCuerpo;
      else carta.planetas.push(surCuerpo);
    } else if (planeta === 'nodoSur') {
      const norte = norm360Local(lon + 180);
      const norteCuerpo: PosicionPlaneta = {
        planeta: 'nodoNorte',
        grado: norte,
        signoIdx: Math.floor(norte / 30) % 12,
        casa: casaDeLocal(norte, carta.cusps),
      };
      const iN = carta.planetas.findIndex(p => p.planeta === 'nodoNorte');
      if (iN >= 0) carta.planetas[iN] = norteCuerpo;
      else carta.planetas.push(norteCuerpo);
    }

    const { error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .update({ carta_natal_json: carta, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) {
      console.warn('[metodoAstrologia.setCuerpoManual] error BD:', error.message);
      return { success: false, message: 'Error al guardar' };
    }

    return { success: true, carta };
  }

  // ── Calcula y persiste la carta natal a partir de los datos ya guardados ──
  private async calcularYGuardar(userId: string, row: any): Promise<CartaNatal | null> {
    try {
      const utc = this.cartaNatalService.localToUtc(row.fecha_nacimiento, row.hora_nacimiento, row.timezone);
      if (!utc) return null;
      const carta = this.cartaNatalService.calcular(utc, {
        lat: Number(row.latitud),
        lng: Number(row.longitud),
        timezone: row.timezone,
      });
      const data = this.cartaNatalService.mergeWithCartaData(row.data ?? null, carta);
      await this.databaseService.getClient()
        .from('metodo_astrologia')
        .update({ carta_natal_json: carta, data, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      return carta;
    } catch (err: unknown) {
      console.warn('[metodoAstrologia.calcularYGuardar] error:', err instanceof Error ? err.message : err);
      return null;
    }
  }
}
