import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

// Las 8 disciplinas válidas como categoría de una nota (keys del frontend).
// `null` = nota sin clasificar todavía.
const CATEGORIAS_VALIDAS = new Set([
  'astrologia',
  'psicologia',
  'ayurveda',
  'tcm',
  'fisiologia',
  'nutricion',
  'cabala',
  'cultura',
]);

export interface NuevaNota {
  contenido: string;
  categoria?: string | null;
}

@Injectable()
export class MetodoNotasService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ── Lista de notas del usuario, de la más reciente a la más antigua ──
  async listar(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('notas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[metodoNotas.listar] error:', error.message);
      return [];
    }
    return data ?? [];
  }

  // ── Crear una nota nueva ──
  async crear(userId: string, dto: NuevaNota) {
    const contenido = (dto?.contenido ?? '').trim();
    if (!contenido) {
      return { success: false, error: 'La nota está vacía' };
    }
    const categoria =
      dto?.categoria && CATEGORIAS_VALIDAS.has(dto.categoria) ? dto.categoria : null;

    const { data, error } = await this.databaseService.getClient()
      .from('notas')
      .insert({ user_id: userId, contenido, categoria })
      .select()
      .single();

    if (error) {
      console.warn('[metodoNotas.crear] error:', error.message);
      return { success: false, error: 'No se pudo guardar la nota' };
    }
    return { success: true, nota: data };
  }

  // ── Borrar una nota (solo del propio usuario) ──
  async eliminar(userId: string, notaId: string) {
    const { error } = await this.databaseService.getClient()
      .from('notas')
      .delete()
      .eq('id', notaId)
      .eq('user_id', userId);

    if (error) {
      console.warn('[metodoNotas.eliminar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
