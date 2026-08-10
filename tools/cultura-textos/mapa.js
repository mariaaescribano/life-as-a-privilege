// Mapa de una era: cada párrafo con su índice, sus palabras y su arranque.
// Sirve para decidir qué recortar sin volcar el texto entero.
const H = require("./historias.js");
const [clave, ...eras] = process.argv.slice(2);
const largo = Number(process.env.LARGO || 22);
const h = H.leerHistoria(clave);
const arranque = (p) => {
  const w = p.split(/\s+/);
  return w.slice(0, largo).join(" ") + (w.length > largo ? " …" : "");
};
for (const era of h.eras) {
  if (eras.length && !eras.includes(era.key)) continue;
  console.log(`\n████ ${era.key} · ${era.titulo} (${era.anio})`);
  era.momentos.forEach((s, i) => {
    console.log(`\n▓ ${i + 1}. ${s.key} — ${s.titulo} [${s.fecha}]`);
    if (s.pregunta) console.log(`   P: ${s.pregunta}`);
    s.cuerpo.forEach((p, j) => console.log(`   ${j}) ${p.split(/\s+/).length}w · ${arranque(p)}`));
    s.datos.forEach((d, j) => console.log(`   D${j}) ${arranque(d)}`));
    s.extras.forEach((e, k) => {
      console.log(`   ── prof${k} · ${e.titulo}`);
      e.cuerpo.forEach((p, j) => console.log(`      ${j}) ${p.split(/\s+/).length}w · ${arranque(p)}`));
      e.datos.forEach((d, j) => console.log(`      D${j}) ${arranque(d)}`));
    });
  });
}
