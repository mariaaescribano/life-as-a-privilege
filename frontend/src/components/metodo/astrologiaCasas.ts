import type { PosicionPlaneta } from "./CartaAstral3D/types";

/**
 * Cuántos grados ANTES de la cúspide de la casa siguiente se considera que un
 * planeta ya «toca» las dos casas. Es la regla clásica de la astrología (un
 * planeta pegado a una cúspide se vive también en la casa que está a punto de
 * empezar). Se cambia aquí y nada más.
 */
export const ORBE_CUSPIDE = 3;

/**
 * Las casas en las que se lee un planeta: SU casa y, cuando está a menos de
 * `ORBE_CUSPIDE` grados de la cúspide de la siguiente, también esa. La primera
 * del resultado es siempre la casa que dice la carta.
 *
 * `cusps` son las doce cúspides en grados de longitud (la casa N empieza en
 * `cusps[N - 1]`). Sin cúspides, solo la casa de la carta.
 */
export function casasDelPlaneta(p: PosicionPlaneta, cusps?: number[]): number[] {
  const casa = p.casa;
  if (!Array.isArray(cusps) || cusps.length < 12 || !(casa >= 1 && casa <= 12)) return [casa];
  const siguiente = cusps[casa % 12];
  const distancia = (((siguiente - p.grado) % 360) + 360) % 360;
  return distancia <= ORBE_CUSPIDE ? [casa, (casa % 12) + 1] : [casa];
}
