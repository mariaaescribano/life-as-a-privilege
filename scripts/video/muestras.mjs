/**
 * CLIPS DE MUESTRA — los ocho vídeos en bucle de /elMetodo
 *
 * La sección «El Mapa por dentro» pone los ocho vídeos en una rejilla y los
 * reproduce a la vez. Los vídeos originales de `public/videos` pesan ~53 MB
 * entre todos: servirlos ahí sería la página más cara de la web y en móvil con
 * datos, un abuso.
 *
 * Este script saca de cada uno un clip corto, mudo y pequeño para la rejilla.
 * El vídeo completo NO se toca: sigue siendo el que abre el popup al pulsar.
 *
 *   node scripts/video/muestras.mjs           (solo los que falten)
 *   node scripts/video/muestras.mjs --forzar  (rehace todos)
 *
 * Necesita ffmpeg en el PATH.
 */
import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ORIGEN = join(RAIZ, "frontend", "public", "videos");
const DESTINO = join(ORIGEN, "muestra");

/** Segundo por el que empieza el clip y cuánto dura. Arrancar en 0 suele pillar
 *  el rótulo del principio, que es lo menos interesante de cada vídeo. */
const DESDE = 2;
const DURACION = 8;
/** Ancho del clip. Cada baldosa mide ~280 px en pantalla, así que 480 sobra
 *  incluso en pantallas de mucha densidad. */
const ANCHO = 480;

/** clave de la disciplina → fichero original. El nombre del clip es la clave,
 *  que es lo que el componente pide (`/videos/muestra/<clave>.mp4`). */
const VIDEOS = {
  astrologia: "astrovideo.mp4",
  psicologia: "psicologiavideo.mp4",
  ayurveda: "ayurvedavideo.mp4",
  tcm: "tcmvideo.mp4",
  fisiologia: "fisiovideo.mp4",
  nutricion: "nutrivideo.mp4",
  cabala: "cabalavideo.mp4",
  cultura: "culturavideo.mp4",
};

const forzar = process.argv.includes("--forzar");
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const existe = async (ruta) => {
  try { return await stat(ruta); } catch { return null; }
};

await mkdir(DESTINO, { recursive: true });

let hechos = 0;
for (const [clave, fichero] of Object.entries(VIDEOS)) {
  const entrada = join(ORIGEN, fichero);
  const salida = join(DESTINO, `${clave}.mp4`);

  if (!(await existe(entrada))) {
    console.log(`· ${clave}: no está ${fichero}, se salta`);
    continue;
  }
  const ya = await existe(salida);
  if (ya && !forzar) {
    console.log(`· ${clave}: ya existe (${kb(ya.size)})`);
    continue;
  }

  // -an: sin pista de audio (van mudos por narices, el autoplay lo exige).
  // -movflags +faststart: el índice al principio, para que empiece a pintar sin
  // haber descargado el fichero entero.
  // yuv420p: el perfil que entienden todos los navegadores, incluido Safari.
  await ejecutar("ffmpeg", [
    "-y",
    "-ss", String(DESDE),
    "-t", String(DURACION),
    "-i", entrada,
    "-an",
    "-vf", `scale=${ANCHO}:-2:flags=lanczos,fps=24`,
    "-c:v", "libx264",
    "-profile:v", "main",
    "-pix_fmt", "yuv420p",
    "-crf", "30",
    "-preset", "slow",
    "-movflags", "+faststart",
    salida,
  ]);

  const antes = (await existe(entrada)).size;
  const despues = (await existe(salida)).size;
  console.log(`✓ ${clave}: ${kb(antes)} → ${kb(despues)}`);
  hechos++;
}

console.log(`\n${hechos} clip(s) generados en frontend/public/videos/muestra/`);
