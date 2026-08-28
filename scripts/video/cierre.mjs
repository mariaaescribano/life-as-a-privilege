#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// CIERRE DE VÍDEO (9:16) · LIFE AS A PRIVILEGE
//
// Genera el .gif de cierre para el final de los vídeos:
//   1. el mandala del logo entra girando (2,5 vueltas) y frena hasta colocarse,
//      desenfocado mientras va rápido y nítido al pararse;
//   2. se abre desde el centro la rayita fina del logotipo;
//   3. «LIFE AS / A PRIVILEGE» aparece letra a letra saliendo del desenfoque.
//
// Todo sale de material del propio proyecto: el mandala es
// frontend/public/img/icono/life.png y la tipografía es la EB Garamond que ya
// viaja embebida en frontend/src/utils/fonts/ebGaramondData.ts (la de los PDF),
// así que el cierre queda con la letra exacta de la marca.
//
// Uso:
//   node scripts/video/cierre.mjs                 → 1080x1920 y 720x1280
//   node scripts/video/cierre.mjs --unalinea      → «LIFE AS A PRIVILEGE» seguido
//                                                   y el mandala con la entrada
//                                                   de la web (otro archivo, no
//                                                   pisa el de dos líneas)
//   node scripts/video/cierre.mjs --giro 360      → grados que gira al entrar
//   node scripts/video/cierre.mjs --escala 0.5    → solo una prueba rápida
//   node scripts/video/cierre.mjs --mp4           → además el .mp4 (mejor calidad)
//   node scripts/video/cierre.mjs --ligero        → además un .gif a media cadencia
//
// Requiere ffmpeg en el PATH (el mismo que usa scripts/video/adelgazar.mjs).
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from "module";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import url from "url";

const RAIZ = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../..");
const require = createRequire(url.pathToFileURL(path.join(RAIZ, "frontend/package.json")));
const sharp = require("sharp");

const MANDALA_PNG = path.join(RAIZ, "frontend/public/img/icono/life.png");
const FUENTE_TS = path.join(RAIZ, "frontend/src/utils/fonts/ebGaramondData.ts");
const SALIDA = path.join(RAIZ, "marca");
const TMP = path.join(os.tmpdir(), "laap-cierre");

const args = process.argv.slice(2);
const flag = (n, def) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] ?? true : def;
};
const ESCALA = Number(flag("escala", 1));
const HACER_MP4 = args.includes("--mp4");
const LIGERO = args.includes("--ligero");   // además, un .gif a media cadencia
// Multiplicador del glow (1 = las opacidades tal cual de Welcome: 0.59 / 0.32 /
// 0.24). Aquí no se puede copiar el número y esperar el mismo efecto: el mandala
// es ~7 veces el de la web y el glow sale de la silueta LLENA, así que la misma
// opacidad da mucha más luz. Medido en el borde del mandala (canal R sobre el
// turquesa, 0 = turquesa limpio): 0,35 → 3 · 0,6 → 4,4 · 1,2 → 13 (deslumbra).
const BRILLO = Number(flag("brillo", 0.6));
// Dos versiones del cierre, cada una con su nombre de archivo (la segunda NO
// pisa la primera):
//   por defecto  → dos líneas; el mandala entra como un volante de inercia,
//                  dando 2,5 vueltas y frenando poco a poco
//   --unalinea   → «LIFE AS A PRIVILEGE» seguido; el mandala entra COMO EN
//                  WELCOME: surge girando desde muy pequeño con un muelle y
//                  encendido con el glow de la portada
const UNA_LINEA = args.includes("--unalinea");
const ESTILO = flag("estilo", UNA_LINEA ? "welcome" : "volante");   // welcome | volante
const ES_WELCOME = ESTILO === "welcome";
// Grados que gira al entrar. En "welcome" son los 45° EXACTOS de la portada
// (rotate(-45deg) → rotate(0)); en "volante", 2,5 vueltas frenando.
const GIRO = Number(flag("giro", ES_WELCOME ? 45 : 900));
const NOMBRE = UNA_LINEA ? "cierre-1linea" : "cierre";

