// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · MEDICINA CHINA (Los 5 Elementos)
//
// Idea central: no "eres" un elemento, eres un EQUILIBRIO. El recorrido gira
// sobre un dato vivo —el balance de tus 5 elementos—, que sale de los TRES
// cuestionarios que se responden dentro del cómic de cada elemento:
//
//   1 · Tu respuesta al estrés      → CARGA
//   2 · Tus rasgos                  → CARGA
//   3 · Tu capacidad de adaptación  → RECURSOS
//
// El diagnóstico de un elemento es la resta CARGA − RECURSOS (ver
// `diagnosticoElemento`), y los dos elementos de más carga neta son el Tipo de
// Adaptación primario y el secundario (`tiposAdaptacion`).
//
// Pasos del recorrido:
//   0 · Bienvenida            /metodo/tcm
//   1 · Bienvenida           /metodo/tcm
//   2 · Los Cinco Elementos  /metodo/tcm/elementos     (estrella + los 3 tests de cada elemento)
//   3 · Tu Constitución      /metodo/tcm/constitucion  (QUIÉN eres · ver tcmConstitucion.ts)
//   4 · Los ciclos           /metodo/tcm/ciclos        (Sheng / Ke)
//   5 · Diagnóstico final    /metodo/tcm/diagnostico   (QUÉ te pasa hoy, carga − recursos)
//   6-7 · La lengua          /metodo/tcm/lengua(+/leer)
//   8 · Taoísmo              /metodo/tcm/taoismo
//   9 · Tu cocina            /metodo/tcm/recetas
//   10 · Qigong              /metodo/tcm/qigong
//   11 · Cursos              /metodo/tcm/cursos
//   12 · Tus apuntes         /metodo/tcm/apuntes
//
// Ojo con los pasos 3 y 5, que es fácil confundirlos: la Constitución es el
// elemento de FONDO (estable, sale de un test propio de frases sí/no) y el
// Diagnóstico es lo que te pesa HOY (se mueve con la temporada).
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
import { traducir } from "../../i18n";
import type { PasoRecorrido } from "./psicologiaRecorrido";

// ── Los cinco elementos ──────────────────────────────────────────────────
export type Elemento = "madera" | "fuego" | "tierra" | "metal" | "agua";

/** Orden canónico del ciclo de generación (Sheng). Rige el desbloqueo secuencial. */
export const ORDEN_ELEMENTOS: Elemento[] = ["madera", "fuego", "tierra", "metal", "agua"];

// ── Índice del recorrido (botón «Índice», reutiliza IndiceRecorrido) ────────
// Solo las páginas ya navegables (sin enlaces muertos). Se irá ampliando según
// se construyan los pasos pendientes (perfil, ciclos, tu mapa, escucharte…).
// OJO: al añadir o quitar un paso hay que retocar el `pageLabel` («n/12») del
// MetodoStepHeader de TODAS las páginas y los botones prev/next de las vecinas.
// Es una FUNCIÓN, no una constante: los títulos salen del diccionario y hay que
// volver a construirlos al cambiar de idioma (ver `IndiceTcm`). Congelados al
// importar el módulo, el índice se quedaría en el idioma con el que arrancó.
export const tcmIndice = (): PasoRecorrido[] => [
  { n: 1, titulo: traducir("disciplina.medicinaChina"), ruta: () => "/metodo/tcm" },
  { n: 2, titulo: traducir("metodo.tcm.paso.cincoElementos"), ruta: () => "/metodo/tcm/elementos" },
  { n: 3, titulo: traducir("metodo.tcm.paso.constitucion"), ruta: () => "/metodo/tcm/constitucion" },
  { n: 4, titulo: traducir("metodo.tcm.paso.ciclos"), ruta: () => "/metodo/tcm/ciclos" },
  { n: 5, titulo: traducir("metodo.tcm.paso.diagnostico"), ruta: () => "/metodo/tcm/diagnostico" },
  { n: 6, titulo: traducir("metodo.tcm.paso.tuLengua"), ruta: () => "/metodo/tcm/lengua" },
  { n: 7, titulo: traducir("metodo.tcm.paso.lengua"), ruta: () => "/metodo/tcm/lengua/leer" },
  { n: 8, titulo: traducir("metodo.tcm.tao.titulo"), ruta: () => "/metodo/tcm/taoismo" },
  { n: 9, titulo: traducir("metodo.tcm.cocina.titulo"), ruta: () => "/metodo/tcm/recetas" },
  { n: 10, titulo: traducir("metodo.tcm.qigong.titulo"), ruta: () => "/metodo/tcm/qigong" },
  { n: 11, titulo: traducir("metodo.tcm.paso.cursos"), ruta: () => "/metodo/tcm/cursos" },
  { n: 12, titulo: traducir("metodo.tcm.paso.apuntes"), ruta: () => "/metodo/tcm/apuntes" },
];

