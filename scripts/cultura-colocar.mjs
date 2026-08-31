/* ─────────────────────────────────────────────────────────────────────────────
 *  COLOCAR las ilustraciones nuevas de Cultura
 *
 *  Por qué: las fotos nuevas caen sueltas en `frontend/public/recorrido/cultura/`
 *  y en PNG, pero el recorrido las espera en WebP y dentro de la carpeta de su
 *  Historia (`historiageneral/`, `historiamedicina/eras/`, …). Hacerlo a mano son
 *  70 mudanzas y 70 conversiones sin equivocarse ni una.
 *
 *  Qué hace: por cada PNG suelto busca su ruta en los datos de verdad
 *  (`culturaHistoria*.ts`, igual que `cultura-fotos.mjs`), lo convierte a WebP
 *  con los mismos ajustes que el resto de la carpeta y lo deja en su sitio.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/cultura-colocar.mjs --prueba   → dice qué haría, sin tocar nada
 *    node scripts/cultura-colocar.mjs            → lo hace
 *
 *  Reglas de seguridad:
 *   · El PNG se borra solo DESPUÉS de escribir bien su WebP.
 *   · Nunca pisa un WebP que ya existe: eso se avisa y se salta.
 *   · Un mismo nombre puede existir en dos Historias (`egipto.webp` está en
 *     religiones y en medicina). Si solo falta en una, va ahí. Si falta en
 *     varias, se salta y se avisa: la decisión es de la ilustración, no del
 *     nombre. Para esos casos está DESTINOS, más abajo.
 *
 *  Después: `node scripts/cultura-fotos.mjs` para regenerar la lista de lo que
 *  sigue faltando.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const RAIZ = path.resolve(import.meta.dirname, "..");
const FRONT = path.join(RAIZ, "frontend");
const SRC = path.join(FRONT, "src", "components", "metodo");
const PUB = path.join(FRONT, "public");
const SUELTAS = path.join(PUB, "recorrido", "cultura");

const PRUEBA = process.argv.includes("--prueba");

// Mismos ajustes con los que quedó el resto de la carpeta después de
// `scripts/webp/adelgazar.mjs`: 900 px de lado y calidad 75.
const LADO_MAX = 900;
const OPCIONES_WEBP = { quality: 75, effort: 6, alphaQuality: 100, smartSubsample: true };

/**
 * Desempates hechos a mano: nombres que faltan en DOS Historias a la vez, así
 * que el nombre no basta y hay que mirar el dibujo. Clave: el PNG suelto.
 * Valor: la ruta pública elegida.
 */
const DESTINOS = {
  // Cadena de montaje de una fábrica → la Revolución Industrial de la Historia
  // Universal, no los especialistas de Egipto de la Historia de la Medicina.
  "especializacion.png": "/recorrido/cultura/historiageneral/especializacion.webp",
  // Sabios del XVII con matraz y telescopio, sin nada médico → Revolución
  // Científica de la Historia Universal.
  "metodo-cientifico.png": "/recorrido/cultura/historiageneral/metodo-cientifico.webp",
  // Sanador junto a una niña enferma → «¿Qué significa estar enfermo?», el
  // prólogo de la Historia de la Medicina (no el de Arte).
  "prologo.png": "/recorrido/cultura/historiamedicina/eras/prologo.webp",
  // Disección anatómica + astronomía en Florencia → «Renacimiento: mirar
  // dentro», la era de la Historia de la Medicina.
  "renacimiento.png": "/recorrido/cultura/historiamedicina/eras/renacimiento.webp",
};

const unix = (p) => p.split(path.sep).join("/");
const requerir = createRequire(path.join(FRONT, "package.json"));
const esbuild = requerir("esbuild");
const sharp = (await import(
  pathToFileURL(path.join(FRONT, "node_modules/sharp/dist/index.cjs")).href
)).default;

// ── Las rutas que espera el recorrido ────────────────────────────────────────
// Los datos son TypeScript: se compilan a un módulo suelto y se evalúan, igual
// que en `cultura-fotos.mjs`, para leer las rutas exactas sin duplicar aquí la
// lógica de cada Historia.
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
const tmp = fs.mkdtempSync(path.join(RAIZ, ".cultura-colocar-"));
fs.writeFileSync(path.join(tmp, "datos.mjs"), compilado.outputFiles[0].text);
const { HISTORIAS_CULTURA, CULTURA_HISTORIA_VISUAL } = await import(
  pathToFileURL(path.join(tmp, "datos.mjs")).href
);
fs.rmSync(tmp, { recursive: true, force: true });

/** nombre de archivo → [{ ruta, quien }] de todo lo que pide el recorrido. */
const porNombre = new Map();
const apuntar = (ruta, quien) => {
  if (!ruta) return;
  const nombre = ruta.split("/").pop();
  const lista = porNombre.get(nombre) ?? [];
  if (!lista.some((d) => d.ruta === ruta)) lista.push({ ruta, quien });
  porNombre.set(nombre, lista);
};

