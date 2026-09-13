// ─────────────────────────────────────────────────────────────────────────
// EL PAR DE CONTROL · desequilibrios del ciclo Ke (paso 4 → paso 5)
//
// QUÉ ES ESTO
// El ciclo Ke (相剋 xiāng kè) es el control: cada elemento frena al que le toca
// —Madera a Tierra, Tierra a Agua, Agua a Fuego, Fuego a Metal, Metal a Madera—.
// Cuando ese freno se descompensa, la tradición distingue DOS mecanismos, y no
// son lo mismo:
//
//   · 相乘 xiāng chéng («agresión»): el control se pasa de fuerte, en la MISMA
//     dirección del ciclo. Ocurre porque el que controla está en exceso (太过)
//     o porque el controlado está deficiente (不及).
//
//   · 相侮 xiāng wǔ («contradominación» / rebelión): el control va al REVÉS.
//     Ocurre cuando el controlado está en exceso y se revuelve contra quien
//     debería frenarlo, o cuando ese está demasiado débil para frenarlo.
//
// Los dos están en el Su Wen (素問), capítulo 67 «五運行大論»: «氣有餘，則制己所勝
// 而侮所不勝；其不及，則己所不勝侮而乘之» — el qi que sobra domina a quien vence y
// se revuelve contra quien no puede vencer; el que falta es agredido.
//
// De esos cinco pares, dos tienen NOMBRE PROPIO en la nosología clásica y se
// citan aquí tal cual; los otros tres se describen por su mecanismo, sin
// inventarles una etiqueta que no existe:
//   · Madera→Tierra  →  肝脾不和 gān pí bù hé (desarmonía Hígado–Bazo).
//   · Agua→Fuego     →  心肾不交 xīn shèn bù jiāo (Corazón y Riñón no se comunican).
//
// POR QUÉ NO ES UN SEXTO CUESTIONARIO
// El QUÉ ya está medido: `diagnosticoElemento` da, por elemento, carga menos
// recursos. Un par descompensado es exactamente eso —uno empuja, el otro cede—,
// así que el par candidato y su dirección se DEDUCEN de lo ya respondido
// (`parCandidato`). Volver a preguntarlo serían cuarenta frases para llegar a un
// número que ya está en pantalla.
//
// Lo que los números NO pueden ver es el BALANCEO: «irritable y a la vez
// complaciente», «deseo de cercanía y de aislamiento a la vez». Alternar entre
// dos polos no es la media de los dos, y una puntuación por elemento lo borra.
// Por eso el test de aquí es CORTO y va solo de eso: seis frases de oscilación
// que confirman o descartan el par que los datos ya proponen.
//
// LO SOMÁTICO NO PUNTÚA, A PROPÓSITO
// Cada par trae además su lista de signos físicos. Se lee, no se responde: una
// lista de síntomas que puntúa y devuelve un veredicto es un autodiagnóstico, y
// esto no es eso. Decide lo psíquico; lo somático acompaña.
// ─────────────────────────────────────────────────────────────────────────
import {
  CICLO_KE,
  ORDEN_ELEMENTOS,
  UMBRAL_NETO,
  diagnosticoElemento,
  type DatosTcm,
  type Elemento,
} from "./tcmRecorrido";

/** Dirección del desequilibrio dentro de un par. */
export type SentidoKe = "cheng" | "wu";

/** Las seis frases de oscilación de un par. Se puntúan 0-4 en la escala de
 *  acuerdo, igual que el cuestionario 2 de cada elemento. */
export interface FraseOscilacion {
  /** Clave estable con la que se guarda («ke-madera-tierra-3»). */
  key: string;
  texto: string;
}

export interface ParKe {
  /** Quien controla en el ciclo Ke. */
  origen: Elemento;
  /** A quien controla. */
  destino: Elemento;
  /** «Hígado — Bazo»: los órganos del par, que es como lo nombra la tradición. */
  organos: string;
  /** Nombre clásico del patrón, si lo tiene. Vacío = no se le inventa uno. */
  patron?: { hanzi: string; pinyin: string; traduccion: string };
  /** Qué está pasando, en una línea, cuando el control se pasa de fuerte. */
  cheng: string;
  /** Qué está pasando cuando el controlado se revuelve. */
  wu: string;
  /** Las seis frases de oscilación (lo único que puntúa). */
  frases: FraseOscilacion[];
  /** Señales físicas que suelen acompañar. SOLO SE LEEN. */
  somaticos: string[];
}