/** Cuántos pasos tiene el recorrido. Constante: no depende del idioma. */
export const TCM_TOTAL = 12;

// ── LEGADO · el mini-test de opción múltiple ────────────────────────────────
// El modelo viejo (una opción con puntos por elemento). Ya NO alimenta ningún
// diagnóstico: lo conservan `TEST_INICIAL` y `ELEMENTOS[el].miniTest`, que solo
// lee `MetodoTcmElemento.tsx` (una página que hoy no tiene ruta). Los tests que
// se responden de verdad son los tres cuestionarios de `TESTS_ELEMENTO`.
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

// ── Tests de escala · los tres cuestionarios de cada elemento ────────────────
// Cada elemento se mide con TRES cuestionarios de frases que se puntúan de 0 a
// 4. Los dos primeros suman CARGA (lo que hoy le pesa a ese elemento) y el
// tercero suma RECURSOS (lo que ese elemento te da para sostenerte). El
// diagnóstico es la resta de los dos, en `diagnosticoElemento`.

/** Las dos escalas de respuesta. La misma frase se puntúa 0-4 en ambas. */
export type EscalaTest = "frecuencia" | "acuerdo";

/** Rótulos de cada escala, de 0 a 4 (el índice ES la puntuación). */
export const ESCALAS: Record<EscalaTest, string[]> = {
  frecuencia: ["Nunca", "Rara vez", "A veces", "A menudo", "Constantemente"],
  acuerdo: ["Muy en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Muy de acuerdo"],
};

/** Puntuación máxima de una frase (la escala va de 0 a 4). */
export const MAX_ESCALA = 4;

/** Qué lado del diagnóstico alimenta un cuestionario. */
export type AportaTest = "carga" | "recursos";

export interface PreguntaEscala {
  /** Clave estable con la que se guarda la respuesta ("madera-c1-3"). */
  key: string;
  texto: string;
}

