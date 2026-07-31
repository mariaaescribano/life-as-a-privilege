import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DatabaseService } from '../database.service';
import type { ArquetiposOverrides } from './astrologiaTextos.types';

// Ruta al archivo hardcodeado del frontend que guarda los overrides. El back y el
// front conviven en el mismo repo; en local el proceso del back corre desde
// `backend/`, así que subimos un nivel hasta la raíz del proyecto.
const OVERRIDES_PATH = path.resolve(
  process.cwd(),
  '..',
  'frontend',
  'src',
  'components',
  'metodo',
  'astrologiaTextos.overrides.ts',
);

/** Tabla y fila única donde vive el conjunto de overrides (ver sql/astrologia-arquetipos.sql). */
const TABLA = 'astrologia_arquetipos';
const FILA = 'overrides';

@Injectable()
export class AstrologiaTextosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Los overrides guardados, o null si no hay fila todavía (o la tabla no está
   * creada). Devolver null y no un objeto vacío es a propósito: el front
   * distingue «no hay nada guardado en BD» → usa los del proyecto, de «hay una
   * fila» → esa fila es la verdad, incluidas las celdas borradas.
   */
  async leerOverrides(): Promise<ArquetiposOverrides | null> {
    const db = this.databaseService.getClient();
    const { data, error } = await db.from(TABLA).select('data').eq('id', FILA);
    if (error) {
      // Sin tabla creada todavía: el front cae a los textos del proyecto.
      console.warn('[astrologiaArquetipos.leerOverrides]', error.message);
      return null;
    }
    const fila = data?.[0] as { data?: unknown } | undefined;
    if (!fila) return null;
    return this.sanear(fila.data) ?? { signo: {}, casa: {} };
  }

  /**
   * Guarda el conjunto de overrides.
   *
   * En la BASE DE DATOS, que es lo único que sobrevive a un deploy: el disco
   * del servidor es efímero y el bundle del front ya está construido. Además,
   * cuando se está trabajando en local, reescribe también el archivo del
   * proyecto para que los textos queden commiteados con el código (respaldo y
   * arranque en frío). Si eso falla, no se rompe el guardado: lo importante ya
   * está en la BD.
   */
  async guardarOverrides(
    overrides: ArquetiposOverrides,
  ): Promise<{ success: boolean; error?: string; archivoLocal?: boolean }> {
    // Validación de forma: { signo: {...}, casa: {...} } de strings.
    const limpio = this.sanear(overrides);
    if (!limpio) {
      return { success: false, error: 'Formato de overrides no válido.' };
    }

    const db = this.databaseService.getClient();
    const { error } = await db
      .from(TABLA)
      .upsert({ id: FILA, data: limpio, updated_at: new Date().toISOString() }, { onConflict: 'id' });

    if (error) {
      const falta = /relation .* does not exist|could not find the table/i.test(error.message);
      return {
        success: false,
        error: falta
          ? 'Falta la tabla astrologia_arquetipos: ejecuta backend/sql/astrologia-arquetipos.sql en Supabase.'
          : `No se pudo guardar en la base de datos: ${error.message}`,
      };
    }

    return { success: true, archivoLocal: await this.escribirArchivoLocal(limpio) };
  }

  /**
   * Reescribe el módulo de overrides del proyecto. Solo tiene sentido fuera de
   * producción (en el servidor el archivo no existe y el disco se borra). No
   * lanza: devuelve si pudo o no.
   */
  private async escribirArchivoLocal(overrides: ArquetiposOverrides): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') return false;
    try {
      await fs.access(path.dirname(OVERRIDES_PATH));
      await fs.writeFile(OVERRIDES_PATH, this.render(overrides), 'utf8');
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error desconocido';
      console.warn('[astrologiaArquetipos] no se pudo escribir el archivo local:', msg);
      return false;
    }
  }

  /** Deja el objeto con exactamente { signo, casa } y solo valores string no vacíos. */
  private sanear(input: unknown): ArquetiposOverrides | null {
    if (!input || typeof input !== 'object') return null;
    const src = input as Record<string, unknown>;
    const out: ArquetiposOverrides = { signo: {}, casa: {} };
    for (const faceta of ['signo', 'casa'] as const) {
      const porCuerpo = src[faceta];
      if (porCuerpo == null) continue;
      if (typeof porCuerpo !== 'object') return null;
      for (const [cuerpo, celdas] of Object.entries(porCuerpo as Record<string, unknown>)) {
        if (!celdas || typeof celdas !== 'object') continue;
        for (const [valor, texto] of Object.entries(celdas as Record<string, unknown>)) {
          if (typeof texto !== 'string') continue;
          if (texto.trim() === '') continue;
          (out[faceta][cuerpo] ??= {})[valor] = texto;
        }
      }
    }
    return out;
  }

  /** Genera el contenido del módulo .ts a partir del objeto de overrides. */
  private render(overrides: ArquetiposOverrides): string {
    const json = JSON.stringify(overrides, null, 2);
    return (
      '// AUTO-GENERADO por el editor de admin (/admin/astrologia-textos). No editar a mano.\n' +
      '// Overrides de las interpretaciones de la carta (arquetipos del recorrido):\n' +
      '// solo las celdas editadas desde el panel; el resto cae al texto original de\n' +
      '// astrologiaTextos.ts.\n' +
      '//\n' +
      '// La copia que MANDA es la fila de la tabla astrologia_arquetipos (es la que\n' +
      '// funciona en producción). Este archivo es el respaldo commiteado: se usa\n' +
      '// mientras no haya nada guardado en la BD.\n' +
      'export const ARQUETIPOS_OVERRIDES: {\n' +
      '  signo: Record<string, Record<string, string>>;\n' +
      '  casa: Record<string, Record<string, string>>;\n' +
      `} = ${json};\n`
    );
  }
}
