/**
 * Regenera `CULTURA-fotos-que-faltan.md`: la lista de TODAS las ilustraciones que
 * el recorrido de Cultura espera y todavía no están en `frontend/public`.
 *
 * Lee los datos de verdad (`frontend/src/components/metodo/culturaHistoria*.ts`
 * y `culturaPortadas.ts`), calcula la ruta de cada foto (portada de la Historia,
 * portada de era y foto de cada momento) y comprueba si el archivo existe. Así la
 * lista no se desactualiza: en cuanto se añade un momento nuevo o se sube una
 * foto, basta con volver a lanzarlo.
 *
 *   node scripts/cultura-fotos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRONT = path.join(RAIZ, "frontend");
const SRC = path.join(FRONT, "src", "components", "metodo");
const PUB = path.join(FRONT, "public");
const SALIDA = path.join(RAIZ, "CULTURA-fotos-que-faltan.md");

// esbuild vive en frontend/node_modules: se resuelve desde allí para poder lanzar
// el script desde la raíz del repo.
const requerir = createRequire(path.join(FRONT, "package.json"));
const esbuild = requerir("esbuild");

const unix = (p) => p.replace(/\\/g, "/");

// Los datos son TypeScript: se compilan a un módulo suelto y se evalúan. Es la
// única forma de leer las rutas exactas (hay alias y helpers por medio) sin
// duplicar aquí la lógica de cada Historia.
const entrada = `
export { HISTORIAS_CULTURA } from "${unix(SRC)}/culturaHistorias.ts";
export { CULTURA_HISTORIA_VISUAL } from "${unix(SRC)}/culturaPortadas.ts";
`;
const compilado = await esbuild.build({
  stdin: { contents: entrada, resolveDir: SRC, loader: "ts" },
  bundle: true,
  format: "esm",
  write: false,
  platform: "node",
});
const temporal = path.join(fs.mkdtempSync(path.join(RAIZ, ".cultura-fotos-")), "datos.mjs");
fs.writeFileSync(temporal, compilado.outputFiles[0].text);
const { HISTORIAS_CULTURA, CULTURA_HISTORIA_VISUAL } = await import("file://" + unix(temporal));
fs.rmSync(path.dirname(temporal), { recursive: true, force: true });

const existe = (ruta) => fs.existsSync(path.join(PUB, ruta));
const archivo = (ruta) => ruta.split("/").pop();
const carpeta = (ruta) => ruta.slice(0, ruta.lastIndexOf("/"));

const lineas = [
  "# Fotos que faltan — recorrido de Cultura",
  "",
  "Generado con `node scripts/cultura-fotos.mjs`: lee los datos del recorrido",
  "(`culturaHistoria*.ts`) y los compara con lo que ya hay en",
  "`frontend/public/recorrido/cultura/`.",
  "",
  "Cada línea es: **nombre exacto del archivo** — título del momento (para pedir la",
  "ilustración y guardarla con ese nombre sin pensar).",
  "Formato: `.webp`, cuadradas (se recortan en círculo y se pintan también en el cómic).",
  "",
];

let faltanTotal = 0;
let todasTotal = 0;
const resumen = [];

for (const [clave, historia] of Object.entries(HISTORIAS_CULTURA)) {
  const bloques = [];
  let faltan = 0;
  let todas = 0;

  const visual = CULTURA_HISTORIA_VISUAL[clave];
  if (visual?.portada) {
    todas++;
    if (!existe(visual.portada)) {
      faltan++;
      bloques.push({
        titulo: "Portada de la Historia",
        carpeta: carpeta(visual.portada),
        filas: [[archivo(visual.portada), historia.titulo]],
      });
    }
  }

  const eras = historia.hitos.filter((era) => era.foto);
  const erasSinFoto = eras.filter((era) => !existe(era.foto));
  todas += eras.length;
  faltan += erasSinFoto.length;
  if (erasSinFoto.length) {
    bloques.push({
      titulo: "Portadas de las eras (círculos de la línea del tiempo)",
      carpeta: carpeta(erasSinFoto[0].foto),
      filas: erasSinFoto.map((era) => [archivo(era.foto), `${era.titulo} (${era.anio})`]),
    });
  }

  for (const era of historia.hitos) {
    const conFoto = era.subhitos.filter((sub) => sub.foto);
    const sinArchivo = conFoto.filter((sub) => !existe(sub.foto));
    todas += conFoto.length;
    faltan += sinArchivo.length;
    if (sinArchivo.length) {
      bloques.push({
        titulo: `${era.titulo} — ${era.anio}`,
        carpeta: carpeta(sinArchivo[0].foto),
        filas: sinArchivo.map((sub) => [archivo(sub.foto), sub.titulo]),
      });
    }
  }

  faltanTotal += faltan;
  todasTotal += todas;
  resumen.push([historia.titulo, faltan, todas]);

  if (!faltan) continue;
  lineas.push(`## ${historia.titulo} — faltan ${faltan} de ${todas}`, "");
  for (const bloque of bloques) {
    lineas.push(`### ${bloque.titulo}`, "");
    lineas.push(`Carpeta: \`frontend/public${bloque.carpeta}/\``, "");
    for (const [nombre, titulo] of bloque.filas) lineas.push(`- \`${nombre}\` — ${titulo}`);
    lineas.push("");
  }
}

lineas.splice(10, 0,
  "## Resumen",
  "",
  "| Historia | Faltan | Total |",
  "| --- | --- | --- |",
  ...resumen.map(([titulo, faltan, todas]) => `| ${titulo} | ${faltan} | ${todas} |`),
  `| **TOTAL** | **${faltanTotal}** | **${todasTotal}** |`,
  "",
);

fs.writeFileSync(SALIDA, lineas.join("\n") + "\n", "utf8");
console.log(`Faltan ${faltanTotal} fotos de ${todasTotal}.`);
for (const [titulo, faltan, todas] of resumen) console.log(`  ${titulo}: ${faltan} de ${todas}`);
console.log(`\nEscrito: ${path.relative(RAIZ, SALIDA)}`);
