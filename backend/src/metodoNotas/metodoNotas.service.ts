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
  // `autor`: 'maria' si la escribe María; null si la escribe la persona. Si la
  // columna aún no existe (falta correr sql/notas-autor.sql) se guarda sin ella.
  async crear(userId: string, dto: NuevaNota, autor: 'maria' | null = null) {
    const contenido = (dto?.contenido ?? '').trim();
    if (!contenido) {
      return { success: false, error: 'La nota está vacía' };
    }
    const categoria =
      dto?.categoria && CATEGORIAS_VALIDAS.has(dto.categoria) ? dto.categoria : null;

    const insertar = (fila: Record<string, any>) =>
      this.databaseService.getClient().from('notas').insert(fila).select().single();

    let { data, error } = await insertar({ user_id: userId, contenido, categoria, autor });
    if (error && /autor/i.test(error.message ?? '')) {
      ({ data, error } = await insertar({ user_id: userId, contenido, categoria }));
    }

    if (error) {
      console.warn('[metodoNotas.crear] error:', error.message);
      // Devolvemos el motivo real (p. ej. «relation "public.notas" does not
      // exist») para poder diagnosticar; si es null, mensaje genérico.
      return { success: false, error: error.message || 'No se pudo guardar la nota' };
    }
    return { success: true, nota: data };
  }

  // ── Borrar una nota ──
  // La persona borra las suyas, no las de María; María borra cualquiera.
  async eliminar(userId: string, notaId: string, esMaria = false) {
    const borrar = (soloSuyas: boolean) => {
      let q = this.databaseService.getClient()
        .from('notas')
        .delete()
        .eq('id', notaId)
        .eq('user_id', userId);
      if (soloSuyas) q = q.or('autor.is.null,autor.neq.maria');
      return q;
    };

    let { error } = await borrar(!esMaria);
    if (error && /autor/i.test(error.message ?? '')) ({ error } = await borrar(false));

    if (error) {
      console.warn('[metodoNotas.eliminar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
