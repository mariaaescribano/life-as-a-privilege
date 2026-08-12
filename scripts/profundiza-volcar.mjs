// ─────────────────────────────────────────────────────────────────────────────
//  VOLCAR A MARKDOWN LOS TEXTOS DE «PROFUNDIZA» (Fisiología)
//
//  Saca a un .md editable el contenido de dos temas —Músculos y El cerebro— tal
//  como está AHORA en ProfundizaFisiologia.ts: el bloque del tema (etiqueta,
//  resumen, intro, cierre), las zonas del cerebro y, ficha a ficha, su nombre,
//  su antetítulo, sus claves y sus párrafos.
//
//    node scripts/profundiza-volcar.mjs
//    → FISIOLOGIA-profundiza-musculos-cerebro.md (en la raíz del repo)
//
//  El .md se reescribe entero: si ya lo estabas editando, haz copia antes.
//  Los textos editados vuelven al código a mano (cada ficha lleva su `key`
//  entre comillas simples, que es lo que las empareja).
//
//  Para añadir otro tema, mételo en TEMAS (la clave del tema y el nombre de la
//  constante de fichas); el resto no cambia.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(RAIZ, "frontend/src/hardCoded/espacio/ProfundizaFisiologia.ts");
const OUT = path.join(RAIZ, "FISIOLOGIA-profundiza-musculos-cerebro.md");

const src = fs.readFileSync(SRC, "utf8");

/** El literal de array de `const NOMBRE… = [` hasta su `]` (contando corchetes). */
function bloque(nombre) {
  const i = src.indexOf(`const ${nombre}`);
  if (i < 0) throw new Error("no está " + nombre);
  const ini = src.indexOf("[", src.indexOf("= [", i));
  let nivel = 0;
  for (let j = ini; j < src.length; j++) {
    if (src[j] === "[") nivel++;
    else if (src[j] === "]" && --nivel === 0) return src.slice(ini, j + 1);
  }
  throw new Error("sin cerrar " + nombre);
}

// Las fichas llaman a estos ayudantes para las rutas de las fotos; aquí solo
// hace falta que no revienten al evaluar el literal.
const SUB = (t, k) => `${t}/${k}`;
const NT = (k) => `nt/${k}`;
void SUB; void NT;
const evalArr = (txt) => eval(`(${txt})`);

// El bloque del TEMA (etiqueta, resumen, intro, cierre). Ojo: `key: "musculo"`
// también existe DENTRO de las fichas, así que se busca solo en TEMAS_PROFUNDIZA.
const TEMAS_TXT = src.slice(src.indexOf("export const TEMAS_PROFUNDIZA"));
function datosTema(key) {
  const m = TEMAS_TXT.match(new RegExp(`key: "${key}",[\\s\\S]*?\\n  \\},`, "m"));
  if (!m) throw new Error("no está el tema " + key);
  const campo = (n) => {
    const mm = m[0].match(new RegExp(`${n}: "((?:[^"\\\\]|\\\\.)*)"`));
    return mm ? mm[1].replace(/\\"/g, '"') : "";
  };
  return { label: campo("label"), resumen: campo("resumen"), intro: campo("intro"), cierre: campo("cierre") };
}

const L = [];
const linea = (s = "") => L.push(s);

linea("# Profundiza · Fisiología — Músculos y Cerebro");
linea();
linea("> Texto tal como está AHORA en la web. Reescribe encima: puedes borrar frases o");
linea("> párrafos, añadir los que quieras, cambiar las claves o dejar un campo vacío.");
linea("> Cada párrafo va separado por una línea en blanco (así se pintan en el visor).");
linea(">");
linea("> **No toques** las líneas con `comillas simples` (son la clave interna de cada");
linea("> ficha: por ahí se vuelven a meter los textos en el código) ni los títulos que");
linea("> empiezan por `#`. Todo lo demás es tuyo.");
linea();

function ficha(f, i) {
  linea(`## ${i} · ${f.nombre}`);
  linea();
  linea("`" + f.key + "`");
  linea();
  linea("**Nombre:** " + f.nombre);
  linea();
  linea("**Antetítulo:** " + (f.eyebrow ?? ""));
  linea();
  linea("**Claves:**");
  linea();
  for (const c of f.claves ?? []) linea("- " + c);
  linea();
  linea("**Cuerpo:**");
  linea();
  for (const p of f.explicacion ?? []) { linea(p); linea(); }
  linea("---");
  linea();
}

function cabeceraTema(titulo, key) {
  const t = datosTema(key);
  linea(`# TEMA · ${titulo}`);
  linea();
  linea("`tema: " + key + "`");
  linea();
  linea("**Etiqueta (tarjeta del hub):** " + t.label);
  linea();
  linea("**Resumen (tarjeta del hub):** " + t.resumen);
  linea();
  linea("**Intro (frase bajo el header):** " + t.intro);
  linea();
  linea("**Cierre (al leerlo todo):** " + t.cierre);
  linea();
  linea("---");
  linea();
}

// ── Músculos: una lista corrida, de fuera hacia dentro ──
cabeceraTema("Músculos", "musculo");
evalArr(bloque("MUSCULO: Ficha[]")).forEach((f, i) => ficha(f, i + 1));

// ── El cerebro: por zonas (corteza → centro → base) ──
cabeceraTema("El cerebro", "cerebro");
const CEREBRO = evalArr(bloque("CEREBRO: Ficha[]"));
const ZONAS = evalArr(bloque("ZONAS_CEREBRO ="));

linea("## Las tres zonas");
linea();
linea("El cerebro se recorre por zonas, de fuera hacia dentro. Cada una con su título y su entradilla:");
linea();
for (const z of ZONAS) {
  linea("`zona: " + z.zona + "`");
  linea();
  linea("**Título:** " + z.titulo);
  linea();
  linea("**Entradilla:** " + z.entradilla);
  linea();
}
linea("---");
linea();

let n = 0;
for (const z of ZONAS) {
  linea(`# ZONA · ${z.titulo}`);
  linea();
  for (const f of CEREBRO.filter((x) => x.zona === z.zona)) ficha(f, ++n);
}

fs.writeFileSync(OUT, L.join("\n"), "utf8");
console.log(`escrito ${path.relative(RAIZ, OUT)} · ${n} fichas de cerebro`);
