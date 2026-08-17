import { traducir } from "../../i18n";
// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · PSICOLOGÍA
//
// El recorrido se compone de "experiencias". La primera es «Línea de Vida»:
// reconstruir la propia historia como quien escribe un libro autobiográfico.
//
// Flujo de «Línea de Vida» (3 pantallas):
//   Pantalla 1 · El problema actual  → una pregunta + texto amplio
//   Pantalla 2 · La edad             → el usuario dice cuántos años tiene
//   Pantalla 3 · La línea de Vida    → timeline interactiva año a año; cada año
//                                       abre una "página de libro" con preguntas
//                                       evocadoras. Hay que recorrer toda la Vida
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
  id: "linea-de-Vida",
  titulo: "Línea de Vida",
  subtitulo: "Tu historia, contada por ti",
  intro:
    "Antes de comprender la mente, hay que recordar la Vida que la formó. Esta primera experiencia es para reconstruir tu historia: no como un cuestionario, sino como quien escribe las primeras páginas de su propio libro. Nadie más leerá esto. Es para ti.",

  problemaInicial: {
    key: "problema-actual",
    pregunta: "¿Cuál es tu problema actual?",
    apoyo: "",
    placeholder: "Estoy aquí porque…",
  },

  preguntaEdad: {
    key: "edad",
    pregunta: "¿Cuántos años tienes?",
    apoyo: "Con tu edad dibujaremos tu línea de Vida, desde que naciste hasta hoy.",
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
  /** Versión corta para MÓVIL, cuando el título largo no cabe de una línea
   *  (p.ej. «Lo primero de tu carta» → «Lo primero»). Si no se pone, en móvil
   *  se usa `titulo` tal cual. */
  tituloCorto?: string;
  /** Ruta a la que salta (recibe el id de la experiencia). */
  ruta: (expId: string) => string;
  /** Si true, la página aún no está desbloqueada: se muestra con un candado y no
   *  es pulsable. Opcional (por defecto, desbloqueada). */
  bloqueado?: boolean;
}

/** Los 26 pasos del recorrido, con los títulos ya en el idioma activo.
 *  Es una FUNCIÓN y no un array: un array de nivel de módulo se calcula una vez
 *  al importar el fichero y se quedaría con los títulos congelados en el idioma
 *  de arranque. Quien lo pinte tiene que llamar a `useIdioma()` para volver a
 *  renderizarse al cambiar de idioma. */
export const psicologiaIndice = (): PasoRecorrido[] => [
  { n: 1,  titulo: traducir("metodo.psico.paso.vuelveATi"),     ruta: () => "/metodo/psicologia" },
  { n: 2,  titulo: traducir("metodo.psico.paso.problemas"),     ruta: (id) => `/metodo/psicologia/${id}/problema` },
  { n: 3,  titulo: traducir("metodo.psico.paso.ace"),           ruta: (id) => `/metodo/psicologia/${id}/ace` },
  { n: 4,  titulo: traducir("metodo.psico.paso.resultadoAce"),  ruta: (id) => `/metodo/psicologia/${id}/ace-resultado` },
  { n: 5,  titulo: traducir("metodo.psico.paso.des"),           ruta: (id) => `/metodo/psicologia/${id}/des` },
  { n: 6,  titulo: traducir("metodo.psico.paso.desResultado"),  ruta: (id) => `/metodo/psicologia/${id}/des-resultado` },
  { n: 7,  titulo: traducir("metodo.psico.lineaDeVida"),        ruta: (id) => `/metodo/psicologia/${id}` },
  { n: 8,  titulo: traducir("metodo.psico.paso.familia"),       ruta: (id) => `/metodo/psicologia/${id}/familia` },
  { n: 9,  titulo: traducir("metodo.psico.paso.genograma"),     ruta: (id) => `/metodo/psicologia/${id}/genograma` },
  { n: 10, titulo: traducir("metodo.psico.paso.huellas"),       ruta: (id) => `/metodo/psicologia/${id}/huellas` },
  { n: 11, titulo: traducir("metodo.psico.paso.nudos"),         ruta: (id) => `/metodo/psicologia/${id}/nudos` },
  { n: 12, titulo: traducir("metodo.psico.paso.necesidades"),   ruta: (id) => `/metodo/psicologia/${id}/necesidades` },
  { n: 13, titulo: traducir("metodo.psico.paso.heridas"),       ruta: (id) => `/metodo/psicologia/${id}/huellas-nudos` },
  { n: 14, titulo: traducir("metodo.psico.paso.tusHeridas"),    ruta: (id) => `/metodo/psicologia/${id}/heridas-lista` },
  { n: 15, titulo: traducir("metodo.psico.narra"),              ruta: (id) => `/metodo/psicologia/${id}/regulacion` },
  { n: 16, titulo: traducir("metodo.psico.paso.relacion"),      ruta: (id) => `/metodo/psicologia/${id}/integracion` },
  { n: 17, titulo: traducir("metodo.psico.paso.recuerdate"),    ruta: (id) => `/metodo/psicologia/${id}/dones` },
  { n: 18, titulo: traducir("metodo.psico.paso.dones"),         ruta: (id) => `/metodo/psicologia/${id}/dones-espejo` },
  { n: 19, titulo: traducir("metodo.psico.paso.miedos"),        ruta: (id) => `/metodo/psicologia/${id}/miedos` },
  { n: 20, titulo: traducir("metodo.psico.paso.atrevete"),      ruta: (id) => `/metodo/psicologia/${id}/miedos-preguntas` },
  { n: 21, titulo: traducir("metodo.psico.paso.integracion"),   ruta: (id) => `/metodo/psicologia/${id}/mapa` },
  { n: 22, titulo: traducir("metodo.psico.paso.compromiso"),    ruta: (id) => `/metodo/psicologia/${id}/compromiso` },
  { n: 23, titulo: traducir("metodo.psico.paso.carta"),         ruta: (id) => `/metodo/psicologia/${id}/brujula` },
  { n: 24, titulo: traducir("metodo.psico.paso.sintesis"),      ruta: (id) => `/metodo/psicologia/${id}/sintesis` },
  { n: 25, titulo: traducir("metodo.psico.paso.emociones"),     ruta: (id) => `/metodo/psicologia/${id}/emociones` },
  { n: 26, titulo: traducir("metodo.psico.paso.cursosCorto"),   ruta: (id) => `/metodo/psicologia/${id}/cursos` },
];

