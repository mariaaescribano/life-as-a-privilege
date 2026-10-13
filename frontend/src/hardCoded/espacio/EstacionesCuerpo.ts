// ─────────────────────────────────────────────────────────────────────────
// EL CUERPO · las estaciones del camino de la cabeza a los pies
// (/metodo/fisiologia/cuerpo). Sustituye a la rejilla de los 12 sistemas.
//
// Cada estación es una parte del cuerpo con:
//   · su VÍDEO de María como entrada (vertical, tipo reel),
//   · su página para profundizar (foto, claves, descripción, cómic),
//   · un mini-test «cómo te sientes» (preguntas 0–4) que puntúa esa parte.
// Las estaciones se hacen EN ORDEN (la siguiente se abre al hacer el test de la
// anterior). Al final, las que más puntúan son las que «más te hablan».
//
// ⚠️ BORRADOR: el contenido de ojos, orejas, nariz y lengua lo redactó Claude
//    como punto de partida para que María lo corrija. El resto de estaciones
//    está solo definido (nombre, tramo, sistema): `descripcion` y `test` vacíos
//    = «próximamente» y el camino se detiene ahí.
// ⚠️ No cambiar las `key` tras publicar: con ellas se guardan los resultados.
// ─────────────────────────────────────────────────────────────────────────
import type { Vineta } from "../../components/metodo/ComicViewer";

export type TramoKey = "cabeza" | "torax" | "abdomen" | "cuerpo";

/** Los tramos, de arriba abajo. El nombre visible sale del diccionario
 *  (`fisiologia.cuerpo.tramo.<key>`). */
export const TRAMOS: TramoKey[] = ["cabeza", "torax", "abdomen", "cuerpo"];

export type PreguntaEstacion = {
  texto: string;
  /** true = la pregunta mide un RECURSO (algo que cuida la parte): la respuesta
   *  se invierte al puntuar, para que «siempre» reste carga en vez de sumarla. */
  inversa?: boolean;
};

export type Estacion = {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  label: string;
  tramo: TramoKey;
  /** El sistema del cuerpo al que pertenece (clave de SISTEMAS). */
  sistema: string;
  /** Altura de esta parte en la silueta, en % desde arriba: hasta ahí se
   *  ilumina la silueta al completarla. Crece de una estación a la siguiente. */
  y: number;
  foto: string;
  /** Si `foto` aún no existe, se pinta esta. */
  fotoReserva?: string;
  /** Vídeo de María (vertical). Si el fichero aún no existe, se salta solo. */
  video: string;
  claves?: string[];
  descripcion: string;
  comic: Vineta[];
  test: PreguntaEstacion[];
};

const ORGANO = (k: string) => `/recorrido/fisiologia/organos/${k}.webp`;
const SISTEMA = (k: string) => `/recorrido/fisiologia/sistemas/${k}.webp`;
const VIDEO = (k: string) => `/videos/fisiologia/cuerpo/${k}.mp4`;

