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
  letratcm8, letratcm9, letratcm15,
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
// OJO: al añadir o quitar un paso hay que retocar el `pageLabel` («n/9») del
// MetodoStepHeader de TODAS las páginas y los botones prev/next de las vecinas.
export const TCM_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Medicina China",     ruta: () => "/metodo/tcm" },
  { n: 2, titulo: "Los Cinco Elementos", ruta: () => "/metodo/tcm/elementos" },
  { n: 3, titulo: "Los ciclos", ruta: () => "/metodo/tcm/ciclos" },
  { n: 4, titulo: "Diagnóstico final", ruta: () => "/metodo/tcm/diagnostico" },
  { n: 5, titulo: "Tu lengua", ruta: () => "/metodo/tcm/lengua" },
  { n: 6, titulo: "Lee tu lengua", ruta: () => "/metodo/tcm/lengua/leer" },
  { n: 7, titulo: "Taoísmo", ruta: () => "/metodo/tcm/taoismo" },
  { n: 8, titulo: "Tu cocina diaria", ruta: () => "/metodo/tcm/recetas" },
  { n: 9, titulo: "Cursos", ruta: () => "/metodo/tcm/cursos" },
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

// ── Tests de balance (A/B/C = equilibrio/exceso/deficiencia) ─────────────────
// Modelo nuevo de los tests de cada elemento (2 por elemento). Cada opción marca
// el estado del elemento; el resultado (mayoría) alimenta el perfil. A=equilibrio,
// B=exceso, C=deficiencia, de forma consistente en todas las preguntas.
export type Balance = "equilibrio" | "exceso" | "deficiencia";

