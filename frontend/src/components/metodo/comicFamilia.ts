import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «La familia». Se intercala ENTRE la Línea de Vida
// (/metodo/psicologia/:id) y Tu familia (.../familia): antes de que la usuaria
// componga su propio mapa familiar, le cuenta qué es la familia como primer
// entorno — lo que enseña cuando sostiene y lo que enseña cuando calla.
//
// El arco: la familia como primer grupo social → lo que da el apoyo → lo que
// pasa cuando el conflicto se silencia → el daño del conflicto sostenido →
// afrontar en vez de ocultar.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido (igual que COMIC_ACE y COMIC_CREENCIAS).
//
// Imágenes: /viñetas/psicologia/familia/familia1.webp … familia5.webp.
const P = "/viñetas/psicologia/familia";

export const COMIC_FAMILIA: Vineta[] = [
  {
    src: `${P}/familia1.webp`,
    titulo: "",
    paragraphs: [
      "La familia es uno de los primeros grupos sociales con los que una persona entra en contacto.",
      "Desde la infancia, aprendemos en ella formas de comunicarnos, expresar emociones, establecer vínculos y relacionarnos con los demás.",
      "Por esta razón, las experiencias familiares pueden tener una influencia importante en nuestro desarrollo emocional, social y psicológico.",
    ],
  },
  {
    src: `${P}/familia2.webp`,
    titulo: "",
    paragraphs: [
      "— Adolescente: «No me está yendo bien últimamente y no sé cómo sentirme.»",
      "— Familiar: «Puedes hablar conmigo. Vamos a intentar encontrar una solución juntos.»",
      "Una familia que ofrece apoyo, escucha y seguridad puede ayudar a desarrollar una mayor autoestima y capacidad para afrontar las dificultades.",
      "La comunicación abierta permite expresar las emociones y resolver los problemas antes de que se acumulen.",
    ],
  },
  {
    src: `${P}/familia3.webp`,
    titulo: "",
    paragraphs: [
      "Pero no todas las familias gestionan los problemas de la misma manera.",
       "En algunas, los conflictos se ocultan o se evita hablar de ellos para mantener una apariencia de tranquilidad.",
      "Sin embargo, ignorar un problema no significa que desaparezca. Cuando las emociones y los conflictos se reprimen constantemente, pueden acumularse y generar tensión, frustración y malestar dentro del hogar.",
      "— Adolescente, pensando: «Aquí todos saben que algo ocurre, pero nadie quiere hablar de ello.»",
    ],
  },
  {
    src: `${P}/familia4.webp`,
    titulo: "",
    paragraphs: [
      "Las discusiones frecuentes, los gritos, la falta de comunicación o un ambiente familiar de tensión pueden crear sufrimiento, especialmente cuando estas situaciones se mantienen durante mucho tiempo.",
      "— Adolescente: «Cuando empiezan a discutir, intento encerrarme en mi habitación.»",
      "Vivir constantemente en un ambiente de conflicto puede generar sentimientos de inseguridad, ansiedad, tristeza o impotencia.",
      "Además, los niños y adolescentes pueden aprender estos patrones de comportamiento y reproducirlos posteriormente en sus propias relaciones.",
      "Las buenas familias no son las que no tienen conflictos, son las que gestionan y hablan de esos conflictos para encontrar una solución.",
    ],
  },
  {
    src: `${P}/familia5.webp`,
    titulo: "",
    paragraphs: [
      "— Familiar: «Tenemos que hablar de lo que está pasando, aunque sea difícil.»",
      "— Adolescente: «Prefiero que podamos decir lo que sentimos sin gritarnos.»",
      "Una familia saludable no es aquella en la que nunca existen problemas, sino aquella que intenta afrontarlos mediante la comunicación, el respeto y la búsqueda de soluciones.",
      "Cuando los conflictos son difíciles de manejar, pedir ayuda profesional puede ser una herramienta para mejorar la comunicación y las relaciones familiares.",
    ],
  },
];