export const ESTACIONES: Estacion[] = [
  // ── CABEZA ─────────────────────────────────────────────────────────────
  {
    key: "ojos", label: "Ojos", tramo: "cabeza", sistema: "sensorial", y: 10,
    foto: SISTEMA("sensorial"), video: VIDEO("ojos"),
    claves: ["Convierten la luz en señales eléctricas", "Conos para el color, bastones para la penumbra", "Ver ocurre en el cerebro"],
    descripcion: "Los ojos convierten la luz en señales eléctricas. La luz atraviesa la córnea y el cristalino, que la enfoca sobre la retina, donde millones de fotorreceptores —los conos para el color y los bastones para la luz tenue— la transforman en impulsos que el nervio óptico lleva al cerebro. Lo que llamamos «ver» ocurre sobre todo allí, en la corteza visual, no en el ojo.",
    comic: [],
    test: [
      { texto: "Al acabar el día noto los ojos cansados, secos o con picor." },
      { texto: "Paso muchas horas seguidas mirando pantallas sin apartar la vista." },
      { texto: "Me molesta la luz intensa o me cuesta adaptarme a la penumbra." },
      { texto: "A lo largo del día miro a lo lejos y descanso la vista.", inversa: true },
    ],
  },
  {
    key: "orejas", label: "Orejas", tramo: "cabeza", sistema: "sensorial", y: 12,
    foto: SISTEMA("sensorial"), video: VIDEO("orejas"),
    claves: ["Convierten el sonido en señales nerviosas", "Sus células ciliadas no se regeneran", "También nos dan el equilibrio"],
    descripcion: "El oído capta ondas de sonido y las convierte en señales nerviosas. El tímpano vibra, tres huesecillos —los más pequeños del cuerpo— amplifican esa vibración y la cóclea, llena de líquido, la traduce con miles de células ciliadas que envían el mensaje al cerebro por el nervio auditivo. Además, el oído interno alberga el sistema vestibular, que nos da el equilibrio.",
    comic: [],
    test: [
      { texto: "Escucho música o vídeos con auriculares a volumen alto." },
      { texto: "Después de un lugar ruidoso noto zumbido o los oídos «tapados»." },
      { texto: "Me cuesta entender una conversación cuando hay ruido de fondo." },
      { texto: "Durante el día busco momentos de silencio.", inversa: true },
    ],
  },
  {
    key: "nariz", label: "Nariz", tramo: "cabeza", sistema: "sensorial", y: 13.5,
    foto: SISTEMA("sensorial"), video: VIDEO("nariz"),
    claves: ["Filtra, calienta y humedece el aire", "Su olfato conecta con memoria y emoción", "Unos 400 tipos de receptores de olor"],
    descripcion: "La nariz limpia, calienta y humedece el aire antes de que llegue a los pulmones. En lo alto de las fosas nasales, cientos de millones de neuronas olfativas detectan moléculas del aire, y su señal llega casi directa a las áreas del cerebro ligadas a la memoria y a la emoción: por eso un olor puede devolvernos de golpe a un lugar o a una persona.",
    comic: [],
    test: [
      { texto: "Respiro por la boca durante el día o mientras duermo." },
      { texto: "Tengo la nariz congestionada o con mocos con frecuencia." },
      { texto: "Noto los olores o los sabores menos que antes." },
      { texto: "Respiro por la nariz de forma consciente a lo largo del día.", inversa: true },
    ],
  },
  {
    key: "lengua", label: "Lengua", tramo: "cabeza", sistema: "sensorial", y: 15.5,
    foto: ORGANO("lengua"), video: VIDEO("lengua"),
    claves: ["Un músculo con papilas gustativas", "Cinco sabores; el olfato completa el resto", "Interviene al masticar, tragar y hablar"],
    descripcion: "La lengua es un músculo cubierto de papilas gustativas. Detecta los cinco sabores básicos —dulce, salado, ácido, amargo y umami— y envía esa información al cerebro, donde se mezcla con el olfato para crear lo que llamamos sabor. También interviene al masticar, tragar y hablar, y su superficie alberga una comunidad propia de microorganismos.",
    comic: [],
    test: [
      { texto: "Al despertar noto la lengua con una capa blanquecina." },
      { texto: "Noto la boca seca o con mal sabor con frecuencia." },
      { texto: "Siento los sabores menos intensos de lo habitual." },
      { texto: "Me limpio la lengua además de los dientes.", inversa: true },
    ],
  },
  {
    key: "cerebro", label: "Cerebro", tramo: "cabeza", sistema: "nervioso", y: 18,
    foto: ORGANO("cerebro"), video: VIDEO("cerebro"),
    descripcion: "", comic: [], test: [],
  },

  // ── TÓRAX ──────────────────────────────────────────────────────────────
  { key: "tiroides", label: "Tiroides", tramo: "torax", sistema: "endocrino", y: 22,
    foto: ORGANO("tiroides"), video: VIDEO("tiroides"), descripcion: "", comic: [], test: [] },
  { key: "corazon", label: "Corazón", tramo: "torax", sistema: "cardiovascular", y: 30,
    foto: ORGANO("corazon"), video: VIDEO("corazon"), descripcion: "", comic: [], test: [] },
  { key: "pulmones", label: "Pulmones", tramo: "torax", sistema: "respiratorio", y: 36,
    foto: ORGANO("pulmones"), video: VIDEO("pulmones"), descripcion: "", comic: [], test: [] },

  // ── ABDOMEN ────────────────────────────────────────────────────────────
  { key: "estomago", label: "Estómago", tramo: "abdomen", sistema: "digestivo", y: 40,
    foto: ORGANO("estomago"), video: VIDEO("estomago"), descripcion: "", comic: [], test: [] },
  { key: "higado", label: "Hígado", tramo: "abdomen", sistema: "digestivo", y: 43,
    foto: ORGANO("higado"), video: VIDEO("higado"), descripcion: "", comic: [], test: [] },
  { key: "pancreas", label: "Páncreas", tramo: "abdomen", sistema: "endocrino", y: 46,
    foto: ORGANO("pancreas"), video: VIDEO("pancreas"), descripcion: "", comic: [], test: [] },
  { key: "intestino", label: "Intestino", tramo: "abdomen", sistema: "digestivo", y: 53,
    foto: ORGANO("intestino"), video: VIDEO("intestino"), descripcion: "", comic: [], test: [] },
  { key: "rinones", label: "Riñones", tramo: "abdomen", sistema: "urinario", y: 58,
    foto: ORGANO("rinones"), video: VIDEO("rinones"), descripcion: "", comic: [], test: [] },

  // ── CUERPO ─────────────────────────────────────────────────────────────
  { key: "piel", label: "Piel", tramo: "cuerpo", sistema: "tegumentario", y: 72,
    foto: ORGANO("piel"), video: VIDEO("piel"), descripcion: "", comic: [], test: [] },
  { key: "musculos", label: "Músculos", tramo: "cuerpo", sistema: "muscular", y: 86,
    foto: ORGANO("musculo"), video: VIDEO("musculos"), descripcion: "", comic: [], test: [] },
  { key: "huesos", label: "Huesos", tramo: "cuerpo", sistema: "oseo", y: 100,
    foto: ORGANO("huesos"), video: VIDEO("huesos"), descripcion: "", comic: [], test: [] },
];

