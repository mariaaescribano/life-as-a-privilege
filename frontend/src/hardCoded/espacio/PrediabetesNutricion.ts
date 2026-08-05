// ═════════════════════════════════════════════════════════════════════════
// «¿Cómo va tu azúcar?» — test de riesgo de prediabetes (FINDRISC).
//
// FINDRISC (Finnish Diabetes Risk Score, Lindström & Tuomilehto 2003) es el
// cuestionario de riesgo de diabetes tipo 2 más usado en Europa y está validado
// en población española (estudio Di@bet.es; recomendado por la Estrategia de
// Diabetes del SNS). Son 8 factores, puntúa de 0 a 26, y estima la probabilidad
// de desarrollar diabetes tipo 2 en los próximos 10 años.
//
// POR QUÉ ESTÁ AQUÍ: la prediabetes es reversible y casi siempre SILENCIOSA. Se
// puede vivir años con la glucosa alta sin notar nada, y para cuando aparecen
// los síntomas ya suele haber diabetes. Un test de riesgo es la única forma de
// detectarla a tiempo sin pincharse.
//
// ⚠️ TONO — este test pregunta por peso y cintura, y eso puede doler. Reglas de
//    diseño que NO se deben romper al editar:
//      · NUNCA se muestra una etiqueta de peso («sobrepeso», «obesidad»). El
//        IMC puntúa por dentro y no se enseña ni como número ni como categoría.
//      · Los datos corporales se traen ya rellenos de «Tus calorías»: nadie
//        tiene que volver a escribir su peso.
//      · El resultado separa SIEMPRE lo que no se elige (edad, genética) de lo
//        que sí está en tu mano. Nada de culpa por lo primero.
//      · La cintura se puede omitir («ahora no puedo medirme»).
//      · Cierre esperanzador: la prediabetes se revierte. Es un aviso, no una
//        condena, y desde luego no un diagnóstico.
//
// Persistencia: metodo_nutricion.data.prediabetes (ver `PrediabetesData`).
//
// ✍️  No cambies las `key` tras publicar (se perderían las respuestas guardadas).
// ═════════════════════════════════════════════════════════════════════════

// ── Colores de acento (misma paleta semafórica que el resto del método) ──
const VERDE = "#3f9d6b";
const OLIVA = "#8a9a45";
const AMBAR = "#caa23c";
const TERRA = "#c5613e";
const ROJIZO = "#a8442f";

export type Sexo = "mujer" | "hombre";

/** Lo que se guarda en `data.prediabetes`. */
export interface PrediabetesData {
  /** Test completado (todas las preguntas respondidas). */
  hecho?: boolean;
  /** Perímetro de cintura en cm. Ausente si eligió no medirse. */
  cintura?: number;
  /** La persona indicó que ahora no puede medirse la cintura. */
  sinCintura?: boolean;
  /** Respuestas de las preguntas, por `key` → `value` de la opción elegida. */
  respuestas?: Record<string, string>;
  /** Copia de los datos corporales usados (vienen de `calorias.entrada`, pero
   *  se guardan aquí porque la persona puede corregirlos sin tocar el cálculo
   *  de calorías). */
  base?: { sexo?: Sexo; edad?: number; peso?: number; altura?: number };
  /** Puntuación total del último cálculo (0–26). Informativo. */
  puntos?: number;
}

// ─────────────────────────────────────────────────────────────────────────
// Textos de cabecera
// ─────────────────────────────────────────────────────────────────────────

export const PREDIABETES_INTRO = {
  titulo: "¿Cómo va tu azúcar?",
  // Frase sobre el turquesa, bajo el header.
  subtitulo:
    "La prediabetes no duele, no se nota y se puede dar la vuelta. Por eso merece la pena mirarla a tiempo.",
  // Texto del popup «¿Qué es esto?».
  que: [
    "Antes de que exista una diabetes tipo 2 hay una etapa intermedia: la glucosa en sangre está más alta de lo normal, pero todavía no lo suficiente para llamarse diabetes. Eso es la prediabetes, y se calcula que más de una de cada diez personas adultas la tiene sin saberlo.",
    "Lo importante: en esa etapa el cuerpo todavía puede volver atrás. Con cambios en la alimentación y el movimiento, la mayoría de las personas con prediabetes recuperan sus valores normales. No es una fase previa inevitable: es una ventana abierta.",
    "Esto que vas a responder es el FINDRISC, un cuestionario de riesgo desarrollado en Finlandia y validado en población española. No mide tu azúcar —para eso hace falta un análisis de sangre—: estima la probabilidad de que desarrolles diabetes tipo 2 en los próximos diez años, para saber si merece la pena que te lo mires.",
    "Algunas preguntas son sobre tu cuerpo. No hay ninguna cifra buena ni mala aquí, y no vas a ver ninguna etiqueta: solo son datos que el cálculo necesita. Responde con tranquilidad; esto no lo lee nadie más.",
  ],
  // Encima del bloque de preguntas.
  subtituloTurquesa: "Ocho factores. Dos minutos.",
};

