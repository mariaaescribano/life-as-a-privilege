import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class MetodoFisiologiaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('metodo_fisiologia')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoFisiologia.get] error:', error.message);
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
        MetodoFisiologiaService.CAMPOS_PATCH_PERMITIDOS.has(k),
      ),
    );
    const update = { ...filtered, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_fisiologia')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoFisiologia.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
