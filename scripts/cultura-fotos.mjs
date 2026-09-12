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

// ── Portadas todavía sin declarar ────────────────────────────────────────────
// Una Historia sin `portada` en `culturaPortadas.ts` sale con su emoji, y eso la
// dejaba FUERA de esta lista: su portada no estaba pedida, así que no podía
// faltar. Pero sí falta —solo que aún no se ha escrito la línea—, y por eso se
// quedaron sin pedir las de Medicina y Arte.
//
// Ahora, cuando no hay portada declarada, se espera `historia<clave>.webp` en la
// misma carpeta que las demás. Si prefieres otro nombre, decláralo en
// `culturaPortadas.ts` y manda ese: lo declarado siempre gana.
const CARPETA_PORTADAS =
  Object.values(CULTURA_HISTORIA_VISUAL).map((v) => v.portada).filter(Boolean).map(carpeta)[0] ??
  "/recorrido/cultura/portadas";

/** Ruta de la portada de una Historia: la declarada, o la que se espera. */
const portadaDe = (clave) => {
  const declarada = CULTURA_HISTORIA_VISUAL[clave]?.portada;
  if (declarada) return { ruta: declarada, declarada: true };
  return { ruta: `${CARPETA_PORTADAS}/historia${clave}.webp`, declarada: false };
};

/** Portadas que ya están en disco pero que nadie ha declarado: no se ven. */
const sinDeclarar = [];

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

  const portada = portadaDe(clave);
  todas++;
  if (!existe(portada.ruta)) {
    faltan++;
    bloques.push({
      titulo: "Portada de la Historia",
      carpeta: carpeta(portada.ruta),
      filas: [[
        archivo(portada.ruta),
        portada.declarada
          ? historia.titulo
          : `${historia.titulo} — y después añade su \`portada\` en culturaPortadas.ts`,
      ]],
    });
  } else if (!portada.declarada) {
    // El archivo está, pero sin la línea en `culturaPortadas.ts` la Historia
    // sigue saliendo con su emoji: la foto no se ve en ningún sitio.
    sinDeclarar.push([clave, portada.ruta]);
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
    // Cada momento pide su foto y, además, la de cada página «Profundiza» que
    // tenga ilustración propia (viñetas de la 2ª en adelante con `src` distinto
    // al del momento). Se recogen por ruta única: si dos comparten foto a
    // propósito, cuenta una sola vez y no se pide dos veces.
    const pedidas = new Map(); // ruta → título con el que pedir la ilustración
    for (const sub of era.subhitos) {
      if (sub.foto && !pedidas.has(sub.foto)) pedidas.set(sub.foto, sub.titulo);
      for (const vin of sub.vinetas ?? []) {
        if (!vin.src || vin.src === sub.foto || pedidas.has(vin.src)) continue;
        pedidas.set(vin.src, `${sub.titulo} → ${vin.titulo}`);
      }
    }
    const sinArchivo = [...pedidas].filter(([ruta]) => !existe(ruta));
    todas += pedidas.size;
    faltan += sinArchivo.length;
    if (sinArchivo.length) {
      bloques.push({
        titulo: `${era.titulo} — ${era.anio}`,
        carpeta: carpeta(sinArchivo[0][0]),
        filas: sinArchivo.map(([ruta, titulo]) => [archivo(ruta), titulo]),
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

if (sinDeclarar.length) {
  console.log("");
  console.log("OJO — portadas que YA están en disco pero que nadie ha declarado:");
  console.log("(sin su línea en culturaPortadas.ts la Historia sigue saliendo con el emoji)");
  for (const [clave, ruta] of sinDeclarar) console.log(`  ${clave}:  portada: \`${ruta}\``);
}
