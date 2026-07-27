/* ─────────────────────────────────────────────────────────────────────────────
 *  CONVERSIÓN PNG → WebP de las imágenes de frontend/public
 *
 *  Por qué: las ilustraciones son PNG de 1254×1254 (hasta 3,3 MB) y se muestran
 *  a ~400-600 px. En móvil con datos eso es la diferencia entre 2 s y 19 s de
 *  pantalla de carga. WebP a 1000 px de lado quita el 85-92% del peso.
 *
 *  Cómo se usa (desde la raíz del repo):
 *    node scripts/webp/convertir.mjs --lote=1            → convierte el lote
 *    node scripts/webp/convertir.mjs --lote=1 --prueba   → 3 imágenes de muestra
 *                                                          en scripts/webp/muestra/
 *                                                          (NO toca los PNG)
 *
 *  Reglas de seguridad:
 *   · Se convierten CARPETAS COMPLETAS, nunca archivos sueltos. Así las rutas
 *     dinámicas del código (`/carpeta/${clave}.png`) se pueden reescribir sin
 *     dejar mitad de la carpeta en PNG y mitad en WebP.
 *   · Si el WebP sale igual o más grande que el PNG, se descarta y el PNG se
 *     queda como está (pasa con imágenes ya muy pequeñas).
 *   · El PNG solo se borra DESPUÉS de escribir su WebP correctamente.
 *   · Todo lo convertido queda anotado en scripts/webp/lote-<n>.csv, para poder
 *     revertir (ver scripts/webp/REVERTIR.md).
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(RAIZ, "frontend/public");
const sharp = (await import(
  pathToFileURL(path.join(RAIZ, "frontend/node_modules/sharp/dist/index.cjs")).href
)).default;

// Calidad 80: en las pruebas no se distingue del PNG original a tamaño de
// pantalla. El lado máximo va por lote, porque no todas las imágenes se ven
// igual de grandes (ver LOTES).
const CALIDAD = 80;

// ── LOTES ────────────────────────────────────────────────────────────────────
// Carpetas completas, de mayor a menor peso.
const LOTES = {
  // Ilustraciones del recorrido y viñetas de cómic: se ven a 400-600 px, así
  // que con 1000 px de lado sobra resolución hasta en pantallas retina.
  1: {
    ladoMax: 1000,
    carpetas: [
      "recorrido/cultura/historiageneral",   // 103 archivos · 58,7 MB (con eras/)
      "recorrido/cultura/historiareligion",  //  45 archivos · 59,4 MB (con eras/)
      "recorrido/cultura/historiafilosofia", //  91 archivos · 71,8 MB (con eras/)
      "recorrido/nutricion/moleculas",       //  76 archivos · 38,6 MB
      "recorrido/nutricion/mitos",           //  60 archivos · 28,0 MB
      "recorrido/nutricion/portadas",        //  17 archivos · 24,4 MB
      "recorrido/nutricion/alimentos",       //  34 archivos · 16,0 MB
      "recorrido/fisiologia/pre",            //  48 archivos · 18,9 MB
      "viñetas/fisiologia/celulas",          //  78 archivos · 40,5 MB
    ],
  },
  // Fondos de disciplina: son los únicos que se ven a ancho de panel completo
  // (hasta ~1400 px en escritorio), así que se les deja más lado —1280— para
  // que la acuarela no se vea reblandecida. Aun así bajan un 75%.
  2: {
    ladoMax: 1280,
    carpetas: ["img/fondos"],                //  15 archivos · 5,5 MB
  },
};

// ── Utilidades ───────────────────────────────────────────────────────────────
const kb = (n) => Math.round(n / 1024);
const mb = (n) => (n / 1024 / 1024).toFixed(1);

/** Todos los .png de una carpeta, recursivamente. */
async function pngsDe(dirRel) {
  const base = path.join(PUBLIC, dirRel);
  const salida = [];
  async function recorrer(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await recorrer(p);
      else if (e.name.toLowerCase().endsWith(".png")) salida.push(p);
    }
  }
  await recorrer(base);
  return salida.sort();
}

/** Ruta tal como la usa el navegador: /carpeta/archivo.png */
const rutaWeb = (abs) => "/" + path.relative(PUBLIC, abs).split(path.sep).join("/");