// ─────────────────────────────────────────────────────────────────────────
// Las preguntas que SÍ se preguntan.
//
// Los tres primeros factores del FINDRISC (edad, IMC y cintura) no son
// preguntas de opción: salen de los datos corporales. Los cinco de aquí son los
// que la persona responde tocando una opción.
// ─────────────────────────────────────────────────────────────────────────

export interface OpcionPregunta {
  /** Valor estable que se guarda (no cambiar tras publicar). */
  value: string;
  label: string;
  /** Puntos que suma esta opción en el FINDRISC. */
  puntos: number;
}

export interface PreguntaPrediabetes {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Etiqueta corta de la tarjeta. */
  categoria: string;
  pregunta: string;
  /** Matiz aclaratorio (letra pequeña bajo la pregunta). */
  apoyo?: string;
  opciones: OpcionPregunta[];
}

export const PREDIABETES_PREGUNTAS: PreguntaPrediabetes[] = [
  {
    key: "actividad",
    categoria: "Movimiento",
    pregunta: "¿Te mueves al menos 30 minutos al día?",
    apoyo:
      "Cuenta todo: andar, subir escaleras, el trabajo si es de pie, las tareas de casa, el deporte. No hacen falta de golpe.",
    opciones: [
      { value: "si", label: "Sí, la mayoría de los días", puntos: 0 },
      { value: "no", label: "No, o solo algún día suelto", puntos: 2 },
    ],
  },
  {
    key: "vegetales",
    categoria: "Tu plato",
    pregunta: "¿Comes verdura, fruta u hortalizas todos los días?",
    apoyo: "Todos los días, una pieza de fruta o 200 gramos de verduras.",
    opciones: [
      { value: "si", label: "Sí, todos los días", puntos: 0 },
      { value: "no", label: "No todos los días", puntos: 1 },
    ],
  },
  {
    key: "tension",
    categoria: "Tensión arterial",
    pregunta: "¿Tomas o has tomado medicación para la tensión alta?",
    apoyo: "Solo si te la ha recetado un médico de forma continuada.",
    opciones: [
      { value: "no", label: "No", puntos: 0 },
      { value: "si", label: "Sí", puntos: 2 },
    ],
  },
  {
    key: "glucosa",
    categoria: "Analíticas anteriores",
    pregunta: "¿Alguna vez te han dicho que tenías el azúcar alto?",
    apoyo:
      "En una analítica, en una revisión, durante un ingreso o en el embarazo (diabetes gestacional).",
    opciones: [
      { value: "no", label: "No, nunca", puntos: 0 },
      { value: "si", label: "Sí, alguna vez", puntos: 5 },
    ],
  },
  {
    key: "familia",
    categoria: "Tu familia",
    pregunta: "¿Hay diabetes en tu familia?",
    apoyo:
      "Esto no depende de ti en absoluto: es la parte que se hereda. Saberlo solo sirve para afinar el cálculo.",
    opciones: [
      { value: "no", label: "No, que yo sepa", puntos: 0 },
      { value: "segundo", label: "Sí: abuelos, tíos o primos hermanos", puntos: 3 },
      { value: "primero", label: "Sí: padres, hermanos o hijos", puntos: 5 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Puntuación de los tres factores corporales (FINDRISC)
// ─────────────────────────────────────────────────────────────────────────

/** Edad: <45 → 0 · 45-54 → 2 · 55-64 → 3 · ≥65 → 4. */
export function puntosEdad(edad: number): number {
  if (!edad || edad < 45) return 0;
  if (edad <= 54) return 2;
  if (edad <= 64) return 3;
  return 4;
}

/** Índice de masa corporal. Se usa SOLO para puntuar: nunca se muestra. */
export function imc(peso: number, alturaCm: number): number | null {
  if (!peso || !alturaCm) return null;
  const m = alturaCm / 100;
  return peso / (m * m);
}

/** IMC: <25 → 0 · 25-30 → 1 · >30 → 3. */
export function puntosImc(peso: number, alturaCm: number): number {
  const v = imc(peso, alturaCm);
  if (v === null) return 0;
  if (v < 25) return 0;
  if (v <= 30) return 1;
  return 3;
}

/** Cintura, con los cortes propios de cada sexo.
 *  Mujeres: <80 → 0 · 80-88 → 3 · >88 → 4.
 *  Hombres: <94 → 0 · 94-102 → 3 · >102 → 4. */
export function puntosCintura(cintura: number | undefined, sexo: Sexo): number {
  if (!cintura) return 0;
  const [bajo, medio] = sexo === "hombre" ? [94, 102] : [80, 88];
  if (cintura < bajo) return 0;
  if (cintura <= medio) return 3;
  return 4;
}

/** Texto de ayuda para medirse la cintura (se muestra junto al campo). */
export const CINTURA_AYUDA = {
  titulo: "Cómo medirte",
  pasos: [
    "De pie, relajada y sin meter tripa. Suelta el aire con normalidad.",
    "Pasa la cinta métrica por encima del ombligo, a la altura del punto medio entre la última costilla y el hueso de la cadera.",
    "La cinta horizontal y apoyada, sin apretar. Anota los centímetros.",
  ],
  // Por qué se pregunta: es el dato más honesto, y conviene decirlo.
  porQue:
    "Se pregunta la cintura y no solo el peso porque lo que se relaciona con la resistencia a la insulina no es pesar más o menos, sino la grasa que se acumula alrededor de los órganos. Dos personas con el mismo peso pueden tener riesgos muy distintos.",
};

// ─────────────────────────────────────────────────────────────────────────
// Cálculo completo
// ─────────────────────────────────────────────────────────────────────────

export interface DesglosePunto {
  /** Etiqueta del factor. */
  etiqueta: string;
  puntos: number;
  /** ¿Es un factor sobre el que se puede actuar? (para separar culpa de acción) */
  modificable: boolean;
  /** Qué hacer con él, si es modificable y está sumando. */
  consejo?: string;
}

export interface ResultadoPrediabetes {
  puntos: number;
  desglose: DesglosePunto[];
  /** La cintura no se midió: el resultado puede quedarse corto. */
  sinCintura: boolean;
}

/** ¿Están las 5 preguntas respondidas? */
export const prediabetesRespondidas = (d: PrediabetesData): number =>
  PREDIABETES_PREGUNTAS.filter((p) => !!d?.respuestas?.[p.key]).length;

export const prediabetesCompleto = (d: PrediabetesData): boolean =>
  prediabetesRespondidas(d) === PREDIABETES_PREGUNTAS.length;

/** Puntuación FINDRISC total + desglose. Devuelve null si faltan datos base. */
export function calcularPrediabetes(d: PrediabetesData): ResultadoPrediabetes | null {
  const base = d?.base ?? {};
  const sexo: Sexo = base.sexo === "hombre" ? "hombre" : "mujer";
  const edad = Number(base.edad) || 0;
  const peso = Number(base.peso) || 0;
  const altura = Number(base.altura) || 0;
  if (!edad || !peso || !altura) return null;
  if (!prediabetesCompleto(d)) return null;

  const desglose: DesglosePunto[] = [
    { etiqueta: "Tu edad", puntos: puntosEdad(edad), modificable: false },
    {
      etiqueta: "Tu complexión",
      puntos: puntosImc(peso, altura),
      modificable: true,
      consejo:
        "No hace falta una transformación: en los estudios, bajar entre un 5 % y un 7 % del peso ya reduce el riesgo a la mitad.",
    },
    {
      etiqueta: "Tu cintura",
      puntos: puntosCintura(d.cintura, sexo),
      modificable: true,
      consejo:
        "La grasa abdominal es de las primeras que se pierde al mover el cuerpo con regularidad, aunque la báscula tarde en moverse.",
    },
  ];

  for (const p of PREDIABETES_PREGUNTAS) {
    const elegida = p.opciones.find((o) => o.value === d.respuestas?.[p.key]);
    if (!elegida) continue;
    const modificable = p.key === "actividad" || p.key === "vegetales";
    desglose.push({
      etiqueta: p.categoria,
      puntos: elegida.puntos,
      modificable,
      consejo:
        p.key === "actividad"
          ? "Caminar 30 minutos al día es la intervención con más evidencia que existe para esto. No hace falta gimnasio."
          : p.key === "vegetales"
          ? "La fibra de la verdura y la fruta amortigua las subidas de glucosa. Empezar la comida por la verdura ya cambia la curva."
          : undefined,
    });
  }

  return {
    puntos: desglose.reduce((s, x) => s + x.puntos, 0),
    desglose,
    sinCintura: !d.cintura,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Bandas de riesgo (FINDRISC: riesgo de diabetes tipo 2 a 10 años)
// ─────────────────────────────────────────────────────────────────────────

export interface BandaPrediabetes {
  min: number;
  max: number;
  etiqueta: string;
  titulo: string;
  color: string;
  /** Riesgo a 10 años, en lenguaje de personas y no de porcentajes secos. */
  riesgo: string;
  texto: string;
  /** Qué haríamos nosotras en su lugar. */
  paso: string;
}

export const PREDIABETES_BANDAS: BandaPrediabetes[] = [
  {
    min: 0, max: 6,
    etiqueta: "Menos de 7",
    titulo: "Riesgo bajo",
    color: VERDE,
    riesgo: "Alrededor de 1 de cada 100 personas con esta puntuación desarrolla diabetes en 10 años.",
    texto:
      "Por ahora tu metabolismo del azúcar tiene pinta de ir bien. No es un salvoconducto para siempre —el riesgo sube con la edad, y eso le pasa a todo el mundo—, pero hoy no hay nada que te urja.",
    paso: "Sigue con lo que ya haces y repite este test cada pocos años, o si cambia algo importante en tu vida.",
  },
  {
    min: 7, max: 11,
    etiqueta: "7 a 11",
    titulo: "Riesgo ligeramente elevado",
    color: OLIVA,
    riesgo: "Alrededor de 1 de cada 25 personas con esta puntuación desarrolla diabetes en 10 años.",
    texto:
      "Hay algún factor sumando, pero estás lejos de la zona de preocupación. Es la puntuación más común, y es exactamente el momento en el que los pequeños cambios rinden más, porque todavía no hay nada que corregir.",
    paso: "Mira abajo qué está sumando y quédate con un solo cambio. Uno sostenido vale más que cinco de dos semanas.",
  },
  {
    min: 12, max: 14,
    etiqueta: "12 a 14",
    titulo: "Riesgo moderado",
    color: AMBAR,
    riesgo: "Alrededor de 1 de cada 6 personas con esta puntuación desarrolla diabetes en 10 años.",
    texto:
      "Aquí ya merece la pena hacer algo, y merece la pena hacerlo ahora: esta es justo la franja donde cambiar hábitos tiene más efecto demostrado. No es una mala noticia; es información que llega a tiempo.",
    paso: "Pide en tu centro de salud una analítica con glucosa en ayunas o hemoglobina glicosilada (HbA1c). Es un análisis de sangre normal y corriente.",
  },
  {
    min: 15, max: 20,
    etiqueta: "15 a 20",
    titulo: "Riesgo alto",
    color: TERRA,
    riesgo: "Alrededor de 1 de cada 3 personas con esta puntuación desarrolla diabetes en 10 años.",
    texto:
      "La puntuación es alta y lo honesto es decírtelo claro. También es honesto decirte lo otro: en el estudio de referencia sobre esto, las personas en tu situación que cambiaron su alimentación y empezaron a moverse redujeron su riesgo un 58 %. Más que cualquier pastilla.",
    paso: "Habla con tu médica o médico y pide que te miren la glucosa. Llévale esta puntuación si quieres: es un test que conocen.",
  },
  {
    min: 21, max: 26,
    etiqueta: "Más de 20",
    titulo: "Riesgo muy alto",
    color: ROJIZO,
    riesgo: "Alrededor de 1 de cada 2 personas con esta puntuación desarrolla diabetes en 10 años.",
    texto:
      "Esta puntuación pide una consulta médica, sin dramatizarla y sin aplazarla. Que sea alta no significa que tengas diabetes: significa que hay varios factores sumando a la vez y que conviene saber en qué punto estás de verdad, con un análisis.",
    paso: "Pide cita en tu centro de salud y cuéntaselo. Es un análisis de sangre sencillo, y saber el dato real es lo que te devuelve el control.",
  },
];

export const bandaPrediabetes = (puntos: number): BandaPrediabetes =>
  PREDIABETES_BANDAS.find((b) => puntos >= b.min && puntos <= b.max) ??
  PREDIABETES_BANDAS[PREDIABETES_BANDAS.length - 1];

// ─────────────────────────────────────────────────────────────────────────
// SEÑALES DE ALERTA — lo que sí se nota, cuando ya se nota.
//
// Ojo al encuadre: la prediabetes es asintomática. Estas señales aparecen
// cuando la glucosa lleva tiempo alta, y por eso son motivo de consulta, no
// de test. Se muestran SIEMPRE (con o sin test hecho): son la parte que puede
// hacer que alguien pida cita mañana.
// ─────────────────────────────────────────────────────────────────────────

export interface SenalAlerta {
  key: string;
  titulo: string;
  texto: string;
}

export const SENALES_INTRO = {
  titulo: "Señales para no dejar pasar",
  aviso:
    "Antes de la lista, lo más importante: la prediabetes casi nunca da síntomas. Se puede llevar años sin notar absolutamente nada. Por eso existe un test de riesgo y por eso no hay que esperar a encontrarse mal.",
  texto:
    "Estas señales aparecen cuando la glucosa lleva ya un tiempo alta. Ninguna de ellas significa por sí sola que tengas diabetes —casi todas tienen otras explicaciones mucho más frecuentes—, pero si reconoces varias a la vez, y sobre todo si llevan semanas contigo, pide una analítica. No es alarmismo: es lo barato y lo sensato.",
};

export const SENALES_ALERTA: SenalAlerta[] = [
  {
    key: "sed",
    titulo: "Sed que no se apaga",
    texto: "Beber mucho más de lo habitual y seguir con la boca seca. Suele ir de la mano de la siguiente.",
  },
  {
    key: "orina",
    titulo: "Orinar mucho, también de noche",
    texto: "Levantarse una o varias veces a orinar cuando antes no pasaba. El cuerpo saca por ahí el azúcar que le sobra.",
  },
  {
    key: "cansancio",
    titulo: "Un cansancio que no se arregla durmiendo",
    texto: "Agotamiento de fondo, sin causa clara, que no mejora con el descanso ni con el fin de semana.",
  },
  {
    key: "hambre",
    titulo: "Hambre constante",
    texto: "Volver a tener hambre al poco de comer, con bajones fuertes de energía o sueño después de las comidas.",
  },
  {
    key: "vision",
    titulo: "Vista borrosa a ratos",
    texto: "La visión se enturbia y se aclara sin motivo aparente, a veces durante días.",
  },
  {
    key: "heridas",
    titulo: "Heridas que tardan en cerrar",
    texto: "Cortes, rozaduras o llagas que se curan mucho más despacio de lo que solían.",
  },
  {
    key: "infecciones",
    titulo: "Infecciones que se repiten",
    texto: "Candidiasis, infecciones de orina o de encías que vuelven una y otra vez.",
  },
  {
    key: "hormigueo",
    titulo: "Hormigueo en manos o pies",
    texto: "Cosquilleo, entumecimiento o pérdida de sensibilidad, sobre todo en los pies y por la noche.",
  },
  {
    key: "acantosis",
    titulo: "Manchas oscuras en los pliegues",
    texto:
      "Zonas de piel más oscura y aterciopelada al tacto en el cuello, las axilas o las ingles. Se llama acantosis nigricans y es una de las señales más específicas de resistencia a la insulina.",
  },
  {
    key: "peso",
    titulo: "Perder peso sin buscarlo",
    texto: "Adelgazar sin haber cambiado nada de lo que comes ni de lo que te mueves. Esta conviene consultarla pronto.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Cierre — la parte que no se puede omitir
// ─────────────────────────────────────────────────────────────────────────

export const PREDIABETES_ESPERANZA = {
  titulo: "Esto se puede dar la vuelta",
  texto: [
    "La prediabetes es una de las pocas cosas en salud que se revierte de verdad, y sin medicación. No se está gestionando un deterioro: se está cerrando una puerta que aún está abierta.",
    "El Diabetes Prevention Program siguió a más de 3.000 personas con riesgo alto durante tres años. Quienes cambiaron alimentación y actividad redujeron su riesgo un 58 %, casi el doble de lo que consiguió el fármaco con el que se comparó. En mayores de 60 años, la reducción fue del 71 %.",
    "Y no hizo falta nada heroico: perder entre un 5 % y un 7 % del peso y caminar 150 minutos a la semana. Media hora, cinco días. Eso fue todo.",
  ],
  // Recordatorio honesto, siempre visible.
  aviso:
    "Esto es una estimación de riesgo con fines educativos, no un diagnóstico. La prediabetes solo se confirma o se descarta con un análisis de sangre (glucosa en ayunas o HbA1c). Si algo de esto te ha preocupado, coméntalo con tu médica o médico: es exactamente la conversación para la que están.",
};
