import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Los ACE». Se intercala ENTRE el test de ACE
// (/metodo/psicologia/:id/ace) y su resultado (.../ace-resultado): explica qué
// son las Experiencias Adversas en la Infancia, qué ocurre en el organismo, qué
// consecuencias pueden tener y —con esperanza— cómo se construye la resiliencia.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido.
//
// Imágenes: /viñetas/psicologia/ace/ace1.png … ace4.png (una por viñeta).
export const COMIC_ACE: Vineta[] = [
  {
    src: "/viñetas/psicologia/ace/ace1.png",
    titulo: "¿Qué son los ACE?",
    paragraphs: [
      "Los ACE (Experiencias Adversas en la Infancia) son eventos o circunstancias potencialmente traumáticas que ocurren antes de los 18 años.",
      "Entre ellas se encuentran el abuso físico, emocional o sexual; la negligencia; la violencia en el hogar; convivir con un familiar con adicciones o enfermedad mental; o la separación de los cuidadores.",
      "No se trata de un único evento aislado: estas experiencias pueden repetirse, acumularse y aumentar su impacto con el tiempo.",
    ],
  },
  {
    src: "/viñetas/psicologia/ace/ace2.png",
    titulo: "¿Qué ocurre en el organismo?",
    paragraphs: [
      "Cuando un niño vive estrés intenso, frecuente o prolongado sin el apoyo de un adulto que le proporcione seguridad y regulación emocional, la respuesta de estrés permanece activada. Esto puede dar lugar a lo que se conoce como estrés tóxico.",
      "Con el tiempo, esta activación sostenida puede alterar el desarrollo del cerebro, afectar al sistema inmunitario y modificar la forma en que el organismo responde al estrés.",
    ],
  },
  {
    src: "/viñetas/psicologia/ace/ace3.png",
    titulo: "¿Qué consecuencias pueden tener?",
    paragraphs: [
      "A mayor número de ACE, mayor es la probabilidad de presentar problemas de salud física y mental durante la adolescencia y la adultez.",
      "Esto se asocia con un mayor riesgo de ansiedad, depresión, enfermedades cardiovasculares, diabetes, consumo de sustancias y dificultades en las relaciones interpersonales.",
      "Los ACE aumentan el riesgo, pero no determinan el futuro de una persona.",
    ],
  },
  {
    src: "/viñetas/psicologia/ace/ace4.png",
    titulo: "La resiliencia también se construye",
    paragraphs: [
      "Los efectos de los ACE pueden reducirse cuando existen relaciones seguras, apoyo emocional, intervención temprana y comunidades protectoras.",
      "El pasado no puede cambiarse, pero sí es posible transformar muchas de las respuestas que el cuerpo y la mente aprendieron para sobrevivir a esas experiencias.",
      "La resiliencia no significa olvidar lo vivido; significa desarrollar nuevas herramientas, relaciones seguras y experiencias reparadoras que permitan seguir creciendo.",
    ],
  },
];