// Las frases de oscilación y las listas de signos vienen del material de los
// cinco pares de control (patrones psíquicos y somáticos de cada relación Ke),
// pasados a primera persona y a la escala de acuerdo. Lo psíquico se reescribe
// como ALTERNANCIA —que es lo que describe el original y lo que el diagnóstico
// por elemento no puede ver—; lo somático se deja como lista de lectura.
export const PARES_KE: ParKe[] = [
  {
    origen: "madera",
    destino: "tierra",
    organos: "Hígado — Bazo",
    patron: { hanzi: "肝脾不和", pinyin: "gān pí bù hé", traduccion: "el Hígado y el Bazo no se armonizan" },
    cheng: "La Madera aprieta a la Tierra: el enfado y la tensión se comen la digestión y la estabilidad.",
    wu: "La Tierra se revuelve contra la Madera: la preocupación y la rumia acaban bloqueando el impulso.",
    frases: [
      { key: "ke-madera-tierra-1", texto: "Salto a la mínima y, poco después, cedo y acabo diciendo que sí." },
      { key: "ke-madera-tierra-2", texto: "Decido de golpe y enseguida dudo de lo que acabo de decidir." },
      { key: "ke-madera-tierra-3", texto: "Paso de rachas de muchísima actividad a quedarme sin fuerzas de un día para otro." },
      { key: "ke-madera-tierra-4", texto: "Me cuesta saber de qué humor voy a levantarme." },
      { key: "ke-madera-tierra-5", texto: "Quiero algo y a la vez lo contrario, y no consigo quedarme en una de las dos." },
      { key: "ke-madera-tierra-6", texto: "Cuando me enfado o me tenso, lo primero que se me resiente es el estómago." },
    ],
    somaticos: [
      "El apetito va y viene",
      "Digestiones pesadas",
      "Vas al baño de forma irregular",
      "Antojos que no sabrías nombrar",
      "Hinchazón o retortijones de estómago o intestino",
      "Dolor de cuerpo o de cabeza con sensación de presión",
      "Hinchazón y pesadez",
    ],
  },
  {
    origen: "tierra",
    destino: "agua",
    organos: "Bazo — Riñón",
    cheng: "La Tierra aprieta al Agua: el darle vueltas a todo consume la reserva y aparece el miedo.",
    wu: "El Agua se revuelve contra la Tierra: el miedo paraliza y deja sin sostén lo cotidiano.",
    frases: [
      { key: "ke-tierra-agua-1", texto: "Quiero gente cerca y a la vez quiero que me dejen en paz." },
      { key: "ke-tierra-agua-2", texto: "Unas veces lo comparto todo y otras me cuesta soltar hasta lo que no uso." },
      { key: "ke-tierra-agua-3", texto: "Me meto de lleno en algo y al poco necesito desaparecer." },
      { key: "ke-tierra-agua-4", texto: "Alterno temporadas de mucha actividad con otras en las que no arranco." },
      { key: "ke-tierra-agua-5", texto: "Me apunto a planes y luego busco la manera de no ir." },
      { key: "ke-tierra-agua-6", texto: "Según el día, necesito compañía o me sienta mal tener a alguien cerca." },
    ],
    somaticos: [
      "Músculos flojos",
      "Debilidad en la espalda baja, los tobillos o los pies",
      "Retención de líquidos en abdomen, caderas, piernas y tobillos",
      "Te cuesta bajar de peso",
      "Notas mucho la sequedad, la humedad y el frío",
    ],
  },
  {
    origen: "agua",
    destino: "fuego",
    organos: "Riñón — Corazón",
    patron: { hanzi: "心肾不交", pinyin: "xīn shèn bù jiāo", traduccion: "el Corazón y el Riñón no se comunican" },
    cheng: "El Agua apaga al Fuego: el miedo y el repliegue enfrían las ganas y el encuentro.",
    wu: "El Fuego se revuelve contra el Agua: la agitación se come el descanso y la reserva.",
    frases: [
      { key: "ke-agua-fuego-1", texto: "Busco cariño y cercanía y, al mismo tiempo, necesito estar a solas." },
      { key: "ke-agua-fuego-2", texto: "Paso de querer emoción y compañía a querer silencio y distancia." },
      { key: "ke-agua-fuego-3", texto: "Mi deseo sube y baja sin que yo sepa muy bien por qué." },
      { key: "ke-agua-fuego-4", texto: "Hay temporadas en que necesito dormir muchísimo y otras en que casi no duermo." },
      { key: "ke-agua-fuego-5", texto: "Me entrego mucho a alguien y luego me alejo de golpe." },
      { key: "ke-agua-fuego-6", texto: "Me cuesta estar tranquila y acompañada a la vez: o una cosa o la otra." },
    ],
    somaticos: [
      "A ratos orinas mucho y a ratos muy poco",
      "Unas temporadas necesitas dormir mucho y otras muy poco",
      "Se te hinchan manos y pies con el calor",
      "Te duelen con el frío",
    ],
  },
  {
    origen: "fuego",
    destino: "metal",
    organos: "Corazón — Pulmón",
    cheng: "El Fuego quema al Metal: la agitación y la ansiedad se llevan por delante la calma y el aire.",
    wu: "El Metal se revuelve contra el Fuego: la tristeza y el repliegue apagan las ganas.",
    frases: [
      { key: "ke-fuego-metal-1", texto: "Paso de estar animada y lanzada a estar apagada y encogida." },
      { key: "ke-fuego-metal-2", texto: "Unos días me nace todo solo y otros me cuesta hasta empezar." },
      { key: "ke-fuego-metal-3", texto: "Alterno estar nerviosa con estar melancólica." },
      { key: "ke-fuego-metal-4", texto: "Me abro mucho con alguien y después me cierro sin saber por qué." },
      { key: "ke-fuego-metal-5", texto: "Tengo momentos de mucha hambre o mucha sed y otros de nada." },
      { key: "ke-fuego-metal-6", texto: "Mi entusiasmo se enciende y se apaga muy rápido." },
    ],
    somaticos: [
      "Vas mucho al baño o, al revés, te estriñes",
      "Orinas mucho o muy poco",
      "Tos seca o irritación de nariz, senos o garganta, pero sin mucosidad",
      "Piel seca y aun así sudas con facilidad",
      "A ratos mucha hambre o mucha sed, sobre todo de cosas frías",
      "Te cuesta ganar peso",
    ],
  },
  {
    origen: "metal",
    destino: "madera",
    organos: "Pulmón — Hígado",
    cheng: "El Metal aprieta a la Madera: la contención y el duelo frenan el impulso y lo vuelven enfado.",
    wu: "La Madera se revuelve contra el Metal: la tensión se sube al pecho y corta la respiración.",
    frases: [
      { key: "ke-metal-madera-1", texto: "Unas veces digo lo que pienso sin filtro y otras me lo callo todo." },
      { key: "ke-metal-madera-2", texto: "Paso de estar sensible a estar a la defensiva." },
      { key: "ke-metal-madera-3", texto: "Me cambia el humor varias veces a lo largo del mismo día." },
      { key: "ke-metal-madera-4", texto: "A ratos reacciono a todo y a ratos no reacciono a nada." },
      { key: "ke-metal-madera-5", texto: "Alterno prudencia con impulsos de los que luego me arrepiento." },
      { key: "ke-metal-madera-6", texto: "Cuando me contengo, acabo de mal humor." },
    ],
    somaticos: [
      "Pitidos al respirar o el pecho apretado",
      "Tirantez o dolor en el diafragma y las costillas",
      "Intestino irritable o ritmo intestinal irregular",
      "Digestión lenta, sin movimiento",
      "Te cuesta tragar",
      "Estómago hinchado",
      "Estreñimiento",
      "Inflamación alérgica de senos, garganta, oídos o bronquios",
    ],
  },
];

