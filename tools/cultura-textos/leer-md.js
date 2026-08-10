// Lee un .md de los generados (ya editado a mano) y devuelve sus eras/momentos.
// Con `--escribir` los mete en el .ts de la Historia correspondiente.
const fs = require("fs");
const path = require("path");
const H = require("./historias.js");

function leerMd(ruta) {
  const lineas = fs.readFileSync(ruta, "utf8").replace(/\r\n/g, "\n").split("\n");
  const eras = [];
  let era = null, m = null, destino = null;
  for (const raw of lineas) {
    const l = raw.trim();
    if (!l || l === "---" || l === "**Cuerpo:**" || l.startsWith(">")) continue;
    let t;
    if ((t = l.match(/^# ERA · (.+)$/))) {
      era = { titulo: t[1].trim(), key: null, momentos: [] };
      eras.push(era); m = null; destino = null; continue;
    }
    if (/^# /.test(l)) continue;                       // título del archivo
    if ((t = l.match(/^`key: ([^`]+)`/))) { era.key = t[1].trim(); continue; }
    if ((t = l.match(/^## \d+ · (.+)$/))) {
      m = { titulo: t[1].trim(), key: null, fecha: "", pregunta: "", cuerpo: [], datos: [], extras: [] };
      era.momentos.push(m); destino = m; continue;
    }
    if ((t = l.match(/^`([^`]+)`\s*·\s*\*\*(.+?)\*\*/))) {
      m.key = t[1].trim();
      m.fecha = t[2].trim() === "sin fecha" ? "" : t[2].trim();
      continue;
    }
    if ((t = l.match(/^### Profundiza \d+ · (.+)$/))) {
      destino = { titulo: t[1].trim(), cuerpo: [], datos: [] };
      m.extras.push(destino); continue;
    }
    if ((t = l.match(/^\*\*Pregunta:\*\*\s*(.+)$/))) { m.pregunta = t[1].trim(); continue; }
    if ((t = l.match(/^\*\*Dato curioso(?: I+)?:\*\*\s*(.+)$/))) { destino.datos.push(t[1].trim()); continue; }
    if (destino) destino.cuerpo.push(l);
  }
  return eras;
}

const [clave, ruta, ...flags] = process.argv.slice(2);
const eras = leerMd(path.isAbsolute(ruta) ? ruta : path.join(H.RAIZ, ruta));
const pal = (e) => e.momentos.flatMap((s) => [...s.cuerpo, ...s.datos, ...s.extras.flatMap((x) => [...x.cuerpo, ...x.datos])])
  .join(" ").split(/\s+/).filter(Boolean).length;
for (const era of eras) console.log(`  ${era.key}: ${era.momentos.length} momentos, ${pal(era)} palabras`);

if (flags.includes("--escribir")) {
  const file = H.HISTORIAS[clave].file;
  for (const era of eras) H.escribirEra(file, era.key, era.momentos);
  console.log(`escrito en ${file}`);
} else {
  // Comprobación de ida y vuelta contra lo que hay ahora en el código.
  const actual = H.leerHistoria(clave);
  const limpio = (x) => JSON.stringify(x.eras.map((e) => ({
    key: e.key, momentos: e.momentos.map((s) => ({ ...s, fecha: s.fecha, extras: s.extras })),
  })));
  const comoMd = JSON.stringify(eras.map((e) => ({
    key: e.key, momentos: e.momentos.map((s) => ({ key: s.key, titulo: s.titulo, fecha: s.fecha, pregunta: s.pregunta, cuerpo: s.cuerpo, datos: s.datos, extras: s.extras })),
  })));
  console.log(limpio(actual) === comoMd ? "IDA Y VUELTA IDÉNTICA ✓" : "DIFERENCIAS (normal si ya lo has editado)");
}
