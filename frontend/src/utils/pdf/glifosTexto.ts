// ─────────────────────────────────────────────────────────────────────────
// SÍMBOLOS Y EMOJIS DENTRO DEL TEXTO.
//
// La EB Garamond embebida no trae ☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇ ni emoji (ver glifos.ts: se los come en
// silencio). En un informe escrito a mano eso es perder contenido: «Con el Sol ☉ en Piscis» no
// puede salir «Con el Sol  en Piscis». Aquí se reconocen esos caracteres y se rasterizan en un
// canvas con una fuente del sistema, para que el taller los pinte como una imagen pequeña EN LA
// MISMA LÍNEA que el texto (ver `Taller.parrafoRico`).
//
//  · Símbolos astrológicos: monocromos, del color de la tinta.
//  · Emoji: a todo color, tal como los dibuja el sistema.
// ─────────────────────────────────────────────────────────────────────────

type RGB = [number, number, number];

/** Símbolos astrológicos y similares que se pintan como glifo monocromo. */
const SIMBOLOS = new Set([
  "☉", "☽", "☾", "☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆", "♇", "⚷", "⚸", "☊", "☋", "⚳", "⚴", "⚵", "⚶",
  "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
]);

const EMOJI = /\p{Extended_Pictographic}/u;

/** ¿Este grafema hay que pintarlo como imagen (símbolo o emoji)? */
export function esGlifo(g: string): boolean {
  const base = Array.from(g)[0] ?? "";
  return SIMBOLOS.has(base) || EMOJI.test(g);
}

/** ¿Es un símbolo monocromo (y no un emoji a color)? */
export const esSimbolo = (g: string) => SIMBOLOS.has(Array.from(g)[0] ?? "");

const cache = new Map<string, string>();

/** El glifo como PNG (con fondo transparente). `color` solo cuenta para los símbolos monocromos. */
export function rasterGlifo(g: string, color: RGB): string {
  const simbolo = esSimbolo(g);
  const clave = simbolo ? `${g}|${color.join(",")}` : g;
  const guardado = cache.get(clave);
  if (guardado) return guardado;

  const S = 128;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (simbolo) {
    ctx.font = `${Math.round(S * 0.98)}px 'Segoe UI Symbol','Noto Sans Symbols','Noto Sans Symbols 2','DejaVu Sans','Arial Unicode MS',sans-serif`;
    ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = S * 0.035; // un poco de trazo: a tamaño de texto el símbolo fino se pierde
    ctx.lineJoin = "round";
    // U+FE0E fuerza la versión de texto (monocroma) en los que también existen como emoji (♀ ♂).
    ctx.strokeText(g + "︎", S / 2, S * 0.54);
    ctx.fillText(g + "︎", S / 2, S * 0.54);
  } else {
    ctx.font = `${Math.round(S * 0.86)}px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif`;
    ctx.fillText(g, S / 2, S * 0.54);
  }
  const url = c.toDataURL("image/png");
  if (cache.size < 300) cache.set(clave, url);
  return url;
}

/** Parte un texto en grafemas (un emoji con varios códigos cuenta como uno). */
export function grafemas(texto: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: object) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return Array.from(new Seg("es", { granularity: "grapheme" }).segment(texto), (s) => s.segment);
  return Array.from(texto);
}
