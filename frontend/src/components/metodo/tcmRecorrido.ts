// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · MEDICINA CHINA (Los 5 Elementos)
//
// Idea central: no "eres" un elemento, eres un EQUILIBRIO. El recorrido gira
// sobre un dato vivo —las puntuaciones de tus 5 elementos— que empieza con el
// test inicial (paso 1) y se va refinando con el mini-test de cada elemento
// (pasos 4-8). El perfil final (paso 9) y "tu propio mapa" (paso 11) leen esa
// puntuación agregada.
//
// Pasos del recorrido:
//   0 · Bienvenida            /metodo/tcm
//   1 · ¿Cómo está tu         /metodo/tcm/equilibrio      (test inicial)
//       equilibrio hoy?
//   2 · Tu mapa energético    /metodo/tcm/mapa            (primer resultado)
//   3 · La estrella           /metodo/tcm/elementos       (estrella interactiva)
//   4-8 · El viaje            /metodo/tcm/elemento/:elemento  (5 elementos + mini-test)
//   9 · Tu perfil completo    /metodo/tcm/perfil          (integra todos los tests)
//   10 · Cómo interactúan     /metodo/tcm/ciclos          (Sheng / Ke)
//   11 · Tu propio mapa       /metodo/tcm/tu-mapa         (ciclos aplicados a ti)
//   12 · Aprende a escucharte /metodo/tcm/observarte(+/lengua)
//   13 · Cierre               /metodo/tcm/compromiso
//
// Persistencia (tabla `metodo_tcm`, columna `data` JSONB): ver DatosTcm abajo.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` (de test o
//     de opción) tras publicar: se perderían las respuestas guardadas.
// ─────────────────────────────────────────────────────────────────────────

// El contenido de fondo (guion de las video-lecciones, recomendaciones clásicas)
// se REUTILIZA del curso de Medicina China: única fuente de verdad. Editar el
// guion = editar LetraTCM.ts; editar hierbas/nutrición = editar tcmRecommendations.ts.
import {
  letratcm1, letratcm2, letratcm3, letratcm4, letratcm5, letratcm6, letratcm7,
  letratcm8, letratcm9, letratcm10, letratcm11, letratcm12, letratcm13, letratcm14,
  letratcm15, letratcm16, letratcm17, letratcm18, letratcm19, letratcm20,
  letratcm21, letratcm22, letratcm23, letratcm24, letratcm25,
} from "../../hardCoded/aprendizajes/TCM/LetraTCM";
import { RECS_ELEMENTOS, type Recs } from "../espacio/data/tcmRecommendations";
import type { PasoRecorrido } from "./psicologiaRecorrido";

// ── Los cinco elementos ──────────────────────────────────────────────────
export type Elemento = "madera" | "fuego" | "tierra" | "metal" | "agua";

/** Orden canónico del ciclo de generación (Sheng). Rige el desbloqueo secuencial. */
export const ORDEN_ELEMENTOS: Elemento[] = ["madera", "fuego", "tierra", "metal", "agua"];

// ── Índice del recorrido (botón «Índice», reutiliza IndiceRecorrido) ────────
// Solo las páginas ya navegables (sin enlaces muertos). Se irá ampliando según
// se construyan los pasos pendientes (perfil, ciclos, tu mapa, escucharte…).
export const TCM_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Medicina China",     ruta: () => "/metodo/tcm" },
  { n: 2, titulo: "Equilibrio",         ruta: () => "/metodo/tcm/equilibrio" },
  { n: 3, titulo: "Mapa energético",    ruta: () => "/metodo/tcm/mapa" },
  { n: 4, titulo: "Los Cinco Elementos", ruta: () => "/metodo/tcm/elementos" },
];

export const TCM_TOTAL = TCM_INDICE.length;

// ── Tipos de test ──────────────────────────────────────────────────────────
export interface OpcionPuntuada {
  /** Clave estable de la opción (no cambiar tras publicar). */
  key: string;
  texto: string;
  /** Puntos que esta opción aporta a cada elemento. */
  puntos: Partial<Record<Elemento, number>>;
}

export interface PreguntaTest {
  /** Clave estable con la que se guarda la respuesta (no cambiar tras publicar). */
  key: string;
  pregunta: string;
  apoyo?: string;
  opciones: OpcionPuntuada[];
}

// ── Contenido de cada elemento (pasos 4-8: "El viaje") ──────────────────────
export interface ContenidoElemento {
  id: Elemento;
  nombre: string;          // "Madera"
  color: string;           // color de acento del elemento
  significado: string;
  organos: string;         // órganos yin/yang asociados
  tejido: string;
  emocion: string;         // emoción en equilibrio / desequilibrio
  estacion: string;
  sabor: string;
  sentido: string;
  fortalezas: string[];
  desequilibrios: string[];      // señales de exceso / deficiencia
  diaADia: string;               // cómo aparece en la vida cotidiana
  ejercicio: string;             // práctica corporal / respiración
  habitos: string[];             // hábitos de sostén (dieta, ritmo, estación)
  reflexion: string;             // pregunta de cierre para "Mis notas"
  /** Mini-test que refina la puntuación de este elemento. */
  miniTest: PreguntaTest[];
}

