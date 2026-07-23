import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import type { CursoDB, CursoInput } from './cursos.types';

const TABLE = 'curso';
const TABLE_REVISADO = 'curso_revisado';

// Solo estos campos se pueden escribir desde el API (evita inyectar columnas raras).
const CAMPOS = ['modalidad', 'titulo', 'foto', 'descripcion', 'descripcion_contenido', 'de_pago', 'publicado', 'completado', 'orden', 'contenido'] as const;

function pick(input: CursoInput): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of CAMPOS) {
    if (input[k] !== undefined) out[k] = input[k];
  }
  return out;
}

@Injectable()
export class CursosService {
  constructor(private readonly db: DatabaseService) {}

  // ── Público: cursos publicados (para la web) ──
  async listarPublicados(): Promise<CursoDB[]> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('[cursos.listarPublicados] error:', error.message);
      return [];
    }
    return (data ?? []) as CursoDB[];
  }

  // ── Admin: todos los cursos (incluidos no publicados) ──
  // Cada curso lleva `revisado` (check personal del admin, desde curso_revisado).
  async listarTodos(): Promise<CursoDB[]> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .order('modalidad', { ascending: true })
      .order('orden', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('[cursos.listarTodos] error:', error.message);
      return [];
    }
    const cursos = (data ?? []) as CursoDB[];
    const revisados = await this.revisadosSet();
    return cursos.map((c) => ({ ...c, revisado: revisados.has(c.id) }));
  }

  // Conjunto de ids de cursos marcados como revisados. Si la tabla aún no
  // existe (migración sin correr) devuelve un set vacío sin romper.
  private async revisadosSet(): Promise<Set<string>> {
    const { data, error } = await this.db.getClient()
      .from(TABLE_REVISADO)
      .select('curso_id')
      .eq('revisado', true);
    if (error) {
      console.warn('[cursos.revisadosSet] error:', error.message);
      return new Set();
    }
    return new Set((data ?? []).map((r: any) => r.curso_id as string));
  }

  // Marca/desmarca un curso como revisado (upsert por curso_id).
  async setRevisado(id: string, revisado: boolean): Promise<{ success: boolean; revisado: boolean }> {
    const { error } = await this.db.getClient()
      .from(TABLE_REVISADO)
      .upsert(
        { curso_id: id, revisado, updated_at: new Date().toISOString() },
        { onConflict: 'curso_id' },
      );
    if (error) throw new Error(`No se pudo actualizar la revisión: ${error.message}`);
    return { success: true, revisado };
  }

  async getUno(id: string): Promise<CursoDB | null> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.warn('[cursos.getUno] error:', error.message);
      return null;
    }
    return (data as CursoDB) ?? null;
  }

  async crear(input: CursoInput): Promise<CursoDB> {
    const row = {
      ...pick(input),
      contenido: input.contenido ?? [],
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .insert(row)
      .select('*')
      .single();
    if (error) throw new Error(`No se pudo crear el curso: ${error.message}`);
    return data as CursoDB;
  }

  async actualizar(id: string, input: CursoInput): Promise<CursoDB> {
    const existing = await this.getUno(id);
    if (!existing) throw new NotFoundException('Curso no encontrado');
    const update = { ...pick(input), updated_at: new Date().toISOString() };
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .update(update)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(`No se pudo actualizar el curso: ${error.message}`);
    return data as CursoDB;
  }

  async borrar(id: string): Promise<{ success: boolean }> {
    const { error } = await this.db.getClient().from(TABLE).delete().eq('id', id);
    if (error) {
      console.warn('[cursos.borrar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
