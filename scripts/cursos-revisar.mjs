/**
 * Compara cada curso traducido de `en/` con su original de `es/` y avisa de lo
 * que no cuadra: ids cambiados, módulos o lecciones que faltan o sobran,
 * respuestas correctas movidas, textos que se quedaron en español.
 *
 * También imprime cuánto queda por traducir.
 *
 *   node scripts/cursos-revisar.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CURSOS = path.join(RAIZ, "frontend", "src", "i18n", "cursos");
const ES = path.join(CURSOS, "es");
const EN = path.join(CURSOS, "en");

const leer = (dir, f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const lecciones = (curso) => (curso.contenido ?? []).flatMap((m) => m.submodules ?? []);
const tamano = (curso) => JSON.stringify(curso.contenido ?? []).length;

const ficherosEs = fs.readdirSync(ES).filter((f) => f.endsWith(".json")).sort();
const traducidos = new Set(
  fs.existsSync(EN) ? fs.readdirSync(EN).filter((f) => f.endsWith(".json")) : [],
);

const errores = [];
let hechos = 0, charsHechos = 0, charsTotal = 0;
const pendientes = [];

for (const fichero of ficherosEs) {
  const es = leer(ES, fichero);
  charsTotal += tamano(es);

  if (!traducidos.has(fichero)) {
    pendientes.push({ fichero, modalidad: es.modalidad, titulo: es.titulo, chars: tamano(es) });
    continue;
  }
  hechos++;
  charsHechos += tamano(es);

  const en = leer(EN, fichero);
  const falla = (msg) => errores.push(`${fichero}: ${msg}`);

  if (en.id !== es.id) falla(`el id no coincide con el de la BD (${en.id} ≠ ${es.id})`);
  if ((en.contenido ?? []).length !== (es.contenido ?? []).length) {
    falla(`tiene ${(en.contenido ?? []).length} módulos y el original tiene ${(es.contenido ?? []).length}`);
  }

  const lecEs = lecciones(es);
  const lecEn = lecciones(en);
  const porId = new Map(lecEn.map((l) => [l.id, l]));
  if (lecEn.length !== lecEs.length) falla(`tiene ${lecEn.length} lecciones y el original tiene ${lecEs.length}`);

  for (const l of lecEs) {
    const t = porId.get(l.id);
    if (!t) { falla(`falta la lección «${l.id}» (${l.nom})`); continue; }
    if (!t.nom?.trim()) falla(`la lección «${l.id}» se quedó sin título`);
    if (l.tipo === "texto" && !t.contenido?.trim() && l.contenido?.trim()) {
      falla(`la lección «${l.id}» (${l.nom}) se quedó sin texto`);
    }
    const ejEs = l.ejercicios ?? [], ejEn = t.ejercicios ?? [];
    if (ejEs.length !== ejEn.length) {
      falla(`la lección «${l.id}» tiene ${ejEn.length} ejercicios y el original ${ejEs.length}`);
      continue;
    }
    ejEs.forEach((e, i) => {
      const o = ejEn[i];
      if (e.tipo !== o.tipo) falla(`ejercicio ${i + 1} de «${l.id}»: tipo ${o.tipo} ≠ ${e.tipo}`);
      if (e.correcta !== o.correcta) falla(`ejercicio ${i + 1} de «${l.id}»: la respuesta correcta cambió (${o.correcta} ≠ ${e.correcta})`);
      if ((e.opciones ?? []).length !== (o.opciones ?? []).length) falla(`ejercicio ${i + 1} de «${l.id}»: distinto número de opciones`);
      if ((e.pares ?? []).length !== (o.pares ?? []).length) falla(`ejercicio ${i + 1} de «${l.id}»: distinto número de parejas`);
    });
  }
  for (const l of lecEn) {
    if (!lecEs.some((x) => x.id === l.id)) falla(`sobra la lección «${l.id}» (no está en el original)`);
  }
}

const sobran = [...traducidos].filter((f) => !ficherosEs.includes(f));
for (const f of sobran) errores.push(`${f}: no existe en es/ — ¿se borró el curso de la BD?`);

const pct = charsTotal ? Math.round((charsHechos / charsTotal) * 100) : 0;
console.log(`Traducidos ${hechos}/${ficherosEs.length} cursos — ${pct}% del contenido (${charsHechos.toLocaleString("es-ES")} de ${charsTotal.toLocaleString("es-ES")} caracteres)`);

if (pendientes.length) {
  console.log("\nPendientes:");
  const porDisciplina = {};
  for (const p of pendientes) (porDisciplina[p.modalidad] ??= []).push(p);
  for (const [disc, lista] of Object.entries(porDisciplina)) {
    const chars = lista.reduce((a, p) => a + p.chars, 0);
    console.log(`  ${disc} — ${lista.length} curso(s), ${chars.toLocaleString("es-ES")} caracteres`);
    for (const p of lista) console.log(`     · ${p.titulo} (${p.chars.toLocaleString("es-ES")})`);
  }
}

if (errores.length) {
  console.log(`\n${errores.length} problema(s):`);
  for (const e of errores) console.log(`  ✗ ${e}`);
  process.exit(1);
}
console.log("\nSin problemas de estructura.");
