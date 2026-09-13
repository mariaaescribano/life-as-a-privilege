/* ─────────────────────────────────────────────────────────────────────────────
 *  PROGRAMAS · de un PowerPoint exportado a PDF a las diapositivas de la web
 *
 *  Un programa es «la diapositiva y su podcast» (ver
 *  frontend/src/hardCoded/programas/programas.ts). Este script se encarga solo
 *  de la parte que se MIRA: coge el PDF, dibuja cada página y deja las fotos
 *  listas para que la ficha del programa las pase con sus flechas.
 *
 *  Qué hace, en orden:
 *    1. Lee el PDF y dibuja cada página en un lienzo.
 *    2. Guarda cada una como WebP (una diapositiva = una foto).
 *    3. Las sube al bucket de Supabase, carpeta `programas/<slug>/`.
 *    4. Escribe la entrada lista para pegar en `programas.ts`.
 *
 *  Por qué al bucket y no a frontend/public: Render cobra el ancho de banda a
 *  partir de 5 GB al mes, y 50 presentaciones son cientos de imágenes. Lo que
 *  se sirve desde Supabase no toca esa cuenta, y el campo `diapositivas` admite
 *  igual una URL que una ruta de /public. Con `--public` se guardan en
 *  `frontend/public/programas/<slug>/`, como dice el comentario de programas.ts.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/pdf/programas.mjs --prueba          → convierte SIN subir
 *                                                       (deja las fotos en
 *                                                       scripts/pdf/muestra/)
 *    node scripts/pdf/programas.mjs                   → todo lo de entrada/
 *    node scripts/pdf/programas.mjs "Mi charla.pdf"   → solo ese
 *    node scripts/pdf/programas.mjs --public          → a frontend/public
 *
 *  Dónde se dejan los PDF: en `presentaciones-entrada/` (en la raíz del repo y
 *  fuera de git: son el material original, no hacen falta en el despliegue).
 *  El nombre del archivo es el título que se lee en la web, así que conviene
 *  escribirlo como quieres que se vea: «La respiración celular.pdf».
 *
 *  Lo que este script NO decide, porque solo tú lo sabes: a qué disciplina
 *  pertenece cada programa, qué número le toca y cuál es su podcast. Por eso no
 *  toca `programas.ts`: deja la entrada escrita y tú la pegas con esos tres
 *  datos rellenos.
 *
 *  Es idempotente: volver a convertir la misma presentación reemplaza sus
 *  diapositivas en el bucket, no las duplica.
 *
 *  ACCESO: estas diapositivas son PÚBLICAS a propósito. Si algún día alguna
 *  tiene que ser solo para quien ha pagado, NO vale con esconder el enlace:
 *  hay que moverla a un bucket privado y servirla con URL firmada.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const ENTRADA = path.join(RAIZ, 'presentaciones-entrada');
const MUESTRA = path.join(import.meta.dirname, 'muestra');
const SALIDA_PUBLIC = path.join(RAIZ, 'frontend/public/programas');
const ENTRADAS = path.join(import.meta.dirname, 'entradas-para-programas.txt');

/** Ancho al que se dibuja cada diapositiva. 1600 px se ve nítido a pantalla
 *  completa incluso en un portátil retina, y pesa ~120 kB en WebP. */
const ANCHO = 1600;
const CALIDAD = 82;

const args = process.argv.slice(2);
const PRUEBA = args.includes('--prueba');
const A_PUBLIC = args.includes('--public');
const soloEste = args.find((a) => !a.startsWith('--'));

// ── Herramientas ─────────────────────────────────────────────────────────────
const { createCanvas, Path2D, DOMMatrix, ImageData } = await import('@napi-rs/canvas');
// pdf.js está escrito para el navegador y da por hechas tres piezas que en Node
// no existen. Sin ellas revienta al pintar la primera forma con un críptico
// «Value is none of these types String, Path». Se las prestamos las del lienzo.
globalThis.Path2D ??= Path2D;
globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

