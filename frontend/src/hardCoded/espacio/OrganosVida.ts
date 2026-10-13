// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO DE VIDA · los órganos, el test que averigua qué le importa a la
// persona y el ranking que sale de ahí (/metodo/fisiologia/vida).
//
// El test (TestVidaModal) tiene tres preguntas. Cada respuesta SUMA puntos a unos
// órganos (`PESOS`); con la suma se ordenan todos y se reparten en tres
// categorías: Imprescindible, Te puede interesar y No obligatorio pero
// recomendable. Es determinista: las mismas respuestas dan el mismo recorrido.
//
// ⚠️ BORRADOR: las preguntas, las opciones y los pesos los redactó Claude como
//    punto de partida para que María los corrija. Los textos viven en el
//    diccionario (`fisiologia.vida.test.*`).
// ⚠️ PARA AÑADIR UN ÓRGANO: una entrada en ORGANOS_VIDA, su nombre en el
//    diccionario (`fisiologia.vida.organo.<key>`, es + en), su dibujo en
//    FiguraHumana.tsx y, si procede, sus pesos aquí.
// ⚠️ No cambiar las `key` tras publicar: con ellas se guardan los resultados.
// ─────────────────────────────────────────────────────────────────────────

export type CategoriaVida = "imprescindible" | "interesa" | "recomendable";
export const CATEGORIAS_VIDA: CategoriaVida[] = ["imprescindible", "interesa", "recomendable"];

/** El color de cada categoría (en el cuerpo y en su caja). */
export const COLOR_CATEGORIA: Record<CategoriaVida, string> = {
  imprescindible: "#f08a9a",
  interesa: "#f2c86b",
  recomendable: "#8fd6a8",
};

export interface OrganoVida {
  key: string;
  /** Adónde lleva al pulsarlo:
   *  · "celulas": la ficha de /todas-tus-celulas (células y curiosidades);
   *  · "estacion": la página de su estación en /cuerpo/<key> (con su propio vídeo);
   *  · null: aún sin ficha («próximamente»). */
  ficha: "celulas" | "estacion" | null;
  /** Reel de María sobre este órgano (enlace o ID de YouTube). Vacío = aún no
   *  hay vídeo: se va directo a la ficha. */
  video: string;
}

export const ORGANOS_VIDA: OrganoVida[] = [
  { key: "cerebro",   ficha: "celulas",  video: "" },
  { key: "ojos",      ficha: "estacion", video: "" },
  { key: "orejas",    ficha: "estacion", video: "" },
  { key: "nariz",     ficha: "estacion", video: "" },
  { key: "lengua",    ficha: "celulas",  video: "" },
  { key: "tiroides",  ficha: "celulas",  video: "" },
  { key: "pulmones",  ficha: "celulas",  video: "" },
  { key: "corazon",   ficha: "celulas",  video: "" },
  { key: "higado",    ficha: "celulas",  video: "" },
  { key: "estomago",  ficha: "celulas",  video: "" },
  { key: "vesicula",  ficha: "celulas",  video: "" },
  { key: "pancreas",  ficha: "celulas",  video: "" },
  { key: "bazo",      ficha: "celulas",  video: "" },
  { key: "intestino", ficha: null,       video: "" },
  { key: "rinones",   ficha: "celulas",  video: "" },
  { key: "piel",      ficha: "celulas",  video: "" },
  { key: "musculo",   ficha: "celulas",  video: "" },
  { key: "huesos",    ficha: "celulas",  video: "" },
  { key: "sangre",    ficha: "celulas",  video: "" },
  { key: "grasa",     ficha: "celulas",  video: "" },
];

export const organoVida = (key: string) => ORGANOS_VIDA.find((o) => o.key === key);

// ── El test ────────────────────────────────────────────────────────────────
export interface OpcionTest {
  id: string;
  /** Órganos a los que suma esta respuesta. */
  organos: string[];
  /** true = «Ninguna»: se excluye con las demás. */
  ninguna?: boolean;
}
export interface PreguntaTest {
  id: "interes" | "molestias" | "curiosidad";
  /** Cuántas opciones se pueden marcar como máximo. */
  max: number;
  /** Puntos que suma cada opción marcada a sus órganos. */
  peso: number;
  opciones: OpcionTest[];
}