export interface TestElemento {
  key: string;            // "madera-c1", "madera-c2", "madera-c3" (estable)
  /** Cuál de los tres cuestionarios es (para el "1 de 3" de la cabecera). */
  cuestionario: 1 | 2 | 3;
  /** Subtítulo del test (bajo el "TEST DE LA MADERA"). */
  titulo: string;
  /** Frase que encabeza la lista ("Bajo estrés prolongado, experimento:"). */
  enunciado?: string;
  escala: EscalaTest;
  aporta: AportaTest;
  preguntas: PreguntaEscala[];
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
  /** LEGADO: mini-test de opción múltiple. No entra en el diagnóstico (ver el
   *  bloque «LEGADO» de arriba); los tests vivos son los de `TESTS_ELEMENTO`. */
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
// LOS TRES CUESTIONARIOS · 3 tests por elemento
//
// Los tests de cada elemento ya no son de opción múltiple: son tres
// cuestionarios de escala (0-4) que se responden elemento a elemento y que se
// leen JUNTOS.
//
//   1 · Tu respuesta al estrés      (síntomas)   → suma CARGA
//   2 · Tus rasgos                  (tendencias) → suma CARGA
//   3 · Tu capacidad de adaptación  (recursos)   → suma RECURSOS
//
// El diagnóstico de cada elemento es la resta: CARGA − RECURSOS (ver
// `diagnosticoElemento`). Como cada cuestionario tiene un número distinto de
// frases, cada uno se normaliza sobre SU máximo antes de restar: si no, el
// elemento con más frases saldría siempre más cargado que los demás.
//
// Las `key` de las preguntas son estables: cambiarlas tras publicar borra las
// respuestas guardadas. Llevan el prefijo `<elemento>-cN-` (cuestionario N),
// distinto del viejo `<elemento>-tN-qN`, para que las respuestas antiguas
// —que eran "a"/"b"/"c" y no un número— no se lean nunca como puntuación.
// ─────────────────────────────────────────────────────────────────────────

/** Atajo: convierte una lista de frases en preguntas con su `key` correlativa. */
const frases = (prefijo: string, textos: string[]): PreguntaEscala[] =>
  textos.map((texto, i) => ({ key: `${prefijo}-${i + 1}`, texto }));

/** Cuestionario 1 de un elemento: síntomas bajo estrés prolongado. */
const c1 = (el: Elemento, textos: string[]): TestElemento => ({
  key: `${el}-c1`,
  cuestionario: 1,
  titulo: "Tu respuesta al estrés",
  enunciado: "Bajo estrés prolongado, experimento:",
  escala: "frecuencia",
  aporta: "carga",
  preguntas: frases(`${el}-c1`, textos),
});

/** Cuestionario 2 de un elemento: rasgos y tendencias. */
const c2 = (el: Elemento, textos: string[]): TestElemento => ({
  key: `${el}-c2`,
  cuestionario: 2,
  titulo: "Tus rasgos",
  enunciado:
    "Aunque muchos de estos rasgos no sean agradables de reconocer, responder con sinceridad es lo que hace que el resultado se parezca a ti.",
  escala: "acuerdo",
  aporta: "carga",
  preguntas: frases(`${el}-c2`, textos),
});

/** Cuestionario 3 de un elemento: capacidad de adaptación (resta). */
const c3 = (el: Elemento, textos: string[]): TestElemento => ({
  key: `${el}-c3`,
  cuestionario: 3,
  titulo: "Tu capacidad de adaptación",
  enunciado:
    "Estas frases describen cómo respondes ante una situación difícil. Puntúalas pensando en cómo has respondido a los momentos de estrés que ya has vivido.",
  escala: "acuerdo",
  aporta: "recursos",
  preguntas: frases(`${el}-c3`, textos),
});

export const TESTS_ELEMENTO: Record<Elemento, TestElemento[]> = {
  // ── MADERA ────────────────────────────────────────────────────────────
  madera: [
    c1("madera", [
      "Dolores de cabeza",
      "Rigidez y tensión muscular",
      "Ansiedad",
      "Frustración e irritación",
      "Ardor de estómago o reflujo",
      "Ira y agresividad",
      "Incapacidad para relajarme",
      "Vista cansada",
      "Hostilidad",
      "Insomnio",
    ]),
    c2("madera", [
      "Me cuesta cambiar de rumbo una vez he tomado una decisión.",
      "A menudo retraso mis decisiones.",
      "Soy desordenado en casa o en el trabajo.",
      "Tiendo a cuestionar y a desafiar a la autoridad.",
      "Me disgusta mucho no tener el control de una situación.",
      "Me frustro con facilidad.",
      "Me molesta muchísimo que algo me impida alcanzar un objetivo.",
      "No consigo dejar de ir a marchas forzadas, siempre con la cabeza puesta en el futuro.",
      "La incompetencia me irrita de verdad.",
      "Me cuesta controlar mi hostilidad.",
      "Me enfado demasiado a menudo y de forma desproporcionada.",
      "Acumulo mucha tensión en los músculos.",
      "Puedo ponerme demasiado agresivo cuando estoy estresado.",
      "El alcohol puede llegar a causarme problemas.",
      "Tengo conflictos con otras personas a menudo.",
      "Reacciono de forma desmedida ante la injusticia y a veces abandero causas que no me tocan.",
    ]),
    c3("madera", [
      "Bajo estrés tiendo a concentrarme más y a ser más eficaz.",
      "Se me da bien averiguar qué es lo que hay que hacer.",
      "Se me da bien ver la situación entera, hacer un plan nuevo y llevarlo a cabo.",
      "Soy una persona decidida.",
      "No dejo que nadie me pase por encima.",
      "Soy capaz de pelear un problema hasta el final.",
      "Disfruto compitiendo.",
      "Cuando estoy bajo estrés, me gusta hacer las cosas a mi manera.",
      "Rara vez pierdo una discusión, y tampoco la esquivo.",
      "Me siento cómodo dirigiendo o liderando a otras personas.",
      "No me gusta que me critiquen.",
      "Tengo una visión clara de cómo quiero que sea mi futuro.",
    ]),
  ],

  // ── FUEGO ─────────────────────────────────────────────────────────────
  fuego: [
    c1("fuego", [
      "Fatiga, poca energía",
      "Tristeza profunda y aplanamiento emocional",
      "Insomnio",
      "Hinchazón digestiva o diarrea",
      "Dolor en la parte alta de la espalda o en el cuello",
      "Confusión y titubeo",
      "Irritabilidad, sobre todo con otras personas",
      "Ritmo cardíaco rápido o irregular",
      "Dolores en el pecho",
      "Inquietud",
      "Cambios en la libido",
    ]),
    c2("fuego", [
      "Me cuesta verle el lado divertido a la Vida y reírme de los problemas.",
      "No soy muy apasionado con la Vida, con las relaciones ni con el trabajo.",
      "No soy optimista por naturaleza.",
      "Una vez he empezado un proyecto, me cuesta mantener el entusiasmo.",
      "Tengo cambios de humor importantes.",
      "A menudo me siento muy vulnerable emocionalmente, sobre todo en las relaciones.",
      "Tiendo a ser tímido; no me resulta fácil hacer amigos nuevos.",
      "A menudo no me siento feliz ni alegre.",
      "Me cuesta compartir lo que siento por dentro.",
      "Es muy importante para mí gustarle a la gente.",
      "Puedo ser demasiado melodramático.",
      "Me siento bastante ansioso en muchas áreas de mi Vida.",
      "Me abruma tener demasiadas opciones entre las que elegir.",
      "Cuando algo me altera, tengo problemas de sueño.",
      "A menudo me siento agotado, sobre todo después de un disgusto emocional.",
      "En la casa de mi infancia no había mucho afecto.",
    ]),
    c3("fuego", [
      "Mantengo las ganas de estar con mis amigos aunque esté estresado.",
      "Suelo ser una persona enérgica y entusiasta.",
      "Soy optimista y mantengo una mirada positiva.",
      "Tomo la iniciativa y soy capaz de superar las dudas y las vacilaciones.",
      "Bajo estrés me oriento a la acción.",
      "Soy una persona segura, generosa y cálida.",
      "Se me da bien comunicarme.",
      "Soy apasionado y expreso el afecto.",
      "Me mantengo alegre, ligero y juguetón: le veo el humor a la Vida incluso estresado.",
      "Disfruto de la intimidad emocional y puedo compartir lo que siento más adentro.",
      "Se me da bien priorizar.",
      "Se me da bien ordenar la información sin titubear.",
    ]),
  ],

  // ── TIERRA ────────────────────────────────────────────────────────────
  tierra: [
    c1("tierra", [
      "Sensación de que no me entienden",
      "Mucha necesidad de encontrar apoyo",
      "Malestar digestivo",
      "Cambios en el apetito",
      "Letargo",
      "Problemas de sinusitis",
      "Dolores de cabeza en la frente",
      "Poca concentración",
      "Antojos de dulce",
      "Mal descanso",
    ]),
    c2("tierra", [
      "No me siento satisfecho ni a gusto con mi Vida ni conmigo mismo.",
      "Me encuentro siendo el cuidador en mis relaciones.",
      "No me gusta que me compadezcan cuando tengo un problema.",
      "Me siento inseguro por dentro.",
      "La comida y el comer ocupan un papel demasiado grande en mi Vida.",
      "He tenido problemas de peso.",
      "Le doy demasiadas vueltas a los problemas.",
      "Mi madre no me dio suficiente espacio y a menudo me sentí ahogado.",
      "Mi madre no fue muy nutricia conmigo.",
      "Cuando no me encuentro bien, busco mucho la atención de los demás.",
      "No mantengo la calma bajo estrés.",
      "Me preocupo demasiado por mi familia y por mí.",
      "Tiendo a tener opiniones muy firmes y no cambio de idea con facilidad.",
      "No me gusta que me pidan ayuda cuando tengo mis propios problemas.",
      "Tiendo a estar demasiado centrado en mí mismo.",
      "Doy demasiados detalles cuando hablo de un problema.",
    ]),
    c3("tierra", [
      "Soy una persona cuidadosa, considerada y empática, que se preocupa por los demás.",
      "Bajo estrés me veo asentado, estable, fiable y previsible.",
      "Mantengo la calma bajo estrés.",
      "La gente suele acudir a mí en busca de apoyo y comprensión.",
      "Construyo acuerdos: tengo tacto y soy diplomático.",
      "Soy reflexivo y capaz de formarme mis propias opiniones e ideas con claridad.",
      "Me desvivo por ayudar a los demás cuando estamos todos bajo presión.",
      "Soy amigable y creo redes de amistades.",
      "Soy —o sería— un padre o una madre que nutre y sostiene.",
      "No me obsesiono con los problemas.",
      "Me siento contento, seguro y satisfecho conmigo mismo.",
      "Soy considerado y agradable.",
    ]),
  ],

  // ── METAL ─────────────────────────────────────────────────────────────
  metal: [
    c1("metal", [
      "Infecciones respiratorias",
      "Tristeza, decaimiento, sensación de pérdida",
      "Sentirme cortado de los demás, distante",
      "Estreñimiento y problemas de colon",
      "Problemas de piel",
      "Verlo todo negativo",
      "Fatiga mental",
      "Síntomas nasales",
      "Ponerme crítico y exigente",
      "Sentirme rígido e inflexible",
    ]),
    c2("metal", [
      "Me cuesta estar a la altura de mis propias expectativas.",
      "Me altera no tener pautas claras en el trabajo o en mis relaciones.",
      "No expreso las emociones con facilidad.",
      "Tengo muchos arrepentimientos sobre mi Vida.",
      "Estoy triste o melancólico con frecuencia.",
      "Soy rígido e inflexible una vez he tomado una decisión.",
      "Me cuesta sentirme bien conmigo mismo.",
      "Guardo rencor, sobre todo cuando siento que alguien me ha hecho daño.",
      "A menudo me costó contentar a mi padre; era crítico conmigo.",
      "No recibo el respeto que merezco de mi familia o en el trabajo.",
      "Cuesta ganarse mi respeto.",
      "Me ofendo con facilidad ante una conducta inadecuada.",
      "Cuando algo me altera, tiendo a retirarme y a aislarme de los demás.",
      "A menudo soy crítico con los demás.",
      "Tardo más que otras personas en superar una pérdida.",
      "Soy demasiado materialista.",
    ]),
    c3("metal", [
      "Me siento bastante seguro de mi capacidad para perseverar en situaciones difíciles.",
      "Soy muy fiable en los momentos de estrés.",
      "No me aferro a los rencores, a los disgustos ni a las emociones negativas.",
      "No me quedo rumiando pérdidas ni arrepentimientos.",
      "Prefiero una Vida ordenada, pulcra y bien definida.",
      "Valoro la virtud, un código moral firme y los principios por encima de la satisfacción o el placer.",
      "A menudo prefiero gestionar las situaciones de estrés por mi cuenta.",
      "Mantengo mis emociones bajo control cuando estoy estresado.",
      "Sostengo una determinación silenciosa.",
      "Tengo la fuerza profunda que hace falta para lidiar con el estrés.",
      "Estar al aire libre, en la naturaleza, me ayuda a manejar el estrés.",
      "Manejo el estrés de forma lógica, precisa, metódica y estructurada.",
    ]),
  ],

  // ── AGUA ──────────────────────────────────────────────────────────────
  agua: [
    c1("agua", [
      "Dolor lumbar o cervical",
      "Fatiga profunda, poco aguante",
      "Sensación de frío, no consigo entrar en calor",
      "Miedo",
      "Asumir riesgos excesivos",
      "Sentirme desbordado, incapaz de gestionarlo",
      "Apartarme de los demás",
      "Rigidez de cuello",
      "Replegarme, «esconderme bajo las sábanas»",
      "Ser excesivamente precavido",
    ]),
    c2("agua", [
      "A menudo me centro en los riesgos y en los peligros.",
      "Me cuesta confiar en que todo va a salir bien.",
      "Me siento desbordado, incapaz de gestionarlo.",
      "Cuando algo me disgusta, «hiberno».",
      "Soy precavido y cuidadoso.",
      "A menudo me siento bastante frágil, física o emocionalmente.",
      "A menudo tengo miedos que probablemente no tienen fundamento.",
      "Puedo ser desconfiado y recelar de las intenciones de los demás.",
      "No me gusta que la gente sepa lo que pienso o lo que siento.",
      "A menudo busco que me confirmen que todo está bien.",
      "Me agoto con facilidad; mis reservas no son buenas.",
      "Asumo demasiado y a menudo no conozco mis propios límites.",
      "A menudo me exijo hasta quedarme sin fuerzas.",
      "Me veo como una persona muy ambiciosa.",
      "Asumo riesgos excesivos.",
      "Soy muy persistente incluso cuando no toca serlo.",
    ]),
    // OJO: en el libro, la sección E del cuestionario 3 se corta a mitad de
    // página y continúa en la siguiente, que no tenemos. Estas son las 10
    // frases que sí constan; si aparecen las que faltan, se añaden al final
    // (la puntuación se normaliza sobre el número de frases, así que añadirlas
    // no desajusta nada de lo ya respondido salvo esas nuevas).
    c3("agua", [
      "Siento que tengo la sabiduría para saber qué hay que hacer en la mayoría de las situaciones difíciles.",
      "Ampliar mi conocimiento y buscar maestros son cosas importantes para mí.",
      "Soy valiente y decidido.",
      "Confío firmemente en que las situaciones de estrés acabarán resolviéndose.",
      "Soy relativamente intrépido.",
      "Tengo una voluntad fuerte de salir adelante.",
      "Bajo estrés siento determinación y encuentro grandes recursos dentro de mí.",
      "Soy silenciosamente incansable y persistente hasta dar con una solución.",
      "Soy cuidadoso, precavido y perceptivo ante los riesgos y los peligros.",
      "Soy hábil e ingenioso en las cuestiones de supervivencia.",
    ]),
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
  /** Tu Constitución (paso 3): las respuestas del test de predominancia, con
   *  la key de cada frase («cons-p-agua-3») apuntando a "1" (sí) o "0" (no).
   *  El elemento que sale de ahí se calcula al vuelo en `tcmConstitucion.ts`:
   *  aquí NO se guarda un resultado, para poder afinar el cálculo sin dejar
   *  colgados los tests ya hechos. */
  constitucion?: { respuestas?: Record<string, string> };
  /** «Un gesto para hoy» de Tu cocina diaria, por elemento: cuál se está
   *  mostrando (`i`) y el día en que se marcó como hecho (`hecho`, aaaa-mm-dd).
   *  Guardar el DÍA y no un booleano es lo que hace que el tick se apague solo
   *  mañana: es un gesto diario, no una casilla que se marca una vez. */
  cocinaGesto?: Partial<Record<Elemento, { i?: number; hecho?: string }>>;
}

// ─────────────────────────────────────────────────────────────────────────
// HELPERS · puntuación, progreso y desbloqueo
// ─────────────────────────────────────────────────────────────────────────

const cero = (): Puntuaciones => ({ madera: 0, fuego: 0, tierra: 0, metal: 0, agua: 0 });

/** LEGADO: puntos del mini-test de opción múltiple (ver el bloque «LEGADO»). */
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

// ── Los tres cuestionarios: helpers ─────────────────────────────────────────
/** Los 3 cuestionarios de un elemento. */
export function testsDeElemento(el: Elemento): TestElemento[] {
  return TESTS_ELEMENTO[el] ?? [];
}

/**
 * Lee la respuesta guardada de una frase como puntuación 0-4.
 * Devuelve `null` si no está respondida o si lo guardado no es un número de la
 * escala: las respuestas viejas eran "a"/"b"/"c" y NO se pueden contar como 0.
 */
export function puntoRespuesta(v: string | undefined): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const e = Math.round(n);
  return e >= 0 && e <= MAX_ESCALA ? e : null;
}

/** ¿Están respondidas TODAS las frases de un test? */
export function testCompleto(
  test: TestElemento,
  respuestas: Record<string, string> | undefined,
): boolean {
  if (!respuestas) return false;
  return test.preguntas.every((q) => puntoRespuesta(respuestas[q.key]) !== null);
}

/** Cuántas frases lleva respondidas un test (para el "12 / 16" de la cabecera). */
export function respondidasTest(
  test: TestElemento,
  respuestas: Record<string, string> | undefined,
): number {
  if (!respuestas) return 0;
  return test.preguntas.filter((q) => puntoRespuesta(respuestas[q.key]) !== null).length;
}

/**
 * Puntuación de UN test, normalizada sobre su propio máximo (0-1).
 * Normalizar por test es lo que permite restarlos entre sí: los cuestionarios
 * tienen distinto número de frases (10, 16, 12…) y sumar los puntos en bruto
 * haría que el más largo pesara más solo por ser más largo.
 * `null` si no hay ni una frase respondida.
 */
export function fraccionTest(
  test: TestElemento,
  respuestas: Record<string, string> | undefined,
): number | null {
  if (!respuestas || test.preguntas.length === 0) return null;
  let suma = 0;
  let contestadas = 0;
  for (const q of test.preguntas) {
    const p = puntoRespuesta(respuestas[q.key]);
    if (p === null) continue;
    suma += p;
    contestadas += 1;
  }
  if (contestadas === 0) return null;
  // Sobre las CONTESTADAS, no sobre el total: un test a medias no penaliza al
  // elemento por las frases que aún no ha leído.
  return suma / (contestadas * MAX_ESCALA);
}

/** Lo que pesa hoy un elemento y lo que te da, cada uno de 0 a 1. */
export interface BalanceElemento {
  /** Cuestionarios 1 y 2 (síntomas + rasgos), promediados. */
  carga: number;
  /** Cuestionario 3 (capacidad de adaptación). */
  recursos: number;
  /** Nº de frases respondidas en los tres cuestionarios. */
  respondidas: number;
  /** Nº total de frases de los tres cuestionarios. */
  total: number;
}

/** Carga y recursos de un elemento. `null` si aún no ha respondido nada. */
export function balanceElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): BalanceElemento | null {
  const tests = testsDeElemento(el);
  if (tests.length === 0) return null;

  const cargas: number[] = [];
  const recursos: number[] = [];
  let respondidas = 0;
  let total = 0;

  for (const t of tests) {
    total += t.preguntas.length;
    respondidas += respondidasTest(t, respuestas);
    const f = fraccionTest(t, respuestas);
    if (f === null) continue;
    (t.aporta === "carga" ? cargas : recursos).push(f);
  }
  if (respondidas === 0) return null;

  const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return { carga: media(cargas), recursos: media(recursos), respondidas, total };
}

