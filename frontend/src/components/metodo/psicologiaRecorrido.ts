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
    pregunta: "¿Qué problemas te acompañan?",
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
  /** Descripción libre: lo que la persona reconoce. */
  texto: string;
}

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
  titulo: "Las necesidades de la infancia",
  subtitulo: "Lo que todo niño necesita para crecer sano, y la respuesta que recibió de quienes lo cuidaron.",
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

/** Tramos de la timeline: el primero 0–5 (6 nodos), luego de 5 en 5. */
export function tramosDeAnios(edad: number): number[][] {
  const tramos: number[][] = [];
  let inicio = 0;
  while (inicio <= edad) {
    const fin = inicio === 0 ? 5 : inicio + 4;
    const tramo: number[] = [];
    for (let a = inicio; a <= Math.min(fin, edad); a++) tramo.push(a);
    tramos.push(tramo);
    inicio = fin + 1;
  }
  return tramos;
}
