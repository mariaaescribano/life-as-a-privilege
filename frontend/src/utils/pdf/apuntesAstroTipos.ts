// Tipos de «Crea tus apuntes» de ASTROLOGÍA. Sin imports pesados: la página los usa y el
// generador (jsPDF + Garamond, ~700 KB) solo se carga al pulsar «Descargar».

/** Un tramo de un apunte: un subtítulo opcional y sus párrafos. */
export interface BloqueApunte {
  sub?: string;
  parrafos: string[];
}

/** Una cosa que la persona puede llevarse: un signo, una casa, un planeta, un aspecto. */
export interface ItemApunte {
  key: string;
  titulo: string;
  /** Una línea explicando qué es (se lee bajo el título en la lista). */
  resumen?: string;
  /** Color (#rrggbb) del título del capítulo en el PDF: el del planeta, el del signo… */
  color?: string;
  /** Ilustración del capítulo (va con el primer bloque). */
  foto?: string;
  /** El contenido. Es asíncrono porque los textos de la carta se piden al servidor al descargar. */
  bloques: () => Promise<BloqueApunte[]>;
}

/** Un grupo plegable dentro de una sección (Signos, Casas, Planetas, Aspectos). */
export interface GrupoApunte {
  key: string;
  titulo: string;
  items: ItemApunte[];
}

/** Una de las dos cajas grandes: la teoría o la carta de la persona. */
export interface SeccionApunte {
  key: "teoria" | "carta";
  titulo: string;
  grupos: GrupoApunte[];
}

export const itemsDe = (secciones: SeccionApunte[]) =>
  secciones.flatMap((s) => s.grupos.flatMap((g) => g.items.map((i) => ({ seccion: s, grupo: g, item: i }))));
