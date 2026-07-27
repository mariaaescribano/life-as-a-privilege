/* ─────────────────────────────────────────────────────────────────────────────
 *  BORRA los WebP de un lote (paso final de una reversión)
 *
 *  Lee lote-<n>.csv y borra cada WebP que aparezca en él, pero SOLO si el PNG
 *  original ya está de vuelta en su sitio (recuperado con git checkout). Así
 *  nunca se queda una carpeta sin ninguna de las dos versiones.
 *
 *    node scripts/webp/revertir.mjs --lote=1            → borra
 *    node scripts/webp/revertir.mjs --lote=1 --revisar  → solo informa
 *
 *  Ver REVERTIR.md para los pasos completos.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(RAIZ, "frontend/public");

const args = process.argv.slice(2);
const lote = Number((args.find((a) => a.startsWith("--lote=")) ?? "--lote=1").split("=")[1]);
const soloRevisar = args.includes("--revisar");

const csv = await fs.readFile(path.join(import.meta.dirname, `lote-${lote}.csv`), "utf8");
const filas = csv.trim().split("\n").slice(1).map((l) => l.split(","));

let borrados = 0, sinPng = 0, ausentes = 0;
for (const [png, webp] of filas) {
  const absPng = path.join(PUBLIC, png);
  const absWebp = path.join(PUBLIC, webp);
  try { await fs.stat(absWebp); } catch { ausentes++; continue; }
  try { await fs.stat(absPng); } catch {
    sinPng++;
    console.log(`  ! ${webp} se queda: su PNG no está de vuelta todavía`);
    continue;
  }
  if (!soloRevisar) await fs.unlink(absWebp);
  borrados++;
}

console.log(`\n${borrados} WebP ${soloRevisar ? "a borrar" : "borrados"} · ${sinPng} intactos (falta su PNG) · ${ausentes} ya no estaban`);
if (sinPng) console.log(`Recupera antes los PNG con git checkout (ver REVERTIR.md) y vuelve a lanzarlo.`);
