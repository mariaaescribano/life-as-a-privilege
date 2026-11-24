// ─────────────────────────────────────────────────────────────────────────
// LAS ÁREAS DEL CAMINO DE ASTROLOGÍA · ÁREA I … ÁREA XII (una por casa), después de «Tu Carta Astral».
//
// El camino va así: 1-4 (Bienvenida, Historia, Explicación, Tu Carta Astral) · 5-16 las doce Áreas · 17 Tu carta en PDF · 18 Despedida · 19 Cursos.
// Este mismo camino lo recorre quien solo ha pedido su lectura de carta astral.
//
// El NOMBRE de cada área está en el diccionario (`metodo.astro.area.N.nombre`). El TEXTO (la caja de arriba, con
// scroll vertical) es de María: se escribe aquí, en español y, si hace falta, en inglés. Párrafos separados por una
// línea en blanco. Mientras un área no tenga texto, su página enseña el aviso «pendiente».
// ─────────────────────────────────────────────────────────────────────────
import { traducir } from "../../i18n";
import type { ClaveTexto } from "../../i18n";

export const AREAS_TOTAL = 12;
/** Cuántos pasos del camino hay ANTES de la primera Área (Bienvenida, Historia, Explicación, Tu Carta Astral). */
export const PASOS_ANTES_DE_AREAS = 4;

export const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const AREAS_TEXTO: Record<number, { es: string; en?: string }> = {
  1: { es: "" },
  2: { es: "" },
  3: { es: "" },
  4: { es: "" },
  5: { es: "" },
  6: { es: "" },
  7: { es: "" },
  8: { es: "" },
  9: { es: "" },
  10: { es: "" },
  11: { es: "" },
  12: { es: "" },
};

/** La ruta de un área. */
export const rutaArea = (n: number) => `/metodo/astrologia/area/${n}`;

/** El número de paso del camino que le toca al área `n` (la 1 es el paso 5). */
export const pasoDeArea = (n: number) => PASOS_ANTES_DE_AREAS + n;

/** «I Mi nacimiento»: el número romano a la izquierda y el nombre, sin la palabra «Área» ni punto, en el idioma activo. */
export const tituloArea = (n: number): string =>
  `${ROMANOS[n - 1]} ${traducir(`metodo.astro.area.${n}.nombre` as ClaveTexto)}`;
