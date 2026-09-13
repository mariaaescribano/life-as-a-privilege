/* ─────────────────────────────────────────────────────────────────────────────
 *  ADELGAZAR los JPG y PNG que siguen sin convertir
 *
 *  Por qué otro script: `convertir.mjs` cambia la extensión a .webp, y para eso
 *  hay que reescribir todas las rutas del código (`rutas.mjs`) — que solo sabe
 *  de .png. Estas imágenes son JPEG sueltos repartidos por carpetas que también
 *  tienen WebP, así que convertirlas obligaría a tocar el script de rutas para
 *  que entendiera .jpg, con el riesgo que eso tiene en rutas dinámicas.
 *
 *  Aquí se hace lo mismo que en `adelgazar.mjs`, que ya funciona así: se
 *  recomprime EN EL SITIO, con el mismo nombre y la misma extensión. Cero
 *  cambios en el código y cero cambios en la base de datos. Se pierde el 20-30%
 *  de ahorro que daría el WebP, pero se gana no romper nada.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/webp/adelgazar-jpg.mjs --prueba   → dice qué haría
 *    node scripts/webp/adelgazar-jpg.mjs            → lo hace
 *
 *  Reglas de seguridad, las mismas que su hermano:
 *   · Solo entra lo que pasa de 300 kB.
 *   · Si no se ahorra al menos un 15%, se deja el original: recomprimir con
 *     pérdida sobre pérdida sin ganar nada es tirar nitidez a la basura.
 *   · La transparencia de los PNG se conserva.
 *   · Para revertir: git checkout HEAD -- frontend/public
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const PUBLIC = path.join(RAIZ, 'frontend/public');
// sharp vive en la RAÍZ del repo (devDependency), no en frontend: estaba ahí
// de rebote, sin declarar, y un `npm audit fix` se lo llevó por delante.
const sharp = (await import('sharp')).default;

const LADO_MAX = 1400;          // fotos de fondo y portadas: se ven grandes
const CALIDAD_JPG = 78;
const UMBRAL = 300 * 1024;
const AHORRO_MINIMO = 0.15;

const PRUEBA = process.argv.includes('--prueba');

const buscar = async (dir) => {
  const salida = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await buscar(abs)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) salida.push(abs);
  }
  return salida;
};

const kb = (b) => Math.round(b / 1024);
const mb = (b) => (b / 1024 / 1024).toFixed(1);

const todos = (await buscar(PUBLIC)).sort();
const candidatos = [];
for (const abs of todos) {
  const { size } = await fs.stat(abs);
  if (size > UMBRAL) candidatos.push({ abs, size });
}

console.log(
  `${todos.length} JPG/PNG en public · ${candidatos.length} pasan de ${kb(UMBRAL)} kB` +
    (PRUEBA ? '  (PRUEBA: no se escribe nada)' : ''),
);

let antes = 0, despues = 0, tocados = 0, intactos = 0;

for (const { abs, size } of candidatos) {
  const rel = path.relative(PUBLIC, abs).split(path.sep).join('/');
  // Se lee a memoria y se le pasa el Buffer a sharp: con la RUTA, en Windows
  // el archivo se queda abierto y la reescritura falla (EBUSY).
  const origen = await fs.readFile(abs);
  const meta = await sharp(origen).metadata();
  const esPng = /\.png$/i.test(abs);

  const tuberia = sharp(origen).resize({
    width: LADO_MAX, height: LADO_MAX, fit: 'inside', withoutEnlargement: true,
  });
  const buf = await (esPng
    ? tuberia.png({ compressionLevel: 9, palette: true }).toBuffer()
    : tuberia.jpeg({ quality: CALIDAD_JPG, mozjpeg: true }).toBuffer());

  antes += size;

  if (buf.length > size * (1 - AHORRO_MINIMO)) {
    despues += size;
    intactos++;
    console.log(`  = ${rel}  ${kb(size)} kB  (no compensa)`);
    continue;
  }

  const nueva = await sharp(buf).metadata();
  if (!PRUEBA) await fs.writeFile(abs, buf);
  despues += buf.length;
  tocados++;
  console.log(
    `  ↓ ${rel.padEnd(46)} ${String(kb(size)).padStart(5)} → ${String(kb(buf.length)).padStart(5)} kB` +
      `  ${meta.width}x${meta.height} → ${nueva.width}x${nueva.height}`,
  );
}

console.log(`\n${tocados} adelgazados · ${intactos} sin tocar`);
if (antes) console.log(`${mb(antes)} MB → ${mb(despues)} MB  (-${Math.round((1 - despues / antes) * 100)}%)`);
