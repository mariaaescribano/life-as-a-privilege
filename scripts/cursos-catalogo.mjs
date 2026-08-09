/**
 * Regenera `frontend/src/i18n/cursos/catalogo-en.json` a partir de los cursos
 * traducidos que haya en `frontend/src/i18n/cursos/en/`.
 *
 * El catálogo es el índice ligero que carga la app cuando el idioma es inglés:
 * títulos de curso, de módulo y de lección. El cuerpo de las lecciones se queda
 * en los ficheros de `en/` y solo se descarga al abrir una lección.
 *
 *   node scripts/cursos-catalogo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CURSOS = path.join(RAIZ, "frontend", "src", "i18n", "cursos");
const EN = path.join(CURSOS, "en");
const SALIDA = path.join(CURSOS, "catalogo-en.json");

fs.mkdirSync(EN, { recursive: true });

const ficheros = fs.readdirSync(EN).filter((f) => f.endsWith(".json")).sort();
const catalogo = {};
const avisos = [];

for (const fichero of ficheros) {
  let curso;
  try {
    curso = JSON.parse(fs.readFileSync(path.join(EN, fichero), "utf8"));
  } catch (e) {
    avisos.push(`${fichero}: JSON inválido — ${e.message}`);
    continue;
  }
  if (!curso.id) {
    avisos.push(`${fichero}: le falta el campo "id" (el uuid del curso en la BD)`);
    continue;
  }

  const lecciones = {};
  const modulos = [];
  for (const modulo of curso.contenido ?? []) {
    modulos.push(modulo.title ?? "");
    for (const leccion of modulo.submodules ?? []) {
      if (leccion.id) lecciones[leccion.id] = leccion.nom ?? "";
    }
  }

  catalogo[curso.id] = {
    fichero,
    titulo: curso.titulo ?? "",
    descripcion: curso.descripcion ?? "",
    descripcionContenido: curso.descripcion_contenido ?? "",
    modulos,
    lecciones,
  };
}

fs.writeFileSync(SALIDA, JSON.stringify(catalogo, null, 2) + "\n", "utf8");

const numLecciones = Object.values(catalogo).reduce((a, c) => a + Object.keys(c.lecciones).length, 0);
console.log(`catalogo-en.json: ${Object.keys(catalogo).length} cursos, ${numLecciones} lecciones`);
for (const aviso of avisos) console.warn(`  aviso — ${aviso}`);