// ─────────────────────────────────────────────────────────────────────────
// CONTENIDO · Los cinco elementos
// ─────────────────────────────────────────────────────────────────────────
export const ELEMENTOS: Record<Elemento, ContenidoElemento> = {
  madera: {
    id: "madera",
    nombre: "Madera",
    color: "#4c9a5e",
    significado:
      "La Madera es el impulso que empuja hacia arriba, como el brote que rompe la tierra en primavera. Es la energía de crecer, decidir, planificar y avanzar. Cuando fluye, hay claridad y capacidad de emprender; cuando se estanca, aparece la frustración.",
    organos: "Hígado (yin) y Vesícula Biliar (yang)",
    tejido: "Tendones, ligamentos y músculos; se refleja en las uñas",
    emocion: "En equilibrio: determinación y flexibilidad. En desequilibrio: ira, frustración, irritabilidad.",
    estacion: "Primavera",
    sabor: "Ácido",
    sentido: "La vista (los ojos)",
    fortalezas: ["Iniciativa y visión", "Capacidad de decidir", "Flexibilidad para adaptarse", "Empuje para emprender"],
    desequilibrios: [
      "Exceso: irritabilidad, tensión muscular, dolores de cabeza, rigidez",
      "Deficiencia: indecisión, falta de dirección, cansancio de los ojos, uñas quebradizas",
    ],
    diaADia:
      "Aparece en cómo empiezas los proyectos, cómo reaccionas cuando algo bloquea tu camino y en tu capacidad de fluir con los cambios en lugar de luchar contra ellos.",
    ejercicio: "Estiramientos suaves de costados y respiración diafragmática lenta para liberar la tensión del hígado.",
    habitos: ["Dormir antes de medianoche (el hígado se regenera de 1 a 3 h)", "Movimiento diario que libere tensión", "Reducir alcohol y fritos", "Expresar la frustración en vez de tragarla"],
    reflexion: "¿Dónde en tu vida sientes que quieres avanzar y algo te lo impide?",
    miniTest: [
      {
        key: "madera-tension",
        pregunta: "¿Con qué frecuencia sientes tensión, irritabilidad o que “explotas” con facilidad?",
        opciones: [
          { key: "casi-nunca", texto: "Casi nunca", puntos: { madera: 0 } },
          { key: "a-veces", texto: "A veces, en épocas de estrés", puntos: { madera: 2 } },
          { key: "a-menudo", texto: "A menudo", puntos: { madera: 4 } },
        ],
      },
      {
        key: "madera-estancamiento",
        pregunta:
          "¿Notas distensión, plenitud o dolor en el pecho, los costados, las mamas o el bajo vientre, o un sabor ácido en la boca?",
        opciones: [
          { key: "no", texto: "No, apenas lo noto", puntos: { madera: 0 } },
          { key: "a-veces", texto: "A veces, sobre todo con estrés", puntos: { madera: 2 } },
          { key: "a-menudo", texto: "A menudo, de forma clara", puntos: { madera: 4 } },
        ],
      },
      {
        key: "madera-decision",
        pregunta: "Ante una decisión, ¿cómo te sueles sentir?",
        opciones: [
          { key: "claro", texto: "Con claridad, decido y avanzo", puntos: { madera: 0 } },
          { key: "dudo", texto: "Dudo bastante antes de decidir", puntos: { madera: 2 } },
          { key: "bloqueo", texto: "Me bloqueo o lo evito", puntos: { madera: 3 } },
        ],
      },
    ],
  },

  fuego: {
    id: "fuego",
    nombre: "Fuego",
    color: "#d1495b",
    significado:
      "El Fuego es la plenitud del verano: calor, alegría, conexión. Es la energía del corazón, la que nos permite disfrutar, relacionarnos y dar sentido a la vida. En equilibrio hay entusiasmo sereno; en exceso, agitación; en defecto, apatía.",
    organos: "Corazón (yin) e Intestino Delgado (yang)",
    tejido: "Los vasos sanguíneos; se refleja en la tez",
    emocion: "En equilibrio: alegría y calidez. En desequilibrio: ansiedad, euforia inestable o apatía.",
    estacion: "Verano",
    sabor: "Amargo",
    sentido: "El habla y el gusto (la lengua)",
    fortalezas: ["Calidez y carisma", "Capacidad de disfrutar", "Conexión con los demás", "Entusiasmo"],
    desequilibrios: [
      "Exceso: agitación, insomnio, palpitaciones, hablar en exceso",
      "Deficiencia: apatía, tristeza, falta de chispa, dificultad para conectar",
    ],
    diaADia:
      "Se nota en tu capacidad de disfrutar del presente, en cómo duermes, en tu vida social y en si tu entusiasmo es sostenible o te quema.",
    ejercicio: "Coherencia cardíaca: inspirar 5 segundos, espirar 5 segundos, durante 5 minutos.",
    habitos: ["Proteger el sueño", "Momentos reales de alegría y risa", "Evitar la sobreexcitación (pantallas de noche)", "Descanso al mediodía"],
    reflexion: "¿Cuándo fue la última vez que sentiste alegría verdadera, sin prisa?",
    miniTest: [
      {
        key: "fuego-sueno",
        pregunta: "¿Cómo es tu sueño y tu descanso?",
        opciones: [
          { key: "bueno", texto: "Duermo bien y descanso", puntos: { fuego: 0 } },
          { key: "irregular", texto: "Irregular, me cuesta desconectar", puntos: { fuego: 2 } },
          { key: "insomnio", texto: "Insomnio o sueño muy ligero", puntos: { fuego: 4 } },
        ],
      },
      {
        key: "fuego-alegria",
        pregunta: "¿Cómo está tu capacidad de disfrutar y conectar últimamente?",
        opciones: [
          { key: "plena", texto: "Plena, disfruto y conecto", puntos: { fuego: 0 } },
          { key: "apagada", texto: "Un poco apagada", puntos: { fuego: 2 } },
          { key: "ausente", texto: "Casi ausente, me siento desconectado/a", puntos: { fuego: 3 } },
        ],
      },
    ],
  },

  tierra: {
    id: "tierra",
    nombre: "Tierra",
    color: "#c8963e",
    significado:
      "La Tierra es el centro, la nutrición y el sostén. Es la energía que transforma el alimento y las experiencias en algo que nos nutre. Da estabilidad, arraigo y capacidad de cuidar. En desequilibrio aparece la preocupación que da vueltas sin fin.",
    organos: "Bazo/Páncreas (yin) y Estómago (yang)",
    tejido: "La carne y los músculos; se refleja en los labios",
    emocion: "En equilibrio: empatía y arraigo. En desequilibrio: preocupación, rumiación, sobreprotección.",
    estacion: "Final del verano (y las transiciones entre estaciones)",
    sabor: "Dulce",
    sentido: "El gusto (la boca)",
    fortalezas: ["Estabilidad y arraigo", "Capacidad de cuidar y nutrir", "Sentido práctico", "Lealtad"],
    desequilibrios: [
      "Exceso: rumiación, pesadez, retención de líquidos, sobreprotección",
      "Deficiencia: digestión débil, cansancio, dificultad para concentrarse, antojos de dulce",
    ],
    diaADia:
      "Aparece en tu digestión, en tu nivel de energía estable a lo largo del día, en cuánto te preocupas por los demás y en tu sensación de tener los pies en el suelo.",
    ejercicio: "Comer sin pantallas, despacio y masticando; caminar 10 minutos tras las comidas.",
    habitos: ["Comidas regulares y calientes", "Reducir azúcar y crudos en exceso", "Poner límites al cuidar de otros", "Rutinas estables"],
    reflexion: "¿Qué o quién te da la sensación de tener los pies en la tierra?",
    miniTest: [
      {
        key: "tierra-digestion",
        pregunta: "¿Cómo es tu digestión y tu energía después de comer?",
        opciones: [
          { key: "estable", texto: "Buena, energía estable", puntos: { tierra: 0 } },
          { key: "pesada", texto: "Pesadez o sueño tras comer", puntos: { tierra: 3 } },
          { key: "problemas", texto: "Hinchazón, gases o digestión difícil", puntos: { tierra: 4 } },
        ],
      },
      {
        key: "tierra-preocupacion",
        pregunta: "¿Tu mente da vueltas a las mismas preocupaciones?",
        opciones: [
          { key: "poco", texto: "Rara vez", puntos: { tierra: 0 } },
          { key: "a-veces", texto: "A veces", puntos: { tierra: 2 } },
          { key: "mucho", texto: "Constantemente, me cuesta parar", puntos: { tierra: 4 } },
        ],
      },
    ],
  },

  metal: {
    id: "metal",
    nombre: "Metal",
    color: "#9aa0a6",
    significado:
      "El Metal es el otoño: recoger, soltar, quedarse con lo esencial. Es la energía de los límites, la estructura y el valor de las cosas. Rige la respiración y la piel, nuestra frontera con el mundo. En desequilibrio aparecen la tristeza y la dificultad de soltar.",
    organos: "Pulmón (yin) e Intestino Grueso (yang)",
    tejido: "La piel y el vello; se refleja en el cutis",
    emocion: "En equilibrio: capacidad de soltar y valorar. En desequilibrio: tristeza, duelo, apego a lo perdido.",
    estacion: "Otoño",
    sabor: "Picante",
    sentido: "El olfato (la nariz)",
    fortalezas: ["Claridad y orden", "Capacidad de soltar lo que sobra", "Sentido del valor y la justicia", "Disciplina"],
    desequilibrios: [
      "Exceso: rigidez, perfeccionismo, dificultad para soltar",
      "Deficiencia: tristeza persistente, defensas bajas, problemas respiratorios o de piel, estreñimiento",
    ],
    diaADia:
      "Se nota en tu respiración, en tu piel, en cómo gestionas las pérdidas y los finales, y en tu capacidad de quedarte con lo esencial y dejar ir el resto.",
    ejercicio: "Respiración profunda con espiración larga; ordenar y soltar un espacio pequeño de tu casa.",
    habitos: ["Aire libre y respiración consciente", "Rituales de cierre y despedida", "Cuidar la piel y la hidratación", "Practicar el soltar (objetos, rencores)"],
    reflexion: "¿Qué estás sosteniendo que ya podrías soltar?",
    miniTest: [
      {
        key: "metal-respiracion",
        pregunta: "¿Cómo están tu respiración, tu piel o tus defensas?",
        opciones: [
          { key: "bien", texto: "Bien, sin quejas", puntos: { metal: 0 } },
          { key: "flojo", texto: "Me resfrío fácil o piel seca/sensible", puntos: { metal: 3 } },
          { key: "cronico", texto: "Problemas respiratorios o de piel frecuentes", puntos: { metal: 4 } },
        ],
      },
      {
        key: "metal-soltar",
        pregunta: "¿Cómo llevas las pérdidas, los finales y el soltar?",
        opciones: [
          { key: "fluido", texto: "Los acepto y sigo", puntos: { metal: 0 } },
          { key: "cuesta", texto: "Me cuesta, me quedo con la tristeza", puntos: { metal: 3 } },
          { key: "atascado", texto: "Me aferro mucho a lo que ya no está", puntos: { metal: 4 } },
        ],
      },
    ],
  },

  agua: {
    id: "agua",
    nombre: "Agua",
    color: "#3f6fa3",
    significado:
      "El Agua es el invierno: quietud, reserva y profundidad. Es la energía más ancestral, la que guarda nuestra vitalidad de base (la esencia) y rige el descanso, la voluntad y la reproducción. En desequilibrio aparece el miedo; en equilibrio, la sabiduría serena.",
    organos: "Riñón (yin) y Vejiga (yang)",
    tejido: "Los huesos, la médula y el cerebro; se refleja en el cabello",
    emocion: "En equilibrio: calma y voluntad. En desequilibrio: miedo, inseguridad, agotamiento profundo.",
    estacion: "Invierno",
    sabor: "Salado",
    sentido: "El oído (las orejas)",
    fortalezas: ["Voluntad y perseverancia", "Sabiduría y profundidad", "Capacidad de descansar y reservar energía", "Serenidad"],
    desequilibrios: [
      "Exceso: (raro) rigidez, aislamiento",
      "Deficiencia: agotamiento profundo, miedo, dolor lumbar o de rodillas, frío, problemas de oído o de memoria",
    ],
    diaADia:
      "Aparece en tu energía de base (no la del día, la de fondo), en tu descanso profundo, en tu relación con el miedo y en tu capacidad de sostener el esfuerzo a largo plazo.",
    ejercicio: "Descanso real y calor en la zona lumbar; respiración abdominal lenta antes de dormir.",
    habitos: ["Acostarse pronto en invierno", "No agotar la reserva (evitar el sobreesfuerzo crónico)", "Mantener el calor en pies y lumbares", "Cultivar la quietud"],
    reflexion: "¿De dónde sacas tu energía cuando no queda nada en el depósito?",
    miniTest: [
      {
        key: "agua-energia",
        pregunta: "¿Cómo está tu energía de fondo (no el cansancio de un día, sino la reserva)?",
        opciones: [
          { key: "llena", texto: "Buena, tengo reserva", puntos: { agua: 0 } },
          { key: "baja", texto: "Baja, tiro de más", puntos: { agua: 3 } },
          { key: "vacia", texto: "Agotamiento profundo y persistente", puntos: { agua: 4 } },
        ],
      },
      {
        key: "agua-miedo",
        pregunta: "¿Con qué frecuencia el miedo o la inseguridad te frenan?",
        opciones: [
          { key: "poco", texto: "Rara vez", puntos: { agua: 0 } },
          { key: "a-veces", texto: "A veces", puntos: { agua: 2 } },
          { key: "mucho", texto: "A menudo condicionan mis decisiones", puntos: { agua: 4 } },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────
// CONTENIDO DEL CURSO reutilizado por elemento: guion de la video-lección
// (la voz de la plataforma, con las explicaciones fisiológicas) + el vídeo de
// YouTube + las recomendaciones clásicas (infusiones, hierbas, estilo de vida,
// nutrición). Se muestran en la página de cada elemento (pasos 4-8).
// ─────────────────────────────────────────────────────────────────────────
export const GUION_ELEMENTO: Record<Elemento, string> = {
  madera: letratcm4,
  fuego: letratcm5,
  tierra: letratcm6,
  metal: letratcm7,
  agua: letratcm8,
};

export const VIDEO_ELEMENTO: Record<Elemento, string> = {
  madera: "1gMBVFKMAXY",
  fuego: "oqmoovl3Yio",
  tierra: "tXqEjnQPgwc",
  metal: "BzgxPMYOqrA",
  agua: "o2ot4bFWMoQ",
};

// RECS_ELEMENTOS usa nombres capitalizados como clave ("Madera", "Fuego"…).
const RECS_KEY: Record<Elemento, string> = {
  madera: "Madera", fuego: "Fuego", tierra: "Tierra", metal: "Metal", agua: "Agua",
};
export function recomendacionesElemento(el: Elemento): Recs {
  return RECS_ELEMENTOS[RECS_KEY[el]];
}

// Filosofía introductoria (paso 0 · Bienvenida) y cierre (paso 13).
export const FILOSOFIA = {
  taoismo: letratcm1,
  yinYang: letratcm2,
  cincoElementos: letratcm3,
  cierre: letratcm25,
};

// ─────────────────────────────────────────────────────────────────────────
// TEST INICIAL · "¿Cómo está tu equilibrio hoy?" (paso 1)
// Cada opción reparte puntos entre elementos. NO se llama "qué elemento eres".
// ─────────────────────────────────────────────────────────────────────────
export const TEST_INICIAL: PreguntaTest[] = [
  {
    key: "energia",
    pregunta: "¿Cómo describirías tu energía estos días?",
    opciones: [
      { key: "tensa", texto: "Tensa, con ganas de que las cosas avancen ya", puntos: { madera: 3 } },
      { key: "acelerada", texto: "Acelerada, me cuesta parar y desconectar", puntos: { fuego: 3 } },
      { key: "pesada", texto: "Pesada, espesa, sin chispa", puntos: { tierra: 3 } },
      { key: "contenida", texto: "Contenida, un poco melancólica", puntos: { metal: 3 } },
      { key: "agotada", texto: "Agotada desde muy dentro", puntos: { agua: 3 } },
    ],
  },
  {
    key: "emocion",
    pregunta: "¿Qué emoción aparece más en tu día a día?",
    opciones: [
      { key: "frustracion", texto: "Frustración o irritabilidad", puntos: { madera: 3 } },
      { key: "ansiedad", texto: "Ansiedad o sobreexcitación", puntos: { fuego: 3 } },
      { key: "preocupacion", texto: "Preocupación que da vueltas", puntos: { tierra: 3 } },
      { key: "tristeza", texto: "Tristeza o nostalgia", puntos: { metal: 3 } },
      { key: "miedo", texto: "Miedo o inseguridad", puntos: { agua: 3 } },
    ],
  },
  {
    key: "cuerpo",
    pregunta: "¿Dónde notas más tu cuerpo cuando algo no va bien?",
    opciones: [
      { key: "tension-muscular", texto: "Tensión muscular, mandíbula, ojos cansados", puntos: { madera: 3 } },
      { key: "corazon", texto: "Palpitaciones, calor, insomnio", puntos: { fuego: 3 } },
      { key: "digestion", texto: "Digestión, hinchazón, pesadez", puntos: { tierra: 3 } },
      { key: "respiracion-piel", texto: "Respiración, piel, resfriados", puntos: { metal: 3 } },
      { key: "lumbar-frio", texto: "Lumbares, rodillas, frío, oídos", puntos: { agua: 3 } },
    ],
  },
  {
    key: "estacion",
    pregunta: "¿En qué estación te sientes más tú?",
    opciones: [
      { key: "primavera", texto: "Primavera — empezar cosas nuevas", puntos: { madera: 2 } },
      { key: "verano", texto: "Verano — luz, gente, disfrute", puntos: { fuego: 2 } },
      { key: "finverano", texto: "Final del verano — cosecha y hogar", puntos: { tierra: 2 } },
      { key: "otono", texto: "Otoño — recogimiento y orden", puntos: { metal: 2 } },
      { key: "invierno", texto: "Invierno — quietud y reserva", puntos: { agua: 2 } },
    ],
  },
  {
    key: "reto",
    pregunta: "¿Cuál sientes que es tu mayor reto ahora?",
    opciones: [
      { key: "fluir", texto: "Fluir sin luchar contra todo", puntos: { madera: 2 } },
      { key: "calmar", texto: "Calmar la mente y el corazón", puntos: { fuego: 2 } },
      { key: "sostener", texto: "Sostenerme sin agotarme cuidando", puntos: { tierra: 2 } },
      { key: "soltar", texto: "Soltar lo que ya no está", puntos: { metal: 2 } },
      { key: "descansar", texto: "Descansar de verdad y confiar", puntos: { agua: 2 } },
    ],
  },
  {
    key: "sueno",
    pregunta: "¿Cómo es tu sueño?",
    opciones: [
      { key: "madrugada", texto: "Me despierto de madrugada, con la mente tensa", puntos: { madera: 3 } },
      { key: "cuesta", texto: "Me cuesta dormir, la mente va acelerada", puntos: { fuego: 3 } },
      { key: "pesado", texto: "Duermo mucho pero me levanto pesado/a", puntos: { tierra: 3 } },
      { key: "ligero", texto: "Sueño ligero, a veces me despierto con tristeza", puntos: { metal: 3 } },
      { key: "agotado", texto: "Duermo, pero el cansancio de fondo no se va", puntos: { agua: 3 } },
    ],
  },
  {
    key: "digestion",
    pregunta: "¿Cómo va tu digestión?",
    opciones: [
      { key: "tension", texto: "Se resiente con el estrés (gases, tensión)", puntos: { madera: 3 } },
      { key: "ardor", texto: "Ardor, acidez o mucha sed", puntos: { fuego: 3 } },
      { key: "pesadez", texto: "Pesadez, hinchazón, sueño tras comer", puntos: { tierra: 3 } },
      { key: "estrenimiento", texto: "Tiende al estreñimiento", puntos: { metal: 3 } },
      { key: "friolenta", texto: "Molestias con el frío, retención de líquidos", puntos: { agua: 3 } },
    ],
  },
  {
    key: "temperatura",
    pregunta: "¿Sueles tener más frío o más calor?",
    opciones: [
      { key: "calor", texto: "Calor, me sofoco con facilidad", puntos: { fuego: 3 } },
      { key: "frio", texto: "Frío, sobre todo manos y pies", puntos: { agua: 3 } },
      { key: "seca", texto: "Piel y garganta secas", puntos: { metal: 2 } },
      { key: "humedad", texto: "Pesadez, sensación de humedad", puntos: { tierra: 2 } },
      { key: "alterno", texto: "Voy alternando según la tensión", puntos: { madera: 2 } },
    ],
  },
  {
    key: "estres",
    pregunta: "Cuando algo te supera, ¿cómo reaccionas?",
    opciones: [
      { key: "exploto", texto: "Me irrito o exploto", puntos: { madera: 3 } },
      { key: "acelero", texto: "Me acelero y me lleno de ansiedad", puntos: { fuego: 3 } },
      { key: "vueltas", texto: "Le doy vueltas sin parar", puntos: { tierra: 3 } },
      { key: "cierro", texto: "Me cierro y me pongo rígido/a", puntos: { metal: 3 } },
      { key: "bloqueo", texto: "Me bloqueo o me retiro", puntos: { agua: 3 } },
    ],
  },
  {
    key: "senales",
    pregunta: "¿Qué parte de tu cuerpo te avisa primero?",
    opciones: [
      { key: "ojos", texto: "Ojos cansados, uñas frágiles, tendones", puntos: { madera: 3 } },
      { key: "corazon", texto: "Palpitaciones, rubor en la cara", puntos: { fuego: 3 } },
      { key: "boca", texto: "Boca y labios, músculos flojos", puntos: { tierra: 3 } },
      { key: "piel", texto: "Piel, nariz, resfriados frecuentes", puntos: { metal: 3 } },
      { key: "lumbar", texto: "Lumbares, rodillas, oídos, pelo", puntos: { agua: 3 } },
    ],
  },
  {
    key: "relaciones",
    pregunta: "¿Cómo te sueles mostrar con los demás?",
    opciones: [
      { key: "directo", texto: "Directo/a y competitivo/a", puntos: { madera: 2 } },
      { key: "social", texto: "Muy social, necesito conexión", puntos: { fuego: 3 } },
      { key: "cuidador", texto: "Cuido de todos y me olvido de mí", puntos: { tierra: 3 } },
      { key: "reservado", texto: "Reservado/a, pongo distancia", puntos: { metal: 3 } },
      { key: "retraido", texto: "Retraído/a, me cuesta confiar", puntos: { agua: 3 } },
    ],
  },
  {
    key: "presion",
    pregunta: "Bajo presión, tiendes a…",
    opciones: [
      { key: "forzar", texto: "Forzar y empujar para avanzar", puntos: { madera: 3 } },
      { key: "dispersar", texto: "Dispersarte, hacer mil cosas a la vez", puntos: { fuego: 2 } },
      { key: "rutina", texto: "Aferrarte a lo conocido", puntos: { tierra: 3 } },
      { key: "controlar", texto: "Controlar y ordenarlo todo", puntos: { metal: 3 } },
      { key: "conservar", texto: "Retirarte y conservar energía", puntos: { agua: 2 } },
    ],
  },
  {
    key: "deseo",
    pregunta: "¿Qué echas de menos últimamente?",
    opciones: [
      { key: "avanzar", texto: "Avanzar, sentirme libre", puntos: { madera: 2 } },
      { key: "ilusion", texto: "Ilusión y alegría", puntos: { fuego: 2 } },
      { key: "calma", texto: "Calma y estabilidad", puntos: { tierra: 2 } },
      { key: "orden", texto: "Orden y poder soltar", puntos: { metal: 2 } },
      { key: "seguridad", texto: "Descanso y seguridad", puntos: { agua: 2 } },
    ],
  },
  {
    key: "antojo",
    pregunta: "¿Qué sabor te pide el cuerpo?",
    opciones: [
      { key: "acido", texto: "Ácido (limón, vinagre)", puntos: { madera: 2 } },
      { key: "amargo", texto: "Amargo (café, cacao)", puntos: { fuego: 2 } },
      { key: "dulce", texto: "Dulce", puntos: { tierra: 2 } },
      { key: "picante", texto: "Picante", puntos: { metal: 2 } },
      { key: "salado", texto: "Salado", puntos: { agua: 2 } },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// CICLOS · relación entre elementos (pasos 10 y 11)
// ─────────────────────────────────────────────────────────────────────────
/** Ciclo Sheng (generación / nutrición): cada elemento nutre al siguiente. */
export const CICLO_SHENG: Record<Elemento, Elemento> = {
  madera: "fuego",
  fuego: "tierra",
  tierra: "metal",
  metal: "agua",
  agua: "madera",
};

/** Ciclo Ke (control / dominación): cada elemento controla a otro. */
export const CICLO_KE: Record<Elemento, Elemento> = {
  madera: "tierra",
  tierra: "agua",
  agua: "fuego",
  fuego: "metal",
  metal: "madera",
};

/** Textos introductorios de cada ciclo (guion del curso). */
export const CICLO_INTRO = { sheng: letratcm9, ke: letratcm15 };

/** Explicación fisiológica de "X genera Y" (Sheng), indexada por el elemento origen X. */
export const SHENG_EXPLICACION: Record<Elemento, string> = {
  madera: letratcm14, // La Madera genera el Fuego (hígado → corazón)
  fuego: letratcm10,  // El Fuego genera la Tierra (corazón → bazo)
  tierra: letratcm11, // La Tierra genera el Metal (bazo → pulmón)
  metal: letratcm12,  // El Metal genera el Agua (pulmón → riñón)
  agua: letratcm13,   // El Agua genera la Madera (riñón → hígado)
};

/** Explicación fisiológica de "X controla Y" (Ke), indexada por el elemento origen X. */
export const KE_EXPLICACION: Record<Elemento, string> = {
  madera: letratcm16, // La Madera controla la Tierra (hígado → bazo)
  tierra: letratcm17, // La Tierra controla el Agua (bazo → riñón)
  agua: letratcm18,   // El Agua controla el Fuego (riñón → corazón)
  fuego: letratcm19,  // El Fuego controla el Metal (corazón → pulmón)
  metal: letratcm20,  // El Metal controla la Madera (pulmón → hígado)
};

// ─────────────────────────────────────────────────────────────────────────
// LA LENGUA · capítulo propio dentro de "Aprende a escucharte" (paso 12)
// ─────────────────────────────────────────────────────────────────────────
export const LENGUA = {
  intro: letratcm21,
  color: letratcm22,
  forma: letratcm23,
  capa: letratcm24,
  videos: { intro: "XiG2Ll57It4", color: "EC1-aTmn2aE", forma: "F8AiR97m0Qk", capa: "AhobpjkmH0I" },
};

// ─────────────────────────────────────────────────────────────────────────
// AUTO-OBSERVACIÓN · "Aprende a escucharte" (paso 12)
// ─────────────────────────────────────────────────────────────────────────
export interface SeccionObservacion {
  key: string;
  emoji: string;
  titulo: string;
  descripcion: string;
}

export const OBSERVACIONES: SeccionObservacion[] = [
  { key: "lengua", emoji: "👅", titulo: "La lengua", descripcion: "El mapa más rico del cuerpo en medicina china. Color, forma, capa y humedad cuentan tu estado interno." },
  { key: "rostro", emoji: "😊", titulo: "El rostro", descripcion: "El color y el brillo de la tez reflejan el estado de tus órganos y tu sangre." },
  { key: "voz", emoji: "🎤", titulo: "La voz", descripcion: "Una voz débil, entrecortada o demasiado fuerte habla del estado de tu energía." },
  { key: "postura", emoji: "💆", titulo: "La postura", descripcion: "Cómo te sostienes revela tensión, arraigo o agotamiento." },
  { key: "sensaciones", emoji: "🌡️", titulo: "Sensaciones de calor/frío", descripcion: "Tener frío o calor de forma habitual orienta hacia exceso o deficiencia." },
  { key: "sueno", emoji: "😴", titulo: "El sueño", descripcion: "Cómo, cuándo y cuánto duermes es una ventana directa a tu equilibrio." },
  { key: "digestion", emoji: "🍽️", titulo: "La digestión", descripcion: "El apetito, la pesadez y los horarios hablan de tu Tierra." },
  { key: "eliminacion", emoji: "💩", titulo: "Heces y orina", descripcion: "Con naturalidad: son de los mejores indicadores de tu estado interno." },
  { key: "emociones", emoji: "❤️", titulo: "Emociones predominantes", descripcion: "Cada emoción se asocia a un órgano; observarlas es observar tu energía." },
];

// ─────────────────────────────────────────────────────────────────────────
// TIPOS DE DATOS · lo que se guarda en metodo_tcm.data
// ─────────────────────────────────────────────────────────────────────────
export type Puntuaciones = Record<Elemento, number>;

export interface ResultadoTest {
  respuestas: Record<string, string>;      // key de pregunta -> key de opción
  puntos: Partial<Puntuaciones>;
}

export interface EstadoElemento {
  leido?: boolean;
  miniTest?: ResultadoTest | null;
}

export interface DatosTcm {
  testInicial?: ResultadoTest;
  elementos?: Partial<Record<Elemento, EstadoElemento>>;
  observarte?: Partial<Record<string, string>>;
  compromiso?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// HELPERS · puntuación, progreso y desbloqueo
// ─────────────────────────────────────────────────────────────────────────

const cero = (): Puntuaciones => ({ madera: 0, fuego: 0, tierra: 0, metal: 0, agua: 0 });

/** Calcula los puntos de un test a partir de sus respuestas y su definición. */
export function puntuarTest(
  preguntas: PreguntaTest[],
  respuestas: Record<string, string> | undefined,
): Partial<Puntuaciones> {
  const acc = cero();
  if (!respuestas) return acc;
  for (const p of preguntas) {
    const opKey = respuestas[p.key];
    if (!opKey) continue;
    const op = p.opciones.find((o) => o.key === opKey);
    if (!op) continue;
    for (const [el, n] of Object.entries(op.puntos)) {
      acc[el as Elemento] += n ?? 0;
    }
  }
  return acc;
}

/**
 * Puntuación AGREGADA del recorrido: test inicial + los mini-tests de cada
 * elemento ya completados. Es el dato que leen el perfil (paso 9) y tu propio
 * mapa (paso 11). Mayor puntuación = elemento más "cargado"/demandante.
 */
export function puntuaciones(data: DatosTcm | null | undefined): Puntuaciones {
  const total = cero();
  if (!data) return total;

  const sumar = (p?: Partial<Puntuaciones>) => {
    if (!p) return;
    for (const el of ORDEN_ELEMENTOS) total[el] += p[el] ?? 0;
  };

  sumar(data.testInicial?.puntos);
  for (const el of ORDEN_ELEMENTOS) {
    sumar(data.elementos?.[el]?.miniTest?.puntos);
  }
  return total;
}

/** Elemento con más carga (predominante hoy). */
export function elementoPredominante(data: DatosTcm | null | undefined): Elemento {
  const p = puntuaciones(data);
  return ORDEN_ELEMENTOS.reduce((max, el) => (p[el] > p[max] ? el : max), "madera" as Elemento);
}

/** Elemento(s) con menos carga: los que probablemente necesitan apoyo. */
export function elementosAApoyar(data: DatosTcm | null | undefined): Elemento[] {
  const p = puntuaciones(data);
  const min = Math.min(...ORDEN_ELEMENTOS.map((el) => p[el]));
  return ORDEN_ELEMENTOS.filter((el) => p[el] === min);
}

/** ¿Se ha completado el test inicial? (habilita el paso 2 "Tu mapa"). */
export function testInicialCompleto(data: DatosTcm | null | undefined): boolean {
  const r = data?.testInicial?.respuestas;
  if (!r) return false;
  return TEST_INICIAL.every((p) => !!r[p.key]);
}

/** ¿Se ha leído/completado un elemento? (gobierna el desbloqueo secuencial). */
export function elementoLeido(data: DatosTcm | null | undefined, el: Elemento): boolean {
  return !!data?.elementos?.[el]?.leido;
}

/**
 * Desbloqueo secuencial del viaje (Madera→Fuego→Tierra→Metal→Agua): un elemento
 * está disponible si es el primero o si el anterior ya se ha leído.
 */
export function elementoDesbloqueado(data: DatosTcm | null | undefined, el: Elemento): boolean {
  const i = ORDEN_ELEMENTOS.indexOf(el);
  if (i <= 0) return true;
  return elementoLeido(data, ORDEN_ELEMENTOS[i - 1]);
}

/** ¿Están los 5 elementos leídos? (habilita el paso 9 "Tu perfil completo"). */
export function viajeCompleto(data: DatosTcm | null | undefined): boolean {
  return ORDEN_ELEMENTOS.every((el) => elementoLeido(data, el));
}