// ─────────────────────────────────────────────────────────────────────────
// DIAGNÓSTICO DE UN ELEMENTO · CARGA contra RECURSOS
//
// Los tres cuestionarios no preguntan por «exceso» ni por «deficiencia»:
// preguntan por lo que el estrés te hace (cuestionario 1), por las tendencias
// que arrastras (cuestionario 2) y por los recursos con los que te adaptas
// (cuestionario 3). El diagnóstico es la resta de esos dos lados:
//
//   posicion = carga − recursos      (carga = media de los cuestionarios 1 y 2)
//
//   · posicion >  UMBRAL_NETO → "carga"      (el elemento te pide atención)
//   · posicion < −UMBRAL_NETO → "recurso"    (ese elemento te sostiene)
//   · |posicion| < UMBRAL_NETO → "equilibrio" (los dos lados se compensan)
//
// Un elemento NO puede estar a la vez en carga y siendo un recurso: la barra
// del diagnóstico tira hacia UN solo lado, o se queda pegada a la línea.
//
// Los dos elementos con más carga son, en el lenguaje de los cuestionarios, el
// Tipo de Adaptación primario y el secundario (ver `tiposAdaptacion`).
// ─────────────────────────────────────────────────────────────────────────
/** Por cuánto tiene que ganar un lado al otro para dejar de decir «En
 *  equilibrio»: 15 puntos porcentuales de diferencia entre carga y recursos.
 *  Por debajo, se compensan. */
