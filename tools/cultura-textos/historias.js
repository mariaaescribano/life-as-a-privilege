// Utilidades para trabajar con las seis Historias de Cultura.
//   · leerHistoria(clave)  → estructura {eras:[{key,titulo,anio,momentos:[…]}]}
//     con el texto ya separado en pregunta / cuerpo / datos / Profundiza.
//   · aTexto(historia)     → el .md legible y editable.
//   · escribirEra(...)     → regenera el bloque hito() de una era y lo mete en el .ts.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RAIZ = path.resolve(__dirname, "../..");
const DIR = path.join(RAIZ, "frontend/src/components/metodo");
const TMP = require("os").tmpdir();

const HISTORIAS = {
  universal: { file: "culturaHistoriaUniversal.ts", exporta: "HISTORIA_UNIVERSAL_HITOS", titulo: "Historia Universal" },
  religiones: { file: "culturaHistoriaReligiones.ts", exporta: "HISTORIA_RELIGIONES_HITOS", titulo: "Historia de las religiones" },
  filosofia: { file: "culturaHistoriaFilosofia.ts", exporta: "HISTORIA_FILOSOFIA_HITOS", titulo: "Historia de la filosofía" },
  ciencia: { file: "culturaHistoriaCiencia.ts", exporta: "HISTORIA_CIENCIA_HITOS", titulo: "Historia de la ciencia" },
  medicina: { file: "culturaHistoriaMedicina.ts", exporta: "HISTORIA_MEDICINA_HITOS", titulo: "Historia de la medicina" },
  arte: { file: "culturaHistoriaArte.ts", exporta: "HISTORIA_ARTE_HITOS", titulo: "Historia del arte y la literatura" },
};

// Un párrafo suelto que es SOLO una pregunta y abre la viñeta = pregunta gancho.
const esPregunta = (p) => /^¿/.test(p) && /[?!]$/.test(p.trim()) && p.length < 220;
const esDato = (p) => /^Dato curioso/.test(p);

function partir(paragraphs, conPregunta) {
  const ps = paragraphs.slice();
  const pregunta = conPregunta && ps.length && esPregunta(ps[0]) ? ps.shift() : "";
  const datos = [];
  while (ps.length && esDato(ps[ps.length - 1])) datos.unshift(ps.pop());
  return { pregunta, cuerpo: ps, datos };
}

function leerHistoria(clave) {
  const h = HISTORIAS[clave];
  const js = path.join(TMP, `_${clave}.js`);
  execFileSync("npx", ["esbuild", path.join(DIR, h.file), "--format=cjs", "--platform=node",
    `--outfile=${js}`, "--log-level=warning"], { cwd: RAIZ, shell: true });
  delete require.cache[js];
  const datos = require(js)[h.exporta];
  return {
    clave, titulo: h.titulo, file: h.file,
    eras: datos.map((e) => ({
      key: e.key, titulo: e.titulo, anio: e.anio,
      momentos: e.subhitos.map((s) => {
        const principal = partir(s.vinetas[0]?.paragraphs ?? [], true);
        return {
          key: s.key, titulo: s.titulo, fecha: s.vinetas[0]?.eyebrow ?? "",
          ...principal,
          extras: s.vinetas.slice(1).map((v) => {
            const p = partir(v.paragraphs, false);
            return { titulo: v.titulo, cuerpo: p.cuerpo, datos: p.datos };
          }),
        };
      }),
    })),
  };
}

const sinEtiqueta = (d) => d.replace(/^Dato curioso(?: I+)?:\s*/, "");

