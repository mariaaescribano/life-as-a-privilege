import { Injectable } from '@nestjs/common';
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { DatabaseService } from '../database.service';
import type { ArquetiposOverrides } from './astrologiaTextos.types';

// Rutas a los archivos del frontend que guardan una copia de los overrides. El back y el
// front conviven en el mismo repo; en local el proceso del back corre desde
// `backend/`, así que subimos un nivel hasta la raíz del proyecto.
// Se prueba desde `backend/` (lo normal) y desde la raíz del repo, por si el servidor se arranca desde ahí.
const CARPETA_METODO =
  [
    path.resolve(process.cwd(), '..', 'frontend', 'src', 'components', 'metodo'),
    path.resolve(process.cwd(), 'frontend', 'src', 'components', 'metodo'),
    path.resolve(__dirname, '..', '..', '..', 'frontend', 'src', 'components', 'metodo'),
    path.resolve(__dirname, '..', '..', '..', '..', 'frontend', 'src', 'components', 'metodo'),
  ].find((p) => existsSync(p)) ?? path.resolve(process.cwd(), '..', 'frontend', 'src', 'components', 'metodo');
/** PRIVADO: el respaldo que la web lee mientras no haya nada en la BD. */
const OVERRIDES_PATH = path.resolve(CARPETA_METODO, 'astrologiaTextos.overrides.ts');
/** PÚBLICO: copia de seguridad commiteada de lo que ven los usuarios. La web no la lee. */
const PUBLICOS_PATH = path.resolve(CARPETA_METODO, 'astrologiaTextos.publicos.ts');
/** PÚBLICO EN INGLÉS: la traducción automática de lo público. Esta SÍ la lee la web como respaldo. */
const PUBLICOS_EN_PATH = path.resolve(CARPETA_METODO, 'astrologiaTextos.publicos.en.ts');

/** Tabla donde viven los conjuntos de overrides (ver sql/astrologia-arquetipos.sql). Hay DOS filas:
 *  · 'overrides' = el PRIVADO (lo escrito por María; solo ella lo ve en /admin/astrologia-textos);
 *  · 'publico'   = el PÚBLICO (lo que ven los usuarios en el recorrido). Empieza sin fila: sin nada
 *    escrito ahí, los usuarios ven los textos originales del proyecto. */
const TABLA = 'astrologia_arquetipos';
export type DestinoArquetipos = 'privado' | 'publico' | 'publico_en';
const FILA: Record<DestinoArquetipos, string> = { privado: 'overrides', publico: 'publico', publico_en: 'publico_en' };
/** Fila con el español TAL COMO estaba cuando se tradujo: sirve para saber qué celdas han cambiado desde entonces. */
const FILA_FUENTE_EN = 'publico_en_fuente';
const MODELO_TRADUCCION = 'claude-sonnet-5-5';

