/* ─────────────────────────────────────────────────────────────────────────────
 *  VERSIÓN LIGERA de los vídeos largos de las disciplinas
 *
 *  Por qué: el vídeo largo sale ahora en pantalla en /d/<disciplina> y es el que
 *  se abre al pulsar «Muestra» en /elMetodo. Ya no se pregunta antes de bajarlo
 *  (preguntar era pedirle al visitante que decidiera algo que no puede saber),
 *  así que lo que se elige por él es la CALIDAD: por wifi o cable el vídeo tal
 *  cual, y por datos del móvil esta versión —el MISMO vídeo entero, la misma
 *  duración, solo más comprimido y a la mitad de lado.
 *
 *  Qué hace: por cada `frontend/public/videos/<nombre>.mp4` escribe
 *  `frontend/public/videos/ligero/<nombre>.mp4`. El nombre NO cambia: el
 *  frontend obtiene la ruta ligera metiendo `/ligero/` en medio, sin tablas ni
 *  listas que mantener (ver `components/global/videoCalidad.ts`).
 *
 *  540×540 (la mitad de lado = la cuarta parte de píxeles) y CRF 32. En un móvil
 *  el vídeo se ve a unos 380 px de ancho, así que 540 sigue sobrando; y son
 *  acuarelas con movimiento lento, que es justo lo que aguanta un CRF alto sin
 *  romperse.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/video/ligeros.mjs --prueba   → solo dice lo que haría
 *    node scripts/video/ligeros.mjs            → lo hace
 *    node scripts/video/ligeros.mjs --rehacer  → rehace también los que ya están
 *
 *  Reglas de seguridad:
 *   · Se escribe en un temporal y solo se mueve al sitio si ffmpeg terminó bien.
 *   · Si la versión ligera no sale más pequeña que el original, se descarta: el
 *     frontend se queda con el original, que es lo que ya funciona.
 *   · NO toca `videos/muestra/` (los clips de 100 kB de la rejilla) ni los
 *     originales: esto solo AÑADE archivos.
 *
 *  Al añadir un vídeo nuevo a `frontend/public/videos`: pasar este script (y
 *  `adelgazar.mjs` antes, que es el que aprieta el original).
 * ───────────────────────────────────────────────────────────────────────────── */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(import.meta.dirname, "../..");
const DIR = path.join(RAIZ, "frontend/public/videos");
const DESTINO = path.join(DIR, "ligero");

/** Lado máximo de la versión ligera. Los vídeos son 1080×1080. */
const LADO = 540;
/** 32 en un cuadro de 540 se ve igual que 28 en uno de 1080 a tamaño de móvil. */
const CRF = 32;

const PRUEBA = process.argv.includes("--prueba");
const REHACER = process.argv.includes("--rehacer");
const mb = (b) => (b / 1048576).toFixed(1);

const videos = (await fs.readdir(DIR, { withFileTypes: true }))
  .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".mp4"))
  .map((e) => e.name)
  .sort();

if (!PRUEBA) await fs.mkdir(DESTINO, { recursive: true });

console.log(
  `${videos.length} vídeos → ${LADO}×${LADO} CRF ${CRF}` +
  `${PRUEBA ? "  (PRUEBA: no se escribe nada)" : ""}\n`,
);

let antes = 0, despues = 0, hechos = 0;

for (const nombre of videos) {
  const abs = path.join(DIR, nombre);
  const fin = path.join(DESTINO, nombre);
  const tmp = path.join(DESTINO, `.${nombre}.tmp.mp4`);
  const { size } = await fs.stat(abs);

  const ya = await fs.stat(fin).then((s) => s.size).catch(() => 0);
  if (ya && !REHACER) {
    console.log(`  ${nombre}  ya está  (${mb(ya)} MB)`);
    antes += size; despues += ya;
    continue;
  }

  process.stdout.write(`  ${nombre}  ${mb(size)} MB ... `);

  try {
    await ejecutar("ffmpeg", [
      "-v", "error", "-y", "-i", abs,
      // `-2` deja que ffmpeg calcule el otro lado manteniendo la proporción (y
      // par, que H.264 lo exige): funciona igual con un vídeo vertical.
      "-vf", `scale=${LADO}:-2:flags=lanczos`,
      "-c:v", "libx264", "-crf", String(CRF), "-preset", "slow",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "64k",
      "-movflags", "+faststart",
      tmp,
    ], { maxBuffer: 1024 * 1024 * 32 });
  } catch (e) {
    await fs.rm(tmp, { force: true });
    console.log(`ERROR de ffmpeg, se salta\n     ${e.message.trim()}`);
    continue;
  }

  const nueva = await fs.stat(tmp);

  if (nueva.size >= size) {
    await fs.rm(tmp, { force: true });
    console.log(`${mb(nueva.size)} MB — no es más ligero, se descarta`);
    continue;
  }

  if (PRUEBA) await fs.rm(tmp, { force: true });
  else await fs.rename(tmp, fin);

  antes += size; despues += nueva.size; hechos += 1;
  console.log(`→ ${mb(nueva.size)} MB  (-${Math.round(100 - (nueva.size * 100) / size)}%)`);
}

console.log(
  `\n${hechos} generado(s).  Por datos se bajarían ${mb(despues)} MB` +
  ` en vez de ${mb(antes)} MB.`,
);
