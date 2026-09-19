/**
 * /diario — el diario de las sesiones: lo que María escribe tras cada sesión y
 * la persona lee en su Home.
 *
 * El panel de administración (/admin/diario/:userId) NO pasa por aquí: va
 * siempre en español, como el resto de /admin.
 */
export const diario = {
  // ── Tarjeta del Home (debajo de «Tu camino») ────────────────────────────
  "diario.titulo": "Tus sesiones",
  "diario.nuevas": "{n} sin leer",
  "diario.verTodas": "Ver todas ({n})",

  // ── Página /diario ──────────────────────────────────────────────────────
  "diario.pagina.titulo": "El diario de tus sesiones",
  "diario.pagina.subtitulo":
    "Lo que trabajamos en cada sesión y por qué. Se va escribiendo sobre la marcha, así que vuelve cuando quieras.",
  "diario.pagina.vacio": "Todavía no hay ninguna sesión escrita aquí.",
  "diario.pagina.volver": "Volver al Mapa",

  /** Encabezado del bloque destacado de cada entrada. */
  "diario.porque": "Por qué te digo esto",
  /** Etiqueta de una entrada sin disciplina concreta. */
  "diario.sinDisciplina": "Sesión",
  "diario.nueva": "Nuevo",
} as const;
