#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// CIERRE DE REELS (9:16) · MÁRMOL · 3 segundos
//
//   1. el mármol de la web (con sus zonas turquesas) aparece con un fundido suave sobre el turquesa;
//   2. el mandala turquesa se enciende y se queda casi quieto, con un balanceo mínimo;
//   3. «MARÍA ESCRIBANO», en una sola línea y en turquesa, aparece con un fundido, tras una raya fina.
//
// Uso:
//   node scripts/video/cierre-marmol.mjs               → gif 720x1280 + mp4 1080x1920
//   node scripts/video/cierre-marmol.mjs --escala 0.5  → solo una prueba rápida
//
// Sale a marca/ (fuera de la web, como el otro cierre). Instagram no sube .gif: para los reels
// se usa el .mp4; el .gif es para compartirlo o verlo.
// Requiere ffmpeg en el PATH. La letra es la EB Garamond de ebGaramondData.ts (la de los PDF).
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

const MARMOL = path.join(RAIZ, "frontend/public/img/fondos/marmolfondo.webp");
const MANDALA_PNG = path.join(RAIZ, "frontend/public/img/icono/life.webp");
const FUENTE_TS = path.join(RAIZ, "frontend/src/utils/fonts/ebGaramondData.ts");
const SALIDA = path.join(RAIZ, "marca");
const TMP = path.join(os.tmpdir(), "laap-cierre-marmol");

const args = process.argv.slice(2);
const flag = (n, def) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] ?? true : def; };
const ESCALA = Number(flag("escala", 1));

const W = Math.round(1080 * ESCALA);
const H = Math.round(1920 * ESCALA);
const FPS = 25;
const DUR = 3.0;
const NFRAMES = Math.round(DUR * FPS);
const TURQUESA = { r: 0, g: 128, b: 128 };      // #008080: la web
const TINTA = { r: 0, g: 79, b: 79 };           // #004f4f: el turquesa oscuro del mármol

// Medidas (sobre 1080x1920)
const MANDALA_D = Math.round(340 * ESCALA);
const MANDALA_CY = Math.round(710 * ESCALA);
const BOB = 5 * ESCALA;                          // balanceo mínimo
const BOB_PERIODO = 3.0;                         // un solo ciclo en todo el clip
const RAYA_Y = Math.round(960 * ESCALA), RAYA_W = Math.round(110 * ESCALA);
const CAP_LINEAS = [Math.round(1050 * ESCALA)];
const LINEAS = ["MARÍA ESCRIBANO"];

// Guion (s)
const T_MARMOL = [0.0, 0.7];
const T_MANDALA = 0.45, T_MANDALA_DUR = 1.0;
const T_RAYA = 1.15, T_RAYA_DUR = 0.6;
const T_TEXTO = 1.35, T_TEXTO_DUR = 0.9;

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const outCubic = (p) => 1 - Math.pow(1 - p, 3);
const outBack = (p, s = 1.1) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
const ff = (argv) => execFileSync("ffmpeg", argv, { stdio: ["ignore", "ignore", "pipe"] });

