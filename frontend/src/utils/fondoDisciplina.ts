// La acuarela de cada disciplina, reconocida por su color `<disc>Bg`. La usan
// los sellos redondos (tick de «leído», X de cerrar) para llevar de fondo la
// imagen de SU disciplina y no un color plano.
import { fisiologiaBg, fisiologiaTxt, nutricionBg, nutricionTxt } from "../GlobalVariables";

const FONDO_POR_BG: Record<string, string> = {
  [fisiologiaBg]: "/img/fondos/fisio.webp",
  [nutricionBg]: "/img/fondos/nutri.webp",
};

/** Ruta de la acuarela de la disciplina cuyo `Bg` es este color (o undefined). */
export function fondoDeDisciplina(bg?: string): string | undefined {
  return bg ? FONDO_POR_BG[bg] : undefined;
}

const TXT_POR_BG: Record<string, string> = {
  [fisiologiaBg]: fisiologiaTxt,
  [nutricionBg]: nutricionTxt,
};

/** El `<disc>Txt` de la disciplina cuyo `Bg` es este color (o undefined). */
export function txtDeDisciplina(bg?: string): string | undefined {
  return bg ? TXT_POR_BG[bg] : undefined;
}
