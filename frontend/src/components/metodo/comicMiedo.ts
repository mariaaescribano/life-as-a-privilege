import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «El miedo». Se intercala ENTRE Miedos
// (/metodo/psicologia/:id/miedos) y Atrévete (.../miedos-preguntas): ya ha
// escrito de qué tiene miedo, y aquí se le da la vuelta — detrás de cada miedo
// hay algo que le importa. Es justo el giro que la página siguiente le pide dar.
//
// El arco: qué es el miedo → no siempre hay peligro real → qué hay detrás →
// tus mayores tesoros.
//
// Sin títulos, como todos los cómics de Psicología: solo foto y texto.
//
// VOZ: las tres primeras viñetas van en «nosotros» (el hecho general, que da
// distancia) y la última en «tú» (su miedo, que es lo que la página siguiente
// le pide mirar). Dentro de una misma viñeta NO se mezclan: el cambio de
// persona se hace al pasar de viñeta, nunca en la última frase.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido (igual que COMIC_ACE y COMIC_CREENCIAS).
//
// Imágenes: /viñetas/psicologia/miedo/miedo1.webp … miedo4.webp.
const P = "/viñetas/psicologia/miedo";

export const COMIC_MIEDO: Vineta[] = [
  {
    src: `${P}/miedo1.webp`,
    titulo: "",
    paragraphs: [
      "El miedo es una emoción básica que aparece cuando percibimos una amenaza o un peligro. Su función principal es protegernos y prepararnos para responder.",
      "El organismo activa una respuesta de alarma: aumenta la atención, cambia el ritmo cardíaco y prepara al cuerpo para actuar.",
      "Por eso, sentir miedo no significa ser débil. Es una respuesta humana necesaria para nuestra supervivencia.",
    ],
  },
  {
    src: `${P}/miedo2.webp`,
    titulo: "",
    paragraphs: [
      "Sin embargo, no todos nuestros miedos aparecen ante un peligro físico. También podemos sentir miedo ante situaciones sociales, decisiones, cambios o experiencias que podrían afectar a nuestra autoestima.",
      "— «Sé que hablar delante de todos no pone mi vida en peligro… pero tengo muchísimo miedo.»",
      "Nuestro cerebro responde ante una amenaza física y ante una amenaza psicológica de formas similares.",
      "El miedo puede aparecer cuando sentimos que algo importante para nosotros está en riesgo.",
    ],
  },
  {
    src: `${P}/miedo3.webp`,
    titulo: "",
    paragraphs: [
      "Aquí aparece una pregunta importante: ¿qué hay detrás de nuestros miedos?",
      "— «Tengo miedo de fracasar.»",
      "— Psicólogo: «¿Y qué significaría para ti fracasar?»",
      "— «Que quizá no sea capaz de conseguir aquello que realmente quiero.»",
      "A veces, detrás del miedo encontramos algo que valoramos profundamente.",
      "Tenemos miedo porque existe algo que podemos perder, pero también porque existe algo que deseamos.",
    ],
  },
  {
    src: `${P}/miedo4.webp`,
    titulo: "",
    paragraphs: [
      "Por eso detrás de tus mayores miedos se encuentran tus mayores tesoros.",
      "Miedo al rechazo → porque necesitas que te quieran y te acepten.",
      "Miedo al fracaso → porque tienes metas que te importan.",
      "Miedo a perder → porque existen personas o vínculos que valoras.",
      "Miedo al cambio → porque abandonar lo conocido implica enfrentarte a la incertidumbre.",
      "Quizá tu miedo también te está mostrando lo que realmente te importa.",
    ],
  },
];
