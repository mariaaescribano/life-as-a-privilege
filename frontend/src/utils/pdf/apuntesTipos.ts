// ─────────────────────────────────────────────────────────────────────────
// «Crea tus propios apuntes» · los TIPOS y los dos cálculos de la pantalla.
//
// Está separado del generador (apuntes.ts) a propósito: el generador arrastra
// jsPDF y la tipografía embebida —unos 700 KB— y no hacen ninguna falta hasta
// que alguien pulsa «Descargar». La página se pinta con este archivo, que no
// arrastra nada, y el peso llega solo cuando se usa.
//
// `Taller` entra como TIPO (import type): se borra al compilar, así que declarar
// aquí los capítulos no trae el taller al paquete de la página.
// ─────────────────────────────────────────────────────────────────────────
import type { Taller } from "./atelier";
import type { Tema } from "./temas";
import type { FotoCache } from "./fotos";

/** Un capítulo que la persona puede marcar o no. */
export interface ApuntesCapitulo {
  key: string;
  /** Lo que se lee en la casilla y encabeza el capítulo del PDF. */
  titulo: string;
  /** Una línea explicando qué se lleva si lo marca. */
  resumen: string;
  /** Todas las ilustraciones que usa (para precargarlas y pesar el archivo). */
  fotos: string[];
  /** Pinta el capítulo. `conFotos` es false si ha pedido apuntes solo de texto. */
  pintar: (t: Taller, fotos: FotoCache, conFotos: boolean) => void;
  /** Si está, el capítulo sale con candado y este motivo (le falta hacer algo). */
  bloqueado?: string;
  /** Marcado de salida la primera vez. */
  pordefecto?: boolean;
}

/** Una portada a elegir: la misma foto que ha visto en la web. */
export interface ApuntesPortada {
  key: string;
  label: string;
  src: string;
}

/** El libro de una disciplina: el molde, sin la selección de nadie. */
export interface ApuntesLibro {
  /** Nombre de la disciplina, para cabeceras y pies. */
  disciplina: string;
  tema: Tema;
  titulo: string;
  subtitulo?: string;
  /** Frase bajo la lámina de la portada. */
  pieLamina?: string;
  /** Base del nombre del archivo: «mis-apuntes-medicina-china». */
  archivo: string;
  portadas: ApuntesPortada[];
  capitulos: ApuntesCapitulo[];
}

/** Los capítulos marcados, en el orden del libro y sin los bloqueados. */
export function capitulosElegidos(libro: ApuntesLibro, seleccion: string[]): ApuntesCapitulo[] {
  return libro.capitulos.filter((c) => !c.bloqueado && seleccion.includes(c.key));
}

/** Cuántas ilustraciones lleva una selección (para el aviso de peso). */
export function fotosDeSeleccion(libro: ApuntesLibro, seleccion: string[]): string[] {
  const todas = capitulosElegidos(libro, seleccion).flatMap((c) => c.fotos);
  return Array.from(new Set(todas.filter(Boolean)));
}