/** Total de pasos del recorrido (para las etiquetas X/total). */
export const RECORRIDO_TOTAL = psicologiaIndice().length;

// ─────────────────────────────────────────────────────────────────────────
// La gestación · un nodo ANTES del año 0.
//
// La Vida no empieza al nacer: empieza en el deseo (o no) de quien nos esperaba.
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
   *  usuario que la vivió en su infancia. Material reflexivo previo a «Heridas»
   *  (es la tercera pieza: Huella + Nudo + Necesidad no cubierta = Herida). */
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
  /** «DES-II» (Escala de Experiencias Disociativas): las 28 respuestas del test,
   *  por `key` de pregunta, en PORCENTAJE de tiempo (0–100, de diez en diez).
   *  Va justo después del ACE: si el ACE cuenta qué pasó, este cuenta cómo se
   *  sobrevivió. Tampoco es un diagnóstico (ver `DesData`). */
  des?: DesData;
  /** «Compromiso» (cierre del recorrido): el compromiso concreto que la persona
   *  define consigo misma para empezar a vivir desde la integración y no desde
   *  la herida. Dos preguntas de texto libre (ver `CompromisoData`). */
  compromiso?: CompromisoData;
  /** «Tu brújula»: mensaje de la persona a su yo del futuro para los momentos de
   *  bloqueo. Cuatro preguntas guía (ver `BrujulaData`). */
  brujula?: BrujulaData;
  /** La FAMILIA de la usuaria: las personas que coloca alrededor de sí misma,
   *  con su foto, su nombre, los personajes/animales que asocia a cada una y lo
   *  que escribe de ellas. Ella misma NO está en la lista: es el centro fijo del
   *  mapa (ver `PersonaGenograma`).
   *
   *  La MISMA lista alimenta las dos páginas: «Tu familia» (paso 6, donde compone
   *  la familia y le pone un personaje/animal a cada miembro) y «Genograma»
   *  (paso 7, el mapa completo con la ficha escrita de cada persona). Así la
   *  usuaria coloca a su familia UNA vez. */
  genograma?: PersonaGenograma[];
}

// ─────────────────────────────────────────────────────────────────────────
// LA FAMILIA · dos páginas seguidas que comparten el MISMO mapa de personas.
//
//   Paso 6 · «Tu familia»  → compone su familia y asocia a cada miembro uno o
//                            dos personajes/animales (ver familiaSimbolos.ts).
//   Paso 7 · «Genograma»   → el mismo mapa, ya completo, donde abre la ficha de
//                            cada persona y escribe sobre ella.
//
// La persona empieza sola en el centro del mapa (su foto de perfil, con la
// etiqueta «Tú») y va colocando a su familia a su alrededor: hacia ARRIBA las
// generaciones anteriores (padres, abuelos) y a los LADOS su propia generación
// (hermanos, pareja). Hacia abajo, si quiere, sus hijos.
//
// El mapa es una rejilla de casillas: cada persona guarda su posición como
// (fila, col) RELATIVA a la usuaria, que ocupa siempre (0, 0):
//   fila  −1, −2…  → una y dos generaciones por encima     |  +1 → por debajo
//   col   −1, −2…  → a su izquierda                        |  +1… → a su derecha
//
// Persistencia: data.genograma = PersonaGenograma[]. Las fotos NO van en el
// blob: se suben al bucket (POST /upload/genograma/:userId) y aquí se guarda
// solo su URL — si no, el `data` reventaría el límite de tamaño del body.
//
// ✍️  No cambies las `key` de las preguntas tras publicar (se perderían las
//     respuestas guardadas con esa clave).
// ─────────────────────────────────────────────────────────────────────────

export interface PersonaGenograma {
  /** Identificador estable. */
  id: string;
  /** Nombre que le pone la usuaria («Mamá», «Carmen»…). */
  nombre: string;
  /** Parentesco (Madre, Padre, Hermana, Abuela materna…). Libre. */
  parentesco?: string;
  /** URL pública de su foto (bucket). Sin foto se dibuja su inicial. */
  foto?: string;
  /** Fila relativa a la usuaria: negativa hacia arriba, positiva hacia abajo. */
  fila: number;
  /** Columna relativa a la usuaria: negativa a la izquierda, positiva a la derecha. */
  col: number;
  /** Personajes/animales que la usuaria asocia a esta persona (página «Tu
   *  familia»): hasta `SIMBOLOS_POR_PERSONA` claves de `SIMBOLOS_FAMILIA`. */
  simbolos?: string[];
  /** Lo que la usuaria escribe de esta persona, por `key` de pregunta. */
  notas?: Record<string, string>;
}

/** Cuántos personajes/animales puede asociar a cada miembro de la familia. */
export const SIMBOLOS_POR_PERSONA = 2;

export const GENOGRAMA = {
  titulo: "Genograma",
  /** Frase bajo el header (sobre el turquesa). */
  intro:
    "Aquí está tu familia completa. Toca a cada persona y escribe lo que sepas y lo que sientas de ella: lo que te dio, lo que te faltó y lo que crees que cargaba. Puedes seguir añadiendo a quien falte.",
  /** Etiqueta bajo la foto de la propia usuaria. */
  yo: "Tú",
  /** Parentescos sugeridos en la ficha (pulsables, también se puede escribir). */
  parentescos: [
    "Madre", "Padre", "Hermana", "Hermano",
    "Abuela materna", "Abuelo materno", "Abuela paterna", "Abuelo paterno",
    "Pareja", "Hija", "Hijo", "Tía", "Tío", "Prima", "Primo",
    "Madrastra", "Padrastro", "Quien me cuidó",
  ],
};

// ── Paso 6 · «Tu familia» (componer la familia + personaje/animal) ──
export const FAMILIA = {
  titulo: "Tu familia",
  /** Frase bajo el header (sobre el turquesa). */
  intro:
    "Empieza por ti, en el centro, y coloca a tu familia alrededor: hacia arriba quienes te precedieron, a los lados quienes crecieron contigo. Después elige para cada uno el personaje o el animal que se le parece: a veces una imagen dice lo que no sabemos nombrar.",
  /** Texto del popup, encima de las imágenes. */
  eligeTitulo: "¿A quién se parece?",
  eligeApoyo:
    "Elige el personaje o el animal que asocias con esta persona. Puedes elegir hasta dos. No lo pienses mucho: quédate con el primero que te venga.",
};

