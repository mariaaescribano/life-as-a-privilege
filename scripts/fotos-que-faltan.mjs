/* ─────────────────────────────────────────────────────────────────────────────
 *  FOTOS QUE FALTAN — todas las disciplinas
 *
 *  Por qué: `cultura-fotos.mjs` solo mira Cultura, porque sus datos están muy
 *  ordenados. El resto de disciplinas pide sus ilustraciones desde sitios muy
 *  distintos (arrays de datos, plantillas `${key}`, constantes de carpeta), así
 *  que no había manera de saber qué faltaba sin ir mirando carpeta por carpeta.
 *
 *  Qué hace: reúne TODAS las rutas de imagen que el frontend pide y las compara
 *  con lo que hay en `frontend/public`. Las reúne de dos maneras, porque de una
 *  sola se escapan:
 *
 *   1. EVALUANDO los módulos de datos (`.ts` de components/, hardCoded/, data/,
 *      utils/). Se compilan y se importan, y se recorre lo que exportan
 *      buscando cadenas que sean rutas de imagen. Así salen resueltas las que
 *      se arman con plantilla (`/recorrido/tcm/qigong/${key}.webp`), que son la
 *      mayoría y las que no se pueden leer a ojo.
 *   2. LEYENDO el texto de cada `.ts`/`.tsx`, para las páginas (que no se pueden
 *      importar sin React). Se resuelven también las que concatenan una
 *      constante del propio archivo: `BASE+"/huevo.jpg"` o `${PRE}/celula.png`.
 *
 *  Lo que NO cuenta como falta: los ejemplos de los comentarios (llevan
 *  `<placeholder>` o empiezan por `/public/`) y lo que viene de fuera (YouTube).
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/fotos-que-faltan.mjs
 *    node scripts/fotos-que-faltan.mjs --porque   → y además, qué módulos no se
 *      han podido evaluar y por qué (son clientes de API y el PDF, que arrastran
 *      dependencias de navegador; de esos solo se lee el texto)
 *
 *  Escribe `FOTOS-que-faltan.md`. Para el detalle de Cultura —qué momento es
 *  cada archivo— sigue mandando `CULTURA-fotos-que-faltan.md`, que tiene el
 *  título de cada hueco; aquí Cultura sale resumida para no tener dos listas
 *  diciendo lo mismo.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const RAIZ = path.resolve(import.meta.dirname, "..");
const FRONT = path.join(RAIZ, "frontend");
const SRC = path.join(FRONT, "src");
const PUB = path.join(FRONT, "public");
const SALIDA = path.join(RAIZ, "FOTOS-que-faltan.md");

const requerir = createRequire(path.join(FRONT, "package.json"));
const esbuild = requerir("esbuild");

const unix = (p) => p.split(path.sep).join("/");
const rel = (a) => unix(path.relative(RAIZ, a));
const EXT = /\.(webp|png|jpe?g|svg|gif|avif|mp4|webm)$/i;

// Los temporales van al temp del sistema, NUNCA dentro del repo: una versión
// anterior de esto dejó 196 carpetas sueltas en la raíz.
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "fotos-faltan-"));

/** A qué disciplina pertenece cada ruta, por el sitio donde vive la foto. */
const DISCIPLINAS = [
  [/^\/recorrido\/cultura\//, "Cultura"],
  [/^\/recorrido\/fisiologia\//, "Fisiología"],
  [/^\/recorrido\/nutricion\/|^\/viñetas\/nutricion\/|^\/img\/nutri\//, "Nutrición"],
  [/^\/recorrido\/tcm\/|^\/viñetas\/tcm\//, "Medicina China"],
  [/^\/recorrido\/cabala\/|^\/viñetas\/cabala\//, "Cábala"],
  [/^\/recorrido\/astrologia\/|^\/viñetas\/astrologia\//, "Astrología"],
  [/^\/recorrido\/psicologia\/|^\/viñetas\/psicologia\//, "Psicología"],
  [/^\/recorrido\/ayurveda\/|^\/viñetas\/hinduismo\//, "Ayurveda"],
  [/^\/videos\//, "Vídeos"],
];
const disciplinaDe = (ruta) => DISCIPLINAS.find(([re]) => re.test(ruta))?.[1] ?? "Fuera del recorrido";

/* ── Fotos que hacen falta pero que el código TODAVÍA no pide ────────────────
 *
 * Hay ilustraciones que faltan sin que se note: la página tira de otra foto
 * mientras tanto, así que no se ve nada roto y buscando rutas no aparecen. Son
 * justo las que se olvidan, porque nada las reclama.
 *
 * Se apuntan aquí a mano, con el nombre exacto que tendrán y qué hay que tocar
 * cuando lleguen. En cuanto el archivo existe, este script avisa de que ya se
 * puede hacer ese cambio y de que la fila sobra.
 */
const PENDIENTES_A_MANO = [
  {
    rutas: ["madera", "fuego", "tierra", "metal", "agua"].map(
      (e) => `/recorrido/tcm/constitucion/${e}.webp`,
    ),
    porque:
      "las cinco tarjetas de constitución reutilizan la pintura de fondo de su elemento",
    alLlegar:
      "cambiar `FOTO_CONSTITUCION` en `components/metodo/tcmConstitucion.ts` (es el único sitio que las nombra)",
  },
  {
    rutas: [
      "/recorrido/cultura/portadas/historiamedicina.webp",
      "/recorrido/cultura/portadas/historiaarte.webp",
    ],
    porque: "esas dos Historias de Cultura salen con su emoji porque no tienen portada",
    alLlegar: "añadir su `portada` en `components/metodo/culturaPortadas.ts`",
  },
];

/** Ejemplos escritos en comentarios, no ficheros de verdad. */
const esEjemplo = (ruta) =>
  ruta.includes("<") || ruta.includes(">") || ruta.startsWith("/public/") || ruta.includes("://");

// ── 1. Rutas que salen de los datos ──────────────────────────────────────────
const modulos = [];
const recorrer = (dir, guarda) => {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const abs = path.join(dir, f);
    if (fs.statSync(abs).isDirectory()) recorrer(abs, guarda);
    else guarda(abs, f);
  }
};
for (const sub of ["components", "hardCoded", "data", "utils"]) {
  recorrer(path.join(SRC, sub), (abs, f) => {
    if (f.endsWith(".ts") && !f.endsWith(".d.ts")) modulos.push(abs);
  });
}

/** ruta pública → Set de archivos que la piden. */
const pedidas = new Map();
const apuntar = (ruta, quien) => {
  if (!ruta.startsWith("/") || !EXT.test(ruta) || esEjemplo(ruta)) return;
  (pedidas.get(ruta) ?? pedidas.set(ruta, new Set()).get(ruta)).add(quien);
};

/** Recorre lo que exporta un módulo y recoge toda cadena que sea una ruta. */
const rastrear = (valor, quien, visto = new Set()) => {
  if (typeof valor === "string") return apuntar(valor, quien);
  if (!valor || typeof valor !== "object" || visto.has(valor)) return;
  visto.add(valor);
  for (const hijo of Object.values(valor)) rastrear(hijo, quien, visto);
};

let evaluados = 0;
const noEvaluados = [];
for (const [i, abs] of modulos.entries()) {
  try {
    const salida = await esbuild.build({
      entryPoints: [abs],
      bundle: true,
      format: "esm",
      write: false,
      platform: "node",
      // Las imágenes importadas no interesan (esas las caza el compilador si
      // faltan): se vacían para que el módulo pueda cargarse.
      loader: Object.fromEntries(
        [".png", ".webp", ".jpg", ".jpeg", ".svg", ".gif", ".mp4", ".css"].map((e) => [e, "empty"]),
      ),
      // `import.meta.env` es de Vite y en Node no existe: sin esto, todo módulo
      // que lea una variable de entorno se cae antes de exportar sus rutas.
      define: { "import.meta.env": "{}" },
      logLevel: "silent",
    });
    // Un archivo distinto por módulo (el índice, NO los que van bien): Node
    // cachea los módulos por URL, y un fallo cacheado se vuelve a lanzar en
    // todos los que reutilicen el nombre. Así se cayeron 245 de 252 de golpe.
    const f = path.join(TMP, `m${i}.mjs`);
    fs.writeFileSync(f, salida.outputFiles[0].text);
    rastrear(await import(pathToFileURL(f).href), rel(abs));
    evaluados++;
  } catch (e) {
    // Módulos que no se pueden importar sueltos (traen React, hooks, llamadas).
    // No se pierden: su texto pasa igualmente por el barrido de abajo.
    noEvaluados.push([rel(abs), String(e.message ?? e).split("\n")[0]]);
  }
}

// ── 2. Rutas escritas en el código ───────────────────────────────────────────
const archivos = [];
recorrer(SRC, (abs, f) => {
  if (/\.(tsx?|jsx?)$/.test(f) && !f.endsWith(".d.ts")) archivos.push(abs);
});

/** Quita los comentarios: dentro hay rutas de ejemplo que no son ficheros. */
const sinComentarios = (txt) =>
  txt
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    // El `//` de `https://` no abre comentario: por eso se exige que delante no
    // vaya el `:` de un protocolo.
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

const sinResolver = new Map();
for (const abs of archivos) {
  let txt = sinComentarios(fs.readFileSync(abs, "utf8"));
  const quien = rel(abs);

  // Constantes de carpeta del propio archivo: const PRE = "/recorrido/...".
  const constantes = new Map();
  for (const m of txt.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*["'`](\/[^"'`\n]*)["'`]/g)) {
    constantes.set(m[1], m[2]);
  }

  // CONSTANTE + "/foto.webp". Se resuelve y se TACHA del texto: si no, el trozo
  // suelto ("/foto.webp") se colaría después como una ruta de la raíz que no
  // existe. Así se perdía media hora buscando un `/huevo.jpg` que era un `/img/
  // nutri/curso1/huevo.jpg` perfectamente colocado.
  txt = txt.replace(/([A-Za-z_$][\w$]*)\s*\+\s*["'`](\/[^"'`\n]*?)["'`]/g, (entero, id, resto) => {
    if (!EXT.test(resto)) return entero;
    const base = constantes.get(id);
    if (base) apuntar(base + resto, quien);
    else (sinResolver.get(`${id} + "${resto}"`) ?? sinResolver.set(`${id} + "${resto}"`, new Set()).get(`${id} + "${resto}"`)).add(quien);
    return " ".repeat(entero.length);
  });

  // Plantillas: `${PRE}/celula.png`. Solo cuentan si, sustituidas las constantes
  // del archivo, no queda ningún hueco por rellenar.
  for (const m of txt.matchAll(/`([^`\n]*)`/g)) {
    const plantilla = m[1];
    if (!EXT.test(plantilla) || !plantilla.includes("${")) continue;
    const resuelta = plantilla.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (s, id) => constantes.get(id) ?? s);
    if (!resuelta.includes("${")) apuntar(resuelta, quien);
    else if (plantilla.startsWith("/") || plantilla.startsWith("$")) {
      (sinResolver.get(plantilla) ?? sinResolver.set(plantilla, new Set()).get(plantilla)).add(quien);
    }
  }

  // Literales sueltos (ya sin los trozos de las concatenaciones).
  for (const m of txt.matchAll(/["'`](\/[^"'`\n${}]*?)["'`]/g)) apuntar(m[1], quien);
}

// ── 3. Qué falta ─────────────────────────────────────────────────────────────
/** Archivos cuyo módulo no se pudo evaluar: de esos no me fío del todo. */
const fallidos = new Set(noEvaluados.map(([f]) => f));

// Las apuntadas a mano entran como una más, con su explicación en vez de un
// archivo que las pida. Y si ya están en disco, se avisa: la fila sobra y queda
// un cambio pendiente en el código.
const yaEstan = [];
for (const grupo of PENDIENTES_A_MANO) {
  for (const ruta of grupo.rutas) {
    if (fs.existsSync(path.join(PUB, decodeURIComponent(ruta)))) yaEstan.push([ruta, grupo.alLlegar]);
    else apuntar(ruta, `Todavía no las pide el código: ${grupo.porque}. Cuando estén, hay que ${grupo.alLlegar}.`);
  }
}

const faltan = [...pedidas]
  .filter(([ruta]) => !fs.existsSync(path.join(PUB, decodeURIComponent(ruta))))
  .sort(([a], [b]) => a.localeCompare(b, "es"));

const porDisciplina = new Map();
for (const [ruta, quien] of faltan) {
  const d = disciplinaDe(ruta);
  (porDisciplina.get(d) ?? porDisciplina.set(d, []).get(d)).push([ruta, [...quien]]);
}

const lineas = [
  "# Fotos que faltan — todas las disciplinas",
  "",
  "Generado con `node scripts/fotos-que-faltan.mjs`: reúne todas las rutas de",
  "imagen que pide el frontend y las compara con `frontend/public`.",
  "",
  "Cada línea es la **ruta exacta** donde hay que dejar el archivo, con el nombre",
  "tal cual. La carpeta se crea si no existe.",
  "Formato: `.webp` salvo que la ruta diga otra cosa.",
  "",
  `De Cultura solo va el recuento: el detalle —qué momento es cada archivo— está`,
  "en `CULTURA-fotos-que-faltan.md`, que además trae el título de cada hueco.",
  "",
  "## Resumen",
  "",
  "| Disciplina | Faltan |",
  "| --- | --- |",
  ...[...porDisciplina].map(([d, filas]) => `| ${d} | ${filas.length} |`),
  `| **TOTAL** | **${faltan.length}** |`,
  "",
];

for (const [disciplina, filas] of porDisciplina) {
  lineas.push(`## ${disciplina} — faltan ${filas.length}`, "");
  if (disciplina === "Cultura") {
    lineas.push("Están una a una, con su momento, en `CULTURA-fotos-que-faltan.md`.", "");
    continue;
  }
  // Agrupadas por carpeta, que es como se piden y como se guardan.
  const porCarpeta = new Map();
  for (const [ruta, quien] of filas) {
    const carpeta = ruta.slice(0, ruta.lastIndexOf("/"));
    (porCarpeta.get(carpeta) ?? porCarpeta.set(carpeta, []).get(carpeta)).push([ruta, quien]);
  }
  for (const [carpeta, items] of porCarpeta) {
    lineas.push(`### \`frontend/public${carpeta}/\``, "");

    // Las apuntadas a mano no traen un archivo que las pida, sino la razón por
    // la que hacen falta y qué tocar cuando lleguen. Si toda la carpeta comparte
    // esa razón —lo normal, van en tandas—, se escribe una vez y no cinco.
    const razon = (quien) => (quien.some((q) => q.startsWith("frontend/")) ? null : quien[0]);
    const razones = new Set(items.map(([, quien]) => razon(quien)));
    const comun = razones.size === 1 ? [...razones][0] : null;
    if (comun) lineas.push(comun, "");

    for (const [ruta, quien] of items) {
      const nombre = `\`${ruta.split("/").pop()}\``;
      if (comun) { lineas.push(`- ${nombre}`); continue; }
      const deCodigo = quien.filter((q) => q.startsWith("frontend/"));
      lineas.push(
        `- ${nombre} — ${deCodigo.length ? `la pide ${deCodigo.map((q) => `\`${q}\``).join(", ")}` : razon(quien)}`,
      );
    }
    lineas.push("");
  }
}

// Una plantilla solo queda sin comprobar de verdad si, ADEMÁS, su archivo no se
// pudo evaluar: si el módulo sí se cargó, sus rutas ya salieron resueltas arriba
// y sacarlas aquí solo asusta.
const aCiegas = [...fallidos]
  .flatMap((f) => [...sinResolver].filter(([, quien]) => quien.has(f)).map(([t]) => [t, f]));

if (aCiegas.length) {
  lineas.push(
    "## Rutas que no se han podido comprobar",
    "",
    "Se arman al vuelo y su archivo no se puede leer aquí fuera de la web, así",
    "que no sé en qué acaban. Si alguna se ve rota en la página, empieza por aquí.",
    "",
    ...aCiegas.map(([t, f]) => `- \`${t}\` — en \`${f}\``),
    "",
  );
}

fs.writeFileSync(SALIDA, lineas.join("\n") + "\n", "utf8");
fs.rmSync(TMP, { recursive: true, force: true });

console.log(
  `${pedidas.size} rutas de imagen pedidas · faltan ${faltan.length}` +
    `   (${evaluados} módulos de datos evaluados, ${noEvaluados.length} solo leídos)`,
);
for (const [d, filas] of porDisciplina) console.log(`  ${d}: ${filas.length}`);
console.log(`\nEscrito: ${path.relative(RAIZ, SALIDA)}`);

if (yaEstan.length) {
  console.log("\nOJO — fotos apuntadas a mano que YA están en disco. Queda el cambio:");
  for (const [ruta, alLlegar] of yaEstan) console.log(`  ${ruta}\n      → ${alLlegar}`);
  console.log("  (y bórralas de PENDIENTES_A_MANO en este script)");
}
if (process.argv.includes("--porque")) {
  console.log("\nMódulos que no se han podido evaluar:");
  for (const [f, motivo] of noEvaluados.slice(0, 12)) console.log(`  ${f}\n      ${motivo}`);
}