// ── Lienzo y composición ─────────────────────────────────────────────────────
const W = Math.round(1080 * ESCALA);
const H = Math.round(1920 * ESCALA);
const TURQUESA = "#008080";              // el turquesa de la casa
const FPS = 25;
// En "welcome" el clip dura lo que la flotación de la portada (5,5s) para que el
// vaivén cierre justo donde empezó y el .gif enlace sin salto.
const DUR = ES_WELCOME ? 5.52 : 5.0;     // segundos
const NFRAMES = Math.round(DUR * FPS);
const PERIODO = NFRAMES / FPS;           // el ciclo exacto de la flotación

// En una línea el mandala va más pequeño (proporción parecida a la del logo
// real: el logotipo pide como 9 veces la altura de las mayúsculas) y el bloque
// entero se recoloca para seguir centrado en el 9:16.
const MANDALA_D = Math.round((UNA_LINEA ? 500 : 620) * ESCALA);   // diámetro final
const MANDALA_CY = Math.round((UNA_LINEA ? 826 : 720) * ESCALA);
const RAYA_W = Math.round((UNA_LINEA ? 340 : 380) * ESCALA);
const RAYA_Y = Math.round((UNA_LINEA ? 1186 : 1160) * ESCALA);
const RAYA_H = Math.max(1, Math.round(2 * ESCALA));

// ── Tipografía ───────────────────────────────────────────────────────────────
const FS_REF = 200;                      // cuerpo con el que se rasterizan las letras
const LIENZO_LETRA = 400;                // lado del lienzo de cada letra
const CAP_TOP = 80;                      // fila donde arranca la mayúscula (cuerpo 200)
// Seguido cabe menos, así que el cuerpo y el tracking bajan para que la línea
// entre holgada en el ancho del vídeo.
const ESC_LETRA = (UNA_LINEA ? 0.393 : 0.583) * ESCALA;        // 200 → ~79 / ~117 de cuerpo
const TRACK = Math.round((UNA_LINEA ? 0.14 : 0.20) * FS_REF * ESC_LETRA);
const ESPACIO = Math.round((UNA_LINEA ? 0.45 : 0.55) * FS_REF * ESC_LETRA);
// Cada línea con su altura de mayúsculas y el retraso con el que empieza.
const LINEAS = UNA_LINEA
  ? [{ texto: "LIFE AS A PRIVILEGE", cap: Math.round(1291 * ESCALA), paso: 0.048, desfase: 0 }]
  : [{ texto: "LIFE AS", cap: Math.round(1250 * ESCALA), paso: 0.055, desfase: 0 },
     { texto: "A PRIVILEGE", cap: Math.round(1389 * ESCALA), paso: 0.05, desfase: 0.12 }];

// ── Guion (segundos) ─────────────────────────────────────────────────────────
// La entrada de "welcome" es la de la portada: rápida (poco más de un segundo),
// así que la rayita y el texto entran antes.
const T_MANDALA = ES_WELCOME ? 1.40 : 2.20;   // lo que tarda el mandala en colocarse
const T_RAYA_IN = ES_WELCOME ? 1.45 : 1.95, T_RAYA_DUR = 0.40;
const T_TEXTO = ES_WELCOME ? 1.70 : 2.20;     // primera letra
const DUR_LETRA = 0.60;
const SIGMA_MAX = 13 * ESCALA;           // desenfoque del que sale cada letra
const SUBIDA = 18 * ESCALA;              // cada letra sube un poco al aparecer
// Estela del mandala: menos giro, menos borrón (si no, un giro corto y suave
// aparecería exageradamente desenfocado). En "welcome" el borrón es el blur(6px)
// de la portada, proporcional al tamaño del mandala.
const SIGMA_MANDALA = (2 + 8 * Math.min(1, Math.abs(GIRO) / 900)) * ESCALA;
// Aura del estilo "volante" (la de siempre). [sigma, opacidad, tinte]
const GLOW = [[34, 0.16, null]];