function aTexto(historia, soloEras) {
  const o = [];
  o.push(`# ${historia.titulo}`);
  o.push("");
  o.push("> Texto tal como está AHORA en la web. Reescribe encima: puedes borrar frases o párrafos,");
  o.push("> quitar el dato curioso (es opcional), poner dos («Dato curioso II:») o cargarte un momento entero.");
  o.push("> No hace falta dejar saltos de línea tras cada punto: eso lo hace el visor solo.");
  o.push("");
  for (const era of historia.eras) {
    if (soloEras && !soloEras.includes(era.key)) continue;
    o.push("");
    o.push(`# ERA · ${era.titulo}`);
    o.push("");
    o.push(`\`key: ${era.key}\` · Época: **${era.anio}**`);
    o.push("");
    era.momentos.forEach((s, i) => {
      o.push("---");
      o.push("");
      o.push(`## ${i + 1} · ${s.titulo}`);
      o.push("");
      o.push(`\`${s.key}\` · **${s.fecha || "sin fecha"}**` + (s.extras.length ? `  ·  ${s.extras.length} pág. Profundiza` : ""));
      o.push("");
      if (s.pregunta) { o.push(`**Pregunta:** ${s.pregunta}`); o.push(""); }
      o.push("**Cuerpo:**"); o.push("");
      s.cuerpo.forEach((p) => { o.push(p); o.push(""); });
      s.datos.forEach((d, j) => { o.push(`**Dato curioso${j ? " II" : ""}:** ${sinEtiqueta(d)}`); o.push(""); });
      s.extras.forEach((e, j) => {
        o.push(`### Profundiza ${j + 1} · ${e.titulo}`);
        o.push("");
        e.cuerpo.forEach((p) => { o.push(p); o.push(""); });
        e.datos.forEach((d, k) => { o.push(`**Dato curioso${k ? " II" : ""}:** ${sinEtiqueta(d)}`); o.push(""); });
      });
    });
  }
  return o.join("\n");
}

// ── Reescribir una era en el .ts ────────────────────────────────────────────
const S = (s) => JSON.stringify(s);
const etiqueta = (d, i) => (i === 0 ? "Dato curioso: " : "Dato curioso II: ") + sinEtiqueta(d);

function bloqueEra(eraKey, momentos) {
  const out = [];
  for (const s of momentos) {
    const datos = s.datos.map(etiqueta);
    out.push(`      hito(${S(eraKey)}, ${S(s.key)}, ${S(s.titulo)}, ${S(s.fecha)},`);
    out.push(`        ${S(s.pregunta || "")},`);
    out.push("        [");
    s.cuerpo.forEach((p) => out.push(`          ${S(p)},`));
    out.push("        ]" + (datos.length || s.extras.length ? "," : "),"));
    if (datos.length === 1) out.push(`        ${S(datos[0])}${s.extras.length ? "," : "),"}`);
    if (datos.length > 1) {
      out.push("        [");
      datos.forEach((d) => out.push(`          ${S(d)},`));
      out.push("        ]" + (s.extras.length ? "," : "),"));
    }
    if (s.extras.length) {
      out.push("        [");
      s.extras.forEach((e) => {
        const eDatos = e.datos.map(etiqueta);
        out.push("          {");
        out.push(`            titulo: ${S(e.titulo)},`);
        out.push("            cuerpo: [");
        e.cuerpo.forEach((p) => out.push(`              ${S(p)},`));
        out.push("            ],");
        if (eDatos.length === 1) out.push(`            dato: ${S(eDatos[0])},`);
        if (eDatos.length > 1) {
          out.push("            dato: [");
          eDatos.forEach((d) => out.push(`              ${S(d)},`));
          out.push("            ],");
        }
        out.push("          },");
      });
      out.push("        ]),");
    }
  }
  return out;
}

