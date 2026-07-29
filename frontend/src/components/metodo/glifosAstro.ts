// ─────────────────────────────────────────────────────────────────────────
// Glifos astrológicos: que se vean SIEMPRE como iconos, nunca como emoji.
//
// · SIGNOS del zodíaco → NO se usan sus caracteres. Se pintan dibujados, trazo
//   a trazo (ver `signosIconos.ts` y `GlifoSigno` en `Glifo.tsx`). Esos
//   caracteres tienen versión emoji y Windows los sacaba morados, con recuadro
//   y sin respetar el color, así que se han quitado de toda la app.
//
// · PLANETAS y puntos (☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇ ⚷ ⚸ ☊ ☋) → sí van con su símbolo,
//   pero pidiendo explícitamente las fuentes de SÍMBOLOS, que traen la versión
//   monocroma. Sin esa lista, el navegador busca por su cuenta y puede acabar
//   en la fuente de emoji.
// ─────────────────────────────────────────────────────────────────────────

/** Fuente para los glifos de planeta. Las de símbolos van PRIMERO: son las que
 *  traen la versión monocroma (tipo icono). */
export const FUENTE_GLIFOS =
  "'Segoe UI Symbol', 'Segoe UI Historic', 'Noto Sans Symbols 2', 'Noto Sans Symbols', " +
  "'Apple Symbols', 'DejaVu Sans', 'Times New Roman', Georgia, serif";

/** Selector de presentación de TEXTO (U+FE0E): «no me lo pintes como emoji». */
export const VS_TEXTO = "︎";
