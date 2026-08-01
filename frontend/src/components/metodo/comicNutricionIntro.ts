import type { Vineta } from "./ComicViewer";

// Cómic de intro de Nutrición. Se muestra la PRIMERA vez que el usuario entra en
// la disciplina (tras pagar), igual que el resto de disciplinas, y termina con el
// botón «Leído». También se reutiliza en la galería de Ilustraciones.
//
// Imágenes: /viñetas/nutricion/intro/nutricomic1.png … nutricomic6.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
export const NUTRICION_INTRO: Vineta[] = [
  {
    src: "/viñetas/nutricion/intro/nutricomic1.png",
    paragraphs: [
      "Todo lo que está vivo está formado por átomos, moléculas y células.",
      "El universo invierte cierta cantidad de partículas para experimentarse de forma supuestamente individual.",
      "Cuando esa forma se descompone, las partículas se reutilizan para seguir creando Vida."
    ],
  },
  {
    src: "/viñetas/nutricion/intro/nutricomic2.png",
    paragraphs: [
      "Todos los seres vivos tenemos algo en común: si queremos seguir existiendo, debemos convertir moléculas del exterior en parte de nosotros.",
      "En otras palabras, tenemos que alimentarnos.",
    ],
  },
  {
    src: "/viñetas/nutricion/intro/nutricomic3.png",
    paragraphs: [
      "Cuando comemos, miles de enzimas trabajan a nuestro servicio para descomponer los alimentos en moléculas cada vez más pequeñas.",
      "Después, nuestro cuerpo las absorbe, las transporta y las utiliza para fabricar nuevas células, reparar tejidos y seguir funcionando."
    ],
  },
  {
    src: "/viñetas/nutricion/intro/nutricomic4.png",
    paragraphs: [
      "Es un ciclo del que no podemos escapar.",
      "Cada día destruimos una parte de nosotros y cada día la volvemos a construir.",
    ],
  },
  {
    src: "/viñetas/nutricion/intro/nutricomic5.png",
    paragraphs: [
      "Pero no todos los alimentos aportan las mismas moléculas.",
      "Durante millones de años, la naturaleza fue nuestra única fuente de alimento.",
      "Sin embargo, hoy podemos consumir productos cuya composición molecular es ajena a nuestro organismo.",
      "Ahora hay que tener cuidado, pues lo que debería de reconstruirte puede destruirte.",
    ],
  },
  {
    src: "/viñetas/nutricion/intro/nutricomic6.png",
    paragraphs: [
      "Esta disciplina te invita a dejar de pensar en lo que te gusta y en lo que no.",
      "Te invita a mirar los alimentos desde un punto de vista racional y comprender qué moléculas contienen, cómo actúan en tu organismo y por qué influyen en tu salud.",
      "¿Si supieras realmente lo que ocurre dentro de tu cuerpo cada vez que comes, elegirías lo mismo?",
      "Descubre por qué te gusta lo que te gusta. Y descubre cómo, literalmente, te reconstruyes con cada bocado.",
    ],
  },
];
