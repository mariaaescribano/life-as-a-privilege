// ─────────────────────────────────────────────────────────────────────────
// CONTENIDO · "Tu lengua" (diagnóstico de la lengua en Medicina China)
//
// La lengua se observa por CAPAS de información. Cada capa es una DIMENSIÓN con
// varias variantes; cada variante es una cajita ilustrada (foto de la lengua +
// nombre + qué sugiere). Es material PRÁCTICO: sirve para reconocer y observar,
// no para memorizar teoría.
//
// Se usa en dos páginas:
//   · MetodoTcmLengua      → muestra TODAS las dimensiones como cajitas (aprender a reconocer).
//   · MetodoTcmLenguaLeer  → el usuario elige la suya en las dimensiones `seleccionable`
//                            y recibe su lectura (se guarda en data.observarte).
//
// ✍️  EDITAR CONTENIDO: cambia nombre/lectura aquí. NO cambies las `key` (de
//     dimensión ni de opción) tras publicar: se guardan en metodo_tcm.data.observarte.
//
// 🖼️  ILUSTRACIONES: /public/recorrido/tcm/lengua/<src>.png (una por variante).
//     La página funciona aunque falten (marco vacío hasta que estén).
// ─────────────────────────────────────────────────────────────────────────

import type { Elemento } from "./tcmRecorrido";

/** Clave estable de cada dimensión (capa de observación de la lengua). */
export type LenguaDim = "color" | "forma" | "movimiento" | "saburra" | "humedad" | "puntos";

/** Patrón energético al que apunta un signo de la lengua. */
export type PatronLengua =
  | "calor" | "frio" | "def-yin" | "def-yang" | "def-qi" | "def-sangre" | "humedad" | "estasis";

export interface OpcionLengua {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Nombre visible de la variante ("Pálida", "Con marcas de dientes"…). */
  nombre: string;
  /** Ilustración de esta lengua (/public/recorrido/tcm/lengua/…). */
  src: string;
  /** Qué sugiere en Medicina China (lectura práctica). */
  lectura: string;
  /** true en la variante sana / de referencia de la dimensión. */
  equilibrio?: boolean;
  /** Patrones a los que apunta esta variante (para la síntesis final). */
  patrones?: PatronLengua[];
}

export interface DimensionLengua {
  dim: LenguaDim;
  titulo: string;         // "El color del cuerpo"
  subtitulo: string;      // qué refleja esa capa (una línea)
  /** Si true, aparece como selector en la herramienta "Lee tu lengua". */
  seleccionable?: boolean;
  opciones: OpcionLengua[];
}

const IMG = (n: string) => `/recorrido/tcm/lengua/${n}.png`;