/** Las preguntas de la ficha de cada persona del genograma. */
export const GENOGRAMA_PREGUNTAS: Pregunta[] = [
  { key: "quien", pregunta: "¿Quién es o quién fue para ti?", placeholder: "Es mi…" },
  { key: "relacion", pregunta: "¿Cómo es (o cómo era) vuestra relación?", placeholder: "Con ella/él siento…" },
  { key: "recuerdo", pregunta: "¿Qué recuerdo te viene primero de esta persona?", placeholder: "Recuerdo…" },
  { key: "aprendi", pregunta: "¿Qué aprendiste de ella o de él, para bien o para mal?", placeholder: "Aprendí que…" },
  { key: "falto", pregunta: "¿Qué te dio y qué te faltó de esta persona?", placeholder: "Me dio… y me faltó…" },
  { key: "cargaba", pregunta: "¿Qué crees que cargaba esta persona? (su propia historia, sus heridas)", placeholder: "Creo que cargaba…" },
  { key: "parecido", pregunta: "¿En qué te pareces y en qué no quieres parecerte?", placeholder: "Me parezco en…" },
  { key: "pendiente", pregunta: "¿Hay algo que te gustaría decirle y nunca le dijiste?", placeholder: "Me gustaría decirle…" },
  { key: "algo-mas", pregunta: "Algo más que quieras contar de ella o de él…" },
];

/** Personas del genograma, blindadas: los datos guardados con una forma antigua
 *  (o incompleta) no pueden reventar el render. */
export function personasGenograma(data: LineaDeVidaData): PersonaGenograma[] {
  const lista = Array.isArray(data?.genograma) ? data.genograma : [];
  return lista
    .filter((p): p is PersonaGenograma => !!p && typeof p === "object")
    .map((p, i) => ({
      id: typeof p.id === "string" && p.id ? p.id : `persona-${i}`,
      nombre: typeof p.nombre === "string" ? p.nombre : "",
      parentesco: typeof p.parentesco === "string" ? p.parentesco : "",
      foto: typeof p.foto === "string" ? p.foto : undefined,
      fila: Number.isFinite(p.fila) ? Number(p.fila) : -1,
      col: Number.isFinite(p.col) ? Number(p.col) : 0,
      simbolos: (Array.isArray(p.simbolos) ? p.simbolos : [])
        .filter((s): s is string => typeof s === "string" && s.length > 0)
        .slice(0, SIMBOLOS_POR_PERSONA),
      notas: p.notas && typeof p.notas === "object" ? p.notas : {},
    }))
    // Nadie puede ocupar el centro: ese sitio es siempre de la usuaria.
    .filter((p) => !(p.fila === 0 && p.col === 0));
}

/** Nombre visible de una persona del genograma. */
export const personaLabel = (p: PersonaGenograma): string =>
  (p.nombre || "").trim() || (p.parentesco || "").trim() || "Sin nombre";

/** Cuántas preguntas de su ficha tiene escritas (para el «3/9» de la tarjeta). */
export const personaEscritas = (p: PersonaGenograma): number =>
  GENOGRAMA_PREGUNTAS.filter((q) => ((p.notas?.[q.key] || "").trim().length > 0)).length;

/** Los personajes/animales de una persona (lista segura, como mucho dos). */
export const personaSimbolos = (p: PersonaGenograma): string[] =>
  (Array.isArray(p.simbolos) ? p.simbolos : []).slice(0, SIMBOLOS_POR_PERSONA);

/** ¿Hay ya alguien de la familia con un personaje/animal elegido? Es lo que
 *  desbloquea el paso siguiente en la página «Tu familia». */
export const familiaConSimbolo = (data: LineaDeVidaData): boolean =>
  personasGenograma(data).some((p) => personaSimbolos(p).length > 0);