// ── Los números EXACTOS de Welcome.tsx ───────────────────────────────────────
// Allí el mandala mide 72px de alto, así que todas las medidas del filtro y de
// la flotación van multiplicadas por lo que aquí es más grande: se ve igual,
// solo a otro tamaño.
const K_WEB = MANDALA_D / 72;
const WEB = {
  escIni: 0.25,                 // transform: scale(0.25) rotate(-45deg)
  blurIni: 6,                   // filter: … blur(6px)  (px CSS)
  tOpacidad: 1.1,               // transition: opacity 1.1s ease
  tTransform: 1.3,              //             transform 1.3s cubic-bezier(0.22,1.5,0.36,1)
  tFiltro: 1.0,                 //             filter 1s ease
  flotaY: 9,                    // @keyframes mandalaFloat: translateY(-9px)
  flotaEsc: 1.03,               //                          scale(1.03)
  // filter: los tres drop-shadow, en el mismo orden. En CSS se aplican EN
  // CADENA: la segunda sombra es la sombra de (icono + primera sombra), no del
  // icono a secas. De ahí que el glow abulte tanto.
  sombras: [
    { radio: 10, color: { r: 255, g: 255, b: 255 }, alfa: 0.59 },
    { radio: 24, color: { r: 255, g: 255, b: 255 }, alfa: 0.32 },
    { radio: 47, color: { r: 180, g: 255, b: 245 }, alfa: 0.24 },
  ],
};

// ── Curvas ───────────────────────────────────────────────────────────────────
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const outQuad = (p) => 1 - Math.pow(1 - p, 2);   // frenada constante (volante de inercia)
const outCubic = (p) => 1 - Math.pow(1 - p, 3);
const outBack = (p, s = 0.9) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);

/** La misma cubic-bezier de CSS, resuelta por bisección. */
function bezier(x1, y1, x2, y2) {
  const en = (t, a, b) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 32; i++) { if (en(t, x1, x2) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return en(t, y1, y2);
  };
}
// transform: 1.3s cubic-bezier(0.22,1.5,0.36,1) → el muelle de Welcome, que se
// pasa un poco de tamaño y vuelve.
const muelle = bezier(0.22, 1.5, 0.36, 1);
const easeCss = bezier(0.25, 0.1, 0.25, 1);        // el `ease` de CSS
const easeInOutCss = bezier(0.42, 0, 0.58, 1);     // el `ease-in-out` de CSS

const ff = (argv) => execFileSync("ffmpeg", argv, { stdio: ["ignore", "ignore", "pipe"] });

