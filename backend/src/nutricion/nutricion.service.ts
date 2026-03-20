import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

export type NutricionData = {
  userId: string;
  peso: number;
  altura: number;
  edad: number;
  genero: string;
  actividadIdx: number;
  tdee: number;
  protG: number;
  carbG: number;
  fatG: number;
};

@Injectable()
export class NutricionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async save(data: NutricionData): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();
      await db.from('nutricion').delete().eq('userId', data.userId);
      const { error } = await db.from('nutricion').insert({
        userId:       data.userId,
        peso:         data.peso,
        altura:       data.altura,
        edad:         data.edad,
        genero:       data.genero,
        actividad_idx: data.actividadIdx,
        tdee:         data.tdee,
        prot_g:       data.protG,
        carb_g:       data.carbG,
        fat_g:        data.fatG,
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error en nutricion save:', err);
      return false;
    }
  }

  async get(userId: string): Promise<Record<string, unknown> | null> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('nutricion')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    } catch (err) {
      console.error('Error en nutricion get:', err);
      return null;
    }
  }
}
