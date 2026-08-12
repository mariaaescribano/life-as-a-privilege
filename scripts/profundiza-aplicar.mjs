// ─────────────────────────────────────────────────────────────────────────────
//  METER EN EL CÓDIGO LOS TEXTOS EDITADOS DE «PROFUNDIZA» (Fisiología)
//
//  Lee FISIOLOGIA-profundiza-musculos-cerebro.md y reescribe, ficha a ficha, el
//  `nombre`, el `eyebrow` (antetítulo), las `claves` y la `explicacion` de los
//  temas Músculos y El cerebro dentro de ProfundizaFisiologia.ts.
//
//    node scripts/profundiza-aplicar.mjs          → escribe
//    node scripts/profundiza-aplicar.mjs --ver    → solo dice qué cambiaría
//
//  Es la vuelta de scripts/profundiza-volcar.mjs. Las fichas se emparejan por su
//  `key` (la línea del .md entre comillas simples): el color, la foto, la zona y
//  el ORDEN no se tocan nunca, viven solo en el .ts.
//
//  Si una ficha aparece repetida en el .md —pasa al pegar la versión nueva
//  debajo de la vieja— gana SIEMPRE la última, que es la reescrita. Lo mismo si
//  dentro de una ficha hay dos «**Cuerpo:**»: se queda con el de más abajo.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TS = path.join(RAIZ, "frontend/src/hardCoded/espacio/ProfundizaFisiologia.ts");
const MD = path.join(RAIZ, "FISIOLOGIA-profundiza-musculos-cerebro.md");
const soloVer = process.argv.includes("--ver");

