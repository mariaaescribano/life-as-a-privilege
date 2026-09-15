/* ─────────────────────────────────────────────────────────────────────────────
 *  Los FONDOS de los correos de disciplina
 *
 *  Por qué: el correo que se manda al comprar una disciplina lleva su foto de
 *  fondo, y esa foto tiene que cumplir dos cosas que las de la web no cumplen:
 *
 *   · Ser JPEG. Outlook de escritorio no pinta WebP, y la web las tiene todas
 *     en WebP.
 *   · Vivir en una dirección pública. Un correo no puede llevar rutas locales,
 *     así que salen a `frontend/public/img/correo/`, que Render sirve abierto.
 *
 *  Qué hace: coge el fondo de cada disciplina, lo pasa a JPEG de 1120 px de
 *  ancho (el doble del correo, para pantallas retina) y lo deja con el nombre
 *  de la clave que usa el backend (`metodo`, `psicologia`, …), que es la que
 *  compone la URL en `mail.service.ts`.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/correo-fondos.mjs
 *
 *  Si cambias el fondo de una disciplina en la web, vuelve a lanzarlo.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PUB = path.join(RAIZ, 'frontend', 'public');
const DESTINO = path.join(PUB, 'img', 'correo');

// Clave del backend → fondo de la disciplina en la web.
// Astrología no tiene foto de fondo (por dentro usa la capa de estrellas
// dibujada), así que se queda con el cielo del que sale esa capa.
const FONDOS = {
  metodo: 'img/astrologia/space.jpg',
  psicologia: 'img/fondos/psciologia.webp',
  ayurveda: 'img/fondos/hinduismo.webp',
  tcm: 'img/fondos/tcm.webp',
  fisiologia: 'img/fondos/fisio.webp',
  nutricion: 'img/fondos/nutri.webp',
  cabala: 'img/fondos/cabala.webp',
  cultura: 'img/fondos/cultura.webp',
};

// El VELO de cada disciplina: el color con el que se tiñe su foto para que el
// texto se lea encima. Es el mismo color que `mail.service.ts` usa de respaldo
// (`velo` en su tabla TRAJE), y la LETRA con la que hay que medir el contraste.
//
// Aquí se tiñe la foto DE VERDAD, en el JPEG, en lugar de poner una capa
// translúcida por CSS en el correo. Dos motivos:
//  · El texto va directamente sobre la foto, sin ninguna caja por medio.
//  · Una capa translúcida por CSS no la pinta todo el mundo (Outlook la ignora);
//    una foto teñida la ve igual todo el mundo, porque ya viene teñida.
const VELO = {
  metodo:     { velo: '#1e296b', letra: '#feffe4' },
  psicologia: { velo: '#e1b99f', letra: '#5e2d10' },
  ayurveda:   { velo: '#ffffff', letra: '#853e0b' },
  tcm:        { velo: '#6b0404', letra: '#ffa2a2' },
  fisiologia: { velo: '#331c35', letra: '#c8b5d1' },
  nutricion:  { velo: '#e4f8e1', letra: '#2b362a' },
  cabala:     { velo: '#1a1008', letra: '#bd814d' },
  cultura:    { velo: '#0c3c3c', letra: '#79dcd4' },
};

// Contraste mínimo que tiene que dar la letra sobre CUALQUIER punto de su foto
// ya teñida. 4.5:1 es el listón a partir del cual un texto normal se lee con
// holgura; se pide un pelín más para dejar margen.
const CONTRASTE_MINIMO = 4.7;

const ANCHO = 1120;
const CALIDAD = 72;

// ── Cuánto velo hace falta ───────────────────────────────────────────────────
// Se busca el velo MÁS FINO que aún deja leer: así se ve todo lo que se pueda
// de la foto. Se mide contra los píxeles reales de cada foto (no contra el
// blanco y el negro teóricos), sobre una copia diminuta —que es como promediar
// por zonas, que es lo que de verdad hay debajo de una letra.
const canal = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const luminancia = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const aRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const aObjeto = (hex) => { const [r, g, b] = aRgb(hex); return { r, g, b }; };

async function veloNecesario(entrada, veloHex, letraHex) {
  // Copia diminuta: cada píxel de aquí es el promedio de una zona de la foto.
  const { data, info } = await sharp(entrada)
    .resize({ width: 48 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const velo = aRgb(veloHex);
  const letra = aRgb(letraHex);
  const puntos = [];
  for (let i = 0; i < info.width * info.height * 3; i += 3) {
    puntos.push([data[i], data[i + 1], data[i + 2]]);
  }

  for (let alfa = 25; alfa <= 100; alfa += 1) {
    const a = alfa / 100;
    const peor = puntos.reduce((min, px) => {
      const tenido = px.map((v, i) => velo[i] * a + v * (1 - a));
      return Math.min(min, contraste(tenido, letra));
    }, Infinity);
    if (peor >= CONTRASTE_MINIMO) return { alfa: a, peor };
  }
  return { alfa: 1, peor: contraste(velo, letra) };
}

fs.mkdirSync(DESTINO, { recursive: true });

let hechas = 0;
for (const [clave, origen] of Object.entries(FONDOS)) {
  const entrada = path.join(PUB, origen);
  if (!fs.existsSync(entrada)) {
    console.warn(`  ⚠ ${clave}: no existe ${origen} — sin tocar`);
    continue;
  }
  const salida = path.join(DESTINO, `${clave}.jpg`);
  const { velo, letra } = VELO[clave];
  const { alfa, peor } = await veloNecesario(entrada, velo, letra);

  // Se redimensiona PRIMERO y se miran las medidas reales del resultado: el
  // tinte tiene que salir exactamente del mismo tamaño que la foto ya escalada.
  const { data: escalada, info } = await sharp(entrada)
    .resize({ width: ANCHO, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const tinte = await sharp({
    create: { width, height, channels: 4, background: { ...aObjeto(velo), alpha: alfa } },
  })
    .png()
    .toBuffer();

  await sharp(escalada)
    .composite([{ input: tinte, blend: 'over' }])
    .jpeg({ quality: CALIDAD, mozjpeg: true })
    .toFile(salida);

  const kb = (fs.statSync(salida).size / 1024).toFixed(0);
  console.log(
    `  ${clave.padEnd(11)} → img/correo/${clave}.jpg   ${width}×${height}, ${kb} kB` +
      `   velo ${velo} al ${Math.round(alfa * 100)}%, contraste ${peor.toFixed(1)}:1`,
  );
  hechas++;
}

console.log(`\n${hechas} fondos de correo listos en frontend/public/img/correo/.`);