for (const [clave, historia] of Object.entries(HISTORIAS_CULTURA)) {
  apuntar(CULTURA_HISTORIA_VISUAL[clave]?.portada, `${clave}: portada`);
  for (const era of historia.hitos) {
    apuntar(era.foto, `${clave} · era «${era.titulo}»`);
    for (const sub of era.subhitos) {
      apuntar(sub.foto, `${clave} · ${era.titulo} · ${sub.titulo}`);
      for (const vin of sub.vinetas ?? []) {
        apuntar(vin.src, `${clave} · ${era.titulo} · ${sub.titulo} → ${vin.titulo}`);
      }
    }
  }
}

// ── A colocar ────────────────────────────────────────────────────────────────
const pngs = fs
  .readdirSync(SUELTAS, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".png"))
  .map((e) => e.name)
  .sort();

if (!pngs.length) {
  console.log(`No hay PNG sueltos en ${unix(path.relative(RAIZ, SUELTAS))}. Nada que colocar.`);
  process.exit(0);
}

const plan = [];
const dudosas = [];
const huerfanas = [];
const pisarian = [];

for (const png of pngs) {
  const nombre = png.replace(/\.png$/i, ".webp");
  const destinos = porNombre.get(nombre) ?? [];

  if (DESTINOS[png]) {
    const elegido = destinos.find((d) => d.ruta === DESTINOS[png]);
    if (!elegido) {
      huerfanas.push([png, `DESTINOS apunta a ${DESTINOS[png]}, que ya no está en los datos`]);
      continue;
    }
    plan.push([png, elegido]);
    continue;
  }

  if (!destinos.length) {
    huerfanas.push([png, "ningún momento del recorrido pide este nombre"]);
    continue;
  }

  // Si el nombre existe en varias Historias, la que manda es la que todavía no
  // tiene la foto: las demás ya están servidas y no se pisan.
  const libres = destinos.filter((d) => !fs.existsSync(path.join(PUB, d.ruta)));
  if (!libres.length) {
    pisarian.push([png, destinos.map((d) => d.ruta)]);
    continue;
  }
  if (libres.length > 1) {
    dudosas.push([png, libres]);
    continue;
  }
  plan.push([png, libres[0]]);
}

// ── Informe y ejecución ──────────────────────────────────────────────────────
console.log(
  `${pngs.length} PNG sueltos · ${plan.length} a colocar` +
    `${dudosas.length ? ` · ${dudosas.length} sin decidir` : ""}` +
    `${pisarian.length ? ` · ${pisarian.length} ya estaban` : ""}` +
    `${huerfanas.length ? ` · ${huerfanas.length} sin sitio` : ""}\n`,
);

let colocadas = 0;
let ahorro = 0;

for (const [png, destino] of plan) {
  const origen = path.join(SUELTAS, png);
  const salida = path.join(PUB, destino.ruta);
  const pesoPng = fs.statSync(origen).size;

  if (PRUEBA) {
    console.log(`  ${png}  →  ${destino.ruta}`);
    console.log(`      ${destino.quien}`);
    continue;
  }

  await fsp.mkdir(path.dirname(salida), { recursive: true });
  await sharp(origen)
    .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
    .webp(OPCIONES_WEBP)
    .toFile(salida);

  const pesoWebp = fs.statSync(salida).size;
  if (!pesoWebp) throw new Error(`WebP vacío: ${destino.ruta}`);

  // El PNG solo se borra con su WebP ya escrito y con peso.
  await fsp.unlink(origen);
  colocadas++;
  ahorro += pesoPng - pesoWebp;
  const kb = (n) => `${Math.round(n / 1024)} kB`;
  console.log(`  ${png}  →  ${destino.ruta}   (${kb(pesoPng)} → ${kb(pesoWebp)})`);
}

const aviso = (titulo, filas) => {
  if (!filas.length) return;
  console.log(`\n${titulo}`);
  for (const [png, detalle] of filas) {
    console.log(`  ${png}`);
    for (const d of Array.isArray(detalle) ? detalle : [detalle]) {
      console.log(`      ${typeof d === "string" ? d : `${d.ruta}   [${d.quien}]`}`);
    }
  }
};

aviso("SIN DECIDIR — falta en varias Historias. Mira el dibujo y añádelo a DESTINOS:", dudosas);
aviso("YA ESTABAN — el WebP existe en todos sus destinos, el PNG se queda quieto:", pisarian);
aviso("SIN SITIO — ningún momento pide este nombre:", huerfanas);

if (!PRUEBA && colocadas) {
  console.log(
    `\n${colocadas} colocadas. Ahorro: ${(ahorro / 1024 / 1024).toFixed(1)} MB.` +
      `\nAhora: node scripts/cultura-fotos.mjs`,
  );
}
if (PRUEBA) console.log("\n(--prueba: no se ha tocado nada)");
