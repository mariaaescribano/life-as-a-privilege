import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import type { VideoDB, VideoInput } from './videos.types';

const TABLE = 'video';

// Solo estos campos se pueden escribir desde el API (evita inyectar columnas raras).
const CAMPOS = ['disciplina', 'titulo', 'portada', 'url', 'publicado', 'orden'] as const;

function pick(input: VideoInput): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of CAMPOS) {
    if (input[k] !== undefined) out[k] = input[k];
  }
  return out;
}

@Injectable()
export class VideosService {
  constructor(private readonly db: DatabaseService) {}

  // ── Público: los vídeos publicados (para la página /videos) ──
  async listarPublicados(): Promise<VideoDB[]> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[videos.listarPublicados] error:', error.message);
      return [];
    }
    return (data ?? []) as VideoDB[];
  }

  // ── Admin: todos, incluidos los ocultos ──
  async listarTodos(): Promise<VideoDB[]> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[videos.listarTodos] error:', error.message);
      return [];
    }
    return (data ?? []) as VideoDB[];
  }

  async getUno(id: string): Promise<VideoDB | null> {
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.warn('[videos.getUno] error:', error.message);
      return null;
    }
    return (data as VideoDB) ?? null;
  }

  async crear(input: VideoInput): Promise<VideoDB> {
    const row = { ...pick(input), updated_at: new Date().toISOString() };
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .insert(row)
      .select('*')
      .single();
    if (error) throw new Error(`No se pudo crear el vídeo: ${error.message}`);
    return data as VideoDB;
  }

  async actualizar(id: string, input: VideoInput): Promise<VideoDB> {
    const existing = await this.getUno(id);
    if (!existing) throw new NotFoundException('Vídeo no encontrado');
    const update = { ...pick(input), updated_at: new Date().toISOString() };
    const { data, error } = await this.db.getClient()
      .from(TABLE)
      .update(update)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(`No se pudo actualizar el vídeo: ${error.message}`);
    return data as VideoDB;
  }

  async borrar(id: string): Promise<{ success: boolean }> {
    const { error } = await this.db.getClient().from(TABLE).delete().eq('id', id);
    if (error) {
      console.warn('[videos.borrar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }
}