/** El par que va de `origen` a `destino` en el ciclo Ke. */
export const parKe = (origen: Elemento): ParKe =>
  PARES_KE.find((p) => p.origen === origen)!;

// ─────────────────────────────────────────────────────────────────────────
// EL PAR CANDIDATO · se deduce de los cuestionarios ya respondidos
// ─────────────────────────────────────────────────────────────────────────

export interface Candidato {
  par: ParKe;
  /** «cheng»: el que controla empuja. «wu»: el controlado se revuelve. */
  sentido: SentidoKe;
  /** Cuánta distancia hay entre los dos lados del par, 0–1. */
  tension: number;
}

/** Por cuánto tienen que separarse los dos elementos de un par para que ese par
 *  destaque sobre los otros cuatro. El mismo umbral con el que un elemento deja
 *  de estar «en equilibrio»: si los cinco pares están por debajo, es que ninguna
 *  relación de control está tirando más que las demás, y eso se dice. */
export const UMBRAL_PAR = UMBRAL_NETO;

/**
 * El par de control más descompensado, o `null` si ninguno destaca.
 *
 * Para cada flecha del ciclo Ke se mira la distancia entre la carga neta de sus
 * dos elementos. El signo es lo que da el sentido, y es justo lo que dice el Su
 * Wen: si el que controla es el que está en carga, se está pasando de fuerte
 * (乘); si el que está en carga es el controlado, se está revolviendo (侮).
 */
