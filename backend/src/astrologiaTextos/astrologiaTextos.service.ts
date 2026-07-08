import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
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

@Injectable()
export class AstrologiaTextosService {
  /**
   * Reescribe el archivo de overrides del proyecto. Es una herramienta de
   * autoría LOCAL: solo escribe si estamos fuera de producción y el archivo
   * destino existe en el árbol de trabajo. En producción no tiene sentido
   * (el bundle ya está construido) y devuelve un aviso claro.
   */
  async guardarOverrides(
    overrides: ArquetiposOverrides,
  ): Promise<{ success: boolean; error?: string }> {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error:
          'El editor de arquetipos solo funciona en local (edita el archivo del proyecto). Haz los cambios en local y despliega.',
      };
    }

    // Validación de forma: { signo: {...}, casa: {...} } de strings.
    const limpio = this.sanear(overrides);
    if (!limpio) {
      return { success: false, error: 'Formato de overrides no válido.' };
    }

    try {
      await fs.access(path.dirname(OVERRIDES_PATH));
    } catch {
      return {
        success: false,
        error: `No encuentro el proyecto frontend en ${OVERRIDES_PATH}. Ejecuta el back desde la carpeta backend/ del repo.`,
      };
    }

    const contenido = this.render(limpio);
    try {
      await fs.writeFile(OVERRIDES_PATH, contenido, 'utf8');
      return { success: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error desconocido';
      console.warn('[astrologiaArquetipos.guardarOverrides] error:', msg);
      return { success: false, error: `No se pudo escribir el archivo: ${msg}` };
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
      '// astrologiaTextos.ts. Se persiste en local y se commitea como parte del proyecto.\n' +
      'export const ARQUETIPOS_OVERRIDES: {\n' +
      '  signo: Record<string, Record<string, string>>;\n' +
      '  casa: Record<string, Record<string, string>>;\n' +
      `} = ${json};\n`
    );
  }
}
