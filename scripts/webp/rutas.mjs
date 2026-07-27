/* ─────────────────────────────────────────────────────────────────────────────
 *  ACTUALIZA LAS RUTAS DEL CÓDIGO tras convertir un lote a WebP
 *
 *  Se ejecuta DESPUÉS de convertir.mjs y lee su registro (lote-<n>.csv) para
 *  saber exactamente qué se convirtió. No hace un reemplazo ciego de .png por
 *  .webp: solo toca las rutas que apuntan a archivos de ese lote.
 *
 *    node scripts/webp/rutas.mjs --lote=1            → reescribe
 *    node scripts/webp/rutas.mjs --lote=1 --revisar  → solo informa, no escribe
 *
 *  Dos tipos de ruta en el código, y cómo se trata cada una:
 *
 *   1. Literal — "/recorrido/nutricion/mitos/azucar.png"
 *      Se compara la ruta ENTERA con el registro. Si está, se cambia. Así, si
 *      un archivo se quedó en PNG (porque el WebP salía más grande), su ruta no
 *      se toca por error.
 *
 *   2. Dinámica — `/recorrido/cultura/historiageneral/${sub}.png`
 *      El nombre no se conoce hasta que corre la app, así que se comprueba la
 *      CARPETA: solo se cambia si en esa carpeta ya no queda ningún .png. Si
 *      quedara alguno, la ruta dinámica podría apuntar a él y se rompería.
 *      Los prefijos en constantes (`${PRE}/nucleo.png`) se resuelven leyendo el
 *      `const PRE = "..."` del propio archivo.
 *
 *  Al final verifica que TODAS las rutas literales de imagen del código existan
 *  en el disco, y lista las que no (por si algo se quedó a medias).
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(RAIZ, "frontend/public");
const SRC = path.join(RAIZ, "frontend/src");

const args = process.argv.slice(2);
const lote = Number((args.find((a) => a.startsWith("--lote=")) ?? "--lote=1").split("=")[1]);
const soloRevisar = args.includes("--revisar");

// ── Registro del lote ────────────────────────────────────────────────────────
const csv = await fs.readFile(path.join(import.meta.dirname, `lote-${lote}.csv`), "utf8");
const convertidos = new Set(); // rutas web de los PNG convertidos
for (const linea of csv.trim().split("\n").slice(1)) {
  const [png] = linea.split(",");
  if (png) convertidos.add(png);
}

// Carpetas del lote en las que YA NO QUEDA ningún .png (las únicas donde es
// seguro reescribir rutas dinámicas).
const carpetasLimpias = new Set();
for (const png of convertidos) {
  const carpeta = png.slice(0, png.lastIndexOf("/") + 1);
  if (carpetasLimpias.has(carpeta)) continue;
  const abs = path.join(PUBLIC, carpeta);
  const quedan = (await fs.readdir(abs)).some((f) => f.toLowerCase().endsWith(".png"));
  if (!quedan) carpetasLimpias.add(carpeta);
}

console.log(`Lote ${lote}: ${convertidos.size} archivos, ${carpetasLimpias.size} carpetas sin PNG restante`);
if (soloRevisar) console.log("(modo --revisar: no se escribe nada)\n");
else console.log("");

// ── Archivos de código a revisar ─────────────────────────────────────────────
async function ficheros(dir, exts) {
  const salida = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await ficheros(p, exts)));
    else if (exts.some((x) => e.name.endsWith(x))) salida.push(p);
  }
  return salida;
}
const objetivos = [
  ...(await ficheros(SRC, [".ts", ".tsx"])),
  path.join(RAIZ, "frontend/index.html"),
];

// ── Resolución de prefijos guardados en constantes ───────────────────────────
function constantes(texto) {
  const mapa = new Map();
  const re = /const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;
  let m;
  while ((m = re.exec(texto))) mapa.set(m[1], m[2] ?? m[3] ?? m[4]);
  return mapa;
}
function resolver(raw, mapa) {
  let out = raw;
  for (let i = 0; i < 3 && out.includes("${"); i++) {
    out = out.replace(/\$\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (todo, nombre) =>
      mapa.has(nombre) ? mapa.get(nombre) : todo
    );
  }
  return out;
}

// ── Recorrido y reescritura ──────────────────────────────────────────────────
let cambiosTotal = 0;
const sinTocar = [];   // rutas .png que se dejan (con el motivo)
const rotas = [];      // rutas literales que no existen en el disco
const mayusculas = []; // rutas que solo fallan por mayúsculas/minúsculas
const convertidosMin = new Set([...convertidos].map((p) => p.toLowerCase()));

for (const archivo of objetivos) {
  let texto = await fs.readFile(archivo, "utf8");
  const mapa = constantes(texto);
  const rel = path.relative(RAIZ, archivo);
  let cambios = 0;
  let resultado = "";
  let i = 0;

  while (true) {
    const idx = texto.indexOf(".png", i);
    if (idx === -1) { resultado += texto.slice(i); break; }

    // Texto desde la apertura de la cadena hasta el .png. Si por el camino
    // aparece un salto de línea, no es una cadena: es un .png suelto dentro de
    // un comentario, y no se toca.
    let j = idx;
    while (j > 0 && !`"'\``.includes(texto[j - 1]) && texto[j - 1] !== "\n") j--;
    const raw = texto[j - 1] === "\n" ? "" : texto.slice(j, idx);
    const resuelto = resolver(raw, mapa);
    const rutaCompleta = resuelto + ".png";
    const carpeta = resuelto.includes("/") ? resuelto.slice(0, resuelto.lastIndexOf("/") + 1) : null;

    let cambiar = false;
    let motivo = "";
    if (!resuelto.startsWith("/")) {
      motivo = "no es una ruta absoluta de /public";
    } else if (!resuelto.includes("${") && convertidos.has(rutaCompleta)) {
      cambiar = true;                                   // literal del lote
    } else if (!resuelto.includes("${")) {
      motivo = "literal fuera del lote";
      // Verificación: ¿existe el archivo al que apunta?
      try { await fs.stat(path.join(PUBLIC, rutaCompleta)); }
      catch { rotas.push(`${rel}  →  ${rutaCompleta}`); }
      // Caso traicionero: la ruta del código está escrita con otras mayúsculas
      // que el archivo ("ADN.png" vs "adn.png"). En Windows colaba; en el
      // servidor (Linux) no. Se avisa para corregirla a mano.
      if (convertidosMin.has(rutaCompleta.toLowerCase())) {
        mayusculas.push(`${rel}  →  ${rutaCompleta}`);
      }
    } else if (carpeta && !carpeta.includes("${") && carpetasLimpias.has(carpeta)) {
      cambiar = true;                                   // dinámica, carpeta limpia
    } else {
      motivo = "ruta dinámica en carpeta no convertida";
    }

    if (cambiar) {
      resultado += texto.slice(i, idx) + ".webp";
      cambios++;
    } else {
      resultado += texto.slice(i, idx) + ".png";
      if (motivo && resuelto.startsWith("/")) sinTocar.push(`${rel}  ${rutaCompleta}  (${motivo})`);
    }
    i = idx + 4;
  }

  if (cambios) {
    if (!soloRevisar) await fs.writeFile(archivo, resultado, "utf8");
    cambiosTotal += cambios;
    console.log(`  ${String(cambios).padStart(3)} × ${rel}`);
  }
}

// ── Verificación final: toda ruta .webp del código debe existir ──────────────
const webpRotos = [];
for (const archivo of objetivos) {
  const texto = await fs.readFile(archivo, "utf8");
  const mapa = constantes(texto);
  const re = /["'`]([^"'`]*\.webp)/g;
  let m;
  while ((m = re.exec(texto))) {
    const r = resolver(m[1], mapa);
    if (r.includes("${") || !r.startsWith("/")) continue;
    try { await fs.stat(path.join(PUBLIC, r)); }
    catch { webpRotos.push(`${path.relative(RAIZ, archivo)}  →  ${r}`); }
  }
}

console.log(`\n${cambiosTotal} rutas reescritas a .webp`);
console.log(`${sinTocar.length} rutas .png intactas (otros lotes / carpetas sin convertir)`);
if (rotas.length) {
  console.log(`\n⚠ ${rotas.length} rutas .png que NO existen en el disco:`);
  rotas.slice(0, 20).forEach((r) => console.log("   " + r));
}
if (mayusculas.length) {
  console.log(`\n⚠ ${mayusculas.length} rutas del lote escritas con otras mayúsculas (corregir a mano):`);
  mayusculas.forEach((r) => console.log("   " + r));
}
if (webpRotos.length) {
  console.log(`\n⚠ ${webpRotos.length} rutas .webp que NO existen en el disco:`);
  webpRotos.slice(0, 20).forEach((r) => console.log("   " + r));
} else {
  console.log("✓ Todas las rutas .webp del código existen en el disco");
}