@Injectable()
export class AstrologiaTextosService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Los overrides guardados, o null si no hay fila todavía (o la tabla no está
   * creada). Devolver null y no un objeto vacío es a propósito: el front
   * distingue «no hay nada guardado en BD» → usa los del proyecto, de «hay una
   * fila» → esa fila es la verdad, incluidas las celdas borradas.
   */
  async leerOverrides(destino: DestinoArquetipos = 'publico'): Promise<ArquetiposOverrides | null> {
    const db = this.databaseService.getClient();
    const { data, error } = await db.from(TABLA).select('data').eq('id', FILA[destino]);
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
    destino: DestinoArquetipos = 'publico',
  ): Promise<{ success: boolean; error?: string; archivoLocal?: boolean }> {
    // Validación de forma: { signo: {...}, casa: {...} } de strings.
    const limpio = this.sanear(overrides);
    if (!limpio) {
      return { success: false, error: 'Formato de overrides no válido.' };
    }

    const db = this.databaseService.getClient();
    const { error } = await db
      .from(TABLA)
      .upsert({ id: FILA[destino], data: limpio, updated_at: new Date().toISOString() }, { onConflict: 'id' });

    if (error) {
      const falta = /relation .* does not exist|could not find the table/i.test(error.message);
      return {
        success: false,
        error: falta
          ? 'Falta la tabla astrologia_arquetipos: ejecuta backend/sql/astrologia-arquetipos.sql en Supabase.'
          : `No se pudo guardar en la base de datos: ${error.message}`,
      };
    }

    // Y una copia en el proyecto (solo en local): el privado en su respaldo y el público en su copia de seguridad.
    const archivoLocal = await this.escribirArchivoLocal(limpio, destino);
    if (destino !== 'publico') return { success: true, archivoLocal };

    // Lo público se traduce solo al inglés (solo las celdas nuevas o cambiadas). Si falla, lo español ya está guardado.
    const trad = await this.traducirPublico(limpio);
    return { success: true, archivoLocal, ...trad };
  }

  // ── Traducción automática de lo público al inglés ───────────────────────────

  /** Pide el texto en inglés a Claude, respetando **negrita**, *cursiva*, --- y los párrafos. */
  private async traducir(texto: string): Promise<string> {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('Falta ANTHROPIC_API_KEY en el .env del backend.');
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODELO_TRADUCCION,
        max_tokens: 4096,
        system:
          'Eres traductora literaria de español a inglés para una app de astrología y autoconocimiento de tono cálido, cercano y elegante. ' +
          'Traduce el texto que te den a un inglés natural y fluido, fiel al tono y al sentido. ' +
          'Conserva EXACTAMENTE la estructura: los saltos de línea, las líneas con --- , las marcas **negrita** y *cursiva* (en las palabras equivalentes). ' +
          'No añadas notas, comentarios ni comillas. Responde SOLO con la traducción.',
        messages: [{ role: 'user', content: texto }],
      }),
    });
    if (!r.ok) throw new Error(`Traducción: ${r.status} ${(await r.text()).slice(0, 200)}`);
    const j = (await r.json()) as { content?: { type: string; text?: string }[] };
    const out = (j.content ?? []).filter((c) => c.type === 'text').map((c) => c.text ?? '').join('').trim();
    if (!out) throw new Error('Traducción vacía.');
    return out;
  }

  /**
   * Deja la fila «publico_en» al día con lo público: traduce las celdas nuevas o cambiadas, quita las
   * borradas y escribe la copia en el proyecto (en local). Nunca lanza.
   */
  async traducirPublico(
    publico: ArquetiposOverrides,
  ): Promise<{ traducidas?: number; fallidas?: number; errorTraduccion?: string }> {
    try {
      const db = this.databaseService.getClient();
      const previo = (await this.leerOverrides('publico_en')) ?? { signo: {}, casa: {} };
      const { data: filaFuente } = await db.from(TABLA).select('data').eq('id', FILA_FUENTE_EN);
      const fuente = this.sanear((filaFuente?.[0] as { data?: unknown } | undefined)?.data) ?? { signo: {}, casa: {} };

      const nuevo: ArquetiposOverrides = { signo: {}, casa: {} };
      const nuevaFuente: ArquetiposOverrides = { signo: {}, casa: {} };
      const pendientes: { faceta: 'signo' | 'casa'; cuerpo: string; valor: string; texto: string }[] = [];
      for (const faceta of ['signo', 'casa'] as const) {
        for (const [cuerpo, celdas] of Object.entries(publico[faceta])) {
          for (const [valor, texto] of Object.entries(celdas)) {
            const ya = previo[faceta][cuerpo]?.[valor];
            if (ya && fuente[faceta][cuerpo]?.[valor] === texto) {
              (nuevo[faceta][cuerpo] ??= {})[valor] = ya;
              (nuevaFuente[faceta][cuerpo] ??= {})[valor] = texto;
            } else pendientes.push({ faceta, cuerpo, valor, texto });
          }
        }
      }

      let hechas = 0;
      let fallidas = 0;
      let errorTraduccion: string | undefined;
      const CONCURRENCIA = 4;
      for (let i = 0; i < pendientes.length; i += CONCURRENCIA) {
        await Promise.all(
          pendientes.slice(i, i + CONCURRENCIA).map(async (p) => {
            try {
              const en = await this.traducir(p.texto);
              (nuevo[p.faceta][p.cuerpo] ??= {})[p.valor] = en;
              (nuevaFuente[p.faceta][p.cuerpo] ??= {})[p.valor] = p.texto;
              hechas++;
            } catch (e) {
              fallidas++;
              errorTraduccion ??= e instanceof Error ? e.message : 'error desconocido';
            }
          }),
        );
      }

      const ahora = new Date().toISOString();
      await db.from(TABLA).upsert(
        [
          { id: FILA.publico_en, data: nuevo, updated_at: ahora },
          { id: FILA_FUENTE_EN, data: nuevaFuente, updated_at: ahora },
        ],
        { onConflict: 'id' },
      );
      await this.escribirArchivoLocal(nuevo, 'publico_en');
      return { traducidas: hechas, fallidas, ...(errorTraduccion ? { errorTraduccion } : {}) };
    } catch (e) {
      return { errorTraduccion: e instanceof Error ? e.message : 'error desconocido' };
    }
  }

  /**
   * Reescribe el módulo de overrides del proyecto. Solo tiene sentido fuera de
   * producción (en el servidor el archivo no existe y el disco se borra). No
   * lanza: devuelve si pudo o no.
   */
  private async escribirArchivoLocal(overrides: ArquetiposOverrides, destino: DestinoArquetipos = 'privado'): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') return false;
    const ruta = destino === 'publico' ? PUBLICOS_PATH : destino === 'publico_en' ? PUBLICOS_EN_PATH : OVERRIDES_PATH;
    try {
      await fs.access(path.dirname(ruta));
      const contenido =
        destino === 'publico' ? this.renderPublico(overrides) : destino === 'publico_en' ? this.renderPublicoEn(overrides) : this.render(overrides);
      await fs.writeFile(ruta, contenido, 'utf8');
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

  /** El módulo .ts de la copia de seguridad de lo PÚBLICO. */
  private renderPublico(overrides: ArquetiposOverrides): string {
    const json = JSON.stringify(overrides, null, 2);
    return (
      '// AUTO-GENERADO por el editor de admin (/admin/astrologia-textos). No editar a mano.\n' +
      '// COPIA DE SEGURIDAD de los textos PÚBLICOS de los arquetipos (lo que ven los usuarios).\n' +
      '// La que MANDA es la fila «publico» de la tabla astrologia_arquetipos; la web no lee este\n' +
      '// archivo: está aquí para que los textos queden commiteados con el código.\n' +
      'export const ARQUETIPOS_PUBLICOS_RESPALDO: {\n' +
      '  signo: Record<string, Record<string, string>>;\n' +
      '  casa: Record<string, Record<string, string>>;\n' +
      `} = ${json};\n`
    );
  }

  /** El módulo .ts del inglés automático de lo público. La web lo usa de respaldo si la BD no responde. */
  private renderPublicoEn(overrides: ArquetiposOverrides): string {
    const json = JSON.stringify(overrides, null, 2);
    return (
      '// AUTO-GENERADO por el editor de admin (/admin/astrologia-textos). No editar a mano.\n' +
      '// Traducción AUTOMÁTICA al inglés de los textos PÚBLICOS de los arquetipos.\n' +
      '// La que MANDA es la fila «publico_en» de la tabla astrologia_arquetipos; este archivo es el\n' +
      '// respaldo commiteado que la web usa si la BD no responde.\n' +
      'export const ARQUETIPOS_PUBLICOS_EN: {\n' +
      '  signo: Record<string, Record<string, string>>;\n' +
      '  casa: Record<string, Record<string, string>>;\n' +
      `} = ${json};\n`
    );
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
