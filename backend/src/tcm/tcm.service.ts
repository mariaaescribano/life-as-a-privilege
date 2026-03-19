import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class TcmService {
  constructor(private readonly databaseService: DatabaseService) {}

  /* ── Helper: delete + insert parcial ────────────────────────────────
     1. Lee la fila existente (para preservar las otras columnas).
     2. Si existe → DELETE y luego INSERT con todos los campos + el nuevo.
     3. Si no existe → INSERT solo con userId + la columna nueva.         */
  private async upsertField(
    userId: string,
    field: 'constitucion' | 'elemento' | 'desequilibrio',
    value: string,
  ): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      const { data: existing } = await db
        .from('tcm')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();

      if (existing) {
        // Borrar fila existente
        await db.from('tcm').delete().eq('userId', userId);

        // Reinsertar preservando las otras columnas + el nuevo valor
        const { error } = await db.from('tcm').insert({
          userId,
          constitucion:  existing.constitucion  ?? null,
          elemento:      existing.elemento      ?? null,
          desequilibrio: existing.desequilibrio ?? null,
          [field]: value,
        });
        if (error) throw error;
      } else {
        const { error } = await db
          .from('tcm')
          .insert({ userId, [field]: value });
        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error en upsertField (${field}):`, error);
      return false;
    }
  }

  /* POST — guardar constitución (Test 1) */
  async saveConstitucion(userId: string, constitucion: string): Promise<boolean> {
    return this.upsertField(userId, 'constitucion', constitucion);
  }

  /* POST — guardar elemento (Test 2) */
  async saveElemento(userId: string, elemento: string): Promise<boolean> {
    return this.upsertField(userId, 'elemento', elemento);
  }

  /* POST — guardar desequilibrio (Test 3) */
  async saveDesequilibrio(userId: string, desequilibrio: string): Promise<boolean> {
    return this.upsertField(userId, 'desequilibrio', desequilibrio);
  }

  /* POST — guardar todas las respuestas de un test */
  async saveRespuestas(
    userId: string,
    testNum: number,
    respuestas: Array<{
      seccion: string;
      preguntaIdx: number;
      pregunta: string;
      respuesta: number;
    }>,
  ): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      // Borrar respuestas previas del mismo usuario y test
      await db
        .from('tcm_respuestas')
        .delete()
        .eq('user_id', userId)
        .eq('test_num', testNum);

      const rows = respuestas.map((r) => ({
        user_id: userId,
        test_num: testNum,
        seccion: r.seccion,
        pregunta_idx: r.preguntaIdx,
        pregunta: r.pregunta,
        respuesta: r.respuesta,
      }));

      const { error } = await db.from('tcm_respuestas').insert(rows);
      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error en saveRespuestas:', error);
      return false;
    }
  }

  /* GET — respuestas individuales de un test */
  async getRespuestas(
    userId: string,
    testNum: number,
  ): Promise<
    Array<{
      seccion: string;
      pregunta_idx: number;
      pregunta: string;
      respuesta: number;
    }>
  > {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('tcm_respuestas')
        .select('seccion, pregunta_idx, pregunta, respuesta')
        .eq('user_id', userId)
        .eq('test_num', testNum)
        .order('seccion', { ascending: true })
        .order('pregunta_idx', { ascending: true });

      if (error) throw error;
      return data ?? [];
    } catch (error) {
      console.error('Error en getRespuestas:', error);
      return [];
    }
  }

  /* GET — datos TCM de un usuario */
  async getTcmData(userId: string): Promise<{
    userId: string;
    constitucion: string | null;
    elemento: string | null;
    desequilibrio: string | null;
  } | null> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('tcm')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    } catch (error) {
      console.error('Error en getTcmData:', error);
      return null;
    }
  }
}