// Las fuentes estándar del PDF y las tablas de codificación, tal como vienen
// dentro del paquete.
//
// Van como RUTA DE DISCO y no como dirección `file://`: pdf.js, cuando corre en
// Node, se las pasa tal cual a `fs.readFile`, y `file:///C:/…` en forma de texto
// no es una ruta que el sistema entienda («Unable to load font data», y el
// texto sale con una fuente de emergencia).
//
// Y con barra final, pero la barra INCLINADA de toda la vida y no la de
// Windows: pdf.js comprueba literalmente que la ruta termine en «/» y rechaza
// la contraria. Node abre igual de bien las rutas con barras inclinadas en
// Windows, así que se le dan así y en paz.
const RUTA_PDFJS = path.dirname(fileURLToPath(import.meta.resolve('pdfjs-dist/package.json')));
const enBarras = (p) => p.split(path.sep).join('/');
const FUENTES_ESTANDAR = enBarras(path.join(RUTA_PDFJS, 'standard_fonts')) + '/';
const CMAPS = enBarras(path.join(RUTA_PDFJS, 'cmaps')) + '/';
// sharp vive en la RAÍZ del repo (devDependency), no en frontend: estaba ahí
// de rebote, sin declarar, y un `npm audit fix` se lo llevó por delante.
const sharp = (await import('sharp')).default;

// ── Credenciales (del .env del backend; nunca se imprimen) ───────────────────
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(RAIZ, 'backend/.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]),
);
const SUPA = env.SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!PRUEBA && (!SUPA || !KEY)) {
  console.error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en backend/.env');
  process.exit(1);
}

