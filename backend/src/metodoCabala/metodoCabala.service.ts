import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class MetodoCabalaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('metodo_cabala')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoCabala.get] error:', error.message);
      return null;
    }
    return data ?? null;
  }

  // `data` guarda el progreso del recorrido (p.ej. las sefirot ya vistas). Es el
  // único campo editable desde el cliente.
  private static readonly CAMPOS_PATCH_PERMITIDOS = new Set(['data']);

  async actualizar(userId: string, patch: Record<string, any>): Promise<{ success: boolean }> {
    const filtered = Object.fromEntries(
      Object.entries(patch ?? {}).filter(([k]) =>
        MetodoCabalaService.CAMPOS_PATCH_PERMITIDOS.has(k),
      ),
    );
    const update = { ...filtered, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_cabala')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoCabala.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