// ── Fuente ───────────────────────────────────────────────────────────────────
function extraerFuente() {
  const dir = path.join(TMP, "fuente"); fs.mkdirSync(dir, { recursive: true });
  const ttf = path.join(dir, "EBGaramond-Regular.ttf");
  if (fs.existsSync(ttf)) return ttf;
  const src = fs.readFileSync(FUENTE_TS, "utf8");
  const m = src.match(/GARAMOND_REGULAR\s*=\s*[`"']([A-Za-z0-9+/=\s]+)[`"']/);
  if (!m) throw new Error("no encuentro GARAMOND_REGULAR");
  fs.writeFileSync(ttf, Buffer.from(m[1].replace(/\s/g, ""), "base64"));
  return ttf;
}

const FS_REF = 200, LIENZO = 400, CAP_TOP = 80;
const ESC_LETRA = 0.27 * ESCALA;                 // cuerpo ~54 px: pequeño y sobrio
const TRACK = Math.round(0.32 * FS_REF * ESC_LETRA);
const ESPACIO = Math.round(0.9 * FS_REF * ESC_LETRA);
const LETRAS = [...new Set(LINEAS.join("").replace(/ /g, "").split(""))];

function rasterizarLetras(ttf) {
  const dir = path.join(TMP, "letras"); fs.mkdirSync(dir, { recursive: true });
  const fuente = ttf.replace(/\\/g, "/").replace(/:/g, "\\:");
  for (const ch of LETRAS) {
    const out = path.join(dir, `${ch.codePointAt(0)}.png`);
    if (fs.existsSync(out)) continue;
    // La letra va por archivo UTF-8: en la línea de comandos de Windows la Í llega como í.
    const txt = path.join(dir, `${ch.codePointAt(0)}.txt`);
    fs.writeFileSync(txt, ch, "utf8");
    const archivoTxt = txt.replace(/\\/g, "/").replace(/:/g, "\\:");
    ff(["-y", "-v", "error", "-f", "lavfi", "-i", `color=c=black@0.0:s=${LIENZO}x${LIENZO},format=rgba`,
      "-vf", `drawtext=fontfile='${fuente}':textfile='${archivoTxt}':fontcolor=white:fontsize=${FS_REF}:x=100:y=${CAP_TOP}`,
      "-frames:v", "1", out]);
  }
  return dir;
}

/** Recolorea una capa RGBA conservando solo su alfa. */
async function tenir(buf, color) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    out[i] = color.r; out[i + 1] = color.g; out[i + 2] = color.b; out[i + 3] = data[i + 3];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function conAlfa(buf, w, h, a) {
  if (a >= 0.999) return buf;
  return sharp(buf).composite([{ input: { create: { width: w, height: h, channels: 4, background: { r: 255, g: 255, b: 255, alpha: a } } }, blend: "dest-in" }]).png().toBuffer();
}

async function desenfocar(buf, w, h, sigma) {
  const pad = Math.ceil(sigma * 2);
  const ext = await sharp(buf).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).blur(sigma).png().toBuffer();
  return { buf: ext, w: w + pad * 2, h: h + pad * 2, pad };
}

// ── Letras ───────────────────────────────────────────────────────────────────
async function prepararLetras(dir) {
  const sprites = new Map();
  const bases = new Map();   // última fila con tinta de cada letra (su línea base)
  for (const ch of LETRAS) {
    const archivo = path.join(dir, `${ch.codePointAt(0)}.png`);
    const img = sharp(archivo);
    const { width, height } = await img.metadata();
    const data = await img.ensureAlpha().raw().toBuffer();
    let x0 = width, x1 = -1, y1 = -1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++)
      if (data[(y * width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    bases.set(ch, y1);
    const w = x1 - x0 + 1;
    const rec = await sharp(archivo).extract({ left: x0, top: 0, width: w, height })
      .resize(Math.max(1, Math.round(w * ESC_LETRA)), Math.max(1, Math.round(height * ESC_LETRA)), { fit: "fill" })
      .png().toBuffer({ resolveWithObject: true });
    sprites.set(ch, { buf: await tenir(rec.data, TINTA), w: rec.info.width, h: rec.info.height });
  }
  // La letra con acento (Í) sale de drawtext con la línea base más abajo, porque la caja del texto
  // es más alta; se sube lo justo para que quede en la misma línea que las demás (la A, sin
  // sobresalir, marca dónde está la línea base).
  const dyDe = (ch) => (ch === "Í" && bases.has("A") ? Math.round((bases.get("A") - bases.get(ch)) * ESC_LETRA) : 0);
  const cache = new Map();
  const letra = async (ch, sigma, alfa) => {
    const sq = Math.round(sigma * 2) / 2, aq = Math.round(alfa * 40) / 40, key = `${ch}|${sq}|${aq}`;
    if (cache.has(key)) return cache.get(key);
    const sp = sprites.get(ch);
    let buf = sp.buf, w = sp.w, h = sp.h, pad = 0;
    if (sq > 0.3) { const d = await desenfocar(buf, w, h, sq); buf = d.buf; w = d.w; h = d.h; pad = d.pad; }
    const out = { buf: await conAlfa(buf, w, h, aq), w, h, pad };
    cache.set(key, out); return out;
  };
  const disponer = (texto, capY) => {
    const chars = texto.split("");
    const ancho = (c) => (c === " " ? ESPACIO : sprites.get(c).w);
    const hueco = (i) => (i < chars.length - 1 && chars[i] !== " " && chars[i + 1] !== " " ? TRACK : 0);
    let total = 0; chars.forEach((c, i) => { total += ancho(c) + hueco(i); });
    let x = Math.round((W - total) / 2);
    const arriba = Math.round(CAP_TOP * ESC_LETRA);
    const items = [];
    chars.forEach((ch, i) => { if (ch !== " ") items.push({ ch, x, y: capY - arriba + dyDe(ch), idx: items.length }); x += ancho(ch) + hueco(i); });
    return items;
  };
  return { letra, disponer };
}

// ── Fondo: el mármol de la web girado 90° y recortado a 9:16 (las manchas turquesas quedan en
//    esquinas opuestas) ──────────────────────────────────────────────────────────────────────
async function fondoMarmol() {
  const rot = await sharp(MARMOL).rotate(90).png().toBuffer();
  const meta = await sharp(rot).metadata();
  const ancho = Math.round(meta.height * 9 / 16);
  return sharp(rot).extract({ left: Math.round((meta.width - ancho) / 2), top: 0, width: ancho, height: meta.height })
    .resize(W, H, { fit: "fill" }).png().toBuffer();
}

/** Banda central del mármol, de `alto` px, con los bordes suaves mientras crece. */
async function bandaMarmol(marmol, alto) {
  const h = Math.max(2, Math.min(H, Math.round(alto)));
  const top = Math.round((H - h) / 2);
  const completo = h >= H;
  const suave = Math.min(70 * ESCALA, h / 2);
  const franja = await sharp(marmol).extract({ left: 0, top, width: W, height: h }).ensureAlpha().png().toBuffer();
  if (completo) return { input: franja, left: 0, top };
  const mascara = Buffer.from(
    `<svg width="${W}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/>` +
    `<stop offset="${suave / h}" stop-color="#fff" stop-opacity="1"/>` +
    `<stop offset="${1 - suave / h}" stop-color="#fff" stop-opacity="1"/>` +
    `<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` +
    `<rect width="${W}" height="${h}" fill="url(#g)"/></svg>`);
  const buf = await sharp(franja).composite([{ input: mascara, blend: "dest-in" }]).png().toBuffer();
  return { input: buf, left: 0, top };
}

async function mandalaBase() {
  const base = await sharp(MANDALA_PNG)
    .resize(MANDALA_D, MANDALA_D, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return tenir(base, TINTA);
}

/** sharp no admite capas que se salgan del lienzo: se recorta lo que sobra. */
async function alLienzo(c) {
  const { width, height } = await sharp(c.input).metadata();
  const l = Math.max(0, -c.left), t = Math.max(0, -c.top);
  const r = Math.max(0, c.left + width - W), b = Math.max(0, c.top + height - H);
  if (c.left >= W || c.top >= H || c.left + width <= 0 || c.top + height <= 0) return null;
  if (!l && !t && !r && !b) return c;
  const cortado = await sharp(c.input).extract({ left: l, top: t, width: width - l - r, height: height - t - b }).png().toBuffer();
  return { input: cortado, left: c.left + l, top: c.top + t };
}

async function main() {
  fs.rmSync(path.join(TMP, "frames"), { recursive: true, force: true });
  fs.mkdirSync(path.join(TMP, "frames"), { recursive: true });
  fs.mkdirSync(SALIDA, { recursive: true });

  const letras = await prepararLetras(rasterizarLetras(extraerFuente()));
  const marmol = await fondoMarmol();
  const mandala = await mandalaBase();
  const lienzo = { create: { width: W, height: H, channels: 3, background: TURQUESA } };
  const filas = LINEAS.map((t, i) => letras.disponer(t, CAP_LINEAS[i]));
  const SUBIDA = 8 * ESCALA;
  const rayaBuf = await sharp({ create: { width: RAYA_W, height: Math.max(1, Math.round(2 * ESCALA)), channels: 4, background: { ...TINTA, alpha: 1 } } }).png().toBuffer();
  const rayaMeta = await sharp(rayaBuf).metadata();
  const cacheAlfa = new Map();
  const marmolConAlfa = async (a) => {
    const q = Math.round(a * 50) / 50;
    if (!cacheAlfa.has(q)) cacheAlfa.set(q, await conAlfa(await sharp(marmol).ensureAlpha().png().toBuffer(), W, H, q));
    return cacheAlfa.get(q);
  };

  for (let f = 0; f < NFRAMES; f++) {
    const t = f / FPS;
    const capas = [];

    // 1 · mármol: fundido suave sobre el turquesa
    const pM = clamp01((t - T_MARMOL[0]) / (T_MARMOL[1] - T_MARMOL[0]));
    if (pM > 0) capas.push({ input: await marmolConAlfa(outCubic(pM)), left: 0, top: 0 });

    // 2 · mandala: se enciende con un fundido y un asentamiento mínimo; luego, un balanceo apenas perceptible
    const pD = clamp01((t - T_MANDALA) / T_MANDALA_DUR);
    if (pD > 0) {
      const d = Math.max(8, Math.round(MANDALA_D * (0.96 + 0.04 * outCubic(pD))));
      const m = await sharp(mandala).resize(d, d).png().toBuffer({ resolveWithObject: true });
      const buf = await conAlfa(m.data, m.info.width, m.info.height, outCubic(pD));
      const flota = -BOB * Math.sin(2 * Math.PI * t / BOB_PERIODO);
      capas.push({ input: buf, left: Math.round(W / 2 - m.info.width / 2), top: Math.round(MANDALA_CY + flota - m.info.height / 2) });
    }

    // 3 · raya fina y nombre (una línea): fundido con una subida mínima
    const pR = clamp01((t - T_RAYA) / T_RAYA_DUR);
    if (pR > 0) {
      const rb = await conAlfa(rayaBuf, rayaMeta.width, rayaMeta.height, 0.6 * outCubic(pR));
      capas.push({ input: rb, left: Math.round((W - RAYA_W) / 2), top: RAYA_Y });
    }
    const pT = clamp01((t - T_TEXTO) / T_TEXTO_DUR);
    if (pT > 0) {
      const e = outCubic(pT);
      for (const fila of filas) for (const it of fila) {
        const l = await letras.letra(it.ch, 0, e);
        capas.push({ input: l.buf, left: Math.round(it.x), top: Math.round(it.y + SUBIDA * (1 - e)) });
      }
    }

    const ok = [];
    for (const c of capas) { const r = await alLienzo(c); if (r) ok.push(r); }
    await sharp(lienzo).composite(ok).png().toFile(path.join(TMP, "frames", `f${String(f).padStart(4, "0")}.png`));
    if (f % 15 === 0) process.stdout.write(`\r  fotograma ${f}/${NFRAMES}`);
  }
  process.stdout.write("\n");

  const entrada = path.join(TMP, "frames", "f%04d.png");
  const gif = path.join(SALIDA, "cierre-marmol.gif");
  const gw = Math.min(720, W);
  // Una sola pasada (split → palettegen → paletteuse): con dos entradas, ffmpeg 8 falla.
  ff(["-y", "-v", "error", "-framerate", String(FPS), "-i", entrada, "-vf",
    `scale=${gw}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a`, "-loop", "0", gif]);
  const mp4 = path.join(SALIDA, "cierre-marmol.mp4");
  ff(["-y", "-v", "error", "-framerate", String(FPS), "-i", entrada, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-movflags", "+faststart", mp4]);
  console.log(`  ${gif}\n  ${mp4}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
