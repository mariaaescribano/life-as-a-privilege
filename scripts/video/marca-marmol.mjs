#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// IMAGEN DE MARCA (3:2, 1536x1024) · MÁRMOL
//
// El mármol de la web tal cual (horizontal, a su resolución completa), con el mandala turquesa
// oscuro a la izquierda y «MARÍA» / «ESCRIBANO» a la derecha, una línea debajo de la otra.
//
// Uso: node scripts/video/marca-marmol.mjs        → marca/marca-marmol.png
// Requiere Chrome (para pintar la letra). La letra es la EB Garamond de ebGaramondData.ts.
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
const MANDALA = path.join(RAIZ, "frontend/public/img/icono/life.webp");
const FUENTE_TS = path.join(RAIZ, "frontend/src/utils/fonts/ebGaramondData.ts");
const SALIDA = path.join(RAIZ, "marca");
const TMP = path.join(os.tmpdir(), "laap-marca-marmol");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));


const W = 1536, H = 1024;
const TINTA = { r: 0, g: 79, b: 79 };   // #004f4f

const dataUri = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;

function fuente(nombre) {
  const src = fs.readFileSync(FUENTE_TS, "utf8");
  const m = src.match(new RegExp(`${nombre}\\s*=\\s*[\`"']([A-Za-z0-9+/=\\s]+)[\`"']`));
  if (!m) throw new Error(`no encuentro ${nombre}`);
  return Buffer.from(m[1].replace(/\s/g, ""), "base64");
}

/** Mandala con el turquesa oscuro de la casa, conservando solo su forma. */
async function mandala() {
  const { data, info } = await sharp(MANDALA).resize(520, 520, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) { out[i] = TINTA.r; out[i + 1] = TINTA.g; out[i + 2] = TINTA.b; out[i + 3] = data[i + 3]; }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function main() {
  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(SALIDA, { recursive: true });
  if (!CHROME) throw new Error("no encuentro Chrome ni Edge");

  const fondoUri = dataUri(await sharp(MARMOL).resize(W, H, { fit: "fill" }).jpeg({ quality: 95 }).toBuffer(), "image/jpeg");
  const mandalaUri = dataUri(await mandala(), "image/png");
  const negrita = dataUri(fuente("GARAMOND_BOLD"), "font/ttf");

  const pagina = `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:G;font-weight:700;src:url(${negrita})}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    .lienzo{width:${W}px;height:${H}px;background:url(${fondoUri}) center/100% 100% no-repeat;
      font-family:G,serif;color:#004f4f;display:flex;align-items:center;justify-content:center;gap:90px}
    .mandala{width:330px;height:330px;flex:none}
    .nombre{font-weight:700;line-height:1.1;letter-spacing:.22em;text-transform:uppercase}
    .maria{font-size:120px}
    .escribano{font-size:120px;margin-top:6px}
  </style></head><body><div class="lienzo">
    <img class="mandala" src="${mandalaUri}">
    <div class="nombre"><div class="maria">María</div><div class="escribano">Escribano</div></div>
  </div></body></html>`;
  const archivo = path.join(TMP, "marca.html");
  fs.writeFileSync(archivo, pagina, "utf8");
  const png = path.join(SALIDA, "marca-marmol.png");
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${W},${H}`, `--screenshot=${png}`, url.pathToFileURL(archivo).href,
  ], { stdio: "ignore" });
  console.log("→", png);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
