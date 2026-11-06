import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

export interface EntradaMaria {
  contenido: string;
}

// El DIARIO de María: lo que apunta de sí misma. No pertenece a ninguna persona
// (no lleva user_id) y solo lo lee y escribe ella (ver el controlador).
@Injectable()
export class DiarioMariaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async listar() {
    const { data, error } = await this.databaseService.getClient()
      .from('diario_maria')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[diarioMaria.listar] error:', error.message);
      return [];
    }
    return data ?? [];
  }

  async crear(dto: EntradaMaria) {
    const contenido = (dto?.contenido ?? '').trim();
    if (!contenido) return { success: false, error: 'La nota está vacía' };
    const { data, error } = await this.databaseService.getClient()
      .from('diario_maria')
      .insert({ contenido })
      .select()
      .single();
    if (error) {
      console.warn('[diarioMaria.crear] error:', error.message);
      return { success: false, error: error.message || 'No se pudo guardar' };
    }
    return { success: true, nota: data };
  }

  async eliminar(id: string) {
    const { error } = await this.databaseService.getClient().from('diario_maria').delete().eq('id', id);
    if (error) {
      console.warn('[diarioMaria.eliminar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
