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
    pregunta: "¿Qué problemas hay en tu Vida actualmente?",
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
}

// ── «Los Nudos» — textos editables ──
export const NUDOS = {
  titulo: "Los Nudos",
  intro: [
    "Has recorrido tu historia. Has vuelto a visitar recuerdos, personas y momentos que ayudaron a moldear quién eres hoy. Algunas experiencias quedaron atrás. Otras continúan influyendo en tu forma de pensar, sentir y relacionarte.",
    "A esos puntos de tensión los llamaremos nudos.",
  ],
  apoyo:
    "Un nudo puede ser un miedo, una herida, una creencia, un conflicto repetido o una dificultad que parece acompañarte desde hace años. No busques explicaciones perfectas. Simplemente observa aquello que sientes presente en tu vida hoy.",
  pregunta: "¿Qué conflictos o nudos reconoces actualmente en tu vida?",
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
  titulo: "La Integración",
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