export const UMBRAL_NETO = 0.15;

export type VeredictoBalance = "equilibrio" | "carga" | "recurso";

export interface EstadoDiagnostico {
  veredicto: VeredictoBalance;
  /** CUÁNTO desequilibrio neto hay, 0–1 (= |posicion|). Es lo que mide la barra
   *  y lo que decide qué elemento es el protagonista. */
  magnitud: number;
  /** HACIA DÓNDE tira: −1 (todo recursos) … 0 … +1 (toda carga). */
  posicion: number;
  /** Lo que le pesa hoy al elemento, 0–1 (cuestionarios 1 y 2). */
  carga: number;
  /** Lo que el elemento te da, 0–1 (cuestionario 3). */
  recursos: number;
  /** Nº de frases respondidas. */
  total: number;
}

/** Diagnóstico de un elemento: un solo sentido (carga, recurso o equilibrio).
 *  `null` si aún no hay respuestas. */
export function diagnosticoElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): EstadoDiagnostico | null {
  const b = balanceElemento(el, respuestas);
  if (!b) return null;
  const posicion = b.carga - b.recursos;
  const magnitud = Math.abs(posicion);
  const veredicto: VeredictoBalance =
    magnitud < UMBRAL_NETO ? "equilibrio" : posicion > 0 ? "carga" : "recurso";
  return { veredicto, magnitud, posicion, carga: b.carga, recursos: b.recursos, total: b.respondidas };
}

