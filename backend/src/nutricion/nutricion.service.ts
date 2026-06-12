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
      const fields = {
        peso:          data.peso,
        altura:        data.altura,
        edad:          data.edad,
        genero:        data.genero,
        actividad_idx: data.actividadIdx,
        tdee:          data.tdee,
        prot_g:        data.protG,
        carb_g:        data.carbG,
        fat_g:         data.fatG,
      };

      // UPDATE si ya existe, INSERT si no: evita la ventana de pérdida de datos
      // del patrón anterior (borrar y luego insertar en dos pasos).
      const { data: existing } = await db
        .from('nutricion')
        .select('userId')
        .eq('userId', data.userId)
        .limit(1);

      const { error } = (existing?.length ?? 0) > 0
        ? await db.from('nutricion').update(fields).eq('userId', data.userId)
        : await db.from('nutricion').insert({ userId: data.userId, ...fields });

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