export const LENGUA_DIMENSIONES: DimensionLengua[] = [
  // ── COLOR DEL CUERPO ──────────────────────────────────────────────────────
  {
    dim: "color",
    titulo: "El color del cuerpo",
    subtitulo: "Es lo más importante. Refleja la Sangre, el equilibrio Yin–Yang y los patrones de Calor y Frío.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Rosada", src: IMG("color-normal"), equilibrio: true,
        lectura: "Un rojo pálido uniforme (rosado): es el color fisiológico. La Sangre nutre bien y el Yin y el Yang están equilibrados." },
      { key: "palida", nombre: "Pálida", src: IMG("color-palida"), patrones: ["def-sangre", "def-yang"],
        lectura: "Deficiencia de Sangre (no llega suficiente para nutrirla) o de Yang (no hay calor para impulsarla). Si además está muy húmeda, apunta a deficiencia de Yang del riñón." },
      { key: "roja", nombre: "Roja", src: IMG("color-roja"), patrones: ["calor"],
        lectura: "Calor. Si conserva saburra, es Calor Pleno (por exceso); si no tiene saburra, es Calor por Vacío, originado por una deficiencia de Yin." },
      { key: "roja-oscura", nombre: "Rojo oscuro", src: IMG("color-rojo-oscuro"), patrones: ["calor"],
        lectura: "Un Calor más intenso: exceso importante de Calor, o un Calor por deficiencia de Yin ya muy avanzado. El Fuego es un grado de Calor más seco e intenso." },
      { key: "purpura", nombre: "Púrpura", src: IMG("color-purpura"), patrones: ["estasis"],
        lectura: "Estasis de Sangre: la circulación está bloqueada. Suele ser un proceso crónico. El tono puede ser muy sutil; cuanto más intenso, mayor el estancamiento." },
      { key: "azul-purpura", nombre: "Azul-púrpura", src: IMG("color-azul-purpura"), patrones: ["frio", "def-yang"],
        lectura: "Estancamiento producido por Frío: la Sangre y el Qi se ralentizan por falta de calor." },
    ],
  },

  // ── FORMA ─────────────────────────────────────────────────────────────────
  {
    dim: "forma",
    titulo: "La forma",
    subtitulo: "Habla de Plenitud (Lleno) o Deficiencia (Vacío). Su significado depende siempre del color.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Proporcionada", src: IMG("forma-normal"), equilibrio: true,
        lectura: "Ni fina ni hinchada, sin grietas ni marcas: buena sustancia y Qi que circula bien." },
      { key: "fina", nombre: "Fina", src: IMG("forma-fina"), patrones: ["def-sangre", "def-yin"],
        lectura: "Falta de sustancia: deficiencia de Sangre (si es pálida) o de Yin (si está pelada). Cuanto más fina, mayor la gravedad." },
      { key: "hinchada", nombre: "Hinchada", src: IMG("forma-hinchada"), patrones: ["humedad"],
        lectura: "Acumulación de Humedad o Flema. Aunque su origen pueda ser una deficiencia de Qi del bazo, la hinchazón es un patrón de exceso." },
      { key: "marcas", nombre: "Con marcas de dientes", src: IMG("forma-marcas"), patrones: ["def-qi"],
        lectura: "Deficiencia de Qi del bazo. Suele acompañarse de lengua pálida y saburra blanca y fina." },
      { key: "agrietada", nombre: "Agrietada", src: IMG("forma-agrietada"), patrones: ["def-yin"],
        lectura: "En general, deficiencia de Yin. La localización orienta: una grieta central hacia la punta se asocia al corazón (predisposición al estrés); las grietas laterales, a los pulmones." },
    ],
  },

  // ── MOVIMIENTO ──────────────────────────────────────────────────────────────
  {
    dim: "movimiento",
    titulo: "El movimiento",
    subtitulo: "Cómo se mueve la lengua al sacarla. Orienta hacia deficiencias o hacia Viento Interno.",
    opciones: [
      { key: "normal", nombre: "Estable", src: IMG("mov-normal"), equilibrio: true,
        lectura: "La lengua sale firme y centrada, sin temblor ni desviación." },
      { key: "temblorosa", nombre: "Temblorosa", src: IMG("mov-temblorosa"),
        lectura: "Temblor rápido y de poca amplitud: deficiencia de bazo y, en personas mayores, posible Viento Interno." },
      { key: "desviada", nombre: "Desviada", src: IMG("mov-desviada"),
        lectura: "Se desvía de la línea media: siempre indica Viento Interno. Frecuente tras un ictus; en persona sana, señal de alerta que merece valoración." },
      { key: "rigida", nombre: "Rígida", src: IMG("mov-rigida"),
        lectura: "Difícil de mover: se asocia a Viento Interno; puede verse en el ictus u otras alteraciones neurológicas importantes." },
    ],
  },

  // ── PUNTOS Y VENAS (junto al movimiento) ─────────────────────────────────────
  {
    dim: "puntos",
    titulo: "Puntos y venas",
    subtitulo: "Detalles finos: papilas alteradas en la superficie y las venas de debajo de la lengua.",
    opciones: [
      { key: "normal", nombre: "Sin puntos ni venas marcadas", src: IMG("puntos-normal"), equilibrio: true,
        lectura: "Superficie uniforme y venas sublinguales apenas visibles, ni dilatadas ni oscuras: lo normal." },
      { key: "puntos-rojos", nombre: "Puntos rojos", src: IMG("puntos-rojos"),
        lectura: "Papilas enrojecidas que sobresalen: siempre indican Calor. Su localización señala el órgano (p. ej., en el área del pecho, Calor tóxico en el pulmón o la mama)." },
      { key: "vesiculas", nombre: "Vesículas blancas", src: IMG("puntos-vesiculas"),
        lectura: "Papilas que sobresalen con color blanco: suelen indicar Humedad." },
      { key: "venas", nombre: "Venas sublinguales púrpuras", src: IMG("puntos-venas"),
        lectura: "Bajo la lengua, venas oscuras o dilatadas: estasis de Sangre en fase temprana. Puede aparecer antes de que el resto de la lengua se vuelva púrpura." },
    ],
  },

  // ── SABURRA (la capa lingual) ───────────────────────────────────────────────
  {
    dim: "saburra",
    titulo: "La saburra",
    subtitulo: "La capa que recubre la lengua. Refleja el Qi del estómago y la presencia de factores patógenos.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Blanca y fina", src: IMG("saburra-normal"), equilibrio: true,
        lectura: "Fina, blanca, con raíz y dejando ver el cuerpo por debajo: lo normal. El Qi del estómago es fuerte." },
      { key: "blanca-gruesa", nombre: "Blanca y gruesa", src: IMG("saburra-blanca-gruesa"), patrones: ["frio"],
        lectura: "Presencia de Frío (o un proceso externo). El grosor indica que hay un factor patógeno acumulado." },
      { key: "amarilla", nombre: "Amarilla", src: IMG("saburra-amarilla"), patrones: ["calor"],
        lectura: "Calor. Si es gruesa y seca, Calor por exceso; si es fina o casi no hay, Calor por deficiencia de Yin." },
      { key: "grasosa", nombre: "Grasosa o pegajosa", src: IMG("saburra-grasosa"), patrones: ["humedad"],
        lectura: "Humedad o Flema. Si además es viscosa o resbaladiza, apunta a Humedad-Calor." },
      { key: "seca", nombre: "Seca", src: IMG("saburra-seca"), patrones: ["calor", "def-yin"],
        lectura: "Calor que ha dañado los Fluidos Corporales, o un estado importante de sequedad." },
      { key: "gris-negra", nombre: "Gris o negra", src: IMG("saburra-gris-negra"),
        lectura: "Un patrón profundo o severo. Seca, se asocia a Calor extremo; húmeda o pegajosa, a Frío interno." },
      { key: "pelada", nombre: "Pelada o ausente", src: IMG("saburra-pelada"), patrones: ["def-yin"],
        lectura: "La lengua sin saburra (o la que ha perdido su raíz) indica deficiencia de Qi y/o Yin del estómago." },
    ],
  },

  // ── HUMEDAD ─────────────────────────────────────────────────────────────────
  {
    dim: "humedad",
    titulo: "La humedad",
    subtitulo: "Refleja los Fluidos Corporales y el equilibrio Yin–Yang. Lo sano es una humedad ligera y uniforme.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Húmeda ligera", src: IMG("humedad-normal"), equilibrio: true,
        lectura: "Humedad ligera y uniforme, ni seca ni mojada: los Fluidos Corporales son suficientes y están bien distribuidos." },
      { key: "seca", nombre: "Seca", src: IMG("humedad-seca"), patrones: ["calor", "def-yin"],
        lectura: "Calor o deficiencia de Yin: los Fluidos han disminuido y no mantienen la humedad normal." },
      { key: "muy-humeda", nombre: "Muy húmeda", src: IMG("humedad-muy-humeda"), patrones: ["frio", "def-yang"],
        lectura: "Frío o deficiencia de Yang: el organismo no transforma ni moviliza bien los líquidos y se acumulan." },
      { key: "lacada", nombre: "Brillante o «lacada»", src: IMG("humedad-lacada"), patrones: ["def-yin"],
        lectura: "Lisa y brillante como barnizada: colapso de Yin, un agotamiento profundo de los fluidos. Signo de gran importancia." },
    ],
  },
];