// ── 1. La fuente de la marca, sacada del archivo que usan los PDF ────────────
function extraerFuente() {
  const dir = path.join(TMP, "fuente");
  fs.mkdirSync(dir, { recursive: true });
  const ttf = path.join(dir, "EBGaramond-Regular.ttf");
  if (fs.existsSync(ttf)) return ttf;
  const src = fs.readFileSync(FUENTE_TS, "utf8");
  const m = src.match(/GARAMOND_REGULAR\s*=\s*[`"']([A-Za-z0-9+/=\s]+)[`"']/);
  if (!m) throw new Error("no encuentro GARAMOND_REGULAR en " + FUENTE_TS);
  fs.writeFileSync(ttf, Buffer.from(m[1].replace(/\s/g, ""), "base64"));
  return ttf;
}

// ── 2. Cada letra a PNG con ffmpeg (drawtext), sobre lienzo transparente ─────
//    Se dibujan una a una para poder darles tracking y animarlas por separado.
const LETRAS = [...new Set(LINEAS.map((l) => l.texto).join("").replace(/ /g, "").split(""))];
function rasterizarLetras(ttf) {
  const dir = path.join(TMP, "letras");
  fs.mkdirSync(dir, { recursive: true });
  const fuente = ttf.replace(/\\/g, "/").replace(/:/g, "\\:");
  for (const ch of LETRAS) {
    const out = path.join(dir, `${ch}.png`);
    if (fs.existsSync(out)) continue;
    ff(["-y", "-v", "error",
      "-f", "lavfi", "-i", `color=c=black@0.0:s=${LIENZO_LETRA}x${LIENZO_LETRA},format=rgba`,
      "-vf", `drawtext=fontfile='${fuente}':text='${ch}':fontcolor=white:fontsize=${FS_REF}:x=100:y=${CAP_TOP}`,
      "-frames:v", "1", out]);
  }
  return dir;
}

/** Caja de tinta de cada letra. Solo se recorta en horizontal: conservando el
 *  alto del lienzo, todas las letras comparten la misma línea base. */
async function medirLetras(dir) {
  const med = {};
  for (const ch of LETRAS) {
    const img = sharp(path.join(dir, `${ch}.png`));
    const { width, height } = await img.metadata();
    const data = await img.ensureAlpha().raw().toBuffer();
    let x0 = width, x1 = -1;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++)
        if (data[(y * width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    med[ch] = { x0, x1, height };
  }
  return med;
}

// ── Utilidades de imagen ─────────────────────────────────────────────────────
/** Multiplica el alfa de una capa RGBA por `a` (0-1). */
async function conAlfa(buf, w, h, a) {
  if (a >= 0.999) return buf;
  return sharp(buf)
    .composite([{
      input: { create: { width: w, height: h, channels: 4, background: { r: 255, g: 255, b: 255, alpha: a } } },
      blend: "dest-in",
    }])
    .png().toBuffer();
}

/** Margen transparente + desenfoque (si no, el borrón se corta en el borde). */
async function desenfocar(buf, w, h, sigma) {
  const pad = Math.ceil(sigma * 2);
  const ext = await sharp(buf)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(sigma).png().toBuffer();
  return { buf: ext, w: w + pad * 2, h: h + pad * 2, pad };
}

/** Recorta la capa a lo que cabe en el lienzo (sharp no admite capas mayores). */
async function alLienzo(buf, w, h, left, top) {
  const l = Math.max(0, -left), t = Math.max(0, -top);
  const r = Math.max(0, left + w - W), b = Math.max(0, top + h - H);
  if (!l && !t && !r && !b) return { input: buf, left, top };
  const nw = w - l - r, nh = h - t - b;
  if (nw <= 0 || nh <= 0) return null;
  const cortado = await sharp(buf).extract({ left: l, top: t, width: nw, height: nh }).png().toBuffer();
  return { input: cortado, left: left + l, top: top + t };
}

// ── Letras: sprite al tamaño final + versiones desenfocadas (con caché) ──────
function hazLetras(dirLetras, med) {
  const sprites = new Map();
  const cache = new Map();

  async function sprite(ch) {
    if (sprites.has(ch)) return sprites.get(ch);
    const m = med[ch];
    const w = m.x1 - m.x0 + 1;
    const rec = await sharp(path.join(dirLetras, `${ch}.png`))
      .extract({ left: m.x0, top: 0, width: w, height: m.height })
      .resize(Math.max(1, Math.round(w * ESC_LETRA)), Math.max(1, Math.round(m.height * ESC_LETRA)), { fit: "fill" })
      .png().toBuffer({ resolveWithObject: true });
    const out = { buf: rec.data, w: rec.info.width, h: rec.info.height };
    sprites.set(ch, out);
    return out;
  }

  /** Letra con desenfoque y opacidad dados (cuantizados para reusar caché). */
  async function letra(ch, sigma, alfa) {
    const sq = Math.round(sigma * 2) / 2;
    const aq = Math.round(alfa * 40) / 40;
    const key = `${ch}|${sq}|${aq}`;
    if (cache.has(key)) return cache.get(key);
    const sp = await sprite(ch);
    let buf = sp.buf, w = sp.w, h = sp.h, pad = 0;
    if (sq > 0.3) {
      const d = await desenfocar(buf, w, h, sq);
      buf = d.buf; w = d.w; h = d.h; pad = d.pad;
    }
    const out = { buf: await conAlfa(buf, w, h, aq), w, h, pad };
    cache.set(key, out);
    return out;
  }

  /** Reparte una línea centrada; devuelve dónde va cada letra. */
  async function disponer(texto, capY) {
    const chars = texto.split("");
    const anchos = [];
    for (const c of chars) anchos.push(c === " " ? ESPACIO : (await sprite(c)).w);
    const hueco = (i) => (i < chars.length - 1 && chars[i] !== " " && chars[i + 1] !== " " ? TRACK : 0);
    let total = 0;
    for (let i = 0; i < chars.length; i++) total += anchos[i] + hueco(i);
    let x = Math.round((W - total) / 2);
    const arriba = Math.round(CAP_TOP * ESC_LETRA);   // del borde del sprite a la mayúscula
    const items = [];
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== " ") items.push({ ch: chars[i], x, y: capY - arriba, idx: items.length });
      x += anchos[i] + hueco(i);
    }
    return items;
  }

  return { letra, disponer };
}

// ── Mandala: se pre-escala una vez y se gira/escala en cada fotograma ────────
async function mandalaBase() {
  return sharp(MANDALA_PNG)
    .resize(MANDALA_D, MANDALA_D, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer();
}

/** Silueta RELLENA del mandala: el contorno exterior con los huecos entre
 *  pétalos tapados. Se usa como origen del glow para que el aura salga solo
 *  hacia fuera; si el origen fuera el dibujo, la sombra más pegada rellenaría de
 *  blanco los huecos y el mandala se vería lechoso en vez de encendido (a 72px
 *  eso se lee como brillo, a 500px como suciedad).
 *  El mandala es estrellado respecto a su centro, así que basta con quedarse,
 *  para cada ángulo, con el píxel pintado más lejano y rellenar hasta ahí. */
async function siluetaRellena(base, lado) {
  const { data, info } = await sharp(base).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cx = info.width / 2, cy = info.height / 2;
  const PASOS = 720;
  const rMax = new Float64Array(PASOS);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] <= 16) continue;
      const dx = x - cx, dy = y - cy;
      const r = Math.hypot(dx, dy);
      let i = Math.round(((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * PASOS) % PASOS;
      if (r > rMax[i]) rMax[i] = r;
    }
  }
  // Un sector puede quedarse sin ningún píxel (el redondeo del ángulo no reparte
  // igual) y ahí el relleno tendría una ranura por la que se cuela el glow: se
  // ve como una raya blanca saliendo del centro. Se tapa con el máximo de los
  // sectores vecinos, y de paso el borde crece 1px para que no se escape el glow
  // por el antialias del dibujo.
  const suave = new Float64Array(PASOS);
  for (let i = 0; i < PASOS; i++) {
    let m = 0;
    for (let k = -3; k <= 3; k++) m = Math.max(m, rMax[(i + k + PASOS) % PASOS]);
    suave[i] = m + 1.5;
  }
  const mascara = Buffer.alloc(info.width * info.height, 0);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const dx = x - cx, dy = y - cy;
      const i = Math.round(((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * PASOS) % PASOS;
      if (Math.hypot(dx, dy) <= suave[i]) mascara[y * info.width + x] = 255;
    }
  }
  return sharp({ create: { width: info.width, height: info.height, channels: 3, background: "#ffffff" } })
    .joinChannel(mascara, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toBuffer();
}

async function mandalaFrame(base, angulo, escala) {
  const rot = await sharp(base)
    .rotate(angulo, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer({ resolveWithObject: true });
  const lado = Math.max(2, Math.round(rot.info.width * escala));
  return { buf: await sharp(rot.data).resize(lado, lado, { fit: "fill" }).png().toBuffer(), w: lado, h: lado };
}

// Las tres sigmas del filter de Welcome, ya a la escala de este mandala (en CSS
// un `drop-shadow(0 0 R)` difumina con una gaussiana de sigma R/2).
const SIGMAS_WEB = WEB.sombras.map((s) => (s.radio / 2) * K_WEB * ESCALA);
// Margen del lienzo del glow. Todas las capas se pintan en el MISMO lienzo con
// este margen: si cada sombra se hiciera en su propia caja, el escalón del borde
// de cada caja se vería como un cuadrado clarito alrededor del mandala.
const PAD_GLOW = Math.ceil(3.5 * Math.hypot(...SIGMAS_WEB));

/** El mandala tal cual lo pinta el navegador en Welcome: se gira, se le aplica
 *  el `filter` (los tres drop-shadow encadenados + el blur de la entrada) EN
 *  ESPACIO DEL ELEMENTO y solo al final se escala, que es el orden de CSS
 *  (primero filter, luego transform). Se cachea porque en cuanto se coloca, el
 *  ángulo y el blur ya no cambian y solo varía la escala de la flotación. */
function hazMandalaWeb(base, relleno) {
  const cache = new Map();
  return async function (angulo, sigmaBlur, escala) {
    const key = `${angulo.toFixed(2)}|${sigmaBlur.toFixed(2)}`;
    let capa = cache.get(key);
    if (!capa) {
      const rot = await sharp(base)
        .rotate(angulo, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer({ resolveWithObject: true });
      const rotRelleno = await sharp(relleno)
        .rotate(angulo, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer();
      const w = rot.info.width + PAD_GLOW * 2, h = rot.info.height + PAD_GLOW * 2;
      const enLienzo = (x) => sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: x, left: PAD_GLOW, top: PAD_GLOW }]).png().toBuffer();
      const silueta = await enLienzo(rotRelleno);
      let buf = silueta;
      // Cada drop-shadow: la silueta de lo acumulado, desenfocada y teñida, va
      // DEBAJO de lo acumulado. Encadenados como en CSS: la segunda sombra es la
      // sombra de (silueta + primera sombra).
      for (let i = 0; i < WEB.sombras.length; i++) {
        const { color, alfa } = WEB.sombras[i];
        const difusa = await sharp(buf).blur(SIGMAS_WEB[i]).ensureAlpha().png().toBuffer();
        // Dos avisos de sharp aquí, los dos silenciosos:
        //  · `linear` NO toca el canal alfa, así que hay que sacar el alfa a una
        //    imagen aparte y multiplicar allí. Del tirón
        //    (`extractChannel(3).linear(…)`) la opacidad se pierde y la sombra
        //    sale a tope: el glow deslumbra.
        //  · al volver a `raw`, sharp saca la banda como sRGB (3 bandas). Si no
        //    se fuerza `b-w`, `joinChannel` lee un tercio de la imagen como
        //    máscara y el glow desaparece. Se comprueba con data.length === w*h.
        const banda = await sharp(difusa).extractChannel(3).png().toBuffer();
        const mascara = await sharp(banda)
          .linear(Math.min(1, alfa * BRILLO), 0)
          .toColourspace("b-w").raw().toBuffer();
        if (mascara.length !== w * h) throw new Error(`máscara de ${mascara.length}, esperaba ${w * h}`);
        const sombra = await sharp({ create: { width: w, height: h, channels: 3, background: color } })
          .joinChannel(mascara, { raw: { width: w, height: h, channels: 1 } })
          .png().toBuffer();
        buf = await sharp(sombra).composite([{ input: buf }]).png().toBuffer();
      }
      // Se recorta la silueta del glow (queda solo el aura de alrededor) y
      // encima va el mandala nítido: dentro se ve el turquesa, no blanco.
      buf = await sharp(buf).composite([{ input: silueta, blend: "dest-out" }]).png().toBuffer();
      buf = await sharp(buf).composite([{ input: rot.data, left: PAD_GLOW, top: PAD_GLOW }]).png().toBuffer();
      if (sigmaBlur > 0.3) buf = await sharp(buf).blur(sigmaBlur).png().toBuffer();
      capa = { buf, w, h };
      if (cache.size > 3) cache.clear();
      cache.set(key, capa);
    }
    const lado = Math.max(2, Math.round(capa.w * escala));
    return { buf: await sharp(capa.buf).resize(lado, lado, { fit: "fill" }).png().toBuffer(), w: lado, h: lado };
  };
}

// ── Fotogramas ───────────────────────────────────────────────────────────────
async function pintarFotogramas(dirFrames, tipo) {
  const base = await mandalaBase();
  const mandalaWeb = hazMandalaWeb(base, ES_WELCOME ? await siluetaRellena(base, MANDALA_D) : null);
  const lineas = [];
  for (const l of LINEAS) lineas.push({ ...l, items: await tipo.disponer(l.texto, l.cap) });

  for (let f = 0; f < NFRAMES; f++) {
    const t = f / FPS;
    const capas = [];

    if (ES_WELCOME) {
      // ── El mandala EXACTAMENTE como en Welcome ────────────────────────────
      // La imagen: opacity 1.1s ease · transform 1.3s muelle · filter 1s ease.
      const pt = clamp01(t / WEB.tTransform);
      const avance = muelle(pt);
      const escImagen = WEB.escIni + (1 - WEB.escIni) * avance;
      const angulo = -GIRO * (1 - avance);
      const sigmaBlur = WEB.blurIni * K_WEB * ESCALA * (1 - easeCss(clamp01(t / WEB.tFiltro)));
      const opM = easeCss(clamp01(t / WEB.tOpacidad));
      // El wrapper: mandalaFloat 5.5s ease-in-out infinite (sube y late sin
      // parar). Va POR FUERA de la escala de la imagen, así que se multiplica.
      const fase = (t % PERIODO) / PERIODO;
      const vaiven = fase < 0.5 ? easeInOutCss(fase * 2) : 1 - easeInOutCss((fase - 0.5) * 2);
      const escala = escImagen * (1 + (WEB.flotaEsc - 1) * vaiven);
      const subeY = WEB.flotaY * K_WEB * ESCALA * vaiven;

      const m = await mandalaWeb(angulo, sigmaBlur, escala);
      capas.push(await alLienzo(
        await conAlfa(m.buf, m.w, m.h, opM), m.w, m.h,
        Math.round(W / 2 - m.w / 2), Math.round(MANDALA_CY - subeY - m.h / 2)));
    } else {
      // ── Entrada "volante de inercia" (la del cierre de dos líneas) ────────
      const pm = clamp01(t / T_MANDALA);
      const m = await mandalaFrame(base, -GIRO * (1 - outQuad(pm)), 0.38 + 0.62 * outBack(pm, 0.9));
      const opM = clamp01(t / 0.55);
      const mx = Math.round(W / 2 - m.w / 2);
      const my = Math.round(MANDALA_CY - m.h / 2);

      // Aura: el mismo mandala muy desenfocado y muy tenue. Constante a
      // propósito (si "respira", cambia toda la zona en cada fotograma y el
      // .gif se dispara de peso) y sin blanco de más.
      for (const [sigma, alfa, tinte] of GLOW) {
        let halo = await desenfocar(m.buf, m.w, m.h, sigma * ESCALA);
        if (tinte) halo = { ...halo, buf: await sharp(halo.buf).tint(tinte).png().toBuffer() };
        capas.push(await alLienzo(await conAlfa(halo.buf, halo.w, halo.h, Math.min(1, alfa * opM)),
          halo.w, halo.h, mx - halo.pad, my - halo.pad));
      }

      // Mientras gira rápido va desenfocado (estela) y enfoca al colocarse.
      const sigmaM = SIGMA_MANDALA * Math.pow(1 - pm, 1.2);
      if (sigmaM > 0.4) {
        const mv = await desenfocar(m.buf, m.w, m.h, sigmaM);
        capas.push(await alLienzo(await conAlfa(mv.buf, mv.w, mv.h, opM), mv.w, mv.h, mx - mv.pad, my - mv.pad));
      } else {
        capas.push(await alLienzo(await conAlfa(m.buf, m.w, m.h, opM), m.w, m.h, mx, my));
      }
    }

    // La rayita del logotipo, abriéndose desde el centro.
    const pr = clamp01((t - T_RAYA_IN) / T_RAYA_DUR);
    if (pr > 0) {
      const w = Math.max(2, Math.round(RAYA_W * outCubic(pr)));
      const raya = await sharp({ create: { width: w, height: RAYA_H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } }).png().toBuffer();
      capas.push({ input: await conAlfa(raya, w, RAYA_H, 0.55), left: Math.round(W / 2 - w / 2), top: RAYA_Y });
    }

    // El logotipo, letra a letra: sale del desenfoque subiendo un poco.
    for (const { items, paso, desfase } of lineas) {
      for (const it of items) {
        const p = clamp01((t - (T_TEXTO + desfase + it.idx * paso)) / DUR_LETRA);
        if (p <= 0) continue;
        const e = outCubic(p);
        const L = await tipo.letra(it.ch, SIGMA_MAX * (1 - e), clamp01(p * 1.6));
        capas.push({ input: L.buf, left: Math.round(it.x - L.pad), top: Math.round(it.y + SUBIDA * (1 - e) - L.pad) });
      }
    }

    await sharp({ create: { width: W, height: H, channels: 3, background: TURQUESA } })
      .composite(capas.filter(Boolean))
      .png({ compressionLevel: 6 })
      .toFile(path.join(dirFrames, `f${String(f).padStart(4, "0")}.png`));
    if (f % 25 === 0) process.stdout.write(`  ${f}/${NFRAMES}\r`);
  }
}

// ── GIF (paleta propia, sin tramado: el fondo es plano y así pesa menos) ─────
function montarGif(dirFrames, destino, ancho, fpsSalida = FPS) {
  const escalado = ancho ? `scale=${ancho}:-1:flags=lanczos,` : "";
  const cadencia = fpsSalida !== FPS ? `fps=${fpsSalida},` : "";
  ff(["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(dirFrames, "f%04d.png"),
    "-filter_complex", `[0:v]${escalado}${cadencia}split[a][b];[a]palettegen=max_colors=64:stats_mode=full[p];[b][p]paletteuse=dither=none`,
    "-loop", "0", destino]);
}

function montarMp4(dirFrames, destino) {
  ff(["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(dirFrames, "f%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", destino]);
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const dirFrames = path.join(TMP, "frames");
  fs.rmSync(dirFrames, { recursive: true, force: true });
  fs.mkdirSync(dirFrames, { recursive: true });
  fs.mkdirSync(SALIDA, { recursive: true });

  console.log("· tipografía de la marca…");
  const ttf = extraerFuente();
  const dirLetras = rasterizarLetras(ttf);
  const med = await medirLetras(dirLetras);

  console.log(`· ${NFRAMES} fotogramas a ${W}x${H}…`);
  await pintarFotogramas(dirFrames, hazLetras(dirLetras, med));

  const sufijo = ESCALA === 1 ? "" : `-x${ESCALA}`;
  const g1 = path.join(SALIDA, `${NOMBRE}-1080x1920${sufijo}.gif`);
  console.log("· gif…");
  montarGif(dirFrames, g1, null);
  const hechos = [g1];
  if (ESCALA === 1) {
    const g2 = path.join(SALIDA, `${NOMBRE}-720x1280.gif`);
    montarGif(dirFrames, g2, 720);
    hechos.push(g2);
  }
  // Versión ligera: la MISMA animación a media cadencia. El .gif de la entrada
  // de Welcome pesa porque la flotación mueve el aura entera en cada fotograma;
  // bajar los colores bandearía el degradado, así que se bajan fotogramas.
  if (LIGERO) {
    const gl = path.join(SALIDA, `${NOMBRE}-720x1280-ligero.gif`);
    montarGif(dirFrames, gl, 720, FPS / 2);
    hechos.push(gl);
  }
  if (HACER_MP4) {
    const v = path.join(SALIDA, `${NOMBRE}-1080x1920${sufijo}.mp4`);
    montarMp4(dirFrames, v);
    hechos.push(v);
  }
  for (const f of hechos)
    console.log(`  ${path.relative(RAIZ, f)}  ${(fs.statSync(f).size / 1048576).toFixed(2)} MB`);
})().catch((e) => { console.error(e); process.exit(1); });
