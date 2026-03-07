import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class AstrologiaService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async upsertField(
    userId: string,
    field: 'sol' | 'luna' | 'ascendente',
    value: string | null,
  ): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      const { data: existing } = await db
        .from('astrologia')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();

      if (existing) {
        await db.from('astrologia').delete().eq('userId', userId);
        const { error } = await db.from('astrologia').insert({
          userId,
          sol:        existing.sol        ?? null,
          luna:       existing.luna       ?? null,
          ascendente: existing.ascendente ?? null,
          [field]: value,
        });
        if (error) throw error;
      } else {
        const { error } = await db
          .from('astrologia')
          .insert({ userId, [field]: value });
        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error en upsertField astrologia (${field}):`, error);
      return false;
    }
  }

  async saveSol(userId: string, sol: string): Promise<boolean> {
    return this.upsertField(userId, 'sol', sol);
  }

  async saveLuna(userId: string, luna: string): Promise<boolean> {
    return this.upsertField(userId, 'luna', luna);
  }

  async saveAscendente(userId: string, ascendente: string): Promise<boolean> {
    return this.upsertField(userId, 'ascendente', ascendente);
  }

  async clearField(userId: string, field: 'sol' | 'luna' | 'ascendente'): Promise<boolean> {
    return this.upsertField(userId, field, null);
  }

  async getAstrologiaData(userId: string): Promise<{
    userId: string;
    sol: string | null;
    luna: string | null;
    ascendente: string | null;
  } | null> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('astrologia')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    } catch (error) {
      console.error('Error en getAstrologiaData:', error);
      return null;
    }
  }
}
