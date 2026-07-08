import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import type { AstroTextoInput, AstroTextoRow } from './astrologiaTextos.types';

const TABLA = 'astrologia_textos';

@Injectable()
export class AstrologiaTextosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Un texto concreto (para el popup). Devuelve null si no existe. */
  async getUno(cuerpo: string, faceta: string, valor: string): Promise<{ texto: string | null }> {
    const { data, error } = await this.databaseService.getClient()
      .from(TABLA)
      .select('texto')
      .eq('cuerpo', cuerpo)
      .eq('faceta', faceta)
      .eq('valor', valor)
      .maybeSingle();

    if (error) {
      console.warn('[astrologiaTextos.getUno] error:', error.message);
      return { texto: null };
    }
    return { texto: data?.texto ?? null };
  }

  /** Todas las interpretaciones (para el editor de admin). */
  async listarTodos(): Promise<AstroTextoRow[]> {
    const { data, error } = await this.databaseService.getClient()
      .from(TABLA)
      .select('*');

    if (error) {
      console.warn('[astrologiaTextos.listarTodos] error:', error.message);
      return [];
    }
    return (data ?? []) as AstroTextoRow[];
  }

  /** Guarda (upsert) una interpretación. */
  async guardar(input: AstroTextoInput): Promise<{ success: boolean }> {
    const row = {
      cuerpo: input.cuerpo,
      faceta: input.faceta,
      valor: String(input.valor),
      texto: input.texto ?? '',
      updated_at: new Date().toISOString(),
    };
    const { error } = await this.databaseService.getClient()
      .from(TABLA)
      .upsert(row, { onConflict: 'cuerpo,faceta,valor' });

    if (error) {
      console.warn('[astrologiaTextos.guardar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  /** Upsert en bloque (importación inicial desde el frontend). */
  async guardarBloque(inputs: AstroTextoInput[]): Promise<{ success: boolean; count: number }> {
    const rows = (inputs ?? [])
      .filter((i) => i && i.cuerpo && i.faceta && i.valor != null)
      .map((i) => ({
        cuerpo: i.cuerpo,
        faceta: i.faceta,
        valor: String(i.valor),
        texto: i.texto ?? '',
        updated_at: new Date().toISOString(),
      }));
    if (rows.length === 0) return { success: true, count: 0 };

    const { error } = await this.databaseService.getClient()
      .from(TABLA)
      .upsert(rows, { onConflict: 'cuerpo,faceta,valor' });

    if (error) {
      console.warn('[astrologiaTextos.guardarBloque] error:', error.message);
      return { success: false, count: 0 };
    }
    return { success: true, count: rows.length };
  }
}
