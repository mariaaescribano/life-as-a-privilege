/* ─────────────────────────────────────────────────────────────────────────────
 *  ADELGAZAR los WebP que ya están convertidos
 *
 *  Por qué: Render cobra el ancho de banda a partir de 5 GB al mes, y
 *  `frontend/public` pesa 459 MB. De esos, 143 MB son 521 ilustraciones WebP de
 *  más de 200 kB. No es que estén sin convertir —lo están, `convertir.mjs` hizo
 *  su trabajo—, es que se quedaron más grandes de lo que hace falta:
 *
 *   · Las de los lotes 3 en adelante (Cábala, viñetas repintadas) se dejaron a
 *     calidad 92 y a su tamaño original de 1254 px, a propósito, porque eran
 *     dibujos recién hechos. Pesan ~550 kB cada una: el triple que sus vecinas.
 *   · Las del lote 1 están a 1000 px y calidad 80, que ya está bien, pero se
 *     ven a 400-600 px en pantalla. A 900 px sigue sobrando resolución hasta en
 *     una pantalla retina, y se llevan la mitad del peso.
 *
 *  Así que esto es una segunda pasada sobre lo ya convertido: 900 px de lado y
 *  calidad 75 para todas. NO renombra nada —siguen siendo el mismo `.webp` en
 *  la misma ruta—, así que no hay que tocar ni una línea de código.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/webp/adelgazar.mjs --prueba   → dice qué haría, sin tocar nada
 *    node scripts/webp/adelgazar.mjs            → lo hace
 *
 *  Reglas de seguridad:
 *   · Solo entra lo que pasa de 200 kB. Lo que ya es pequeño se queda quieto:
 *     recomprimir un WebP de 40 kB solo lo empeora, no lo adelgaza.
 *   · Si el resultado no ahorra al menos un 10%, se descarta y se deja el
 *     original. Recomprimir con pérdida sobre pérdida sin ganar nada a cambio
 *     es tirar nitidez a la basura.
 *   · La transparencia se conserva (`alphaQuality` 100). Los mandalas de los
 *     chakras ya se perdieron el alfa una vez, en el lote 42; no otra.
 *   · Queda todo anotado en `scripts/webp/adelgazar.csv`.
 *
 *  Revertir: los originales están en git. Desde la raíz,
 *    git checkout HEAD -- frontend/public
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(RAIZ, "frontend/public");
const sharp = (await import(
  pathToFileURL(path.join(RAIZ, "frontend/node_modules/sharp/dist/index.cjs")).href
)).default;

const LADO_MAX = 900;
const CALIDAD = 75;
/** Por debajo de esto no se toca nada: ya no hay grasa que quitar. */
const UMBRAL = 200 * 1024;
/** Si no se ahorra al menos esto, se deja el original como estaba. */
const AHORRO_MINIMO = 0.10;

const PRUEBA = process.argv.includes("--prueba");

/** Todos los .webp de una carpeta y sus hijas. */
const buscar = async (dir) => {
  const salida = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await buscar(abs)));
    else if (e.name.toLowerCase().endsWith(".webp")) salida.push(abs);
  }
  return salida;
};

const kb = (b) => Math.round(b / 1024);

const todos = (await buscar(PUBLIC)).sort();
const candidatos = [];
for (const abs of todos) {
  const { size } = await fs.stat(abs);
  if (size > UMBRAL) candidatos.push({ abs, size });
}

console.log(
  `${todos.length} WebP en public · ${candidatos.length} pasan de ${kb(UMBRAL)} kB` +
  (PRUEBA ? "  (PRUEBA: no se escribe nada)" : ""),
);

const registro = [["ruta", "bytes_antes", "bytes_despues", "medidas_antes", "medidas_despues"]];
let antes = 0, despues = 0, tocados = 0, intactos = 0;

for (const { abs, size } of candidatos) {
  const rel = path.relative(PUBLIC, abs).split(path.sep).join("/");
  const origen = await fs.readFile(abs);
  const meta = await sharp(origen).metadata();

  const buf = await sharp(origen)
    .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: CALIDAD, effort: 6, alphaQuality: meta.hasAlpha ? 100 : undefined })
    .toBuffer();

  antes += size;

  if (buf.length > size * (1 - AHORRO_MINIMO)) {
    // No compensa: se queda como estaba.
    despues += size;
    intactos++;
    console.log(`  = ${rel}  ${kb(size)} kB  (no compensa)`);
    continue;
  }

  const nueva = await sharp(buf).metadata();
  if (!PRUEBA) await fs.writeFile(abs, buf);
  despues += buf.length;
  tocados++;
  registro.push([
    rel, size, buf.length,
    `${meta.width}x${meta.height}`, `${nueva.width}x${nueva.height}`,
  ]);
  console.log(
    `  ✓ ${rel}  ${meta.width}x${meta.height} ${kb(size)} kB` +
    ` → ${nueva.width}x${nueva.height} ${kb(buf.length)} kB` +
    `  (-${Math.round(100 - (buf.length * 100) / size)}%)`,
  );
}

if (!PRUEBA && registro.length > 1) {
  await fs.writeFile(
    path.join(import.meta.dirname, "adelgazar.csv"),
    registro.map((f) => f.join(",")).join("\n") + "\n",
  );
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(
  `\n${tocados} adelgazados · ${intactos} intactos\n` +
  `${mb(antes)} MB → ${mb(despues)} MB   (-${Math.round(100 - (despues * 100) / antes)}%,` +
  ` ${mb(antes - despues)} MB menos)`,
);
