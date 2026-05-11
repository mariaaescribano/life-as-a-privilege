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

  async actualizar(userId: string, patch: Record<string, any>): Promise<{ success: boolean }> {
    const update = { ...patch, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_psicologia')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoPsicologia.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