// ── Programa ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const lote = Number((args.find((a) => a.startsWith("--lote=")) ?? "--lote=1").split("=")[1]);
const prueba = args.includes("--prueba");
const config = LOTES[lote];
if (!config) {
  console.error(`No existe el lote ${lote}. Lotes disponibles: ${Object.keys(LOTES).join(", ")}`);
  process.exit(1);
}
const { ladoMax: LADO_MAX, carpetas } = config;

let archivos = [];
for (const c of carpetas) archivos.push(...(await pngsDe(c)));

// Modo prueba: 3 imágenes representativas (la más grande, una mediana y una
// pequeña) a scripts/webp/muestra/, sin borrar ni tocar nada.
if (prueba) {
  const conTamano = [];
  for (const f of archivos) conTamano.push({ f, size: (await fs.stat(f)).size });
  conTamano.sort((a, b) => b.size - a.size);
  const muestra = [
    conTamano[0],
    conTamano[Math.floor(conTamano.length / 2)],
    conTamano[conTamano.length - 1],
  ];
  const dirMuestra = path.join(import.meta.dirname, "muestra");
  await fs.mkdir(dirMuestra, { recursive: true });
  console.log(`Muestra de ${muestra.length} imágenes → ${dirMuestra}\n`);
  for (const { f, size } of muestra) {
    const meta = await sharp(f).metadata();
    const buf = await sharp(f)
      .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toBuffer();
    const destino = path.join(dirMuestra, path.basename(f, ".png") + ".webp");
    await fs.writeFile(destino, buf);
    // Copia del original al lado, para comparar a ojo.
    await fs.copyFile(f, path.join(dirMuestra, path.basename(f)));
    console.log(
      `${path.basename(f).padEnd(34)} ${meta.width}x${meta.height}  ${String(kb(size)).padStart(5)} kB → ${String(kb(buf.length)).padStart(5)} kB  (-${Math.round((1 - buf.length / size) * 100)}%)`
    );
  }
  process.exit(0);
}

// ── Conversión de verdad ─────────────────────────────────────────────────────
console.log(`Lote ${lote}: ${archivos.length} PNG en ${carpetas.length} carpetas (lado máx ${LADO_MAX} px)\n`);

const filas = [];
let antes = 0, despues = 0, saltados = 0, fallos = 0;

for (const abs of archivos) {
  const rel = rutaWeb(abs);
  try {
    const { size } = await fs.stat(abs);
    // Se lee a memoria y se le pasa el Buffer a sharp: si se le pasa la RUTA,
    // en Windows deja el archivo abierto y el borrado de después falla (EBUSY).
    const origen = await fs.readFile(abs);
    const meta = await sharp(origen).metadata();
    const buf = await sharp(origen)
      .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toBuffer();

    // Si no mejora, el PNG se queda: no tiene sentido tocar código para nada.
    if (buf.length >= size) {
      saltados++;
      console.log(`  = ${rel}  (WebP no mejora: ${kb(size)} → ${kb(buf.length)} kB)`);
      continue;
    }

    const destino = abs.replace(/\.png$/i, ".webp");
    await fs.writeFile(destino, buf);
    // El PNG se borra solo tras escribir el WebP. Un reintento por si el
    // antivirus o el editor lo tienen cogido un instante.
    try { await fs.unlink(abs); }
    catch { await new Promise((r) => setTimeout(r, 200)); await fs.unlink(abs); }
    antes += size;
    despues += buf.length;
    filas.push({
      png: rel,
      webp: rutaWeb(destino),
      kb_antes: kb(size),
      kb_despues: kb(buf.length),
      dim_original: `${meta.width}x${meta.height}`,
    });
  } catch (e) {
    fallos++;
    console.error(`  ! ${rel}: ${e.message}`);
  }
}

// ── Registro para poder revertir ─────────────────────────────────────────────
const csv = [
  "png_original,webp_nuevo,kB_antes,kB_despues,dimension_original",
  ...filas.map((f) => `${f.png},${f.webp},${f.kb_antes},${f.kb_despues},${f.dim_original}`),
].join("\n");
const rutaCsv = path.join(import.meta.dirname, `lote-${lote}.csv`);
await fs.writeFile(rutaCsv, csv + "\n", "utf8");

console.log(`\n${filas.length} convertidos · ${saltados} sin tocar · ${fallos} fallos`);
console.log(`${mb(antes)} MB → ${mb(despues)} MB  (-${Math.round((1 - despues / antes) * 100)}%)`);
console.log(`Registro: ${path.relative(RAIZ, rutaCsv)}`);
console.log(`\nSiguiente paso: node scripts/webp/rutas.mjs --lote=${lote}`);