/** Elemento que hoy más atención necesita: el de MAYOR carga neta (el que más
 *  le gana a sus recursos). Empate → el primero en el orden del ciclo. */
export function elementoMasCargado(data: DatosTcm | null | undefined): Elemento {
  let best: Elemento = ORDEN_ELEMENTOS[0];
  let bestPos = -Infinity;
  for (const el of ORDEN_ELEMENTOS) {
    const p = posicionDe(data, el);
    if (p > bestPos) { bestPos = p; best = el; }
  }
  return best;
}

/** La carga neta de un elemento, o SIN_DATOS si no ha respondido nada.
 *  Centinela FINITO a propósito: con `-Infinity`, comparar dos elementos sin
 *  responder daba `NaN` y el orden de `tiposAdaptacion` quedaba indefinido. */
const SIN_DATOS = -2;
function posicionDe(data: DatosTcm | null | undefined, el: Elemento): number {
  return diagnosticoElemento(el, data?.elementos?.[el]?.miniTest?.respuestas)?.posicion ?? SIN_DATOS;
}

/**
 * Los dos elementos de más carga neta: el Tipo de Adaptación primario y el
 * secundario. Es la lectura que hacen los tres cuestionarios cuando se leen
 * juntos: no «eres» un elemento, pero hay dos por los que te adaptas.
 */
