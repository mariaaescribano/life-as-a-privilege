import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class MetodoPsicologiaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('metodo_psicologia')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoPsicologia.get] error:', error.message);
      return null;
    }
    return data ?? null;
  }

  // `data` (progreso de etapas) e `intro_visto` (cómic de intro ya visto) son
  // los únicos campos editables desde el cliente.
  private static readonly CAMPOS_PATCH_PERMITIDOS = new Set(['data', 'intro_visto']);

  async actualizar(userId: string, patch: Record<string, any>): Promise<{ success: boolean }> {
    const filtered = Object.fromEntries(
      Object.entries(patch ?? {}).filter(([k]) =>
        MetodoPsicologiaService.CAMPOS_PATCH_PERMITIDOS.has(k),
      ),
    );
    const update = { ...filtered, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_psicologia')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoPsicologia.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  // ── Resultado del test DES-II (desconexión) ────────────────────────────────
  //
  // Las RESPUESTAS del test viven en el blob `data` con el resto del recorrido.
  // El RESULTADO va a su propia tabla (`psicologia_des`, ver sql/psicologia-des.sql):
  // es un dato con fecha que interesa poder consultar y comparar sin abrir el
  // blob de cada persona, igual que el resultado de Ayurveda o de Medicina China.
  //
  // Una fila por usuario: el resultado que vale es el último.

  /** Las cuatro bandas posibles (la etiqueta estable, no el título traducido). */
  private static readonly DES_BANDAS = new Set(['0–9', '10–19', '20–29', '30+']);

  /** Guarda (upsert) el resultado del DES-II.
   *
   *  Lo que llega del cliente se normaliza aquí —porcentajes recortados a 0–100 y
   *  banda contra la lista de arriba—, que es lo mínimo cuando el cuerpo de la
   *  petición lo escribe el navegador.
   *
   *  La FECHA la decide el servidor, no el cliente: si el resultado es el mismo
   *  que ya había, se conserva la fecha de entonces; si ha cambiado, es ahora.
   *  Así `fecha` dice cuándo salió ESE resultado y no cuándo se abrió la página
   *  por última vez (y el cliente no tiene que ir a leer la fila antes de
   *  escribirla). */
  async guardarDes(
    userId: string,
    body: Record<string, any>,
  ): Promise<{ success: boolean }> {
    const pct = (v: any): number => {
      const n = Math.round(Number(v));
      return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
    };
    const banda = String(body?.banda ?? '');
    if (!MetodoPsicologiaService.DES_BANDAS.has(banda)) {
      console.warn('[metodoPsicologia.guardarDes] banda desconocida:', body?.banda);
      return { success: false };
    }
    const sub = body?.subescalas ?? {};

    const nuevo = {
      score: pct(body?.score),
      banda,
      amnesia: pct(sub.amnesia),
      despersonalizacion: pct(sub.despersonalizacion),
      absorcion: pct(sub.absorcion),
      alto: !!body?.alto,
    };

    const previo = await this.getDes(userId);
    const mismo =
      !!previo &&
      previo.score === nuevo.score &&
      previo.banda === nuevo.banda &&
      previo.amnesia === nuevo.amnesia &&
      previo.despersonalizacion === nuevo.despersonalizacion &&
      previo.absorcion === nuevo.absorcion &&
      previo.alto === nuevo.alto;

    const ahora = new Date().toISOString();
    const { error } = await this.databaseService.getClient()
      .from('psicologia_des')
      .upsert(
        {
          user_id: userId,
          ...nuevo,
          fecha: mismo ? previo.fecha : ahora,
          updated_at: ahora,
        },
        { onConflict: 'user_id' },
      );

    if (error) {
      console.warn('[metodoPsicologia.guardarDes] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  async getDes(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('psicologia_des')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoPsicologia.getDes] error:', error.message);
      return null;
    }
    return data ?? null;
  }
}