export function parCandidato(data: DatosTcm | null | undefined): Candidato | null {
  let mejor: Candidato | null = null;

  for (const origen of ORDEN_ELEMENTOS) {
    const destino = CICLO_KE[origen];
    const a = diagnosticoElemento(origen, data?.elementos?.[origen]?.miniTest?.respuestas);
    const b = diagnosticoElemento(destino, data?.elementos?.[destino]?.miniTest?.respuestas);
    // Sin los dos elementos respondidos no hay par: no se rellena con ceros,
    // que daría por descompensado un par del que no se sabe nada.
    if (!a || !b) continue;

    const diff = a.posicion - b.posicion;
    const tension = Math.abs(diff);
    if (tension < UMBRAL_PAR) continue;
    if (mejor && tension <= mejor.tension) continue;

    mejor = { par: parKe(origen), sentido: diff > 0 ? "cheng" : "wu", tension };
  }

  return mejor;
}

// ─────────────────────────────────────────────────────────────────────────
// EL TEST DE CONFIRMACIÓN · seis frases, y sirve para decir que NO
// ─────────────────────────────────────────────────────────────────────────

/** Cuántas frases tiene el test (las mismas para todos los pares). */
export const FRASES_POR_PAR = 6;

/** A partir de aquí se confirma el balanceo: media de 2 sobre 4, que en la
 *  escala de acuerdo es el punto neutro. Por debajo, el par NO se confirma —y
 *  eso es un resultado, no un fallo: los números veían una diferencia entre dos
 *  elementos, pero no se vive como un vaivén. */
export const UMBRAL_CONFIRMA = 0.5;

export interface ResultadoPar {
  candidato: Candidato;
  /** Media de las seis frases, 0–1. `null` si no están todas respondidas. */
  intensidad: number | null;
  /** ¿Se confirma el balanceo? */
  confirmado: boolean;
  /** Cuántas frases lleva respondidas. */
  respondidas: number;
}

/** Lee la respuesta de una frase como 0-4, o `null` si no está respondida. */
const punto = (v: string | undefined): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const e = Math.round(n);
  return e >= 0 && e <= 4 ? e : null;
};

/** El resultado del test para el par candidato de estos datos. */
export function resultadoPar(data: DatosTcm | null | undefined): ResultadoPar | null {
  const candidato = parCandidato(data);
  if (!candidato) return null;

  const respuestas = data?.parKe?.respuestas;
  let suma = 0;
  let respondidas = 0;
  for (const f of candidato.par.frases) {
    const p = punto(respuestas?.[f.key]);
    if (p === null) continue;
    suma += p;
    respondidas += 1;
  }

  const completo = respondidas === candidato.par.frases.length;
  const intensidad = completo ? suma / (respondidas * 4) : null;
  return {
    candidato,
    intensidad,
    confirmado: intensidad !== null && intensidad >= UMBRAL_CONFIRMA,
    respondidas,
  };
}

/** ¿Ha terminado el test del par que le toca? (puerta del paso). */
export function testParHecho(data: DatosTcm | null | undefined): boolean {
  const r = resultadoPar(data);
  // Sin par candidato NO hay test que hacer, así que el paso no se bloquea.
  if (!r) return true;
  return r.intensidad !== null;
}