export const TEST_VIDA: PreguntaTest[] = [
  {
    id: "interes", max: 3, peso: 2,
    opciones: [
      { id: "detox",        organos: ["higado", "rinones", "piel", "bazo", "sangre"] },
      { id: "digestion",    organos: ["estomago", "higado", "vesicula", "pancreas", "intestino"] },
      { id: "pensamiento",  organos: ["cerebro"] },
      { id: "sentidos",     organos: ["ojos", "orejas", "nariz", "lengua"] },
      { id: "energia",      organos: ["musculo", "huesos", "corazon", "grasa"] },
      { id: "defensas",     organos: ["bazo", "sangre", "piel"] },
      { id: "circulacion",  organos: ["corazon", "sangre", "pulmones"] },
      { id: "hormonas",     organos: ["tiroides", "pancreas", "grasa"] },
    ],
  },
  {
    id: "molestias", max: 12, peso: 3,
    opciones: [
      { id: "dig",       organos: ["estomago", "intestino", "higado", "vesicula", "pancreas"] },
      { id: "cansancio", organos: ["tiroides", "sangre", "musculo", "corazon"] },
      { id: "mente",     organos: ["cerebro"] },
      { id: "piel",      organos: ["piel", "higado"] },
      { id: "vista",     organos: ["ojos"] },
      { id: "oidos",     organos: ["orejas"] },
      { id: "respira",   organos: ["pulmones", "nariz"] },
      { id: "dolor",     organos: ["musculo", "huesos"] },
      { id: "liquidos",  organos: ["rinones"] },
      { id: "defensas",  organos: ["bazo", "sangre"] },
      { id: "azucar",    organos: ["pancreas", "grasa", "tiroides"] },
      { id: "corazon",   organos: ["corazon"] },
      { id: "ninguna",   organos: [], ninguna: true },
    ],
  },
  {
    id: "curiosidad", max: 3, peso: 2,
    opciones: ["cerebro", "corazon", "ojos", "pulmones", "higado", "estomago", "piel", "musculo", "huesos", "sangre", "lengua", "orejas"]
      .map((k) => ({ id: k, organos: [k] })),
  },
];

/** Lo marcado en cada pregunta: id de pregunta → ids de opción. */
export type RespuestasVida = Record<string, string[]>;

// ── Del test al ranking ────────────────────────────────────────────────────
export type RankingVida = Record<CategoriaVida, string[]>;

export function puntuarOrganos(respuestas: RespuestasVida): Record<string, number> {
  const puntos: Record<string, number> = Object.fromEntries(ORGANOS_VIDA.map((o) => [o.key, 0]));
  for (const p of TEST_VIDA) {
    const marcadas = new Set(respuestas[p.id] ?? []);
    for (const op of p.opciones) {
      if (!marcadas.has(op.id)) continue;
      for (const k of op.organos) if (k in puntos) puntos[k] += p.peso;
    }
  }
  return puntos;
}

/** Reparte TODOS los órganos en las tres categorías.
 *  · Imprescindible: los que más puntúan (≥ 3 puntos), de 3 a 6.
 *  · Te puede interesar: los siguientes con algún punto, de 3 a 7.
 *  · El resto: no obligatorio, pero sí recomendable.
 *  Con empate manda el orden de ORGANOS_VIDA (de la cabeza a los pies). */
export function rankingVida(respuestas: RespuestasVida): RankingVida {
  const puntos = puntuarOrganos(respuestas);
  const orden = ORGANOS_VIDA.map((o, i) => ({ k: o.key, i, p: puntos[o.key] }))
    .sort((a, b) => b.p - a.p || a.i - b.i);
  const nImp = Math.min(6, Math.max(3, orden.filter((o) => o.p >= 3).length));
  const imp = orden.slice(0, nImp);
  const resto = orden.slice(nImp);
  const nInt = Math.min(7, Math.max(3, resto.filter((o) => o.p >= 1).length));
  return {
    imprescindible: imp.map((o) => o.k),
    interesa: resto.slice(0, nInt).map((o) => o.k),
    recomendable: resto.slice(nInt).map((o) => o.k),
  };
}

// ── Lo guardado en `metodo_fisiologia.data.vida` ───────────────────────────
export interface VidaGuardada {
  respuestas: RespuestasVida;
  ranking: RankingVida;
}

/** Lee el blob con cuidado: datos con forma antigua o rota no deben reventar el
 *  render. Devuelve null si el test aún no está hecho. */
export function leerVida(data: any): VidaGuardada | null {
  const v = data?.vida;
  if (!v || typeof v !== "object" || !v.ranking || typeof v.ranking !== "object") return null;
  const claves = new Set(ORGANOS_VIDA.map((o) => o.key));
  const lista = (x: unknown): string[] => (Array.isArray(x) ? x.map(String).filter((k) => claves.has(k)) : []);
  const ranking: RankingVida = {
    imprescindible: lista(v.ranking.imprescindible),
    interesa: lista(v.ranking.interesa),
    recomendable: lista(v.ranking.recomendable),
  };
  // Un órgano nuevo (añadido después de hacer el test) cae en «recomendable».
  const puestos = new Set(CATEGORIAS_VIDA.flatMap((c) => ranking[c]));
  for (const o of ORGANOS_VIDA) if (!puestos.has(o.key)) ranking.recomendable.push(o.key);
  const respuestas: RespuestasVida = {};
  if (v.respuestas && typeof v.respuestas === "object") {
    for (const [k, r] of Object.entries<any>(v.respuestas)) respuestas[k] = Array.isArray(r) ? r.map(String) : [];
  }
  if (CATEGORIAS_VIDA.every((c) => ranking[c].length === 0)) return null;
  return { respuestas, ranking };
}
