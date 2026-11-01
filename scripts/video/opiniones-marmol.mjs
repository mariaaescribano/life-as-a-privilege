#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// OPINIONES PARA INSTAGRAM (9:16, 1080x1920, para stories) · MÁRMOL
//
// Una imagen por cada experiencia real: el mármol de la web de fondo, el mandala turquesa
// arriba y, debajo, el comentario con el nombre de quien lo escribió.
//
// Uso:
//   node scripts/video/opiniones-marmol.mjs                 → las tres últimas opiniones
//   node scripts/video/opiniones-marmol.mjs --n 5           → las cinco últimas
//   node scripts/video/opiniones-marmol.mjs --api http://localhost:3000
//
// Sale a marca/opiniones/. Requiere Chrome (para pintar la letra) y el backend encendido.
// La letra es la EB Garamond de ebGaramondData.ts (la misma de los PDF).
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
const SALIDA = path.join(RAIZ, "marca", "opiniones");
const TMP = path.join(os.tmpdir(), "laap-opiniones-marmol");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

const args = process.argv.slice(2);
const flag = (n, def) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] ?? true : def; };
const N = Number(flag("n", 3));
const API = flag("api", "http://localhost:3000");

const W = 1080, H = 1920;
const TINTA = { r: 0, g: 79, b: 79 };   // #004f4f

const dataUri = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function fuente(nombre) {
  const src = fs.readFileSync(FUENTE_TS, "utf8");
  const m = src.match(new RegExp(`${nombre}\\s*=\\s*[\`"']([A-Za-z0-9+/=\\s]+)[\`"']`));
  if (!m) throw new Error(`no encuentro ${nombre}`);
  return Buffer.from(m[1].replace(/\s/g, ""), "base64");
}

/** Mármol de la web girado 90° y recortado a 9:16, a toda su altura (las manchas turquesas quedan en esquinas opuestas). */
async function fondo() {
  const rot = await sharp(MARMOL).rotate(90).png().toBuffer();
  const meta = await sharp(rot).metadata();
  const ancho = Math.round(meta.height * W / H);
  return sharp(rot).extract({ left: Math.round((meta.width - ancho) / 2), top: 0, width: ancho, height: meta.height })
    .resize(W, H, { fit: "fill" }).jpeg({ quality: 92 }).toBuffer();
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

  const res = await fetch(`${API}/opinion`);
  if (!res.ok) throw new Error(`el backend respondió ${res.status} (¿está encendido en ${API}?)`);
  const todas = await res.json();
  const opiniones = todas.slice(0, N);

  const fondoUri = dataUri(await fondo(), "image/jpeg");
  const mandalaUri = dataUri(await mandala(), "image/png");
  const cursiva = dataUri(fuente("GARAMOND_ITALIC"), "font/ttf");
  const negrita = dataUri(fuente("GARAMOND_BOLD"), "font/ttf");

  const css = `
    @font-face{font-family:G;font-style:italic;font-weight:400;src:url(${cursiva})}
    @font-face{font-family:G;font-style:normal;font-weight:700;src:url(${negrita})}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    .lienzo{position:relative;width:${W}px;height:${H}px;background:url(${fondoUri}) center/100% 100% no-repeat;
      font-family:G,serif;color:#004f4f;display:flex;flex-direction:column;align-items:center;padding:230px 80px 250px}
    .mandala{width:200px;height:200px;flex:none}
    .centro{flex:1;display:flex;align-items:center;width:100%}
    .marco{width:100%;border:2px solid #004f4f;border-radius:34px;background:rgba(255,255,255,0.14);
      padding:70px 64px 60px;text-align:center;box-shadow:0 0 30px #b08d3f33}
    .cita{font-style:italic;line-height:1.5}
    .cita p+p{margin-top:.7em}
    .raya{width:110px;height:2px;margin:46px auto 38px;background:linear-gradient(to right,#004f4f00,#004f4fcc,#004f4f00)}
    .nombre{font-weight:700;font-size:42px;letter-spacing:.14em;text-transform:uppercase}
  `;

  for (let i = 0; i < opiniones.length; i++) {
    const op = opiniones[i];
    const n = op.texto.length;
    const tam = n > 520 ? 38 : n > 420 ? 40 : n > 330 ? 43 : 46;
    const parrafos = op.texto.trim().split(/\n+/).map((p) => `<p>${esc(p.trim())}</p>`).join("");
    const pagina = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
      <div class="lienzo">
        <img class="mandala" src="${mandalaUri}">
        <div class="centro"><div class="marco">
          <div class="cita" style="font-size:${tam}px">${parrafos}</div>
          <div class="raya"></div>
          <div class="nombre">${esc(op.nombre)}</div>
        </div></div>
      </div></body></html>`;
    const archivo = path.join(TMP, `op${i + 1}.html`);
    fs.writeFileSync(archivo, pagina, "utf8");
    const nombre = op.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
    const png = path.join(SALIDA, `opinion-${i + 1}-${nombre}.png`);
    execFileSync(CHROME, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      `--window-size=${W},${H}`, `--screenshot=${png}`, url.pathToFileURL(archivo).href,
    ], { stdio: "ignore" });
    console.log("→", png);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
