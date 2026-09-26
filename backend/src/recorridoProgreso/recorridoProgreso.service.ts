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

  async getPasoMax(userId: string, disciplina: string): Promise<number> {
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
}
