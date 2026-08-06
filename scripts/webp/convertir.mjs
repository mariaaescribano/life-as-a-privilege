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
// pantalla. Cada lote puede subirla con `calidad` (ver LOTES). El lado máximo
// también va por lote, porque no todas las imágenes se ven igual de grandes.
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
  // Ilustraciones nuevas (Cábala + viñetas repintadas). Aquí NO se recorta
  // calidad: son dibujos recién hechos y se quieren ver como el original, así
  // que van a calidad 92 y sin redimensionar (todas miden ≤1254 px, y ladoMax
  // 1400 con withoutEnlargement deja el tamaño intacto). Pesan ~3× lo que las
  // del lote 1, pero siguen quitando el 80-85% del PNG.
  3: {
    ladoMax: 1400,
    calidad: 92,
    // Excepción a la regla "nunca a peor": los senderos se piden con una ruta
    // dinámica (`/senderos/${letra}.png`), así que o va la carpeta ENTERA a
    // WebP o se rompen los 17 nuevos. Los 5 viejos que no adelgazan (ya venían
    // cuantizados) se convierten igual: son +12 kB cada uno.
    forzar: ["recorrido/cabala/senderos"],
    carpetas: [
      "recorrido/cabala/sefirot",            //  11 archivos
      "recorrido/cabala/senderos",           //  22 archivos
      "viñetas/comicInicioSegunCiencia",     //   8 archivos
      "viñetas/hinduismo/doshas",            //   4 archivos
      "viñetas/nutricion/agua",              //   4 archivos
      "viñetas/nutricion/fibra",             //   4 archivos
      "viñetas/nutricion/fitoquimicos",      //   4 archivos
      "viñetas/nutricion/grasas",            //   4 archivos
      "viñetas/nutricion/integral",          //   4 archivos
      "viñetas/nutricion/minerales",         //   4 archivos
      "viñetas/psicologia/ace",              //   4 archivos
      "viñetas/psicologia/lineatiempo",      //   3 archivos
      "viñetas/psicologia/sufrimiento",      //   8 archivos
    ],
  },
  // Acuarelas de agosto. Mismos ajustes que el lote 1 (1000 px / calidad 80) y
  // no los del 3: estas se ven a 400-440 px como mucho —el box del cómic del
  // origen mide 400 px y el visor de viñetas 440—, así que 1000 px de lado
  // sobra hasta en retina, y el peso aquí importa el doble porque las de elMapa
  // están en el PRIMER bloque de la landing. Las eras de Filosofía van con
  // ellas por otro motivo: sus hermanas ya son WebP del lote 1 y la ruta del
  // código es dinámica (`${era.key}.webp`), así que mientras estén en PNG esas
  // cuatro portadas dan 404.
  4: {
    ladoMax: 1000,
    carpetas: [
      "viñetas/elMapa",                          // 11 archivos · 32 MB
      "recorrido/tcm/madera",                    //  5 archivos · 14 MB
      "viñetas/fisiologia/meditacion",           //  6 archivos · 16 MB
      "recorrido/cultura/historiafilosofia/eras",//  4 en PNG (el resto ya WebP)
    ],
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
const CALIDAD_LOTE = config.calidad ?? CALIDAD;
// alphaQuality 100 = la transparencia (sefirot) no se toca; effort 6 = el
// compresor se esfuerza al máximo, tarda más pero pesa menos a igual calidad.
const OPCIONES_WEBP = { quality: CALIDAD_LOTE, effort: 6, alphaQuality: 100, smartSubsample: true };

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
      .webp(OPCIONES_WEBP)
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
console.log(`Lote ${lote}: ${archivos.length} PNG en ${carpetas.length} carpetas (lado máx ${LADO_MAX} px, calidad ${CALIDAD_LOTE})\n`);

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
      .webp(OPCIONES_WEBP)
      .toBuffer();

    // Si no mejora, el PNG se queda: no tiene sentido tocar código para nada.
    // Salvo en las carpetas de `forzar`, que van enteras o no van (rutas
    // dinámicas: media carpeta en cada formato = imágenes rotas).
    const forzado = (config.forzar ?? []).some((c) => rel.startsWith("/" + c + "/"));
    if (buf.length >= size && !forzado) {
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
