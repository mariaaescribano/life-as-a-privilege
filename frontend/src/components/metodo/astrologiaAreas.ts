// ─────────────────────────────────────────────────────────────────────────
// LAS ÁREAS DEL CAMINO DE ASTROLOGÍA · ÁREA 1 … ÁREA 12 (una por casa).
//
// El TEXTO de cada área (la caja de arriba, con scroll vertical) es de María: se escribe aquí, en español
// y, si hace falta, en inglés. Párrafos separados por una línea en blanco (\n\n). Mientras un área no
// tenga texto, su página enseña el aviso «pendiente».
// ─────────────────────────────────────────────────────────────────────────

export const AREAS_TOTAL = 12;

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