/** Identificador de una persona nueva del mapa. */
export const nuevaPersonaId = (): string =>
  `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Clave de una casilla del mapa (fila:col). */
export const posKeyFamilia = (fila: number, col: number): string => `${fila}:${col}`;

/** Casillas ocupadas del mapa. La usuaria ocupa SIEMPRE el centro (0,0). */
export function ocupacionFamilia(personas: PersonaGenograma[]): Map<string, PersonaGenograma | "yo"> {
  const m = new Map<string, PersonaGenograma | "yo">();
  m.set(posKeyFamilia(0, 0), "yo");
  personas.forEach((p) => m.set(posKeyFamilia(p.fila, p.col), p));
  return m;
}

/** Dónde colocar a alguien nuevo al pulsar un «+» desde la casilla (fila, col).
 *  Arriba y abajo: la misma columna si está libre y, si no, el hueco más cercano
 *  de esa fila (abriéndose a los dos lados) — así el segundo padre o el segundo
 *  abuelo nunca pisa a nadie. A los lados: se avanza en esa dirección hasta
 *  encontrar sitio. */
export function posicionLibreFamilia(
  personas: PersonaGenograma[],
  desdeFila: number,
  desdeCol: number,
  dir: "arriba" | "abajo" | "izq" | "der",
): { fila: number; col: number } {
  const ocupado = ocupacionFamilia(personas);
  const libre = (f: number, c: number) => !ocupado.has(posKeyFamilia(f, c));

  if (dir === "izq" || dir === "der") {
    const paso = dir === "izq" ? -1 : 1;
    for (let d = 1; d <= 20; d++) {
      if (libre(desdeFila, desdeCol + paso * d)) return { fila: desdeFila, col: desdeCol + paso * d };
    }
    return { fila: desdeFila, col: desdeCol + paso * 21 };
  }

  const fila = dir === "arriba" ? desdeFila - 1 : desdeFila + 1;
  if (libre(fila, desdeCol)) return { fila, col: desdeCol };
  for (let d = 1; d <= 20; d++) {
    if (libre(fila, desdeCol + d)) return { fila, col: desdeCol + d };
    if (libre(fila, desdeCol - d)) return { fila, col: desdeCol - d };
  }
  return { fila, col: desdeCol + 21 };
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
    "Estas son las heridas que han marcado tu historia. Ahora puedes empezar a sanar hasta que se conviertan en cicatrices.",
};

// ── «Los Nudos» — textos editables ──
export const NUDOS = {
  titulo: "Nudos",
  intro: [] as string[],
  apoyo:
    "Un nudo puede ser un miedo, una herida, una creencia, un conflicto repetido o una dificultad que parece acompañarte desde hace años. No busques explicaciones perfectas. Simplemente observa aquello que sientes presente en tu Vida hoy.",
  pregunta: "¿Qué nudos dirigen tu Vida y te impiden avanzar?",
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
    "Has comenzado a reconocer los nudos que siguen presentes en tu Vida.",
    "Ahora llega el momento de unir las piezas.",
  ],
  secundario: [
    "A veces vemos nuestras experiencias por separado. Pero cuando observamos la historia completa, empiezan a aparecer conexiones que antes pasaban desapercibidas.",
    "En esta sesión exploraremos juntos la relación entre tu historia personal, tus patrones psicológicos y los arquetipos presentes en tu carta astral.",
  ],
  exploraremos: [
    "Los nudos que aparecen en tu Vida actual.",
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
// «Las Necesidades del Niño» — material reflexivo previo a «Heridas».
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
  subtitulo: "¿Qué necesitabas y no recibiste? Cada celda representa una necesidad. Cuando una queda insatisfecha, puede ser tan doloroso que parezca borrar el impacto de aquellas que sí fueron satisfechas.",
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

/** ¿Se han respondido TODAS las necesidades? Desbloquea la página de Heridas. */
export const necesidadesCompletas = (data: LineaDeVidaData): boolean =>
  necesidadesRespondidas(data) === NECESIDADES.length;

/** Desbloqueo secuencial: una necesidad (por índice) está desbloqueada si es la
 *  primera o si la anterior ya ha sido respondida. Así se rellenan de una en una. */
export const necesidadDesbloqueada = (
  data: LineaDeVidaData,
  idx: number,
): boolean => {
  if (idx <= 0) return true;
  const prev = NECESIDADES[idx - 1];
  return !!(prev && data?.necesidades?.[prev.key]);
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

/** ¿Se ha recorrido la Vida entera (todos los años 0..edad)? */
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
// «Las Huellas» — relectura del libro tras completar la línea de Vida.
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
  { key: "don-mas-orgulloso",      pregunta: "¿Cuál ha sido el momento de tu Vida en el que te has sentido más orgulloso de ti mismo?" },
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
  /** Ejemplos pulsables: se escriben en la respuesta para que luego los edite.
   *  Máximo 4 y CORTOS: se pintan en el hueco que queda bajo el recuadro del
   *  popup, que no crece (ver MetodoPsicologiaMiedosPreguntas). */
  ejemplos?: string[];
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
    ejemplos: [
      "Que enferme alguien que quiero",
      "Que me quede sola",
      "Que dejen de quererme",
      "Que no llegue a tiempo",
    ],
  },
  {
    key: "peor",
    pregunta: "Si se hiciera realidad, ¿qué es lo peor que podría pasar?",
    placeholder: "Lo peor sería…",
    ejemplos: [
      "Que no pudiera soportarlo",
      "Que me hundiera y no me levantara",
      "Que me quedara sin nadie",
      "Que nada volviera a tener sentido",
    ],
  },
  {
    key: "probabilidad",
    pregunta: "¿Qué probabilidad real crees que tiene de ocurrir?",
    apoyo: "Del 0 al 100 %. Sé honesto contigo, no con tu miedo.",
    placeholder: "Creo que…",
    ejemplos: [
      "Muy baja, menos del 10 %",
      "Un 30 %",
      "Un 50 %",
      "Alta, más del 70 %",
    ],
  },
  {
    key: "cambio",
    pregunta: "Si ocurriera, ¿cómo cambiaría de verdad tu Vida?",
    placeholder: "Mi Vida cambiaría en que…",
    ejemplos: [
      "Dolería, pero seguiría siendo yo",
      "Tendría que empezar de nuevo",
      "Cambiaría un tiempo y luego me adaptaría",
      "Menos de lo que mi miedo me dice",
    ],
  },
  {
    key: "afrontar",
    pregunta: "¿Cómo lo afrontarías? ¿Con qué fortalezas, personas o recursos contarías?",
    placeholder: "Podría apoyarme en…",
    ejemplos: [
      "Mi familia",
      "Mis amigos",
      "Pedir ayuda a un profesional",
      "Todo lo que ya he superado antes",
    ],
  },
  {
    key: "compasion",
    pregunta: "¿Qué le dirías a alguien que quieres si tuviera este mismo miedo?",
    apoyo: "Háblate con esa misma amabilidad.",
    placeholder: "Le diría que…",
    ejemplos: [
      "Que no está sola",
      "Que su miedo tiene sentido",
      "Que puede con esto",
      "Que yo estaría a su lado",
    ],
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
// años y la salud física/emocional en la Vida adulta.
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
    "«ACE» son las siglas en inglés de Adverse Childhood Experiences: experiencias adversas en la infancia. Nace de uno de los mayores estudios de salud jamás realizados (CDC-Kaiser, más de 17.000 personas), que descubrió algo tan sencillo como revelador: lo que vivimos de niños deja una huella real en la salud y en la Vida adulta.",
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
    pregunta: "¿Viviste con alguien que sufriera depresión u otra enfermedad mental, o que intentara quitarse la Vida?",
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
      "Según el test, tu infancia estuvo relativamente libre de estas adversidades concretas. Es una base valiosa. Aun así, ninguna Vida está libre de heridas: este mapa sigue siendo para ti, porque el dolor no siempre cabe en diez preguntas.",
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
      "Cargaste con varias experiencias adversas, seguramente con más peso del que merecías. Los estudios asocian una puntuación de 4 o más con un mayor riesgo para la salud física y emocional. Pero escúchalo bien: es un riesgo, no un destino. Reconocerlo, como estás haciendo ahora, es el primer paso para poder integrar la experiencia en tu historia y que deje de afectar tu salud.",
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

// ─────────────────────────────────────────────────────────────────────────
// «DES-II» — Escala de Experiencias Disociativas (test + resultado).
//
// Dissociative Experiences Scale, de Eve Bernstein Carlson y Frank W. Putnam
// (1986; DES-II, 1993). 28 experiencias cotidianas de desconexión; para cada una
// la persona marca QUÉ PORCENTAJE DEL TIEMPO le pasa (0–100, de diez en diez).
// La puntuación es la MEDIA de las 28.
//
// Va justo después del ACE y ANTES de la Línea de Vida, a propósito: el ACE
// cuenta qué pasó, esto cuenta cómo se sobrevivió — y así, cuando la persona
// recorra su vida año a año y se encuentre huecos, el hueco no será un fracaso
// suyo sino información («ahí me fui»).
//
// Aquí NO es un instrumento clínico ni un diagnóstico: es un espejo de
// autoconocimiento. Por eso el resultado no se queda en una cifra —se separa en
// sus tres caras, porque un 35 hecho todo de absorción no es un 35 con lagunas
// de memoria— y por eso una puntuación alta lleva a pedir una llamada, no a una
// etiqueta.
//
// Flujo:
//   1. Test: 28 preguntas de porcentaje (se guarda cada respuesta al instante).
//   2. Cómic «La desconexión», intercalado (explica qué es disociar).
//   3. Resultado: media + banda + las tres subescalas + cierre esperanzador.
//
// Persistencia: data.des.respuestas = { [key]: 0..100 }.
//
// ✍️  No cambies las `key` tras publicar (se perderían las respuestas guardadas).
// ─────────────────────────────────────────────────────────────────────────

export interface DesData {
  /** Porcentaje de tiempo por clave de pregunta (0–100). Sin responder = ausente.
   *  OJO: 0 es una respuesta válida — nunca comprobar con `if (valor)`. */
  respuestas?: Record<string, number>;
}

/** El resultado del test, tal y como queda guardado en la BD.
 *
 *  NO va en el blob `data` con las respuestas, sino en su propia tabla
 *  (`psicologia_des`, ver backend/sql/psicologia-des.sql y data/psicologiaDesApi.ts),
 *  igual que el resultado del test de Ayurveda o el de Medicina China: es un dato
 *  con fecha que se quiere poder consultar y comparar entre personas sin abrir el
 *  blob de cada una. Y se guarda una sola vez, en un sitio: dos copias del mismo
 *  número calculado acabarían contándose distinto.
 *
 *  Lo que se guarda son datos, no texto: la `banda` es su etiqueta estable
 *  («30+»), nunca su título traducido. */
export interface DesResultado {
  /** Media de las 28 respuestas (0–100). */
  score: number;
  /** Etiqueta de la banda en la que cae: "0–9" | "10–19" | "20–29" | "30+". */
  banda: string;
  /** Puntuación de cada subescala, por su `key` (amnesia, despersonalizacion, absorcion). */
  subescalas: Record<string, number>;
  /** ¿Pide cuidado antes de los ejercicios que remueven? (ver `desAlto`). */
  alto: boolean;
}

export interface PreguntaDes {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Etiqueta corta de la tarjeta. */
  categoria: string;
  /** El enunciado. Se conserva el «Algunas personas…» del original: no es
   *  literatura, es lo que hace que la persona no se sienta un bicho raro. */
  pregunta: string;
  /** Matiz aclaratorio opcional (más pequeño, bajo la pregunta). */
  apoyo?: string;
}

/** Los valores que se pueden marcar: 0, 10, 20 … 100 (como los círculos del
 *  cuestionario en papel). */
export const DES_VALORES: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const DES_INTRO = {
  titulo: "Desconexión",
  subtitulo: "El test DES-II",
  // Texto del popup «¿Qué es esto?». Aquí NO se explica todavía qué es disociar:
  // eso lo cuenta el cómic, después de responder, para no contaminar el test.
  que: [
    "El DES-II (Escala de Experiencias Disociativas) lo crearon Eve Bernstein Carlson y Frank Putnam. Son 28 preguntas sobre experiencias cotidianas de desconexión: momentos en los que la memoria, el cuerpo o el mundo dejan de sentirse del todo tuyos.",
    "En cada una marcas qué porcentaje del tiempo te pasa, de 0 (nunca) a 100 (siempre). Cuentan solo los momentos en los que NO estás bajo los efectos del alcohol ni de otras drogas.",
    "No hay respuestas buenas ni malas, y esto no es un diagnóstico. Responde sin pensarlo mucho: la primera intuición suele ser la más honesta. Nadie más lo verá.",
  ],
  // Frase breve sobre el turquesa, encima del test.
  subtituloTurquesa: "¿Qué parte del tiempo te pasa esto? Marca un porcentaje en cada una.",
  // Extremos de la regleta de porcentajes.
  nunca: "nunca",
  siempre: "siempre",
  // Crédito del instrumento (al pie del test), como el ACE cita el CDC-Kaiser.
  credito:
    "Escala de Experiencias Disociativas (DES-II), de Eve Bernstein Carlson y Frank W. Putnam. Traducción al castellano de Olaf Holm.",
};

// Las 28 preguntas del DES-II, en el orden original (el número de la `key` es el
// del cuestionario: de él salen las subescalas). Redactadas en castellano claro
// pero SIN tocar lo que cada ítem pregunta.
export const DES_PREGUNTAS: PreguntaDes[] = [
  { key: "des-1-conducir",      categoria: "El viaje en blanco",
    pregunta: "Algunas personas van conduciendo y de repente se dan cuenta de que no recuerdan lo que ha pasado durante todo el viaje o parte de él." },
  { key: "des-2-escuchar",      categoria: "Lo que no oíste",
    pregunta: "Algunas personas están escuchando hablar a alguien y de repente se dan cuenta de que no han oído todo o parte de lo que les decían." },
  { key: "des-3-lugar",         categoria: "Aparecer en un sitio",
    pregunta: "Algunas personas se encuentran en un lugar y no saben cómo llegaron hasta allí." },
  { key: "des-4-ropa",          categoria: "Ropa que no recuerdas",
    pregunta: "Algunas personas se ven vestidas con ropa que no recuerdan haberse puesto." },
  { key: "des-5-cosas",         categoria: "Cosas que no compraste",
    pregunta: "Algunas personas encuentran cosas nuevas entre sus pertenencias que no recuerdan haber comprado." },
  { key: "des-6-desconocidos",  categoria: "Gente que dice conocerte",
    pregunta: "A algunas personas se les acerca gente que no conocen, que las llama por otro nombre o insiste en conocerlas de antes." },
  { key: "des-7-junto-a-si",    categoria: "Verte desde fuera",
    pregunta: "Algunas personas sienten como si estuvieran junto a sí mismas, u observándose hacer algo como si fueran otra persona." },
  { key: "des-8-no-reconocer",  categoria: "No reconocer a los tuyos",
    pregunta: "A algunas personas les dicen que a veces no reconocen a sus amigos o a miembros de su familia." },
  { key: "des-9-acontecimientos", categoria: "Días importantes sin recuerdo",
    pregunta: "Algunas personas no tienen recuerdo de acontecimientos importantes de su vida (una boda, una Navidad, un viaje)." },
  { key: "des-10-mentir",       categoria: "Te acusan de mentir",
    pregunta: "A algunas personas las acusan de mentir cuando ellas creen que no han mentido." },
  { key: "des-11-espejo",       categoria: "El espejo",
    pregunta: "Algunas personas se miran en un espejo y no se reconocen." },
  { key: "des-12-irreal",       categoria: "El mundo irreal",
    pregunta: "Algunas personas sienten que las personas, los objetos y el mundo que las rodea no son reales." },
  { key: "des-13-cuerpo",       categoria: "El cuerpo ajeno",
    pregunta: "Algunas personas sienten que su cuerpo no les pertenece." },
  { key: "des-14-revivir",      categoria: "Revivir el pasado",
    pregunta: "Algunas personas recuerdan el pasado tan intensamente que sienten que lo están volviendo a vivir." },
  { key: "des-15-sonado",       categoria: "¿Pasó o lo soñé?",
    pregunta: "Algunas personas no están seguras de si lo que recuerdan sucedió de verdad o solo lo soñaron." },
  { key: "des-16-lugar-extrano", categoria: "Lo conocido, extraño",
    pregunta: "Algunas personas están en un lugar conocido y de pronto lo encuentran extraño y poco familiar." },
  { key: "des-17-television",   categoria: "Absorberse en una historia",
    pregunta: "Algunas personas se absorben tanto en una película o en la televisión que no se dan cuenta de lo que ocurre a su alrededor." },
  { key: "des-18-fantasia",     categoria: "Fantasía que parece real",
    pregunta: "Algunas personas se meten tanto en una fantasía o en un sueño despierto que sienten como si estuviera ocurriendo de verdad." },
  { key: "des-19-dolor",        categoria: "Ignorar el dolor",
    pregunta: "Algunas personas son capaces de ignorar el dolor." },
  { key: "des-20-vacio",        categoria: "Mirar al vacío",
    pregunta: "Algunas personas se quedan mirando al vacío, sin pensar en nada, y no se dan cuenta del paso del tiempo." },
  { key: "des-21-hablarse",     categoria: "Hablarte en voz alta",
    pregunta: "Algunas personas, cuando están solas, se hablan a sí mismas en voz alta." },
  { key: "des-22-otra-persona", categoria: "Ser otra según dónde",
    pregunta: "Algunas personas actúan de forma tan distinta en una situación y en otra que sienten como si fueran dos personas diferentes." },
  { key: "des-23-facilidad",    categoria: "Facilidad asombrosa",
    pregunta: "Algunas personas, en ciertas situaciones, hacen con asombrosa facilidad algo que normalmente les costaría (en el deporte, en el trabajo, con la gente…)." },
  { key: "des-24-hecho-pensado", categoria: "¿Lo hice o lo pensé?",
    pregunta: "Algunas personas no pueden recordar si hicieron algo o solo pensaron en hacerlo (por ejemplo, si echaron una carta o solo lo pensaron)." },
  { key: "des-25-evidencias",   categoria: "Pruebas de lo que no recuerdas",
    pregunta: "Algunas personas encuentran pruebas de que hicieron cosas que no recuerdan haber hecho." },
  { key: "des-26-escritos",     categoria: "Escritos que no recuerdas",
    pregunta: "Algunas personas encuentran entre sus cosas escritos, dibujos o notas que hicieron ellas mismas y no recuerdan." },
  { key: "des-27-voces",        categoria: "Voces dentro",
    pregunta: "Algunas personas oyen voces dentro de su cabeza que les dicen que hagan cosas o que comentan lo que están haciendo." },
  { key: "des-28-neblina",      categoria: "El mundo con neblina",
    pregunta: "Algunas personas sienten como si vieran el mundo a través de una neblina, y las personas y los objetos les parecen distantes o poco claros." },
];

/** El valor guardado de una pregunta (0–100), o `undefined` si no está respondida.
 *  Blindado: los datos guardados con otra forma no pueden reventar la media. */
export const desValor = (data: LineaDeVidaData, key: string): number | undefined => {
  const v = data?.des?.respuestas?.[key];
  return typeof v === "number" && Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : undefined;
};

/** Cuántas de las 28 se han respondido (para la barra de progreso). */
export const desRespondidas = (data: LineaDeVidaData): number =>
  DES_PREGUNTAS.filter((p) => desValor(data, p.key) !== undefined).length;

/** ¿Están las 28 respondidas? (desbloquea el resultado). */
export const desCompleto = (data: LineaDeVidaData): boolean =>
  desRespondidas(data) === DES_PREGUNTAS.length;

/** Media de un grupo de preguntas (0–100), redondeada. Las no respondidas no
 *  cuentan; si no hay ninguna respondida, es 0. */
function mediaDe(data: LineaDeVidaData, keys: string[]): number {
  const vals = keys.map((k) => desValor(data, k)).filter((v): v is number => v !== undefined);
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/** Puntuación DES-II: la media de las 28 (0–100). */
export const desScore = (data: LineaDeVidaData): number =>
  mediaDe(data, DES_PREGUNTAS.map((p) => p.key));

// ── Las tres caras de la desconexión (modelo de tres factores de Carlson) ──
//
// Seis ítems del test (1, 9, 16, 19, 21 y 24) no cargan con claridad en ninguno
// de los tres factores: cuentan para la media total y NO se asignan a ninguna
// subescala. Preferimos dejarlos fuera antes que inventar un reparto.
export interface SubescalaDes {
  key: string;
  titulo: string;
  descripcion: string;
  /** Color de acento de su barra. */
  color: string;
  /** Ítems que la forman (`key` de DES_PREGUNTAS). */
  preguntas: string[];
}

export const DES_SUBESCALAS: SubescalaDes[] = [
  {
    key: "amnesia",
    titulo: "Lagunas de memoria",
    descripcion:
      "Trozos de tiempo que no están: viajes, conversaciones, cosas que hiciste y no recuerdas haber hecho.",
    color: "#c5613e",
    preguntas: [
      "des-3-lugar", "des-4-ropa", "des-5-cosas", "des-6-desconocidos",
      "des-8-no-reconocer", "des-10-mentir", "des-25-evidencias", "des-26-escritos",
    ],
  },
  {
    key: "despersonalizacion",
    titulo: "Estar fuera de ti",
    descripcion:
      "Verte desde fuera, no reconocer tu cara, sentir el cuerpo como si no fuera tuyo o el mundo como si no fuera real.",
    color: "#a8452f",
    preguntas: [
      "des-7-junto-a-si", "des-11-espejo", "des-12-irreal", "des-13-cuerpo",
      "des-27-voces", "des-28-neblina",
    ],
  },
  {
    key: "absorcion",
    titulo: "Irte con la mente",
    descripcion:
      "Ensimismarte, meterte en una historia o en un recuerdo hasta perder de vista lo que hay alrededor. Es la más común y la más benigna de las tres.",
    color: "#caa23c",
    preguntas: [
      "des-2-escuchar", "des-14-revivir", "des-15-sonado", "des-17-television",
      "des-18-fantasia", "des-20-vacio", "des-22-otra-persona", "des-23-facilidad",
    ],
  },
];

/** La puntuación (0–100) de cada subescala, en el orden de `DES_SUBESCALAS`. */
export const desSubescalas = (data: LineaDeVidaData): { sub: SubescalaDes; score: number }[] =>
  DES_SUBESCALAS.map((sub) => ({ sub, score: mediaDe(data, sub.preguntas) }));

/** Umbral de cribado del instrumento: 30 o más se considera motivo para una
 *  evaluación profesional (no un diagnóstico). */
export const DES_UMBRAL_ALTO = 30;

/** ¿Conviene avisar antes de los ejercicios que remueven (paso «Narra»)?
 *  Solo si lo alto es la media total, las lagunas o el estar fuera de sí: una
 *  puntuación alta hecha SOLO de absorción no dispara ningún aviso. */
export function desAlto(data: LineaDeVidaData): boolean {
  if (!desCompleto(data)) return false;
  if (desScore(data) >= DES_UMBRAL_ALTO) return true;
  return desSubescalas(data).some(
    (s) => s.sub.key !== "absorcion" && s.score >= DES_UMBRAL_ALTO,
  );
}

/** Banda interpretativa de la puntuación. Honesta, sin alarmismo y sin etiquetas. */
export interface DesBanda {
  min: number;
  max: number;
  etiqueta: string;
  titulo: string;
  color: string;
  texto: string;
}

export const DES_BANDAS: DesBanda[] = [
  {
    min: 0, max: 9,
    etiqueta: "0–9",
    titulo: "Te desconectas poco",
    color: "#3f9d6b",
    texto:
      "Tu memoria y tu cuerpo te acompañan casi siempre. Es una buena base para lo que viene: vas a poder recordar y sentir a la vez, que es justo lo que pide este recorrido.",
  },
  {
    min: 10, max: 19,
    etiqueta: "10–19",
    titulo: "Te desconectas de vez en cuando",
    color: "#caa23c",
    texto:
      "Es lo más frecuente: casi todo el mundo se va un poco. Merece la pena que aprendas a notar cuándo te ocurre, porque casi siempre avisa de que algo te está pesando más de lo que reconoces.",
  },
  {
    min: 20, max: 29,
    etiqueta: "20–29",
    titulo: "Te desconectas bastante",
    color: "#c5613e",
    texto:
      "No es un diagnóstico, pero sí una señal que conviene no dejar pasar: es probable que tu sistema aprendiera a marcharse cuando algo dolía demasiado, y que siga haciéndolo hoy sin que haga falta. Ve despacio en las páginas que vienen y para cuando lo necesites.",
  },
  {
    min: 30, max: 100,
    etiqueta: "30+",
    titulo: "Te desconectas mucho",
    color: "#a8452f",
    texto:
      "Tu puntuación es alta. En la investigación, un 30 o más se considera motivo para mirarlo con un profesional — motivo para mirarlo con alguien, no un diagnóstico ni una etiqueta. Si es tu caso, este mapa no deberías recorrerlo en solitario: pide una llamada y lo hacemos juntos, a tu ritmo.",
  },
];

export const desBanda = (score: number): DesBanda =>
  DES_BANDAS.find((b) => score >= b.min && score <= b.max) ?? DES_BANDAS[DES_BANDAS.length - 1];

// ── El resultado, para guardarlo en su tabla ───────────────────────────────
//
// Las respuestas se guardan con el resto del recorrido (data.des.respuestas).
// El resultado se calcula de ellas y se manda a la tabla `psicologia_des`
// (ver data/psicologiaDesApi.ts). Aquí solo están las cuentas: quién las guarda
// y cuándo es cosa de las páginas.
//
// Solo existe resultado si el test está COMPLETO: uno a medias no significa nada
// y sería peor que no tenerlo.

/** El resultado de un test completo, listo para guardar. `undefined` si aún
 *  faltan respuestas.
 *
 *  Sin fecha: la pone la BD. Y no es `now()` a secas — el backend conserva la de
 *  la fila anterior si el resultado no ha cambiado, para que la fecha diga cuándo
 *  salió ESE resultado y no cuándo se tocó la página por última vez. */
export function desResultado(data: LineaDeVidaData): DesResultado | undefined {
  if (!desCompleto(data)) return undefined;
  const subescalas: Record<string, number> = {};
  desSubescalas(data).forEach(({ sub, score }) => { subescalas[sub.key] = score; });
  const score = desScore(data);
  return { score, banda: desBanda(score).etiqueta, subescalas, alto: desAlto(data) };
}

/** ¿Dicen lo mismo dos resultados? Lo usa la página del test para no repetir el
 *  guardado cuando cambiar una respuesta no mueve ninguna cifra. */
export function desResultadoIgual(a?: DesResultado, b?: DesResultado): boolean {
  if (!a || !b) return !a && !b;
  if (a.score !== b.score || a.banda !== b.banda || a.alto !== b.alto) return false;
  return DES_SUBESCALAS.every((s) => a.subescalas?.[s.key] === b.subescalas?.[s.key]);
}

/** El cierre del resultado: por qué desconectarse no es un defecto y cómo se
 *  vuelve. Imprescindible para no dejar a la persona en su síntoma. */
export const DES_ESPERANZA = {
  titulo: "Irse fue lo que te salvó",
  texto: [
    "Desconectarse no es un defecto ni una rareza: es lo que hace un sistema nervioso inteligente cuando no puede huir ni pelear. Si de pequeña no podías salir de la habitación, salías de ti. Y te funcionó.",
    "El problema es que ese mecanismo no distingue épocas: sigue disparándose hoy —en una discusión, en una consulta, en medio de una conversación cualquiera— cuando ya no hace falta.",
    "Y se reaprende, pero no por la cabeza: por el cuerpo. Los pies en el suelo, la respiración, la temperatura del agua, la voz de alguien que te acompaña. La presencia se entrena. Cada vez que te quedas un poco más, vuelves un poco más a casa.",
  ],
  /** Aviso del paso «Narra» cuando la desconexión es alta (ver `desAlto`). */
  avisoNarra: {
    titulo: "Antes de este ejercicio",
    texto: [
      "En tu test de desconexión salió una puntuación alta. Eso no te impide hacer nada, pero cambia el orden de las cosas: primero se aprende a volver al cuerpo, y solo después se remueve el recuerdo.",
      "Si notas que te vas, que el cuerpo se te queda lejos o que el mundo se pone raro, para el audio y haz el cierre. No es rendirse: es exactamente lo que hay que hacer.",
      "Y si puede ser, esta parte no la hagas sola.",
    ],
  },
};

/** Ruta pública del audio de estimulación bilateral (auriculares recomendados). */
export const REGULACION_AUDIO_SRC = "/audio/estimulacion-bilateral.mp3";

export const REGULACION = {
  titulo: "Narra",
  // Reencuadre: narrar la experiencia para integrarla en la propia historia.
  intro:
  "Poner en palabras lo vivido ayuda a darle sentido e integrarlo en tu historia. Es así como las heridas pueden convertirse en cicatrices. Si quieres profundizar en este proceso, te recomendamos solicitar una llamada.",
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

// ─────────────────────────────────────────────────────────────────────────
// ALCANZABILIDAD · «hasta dónde puede llegar» el usuario en el recorrido.
//
// El Índice abre cada página EN CUANTO el usuario cumple el requisito para
// pasar a ella (los mismos «gates» que deshabilitan el botón «siguiente» de
// cada página). `puedeAvanzarPsicologia(data, n)` replica ese `disabled` del
// paso n (true = puedes pasar al siguiente); `pasoAlcanzablePsicologia` recorre
// esa cadena y devuelve el paso máximo alcanzable (un prefijo contiguo).
//
// ⚠️ Si cambias el gate del botón «siguiente» de una página, cámbialo también
//    aquí para que el Índice siga coincidiendo con lo que el usuario puede hacer.
// ─────────────────────────────────────────────────────────────────────────

/** ¿Cuántos de los 4 bloques de integración tiene rellenos una relación? */
export const constelacionIntegrada = (c: Constelacion): number =>
  (["proteger", "coste", "verdadSana", "recordatorio"] as const)
    .filter((k) => String(c[k] ?? "").trim().length > 0).length;

/** Gate para avanzar MÁS ALLÁ del paso `n` (1-based): true = puedes pasar al
 *  siguiente. Los pasos sin requisito devuelven true. */
export function puedeAvanzarPsicologia(data: LineaDeVidaData, n: number): boolean {
  const t = (s: unknown): string => (typeof s === "string" ? s.trim() : "");
  switch (n) {
    case 2:  return t(data["problema-actual"]) !== "";                         // Problemas: escrito
    case 3:  return aceCompleto(data);                                         // ACE: 10 respondidas
    case 5:  return desCompleto(data);                                         // Desconexión: las 28
    case 7:  return aniosRecorridos(data, Number(data.edad) || 0) >= 1;        // Línea de Vida: ≥1 año
    case 8:  return familiaConSimbolo(data);                                   // Tu familia: ≥1 con personaje
    case 9:  return personasGenograma(data).length > 0;                        // Genograma: ≥1 persona
    case 10: return Object.values(data.anos || {}).some((a) => (a?.huellas?.length ?? 0) > 0); // Huellas: ≥1 marcada
    case 11: return (data.nudos || []).length > 0;                             // Nudos: ≥1
    case 12: return necesidadesCompletas(data);                                // Necesidades: las 18
    case 13: return (data.heridas || []).length > 0;                           // Heridas: ≥1
    case 16: return (data.constelaciones || []).some(                          // Relación: ≥1 con contenido
               (c) => (c?.nudos?.length ?? 0) > 0 || (c?.arquetipos?.length ?? 0) > 0 || t(c?.titulo) !== "" || t(c?.texto) !== "");
    case 17: return DONES_PREGUNTAS.every(                                      // Recuérdate: todas resueltas
               (q) => t(data.dones?.respuestas?.[q.key]) !== "" || (data.dones?.sinIdeas || []).includes(q.key));
    case 18: return (data.dones?.lista || []).some((d) => t(d.texto) !== "");  // Dones: ≥1 don escrito
    case 19: return (data.miedos || []).length > 0;                            // Miedos: ≥1
    case 20: return (data.miedos || []).length > 0 &&                          // Atrévete: todos respondidos
                    (data.miedos || []).every((m) => miedoRespondidas(m) >= MIEDOS_PREGUNTAS.length);
    case 21: return (data.constelaciones || []).some((c) => constelacionIntegrada(c) > 0); // Integración: ≥1 rellena
    case 22: return t(data.compromiso?.necesitaste) !== "" && t(data.compromiso?.dartelo) !== ""; // Compromiso
    case 23: return t(data.brujula?.mensaje) !== "";                           // Carta
    default: return true;  // 1, 4, 6, 14, 15, 24, 25 (la rueda), 26 y cualquier otro: sin requisito
  }
}

/** Paso máximo ALCANZABLE (1-based): el prefijo contiguo de páginas a las que el
 *  usuario ya puede llegar respetando el requisito de cada paso. */
export function pasoAlcanzablePsicologia(data: LineaDeVidaData, _expId?: string): number {
  let n = 1;
  while (n < RECORRIDO_TOTAL && puedeAvanzarPsicologia(data, n)) n++;
  return n;
}
