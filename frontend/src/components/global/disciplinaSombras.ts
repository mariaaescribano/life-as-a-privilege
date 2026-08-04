// ─────────────────────────────────────────────────────────────────────────
// Sombras de TEXTO sobre el fondo propio de una disciplina.
//
// Vivían dentro de ElMetodo.tsx; se sacan aquí porque las páginas de
// presentación (/d/:disciplina) pintan las mismas cajas con el mismo fondo y
// deben leerse EXACTAMENTE igual. Si hay que retocar el contraste, se retoca
// aquí y cambia en todos los sitios.
//
// La mayoría de disciplinas usan una "luz" suave basada en su propio color
// (naturalBoxShadow). Tres piden sombra negra porque su foto de fondo tiene
// zonas claras que se comen la letra, y Medicina China la pide granate.
// ─────────────────────────────────────────────────────────────────────────

import { cabalaNom, culturaNom, fisiologiaNom, tcmNom } from "../../GlobalVariables";

export const SHADOW_BLACK =
  "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.75), 0 0 5px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.19)";

export const SHADOW_GRANATE =
  "0 1px 4px rgba(56,8,8,0.95), 0 2px 12px rgba(56,8,8,0.82), 0 0 5px rgba(56,8,8,0.78), 0 0 18px rgba(255,255,255,0.17)";

/** Luz suave del propio color de la disciplina (el caso general). */
export const naturalBoxShadow = (bg: string) =>
  `0 1px 3px ${bg}f5, 0 0 6px ${bg}cc, 0 2px 14px ${bg}88, 0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)`;

/** Disciplinas cuya foto de fondo obliga a sombra negra. */
export const esOscuraNegra = (nom: string): boolean =>
  nom === fisiologiaNom || nom === cabalaNom || nom === culturaNom;

/** Sombra del texto dentro de una caja con fondo de disciplina. */
export const sombraTexto = (nom: string, bg: string): string => {
  if (nom === tcmNom) return SHADOW_GRANATE;
  if (esOscuraNegra(nom)) return SHADOW_BLACK;
  return naturalBoxShadow(bg);
};
