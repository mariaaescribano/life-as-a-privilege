import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

const TABLA = 'nota_pagina';
const MAX_TEXTO = 8000;

/** La ruta sin barra final ni parámetros: es la clave de la nota. */
export function paginaLimpia(valor: unknown): string {
  const ruta = (typeof valor === 'string' ? valor : '').split(/[?#]/)[0].trim().replace(/\/+$/, '');
  if (!ruta.startsWith('/') || ruta.length > 200) throw new BadRequestException('Página no válida');
  return ruta;
}

/** ¿El error es «esta tabla no existe» (su SQL sin correr)? */
const faltaTabla = (error: { code?: string; message?: string } | null): boolean => {
  if (!error) return false;
  if (error.code === '42P01' || error.code === 'PGRST205') return true;
  const m = error.message ?? '';
  return m.includes(TABLA) && /exist|schema cache/i.test(m);
};

export interface NotaPagina {
  borrador: string;
  publicada: string | null;
  publicada_at: string | null;
}

@Injectable()
export class NotasPaginaService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.getClient();
  }

  private falloTabla(error: { message?: string }): never {
    console.warn('[notasPagina] error:', error.message);
    throw new ConflictException('No se pudo guardar la nota (¿falta correr backend/sql/nota-pagina.sql?)');
  }

  /** La nota entera (para María). Sin nota: vacía. Sin tabla: vacía y avisa. */
  async completa(userId: string, pagina: string): Promise<NotaPagina & { sinTabla?: boolean }> {
    const { data, error } = await this.db
      .from(TABLA)
      .select('borrador, publicada, publicada_at')
      .eq('user_id', userId)
      .eq('pagina', pagina)
      .maybeSingle();
    if (error) {
      if (faltaTabla(error)) return { borrador: '', publicada: null, publicada_at: null, sinTabla: true };
      console.warn('[notasPagina.completa] error:', error.message);
      return { borrador: '', publicada: null, publicada_at: null };
    }
    return (data as NotaPagina | null) ?? { borrador: '', publicada: null, publicada_at: null };
  }

  /** Lo que ve la PERSONA: solo lo publicado. El borrador nunca sale de aquí. */
  async publicadaPara(userId: string, pagina: string): Promise<{ publicada: string | null; publicada_at: string | null }> {
    const { data, error } = await this.db
      .from(TABLA)
      .select('publicada, publicada_at')
      .eq('user_id', userId)
      .eq('pagina', pagina)
      .maybeSingle();
    if (error || !data) return { publicada: null, publicada_at: null };
    const d = data as { publicada: string | null; publicada_at: string | null };
    return d.publicada && d.publicada.trim() ? d : { publicada: null, publicada_at: null };
  }

  /** María guarda su borrador (la persona NO lo ve). */
  async guardarBorrador(userId: string, pagina: string, borrador: unknown) {
    const texto = typeof borrador === 'string' ? borrador : '';
    if (texto.length > MAX_TEXTO) throw new BadRequestException('La nota es demasiado larga');
    const { error } = await this.db
      .from(TABLA)
      .upsert({ user_id: userId, pagina, borrador: texto, updated_at: new Date().toISOString() }, { onConflict: 'user_id,pagina' });
    if (error) this.falloTabla(error);
    return { ok: true as const };
  }

  /** María publica: lo que hay en el borrador pasa a ser lo que ve la persona. */
  async publicar(userId: string, pagina: string) {
    const { borrador } = await this.completa(userId, pagina);
    if (!borrador.trim()) throw new BadRequestException('No hay nada que publicar');
    const ahora = new Date().toISOString();
    const { error } = await this.db
      .from(TABLA)
      .upsert(
        { user_id: userId, pagina, borrador, publicada: borrador, publicada_at: ahora, updated_at: ahora },
        { onConflict: 'user_id,pagina' },
      );
    if (error) this.falloTabla(error);
    return { ok: true as const, publicada_at: ahora };
  }

  /** María retira la nota de la vista de la persona (el borrador se queda). */
  async retirar(userId: string, pagina: string) {
    const { error } = await this.db
      .from(TABLA)
      .update({ publicada: null, publicada_at: null, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('pagina', pagina);
    if (error) this.falloTabla(error);
    return { ok: true as const };
  }
}
