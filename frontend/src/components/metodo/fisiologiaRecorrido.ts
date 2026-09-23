// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · FISIOLOGÍA
//
// Fuente única del orden de las páginas y de los REQUISITOS de cada paso, igual
// que psicologiaRecorrido / tcmRecorrido. Alimenta el botón «Índice»
// (IndiceFisiologia) y su bloqueo secuencial.
//
// Los pasos van numerados SEGUIDOS (1..9) aunque el recorrido se ande por
// niveles (La materia, La Vida): así el Índice puede desbloquear paso a paso y
// el camino de /home cuenta una sola vez (ver data/camino.ts: fisiologia = 9).
// El «x/y» del header de cada página sigue contando dentro de su nivel: eso es
// lo que la usuaria ve mientras anda ese tramo.
//
// ⚠️ Si cambias el gate del botón «siguiente» de una página, cámbialo también
//    aquí para que el Índice siga coincidiendo con lo que se puede hacer.
// ─────────────────────────────────────────────────────────────────────────
import { traducir, type ClaveTexto } from "../../i18n";
import { SISTEMAS } from "../../hardCoded/espacio/SistemasFisiologia";
import type { PasoRecorrido } from "./psicologiaRecorrido";

/** Un nivel del recorrido (el título del bloque en el Índice y sus pasos). */
export interface NivelFisiologia {
  label: string;
  /** Números de paso (globales) que caen dentro del nivel. */
  pasos: PasoRecorrido[];
}

// Las páginas, en orden. El nombre de cada paso NO se escribe aquí: se cita por
// su clave —la misma que usan los botones «← anterior / siguiente →»—, así que
// el Índice y los botones nunca pueden decir cosas distintas.
const PASOS: { clave: ClaveTexto; path: string; nivel: string }[] = [
  { nivel: "MATERIA", clave: "fisiologia.particulas.titulo",     path: "/metodo/fisiologia/particulas" },
  { nivel: "MATERIA", clave: "fisiologia.atomos.titulo",         path: "/metodo/fisiologia/atomos" },
  { nivel: "MATERIA", clave: "fisiologia.moleculas.titulo",      path: "/metodo/fisiologia/moleculas" },
  { nivel: "MATERIA", clave: "fisiologia.macromoleculas.titulo", path: "/metodo/fisiologia/macromoleculas" },
  { nivel: "MATERIA", clave: "fisiologia.estructuras.corto",     path: "/metodo/fisiologia/estructuras" },
  { nivel: "VIDA",    clave: "fisiologia.celula.titulo",         path: "/metodo/fisiologia/celula" },
  { nivel: "VIDA",    clave: "fisiologia.lasCelulas.corto",      path: "/metodo/fisiologia/todas-tus-celulas" },
  { nivel: "VIDA",    clave: "fisiologia.sistemas.titulo",       path: "/metodo/fisiologia/sistemas" },
  { nivel: "VIDA",    clave: "fisiologia.organismo.titulo",      path: "/metodo/fisiologia/organismo" },
];

export const FISIOLOGIA_TOTAL = PASOS.length;

/** Las rutas del recorrido, en orden (1-based: `rutaPaso(n)` = PASOS[n-1]). */
export const fisiologiaRutas = (): string[] => PASOS.map((p) => p.path);

/** Los pasos agrupados por nivel, con los títulos ya en el idioma activo. Es una
 *  FUNCIÓN: un array de módulo se quedaría con los títulos congelados en el
 *  idioma de arranque (quien lo pinte debe llamar a `useIdioma()`). */
export const fisiologiaNiveles = (): NivelFisiologia[] => {
  const niveles: NivelFisiologia[] = [];
  PASOS.forEach((p, i) => {
    let nivel = niveles.find((g) => g.label === p.nivel);
    if (!nivel) { nivel = { label: p.nivel, pasos: [] }; niveles.push(nivel); }
    nivel.pasos.push({ n: i + 1, titulo: traducir(p.clave), ruta: () => p.path });
  });
  return niveles;
};

/** El índice plano (por si hace falta fuera del Índice de dos bloques). */
export const fisiologiaIndice = (): PasoRecorrido[] =>
  fisiologiaNiveles().flatMap((g) => g.pasos);

// ─────────────────────────────────────────────────────────────────────────
// REQUISITOS · qué hay que haber hecho para pasar de cada paso al siguiente.
// Son los MISMOS gates que tiene el botón «siguiente» de cada página, leídos
// del blob `data` de metodo_fisiologia.
// ─────────────────────────────────────────────────────────────────────────

/** Gate para avanzar MÁS ALLÁ del paso `n` (1-based): true = puedes pasar al
 *  siguiente. Los pasos sin requisito devuelven true. */
export function puedeAvanzarFisiologia(data: any, n: number): boolean {
  const d = data || {};
  const lista = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  switch (n) {
    case 1: return !!d.particulas_hecho;                              // Partículas: átomo montado
    case 2: return !!d.atomos_hecho;                                  // Átomos: los tres montados
    case 3: return !!d.moleculas_hecho;                               // Moléculas: todas formadas
    case 4: return !!d.macromoleculas_hecho;                          // Macromoléculas: las cuatro
    case 5: return !!d.estructuras_hecho;                             // Estructuras: todas
    case 6: return !!d.celula_hecho;                                  // La célula: montada
    case 8: {                                                         // Sistemas: los 12 abiertos
      const vistos = new Set(lista(d.sistemas_vistos));
      return SISTEMAS.every((s) => vistos.has(s.key));
    }
    // 7 («Todas tus células») no pide nada para pasar: se puede seguir cuando se
    // quiera, aunque queden células por abrir.
    default: return true;                                             // 7, 9 y cualquier otro
  }
}

/** Paso máximo ALCANZABLE (1-based): el prefijo contiguo de páginas a las que la
 *  usuaria ya puede llegar respetando el requisito de cada paso. */
export function pasoAlcanzableFisiologia(data: any, _expId?: string): number {
  let n = 1;
  while (n < FISIOLOGIA_TOTAL && puedeAvanzarFisiologia(data, n)) n++;
  return n;
}
