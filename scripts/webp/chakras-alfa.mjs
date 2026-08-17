/* ─────────────────────────────────────────────────────────────────────────────
 *  DEVUELVE LA TRANSPARENCIA a los mandalas de los chakras
 *  (frontend/public/viñetas/hinduismo/chakras/botones/1..7.webp)
 *
 *  Qué pasó: esos siete PNG venían recortados en círculo sobre transparente, y
 *  al convertirlos a WebP (lote 42) se perdió el canal alfa. Las esquinas, que
 *  eran transparentes, quedaron en NEGRO PURO (0,0,0), y en la caja del mapa se
 *  veían como cuatro picos negros alrededor del mandala.
 *
 *  Por qué se puede arreglar sin el original: el dibujo es un círculo INSCRITO
 *  en el cuadrado —toca los cuatro bordes, comprobado— y todo lo que queda
 *  fuera de él es el negro de relleno. Así que basta con recortar por ese mismo
 *  círculo: dentro no se toca un solo píxel, y fuera vuelve a ser transparente.
 *
 *  El radio se mete 1 px hacia dentro a propósito: el filo del círculo era
 *  semitransparente en el original y quedó mezclado con el negro, así que ese
 *  anillo de un píxel se descarta en vez de dejar un halo oscuro.
 *
 *  Uso (desde la raíz del repo):  node scripts/webp/chakras-alfa.mjs
 *  Es idempotente: si el archivo ya tiene alfa, lo deja en paz.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const sharp = (await import(
  pathToFileURL(path.join(RAIZ, "frontend/node_modules/sharp/dist/index.cjs")).href
)).default;

const DIR = path.join(RAIZ, "frontend/public/viñetas/hinduismo/chakras/botones");

for (const f of (await fs.readdir(DIR)).filter((f) => f.endsWith(".webp")).sort()) {
  const abs = path.join(DIR, f);
  const origen = await fs.readFile(abs);
  const { width, height, hasAlpha } = await sharp(origen).metadata();

  if (hasAlpha) {
    console.log(`  = ${f}  (ya tiene alfa)`);
    continue;
  }

  const r = Math.min(width, height) / 2 - 1;
  const mascara = Buffer.from(
    `<svg width="${width}" height="${height}">` +
    `<circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="#fff"/></svg>`,
  );

  const buf = await sharp(origen)
    .ensureAlpha()
    .composite([{ input: mascara, blend: "dest-in" }])
    .webp({ quality: 80, effort: 6, alphaQuality: 100 })
    .toBuffer();

  await fs.writeFile(abs, buf);
  console.log(`  ✓ ${f}  ${width}x${height}  ${Math.round(buf.length / 1024)} kB`);
}
