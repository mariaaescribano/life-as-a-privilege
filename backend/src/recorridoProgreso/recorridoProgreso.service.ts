import { esIdLectura } from '../lectura/lectura-id';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

/**
 * Progreso secuencial del recorrido por usuario y disciplina. Guarda el paso
 * MÁXIMO desbloqueado; solo AVANZA (nunca baja). El Índice bloquea los pasos
 * posteriores a `paso_max`.
 */
/**
 * Fila reservada de `recorrido_progreso` donde queda apuntado el consentimiento
 * explícito para tratar datos de salud (art. 9.2.a RGPD). El RGPD obliga a
 * poder DEMOSTRAR que se dio (art. 7.1): la fila guarda cuándo.
 *
 * Va en esta tabla y no en una columna nueva de `user` para no tener que migrar
 * nada, y porque ya se borra con la cuenta (relatedTables de deleteUser).
 */
export const CONSENTIMIENTO_SALUD = 'consentimiento-salud';

/**
 * Disciplinas cuyo MAPA (el Índice del recorrido) solo abre la admin: las OCHO.
 * Su `paso_max` lo fija ella desde el /home de la persona (o desde su camino); la
 * persona no lo sube andando por las páginas, solo ve lo que María ha abierto.
 * Las claves son las de `<key>_suscrito` (astrología = `metodo`). Las filas
 * `camino-*` (lo que mide «Tu camino» de la Home) siguen subiendo solas: no abren
 * nada.
 */
export const DISCIPLINAS_MAPA_ADMIN = ['metodo', 'psicologia', 'fisiologia', 'nutricion', 'ayurveda', 'tcm', 'cabala', 'cultura'];

@Injectable()
export class RecorridoProgresoService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * TODO el progreso del usuario de una vez: { disciplina: paso_max }.
   *
   * Lo pide el «camino» de la Home, que enseña por dónde va en cada disciplina
   * comprada. Una sola consulta en vez de ocho: la Home es la página que más se
   * abre y no puede permitirse una petición por disciplina.
   */
  async getTodo(userId: string): Promise<Record<string, number>> {
    // La persona de LECTURA no tiene progreso guardado (no es una cuenta): su camino se abre entero y sin barra.
    if (esIdLectura(userId)) return {};
    const { data, error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .select('disciplina, paso_max')
      .eq('user_id', userId);
    if (error || !data) return {};
    const salida: Record<string, number> = {};
    for (const fila of data as any[]) {
      if (fila?.disciplina === CONSENTIMIENTO_SALUD) continue; // no es una disciplina
      const n = Number(fila?.paso_max);
      if (typeof fila?.disciplina === 'string' && Number.isFinite(n)) {
        salida[fila.disciplina] = n;
      }
    }
    return salida;
  }

  /** Lo que ve María de una persona: igual que `getTodo`, pero una cuenta «solo carta» tiene Astrología (`metodo`) abierta del todo. */
  async getTodoAdmin(userId: string): Promise<Record<string, number>> {
    // La persona de lectura (sin cuenta) tiene Astrología abierta del todo y nada más.
    if (esIdLectura(userId)) return { metodo: 99 };
    return await this.getTodo(userId);
  }

  async getPasoMax(userId: string, disciplina: string): Promise<number> {
    // La persona de LECTURA (sin cuenta) tiene TODO Astrología abierto, para empezar por donde quiera, y nada más.
    // Se resuelve aquí y no escribiendo un techo: así su barra de avance no sale ya completa.
    if (esIdLectura(userId)) return disciplina === 'metodo' ? 99 : 1;
    if (disciplina === 'metodo') {
      const { data: u } = await this.databaseService.getClient().from('user').select('solo_lectura').eq('id', userId).maybeSingle();
      if ((u as { solo_lectura?: boolean } | null)?.solo_lectura === true) return 99;
    }
    const { data, error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .select('paso_max')
      .eq('user_id', userId)
      .eq('disciplina', disciplina)
      .maybeSingle();
    if (error || !data) return 1;
    return typeof data.paso_max === 'number' && data.paso_max >= 1 ? data.paso_max : 1;
  }

  /** Cuándo dio su consentimiento de salud, o `null` si aún no lo ha dado. */
  async getConsentimientoSalud(userId: string): Promise<string | null> {
    const { data, error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .select('updated_at')
      .eq('user_id', userId)
      .eq('disciplina', CONSENTIMIENTO_SALUD)
      .maybeSingle();
    if (error || !data) return null;
    return (data as any).updated_at ?? null;
  }

  /** Lo apunta (una vez: si ya estaba, se conserva la fecha original). */
  async darConsentimientoSalud(userId: string): Promise<string | null> {
    const ya = await this.getConsentimientoSalud(userId);
    if (ya) return ya;
    const ahora = new Date().toISOString();
    const { error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .insert({ user_id: userId, disciplina: CONSENTIMIENTO_SALUD, paso_max: 1, updated_at: ahora });
    if (error) {
      console.error('Error guardando el consentimiento de salud:', error);
      return null;
    }
    return ahora;
  }


  /**
   * Las páginas del camino que la persona ya ha visto: { disciplina: [ruta, …] }.
   * Si la tabla `camino_visto` aún no existe (SQL sin correr) devuelve {} sin romper nada.
   */
  async getVistos(userId: string): Promise<Record<string, string[]>> {
    if (esIdLectura(userId)) return {}; // sin cuenta no hay nada guardado en el servidor (los ticks quedan en el navegador)
    const { data, error } = await this.databaseService.getClient()
      .from('camino_visto')
      .select('disciplina, ruta')
      .eq('user_id', userId);
    if (error || !data) return {};
    const salida: Record<string, string[]> = {};
    for (const fila of data as any[]) {
      if (typeof fila?.disciplina !== 'string' || typeof fila?.ruta !== 'string') continue;
      (salida[fila.disciplina] ??= []).push(fila.ruta);
    }
    return salida;
  }

  /** Apunta que ha visto una página (repetirlo no hace nada). */
  async marcarVisto(userId: string, disciplina: string, ruta: string): Promise<void> {
    if (esIdLectura(userId)) return;
    const { error } = await this.databaseService.getClient()
      .from('camino_visto')
      .upsert({ user_id: userId, disciplina, ruta }, { onConflict: 'user_id,disciplina,ruta', ignoreDuplicates: true });
    if (error) console.error('Error apuntando camino_visto:', error.message);
  }

  async avanzar(userId: string, disciplina: string, paso: number): Promise<number> {
    const actual = await this.getPasoMax(userId, disciplina);
    const nuevo = Math.max(actual, Math.floor(paso) || 1, 1);
    if (nuevo === actual) return actual; // ya está al menos ahí: no bajamos ni reescribimos
    const { error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .upsert(
        { user_id: userId, disciplina, paso_max: nuevo, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,disciplina' },
      );
    if (error) {
      console.error('Error avanzando recorrido_progreso:', error);
      return actual;
    }
    return nuevo;
  }

  /**
   * La admin FIJA el paso máximo de una usuaria (sube o baja: es el único sitio
   * donde puede bajar). Con 1 queda cerrado todo salvo el primer paso.
   */
  async fijar(userId: string, disciplina: string, paso: number): Promise<number> {
    const nuevo = Math.max(Math.floor(paso) || 1, 1);
    const { error } = await this.databaseService.getClient()
      .from('recorrido_progreso')
      .upsert(
        { user_id: userId, disciplina, paso_max: nuevo, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,disciplina' },
      );
    if (error) {
      console.error('Error fijando recorrido_progreso:', error);
      throw new Error('No se ha podido guardar');
    }
    return nuevo;
  }
}
