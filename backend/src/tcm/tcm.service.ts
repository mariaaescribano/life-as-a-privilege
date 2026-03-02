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