export interface OpcionBalance {
  key: string;            // "a" | "b" | "c" (estable, no cambiar tras publicar)
  texto: string;
  balance: Balance;
}
export interface PreguntaBalance {
  key: string;            // única: p.ej. "madera-t1-q1" (estable)
  pregunta: string;
  /** Preguntas opcionales (p.ej. la de mujeres) no bloquean el avance. */
  opcional?: boolean;
  opciones: OpcionBalance[];
}
export interface TestElemento {
  key: string;            // "madera-t1", "madera-t2" (estable)
  /** Subtítulo del test (bajo el "TEST DE LA MADERA"). */
  titulo?: string;
  preguntas: PreguntaBalance[];
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
  diaADia: string;               // cómo aparece en la Vida cotidiana
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
    color: "#6f9463",
    significado:
      "La Madera es el impulso que empuja hacia arriba, como el brote que rompe la tierra en primavera. Es la energía de crecer, decidir, planificar y avanzar. Cuando fluye, hay claridad y capacidad de emprender; cuando se estanca, aparece la frustración.",
    organos: "hígado (yin) y vesícula biliar (yang)",
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
    reflexion: "¿Dónde en tu Vida sientes que quieres avanzar y algo te lo impide?",
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
        key: "madera-flujo",
        pregunta:
          "Cuando el Qi del hígado no fluye, el estancamiento puede afectar a la digestión, la secreción de bilis, la circulación de la Sangre o el ciclo menstrual. ¿Notas alteraciones en alguno de estos?",
        opciones: [
          { key: "no", texto: "No, todo funciona con normalidad", puntos: { madera: 0 } },
          { key: "a-veces", texto: "A veces, sobre todo en épocas de estrés", puntos: { madera: 2 } },
          { key: "a-menudo", texto: "A menudo: digestión, ciclo o circulación alterados", puntos: { madera: 4 } },
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
      {
        key: "madera-ojos-tendones",
        pregunta:
          "Los ojos y los tendones son el principal termómetro de la Madera. ¿Notas molestias visuales, tensión en los tendones, rigidez o pérdida de flexibilidad?",
        opciones: [
          { key: "no", texto: "No, mi vista y mi cuerpo están flexibles", puntos: { madera: 0 } },
          { key: "a-veces", texto: "A veces: vista cansada o cuerpo algo rígido", puntos: { madera: 2 } },
          { key: "a-menudo", texto: "A menudo: molestias visuales, tendones tensos o rígidos", puntos: { madera: 4 } },
        ],
      },
      {
        key: "madera-movimiento",
        pregunta:
          "La Madera necesita movimiento y libre expresión del Qi. ¿Te mueves con regularidad y dejas salir la ira o la frustración, o tiendes a reprimirlas?",
        opciones: [
          { key: "fluye", texto: "Me muevo a menudo y expreso lo que siento", puntos: { madera: 0 } },
          { key: "irregular", texto: "Voy a rachas; a veces me la trago", puntos: { madera: 2 } },
          { key: "reprimo", texto: "Me muevo poco y suelo reprimir la frustración", puntos: { madera: 4 } },
        ],
      },
      {
        key: "madera-sudoracion",
        pregunta:
          "El sabor ácido de la Madera consolida los fluidos e inhibe la sudoración. ¿Sudas de forma excesiva o notas que pierdes fluidos con facilidad?",
        opciones: [
          { key: "no", texto: "No, mi sudoración es normal", puntos: { madera: 0 } },
          { key: "a-veces", texto: "A veces sudo más de la cuenta", puntos: { madera: 2 } },
          { key: "a-menudo", texto: "A menudo: sudoración excesiva o fluidos que se escapan", puntos: { madera: 3 } },
        ],
      },
      {
        key: "madera-rostro",
        pregunta:
          "En la observación del rostro, un tinte azul verdoso puede indicar desequilibrio de la Madera. ¿Has notado ese tono en alguna zona de tu cara?",
        opciones: [
          { key: "no", texto: "No, mi tez tiene buen color", puntos: { madera: 0 } },
          { key: "a-veces", texto: "Alguna vez, de forma sutil", puntos: { madera: 2 } },
          { key: "si", texto: "Sí, un tinte azul verdoso apreciable", puntos: { madera: 3 } },
        ],
      },
    ],
  },

  fuego: {
    id: "fuego",
    nombre: "Fuego",
    color: "#d1495b",
    significado:
      "El Fuego es la plenitud del verano: calor, alegría, conexión. Es la energía del corazón, la que nos permite disfrutar, relacionarnos y dar sentido a la Vida. En equilibrio hay entusiasmo sereno; en exceso, agitación; en defecto, apatía.",
    organos: "corazón (yin) e intestino delgado (yang)",
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
      "Se nota en tu capacidad de disfrutar del presente, en cómo duermes, en tu Vida social y en si tu entusiasmo es sostenible o te quema.",
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
    organos: "bazo/páncreas (yin) y estómago (yang)",
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
    organos: "pulmón (yin) e intestino grueso (yang)",
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
    organos: "riñón (yin) y vejiga (yang)",
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
// YouTube + las recomendaciones clásicas (infusiones, hierbas, estilo de Vida,
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

/** Explicación fisiológica de "X genera Y" (Sheng), indexada por el elemento
 *  origen X. Cada elemento del array es un PÁRRAFO (respeta los saltos de línea). */
export const SHENG_EXPLICACION: Record<Elemento, string[]> = {
  // La Madera genera el Fuego (hígado → corazón)
  madera: [
    "La Madera genera el Fuego, lo que nos dice que el hígado influye en el corazón y que la expansión y el crecimiento interior generan amor y pasión.",
    "El hígado es el gran regulador de la sangre, puede retener sangre para no sobrecargar al corazón. El hígado es el encargado de gestionar los lípidos, la glucosa y el colesterol. Todos sabemos que demasiado colesterol en la sangre afecta al corazón irremediablemente, por ello un hígado regulado favorece un metabolismo adecuado.",
    "Además, el hígado se encarga de crear las enzimas que hacen que la sangre pueda cumplir su función, además de permitir la creación de plasma.",
    "Si tenemos un hígado regulado, tendremos un corazón protegido y una sangre fuerte.",
  ],
  // El Fuego genera la Tierra (corazón → bazo)
  fuego: [
    "El Fuego genera la Tierra, esto en nuestros órganos quiere decir que el estado del corazón afecta al bazo y emocionalmente que la pasión y el amor generan estabilidad.",
    "El corazón se dedica a bombear sangre a todo el cuerpo, el bazo, en cambio, se dedica a filtrar las células de sangre, asegurándose de que solo las células flexibles y saludables vuelven a la circulación.",
    "Según la medicina tradicional china, el bazo convierte los nutrientes en Qi. Esto tiene sentido, porque se ha demostrado que el bazo es capaz de usar los nutrientes para crear más sangre.",
    "También tradicionalmente se dice que el bazo mantiene la sangre en las arterias y venas. Recordemos que el bazo se considera parte del sistema inmunitario, por lo que si filtra correctamente las toxinas de la sangre reducirá la inflamación, el proceso en el cual la sangre sale de las arterias para entrar en los órganos.",
    "En conclusión, el corazón y la sangre que bombea influyen directamente en la función que nuestro bazo hará para mantener nuestro equilibrio.",
  ],
  // La Tierra genera el Metal (bazo → pulmón)
  tierra: [
    "La Tierra genera Metal, en nuestros órganos se relaciona con que el bazo influye al pulmón, y en nuestras emociones con que la transformación y nutrición generan paz interior.",
    "Ambos son órganos importantes del sistema inmunitario. El bazo filtra la sangre y nos protege. La sangre filtrada vuelve a llegar al pulmón, donde se produce el intercambio de CO2 por oxígeno nuevo para seguir circulando.",
    "El bazo se asegura de que solo células saludables sean capaces de volver a la circulación, esto es fundamental a la hora de transportar oxígeno. El bazo se asegura de limpiar la sangre, lo que dejará menos toxinas y peligros para los pulmones, permitiendo que estos se puedan ocupar de filtrar las toxinas de la respiración, en vez de tener que hacerse cargo también de las que ya hay en el cuerpo.",
    "Un correcto funcionamiento del bazo influye directamente en nuestros pulmones.",
  ],
  // El Metal genera el Agua (pulmón → riñón)
  metal: [
    "El Metal genera el Agua, esto quiere decir que nuestra paz interior genera sabiduría y que nuestros pulmones influyen en nuestros riñones.",
    "¿Cómo es esto posible? La medicina china, cuando habla del riñón, no siempre habla de los riñones, sino de las glándulas suprarrenales, esas glándulas que viven arriba de los riñones, produciendo hormonas. Por ello, la respiración está directamente relacionada con la liberación de cortisol.",
    "Si mantenemos una respiración calmada y tranquila, el cuerpo no tendrá necesidad de estresarse y, por tanto, no hará falta liberar cortisol, manteniendo así un equilibrio interno.",
  ],
  // El Agua genera la Madera (riñón → hígado)
  agua: [
    "El Agua genera la Madera, lo que quiere decir que el riñón influye en el hígado, y que la intuición y la sabiduría generan crecimiento.",
    "Se ha demostrado que cuanto más cortisol generamos —que recordemos que este cortisol viene de los riñones indirectamente—, incrementa la función del hígado, dado que tiene más hormonas que gestionar.",
    "Si el riñón no necesita liberar hormonas estresantes como la adrenalina o el cortisol y solo se dedica a filtrar la sangre, el hígado estará menos sobrecargado, permitiendo que tenga una función eficiente.",
    "Recordemos también que los riñones regulan los electrolitos de la sangre y la presión arterial. Esto puede influenciar a nuestro hígado, porque el hígado es el gran regulador de la sangre y de las enzimas que viajan en ellas.",
    "Un correcto funcionamiento de los riñones deja al hígado tranquilo, preparado para cumplir con la función que tiene que hacer.",
  ],
};

/** Explicación fisiológica de "X controla Y" (Ke), indexada por el elemento
 *  origen X. Cada elemento del array es un PÁRRAFO (respeta los saltos de línea). */
export const KE_EXPLICACION: Record<Elemento, string[]> = {
  // La Madera controla la Tierra (hígado → bazo)
  madera: [
    "La Madera controla a la Tierra, esto quiere decir que el hígado influye en el bazo, y que el enfado degenera la estabilidad.",
    "El hígado detoxifica nuestra sangre, pero cuando la detoxificación es insuficiente, aumenta la carga de toxinas de las que el bazo tiene que hacerse cargo. Pero el bazo no está preparado para esta carga, por lo que es sobrecargado y, como consecuencia, se degenera.",
    "Una de las formas de sobrecargar al hígado es con el exceso de enfado. Cada vez que estamos enfadados, generamos grandes cantidades de cortisol para poder manifestar ese enfado.",
    "Por eso, una de las formas de cuidarte es encontrar la causa por la que estás enfadado y poder gestionarla, para que así no tengas que hacerte daño.",
  ],
  // La Tierra controla el Agua (bazo → riñón)
  tierra: [
    "La Tierra controla al Agua, lo que quiere decir que el bazo controla los riñones, y que la preocupación trae miedo.",
    "El bazo se encarga de detoxificar nuestra sangre, pero si esta acción no es suficiente o está sobrecargada, afecta directamente a nuestros riñones, que también se encargan de filtrar la sangre.",
  ],
  // El Agua controla el Fuego (riñón → corazón)
  agua: [
    "El Agua controla al Fuego, por lo tanto los riñones controlan al corazón, y el miedo causa sobreagitación mental.",
    "El riñón regula electrolitos, y estos electrolitos regulan la contracción cardíaca. Por lo que cuando la regulación no es correcta o el riñón está sobrecargado, pueden producirse contracciones irregulares.",
    "Unos riñones intranquilos provocan un corazón arrítmico.",
  ],
  // El Fuego controla el Metal (corazón → pulmón)
  fuego: [
    "El Fuego controla al Metal, lo que quiere decir que el corazón influye en los pulmones, y que la agitación mental puede causar tristeza, dolor o apego.",
    "La frecuencia con la que el corazón bombea sangre afecta la frecuencia con que las células sanguíneas recogen oxígeno en los pulmones. Por lo que si un corazón late arrítmicamente, la función pulmonar y el intercambio de dióxido de carbono por oxígeno se verá afectado.",
    "La conclusión es que si un corazón late arrítmicamente afectará a la oxigenación celular de todo el cuerpo.",
  ],
  // El Metal controla la Madera (pulmón → hígado)
  metal: [
    "El Metal controla la Madera, lo que significa que los pulmones controlan al hígado, y que un exceso de dolor generará falta de dirección en la Vida y enfado.",
    "La velocidad y el cómo respiramos afecta inmediatamente a nuestro cuerpo a través del sistema nervioso.",
    "Si respiramos de forma irregular o intranquila, esto genera estrés, lo que hace que nuestro hígado tenga que trabajar más para gestionar todo ese cortisol y adrenalina. Esta manifestación de confusión mental retroalimentará nuestro deterioro físico.",
    "Una respiración sostenida, constante y hecha por la nariz permite que le recordemos a nuestro cuerpo que estamos a salvo.",
  ],
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
// TESTS DE BALANCE · 2 por elemento (A=equilibrio, B=exceso, C=deficiencia)
// Los va pasando María. Añadir un test = añadir aquí (los `key` son estables).
// ─────────────────────────────────────────────────────────────────────────
const abc = (a: string, b: string, c: string): OpcionBalance[] => [
  { key: "a", texto: a, balance: "equilibrio" },
  { key: "b", texto: b, balance: "exceso" },
  { key: "c", texto: c, balance: "deficiencia" },
];

export const TESTS_ELEMENTO: Partial<Record<Elemento, TestElemento[]>> = {
  madera: [
    {
      key: "madera-t1",
      titulo: "¿Cómo está tu elemento Madera?",
      preguntas: [
        { key: "madera-t1-q1", pregunta: "Cuando aparece una oportunidad nueva…", opciones: abc(
          "Me ilusiono, la evalúo y, si tiene sentido, doy el paso.",
          "Quiero aprovecharla cuanto antes y me impaciento si las cosas no avanzan rápido.",
          "Me cuesta decidirme y suelo dejar pasar la oportunidad por miedo o dudas.") },
        { key: "madera-t1-q2", pregunta: "Cuando alguien no hace las cosas como tú esperabas…", opciones: abc(
          "Intento comprender la situación y buscar una solución.",
          "Me irrito con facilidad y siento ganas de corregir o controlar.",
          "Prefiero no decir nada, aunque por dentro me moleste.") },
        { key: "madera-t1-q3", pregunta: "¿Cómo afrontas los cambios?", opciones: abc(
          "Suelo adaptarme sin perder mi rumbo.",
          "Quiero que todo se resuelva inmediatamente y me frustra la espera.",
          "Los cambios me generan inseguridad y prefiero quedarme en lo conocido.") },
        { key: "madera-t1-q4", pregunta: "Cuando tienes un objetivo importante…", opciones: abc(
          "Elaboro un plan y avanzo paso a paso.",
          "Me obsesiono con conseguirlo y me exijo demasiado.",
          "Me cuesta empezar o abandono antes de intentarlo.") },
        { key: "madera-t1-q5", pregunta: "Cuando surge un conflicto…", opciones: abc(
          "Hablo con claridad y respeto para resolverlo.",
          "Reacciono con enfado o me cuesta controlar el tono.",
          "Evito el conflicto aunque eso me perjudique.") },
        { key: "madera-t1-q6", pregunta: "¿Cómo describirías tu energía habitual?", opciones: abc(
          "Constante y flexible.",
          "Intensa, acelerada y con sensación de ir siempre deprisa.",
          "Baja, con dificultad para arrancar o mantener el impulso.") },
        { key: "madera-t1-q7", pregunta: "¿Te resulta fácil tomar decisiones?", opciones: abc(
          "Sí, suelo decidir con seguridad.",
          "Sí, pero a veces decido demasiado rápido.",
          "Me cuesta mucho decidir y cambio de opinión con frecuencia.") },
        { key: "madera-t1-q8", pregunta: "Cuando las cosas no salen como esperabas…", opciones: abc(
          "Busco una alternativa y continúo.",
          "Me enfado y siento mucha frustración.",
          "Me desanimo y pierdo las ganas de seguir.") },
        { key: "madera-t1-q9", pregunta: "¿Cómo sientes tu cuerpo cuando atraviesas épocas de estrés?", opciones: abc(
          "Noto cierta tensión, pero consigo liberarla.",
          "Se me cargan el cuello, los hombros o la mandíbula con frecuencia.",
          "Me siento sin fuerza, con sensación de rigidez o debilidad muscular.") },
        { key: "madera-t1-q10", pregunta: "¿Cómo describirías tu carácter?", opciones: abc(
          "Decidido, pero flexible.",
          "Muy competitivo, impaciente o dominante.",
          "Reservado, inseguro o con dificultad para hacerme valer.") },
        { key: "madera-t1-q11", pregunta: "¿Cómo reaccionas cuando algo bloquea tus planes?", opciones: abc(
          "Busco otro camino.",
          "Me desespero porque siento que todo va demasiado lento.",
          "Me paralizo y no sé cómo continuar.") },
        { key: "madera-t1-q12", pregunta: "¿Eres capaz de visualizar con facilidad nuevos caminos para tu Vida?", opciones: abc(
          "Sí, suelo tener una visión clara de hacia dónde quiero ir.",
          "Tengo muchos planes e ideas y quiero hacerlos todos cuanto antes.",
          "Me cuesta imaginar el futuro y me da miedo salir de mi zona de confort.") },
      ],
    },
    {
      key: "madera-t2",
      titulo: "Tu Qi: cuerpo y emociones",
      preguntas: [
        { key: "madera-t2-q1", pregunta: "Cuando atraviesas una época de estrés…", opciones: abc(
          "Consigo expresar lo que siento y recupero el equilibrio con relativa facilidad.",
          "Siento una presión o un nudo en el pecho, el estómago o el abdomen que parece acompañar mis emociones.",
          "Me cuesta identificar lo que siento, pero noto que algo «se queda dentro».") },
        { key: "madera-t2-q2", pregunta: "¿Cómo suele reaccionar tu digestión cuando estás preocupado o enfadado?", opciones: abc(
          "Apenas noto cambios.",
          "Aparecen hinchazón, sensación de plenitud o digestiones pesadas.",
          "Pierdo el apetito o noto que mi digestión se vuelve muy irregular.") },
        { key: "madera-t2-q3", pregunta: "Cuando reprimes una emoción durante varios días…", opciones: abc(
          "Busco una forma saludable de expresarla.",
          "Acabo sintiendo mucha tensión física o emocional.",
          "Me desconecto de lo que siento y me cuesta hablar de ello.") },
        { key: "madera-t2-q4", pregunta: "¿Sueles notar tensión o molestias en alguna de estas zonas sin una causa clara?", opciones: abc(
          "Rara vez.",
          "Pecho, costillas, abdomen, mamas o bajo vientre.",
          "No dolor, pero sí sensación de bloqueo o rigidez general.") },
        { key: "madera-t2-q5", pregunta: "¿Cómo sientes que fluyen tus emociones?", opciones: abc(
          "Las vivo, las expreso y después siguen su curso.",
          "Se acumulan hasta que exploto.",
          "Me cuesta sentirlas o expresarlas y tiendo a guardármelas.") },
        { key: "madera-t2-q6", pregunta: "¿Notas que tus síntomas físicos cambian según tu estado emocional?", opciones: abc(
          "Apenas lo noto.",
          "Sí, cuando tengo estrés aparecen molestias digestivas, tensión o sensación de presión.",
          "No estoy seguro, aunque suelo sentirme más apagado cuando paso por momentos difíciles.") },
        { key: "madera-t2-q7", pregunta: "En las mujeres (opcional). Antes o durante la menstruación…", opcional: true, opciones: abc(
          "Apenas noto cambios importantes.",
          "Siento más tensión, distensión, irritabilidad o molestias en los pechos o el abdomen.",
          "Me siento con muy poca energía o emocionalmente bloqueada.") },
        { key: "madera-t2-q8", pregunta: "En los últimos meses…", opciones: abc(
          "Siento que mi energía fluye y avanzo con naturalidad.",
          "Tengo la sensación de estar «atascado», como si algo no terminara de desbloquearse.",
          "Más que bloqueado, siento que me falta impulso para moverme hacia delante.") },
      ],
    },
  ],
  fuego: [
    {
      key: "fuego-t1",
      titulo: "¿Cómo está tu elemento Fuego?",
      preguntas: [
        { key: "fuego-t1-q1", pregunta: "Cuando estás con otras personas…", opciones: abc(
          "Disfruto de la compañía, pero también de mis momentos de tranquilidad.",
          "Necesito estar rodeado de gente o buscando constantemente nuevos estímulos.",
          "Suelo mantenerme al margen y me cuesta abrirme.") },
        { key: "fuego-t1-q2", pregunta: "¿Cómo expresas lo que sientes?", opciones: abc(
          "Lo hago con naturalidad y sinceridad.",
          "Mis emociones son muy intensas y a veces me cuesta contenerlas.",
          "Me cuesta expresar lo que siento, incluso con personas cercanas.") },
        { key: "fuego-t1-q3", pregunta: "¿Cómo suele ser tu descanso?", opciones: abc(
          "Duermo bien y me levanto descansado.",
          "Me cuesta desconectar, doy muchas vueltas a la cabeza o me despierto durante la noche.",
          "Duermo, pero aun así me levanto sin energía o con sensación de apatía.") },
        { key: "fuego-t1-q4", pregunta: "Cuando alguien no responde como esperabas…", opciones: abc(
          "Lo acepto sin darle demasiadas vueltas.",
          "Me afecta mucho y puedo reaccionar de forma impulsiva o intensa.",
          "Prefiero alejarme antes que mostrar cómo me siento.") },
        { key: "fuego-t1-q5", pregunta: "¿Cómo describirías tu forma de relacionarte?", opciones: abc(
          "Cercana, auténtica y equilibrada.",
          "Muy intensa; necesito mucha atención o contacto.",
          "Reservada; me cuesta crear vínculos profundos.") },
        { key: "fuego-t1-q6", pregunta: "¿Qué ocurre cuando tienes tiempo libre?", opciones: abc(
          "Alterno momentos de actividad y de calma.",
          "Necesito estar haciendo algo o viendo gente constantemente.",
          "Me cuesta encontrar ilusión o motivación para hacer planes.") },
        { key: "fuego-t1-q7", pregunta: "¿Cómo reaccionas cuando estás nervioso?", opciones: abc(
          "Intento calmarme y recuperar el equilibrio.",
          "Hablo mucho, me cuesta parar o siento una gran inquietud.",
          "Me cierro, hablo poco y prefiero aislarme.") },
        { key: "fuego-t1-q8", pregunta: "¿Cómo sientes tu energía emocional?", opciones: abc(
          "Estable y alegre la mayor parte del tiempo.",
          "Muy cambiante, pasando de la euforia al agotamiento con facilidad.",
          "Bastante apagada o con dificultad para entusiasmarme.") },
        { key: "fuego-t1-q9", pregunta: "¿Cómo te sientes cuando estás solo?", opciones: abc(
          "Disfruto tanto de la soledad como de la compañía.",
          "Me incomoda y necesito distraerme o contactar con alguien.",
          "Estoy acostumbrado, aunque a veces siento que me cuesta conectar con los demás.") },
        { key: "fuego-t1-q10", pregunta: "¿Sientes que las personas suelen comprender cómo te sientes?", opciones: abc(
          "Sí, normalmente consigo expresarme con claridad.",
          "A veces siento que mis emociones desbordan a los demás.",
          "Muchas veces siento que no consigo transmitir lo que llevo dentro.") },
        { key: "fuego-t1-q11", pregunta: "¿Cómo describirías tu entusiasmo por la Vida?", opciones: abc(
          "Tengo ilusión por nuevos proyectos sin perder la calma.",
          "Me entusiasmo muchísimo al principio, pero me acelero con facilidad.",
          "Me cuesta ilusionarme o encontrar aquello que me inspire.") },
        { key: "fuego-t1-q12", pregunta: "¿Qué frase describe mejor tu momento actual?", opciones: abc(
          "Me siento conectado conmigo mismo y con las personas que quiero.",
          "Vivo con mucha intensidad y me cuesta bajar el ritmo.",
          "Siento que me falta calor, ilusión o conexión con los demás.") },
      ],
    },
    {
      key: "fuego-t2",
      titulo: "Tu corazón: cuerpo y energía",
      preguntas: [
        { key: "fuego-t2-q1", pregunta: "Cuando atraviesas una época de mucho estrés o intensidad emocional…", opciones: abc(
          "Mi cuerpo apenas cambia y consigo mantener la calma.",
          "Noto palpitaciones, calor en el pecho o la cara, o me cuesta relajarme.",
          "Me siento débil, con poca energía o noto las manos y los pies fríos.") },
        { key: "fuego-t2-q2", pregunta: "¿Cómo describirías tu concentración?", opciones: abc(
          "Me resulta fácil mantener la atención y pensar con claridad.",
          "Mi mente va demasiado deprisa y salto de un pensamiento a otro.",
          "Me cuesta concentrarme, tengo olvidos o siento la mente apagada.") },
        { key: "fuego-t2-q3", pregunta: "¿Cómo suele reaccionar tu cuerpo cuando tus emociones se desbordan?", opciones: abc(
          "Soy consciente de ellas y consigo recuperar el equilibrio.",
          "Mi cara se enrojece, siento calor o mi corazón late con fuerza.",
          "Me siento agotado y sin fuerza para reaccionar.") },
        { key: "fuego-t2-q4", pregunta: "¿Has notado alguno de estos síntomas con frecuencia?", opciones: abc(
          "Ninguno de forma habitual.",
          "Sabor amargo en la boca, sensación de calor o tendencia a sonrojarme fácilmente.",
          "Sensación de frío, especialmente en manos y pies, o mala circulación.") },
        { key: "fuego-t2-q5", pregunta: "¿Cómo sientes la energía de tu corazón?", opciones: abc(
          "Estable, tranquila y con vitalidad.",
          "Muy acelerada o intensa, como si me costara bajar el ritmo.",
          "Débil o apagada, con poca resistencia física o emocional.") },
        { key: "fuego-t2-q6", pregunta: "Cuando te miras al espejo…", opciones: abc(
          "Mi rostro suele reflejar vitalidad y naturalidad.",
          "Con frecuencia noto la cara muy enrojecida o con sensación de calor.",
          "Mi rostro se ve apagado o sin demasiado brillo.") },
      ],
    },
  ],
  tierra: [
    {
      key: "tierra-t1",
      titulo: "¿Cómo está tu elemento Tierra?",
      preguntas: [
        { key: "tierra-t1-q1", pregunta: "Cuando alguien cercano necesita ayuda…", opciones: abc(
          "Le apoyo sin olvidarme de mis propias necesidades.",
          "Me implico tanto que termino intentando resolverle la Vida.",
          "Me cuesta ponerme en primer lugar y suelo decir que sí aunque no pueda.") },
        { key: "tierra-t1-q2", pregunta: "¿Cómo es tu relación con la comida?", opciones: abc(
          "Como con tranquilidad y suelo quedar satisfecho.",
          "Como por ansiedad, preocupación o para sentirme mejor.",
          "Después de comer suelo sentirme pesado, hinchado o con poca energía.") },
        { key: "tierra-t1-q3", pregunta: "Cuando aparece un cambio importante…", opciones: abc(
          "Lo valoro con calma y me adapto si es necesario.",
          "Me cuesta soltar lo conocido y necesito que todo permanezca igual.",
          "Me siento inseguro y busco que otros decidan por mí.") },
        { key: "tierra-t1-q4", pregunta: "¿Qué ocurre con tus pensamientos cuando tienes un problema?", opciones: abc(
          "Reflexiono, saco conclusiones y sigo adelante.",
          "Le doy vueltas una y otra vez sin encontrar una solución.",
          "Me bloqueo y dudo de mi capacidad para resolverlo.") },
        { key: "tierra-t1-q5", pregunta: "¿Cómo cuidas de ti?", opciones: abc(
          "Dedico tiempo tanto a mí como a las personas que quiero.",
          "Cuido mucho de los demás y me cuesta delegar o soltar el control.",
          "Me olvido de mis propias necesidades para atender las de los demás.") },
        { key: "tierra-t1-q6", pregunta: "¿Cómo describirías tu autoestima en este momento?", opciones: abc(
          "Me siento seguro de quién soy, sin necesidad de demostrar nada.",
          "Necesito sentir que soy útil o necesario para los demás.",
          "Me cuesta reconocer mi propio valor y suelo poner a los demás por delante.") },
        { key: "tierra-t1-q7", pregunta: "¿Cómo responde tu digestión habitualmente?", opciones: abc(
          "Es ligera y estable.",
          "Tiendo a comer más de la cuenta o siento pesadez con frecuencia.",
          "Suelo tener hinchazón, digestiones lentas o heces blandas.") },
        { key: "tierra-t1-q8", pregunta: "¿Cómo sientes tu energía a lo largo del día?", opciones: abc(
          "Se mantiene bastante estable.",
          "Tengo energía, pero a veces la gasto en exceso preocupándome por todo.",
          "Me siento cansado, especialmente después de comer.") },
        { key: "tierra-t1-q9", pregunta: "Cuando alguien tiene un problema…", opciones: abc(
          "Escucho, acompaño y confío en que encontrará su camino.",
          "Siento la necesidad de intervenir y hacerme cargo de la situación.",
          "Absorbo sus emociones y termino agotado.") },
        { key: "tierra-t1-q10", pregunta: "¿Qué papel tiene el dulce en tu Vida?", opciones: abc(
          "Lo disfruto de vez en cuando, sin depender de él.",
          "Lo busco cuando estoy preocupado o necesito consuelo.",
          "Tengo antojos frecuentes de dulce, especialmente cuando estoy cansado o decaído.") },
        { key: "tierra-t1-q11", pregunta: "¿Cómo describirías tu cuerpo en este momento?", opciones: abc(
          "Me siento fuerte y estable.",
          "Tiendo a acumular peso o líquidos con facilidad.",
          "Noto poca fuerza muscular o sensación de debilidad.") },
        { key: "tierra-t1-q12", pregunta: "¿Qué frase describe mejor tu momento actual?", opciones: abc(
          "Me siento nutrido y capaz de cuidar de los demás sin perderme a mí mismo.",
          "Me cuesta soltar el control y me preocupo demasiado por quienes quiero.",
          "Siento que necesito volver a cuidar de mí y recuperar mi propio centro.") },
      ],
    },
    {
      key: "tierra-t2",
      titulo: "Tu bazo: transformación y sostén",
      preguntas: [
        { key: "tierra-t2-q1", pregunta: "Después de comer…", opciones: abc(
          "Me siento saciado y con energía para continuar el día.",
          "Siento pesadez, sueño o necesito descansar.",
          "Me quedo sin fuerzas y noto que cualquier comida me agota.") },
        { key: "tierra-t2-q2", pregunta: "¿Cómo describirías tu cuerpo últimamente?", opciones: abc(
          "Ligero y con una energía estable.",
          "Siento retención de líquidos, hinchazón o acumulación de mucosidad con facilidad.",
          "Me siento débil, con poca fuerza física o tono muscular.") },
        { key: "tierra-t2-q3", pregunta: "¿Has notado alguno de estos signos con frecuencia?", opciones: abc(
          "Ninguno de ellos.",
          "Sensación de boca pastosa o un sabor dulce o grasiento sin una causa evidente.",
          "Aparición de hematomas con facilidad o pequeños sangrados sin golpes importantes.") },
        { key: "tierra-t2-q4", pregunta: "¿Cómo responde tu mente durante el día?", opciones: abc(
          "Me siento centrado y pienso con claridad.",
          "Me cuesta dejar de dar vueltas a las mismas preocupaciones.",
          "Tengo dificultad para concentrarme y siento la mente cansada o «nublada».") },
        { key: "tierra-t2-q5", pregunta: "¿Cómo te sientes físicamente al levantarte por la mañana?", opciones: abc(
          "Descansado y con ganas de empezar el día.",
          "Me noto pesado o con sensación de hinchazón.",
          "Me cuesta arrancar y siento que mi energía tarda mucho en despertar.") },
        { key: "tierra-t2-q6", pregunta: "¿Qué frase describe mejor cómo recibes el cuidado y el afecto?", opciones: abc(
          "Sé cuidar de los demás y también permitirme recibir.",
          "Me cuesta soltar el control y siento que debo hacerme cargo de todo.",
          "Me cuesta sentirme sostenido y, a menudo, olvido cuidar de mí mismo.") },
        { key: "tierra-t2-q7", pregunta: "Cuando tienes muchas cosas en la cabeza…", opciones: abc(
          "Las organizo y voy resolviéndolas poco a poco.",
          "No puedo dejar de pensar en ellas, incluso cuando intento descansar.",
          "Me abruman y termino sin saber por dónde empezar.") },
      ],
    },
  ],
  metal: [
    {
      key: "metal-t1",
      titulo: "¿Cómo está tu elemento Metal?",
      preguntas: [
        { key: "metal-t1-q1", pregunta: "Cuando una etapa de tu Vida termina…", opciones: abc(
          "Agradezco lo vivido y sigo adelante.",
          "Me cuesta aceptar el cambio y necesito que todo permanezca como estaba.",
          "Me aferro al pasado y me cuesta cerrar ciclos.") },
        { key: "metal-t1-q2", pregunta: "¿Cómo describirías tu forma de organizar tu Vida?", opciones: abc(
          "Mantengo un orden que me aporta tranquilidad sin volverme rígido.",
          "Necesito que todo esté bajo control y me incomoda mucho el desorden.",
          "Me cuesta organizarme y siento que el caos me supera.") },
        { key: "metal-t1-q3", pregunta: "Cuando alguien cruza uno de tus límites…", opciones: abc(
          "Lo expreso con respeto y claridad.",
          "Reacciono de forma tajante o muy crítica.",
          "Me cuesta decir que no y termino cediendo.") },
        { key: "metal-t1-q4", pregunta: "¿Cómo vives los errores?", opciones: abc(
          "Los veo como una oportunidad para aprender.",
          "Soy muy exigente conmigo mismo y me cuesta aceptar la imperfección.",
          "Me desanimo con facilidad y dudo de mi propio valor.") },
        { key: "metal-t1-q5", pregunta: "¿Cómo te adaptas a los cambios inesperados?", opciones: abc(
          "Suelo adaptarme sin perder mi equilibrio.",
          "Me generan mucha incomodidad porque rompen mis planes.",
          "Me desorganizan y siento que pierdo el rumbo.") },
        { key: "metal-t1-q6", pregunta: "¿Qué relación tienes con el pasado?", opciones: abc(
          "Lo recuerdo con cariño, pero no condiciona mi presente.",
          "Me cuesta aceptar que algunas cosas ya no volverán a ser como antes.",
          "Hay personas o situaciones que todavía no consigo soltar.") },
        { key: "metal-t1-q7", pregunta: "¿Cómo describirías tu respiración la mayor parte del tiempo?", opciones: abc(
          "Profunda y tranquila.",
          "Tensa o contenida cuando necesito controlar una situación.",
          "Superficial, como si respirara sin llenar completamente los pulmones.") },
        { key: "metal-t1-q8", pregunta: "¿Cómo responde tu cuerpo habitualmente?", opciones: abc(
          "Rara vez enfermo y me recupero con facilidad.",
          "Suelo tener estreñimiento, congestión nasal o problemas de piel cuando estoy bajo presión.",
          "Me resfrío con facilidad o siento que mis defensas son bajas.") },
        { key: "metal-t1-q9", pregunta: "¿Cómo reaccionas cuando alguien hace las cosas de una forma diferente a la tuya?", opciones: abc(
          "Respeto que existan diferentes maneras de hacer las cosas.",
          "Me cuesta no corregir o señalar lo que considero incorrecto.",
          "Me adapto a los demás, incluso cuando va en contra de lo que pienso.") },
        { key: "metal-t1-q10", pregunta: "¿Cómo sientes tu autoestima?", opciones: abc(
          "Reconozco mi valor sin necesidad de compararme.",
          "Soy muy crítico conmigo mismo y rara vez siento que es suficiente.",
          "Me cuesta reconocer mis cualidades y el entorno influye mucho en cómo me siento.") },
        { key: "metal-t1-q11", pregunta: "¿Has notado alguno de estos síntomas con frecuencia?", opciones: abc(
          "Ninguno de ellos.",
          "Piel sensible, estreñimiento o congestión nasal persistente.",
          "Resfriados frecuentes, respiración superficial o problemas recurrentes de piel.") },
        { key: "metal-t1-q12", pregunta: "¿Qué frase describe mejor tu momento actual?", opciones: abc(
          "Vivo con orden y flexibilidad, sabiendo qué conservar y qué dejar marchar.",
          "Necesito que todo sea perfecto y me cuesta relajar el control.",
          "Siento que necesito recuperar mi estructura, fortalecer mis límites y aprender a soltar.") },
        { key: "metal-t1-q13", pregunta: "Cuando alguien te decepciona…", opciones: abc(
          "Expreso lo que siento y sigo adelante.",
          "Me vuelvo más duro o distante para no volver a sufrir.",
          "Me cuesta cerrar esa herida y sigo reviviéndola durante mucho tiempo.") },
        { key: "metal-t1-q14", pregunta: "¿Cómo es tu espacio personal?", opciones: abc(
          "Ordenado de una forma que me hace sentir bien.",
          "Muy organizado; me incomoda cuando algo está fuera de su sitio.",
          "Me cuesta mantener el orden y eso termina afectando a mi bienestar.") },
      ],
    },
    {
      key: "metal-t2",
      titulo: "Tu pulmón: aire y defensa",
      preguntas: [
        { key: "metal-t2-q1", pregunta: "¿Cómo describirías tu respiración en el día a día?", opciones: abc(
          "Profunda, tranquila y siento que el aire entra con facilidad.",
          "A veces siento el pecho tenso o necesito suspirar con frecuencia.",
          "Suelo respirar de forma superficial o siento que no lleno completamente los pulmones.") },
        { key: "metal-t2-q2", pregunta: "¿Cómo responde tu cuerpo a los cambios de estación o cuando hay personas enfermas cerca?", opciones: abc(
          "Suelo mantenerme sano o me recupero con facilidad.",
          "Mi cuerpo aguanta bien, aunque el estrés suele reflejarse en la piel o la respiración.",
          "Me resfrío con facilidad o siento que mis defensas están bajas.") },
        { key: "metal-t2-q3", pregunta: "¿Has notado alguno de estos signos con frecuencia?", opciones: abc(
          "Ninguno de ellos.",
          "Congestión nasal, problemas respiratorios o alteraciones en la piel.",
          "Resfriados frecuentes, piel seca o una sensación de debilidad general.") },
        { key: "metal-t2-q4", pregunta: "Cuando atraviesas una etapa emocional difícil…", opciones: abc(
          "Mi respiración se mantiene tranquila y poco a poco recupero el equilibrio.",
          "Noto el pecho cerrado, suspiro con frecuencia o siento que necesito tomar aire.",
          "Me falta energía, mi voz pierde fuerza o siento que cualquier esfuerzo me cansa.") },
        { key: "metal-t2-q5", pregunta: "Cuando te miras al espejo…", opciones: abc(
          "Mi rostro refleja vitalidad y buen color.",
          "Noto que el estrés se refleja rápidamente en mi piel o en mi expresión.",
          "Mi rostro suele verse pálido o con poca luminosidad.") },
        { key: "metal-t2-q6", pregunta: "¿Has notado alguno de estos síntomas sin una causa clara?", opciones: abc(
          "No especialmente.",
          "Un sabor picante en la boca o una mayor sensibilidad en la nariz y la piel.",
          "Piel seca, nariz sensible o tendencia a enfermar con facilidad.") },
        { key: "metal-t2-q7", pregunta: "Cuando la Vida te obliga a cerrar una etapa…", opciones: abc(
          "Me doy tiempo para sentirla y, poco a poco, consigo seguir adelante.",
          "Intento mantener el control y me cuesta aceptar que las cosas cambien.",
          "Siento que una parte de mí sigue aferrada al pasado y me cuesta volver a respirar con ligereza.") },
      ],
    },
  ],
  agua: [
    {
      key: "agua-t1",
      titulo: "¿Cómo está tu elemento Agua?",
      preguntas: [
        { key: "agua-t1-q1", pregunta: "Cuando aparece un problema importante…", opciones: abc(
          "Mantengo la calma y busco la mejor manera de afrontarlo.",
          "Mi primera reacción es protegerme y evitar correr riesgos.",
          "Siento que no tengo energía suficiente para enfrentarlo.") },
        { key: "agua-t1-q2", pregunta: "¿Cómo describirías tu nivel de energía?", opciones: abc(
          "Constante y estable durante la mayor parte del día.",
          "Tengo energía, pero la gasto estando siempre en alerta.",
          "Me siento agotado con frecuencia, incluso después de descansar.") },
        { key: "agua-t1-q3", pregunta: "¿Qué relación tienes con el miedo?", opciones: abc(
          "Lo escucho, pero no dejo que decida por mí.",
          "Muchas decisiones están condicionadas por el miedo a perder seguridad.",
          "Vivo con una sensación de preocupación o inquietud casi constante.") },
        { key: "agua-t1-q4", pregunta: "¿Cómo afrontas los cambios importantes?", opciones: abc(
          "Confío en mi capacidad para adaptarme.",
          "Prefiero evitar los cambios y mantener lo conocido.",
          "Me generan mucha inseguridad porque siento que no podré con ellos.") },
        { key: "agua-t1-q5", pregunta: "¿Cómo sientes tu fuerza interior?", opciones: abc(
          "Confío en mí incluso cuando aparecen dificultades.",
          "Necesito controlar el entorno para sentirme seguro.",
          "Dudo de mis recursos y siento que mis reservas son limitadas.") },
        { key: "agua-t1-q6", pregunta: "¿Cómo describirías tu descanso?", opciones: abc(
          "Me recupero bien después de dormir.",
          "Duermo, pero sigo despertándome preocupado o en tensión.",
          "Aunque descanse, siento que nunca termino de recuperar la energía.") },
        { key: "agua-t1-q7", pregunta: "¿Cómo responde tu cuerpo al frío?", opciones: abc(
          "Lo tolero con normalidad.",
          "Suelo tener mucho frío o retener líquidos con facilidad.",
          "El frío me afecta mucho y siento una falta de vitalidad general.") },
        { key: "agua-t1-q8", pregunta: "¿Cómo es tu relación con el esfuerzo?", opciones: abc(
          "Sé cuándo avanzar y cuándo descansar.",
          "Evito situaciones que me hagan sentir vulnerable o inseguro.",
          "Tengo la sensación de vivir siempre al límite de mis fuerzas.") },
        { key: "agua-t1-q9", pregunta: "¿Cómo describirías tu vitalidad en este momento?", opciones: abc(
          "Me siento fuerte y con capacidad de recuperación.",
          "Intento conservar energía porque temo quedarme sin recursos.",
          "Siento que llevo demasiado tiempo funcionando con las reservas.") },
        { key: "agua-t1-q10", pregunta: "¿Cómo reaccionas ante la incertidumbre?", opciones: abc(
          "La acepto como parte de la Vida.",
          "Necesito controlar lo que va a pasar para sentirme tranquilo.",
          "Me genera ansiedad y una sensación constante de inseguridad.") },
        { key: "agua-t1-q11", pregunta: "¿Has notado alguno de estos signos con frecuencia?", opciones: abc(
          "Ninguno de ellos.",
          "Retención de líquidos, sensación de frío o hinchazón.",
          "Molestias en la zona lumbar o las rodillas, caída del cabello o disminución de la libido.") },
        { key: "agua-t1-q12", pregunta: "¿Qué frase describe mejor tu momento actual?", opciones: abc(
          "Me siento conectado con mi energía y confío en la Vida.",
          "Vivo intentando protegerme y controlar lo que pueda ocurrir.",
          "Necesito recuperar mis fuerzas y volver a sentir que tengo reservas.") },
        { key: "agua-t1-q13", pregunta: "¿Cómo responde tu cuerpo después de una época de mucho esfuerzo?", opciones: abc(
          "Me recupero con relativa rapidez.",
          "Retengo líquidos o siento el cuerpo pesado.",
          "Tardo mucho tiempo en recuperar la energía.") },
        { key: "agua-t1-q14", pregunta: "¿Cómo sientes la parte baja de tu espalda y tus rodillas?", opciones: abc(
          "Fuertes y estables.",
          "Suelo notar frío o rigidez en esa zona.",
          "Con frecuencia siento debilidad, molestias o falta de fuerza.") },
        { key: "agua-t1-q15", pregunta: "¿Cómo describirías tu energía vital?", opciones: abc(
          "Tengo una buena resistencia física y emocional.",
          "Vivo con la necesidad de ahorrar energía por si ocurre algo.",
          "Siento que mis «baterías» nunca llegan a cargarse del todo.") },
        { key: "agua-t1-q16", pregunta: "¿Has notado alguno de estos signos sin una causa clara?", opciones: abc(
          "No especialmente.",
          "Sensación persistente de frío, especialmente en el cuerpo o las extremidades.",
          "Caída del cabello, disminución del deseo sexual o agotamiento prolongado.") },
        { key: "agua-t1-q17", pregunta: "Cuando no sabes qué ocurrirá mañana…", opciones: abc(
          "Confío en que encontraré la manera de adaptarme.",
          "Necesito tenerlo todo previsto para sentirme seguro.",
          "La incertidumbre me agota y siento que no tengo recursos para afrontarla.") },
      ],
    },
    {
      key: "agua-t2",
      titulo: "Tu riñón: reservas y esencia",
      preguntas: [
        { key: "agua-t2-q1", pregunta: "¿Cómo describirías tu respiración la mayor parte del tiempo?", opciones: abc(
          "Profunda, tranquila y estable.",
          "A veces la contengo sin darme cuenta cuando estoy preocupado o necesito controlar una situación.",
          "Siento que me cuesta respirar profundamente o que mi respiración es superficial.") },
        { key: "agua-t2-q2", pregunta: "¿Cómo responde tu cuerpo con los líquidos?", opciones: abc(
          "No suelo tener problemas de retención ni urinarios.",
          "Retengo líquidos o me siento hinchado con facilidad.",
          "Tengo molestias urinarias o siento que mi metabolismo del agua no funciona con normalidad.") },
        { key: "agua-t2-q3", pregunta: "¿Has notado alguno de estos signos con frecuencia?", opciones: abc(
          "Ninguno de ellos.",
          "Sensación de sabor salado en la boca sin una causa evidente.",
          "Ojeras oscuras, caída del cabello o debilidad en huesos y articulaciones.") },
        { key: "agua-t2-q4", pregunta: "¿Cómo sientes actualmente tu cuerpo?", opciones: abc(
          "Fuerte, estable y con buena capacidad de recuperación.",
          "Siento frío con facilidad o noto que mi cuerpo retiene líquidos.",
          "Me noto más frágil de lo habitual, especialmente en la zona lumbar, las rodillas o el cabello.") },
        { key: "agua-t2-q5", pregunta: "¿Cómo describirías la salud de tu cabello, tus huesos y tu audición?", opciones: abc(
          "En general se mantienen fuertes y saludables.",
          "No noto grandes cambios, aunque el frío o la humedad me afectan bastante.",
          "He notado caída del cabello, pérdida de fuerza ósea o cambios en la audición.") },
        { key: "agua-t2-q6", pregunta: "Cuando te miras al espejo…", opciones: abc(
          "Mi rostro refleja vitalidad y descanso.",
          "A veces noto la cara apagada cuando paso épocas de mucho estrés.",
          "Con frecuencia observo ojeras oscuras o una expresión de agotamiento, incluso después de descansar.") },
        { key: "agua-t2-q7", pregunta: "Cuando llevas varias semanas con mucho trabajo o estrés…", opciones: abc(
          "Consigo recuperarme dedicándome tiempo y descansando.",
          "Aguanto porque siento que no puedo bajar el ritmo, aunque mi cuerpo me pida parar.",
          "Tengo la sensación de que cada vez recupero menos energía y voy funcionando «en reserva».") },
      ],
    },
  ],
};

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
  /** Los Ciclos: true en cuanto el usuario ha descubierto TODAS las relaciones
   *  (Sheng + Ke) una vez. Se guarda para que el botón «Diagnóstico final» quede
   *  desbloqueado para siempre en visitas posteriores, sin repetir las flechitas. */
  ciclosLeidos?: boolean;
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

// ── Tests de balance: helpers ───────────────────────────────────────────────
/** Los 2 tests de un elemento (o [] si aún no se han pasado). */
export function testsDeElemento(el: Elemento): TestElemento[] {
  return TESTS_ELEMENTO[el] ?? [];
}

/** ¿Están respondidas todas las preguntas NO opcionales de un test? */
export function testCompleto(
  test: TestElemento,
  respuestas: Record<string, string> | undefined,
): boolean {
  if (!respuestas) return false;
  return test.preguntas.every((q) => q.opcional || !!respuestas[q.key]);
}

/**
 * Puntos de "carga" del elemento a partir de las respuestas de sus tests de
 * balance: exceso y deficiencia suman carga (el elemento demanda atención),
 * equilibrio no. Es lo que alimenta el radar/perfil (mayor carga = más presente).
 */
export function puntuarBalance(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): Partial<Puntuaciones> {
  const acc = cero();
  if (!respuestas) return acc;
  for (const t of testsDeElemento(el)) {
    for (const q of t.preguntas) {
      const opKey = respuestas[q.key];
      if (!opKey) continue;
      const op = q.opciones.find((o) => o.key === opKey);
      if (!op) continue;
      if (op.balance !== "equilibrio") acc[el] += 1;
    }
  }
  return acc;
}

/** Balance mayoritario del elemento (equilibrio/exceso/deficiencia), o null si
 *  no hay respuestas. No se muestra al usuario (de momento), pero queda para el
 *  perfil. Empate → gana el que más "desequilibra" (exceso o deficiencia). */
export function balanceElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): Balance | null {
  if (!respuestas) return null;
  const conteo: Record<Balance, number> = { equilibrio: 0, exceso: 0, deficiencia: 0 };
  let alguna = false;
  for (const t of testsDeElemento(el)) {
    for (const q of t.preguntas) {
      const op = q.opciones.find((o) => o.key === respuestas[q.key]);
      if (!op) continue;
      conteo[op.balance] += 1;
      alguna = true;
    }
  }
  if (!alguna) return null;
  // Prioridad de desempate: exceso > deficiencia > equilibrio (empate → gana el que más desequilibra).
  // El reduce arranca en orden[0] ("exceso"), así que un empate nunca cae en "equilibrio".
  const orden: Balance[] = ["exceso", "deficiencia", "equilibrio"];
  return orden.reduce((max, b) => (conteo[b] > conteo[max] ? b : max));
}

/** Conteo de respuestas por estado (A/B/C) de los tests de balance del elemento. */
export function conteoBalance(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): { equilibrio: number; exceso: number; deficiencia: number; total: number } {
  const c = { equilibrio: 0, exceso: 0, deficiencia: 0, total: 0 };
  if (!respuestas) return c;
  for (const t of testsDeElemento(el)) {
    for (const q of t.preguntas) {
      const op = q.opciones.find((o) => o.key === respuestas[q.key]);
      if (!op) continue;
      c[op.balance] += 1;
      c.total += 1;
    }
  }
  return c;
}

/**
 * Posición del elemento en el eje Deficiencia (−1) ↔ Equilibrio (0) ↔ Exceso (+1),
 * a partir de sus respuestas de balance. `null` si aún no hay respuestas.
 * Es lo que alimenta las barras/termómetro del perfil.
 */
export function posicionBalance(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): number | null {
  const c = conteoBalance(el, respuestas);
  if (c.total === 0) return null;
  return (c.exceso - c.deficiencia) / c.total;
}

// ─────────────────────────────────────────────────────────────────────────
// DIAGNÓSTICO HONESTO DE UN ELEMENTO
//
// Antes el estado era la opción "más repetida" (mayoría simple) y la barra solo
// se mostraba si esa mayoría caía en exceso/deficiencia: podías responder ~45%
// de deficiencia y salir "En equilibrio" con la barra a cero. Ahora el estado se
// decide por UMBRALES sobre la proporción real de respuestas de desequilibrio:
//
//   magnitud = (exceso + deficiencia) / total   → CUÁNTO desequilibrio (0–1)
//   posicion = (exceso − deficiencia) / total   → HACIA DÓNDE (−1 def … +1 exc)
//
//   · magnitud < UMBRAL_DESEQUILIBRIO           → "equilibrio"
//   · si no, y ambos lados están repartidos     → "mixto"
//   · si no                                     → "exceso" | "deficiencia"
// ─────────────────────────────────────────────────────────────────────────
/** A partir de qué proporción de respuestas de desequilibrio se deja de decir
 *  "En equilibrio" (sensible: 25%). */
export const UMBRAL_DESEQUILIBRIO = 0.25;
/** Cuando hay desequilibrio, si el lado menor pesa al menos esto DENTRO del
 *  desequilibrio (min/(exceso+deficiencia)), el estado es "mixto". */
export const UMBRAL_MIXTO = 0.34;

export type VeredictoBalance = "equilibrio" | "deficiencia" | "exceso" | "mixto";

export interface EstadoDiagnostico {
  veredicto: VeredictoBalance;
  /** Proporción de respuestas de desequilibrio (0–1). */
  magnitud: number;
  /** Dirección: −1 (todo deficiencia) … 0 … +1 (todo exceso). */
  posicion: number;
  /** Fracción de respuestas de exceso (0–1). */
  excesoFrac: number;
  /** Fracción de respuestas de deficiencia (0–1). */
  defFrac: number;
  /** Nº de respuestas contabilizadas. */
  total: number;
}

/** Diagnóstico honesto de un elemento a partir de sus respuestas de balance.
 *  `null` si aún no hay respuestas. */
export function diagnosticoElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): EstadoDiagnostico | null {
  const c = conteoBalance(el, respuestas);
  if (c.total === 0) return null;
  const excesoFrac = c.exceso / c.total;
  const defFrac = c.deficiencia / c.total;
  const magnitud = excesoFrac + defFrac;
  const posicion = excesoFrac - defFrac;

  let veredicto: VeredictoBalance;
  if (magnitud < UMBRAL_DESEQUILIBRIO) {
    veredicto = "equilibrio";
  } else {
    const desequilibrio = c.exceso + c.deficiencia;
    const mezcla = desequilibrio === 0 ? 0 : Math.min(c.exceso, c.deficiencia) / desequilibrio;
    if (mezcla >= UMBRAL_MIXTO) veredicto = "mixto";
    else veredicto = posicion >= 0 ? "exceso" : "deficiencia";
  }
  return { veredicto, magnitud, posicion, excesoFrac, defFrac, total: c.total };
}