// Sustituye en el .ts el array subhitos de una era por los momentos dados.
function escribirEra(file, eraKey, momentos) {
  const p = path.join(DIR, file);
  const lines = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n").split("\n");
  const iKey = lines.findIndex((l) => l.trim() === `key: ${S(eraKey)},`);
  if (iKey < 0) throw new Error(`no encuentro la era ${eraKey} en ${file}`);
  const iIni = lines.findIndex((l, i) => i > iKey && l.trim() === "subhitos: [");
  if (iIni < 0) throw new Error(`no encuentro subhitos de ${eraKey}`);
  let iFin = -1;
  for (let i = iIni + 1; i < lines.length; i++) {
    if (lines[i] === "    ],") { iFin = i; break; }
  }
  if (iFin < 0) throw new Error(`no encuentro el cierre de subhitos de ${eraKey}`);
  const out = [...lines.slice(0, iIni + 1), ...bloqueEra(eraKey, momentos), ...lines.slice(iFin)];
  fs.writeFileSync(p, out.join("\n"), "utf8");
  return { antes: iFin - iIni - 1, despues: out.length - lines.length + (iFin - iIni - 1) };
}

// Aplica un plan de recortes a una era y la reescribe.
//   plan[momentoKey] = { fuera:true } | {
//      pregunta: true (conservarla; por defecto se quita),
//      corta: [índices de párrafos del cuerpo que se van],
//      nuevo: { índice: "texto que sustituye" },
//      datos: [índices de datos que se conservan]  (por defecto, todos),
//      prof:  { índiceProfundiza: { fuera:true, corta:[…], nuevo:{…}, datos:[…] } } }
function aplicarPlan(historia, eraKey, plan) {
  const era = historia.eras.find((e) => e.key === eraKey);
  if (!era) throw new Error(`era desconocida: ${eraKey}`);
  const aviso = [];
  const momentos = [];
  for (const s of era.momentos) {
    const p = plan[s.key] ?? {};
    if (p.fuera) { aviso.push(`  − momento fuera: ${s.key}`); continue; }
    const corta = new Set(p.corta ?? []);
    (p.corta ?? []).forEach((i) => { if (i >= s.cuerpo.length) aviso.push(`  ! ${s.key}: no existe el párrafo ${i} (hay ${s.cuerpo.length})`); });
    const cuerpo = s.cuerpo
      .map((t, i) => (p.nuevo && p.nuevo[i] != null ? p.nuevo[i] : t))
      .filter((_, i) => !corta.has(i));
    const datos = p.datos ? p.datos.map((i) => s.datos[i]).filter(Boolean) : s.datos;
    const extras = s.extras
      .map((e, j) => {
        const q = (p.prof && p.prof[j]) ?? {};
        if (q.fuera) { aviso.push(`  − Profundiza fuera: ${s.key} #${j + 1}`); return null; }
        const cortaE = new Set(q.corta ?? []);
        (q.corta ?? []).forEach((i) => { if (i >= e.cuerpo.length) aviso.push(`  ! ${s.key} prof${j + 1}: no existe el párrafo ${i} (hay ${e.cuerpo.length})`); });
        return {
          titulo: q.titulo ?? e.titulo,
          cuerpo: e.cuerpo
            .map((t, i) => (q.nuevo && q.nuevo[i] != null ? q.nuevo[i] : t))
            .filter((_, i) => !cortaE.has(i)),
          datos: q.datos ? q.datos.map((i) => e.datos[i]).filter(Boolean) : e.datos,
        };
      })
      .filter(Boolean);
    momentos.push({ ...s, pregunta: p.pregunta ? s.pregunta : "", cuerpo, datos, extras });
  }
  const r = escribirEra(historia.file, eraKey, momentos);
  const palabras = (ms) => ms.flatMap((s) => [...s.cuerpo, ...s.datos, ...s.extras.flatMap((e) => [...e.cuerpo, ...e.datos])])
    .join(" ").split(/\s+/).filter(Boolean).length;
  console.log(`${historia.clave} · ${eraKey}: ${era.momentos.length}→${momentos.length} momentos, ${palabras(era.momentos)}→${palabras(momentos)} palabras`);
  if (aviso.length) console.log(aviso.join("\n"));
  return r;
}

module.exports = { HISTORIAS, leerHistoria, aTexto, escribirEra, aplicarPlan, RAIZ, DIR };
