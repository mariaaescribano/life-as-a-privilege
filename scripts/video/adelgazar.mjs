/* ─────────────────────────────────────────────────────────────────────────────
 *  ADELGAZAR los vídeos largos de las disciplinas
 *
 *  Por qué: los ocho vídeos de `frontend/public/videos` suman 134 MB, y el plan
 *  de Render trae 5 GB de tráfico al mes. Cada vez que alguien pulsa «ver el
 *  vídeo» de Nutrición se van 25 MB: doscientas reproducciones y se acabó el mes.
 *
 *  Lo que sobra no es el vídeo, es el bitrate: están a 2,6-5,4 Mbps para un
 *  cuadro de 1080×1080. Eso es tasa de cine para lo que son, acuarelas quietas
 *  con movimiento lento. A CRF 28 la imagen es la misma y pesan un 60% menos.
 *
 *  Se mantiene TODO lo demás: mismo tamaño (1080×1080), mismo códec (H.264, que
 *  lo reproduce cualquier cosa), mismo nombre de archivo. `+faststart` mueve el
 *  índice al principio, que es lo que hace que el vídeo empiece a verse antes de
 *  haberse bajado entero.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/video/adelgazar.mjs --prueba   → solo dice lo que haría
 *    node scripts/video/adelgazar.mjs            → lo hace
 *
 *  Reglas de seguridad:
 *   · Se comprime a un archivo temporal y solo se sustituye el original si el
 *     nuevo existe, es más pequeño y ffmpeg terminó bien.
 *   · Si no ahorra al menos un 20%, se descarta: no merece la pena recomprimir
 *     un vídeo (pérdida sobre pérdida) para quitarle cuatro megas.
 *   · NO toca `videos/muestra/` — esos clips ya pesan 100 kB y son los que se
 *     ven sin que nadie los pida.
 *
 *  Revertir: `git checkout HEAD -- frontend/public/videos`
 * ───────────────────────────────────────────────────────────────────────────── */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(import.meta.dirname, "../..");
const DIR = path.join(RAIZ, "frontend/public/videos");

/** 28 es el punto donde la imagen sigue siendo la del original. Subirlo ahorra
 *  más, pero en los degradados de acuarela empiezan a verse escalones. */
const CRF = 28;
const AHORRO_MINIMO = 0.20;

const PRUEBA = process.argv.includes("--prueba");
const mb = (b) => (b / 1048576).toFixed(1);

const videos = (await fs.readdir(DIR))
  .filter((f) => f.toLowerCase().endsWith(".mp4"))
  .sort();

console.log(`${videos.length} vídeos${PRUEBA ? "  (PRUEBA: no se escribe nada)" : ""}\n`);

let antes = 0, despues = 0;

for (const nombre of videos) {
  const abs = path.join(DIR, nombre);
  const tmp = path.join(DIR, `.${nombre}.tmp.mp4`);
  const { size } = await fs.stat(abs);
  antes += size;

  process.stdout.write(`  ${nombre}  ${mb(size)} MB ... `);

  try {
    await ejecutar("ffmpeg", [
      "-v", "error", "-y", "-i", abs,
      "-c:v", "libx264", "-crf", String(CRF), "-preset", "slow",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "96k",
      "-movflags", "+faststart",
      tmp,
    ], { maxBuffer: 1024 * 1024 * 32 });
  } catch (e) {
    await fs.rm(tmp, { force: true });
    despues += size;
    console.log(`ERROR de ffmpeg, se deja como estaba\n     ${e.message.trim()}`);
    continue;
  }

  const nueva = await fs.stat(tmp);

  if (nueva.size > size * (1 - AHORRO_MINIMO)) {
    await fs.rm(tmp, { force: true });
    despues += size;
    console.log(`${mb(nueva.size)} MB — no compensa, se deja como estaba`);
    continue;
  }

  if (PRUEBA) {
    await fs.rm(tmp, { force: true });
  } else {
    await fs.rename(tmp, abs);
  }
  despues += nueva.size;
  console.log(`→ ${mb(nueva.size)} MB  (-${Math.round(100 - (nueva.size * 100) / size)}%)`);
}

console.log(
  `\n${mb(antes)} MB → ${mb(despues)} MB` +
  `   (-${Math.round(100 - (despues * 100) / antes)}%, ${mb(antes - despues)} MB menos)`,
);