/** Elemento que hoy más atención necesita: el de MAYOR magnitud de desequilibrio
 *  (fracción, sin el sesgo del nº de preguntas del antiguo `elementoPredominante`).
 *  Empate → el primero en el orden del ciclo. */
export function elementoMasCargado(data: DatosTcm | null | undefined): Elemento {
  let best: Elemento = ORDEN_ELEMENTOS[0];
  let bestMag = -1;
  for (const el of ORDEN_ELEMENTOS) {
    const d = diagnosticoElemento(el, data?.elementos?.[el]?.miniTest?.respuestas);
    const m = d?.magnitud ?? -1;
    if (m > bestMag) { bestMag = m; best = el; }
  }
  return best;
}

/** Puntos de un elemento usando sus tests de balance si existen; si no, el
 *  mini-test antiguo (transición mientras se migran los 5 elementos). */
export function puntosElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): Partial<Puntuaciones> {
  if (testsDeElemento(el).length > 0) return puntuarBalance(el, respuestas);
  return puntuarTest(ELEMENTOS[el].miniTest, respuestas);
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

/**
 * ¿Están completos TODOS los tests de un elemento? (todas las preguntas no
 * opcionales respondidas). Los elementos con tests de balance migrados usan
 * `testCompleto`; los que aún no, el mini-test base respondido.
 */
export function elementoTestsCompletos(data: DatosTcm | null | undefined, el: Elemento): boolean {
  const respuestas = data?.elementos?.[el]?.miniTest?.respuestas;
  const tests = testsDeElemento(el);
  if (tests.length > 0) return tests.every((t) => testCompleto(t, respuestas));
  // Legacy (elemento aún sin tests de balance): todas las preguntas del mini-test.
  const base = ELEMENTOS[el].miniTest;
  if (!respuestas || !Array.isArray(base)) return false;
  return base.every((q) => !!respuestas[q.key]);
}

/**
 * ¿Ha rellenado el usuario los tests de los CINCO elementos? Requisito para
 * salir de «Los Cinco Elementos» y para que el Índice abra el resto de pasos.
 */
export function elementosTestsCompletos(data: DatosTcm | null | undefined): boolean {
  return ORDEN_ELEMENTOS.every((el) => elementoTestsCompletos(data, el));
}

/**
 * Paso máximo ALCANZABLE del Índice de TCM. Hasta que no estén hechos los cinco
 * tests, solo se puede llegar a «Los Cinco Elementos» (paso 2): ninguna otra
 * página del recorrido queda desbloqueada.
 */
export function pasoAlcanzableTcm(data: DatosTcm | null | undefined): number {
  return elementosTestsCompletos(data) ? TCM_TOTAL : 2;
}