export const estacionPorKey = (key?: string) => ESTACIONES.find((e) => e.key === key);

/** ¿Esta estación ya tiene contenido (lectura + test) o es todavía «próximamente»? */
export const estacionLista = (e: Estacion) => e.test.length > 0 && e.descripcion.length > 0;

// ── Resultado de un test ───────────────────────────────────────────────────
export type NivelEstacion = "tranquilo" | "atencion" | "destaca";

export type ResultadoEstacion = {
  /** Las respuestas 0–4, en el orden de `test`. */
  respuestas: number[];
  /** 0–100: cuánta carga declara la persona en esa parte (los recursos restan). */
  puntos: number;
  nivel: NivelEstacion;
};

/** Cada respuesta es de 0 a 4. Las preguntas `inversa` miden un recurso, así
 *  que se dan la vuelta. Una parte «destaca» desde el 65 %, pide «atención»
 *  entre el 35 % y el 65 %. */
export function puntuarEstacion(e: Estacion, respuestas: number[]): ResultadoEstacion {
  const suma = e.test.reduce((acc, p, i) => {
    const v = Math.min(4, Math.max(0, Number(respuestas[i]) || 0));
    return acc + (p.inversa ? 4 - v : v);
  }, 0);
  const puntos = Math.round((suma / (4 * e.test.length)) * 100);
  const nivel: NivelEstacion = puntos >= 65 ? "destaca" : puntos >= 35 ? "atencion" : "tranquilo";
  return { respuestas, puntos, nivel };
}

// ── Lo guardado en `metodo_fisiologia.data.cuerpo` ─────────────────────────
export type CuerpoGuardado = {
  /** Claves de las estaciones con test hecho, en orden de hacerlas. */
  hechas: string[];
  resultados: Record<string, ResultadoEstacion>;
  /** Estaciones cuyo vídeo ya se vio (o se saltó): no se vuelve a abrir solo. */
  videos: string[];
};

/** Lee el blob con cuidado: datos con forma antigua o rota no deben reventar el render. */
export function leerCuerpo(data: any): CuerpoGuardado {
  const c = data?.cuerpo ?? {};
  const lista = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  const resultados: Record<string, ResultadoEstacion> = {};
  if (c.resultados && typeof c.resultados === "object") {
    for (const [k, r] of Object.entries<any>(c.resultados)) {
      if (r && typeof r.puntos === "number") {
        resultados[k] = {
          respuestas: Array.isArray(r.respuestas) ? r.respuestas.map(Number) : [],
          puntos: r.puntos,
          nivel: r.nivel === "destaca" || r.nivel === "atencion" ? r.nivel : "tranquilo",
        };
      }
    }
  }
  return { hechas: lista(c.hechas), resultados, videos: lista(c.videos) };
}

/** La estación en la que toca estar: la primera sin hacer (o null si están todas). */
export function estacionActual(c: CuerpoGuardado): Estacion | null {
  return ESTACIONES.find((e) => !c.hechas.includes(e.key)) ?? null;
}

/** ¿Se puede entrar en esta estación? Solo si la anterior ya está hecha. */
export function estacionAbierta(c: CuerpoGuardado, key: string): boolean {
  const i = ESTACIONES.findIndex((e) => e.key === key);
  if (i < 0) return false;
  return i === 0 || c.hechas.includes(ESTACIONES[i - 1].key);
}

/** Cuántas estaciones consecutivas, desde la primera, están hechas. */
export function estacionesHechasSeguidas(c: CuerpoGuardado): number {
  let n = 0;
  while (n < ESTACIONES.length && c.hechas.includes(ESTACIONES[n].key)) n++;
  return n;
}
