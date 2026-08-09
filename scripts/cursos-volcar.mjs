/**
 * Vuelca la tabla `curso` de Supabase a ficheros JSON del repo:
 *   frontend/src/i18n/cursos/es/<modalidad>-<titulo>.json   (copia en español)
 *   frontend/src/i18n/cursos/es/_indice.md                  (índice legible)
 *
 * La copia en español es SOLO respaldo: la app sigue leyendo el español del
 * API. El inglés (carpeta hermana `en/`) sí lo lee la app.
 *
 *   node scripts/cursos-volcar.mjs
 *
 * Lee SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de backend/.env.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.join(RAIZ, "frontend", "src", "i18n", "cursos", "es");

function env(clave) {
  const texto = fs.readFileSync(path.join(RAIZ, "backend", ".env"), "utf8");
  const m = texto.match(new RegExp(`^${clave}=(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
}

/** «El Árbol de la Vida» → «el-arbol-de-la-vida» (y sin hanzi ni diacríticos). */
export function slug(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "sin-titulo";
}

export const nombreFichero = (fila) => `${slug(fila.modalidad)}-${slug(fila.titulo)}.json`;

async function main() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en backend/.env");

  const res = await fetch(`${url}/rest/v1/curso?select=*&order=modalidad,orden`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const filas = await res.json();

  fs.mkdirSync(DESTINO, { recursive: true });
  // Empezamos de cero para que un curso borrado en la BD no quede de zombi.
  for (const f of fs.readdirSync(DESTINO)) {
    if (f.endsWith(".json") || f === "_indice.md") fs.unlinkSync(path.join(DESTINO, f));
  }

  const indice = [];
  for (const fila of filas) {
    const fichero = nombreFichero(fila);
    const curso = {
      id: fila.id,
      modalidad: fila.modalidad,
      titulo: fila.titulo,
      descripcion: fila.descripcion,
      descripcion_contenido: fila.descripcion_contenido ?? "",
      contenido: fila.contenido ?? [],
    };
    fs.writeFileSync(path.join(DESTINO, fichero), JSON.stringify(curso, null, 2) + "\n", "utf8");
    const lecciones = (curso.contenido ?? []).reduce((a, m) => a + (m.submodules ?? []).length, 0);
    indice.push({ fichero, ...fila, lecciones });
  }

  const md = [
    "# Cursos en español (copia de la BD)",
    "",
    "Generado con `node scripts/cursos-volcar.mjs`. La fuente de verdad sigue",
    "siendo la tabla `curso` de Supabase; esto es el respaldo legible.",
    "",
    "| Disciplina | Curso | Lecciones | Fichero | id |",
    "| --- | --- | --- | --- | --- |",
    ...indice.map((c) => `| ${c.modalidad} | ${c.titulo} | ${c.lecciones} | \`${c.fichero}\` | \`${c.id}\` |`),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(DESTINO, "_indice.md"), md, "utf8");

  console.log(`${filas.length} cursos volcados en ${path.relative(RAIZ, DESTINO)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
