import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

// Las 8 disciplinas válidas como etiqueta de una entrada (keys del frontend).
// `null` = sesión sin disciplina concreta.
const DISCIPLINAS_VALIDAS = new Set([
  'astrologia',
  'psicologia',
  'ayurveda',
  'tcm',
  'fisiologia',
  'nutricion',
  'cabala',
  'cultura',
]);

const TABLA = 'diario_sesion';

export interface EntradaInput {
  fecha?: string | null;
  disciplina?: string | null;
  titulo?: string | null;
  contenido?: string;
  porque?: string | null;
  publicada?: boolean;
}

/** `2026-09-18` a partir de lo que llegue; si no es una fecha, hoy. */
const fechaValida = (v?: string | null): string => {
  const d = v ? new Date(v) : new Date();
  const buena = Number.isNaN(d.getTime()) ? new Date() : d;
  return buena.toISOString().slice(0, 10);
};

const limpiar = (v?: string | null): string | null => {
  const t = (v ?? '').trim();
  return t ? t : null;
};

@Injectable()
export class DiarioSesionService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ── LO QUE VE LA PERSONA ────────────────────────────────────────────────
  // Solo lo publicado: un borrador a medias no puede asomarse a su Home.
  async listarPublicadas(userId: string) {
    const { data, error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .select('*')
      .eq('user_id', userId)
      .eq('publicada', true)
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[diarioSesion.listarPublicadas] error:', error.message);
      return [];
    }
    return data ?? [];
  }

  /** Marca como leídas las entradas publicadas que aún no lo estaban. */
  async marcarLeidas(userId: string) {
    const { error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .update({ leida_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('publicada', true)
      .is('leida_at', null);

    if (error) {
      console.warn('[diarioSesion.marcarLeidas] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  // ── LO QUE VE LA ADMIN ──────────────────────────────────────────────────
  // Todo, incluidos los borradores.
  async listarTodas(userId: string) {
    const { data, error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[diarioSesion.listarTodas] error:', error.message);
      return [];
    }
    return data ?? [];
  }

  async crear(userId: string, dto: EntradaInput) {
    const contenido = (dto?.contenido ?? '').trim();
    if (!contenido) {
      return { success: false, error: 'La entrada está vacía' };
    }
    const disciplina =
      dto?.disciplina && DISCIPLINAS_VALIDAS.has(dto.disciplina) ? dto.disciplina : null;

    const { data, error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .insert({
        user_id: userId,
        fecha: fechaValida(dto?.fecha),
        disciplina,
        titulo: limpiar(dto?.titulo),
        contenido,
        porque: limpiar(dto?.porque),
        publicada: dto?.publicada === true,
      })
      .select()
      .single();

    if (error) {
      console.warn('[diarioSesion.crear] error:', error.message);
      // Devolvemos el motivo real (p. ej. «relation "public.diario_sesion"
      // does not exist») para poder diagnosticar sin entrar al servidor.
      return { success: false, error: error.message || 'No se pudo guardar la entrada' };
    }
    return { success: true, entrada: data };
  }

  async actualizar(userId: string, entradaId: string, dto: EntradaInput) {
    const cambios: Record<string, any> = { updated_at: new Date().toISOString() };

    if (dto?.contenido !== undefined) {
      const contenido = (dto.contenido ?? '').trim();
      if (!contenido) return { success: false, error: 'La entrada está vacía' };
      cambios.contenido = contenido;
    }
    if (dto?.fecha !== undefined) cambios.fecha = fechaValida(dto.fecha);
    if (dto?.titulo !== undefined) cambios.titulo = limpiar(dto.titulo);
    if (dto?.porque !== undefined) cambios.porque = limpiar(dto.porque);
    if (dto?.disciplina !== undefined) {
      cambios.disciplina =
        dto.disciplina && DISCIPLINAS_VALIDAS.has(dto.disciplina) ? dto.disciplina : null;
    }
    // Al publicar algo que estaba en borrador vuelve a contar como «nuevo»:
    // si no, una entrada leída y luego reescrita no avisaría de nada.
    if (dto?.publicada !== undefined) {
      cambios.publicada = dto.publicada === true;
      if (dto.publicada === true) cambios.leida_at = null;
    }

    const { data, error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .update(cambios)
      .eq('id', entradaId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.warn('[diarioSesion.actualizar] error:', error.message);
      return { success: false, error: error.message || 'No se pudo guardar la entrada' };
    }
    return { success: true, entrada: data };
  }

  async eliminar(userId: string, entradaId: string) {
    const { error } = await this.databaseService
      .getClient()
      .from(TABLA)
      .delete()
      .eq('id', entradaId)
      .eq('user_id', userId);

    if (error) {
      console.warn('[diarioSesion.eliminar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
