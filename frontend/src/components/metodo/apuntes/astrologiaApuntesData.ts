// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS APUNTES» · ASTROLOGÍA — lo que la persona puede llevarse, en DOS cajas:
//
//   · TEORÍA DE ASTROLOGÍA: signos, casas, planetas y aspectos tal como se explican en la web
//     (las mismas viñetas de los cómics; corregir una frase allí la corrige en el papel).
//   · TU CARTA ASTRAL: lo suyo. Sus planetas (el signo y la casa en que cae cada uno), sus casas
//     y sus aspectos, con los textos que ya ha leído en el recorrido.
//
// No hay texto nuevo aquí: solo se reúne lo que ya existe.
// ─────────────────────────────────────────────────────────────────────────
import type { BloqueApunte, GrupoApunte, ItemApunte, SeccionApunte } from "../../../utils/pdf/apuntesAstroTipos";
import { seccionesAstro } from "../astrologiaIntroData";
import { CUERPOS, ZODIAC_SIGNS } from "../astrologiaData";
import { casasDelPlaneta } from "../astrologiaCasas";
import { aspectoKey, infoCasa, NUMEROS_ROMANOS, COLOR_SIGNO } from "../casasAspectos";
import { COLOR_ASPECTO, type CartaNatal } from "../CartaAstral3D/types";
import type { useNombresAstro } from "../astrologiaNombres";
import { fetchAstroTexto } from "../../../data/astrologiaTextosApi";
import { traducir } from "../../../i18n";
import type { ClaveTexto } from "../../../i18n";

type Nombres = ReturnType<typeof useNombresAstro>;

/** Lo que se pide al servidor de la persona: su carta y los textos que María le ha escrito. */
export interface DatosCartaApuntes {
  carta: CartaNatal;
  casasTexto: Record<string, string>;
  aspectosTexto: Record<string, string>;
}

const limpiar = (s: string) => s.replace(/\*\*/g, "").trim();
const parrafosDe = (texto: string): string[] => {
  // Lo de antes de «---» son las frases destacadas (una por línea); luego el cuerpo.
  const m = texto.match(/^[ \t]*---[ \t]*$/m);
  const resumen = m && m.index != null ? texto.slice(0, m.index).trim() : "";
  const cuerpo = m && m.index != null ? texto.slice(m.index + m[0].length).trim() : texto;
  const lineas = resumen ? resumen.split(/\n+/).map(limpiar).filter(Boolean) : [];
  return [...lineas, ...cuerpo.split(/\n\s*\n+/g).map(limpiar).filter(Boolean)];
};

const grupoTitulo = (clave: string) => traducir(`metodo.astro.explica.${clave}` as ClaveTexto);

/** TEORÍA DE ASTROLOGÍA: un grupo por tema, un capítulo por signo/casa/planeta/aspecto. */
export function seccionTeoria(titulo: string): SeccionApunte {
  const grupos: GrupoApunte[] = seccionesAstro().map((sec) => {
    // En signos y casas la primera línea de la viñeta es el nombre en mayúsculas (ya es el título).
    const sinNombre = sec.clave === "signos" || sec.clave === "casas";
    const items: ItemApunte[] = sec.tarjetas.map((c, i) => {
      const v = sec.vinetas[i];
      const parrafos = (sinNombre ? v.paragraphs.slice(1) : v.paragraphs).map(limpiar).filter(Boolean);
      return {
        key: `teoria-${sec.clave}-${c.clave}`,
        titulo: c.titulo,
        resumen: c.frase,
        foto: c.foto,
        bloques: async () => [{ parrafos }],
      };
    });
    return { key: `teoria-${sec.clave}`, titulo: grupoTitulo(sec.clave), items };
  });
  return { key: "teoria", titulo, grupos };
}

/** TU CARTA ASTRAL: sus planetas, sus casas y sus aspectos (solo lo que tiene texto). */
export function seccionCarta(titulo: string, datos: DatosCartaApuntes, n: Nombres): SeccionApunte {
  const { carta, casasTexto, aspectosTexto } = datos;

  const planetas: ItemApunte[] = [];
  for (const c of CUERPOS) {
    if (c.key === "ascendente") continue;
    const p = carta.planetas.find((x) => x.planeta === c.key);
    const signo = p ? ZODIAC_SIGNS[p.signoIdx]?.name : undefined;
    if (!p || !signo) continue;
    const casas = casasDelPlaneta(p, carta.cusps);
    planetas.push({
      key: `carta-planeta-${c.key}`,
      titulo: n.cuerpo(c.key),
      resumen: n.enSigno(c.key, signo) + (casas.length ? ` · ${casas.map((x) => n.enCasa(c.key, x)).join(" · ")}` : ""),
      color: c.color,
      foto: `/viñetas/astrologia/planetas/${c.key}.webp`,
      bloques: async () => {
        const out: BloqueApunte[] = [];
        const ts = await fetchAstroTexto(c.key, "signo", signo);
        out.push({ sub: n.enSigno(c.key, signo), parrafos: ts ? parrafosDe(ts) : [] });
        for (const casa of casas) {
          const tc = await fetchAstroTexto(c.key, "casa", String(casa));
          out.push({ sub: n.enCasa(c.key, casa), parrafos: tc ? parrafosDe(tc) : [] });
        }
        return out;
      },
    });
  }

  const casasItems: ItemApunte[] = [];
  for (let i = 1; i <= 12; i++) {
    const texto = (casasTexto[String(i)] ?? "").trim();
    if (!texto) continue;
    const info = infoCasa(carta.cusps, i);
    casasItems.push({
      key: `carta-casa-${i}`,
      titulo: `${n.palabraCasa()} ${NUMEROS_ROMANOS[i - 1]}`,
      resumen: info ? n.signo(info.signo.name) : undefined,
      color: info ? COLOR_SIGNO[info.signo.name] : undefined,
      bloques: async () => [{ parrafos: parrafosDe(texto) }],
    });
  }

  const aspectosItems: ItemApunte[] = [];
  for (const a of carta.aspectos ?? []) {
    const texto = (aspectosTexto[aspectoKey(a)] ?? "").trim();
    if (!texto) continue;
    aspectosItems.push({
      key: `carta-aspecto-${aspectoKey(a)}`,
      titulo: `${n.cuerpo(a.a)} · ${n.aspecto(a.tipo)} · ${n.cuerpo(a.b)}`,
      color: COLOR_ASPECTO[a.tipo],
      bloques: async () => [{ parrafos: parrafosDe(texto) }],
    });
  }

  const grupos: GrupoApunte[] = [
    { key: "carta-planetas", titulo: grupoTitulo("planetas"), items: planetas },
    { key: "carta-casas", titulo: grupoTitulo("casas"), items: casasItems },
    { key: "carta-aspectos", titulo: grupoTitulo("aspectos"), items: aspectosItems },
  ].filter((g) => g.items.length > 0);

  return { key: "carta", titulo, grupos };
}