/** «La respiración celular.pdf» → «la-respiracion-celular» */
const aSlug = (nombre) =>
  nombre
    .replace(/\.pdf$/i, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const kb = (b) => Math.round(b / 1024);

/** Dibuja una página del PDF y devuelve su WebP. */
async function diapositivaAWebp(pagina) {
  // Escala calculada sobre el ancho real de la página: así todas las
  // diapositivas salen del mismo ancho aunque el PowerPoint mezcle tamaños.
  const base = pagina.getViewport({ scale: 1 });
  const viewport = pagina.getViewport({ scale: ANCHO / base.width });
  const lienzo = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = lienzo.getContext('2d');
  // Fondo blanco: un PDF sin fondo declarado se dibujaría sobre transparente y
  // el WebP saldría con el texto negro flotando sobre nada.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  await pagina.render({ canvasContext: ctx, viewport, canvas: lienzo }).promise;
  return sharp(lienzo.toBuffer('image/png')).webp({ quality: CALIDAD, effort: 6 }).toBuffer();
}

/** Sube un archivo al bucket y devuelve su URL pública. */
async function subir(ruta, buffer) {
  const r = await fetch(`${SUPA}/storage/v1/object/img/${ruta}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'image/webp',
      'x-upsert': 'true', // volver a subir reemplaza, no duplica
    },
    body: buffer,
  });
  if (!r.ok) throw new Error(`subiendo ${ruta}: HTTP ${r.status} ${await r.text()}`);
  return `${SUPA}/storage/v1/object/public/img/${ruta}`;
}

// ── Qué PDFs hay que procesar ────────────────────────────────────────────────
if (!fs.existsSync(ENTRADA)) {
  await fsp.mkdir(ENTRADA, { recursive: true });
  console.log(`Creada la carpeta ${path.relative(RAIZ, ENTRADA)}. Deja ahí los PDF y vuelve a correr esto.`);
  process.exit(0);
}
let pdfs = (await fsp.readdir(ENTRADA)).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
if (soloEste) pdfs = pdfs.filter((f) => f === soloEste || aSlug(f) === aSlug(soloEste));
if (!pdfs.length) {
  console.log(`No hay PDF que procesar en ${path.relative(RAIZ, ENTRADA)}.`);
  process.exit(0);
}

// Las entradas que se irán escribiendo para pegar en programas.ts.
const entradas = [];

console.log(`${pdfs.length} presentación(es)${PRUEBA ? '  (PRUEBA: no se sube nada)' : ''}\n`);

for (const archivo of pdfs) {
  const titulo = archivo.replace(/\.pdf$/i, '');
  const slug = aSlug(archivo);
  const datos = new Uint8Array(await fsp.readFile(path.join(ENTRADA, archivo)));
  const doc = await pdfjs.getDocument({
    data: datos,
    // `true` a propósito. En el navegador pdf.js instala cada fuente del PDF y
    // deja que el sistema la pinte; en Node ese mecanismo no existe y el texto
    // sale en cuadraditos. Con esto, pdf.js dibuja el contorno de cada letra él
    // mismo, que es exactamente lo que queremos: una diapositiva es un dibujo.
    disableFontFace: true,
    // SIN esto el texto sale con una fuente de emergencia y las letras
    // separadas —se ve mal de un vistazo—. Las fuentes estándar del PDF
    // (Helvetica, Times, Courier) NO viajan dentro del archivo: las tiene que
    // poner quien lo dibuja, y aquí hay que decirle dónde están. PowerPoint
    // suele empotrar las suyas, pero en cuanto una diapositiva use una fuente
    // corriente sin empotrar, esto es lo que salva la presentación.
    standardFontDataUrl: FUENTES_ESTANDAR,
    cMapUrl: CMAPS,
    cMapPacked: true,
  }).promise;

  console.log(`${titulo}  ·  ${doc.numPages} diapositivas`);
  const urls = [];
  let peso = 0;

  for (let n = 1; n <= doc.numPages; n++) {
    const pagina = await doc.getPage(n);
    const webp = await diapositivaAWebp(pagina);
    peso += webp.length;
    const nombre = `${String(n).padStart(2, '0')}.webp`;

    if (PRUEBA) {
      const destino = path.join(MUESTRA, slug);
      await fsp.mkdir(destino, { recursive: true });
      await fsp.writeFile(path.join(destino, nombre), webp);
      urls.push(`(prueba)/${slug}/${nombre}`);
    } else if (A_PUBLIC) {
      const destino = path.join(SALIDA_PUBLIC, slug);
      await fsp.mkdir(destino, { recursive: true });
      await fsp.writeFile(path.join(destino, nombre), webp);
      urls.push(`/programas/${slug}/${nombre}`);
    } else {
      urls.push(await subir(`programas/${slug}/${nombre}`, webp));
    }
    process.stdout.write(`\r   ${n}/${doc.numPages}  (${kb(peso)} kB)   `);
  }
  console.log(`\n   ${kb(peso)} kB en total · ${Math.round(peso / doc.numPages / 1024)} kB por diapositiva\n`);

  // La entrada lista para pegar. `numero`, `disciplina` y `podcast` se dejan
  // marcados: son los tres datos que el script no puede saber.
  entradas.push(
    [
      '  {',
      `    slug: ${JSON.stringify(slug)},`,
      '    numero: 1,                       // ← el orden dentro de su disciplina',
      '    disciplina: "Fisiología",        // ← el slug de DISCIPLINAS_CURSO',
      `    titulo: ${JSON.stringify(titulo)},`,
      '    descripcion: "",                 // ← una línea de qué se cuenta',
      '    diapositivas: [',
      ...urls.map((u) => `      ${JSON.stringify(u)},`),
      '    ],',
      '    podcast: "",                     // ← el enlace de YouTube, si ya existe',
      '  },',
    ].join('\n'),
  );
}

// ── La cosecha ───────────────────────────────────────────────────────────────
const texto = entradas.join('\n');
if (PRUEBA) {
  console.log(`Muestra escrita en ${path.relative(RAIZ, MUESTRA)}. No se ha subido nada.\n`);
} else {
  await fsp.writeFile(ENTRADAS, texto + '\n', 'utf8');
  console.log(`Entradas escritas en ${path.relative(RAIZ, ENTRADAS)}\n`);
}
console.log('Para que salgan en la web, pega esto en el array `programas` de');
console.log('frontend/src/hardCoded/programas/programas.ts y rellena los ← :\n');
console.log(texto);