// ── Mapa de las zonas de la lengua (dónde aparece el cambio importa) ─────────
export interface ZonaLengua { key: string; zona: string; organos: string; }
export const LENGUA_ZONAS: ZonaLengua[] = [
  { key: "punta", zona: "La punta", organos: "corazón y pulmón" },
  { key: "centro", zona: "El centro", organos: "bazo y estómago" },
  { key: "lados", zona: "Los laterales", organos: "hígado y vesícula biliar" },
  { key: "raiz", zona: "La raíz (parte posterior)", organos: "riñón, vejiga e intestinos" },
  { key: "pecho", zona: "El área del pecho (entre punta y centro)", organos: "pulmón, corazón y mama (en mujeres)" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Dimensiones que el usuario elige en la herramienta "Lee tu lengua". */
export const DIMENSIONES_SELECCIONABLES = LENGUA_DIMENSIONES.filter((d) => d.seleccionable);

/** Clave con la que se guarda cada dimensión en data.observarte. */
export const lenguaObsKey = (dim: LenguaDim): string => `lengua-${dim}`;

/** Opción elegida por el usuario en una dimensión (o null si no ha elegido). */
export function opcionElegida(
  dim: LenguaDim,
  observarte: Partial<Record<string, string>> | undefined,
): OpcionLengua | null {
  const key = observarte?.[lenguaObsKey(dim)];
  if (!key) return null;
  const d = LENGUA_DIMENSIONES.find((x) => x.dim === dim);
  return d?.opciones.find((o) => o.key === key) ?? null;
}

/** ¿Ha elegido el usuario todas las dimensiones seleccionables de su lengua? */
export function lenguaCompleta(
  observarte: Partial<Record<string, string>> | undefined,
): boolean {
  return DIMENSIONES_SELECCIONABLES.every((d) => !!observarte?.[lenguaObsKey(d.dim)]);
}

// ─────────────────────────────────────────────────────────────────────────
// PATRONES · qué desequilibrio sugiere la lengua y cómo reequilibrarlo
// Cada patrón se asocia al elemento (órgano) que lo rige, para cerrar el
// círculo: la lengua → el patrón → el elemento a cuidar → cómo equilibrarlo.
// ─────────────────────────────────────────────────────────────────────────
export interface PatronInfo {
  nombre: string;
  /** Qué significa, en una línea. */
  senal: string;
  /** Elemento (órgano) al que apunta este patrón. */
  elemento: Elemento;
  /** Gestos concretos para reequilibrarlo. */
  comoEquilibrar: string[];
}

export const PATRONES: Record<PatronLengua, PatronInfo> = {
  calor: {
    nombre: "Calor",
    senal: "Hay calor en el cuerpo (exceso de Yang, o falta de Yin que ya no lo frena).",
    elemento: "fuego",
    comoEquilibrar: [
      "Alimentos frescos y ligeramente amargos: pepino, apio, hoja verde, cacao puro.",
      "Modera el picante, el alcohol, el café y los fritos, que suben el calor.",
      "Protege el sueño y baja la sobreestimulación (pantallas de noche).",
    ],
  },
  frio: {
    nombre: "Frío",
    senal: "Hay frío interno: la energía no calienta ni moviliza bien los líquidos.",
    elemento: "agua",
    comoEquilibrar: [
      "Comidas calientes y cocinadas: sopas, guisos, raíces.",
      "Especias que calientan: jengibre, canela y clavo.",
      "Evita crudos y bebidas frías; abriga la zona lumbar y los pies.",
    ],
  },
  "def-yin": {
    nombre: "Deficiencia de Yin",
    senal: "Faltan los fluidos que refrescan y nutren (Yin); el cuerpo se seca y se calienta por dentro.",
    elemento: "agua",
    comoEquilibrar: [
      "Descanso real y dormir pronto: el Yin se repone en la quietud.",
      "Alimentos que nutren el Yin: caldos, sésamo negro, semillas, algas, pera.",
      "Reduce estimulantes y el sobreesfuerzo crónico, que agotan las reservas.",
    ],
  },
  "def-yang": {
    nombre: "Deficiencia de Yang",
    senal: "Falta calor y empuje (Yang): cuesta entrar en calor y mover los líquidos.",
    elemento: "agua",
    comoEquilibrar: [
      "Alimentos calientes y cocinados; evita crudos y frío.",
      "Jengibre, canela y caldo de huesos para nutrir el Yang.",
      "Cuida el descanso y mantén el calor en la zona lumbar.",
    ],
  },
  "def-qi": {
    nombre: "Deficiencia de Qi del bazo",
    senal: "El bazo está flojo y no transforma bien el alimento en energía.",
    elemento: "tierra",
    comoEquilibrar: [
      "Comidas regulares, calientes y sin prisa; mastica bien.",
      "Reduce azúcar, crudos y lácteos, que debilitan el bazo.",
      "Evita rumiar en exceso; da estabilidad a tus rutinas.",
    ],
  },
  "def-sangre": {
    nombre: "Deficiencia de Sangre",
    senal: "No hay Sangre suficiente para nutrir; el cuerpo pierde color y sostén.",
    elemento: "madera",
    comoEquilibrar: [
      "Alimentos que nutren la Sangre: remolacha, hoja verde oscura, legumbres, dátiles.",
      "Duerme antes de medianoche (la Sangre se regenera en el hígado de 1 a 3 h).",
      "No agotes la vista ni te sobreexijas cuando andas bajo/a de energía.",
    ],
  },
  humedad: {
    nombre: "Humedad / Flema",
    senal: "Se acumulan líquidos y mucosidad que el cuerpo no moviliza bien.",
    elemento: "tierra",
    comoEquilibrar: [
      "Reduce lácteos, azúcar, harinas refinadas y fritos.",
      "Alimentos que secan la humedad: legumbres, cebada, calabaza, jengibre.",
      "Muévete a diario: la humedad se estanca con el sedentarismo.",
    ],
  },
  estasis: {
    nombre: "Estasis de Sangre",
    senal: "La Sangre circula con dificultad; suele venir de un estancamiento prolongado.",
    elemento: "madera",
    comoEquilibrar: [
      "Muévete y estira a diario para movilizar la Sangre y el Qi.",
      "Especias que mueven la Sangre: cúrcuma y jengibre.",
      "Expresa y libera la frustración en lugar de retenerla.",
    ],
  },
};

/** A partir de las elecciones del usuario, los patrones que sugiere su lengua,
 *  ordenados por cuántos signos apuntan a cada uno (más señales = más presente). */
export function patronesPredominantes(
  observarte: Partial<Record<string, string>> | undefined,
): { patron: PatronLengua; info: PatronInfo; veces: number }[] {
  const conteo = new Map<PatronLengua, number>();
  for (const d of DIMENSIONES_SELECCIONABLES) {
    const op = opcionElegida(d.dim, observarte);
    for (const p of op?.patrones ?? []) {
      conteo.set(p, (conteo.get(p) ?? 0) + 1);
    }
  }
  return [...conteo.entries()]
    .map(([patron, veces]) => ({ patron, info: PATRONES[patron], veces }))
    .sort((a, b) => b.veces - a.veces);
}
