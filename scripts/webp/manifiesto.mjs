/* ─────────────────────────────────────────────────────────────────────────────
 *  RECONSTRUYE el registro lote-<n>.csv desde el disco + git
 *
 *  convertir.mjs ya deja el registro escrito. Este script existe para el caso
 *  en que haya que rehacerlo: si la conversión se corta a medias y se relanza,
 *  el CSV solo contendría la última pasada. Aquí se recorren las carpetas del
 *  lote y se anota TODO .webp cuyo .png ya no está, sacando el tamaño y las
 *  medidas originales del PNG que sigue guardado en git.
 *
 *    node scripts/webp/manifiesto.mjs --lote=1
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(RAIZ, "frontend/public");
const sharp = (await import(
  pathToFileURL(path.join(RAIZ, "frontend/node_modules/sharp/dist/index.cjs")).href
)).default;

const lote = Number((process.argv.slice(2).find((a) => a.startsWith("--lote=")) ?? "--lote=1").split("=")[1]);

// Mismas carpetas que en convertir.mjs (se leen de allí para no duplicarlas).
const fuente = await fs.readFile(path.join(import.meta.dirname, "convertir.mjs"), "utf8");
const bloque = fuente.match(new RegExp(`\\n  ${lote}: \\{([\\s\\S]*?)\\n  \\},`));
const carpetas = [...bloque[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const kb = (n) => Math.round(n / 1024);
const rutaWeb = (abs) => "/" + path.relative(PUBLIC, abs).split(path.sep).join("/");

async function webpsDe(dirRel) {
  const salida = [];
  async function recorrer(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await recorrer(p);
      else if (e.name.toLowerCase().endsWith(".webp")) salida.push(p);
    }
  }
  await recorrer(path.join(PUBLIC, dirRel));
  return salida.sort();
}

const filas = [];
let antes = 0, despues = 0;

for (const carpeta of carpetas) {
  for (const abs of await webpsDe(carpeta)) {
    const png = abs.replace(/\.webp$/i, ".png");
    // Si el PNG sigue en disco, ese archivo no forma parte de la conversión.
    try { await fs.stat(png); continue; } catch { /* convertido, seguimos */ }

    const rutaPng = "frontend/public" + rutaWeb(png);
    let original;
    try {
      original = execFileSync("git", ["show", `HEAD:${rutaPng}`], {
        cwd: RAIZ, maxBuffer: 64 * 1024 * 1024, encoding: "buffer",
      });
    } catch {
      console.error(`  ! sin original en git: ${rutaPng}`);
      continue;
    }
    const meta = await sharp(original).metadata();
    const tamWebp = (await fs.stat(abs)).size;
    antes += original.length;
    despues += tamWebp;
    filas.push(
      `${rutaWeb(png)},${rutaWeb(abs)},${kb(original.length)},${kb(tamWebp)},${meta.width}x${meta.height}`
    );
  }
}

const rutaCsv = path.join(import.meta.dirname, `lote-${lote}.csv`);
await fs.writeFile(
  rutaCsv,
  ["png_original,webp_nuevo,kB_antes,kB_despues,dimension_original", ...filas].join("\n") + "\n",
  "utf8"
);

console.log(`${filas.length} archivos anotados en ${path.relative(RAIZ, rutaCsv)}`);
console.log(
  `${(antes / 1024 / 1024).toFixed(1)} MB → ${(despues / 1024 / 1024).toFixed(1)} MB  (-${Math.round((1 - despues / antes) * 100)}%)`
);