// ── 1 · Leer el .md ─────────────────────────────────────────────────────────
// Se recorre línea a línea. Una línea que es solo `clave` abre una ficha; a
// partir de ahí, cada campo que aparezca se guarda pisando al anterior (por eso
// gana el de más abajo).
function leerMd(texto) {
  const fichas = new Map();
  let actual = null;
  let modo = null; // "claves" | "cuerpo" | null

  const campo = (linea, etiqueta) => {
    // «**Nombre:** …» y también «**Etiqueta (tarjeta del hub):** …».
    const m = linea.match(new RegExp(`^\\*\\*${etiqueta}[^:*]*:\\*\\*\\s?(.*)$`));
    return m ? m[1].trim() : null;
  };

  for (const cruda of texto.replace(/\r\n/g, "\n").split("\n")) {
    const linea = cruda.trim();

    // Una clave suelta entre comillas simples abre ficha (o zona/tema, que aquí
    // no se tocan: se ignoran).
    const clave = linea.match(/^`([^`]+)`$/);
    if (clave) {
      const k = clave[1];
      actual = /^(tema|zona):/.test(k)
        ? null
        : fichas.get(k) ?? { key: k, nombre: "", eyebrow: "", claves: [], cuerpo: [] };
      if (actual) fichas.set(k, actual);
      modo = null;
      continue;
    }
    if (!actual) continue;

    // Los títulos y el separador cierran el campo que estuviera abierto.
    if (linea.startsWith("#") || linea === "---") { modo = null; continue; }

    const nombre = campo(linea, "Nombre");
    if (nombre !== null) { actual.nombre = nombre; modo = null; continue; }
    const eyebrow = campo(linea, "Antetítulo");
    if (eyebrow !== null) { actual.eyebrow = eyebrow; modo = null; continue; }
    if (/^\*\*Claves:?[^:*]*:?\*\*/.test(linea)) { actual.claves = []; modo = "claves"; continue; }
    if (/^\*\*Cuerpo:?[^:*]*:?\*\*/.test(linea)) { actual.cuerpo = []; modo = "cuerpo"; continue; }

    if (modo === "claves") {
      const item = linea.match(/^[-*+]\s+(.*)$/);
      if (item) actual.claves.push(item[1].trim());
      continue;
    }
    if (modo === "cuerpo" && linea) actual.cuerpo.push(linea);
  }
  return fichas;
}

// ── 2 · Reescribir el .ts ───────────────────────────────────────────────────
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

/** Trozo de texto del array `const NOMBRE… = [ … ]`, con sus límites. */
function bloque(src, nombre) {
  const i = src.indexOf(`const ${nombre}`);
  if (i < 0) throw new Error("no está " + nombre);
  const ini = src.indexOf("[", src.indexOf("= [", i));
  let nivel = 0;
  for (let j = ini; j < src.length; j++) {
    if (src[j] === "[") nivel++;
    else if (src[j] === "]" && --nivel === 0) return { ini, fin: j + 1, txt: src.slice(ini, j + 1) };
  }
  throw new Error("sin cerrar " + nombre);
}

/** Parte el literal en los trozos de texto de cada `{ … }` de primer nivel. */
function objetos(txt) {
  const trozos = [];
  let nivel = 0, ini = -1, cadena = null;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (cadena) {
      if (c === "\\") i++;
      else if (c === cadena) cadena = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { cadena = c; continue; }
    if (c === "{") { if (nivel === 0) ini = i; nivel++; }
    else if (c === "}") { nivel--; if (nivel === 0) trozos.push([ini, i + 1]); }
  }
  return trozos;
}

/** Devuelve el trozo del objeto con nombre/eyebrow/claves/explicacion nuevos. */
function reescribir(obj, f, cambios) {
  const sangria = "    ";
  let out = obj;
  const anota = (campo) => cambios.push(`${f.key} · ${campo}`);

  // nombre — va en la primera línea, junto a key/color/foto.
  const nomActual = out.match(/nombre: "((?:[^"\\]|\\.)*)"/);
  if (nomActual && nomActual[1] !== esc(f.nombre)) {
    out = out.replace(/nombre: "(?:[^"\\]|\\.)*"/, `nombre: "${esc(f.nombre)}"`);
    anota("nombre");
  }

  // eyebrow — puede no existir (las fichas del cerebro no lo tenían).
  const eyeActual = out.match(/\n\s*eyebrow: "((?:[^"\\]|\\.)*)",/);
  const eyeNuevo = f.eyebrow.trim();
  if (eyeActual && !eyeNuevo) {
    out = out.replace(/\n\s*eyebrow: "(?:[^"\\]|\\.)*",/, "");
    anota("antetítulo (fuera)");
  } else if (eyeActual && eyeActual[1] !== esc(eyeNuevo)) {
    out = out.replace(/eyebrow: "(?:[^"\\]|\\.)*"/, `eyebrow: "${esc(eyeNuevo)}"`);
    anota("antetítulo");
  } else if (!eyeActual && eyeNuevo) {
    // Se cuela justo detrás de la línea de cabecera (la del `key:`).
    out = out.replace(/(\n)(\s*)(claves:|explicacion:)/, `\n${sangria}eyebrow: "${esc(eyeNuevo)}",$1$2$3`);
    anota("antetítulo (nuevo)");
  }

  // claves — array de una línea.
  const clavesNuevas = `claves: [${f.claves.map((c) => `"${esc(c)}"`).join(", ")}],`;
  const clavesRe = /claves: \[[\s\S]*?\],/;
  if (clavesRe.test(out) && out.match(clavesRe)[0] !== clavesNuevas) {
    out = out.replace(clavesRe, clavesNuevas);
    anota("claves");
  }

  // explicacion — un párrafo por línea.
  const cuerpoNuevo =
    "explicacion: [\n" +
    f.cuerpo.map((p) => `${sangria}  "${esc(p)}",`).join("\n") +
    `\n${sangria}],`;
  const cuerpoRe = /explicacion: \[[\s\S]*?\n\s*\],/;
  if (cuerpoRe.test(out) && out.match(cuerpoRe)[0] !== cuerpoNuevo) {
    out = out.replace(cuerpoRe, cuerpoNuevo);
    anota("cuerpo");
  }
  return out;
}

// ── 3 · Adelante ────────────────────────────────────────────────────────────
const fichasMd = leerMd(fs.readFileSync(MD, "utf8"));
let src = fs.readFileSync(TS, "utf8");
const cambios = [];
const vistas = new Set();

// De atrás hacia delante, para que los índices de los bloques no se muevan.
for (const nombre of ["CEREBRO: Ficha[]", "MUSCULO: Ficha[]"]) {
  const b = bloque(src, nombre);
  let txt = b.txt;
  for (const [ini, fin] of objetos(txt).reverse()) {
    const obj = txt.slice(ini, fin);
    const key = obj.match(/key: "([^"]+)"/)?.[1];
    const f = key && fichasMd.get(key);
    if (!f) { if (key) console.log("··  sin texto en el .md:", key); continue; }
    vistas.add(key);
    txt = txt.slice(0, ini) + reescribir(obj, f, cambios) + txt.slice(fin);
  }
  src = src.slice(0, b.ini) + txt + src.slice(b.fin);
}

for (const k of fichasMd.keys()) {
  if (!vistas.has(k)) console.log("!!  el .md trae una ficha que no existe en el .ts:", k);
}

if (!cambios.length) {
  console.log("nada que cambiar");
} else if (soloVer) {
  console.log(cambios.length + " cambios:\n" + cambios.join("\n"));
} else {
  fs.writeFileSync(TS, src, "utf8");
  console.log(cambios.length + " cambios escritos:\n" + cambios.join("\n"));
}
