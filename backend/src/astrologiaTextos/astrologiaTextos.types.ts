export type FacetaAstro = 'signo' | 'casa';

/**
 * Overrides de las interpretaciones de la carta (arquetipos del recorrido).
 * Estructura: faceta → cuerpo → valor (signo o número de casa como string) → texto.
 */
export interface ArquetiposOverrides {
  signo: Record<string, Record<string, string>>;
  casa: Record<string, Record<string, string>>;
}
