import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

/**
 * Progreso secuencial del recorrido por usuario y disciplina. Guarda el paso
 * MÁXIMO desbloqueado; solo AVANZA (nunca baja). El Índice bloquea los pasos
 * posteriores a `paso_max`.
 */
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
