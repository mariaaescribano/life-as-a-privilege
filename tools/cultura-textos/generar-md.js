// Saca un .md por Historia a la raíz del proyecto, y un resumen por pantalla.
const fs = require("fs");
const path = require("path");
const H = require("./historias.js");

const ARCHIVOS = {
  universal: "CULTURA-1-historia-universal.md",
  religiones: "CULTURA-2-historia-religiones.md",
  filosofia: "CULTURA-3-historia-filosofia.md",
  ciencia: "CULTURA-4-historia-ciencia.md",
  medicina: "CULTURA-5-historia-medicina.md",
  arte: "CULTURA-6-historia-arte.md",
};

let totMom = 0, totPal = 0, totPreg = 0, totProf = 0;
for (const [clave, archivo] of Object.entries(ARCHIVOS)) {
  const h = H.leerHistoria(clave);
  const momentos = h.eras.flatMap((e) => e.momentos);
  const pal = momentos.flatMap((s) => [...s.cuerpo, ...s.datos, ...s.extras.flatMap((e) => [...e.cuerpo, ...e.datos])])
    .join(" ").split(/\s+/).filter(Boolean).length;
  const preg = momentos.filter((s) => s.pregunta).length;
  const prof = momentos.reduce((a, s) => a + s.extras.length, 0);
  const datos2 = momentos.filter((s) => s.datos.length > 1).length
    + momentos.reduce((a, s) => a + s.extras.filter((e) => e.datos.length > 1).length, 0);
  fs.writeFileSync(path.join(H.RAIZ, archivo), H.aTexto(h) + "\n", "utf8");
  console.log(`${archivo.padEnd(36)} ${String(h.eras.length).padStart(2)} eras · ${String(momentos.length).padStart(3)} momentos · ${String(prof).padStart(2)} Profundiza · ${String(pal).padStart(6)} palabras · preguntas: ${preg} · con 2 datos: ${datos2}`);
  totMom += momentos.length; totPal += pal; totPreg += preg; totProf += prof;
}
console.log(`\nTOTAL: ${totMom} momentos, ${totProf} páginas Profundiza, ${totPal} palabras, ${totPreg} preguntas gancho`);
