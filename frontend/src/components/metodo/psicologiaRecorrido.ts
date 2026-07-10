// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · PSICOLOGÍA
//
// El recorrido se compone de "experiencias". La primera es «Línea de Vida»:
// reconstruir la propia historia como quien escribe un libro autobiográfico.
//
// Flujo de «Línea de Vida» (3 pantallas):
//   Pantalla 1 · El problema actual  → una pregunta + texto amplio
//   Pantalla 2 · La edad             → el usuario dice cuántos años tiene
//   Pantalla 3 · La línea de vida    → timeline interactiva año a año; cada año
//                                       abre una "página de libro" con preguntas
//                                       evocadoras. Hay que recorrer toda la vida
//                                       (cada año: Completado o Sin recuerdos).
//
// Persistencia (tabla `metodo_psicologia`, columna `data` JSONB):
//   data["problema-actual"] = string
//   data["edad"]            = number
//   data["anos"]           = { [edad:number]: { sinRecuerdos?: boolean,
//                                                respuestas?: { [key]: string } } }
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` tras
//     publicar (se perderían las respuestas guardadas con esa clave).
// ─────────────────────────────────────────────────────────────────────────

export interface Pregunta {
  /** Clave estable con la que se guarda la respuesta (no cambiar tras publicar). */
  key: string;
  pregunta: string;
  apoyo?: string;
  placeholder?: string;
}

export interface ExperienciaPsicologia {
  id: string;
  titulo: string;
  subtitulo: string;
  intro: string;
  /** Pantalla 1: el problema que el usuario quiere cambiar hoy. */
  problemaInicial: Pregunta;
  /** Pantalla 2: la edad, que genera la línea temporal. */
  preguntaEdad: Pregunta;
  /** Pantalla 3: preguntas evocadoras dentro de la página de cada año. */
  preguntasPorAno: Pregunta[];
}

const lineaDeVida: ExperienciaPsicologia = {
  id: "linea-de-vida",
  titulo: "Línea de Vida",
  subtitulo: "Tu historia, contada por ti",
  intro:
    "Antes de comprender la mente, hay que recordar la vida que la formó. Esta primera experiencia es para reconstruir tu historia: no como un cuestionario, sino como quien escribe las primeras páginas de su propio libro. Nadie más leerá esto. Es para ti.",

  problemaInicial: {
    key: "problema-actual",
    pregunta: "¿Qué problemas te acompañan hagas lo que hagas? ¿Qué se repite en tu vida?",
    apoyo: "",
    placeholder: "Empieza por aquí…",
  },

  preguntaEdad: {
    key: "edad",
    pregunta: "¿Cuántos años tienes?",
    apoyo: "Con tu edad dibujaremos tu línea de vida, desde que naciste hasta hoy.",
    placeholder: "Tu edad",
  },

  // Preguntas de la página de cada año. Breves y evocadoras, nunca clínicas.
  // Se muestran como una lista de cajas; cuantas más, más recuerdos podrá
  // recoger y luego marcar como huella. No cambies las `key` tras publicar.
  preguntasPorAno: [
    { key: "recuerdas", pregunta: "¿Qué recuerdas de este año?" },
    { key: "importante", pregunta: "¿Quién o qué fue importante para ti? ¿Pasó algo importante? (enfermedad, muerte, amistad…)" },
    { key: "gustaba", pregunta: "¿Qué te gustaba? ¿Cómo disfrutabas?" },
    { key: "experiencias", pregunta: "¿Recuerdas alguna experiencia?" },
    { key: "sentias", pregunta: "¿Cómo te sentías?" },
    { key: "cambio", pregunta: "¿Qué cambió?" },
    { key: "dejo", pregunta: "¿Qué dejó este año en ti?" },
    { key: "algo-mas", pregunta: "Algo más que quieras añadir…" },
  ],
};

export const EXPERIENCIAS: ExperienciaPsicologia[] = [lineaDeVida];

export const experienciaById = (id: string): ExperienciaPsicologia | undefined =>
  EXPERIENCIAS.find((e) => e.id === id);

// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · el orden canónico de todas las páginas.
//
// Fuente única de la verdad para el número de paso (X/total) y para el botón
// «Índice» (popup con todas las páginas, pulsables). Si reordenas/añades una
// página, cámbialo AQUÍ (y el número del header de esa página).
// ─────────────────────────────────────────────────────────────────────────
export interface PasoRecorrido {
  /** Número de paso (1-based). */
  n: number;
  /** Título visible en el índice. */
  titulo: string;
  /** Ruta a la que salta (recibe el id de la experiencia). */
  ruta: (expId: string) => string;
}

export const RECORRIDO_INDICE: PasoRecorrido[] = [
  { n: 1,  titulo: "Vuelve a ti",     ruta: () => "/metodo/psicologia" },
  { n: 2,  titulo: "Problemas",       ruta: (id) => `/metodo/psicologia/${id}/problema` },
  { n: 3,  titulo: "ACE",             ruta: (id) => `/metodo/psicologia/${id}/ace` },
  { n: 4,  titulo: "Resultado ACE",   ruta: (id) => `/metodo/psicologia/${id}/ace-resultado` },
  { n: 5,  titulo: "Línea de Vida",   ruta: (id) => `/metodo/psicologia/${id}` },
  { n: 6,  titulo: "Huellas",         ruta: (id) => `/metodo/psicologia/${id}/huellas` },
  { n: 7,  titulo: "Nudos",           ruta: (id) => `/metodo/psicologia/${id}/nudos` },
  { n: 8,  titulo: "Necesidades",     ruta: (id) => `/metodo/psicologia/${id}/necesidades` },
  { n: 9,  titulo: "Heridas",         ruta: (id) => `/metodo/psicologia/${id}/huellas-nudos` },
  { n: 10, titulo: "Tus heridas",     ruta: (id) => `/metodo/psicologia/${id}/heridas-lista` },
  { n: 11, titulo: "Narra",           ruta: (id) => `/metodo/psicologia/${id}/regulacion` },
  { n: 12, titulo: "Relación",        ruta: (id) => `/metodo/psicologia/${id}/integracion` },
  { n: 13, titulo: "Recuérdate",      ruta: (id) => `/metodo/psicologia/${id}/dones` },
  { n: 14, titulo: "Dones",           ruta: (id) => `/metodo/psicologia/${id}/dones-espejo` },
  { n: 15, titulo: "Miedos",          ruta: (id) => `/metodo/psicologia/${id}/miedos` },
  { n: 16, titulo: "Atrévete",        ruta: (id) => `/metodo/psicologia/${id}/miedos-preguntas` },
  { n: 17, titulo: "Integración",     ruta: (id) => `/metodo/psicologia/${id}/mapa` },
  { n: 18, titulo: "Compromiso",      ruta: (id) => `/metodo/psicologia/${id}/compromiso` },
  { n: 19, titulo: "Brújula",      ruta: (id) => `/metodo/psicologia/${id}/brujula` },
  { n: 20, titulo: "Síntesis",     ruta: (id) => `/metodo/psicologia/${id}/sintesis` },
];

/** Total de pasos del recorrido (para las etiquetas X/total). */
export const RECORRIDO_TOTAL = RECORRIDO_INDICE.length;

// ─────────────────────────────────────────────────────────────────────────
// La gestación · un nodo ANTES del año 0.
//
// La vida no empieza al nacer: empieza en el deseo (o no) de quien nos esperaba.
// Añadimos un nodo −1 al principio de la línea para que la persona cuente lo que
// sabe o le han contado del embarazo de su madre y de su llegada al mundo.
// Es OPCIONAL: no cuenta para el progreso ni bloquea el avance (por eso
// `lineaCompleta` y `aniosRecorridos` siguen recorriendo sólo 0..edad).
// ─────────────────────────────────────────────────────────────────────────
export const ANO_GESTACION = -1;

// Preguntas propias de la gestación: aquí no se recuerda, se cuenta lo que se
// sabe o se imagina. No cambies las `key` tras publicar.
export const PREGUNTAS_GESTACION: Pregunta[] = [
  { key: "deseado", pregunta: "¿Fuiste un embarazo buscado, deseado, inesperado…? ¿Qué te han contado?" },
  { key: "madre", pregunta: "¿Cómo vivió tu madre el embarazo? ¿Cómo estaba de ánimo y de salud?" },
  { key: "entorno", pregunta: "¿Qué pasaba alrededor? (la relación de tus padres, la familia, el momento que vivían…)" },
  { key: "nacimiento", pregunta: "¿Qué sabes de tu nacimiento? (cómo fue el parto, dónde, quién te esperaba…)" },
  { key: "recibimiento", pregunta: "¿Cómo te recibieron al llegar al mundo?" },
  { key: "algo-mas", pregunta: "Algo más que sepas o imagines de ese tiempo…" },
];

/** Preguntas de la página de un año: la gestación (−1) tiene las suyas. */
export const preguntasDeAno = (exp: ExperienciaPsicologia, edadAno: number): Pregunta[] =>
  edadAno === ANO_GESTACION ? PREGUNTAS_GESTACION : exp.preguntasPorAno;

// ─────────────────────────────────────────────────────────────────────────
// Tipos y helpers de datos / progreso
// ─────────────────────────────────────────────────────────────────────────

export interface AnoEstado {
  sinRecuerdos?: boolean;
  /** Respuestas por pregunta. Cada pregunta guarda una LISTA de ítems
   *  (recuerdos cortos). Se admite `string` heredado (datos antiguos). */
  respuestas?: Record<string, string[] | string>;
  /** Marca de huella POR AÑO (heredado). El nuevo modelo marca por ítem. */
  huella?: boolean;
  /** Ítems (textos) que el usuario marcó como «dejó huella» en Las Huellas. */
  huellas?: string[];
}

/** Todos los ítems escritos de un año, en orden de pregunta (lista plana). */
export function itemsDelAno(
  data: LineaDeVidaData,
  edadAno: number,
  preguntas: { key: string }[],
): string[] {
  const ano = data?.anos?.[String(edadAno)];
  if (!ano?.respuestas) return [];
  return preguntas
    .flatMap((p) => itemsDeRespuesta(ano.respuestas?.[p.key]))
    .map((x) => x.trim())
    .filter(Boolean);
}

/** ¿El usuario marcó este ítem (por texto) como que dejó huella? */
export const itemMarcado = (data: LineaDeVidaData, edadAno: number, texto: string): boolean =>
  (data?.anos?.[String(edadAno)]?.huellas || []).includes(texto);

/** Normaliza el valor de una respuesta a lista de ítems (acepta string heredado). */
export function itemsDeRespuesta(valor: unknown): string[] {
  if (Array.isArray(valor)) return valor.filter((x): x is string => typeof x === "string");
  if (typeof valor === "string" && valor.trim().length > 0) return [valor];
  return [];
}
export interface LineaDeVidaData {
  [key: string]: unknown;
  edad?: number;
  anos?: Record<string, AnoEstado>;
  /** «Los Nudos»: conflictos/patrones que el usuario reconoce hoy. Cada uno
   *  es un elemento independiente (se usará en la sesión de integración). */
  nudos?: string[];
  /** «La Integración»: constelaciones que el propio usuario compone, agrupando
   *  nudos y arquetipos de su carta astral. La frase la escribe siempre la
   *  persona. La plataforma NUNCA interpreta: sólo guarda lo que ella une. */
  constelaciones?: Constelacion[];
  /** «Heridas»: el usuario une huellas (recuerdos marcados) con nudos para
   *  reconocer de dónde nace cada nudo. La frase la escribe siempre la persona. */
  heridas?: RelacionHuellaNudo[];
  /** El usuario pulsó «Voy a ser valiente» (desbloquea la página de Problema). */
  valiente?: boolean;
  /** «Síntesis del Camino» (cierre): el capítulo que el usuario quiere empezar
   *  a escribir ahora. Mirada hacia adelante, no análisis del pasado. */
  proximoCapitulo?: string;
  /** «Las Necesidades del Niño»: para cada necesidad (por `key`), cómo siente el
   *  usuario que la vivió en su infancia. Material reflexivo previo a la línea
   *  de vida. */
  necesidades?: Record<string, EstadoNecesidad>;
  /** «Dones»: el reverso luminoso del recorrido. `respuestas` guarda las
   *  respuestas a las preguntas de la primera página (por `key`); `lista` son
   *  los dones que la propia persona reconoce en sí misma en la página espejo,
   *  a la luz de sus respuestas y de los arquetipos de su carta astral. */
  dones?: DonesData;
  /** «Regulación» (estimulación bilateral): un espacio de descarga. Guarda lo
   *  que la persona escribe mientras escucha el audio. NO es EMDR clínico:
   *  es un ejercicio autoguiado de regulación, con contención (lugar seguro
   *  antes, botón de parada, y cierre de grounding después). */
  regulacion?: RegulacionData;
  /** «Miedos»: los miedos más profundos que la persona reconoce hoy. Primero los
   *  nombra (página Miedos) y luego los enfrenta uno a uno respondiendo a unas
   *  preguntas (página «Enfrenta tus miedos»). Cada miedo guarda sus respuestas
   *  por `key` de pregunta. */
  miedos?: MiedoItem[];
  /** «ACE» (Experiencias Adversas en la Infancia): las 10 respuestas del test,
   *  por `key` de pregunta ("si" | "no"). La puntuación es el número de "si".
   *  No es un diagnóstico: es material de autoconocimiento (ver `AceData`). */
  ace?: AceData;
  /** «Compromiso» (cierre del recorrido): el compromiso concreto que la persona
   *  define consigo misma para empezar a vivir desde la integración y no desde
   *  la herida. Dos preguntas de texto libre (ver `CompromisoData`). */
  compromiso?: CompromisoData;
  /** «Tu brújula»: mensaje de la persona a su yo del futuro para los momentos de
   *  bloqueo. Cuatro preguntas guía (ver `BrujulaData`). */
  brujula?: BrujulaData;
}

/** «Compromiso»: lo que la persona escribe en el cierre del recorrido. */
export interface CompromisoData {
  /** ¿Qué necesitaste que nadie pudo darte? */
  necesitaste?: string;
  /** ¿Cómo puedes empezar a dártelo hoy? */
  dartelo?: string;
}

/** «Tu brújula» (después del compromiso): un mensaje libre de la persona a su yo
 *  del futuro, para cuando vuelva a sentirse bloqueada. Una guía práctica para no
 *  olvidar lo aprendido. */
export interface BrujulaData {
  /** Mensaje libre a su yo del futuro. */
  mensaje?: string;
  /** @deprecated Antiguas cuatro preguntas guía (herida/necesidad/miedo/don).
   *  Se conservan para leer recorridos guardados con el formato anterior. */
  herida?: string;
  /** @deprecated ver `mensaje`. */
  necesidad?: string;
  /** @deprecated ver `mensaje`. */
  miedo?: string;
  /** @deprecated ver `mensaje`. */
  don?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// «Relación» — el usuario compone CONSTELACIONES: agrupa uno o varios
// nudos (heridas) con uno o varios arquetipos de su carta y escribe, con sus
// propias palabras, la relación que encuentra. Estas relaciones son la materia
// prima de la página «Integración», donde transforma cada patrón en una nueva
// narrativa más sana.
// ─────────────────────────────────────────────────────────────────────────

/** Referencia a UNA faceta de un arquetipo de la carta astral:
 *  o bien «cuerpo en signo» (faceta "signo"), o bien «cuerpo en casa»
 *  (faceta "casa"). Cada faceta es una pieza independiente que el usuario
 *  puede arrastrar y relacionar por separado. */
export interface ArquetipoRef {
  /** Clave del cuerpo astral (sol, luna, saturno, ascendente…). */
  cuerpoKey: string;
  /** Qué faceta del cuerpo representa esta pieza. */
  faceta: "signo" | "casa";
  /** Signo zodiacal (presente cuando faceta = "signo"). */
  signo: string | null;
  /** Casa astrológica 1–12 (presente cuando faceta = "casa"). */
  casa: number | null;
}

export interface Constelacion {
  /** Identificador estable de la constelación. */
  id: string;
  /** Título que pone el usuario a esta relación. */
  titulo: string;
  /** Nudos agrupados (texto, tal cual los escribió en Los Nudos). */
  nudos: string[];
  /** Arquetipos agrupados. */
  arquetipos: ArquetipoRef[];
  /** La frase que escribe el usuario: su propia comprensión de la relación. */
  texto: string;

  // ── «Integración» (página posterior) — el usuario transforma cada relación
  //    en una nueva narrativa. Cuatro bloques de texto libre por relación. ──
  /** ¿Qué intentaba proteger este patrón? (intención positiva). */
  proteger?: string;
  /** ¿Qué coste tiene mantener este patrón? (consecuencias actuales). */
  coste?: string;
  /** ¿Qué verdad más sana quieres practicar? — el núcleo: la Integración. */
  verdadSana?: string;
  /** Frase breve de apoyo para cuando vuelva a caer en el patrón. */
  recordatorio?: string;
  /** «Síntesis del Camino»: la esencia que el usuario decide llevarse de esta
   *  relación (p. ej. «Autoaceptación», «Confianza»). */
  aprendizaje?: string;
  /** «Síntesis del Camino»: el nuevo patrón que el usuario quiere vivir a partir
   *  de ahora en esta relación. */
  nuevoPatron?: string;
}

/** Clave estable de una faceta de arquetipo (para comparar y deduplicar). */
export const arquetipoKey = (a: { cuerpoKey: string; faceta: string }): string =>
  `${a.cuerpoKey}-${a.faceta}`;

/** Etiqueta visible de una herida (la misma con la que se guarda en las
 *  relaciones: el campo `nudos` de la constelación reutiliza estas etiquetas). */
export const heridaLabel = (h: { titulo?: string }): string =>
  (h.titulo || "").trim() || "Herida sin título";

/** Busca la herida (RelacionHuellaNudo) cuyo título coincide con una etiqueta
 *  guardada en una relación. Sirve para reconstruir la cadena completa en la
 *  Síntesis del Camino (etiqueta → nudos y huellas que la formaron). */
export const heridaByLabel = (data: LineaDeVidaData, label: string): RelacionHuellaNudo | undefined =>
  (data?.heridas || []).find((h) => heridaLabel(h) === label);

/** «Síntesis del Camino» — esencias sugeridas para la columna Aprendizaje.
 *  No son objetivos: es lo que la persona decide llevarse. */
export const APRENDIZAJES_SUGERIDOS = [
  "Autoaceptación",
  "Confianza",
  "Autenticidad",
  "Valentía",
  "Amor propio",
  "Libertad",
  "Presencia",
  "Paciencia",
];

/** «Heridas»: el usuario agrupa huellas (experiencias) con nudos (creencias que
 *  dejaron) para reconocer de dónde nace cada herida. Cada herida es un box con
 *  su título, descripción y las piezas seleccionadas. */
export interface RelacionHuellaNudo {
  /** Identificador estable. */
  id: string;
  /** Título que pone el usuario a esta herida. */
  titulo: string;
  /** Huellas (recuerdos marcados) agrupadas. */
  huellas: string[];
  /** Nudos agrupados. */
  nudos: string[];
  /** Necesidades no cubiertas agrupadas (etiquetas de `NECESIDADES`). */
  necesidades?: string[];
  /** Descripción libre: lo que la persona reconoce. */
  texto: string;
}

/** «Necesidades no cubiertas»: las que la persona marcó como que le faltaron o
 *  las vivió solo a veces (no plenamente recibidas). Son la tercera pieza de la
 *  herida: Huella + Nudo + Necesidad no cubierta = Herida. Devuelve etiquetas. */
export function necesidadesNoCubiertas(data: LineaDeVidaData): string[] {
  const m = data?.necesidades || {};
  return NECESIDADES
    .filter((n) => m[n.key] === "falto" || m[n.key] === "a-veces")
    .map((n) => n.necesidad);
}

// ── «Heridas» (listado) — textos editables ──
export const HERIDAS_LISTA = {
  titulo: "Tus heridas",
  frase:
    "Esto es lo que llevas dentro y tratabas de ocultarte. Ya no tienes que seguir fingiendo.",
};

// ── «Los Nudos» — textos editables ──
export const NUDOS = {
  titulo: "Nudos",
  intro: [] as string[],
  apoyo:
    "Un nudo puede ser un miedo, una herida, una creencia, un conflicto repetido o una dificultad que parece acompañarte desde hace años. No busques explicaciones perfectas. Simplemente observa aquello que sientes presente en tu vida hoy.",
  pregunta: "¿Qué conflictos o nudos hay en tu Vida?",
  ejemplos: [
    "Miedo al abandono",
    "Necesidad de aprobación",
    "Dificultad para confiar",
    "Perfeccionismo",
    "Exceso de control",
    "Miedo al rechazo",
    "Sentirme insuficiente",
    "Dificultad para poner límites",
    "Dependencia emocional",
    "Miedo al conflicto",
  ],
};

// ── «La Integración» — textos editables ──
export const INTEGRACION = {
  titulo: "Integración",
  principal: [
    "Has recorrido tu historia.",
    "Has identificado las experiencias que dejaron huella.",
    "Has comenzado a reconocer los nudos que siguen presentes en tu vida.",
    "Ahora llega el momento de unir las piezas.",
  ],
  secundario: [
    "A veces vemos nuestras experiencias por separado. Pero cuando observamos la historia completa, empiezan a aparecer conexiones que antes pasaban desapercibidas.",
    "En esta sesión exploraremos juntos la relación entre tu historia personal, tus patrones psicológicos y los arquetipos presentes en tu carta astral.",
  ],
  exploraremos: [
    "Los nudos que aparecen en tu vida actual.",
    "Las experiencias que contribuyeron a formarlos.",
    "La forma en que esos patrones siguen repitiéndose hoy.",
    "Los mecanismos psicológicos que los mantienen activos.",
    "Los arquetipos astrológicos relacionados con esos procesos.",
    "El propósito evolutivo que pueden estar señalando.",
    "Posibles caminos de integración y transformación.",
  ],
  cierre: [
    "No se trata únicamente de comprender lo que te ocurrió.",
    "Se trata de comprender quién te has visto obligado a ser a partir de esas experiencias.",
    "Y descubrir quién podrías llegar a ser cuando esos nudos comienzan a deshacerse.",
  ],
  boton: "Reservar Sesión de Integración",
  // 💶 Precio de la sesión de integración (ajústalo al valor real).
  precio: 60,
  duracionMin: 60,
};

// ─────────────────────────────────────────────────────────────────────────
// «Las Necesidades del Niño» — material reflexivo previo a la Línea de Vida.
//
// Un grid de celdas: cada necesidad de la infancia junto a la respuesta sana
// que un cuidador ofrece. El usuario abre cada celda y marca cómo lo vivió.
// Lo marcado se guarda en `data.necesidades[key]` y reestiliza la celda.
//
// ✍️  No cambies las `key` tras publicar (se perderían las respuestas).
// ─────────────────────────────────────────────────────────────────────────

/** Cómo siente el usuario que vivió una necesidad en su infancia. */
export type EstadoNecesidad = "recibida" | "a-veces" | "falto";

export interface Necesidad {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Necesidad del niño (título corto de la celda). */
  necesidad: string;
  /** Respuesta adecuada de los progenitores (se revela en el popup). */
  respuesta: string;
}

export const NECESIDADES_INTRO = {
  titulo: "Necesidades no cubiertas",
  subtitulo: "¿Qué necesitabas y no recibiste?",
  texto:
    "Ya has recordado tu historia y nombrado tus nudos. Detente ahora en lo que un niño necesita para crecer sano: abre cada necesidad y, sin juzgar a nadie, marca cómo lo viviste tú. No hay respuestas correctas: solo tu verdad.",
};

export const NECESIDADES: Necesidad[] = [
  { key: "seguridad-fisica",            necesidad: "Seguridad física",                 respuesta: "Protegen al niño de peligros, supervisan, cubren alimentación, higiene, descanso y salud." },
  { key: "seguridad-emocional",         necesidad: "Seguridad emocional",              respuesta: "Consuelan cuando tiene miedo, tristeza o frustración. Le hacen sentir que no está solo." },
  { key: "apego-vinculo",               necesidad: "Apego y vínculo afectivo",         respuesta: "Muestran cariño físico y verbal, disponibilidad emocional y cercanía." },
  { key: "amado-valorado",              necesidad: "Sentirse amado y valorado",        respuesta: "Expresan afecto incondicional, reconocen su importancia como persona." },
  { key: "atencion-presencia",          necesidad: "Atención y presencia",             respuesta: "Escuchan activamente, dedican tiempo exclusivo y muestran interés genuino." },
  { key: "comprension-emocional",       necesidad: "Comprensión emocional",            respuesta: "Ayudan a identificar y nombrar emociones sin ridiculizarlas." },
  { key: "validacion-emocional",        necesidad: "Validación emocional",             respuesta: "Aceptan sus emociones aunque corrijan conductas inapropiadas." },
  { key: "estructura-limites",          necesidad: "Estructura y límites",             respuesta: "Establecen normas claras, coherentes y predecibles." },
  { key: "orientacion-ensenanza",       necesidad: "Orientación y enseñanza",          respuesta: "Explican consecuencias, enseñan habilidades y sirven de modelo." },
  { key: "autonomia",                   necesidad: "Autonomía",                        respuesta: "Permiten tomar decisiones acordes a la edad y fomentan la iniciativa." },
  { key: "competencia-autoestima",      necesidad: "Competencia y autoestima",         respuesta: "Reconocen esfuerzos, favorecen experiencias de éxito y aprendizaje." },
  { key: "juego-exploracion",           necesidad: "Juego y exploración",              respuesta: "Facilitan oportunidades para jugar, descubrir y experimentar." },
  { key: "participacion",               necesidad: "Participación",                    respuesta: "Escuchan su opinión y la consideran en decisiones apropiadas para su edad." },
  { key: "proteccion-violencia",        necesidad: "Protección frente a la violencia", respuesta: "Evitan humillaciones, amenazas, agresiones físicas o psicológicas." },
  { key: "estabilidad-predictibilidad", necesidad: "Estabilidad y predictibilidad",    respuesta: "Mantienen rutinas y respuestas relativamente consistentes." },
  { key: "apoyo-dificultades",          necesidad: "Apoyo en dificultades",            respuesta: "Ayudan cuando fracasa, se equivoca o atraviesa problemas." },
  { key: "pertenencia-familiar",        necesidad: "Pertenencia familiar",             respuesta: "Favorecen que se sienta miembro importante de la familia." },
  { key: "desarrollo-social",           necesidad: "Desarrollo social",                respuesta: "Enseñan empatía, cooperación y habilidades para relacionarse." },
];

export const necesidadByKey = (key: string): Necesidad | undefined =>
  NECESIDADES.find((n) => n.key === key);

/** Las tres respuestas posibles, con su etiqueta y color (sobre acuarela). */
export interface OpcionNecesidad {
  value: EstadoNecesidad;
  label: string;
  /** Color de borde/glow con el que se reestiliza la celda al elegirla. */
  color: string;
  descripcion: string;
}

export const ESTADOS_NECESIDAD: OpcionNecesidad[] = [
  { value: "recibida", label: "La recibí", color: "#3f9d6b", descripcion: "Sentí cubierta esta necesidad." },
  { value: "a-veces",  label: "A veces",   color: "#caa23c", descripcion: "A veces sí, a veces no." },
  { value: "falto",    label: "Me faltó",  color: "#c5613e", descripcion: "Sentí que me faltó." },
];

export const opcionNecesidad = (value?: EstadoNecesidad): OpcionNecesidad | undefined =>
  ESTADOS_NECESIDAD.find((o) => o.value === value);

/** Cuántas necesidades ha marcado ya el usuario (para la barra de progreso). */
export const necesidadesRespondidas = (data: LineaDeVidaData): number =>
  NECESIDADES.filter((n) => !!data?.necesidades?.[n.key]).length;

export type EstadoAno = "vacio" | "completado" | "sin-recuerdos";

/** Lee el estado de un año (uno de los tres estados visuales). */
export function estadoDelAno(data: LineaDeVidaData, edadAno: number): EstadoAno {
  const ano = data?.anos?.[String(edadAno)];
  if (!ano) return "vacio";
  const escrito = Object.values(ano.respuestas || {}).some(
    (v) => itemsDeRespuesta(v).some((x) => x.trim().length > 0),
  );
  if (escrito) return "completado";
  if (ano.sinRecuerdos) return "sin-recuerdos";
  return "vacio";
}

/** Un año cuenta como "recorrido" si está completado o marcado sin recuerdos. */
export const anoRecorrido = (data: LineaDeVidaData, edadAno: number): boolean =>
  estadoDelAno(data, edadAno) !== "vacio";

/** ¿Se ha recorrido la vida entera (todos los años 0..edad)? */
export function lineaCompleta(data: LineaDeVidaData, edad: number): boolean {
  if (!edad || edad < 0) return false;
  for (let a = 0; a <= edad; a++) {
    if (!anoRecorrido(data, a)) return false;
  }
  return true;
}

/** Número de años recorridos (para barras de progreso). */
export function aniosRecorridos(data: LineaDeVidaData, edad: number): number {
  let n = 0;
  for (let a = 0; a <= edad; a++) if (anoRecorrido(data, a)) n++;
  return n;
}

/** Año natural de una edad concreta: nacimiento + edad. */
export function anoNatural(edad: number, edadAno: number, anioActual: number): number {
  return anioActual - edad + edadAno;
}

// ─────────────────────────────────────────────────────────────────────────
// «Las Huellas» — relectura del libro tras completar la línea de vida.
// ─────────────────────────────────────────────────────────────────────────

export interface EtapaVital {
  id: string;
  nombre: string;
  min: number;
  max: number;
}

// Capítulos naturales para agrupar los recuerdos al releer el libro.
export const ETAPAS_VITALES: EtapaVital[] = [
  { id: "primera-infancia", nombre: "Primera infancia", min: 0, max: 6 },
  { id: "infancia", nombre: "Infancia", min: 7, max: 12 },
  { id: "adolescencia", nombre: "Adolescencia", min: 13, max: 18 },
  { id: "juventud", nombre: "Juventud", min: 19, max: 25 },
  { id: "adultez-temprana", nombre: "Adultez temprana", min: 26, max: 35 },
  { id: "adultez", nombre: "Adultez", min: 36, max: 200 },
];

export const etapaDeEdad = (edadAno: number): EtapaVital | undefined =>
  ETAPAS_VITALES.find((e) => edadAno >= e.min && edadAno <= e.max);

/** Texto del recuerdo de un año: sus respuestas no vacías, en orden. */
export function recuerdoDeAno(
  data: LineaDeVidaData,
  edadAno: number,
  preguntas: { key: string }[],
): string {
  const ano = data?.anos?.[String(edadAno)];
  if (!ano?.respuestas) return "";
  return preguntas
    .flatMap((p) => itemsDeRespuesta(ano.respuestas?.[p.key]))
    .map((x) => x.trim())
    .filter(Boolean)
    .join("\n");
}

/** ¿Este año tiene un recuerdo escrito (es página del libro de Huellas)? */
export const tieneRecuerdo = (data: LineaDeVidaData, edadAno: number): boolean =>
  estadoDelAno(data, edadAno) === "completado";

/** Lista ordenada de edades con recuerdo escrito (las páginas del libro). */
export function aniosConRecuerdo(data: LineaDeVidaData, edad: number): number[] {
  const out: number[] = [];
  for (let a = 0; a <= edad; a++) if (tieneRecuerdo(data, a)) out.push(a);
  return out;
}

export const huellaMarcada = (data: LineaDeVidaData, edadAno: number): boolean =>
  !!data?.anos?.[String(edadAno)]?.huella;

/** Tramos de la timeline: el primero es la gestación (−1) + años 0–4 (6 nodos
 *  como mucho), y a partir de ahí de 5 en 5. */
export function tramosDeAnios(edad: number): number[][] {
  const tramos: number[][] = [];
  // Primer tramo: la gestación abre la línea, luego los primeros años.
  const primero: number[] = [ANO_GESTACION];
  for (let a = 0; a <= Math.min(4, edad); a++) primero.push(a);
  tramos.push(primero);
  let inicio = 5;
  while (inicio <= edad) {
    const fin = inicio + 4;
    const tramo: number[] = [];
    for (let a = inicio; a <= Math.min(fin, edad); a++) tramo.push(a);
    tramos.push(tramo);
    inicio = fin + 1;
  }
  return tramos;
}

// ─────────────────────────────────────────────────────────────────────────
// «Dones» — el reverso luminoso del recorrido.
//
// Dos páginas:
//   Página 1 (preguntas) · el usuario mira hacia dentro y responde, sin ver
//     todavía ningún resultado. Sembrar.
//   Página 2 (espejo)    · le devolvemos sus propias respuestas junto a los
//     arquetipos de su carta astral, y él reconoce y escribe sus dones. Cosechar.
//
// Persistencia: data.dones = { respuestas: { [key]: string }, lista: string[] }.
//
// ✍️  No cambies las `key` tras publicar (se perderían las respuestas guardadas).
// ─────────────────────────────────────────────────────────────────────────

export interface DonesData {
  /** Respuestas de la primera página, por clave de pregunta. */
  respuestas?: Record<string, string>;
  /** Preguntas que la persona marcó como «sin ideas» (resueltas sin texto).
   *  Cuentan como completadas para poder pasar al espejo, pero no aparecen
   *  como respuesta en él. */
  sinIdeas?: string[];
  /** Los dones que la persona reconoce en sí misma. Cada don es un texto que
   *  ella escribe, al que puede UNIR uno o varios arquetipos de su carta astral
   *  (igual que en «Relación» se unen heridas y arquetipos). */
  lista?: DonReconocido[];
}

/** Un don reconocido: el texto que escribe la persona + los arquetipos de su
 *  carta que decide unirle. La plataforma no interpreta: solo guarda la unión. */
export interface DonReconocido {
  /** Identificador estable. */
  id: string;
  /** El don, con las palabras de la persona (p. ej. «Escucha», «Intuición»). */
  texto: string;
  /** Arquetipos de la carta astral que la persona une a este don. */
  arquetipos: ArquetipoRef[];
  /** Recuerdos («Lo que recordaste de ti») que la persona une a este don. */
  recuerdos?: string[];
}

export interface PreguntaDon {
  /** Clave estable con la que se guarda la respuesta (no cambiar tras publicar). */
  key: string;
  pregunta: string;
}

export const DONES_INTRO = {
  titulo: "Tus dones",
  // Página de preguntas: quitar presión. No se pide «enumera tus virtudes»,
  // se destila el don a través de preguntas que miran de lado.
  preguntas:
    "Un don no es lo que aprendiste con esfuerzo: es lo que se te da con naturalidad, eso que los demás valoran en ti aunque tú no le des importancia. No busques la respuesta perfecta. Responde despacio, con sinceridad. Nadie más leerá esto.",
  // Página espejo: lo que va a ver.
  espejo:
    "Relaciona lo que recordaste de ti con tus arquetipos. Encuentra así tus fortalezas. No te olvides de lo que ya eres y de todo de lo que ya eres capaz.",
};

// Las 15 preguntas que destilan el don. Abiertas: el usuario escribe.
export const DONES_PREGUNTAS: PreguntaDon[] = [
  { key: "don-actividad-horas",    pregunta: "¿Qué actividad podrías hacer durante horas sin aburrirte?" },
  { key: "don-problemas-ayuda",    pregunta: "¿Qué tipo de problemas suelen pedirte que ayudes a resolver?" },
  { key: "don-nino-facil",         pregunta: "¿Qué se te daba bien de niño o adolescente, incluso sin mucho esfuerzo?" },
  { key: "don-en-tu-elemento",     pregunta: "¿Cuándo sientes que estás «en tu elemento»?" },
  { key: "don-elogios",            pregunta: "¿Qué elogios recibes con más frecuencia?" },
  { key: "don-aprendes-rapido",    pregunta: "¿Qué cosas aprendes más rápido que la mayoría de las personas?" },
  { key: "don-curiosidad",         pregunta: "¿Qué temas te despiertan curiosidad de forma constante?" },
  { key: "don-sin-dinero",         pregunta: "Si el dinero no fuera un problema, ¿cómo ocuparías tus días?" },
  { key: "don-energia",            pregunta: "¿Qué situaciones te llenan de energía y cuáles te la quitan?" },
  { key: "don-proposito",          pregunta: "¿Qué causa o propósito te mueve profundamente?" },
  { key: "don-habilidades-dificil", pregunta: "¿Qué habilidades has desarrollado gracias a experiencias difíciles?" },
  { key: "don-compania",           pregunta: "¿Qué tipo de personas disfrutan más de tu compañía y por qué?" },
  { key: "don-facil-para-ti",      pregunta: "¿Qué haces que parece fácil para ti, pero otros encuentran complicado?" },
  { key: "don-mas-orgulloso",      pregunta: "¿Cuál ha sido el momento de tu vida en el que te has sentido más orgulloso de ti mismo?" },
  { key: "don-huella-mundo",       pregunta: "Si pudieras dejar una huella en el mundo, ¿qué te gustaría que la gente recordara de ti?" },
];

/** Cuántas preguntas de Dones ha respondido ya el usuario (para la barra). */
export const donesRespondidas = (data: LineaDeVidaData): number =>
  DONES_PREGUNTAS.filter((p) => ((data?.dones?.respuestas?.[p.key] || "").trim().length > 0)).length;

// ─────────────────────────────────────────────────────────────────────────
// «Regulación» — estimulación bilateral + escritura de descarga.
//
// IMPORTANTE: esto NO es EMDR clínico ni terapia. Es un ejercicio autoguiado
// de regulación del sistema nervioso, con contención por diseño:
//   · Preparación (lugar seguro) y una regla clara: trabajar con UNA cosa.
//   · Un botón de parada siempre visible.
//   · Un cierre de grounding (respiración + 5-4-3-2-1) para no quedar en carne viva.
//
// Ruta del audio: la persona lo escucha con auriculares (paneo L↔R). El archivo
// vive en /audio/estimulacion-bilateral.mp3 (carpeta public).
//
// Persistencia: data.regulacion.texto = string (lo que escribe; autoguardado).
// ─────────────────────────────────────────────────────────────────────────

export interface RegulacionData {
  /** Lo que la persona escribe durante la descarga (autoguardado). Legado: un
   *  único bloque. Se conserva para compatibilidad y como copia unificada. */
  texto?: string;
  /** Fragmentos de escritura: la persona puede añadir tantos boxes como quiera,
   *  uno debajo de otro. Cada string es un fragmento independiente. */
  fragmentos?: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// «Miedos» — nombrar y enfrentar.
//
// Dos páginas (entre «Dones» e «Integración»):
//   Página 1 (Miedos)               · la persona escribe sus miedos más
//     profundos, uno a uno (igual que «Nudos»).
//   Página 2 (Enfrenta tus miedos)  · le devolvemos cada miedo en un box con
//     unas preguntas para mirarlo de frente y desactivarlo. Escribe sus
//     respuestas; la plataforma no interpreta.
//
// Persistencia: data.miedos = MiedoItem[]  (cada uno con id, texto y respuestas).
//
// ✍️  No cambies las `key` de las preguntas tras publicar (se perderían las
//     respuestas guardadas con esa clave).
// ─────────────────────────────────────────────────────────────────────────

/** Un miedo reconocido por la persona + sus respuestas al enfrentarlo. */
export interface MiedoItem {
  /** Identificador estable. */
  id: string;
  /** El miedo, con las palabras de la persona. */
  texto: string;
  /** Respuestas a las preguntas de la página «Enfrenta tus miedos», por `key`. */
  respuestas?: Record<string, string>;
}

export const MIEDOS = {
  titulo: "Miedos",
  pregunta: "¿Cuáles son tus miedos más profundos?",
  apoyo:
    "Un miedo no siempre es racional, y no hace falta que lo sea. Escribe lo que de verdad te da miedo, tal y como aparece, sin justificarlo ni suavizarlo. Nadie más lo va a leer.",
  ejemplos: [
    "A quedarme solo/a",
    "A no ser suficiente",
    "Al fracaso",
    "A que me abandonen",
    "A que le pase algo a quien quiero",
    "Al rechazo",
    "A perder el control",
    "A la enfermedad",
    "A no ser querido/a tal como soy",
    "A no encontrar mi lugar",
  ],
};

export interface PreguntaMiedo {
  /** Clave estable con la que se guarda la respuesta (no cambiar tras publicar). */
  key: string;
  pregunta: string;
  apoyo?: string;
  placeholder?: string;
}

export const MIEDOS_ENFRENTAR_INTRO = {
  titulo: "Enfrenta tus miedos",
  intro:
    "Detrás de nuestros miedos están nuestros mayores dones",
};

// Preguntas para enfrentar cada miedo (decatastrofizar + recursos + autocompasión).
export const MIEDOS_PREGUNTAS: PreguntaMiedo[] = [
  {
    key: "concreta",
    pregunta: "¿Qué es exactamente lo que temes que ocurra?",
    apoyo: "Ponle nombre concreto, no en abstracto.",
    placeholder: "Lo que de verdad temo es…",
  },
  {
    key: "peor",
    pregunta: "Si se hiciera realidad, ¿qué es lo peor que podría pasar?",
    placeholder: "Lo peor sería…",
  },
  {
    key: "probabilidad",
    pregunta: "¿Qué probabilidad real crees que tiene de ocurrir?",
    apoyo: "Del 0 al 100 %. Sé honesto contigo, no con tu miedo.",
    placeholder: "Creo que…",
  },
  {
    key: "cambio",
    pregunta: "Si ocurriera, ¿cómo cambiaría de verdad tu vida?",
    placeholder: "Mi vida cambiaría en que…",
  },
  {
    key: "afrontar",
    pregunta: "¿Cómo lo afrontarías? ¿Con qué fortalezas, personas o recursos contarías?",
    placeholder: "Podría apoyarme en…",
  },
  {
    key: "compasion",
    pregunta: "¿Qué le dirías a alguien que quieres si tuviera este mismo miedo?",
    apoyo: "Háblate con esa misma amabilidad.",
    placeholder: "Le diría que…",
  },
];

/** Cuántas preguntas ha respondido la persona para un miedo (para el progreso). */
export const miedoRespondidas = (m: MiedoItem): number =>
  MIEDOS_PREGUNTAS.filter((p) => ((m.respuestas?.[p.key] || "").trim().length > 0)).length;

// ─────────────────────────────────────────────────────────────────────────
// «ACE» — Experiencias Adversas en la Infancia (test + resultado).
//
// ACE = Adverse Childhood Experiences. Es el cuestionario de 10 preguntas del
// gran estudio CDC-Kaiser (Felitti & Anda, 1998; +17.000 personas), que mostró
// una relación de DOSIS-RESPUESTA entre la adversidad vivida antes de los 18
// años y la salud física/emocional en la vida adulta.
//
// Aquí NO es un instrumento clínico ni un diagnóstico: es un espejo de
// autoconocimiento. Por eso el tono es cálido, honesto y esperanzador — una
// puntuación alta es un factor de riesgo, jamás un destino, y todo el recorrido
// es precisamente el trabajo de reparación.
//
// Flujo de la página:
//   1. Intro: qué es el ACE (+ popup «¿Qué es esto?»).
//   2. Test: 10 preguntas Sí/No (se guarda cada respuesta al instante).
//   3. Al responder las 10 → se revela el resultado: puntuación + banda
//      interpretativa + consecuencias (dosis-respuesta) + mensaje de esperanza.
//
// Persistencia: data.ace.respuestas = { [key]: "si" | "no" }.
//
// ✍️  No cambies las `key` tras publicar (se perderían las respuestas guardadas).
// ─────────────────────────────────────────────────────────────────────────

export type AceRespuesta = "si" | "no";

export interface AceData {
  /** Respuesta por clave de pregunta: "si" | "no". Sin responder = ausente. */
  respuestas?: Record<string, AceRespuesta>;
}

export interface PreguntaAce {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Categoría corta (etiqueta de la tarjeta). */
  categoria: string;
  /** La pregunta, reformulada con calidez pero sin perder su sentido clínico. */
  pregunta: string;
  /** Matiz aclaratorio opcional (aparece más pequeño bajo la pregunta). */
  apoyo?: string;
}

export const ACE_INTRO = {
  titulo: "Experiencias adversas en la infancia",
  subtitulo: "El test ACE",
  // Texto del popup «¿Qué es esto?».
  que: [
    "«ACE» son las siglas en inglés de Adverse Childhood Experiences: experiencias adversas en la infancia. Nace de uno de los mayores estudios de salud jamás realizados (CDC-Kaiser, más de 17.000 personas), que descubrió algo tan sencillo como revelador: lo que vivimos de niños deja una huella real en la salud y en la vida adulta.",
    "El test son 10 preguntas de sí o no sobre lo que ocurrió en tu hogar antes de los 18 años: maltrato, abandono y disfunción familiar. Cada «sí» suma un punto, del 0 al 10. No mide quién eres ni cuánto vales: solo pone nombre a lo que cargaste.",
    "Responde con calma y con honestidad. Nadie más lo verá. Y recuerda algo antes de empezar: una puntuación alta no es una condena — es, precisamente, el punto de partida de este mapa.",
  ],
  // Frase breve sobre el turquesa, encima del test.
  subtituloTurquesa: "Antes de los 18 años, ¿viviste alguna de estas situaciones en tu hogar?",
};

// Las 10 preguntas originales del ACE, reformuladas en español con cuidado. El
// orden y el sentido se mantienen (abuso 1-3, negligencia 4-5, disfunción 6-10).
export const ACE_PREGUNTAS: PreguntaAce[] = [
  {
    key: "ace-1-maltrato-emocional",
    categoria: "Maltrato emocional",
    pregunta: "¿Alguno de tus padres u otro adulto de la casa te insultó, humilló o te menospreció a menudo, o te hizo temer que pudieran hacerte daño?",
  },
  {
    key: "ace-2-maltrato-fisico",
    categoria: "Maltrato físico",
    pregunta: "¿Alguno de tus padres u otro adulto te empujó, agarró, abofeteó o te golpeó con fuerza, hasta dejarte marcas o hacerte daño?",
  },
  {
    key: "ace-3-abuso-sexual",
    categoria: "Abuso sexual",
    pregunta: "¿Algún adulto, o alguien al menos 5 años mayor que tú, te tocó de forma sexual, o intentó o llegó a tener contacto sexual contigo?",
  },
  {
    key: "ace-4-abandono-emocional",
    categoria: "Abandono emocional",
    pregunta: "¿Sentiste a menudo que nadie en tu familia te quería, que no eras importante, o que no os apoyabais ni os cuidabais entre vosotros?",
  },
  {
    key: "ace-5-abandono-fisico",
    categoria: "Abandono físico",
    pregunta: "¿Sentiste a menudo que no tenías suficiente para comer, que ibas sucio o sin ropa adecuada, o que no había nadie que te protegiera?",
    apoyo: "También cuenta si tus padres estaban demasiado afectados (por alcohol, drogas o enfermedad) para cuidarte o llevarte al médico.",
  },
  {
    key: "ace-6-separacion",
    categoria: "Separación o divorcio",
    pregunta: "¿Tus padres se separaron o divorciaron alguna vez?",
  },
  {
    key: "ace-7-violencia-hogar",
    categoria: "Violencia en el hogar",
    pregunta: "¿Viste cómo empujaban, agarraban, abofeteaban o golpeaban a tu madre (o a la mujer que te cuidaba), o cómo la amenazaban?",
  },
  {
    key: "ace-8-adicciones",
    categoria: "Adicciones en el hogar",
    pregunta: "¿Viviste con alguien que tuviera problemas con el alcohol o que consumiera drogas?",
  },
  {
    key: "ace-9-enfermedad-mental",
    categoria: "Salud mental en el hogar",
    pregunta: "¿Viviste con alguien que sufriera depresión u otra enfermedad mental, o que intentara quitarse la vida?",
  },
  {
    key: "ace-10-carcel",
    categoria: "Prisión en el hogar",
    pregunta: "¿Algún miembro de tu hogar estuvo alguna vez en prisión?",
  },
];

/** Puntuación ACE: número de respuestas "si" (0–10). */
export const aceScore = (data: LineaDeVidaData): number =>
  ACE_PREGUNTAS.filter((p) => data?.ace?.respuestas?.[p.key] === "si").length;

/** Cuántas de las 10 preguntas se han respondido (para la barra de progreso). */
export const aceRespondidas = (data: LineaDeVidaData): number =>
  ACE_PREGUNTAS.filter((p) => !!data?.ace?.respuestas?.[p.key]).length;

/** ¿Están las 10 respondidas? (para revelar el resultado). */
export const aceCompleto = (data: LineaDeVidaData): boolean =>
  aceRespondidas(data) === ACE_PREGUNTAS.length;

/** Banda interpretativa de la puntuación. Tono honesto pero esperanzador. */
export interface AceBanda {
  min: number;
  max: number;
  etiqueta: string;
  titulo: string;
  /** Color de acento (mismo criterio semafórico que «Necesidades»). */
  color: string;
  texto: string;
}

export const ACE_BANDAS: AceBanda[] = [
  {
    min: 0, max: 0,
    etiqueta: "0",
    titulo: "Sin experiencias adversas registradas",
    color: "#3f9d6b",
    texto:
      "Según el test, tu infancia estuvo relativamente libre de estas adversidades concretas. Es una base valiosa. Aun así, ninguna vida está libre de heridas: este mapa sigue siendo para ti, porque el dolor no siempre cabe en diez preguntas.",
  },
  {
    min: 1, max: 3,
    etiqueta: "1–3",
    titulo: "Adversidad moderada",
    color: "#caa23c",
    texto:
      "Viviste algunas experiencias adversas. Es lo más frecuente: la mayoría de las personas suma alguna. Con apoyo y trabajo personal —como el que estás haciendo aquí— su efecto puede cuidarse, comprenderse y sanar.",
  },
  {
    min: 4, max: 10,
    etiqueta: "4+",
    titulo: "Adversidad elevada",
    color: "#c5613e",
    texto:
      "Cargaste con varias experiencias adversas, seguramente con más peso del que merecías. Los estudios asocian una puntuación de 4 o más con un mayor riesgo para la salud física y emocional. Pero escúchalo bien: es un riesgo, no un destino. Reconocerlo, como estás haciendo ahora, es el primer paso para que deje de gobernarte.",
  },
];

export const aceBanda = (score: number): AceBanda =>
  ACE_BANDAS.find((b) => score >= b.min && score <= b.max) ?? ACE_BANDAS[ACE_BANDAS.length - 1];

// Consecuencias (dosis-respuesta) — se muestran tras completar el test. Redactado
// con rigor y sin alarmismo: hablamos de probabilidades en grandes grupos, nunca
// de algo que vaya a ocurrirle a la persona.
export const ACE_CONSECUENCIAS = {
  titulo: "¿Qué se sabe de estas experiencias?",
  intro:
    "El estudio ACE observó una relación de «dosis-respuesta»: cuantas más experiencias adversas, mayor es el riesgo de dificultades más adelante. Importante: son probabilidades en grandes grupos de personas, no una predicción sobre ti.",
  puntos: [ ],
};

// Mensaje de esperanza y resiliencia — el cierre imprescindible para no dejar a
// la persona en su herida. Basado en la evidencia: la neuroplasticidad y, sobre
// todo, los vínculos seguros como principal factor protector.
export const ACE_ESPERANZA = {
  titulo: "Tu historia no termina en una cifra",
  texto: [
    "El cerebro y el cuerpo tienen una capacidad enorme de sanar. Lo que se aprendió en la adversidad también puede reaprenderse en la seguridad.",
    "El factor que más protege, según la propia ciencia, es sencillo: las relaciones seguras y el sostén emocional. Un solo vínculo de confianza puede cambiarlo todo.",
    "Este mapa —recordar, comprender, integrar— es exactamente ese trabajo. No estás mirando tu herida para quedarte en ella, sino para transformarla.",
  ],
  // Recordatorio honesto (coherente con el «Aviso importante» del inicio).
};

/** Ruta pública del audio de estimulación bilateral (auriculares recomendados). */
export const REGULACION_AUDIO_SRC = "/audio/estimulacion-bilateral.mp3";

export const REGULACION = {
  titulo: "Narra",
  // Reencuadre: narrar la experiencia para integrarla en la propia historia.
  intro:
    "La mejor forma de sanar es ponerle narrativa a la experiencia traumática para integrarla en tu historia. Se recomienda pedir una llamada para este apartado.",
  // Preparación (lugar seguro) antes de tocar nada.
  preparacion: {
    titulo: "Antes de empezar",
    pasos: [
      "Busca un sitio tranquilo donde nadie te interrumpa.",
      "Ponte los auriculares: el sonido irá pasando de un oído al otro.",
      "Elige UNA sola cosa para trabajar hoy. No hace falta con todo: con una basta.",
      "Recuerda: puedes parar en cualquier momento. Tú mandas.",
    ],
  },
  // Placeholder del área de escritura.
  placeholder: "Escribe lo que recuerdes…",
  // Botón de parada (siempre visible).
  botonParar: "Necesito parar",
  // Cierre de grounding: para volver al cuerpo y al presente antes de salir.
  cierre: {
    titulo: "Volvamos al presente",
    intro: "Antes de irte, tómate un momento para volver a tu cuerpo y al aquí y ahora.",
    respiracion: "Respira hondo tres veces, despacio. Inhala… sostén… suelta.",
    grounding: [
      "5 cosas que puedes ver a tu alrededor",
      "4 cosas que puedes tocar",
      "3 sonidos que puedes oír",
      "2 olores que puedes notar",
      "1 cosa buena de ti",
    ],
    frase: "Ya está. Lo que ha venido, ha venido. Estás a salvo y estás aquí.",
  },
};