export function tiposAdaptacion(
  data: DatosTcm | null | undefined,
): { primario: Elemento; secundario: Elemento } {
  const orden = [...ORDEN_ELEMENTOS].sort((a, b) => posicionDe(data, b) - posicionDe(data, a));
  return { primario: orden[0], secundario: orden[1] };
}

/** Puntos de un elemento para la puntuación agregada: su carga, de 0 a 100. */
export function puntosElemento(
  el: Elemento,
  respuestas: Record<string, string> | undefined,
): Partial<Puntuaciones> {
  const acc = cero();
  const b = balanceElemento(el, respuestas);
  if (b) acc[el] = Math.round(b.carga * 100);
  return acc;
}

/**
 * Puntuación AGREGADA del recorrido: la carga guardada de cada elemento (0-100).
 * Mayor puntuación = elemento más cargado. El diagnóstico NO se lee de aquí
 * —se recalcula siempre de las respuestas, en `diagnosticoElemento`—: esto es
 * solo el dato ya masticado que queda guardado con cada elemento.
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

/** ¿Están respondidas TODAS las frases de los tres cuestionarios del elemento? */
export function elementoTestsCompletos(data: DatosTcm | null | undefined, el: Elemento): boolean {
  const respuestas = data?.elementos?.[el]?.miniTest?.respuestas;
  const tests = testsDeElemento(el);
  if (tests.length === 0) return false;
  return tests.every((t) => testCompleto(t, respuestas));
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
