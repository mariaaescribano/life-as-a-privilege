import type { Vineta } from "./ComicViewer";

// Cómic de Fisiología: «Te reconstruyes cada día». Cierre del ascenso
// (partícula → organismo → «eres tú»): se intercala al terminar de construir el
// ser humano (Organismo), como puente hacia lo que viene (hábitos, nutrición,
// estilo de vida). El mensaje: tu cuerpo no para de rehacerse, y cada decisión
// repetida es una instrucción sobre en qué dirección lo construyes.
//
// Imágenes: /viñetas/fisiologia/reconstruccion/1.png … 5.png (una por viñeta).
const PRE = "/viñetas/fisiologia/reconstruccion";

export const RECONSTRUCCION: Vineta[] = [
  {
    src: `${PRE}/1.webp`,
    paragraphs: [
      "Tu cuerpo está formado por aproximadamente 37 billones (37 × 10¹²) de células.",
      "Cada día, alrededor de 330.000 millones de ellas mueren y son reemplazadas por otras nuevas.",
      "Mientras lees estas líneas, millones de células ya han desaparecido y millones están naciendo.",
      "Nunca eres exactamente el mismo cuerpo que hace unos minutos.",
    ],
  },
  {
    src: `${PRE}/2.webp`,
    paragraphs: [
      "Imagina una ciudad en la que cada edificio se estuviera reparando al mismo tiempo, pero cada uno siguiera un calendario distinto.",
      "Eso es exactamente lo que hace tu cuerpo.",
      "El intestino renueva gran parte de sus células cada 2-5 días. La piel tarda unas 3-4 semanas. Los glóbulos rojos viven alrededor de 120 días. El hígado puede regenerar gran parte de su tejido durante meses y tu esqueleto se remodela continuamente, renovándose en gran medida a lo largo de unos 10 años.",
      "Sin embargo, muchas neuronas de la corteza cerebral pueden acompañarte prácticamente toda la Vida.",
      "No existe un momento en el que tu cuerpo deje de reconstruirse. Solo cambia el ritmo al que lo hace cada órgano.",
    ],
  },
  {
    src: `${PRE}/3.webp`,
    paragraphs: [
      "Cada célula nueva necesita materia prima.",
      "Tu cuerpo fabrica aproximadamente 300 millones de células nuevas cada minuto. Más de 5 millones cada segundo.",
      "Pero ninguna aparece de la nada.",
      "Cada una se construye utilizando los aminoácidos de las proteínas que comes, los ácidos grasos de tu alimentación, las vitaminas y minerales que obtienes, el oxígeno que respiras y la energía que producen tus mitocondrias.",
      "Al mismo tiempo, tus hormonas, tu sueño, el ejercicio y el estrés envían instrucciones sobre cómo deben construirse esas células y cómo deben funcionar.",
      "No solo alimentas tu cuerpo. Le estás diciendo continuamente cómo reconstruirse.",
    ],
  },
  {
    src: `${PRE}/4.webp`,
    paragraphs: [
      "Tu cuerpo no distingue entre un día bueno y un día malo.",
      "Registra patrones.",
      "No existe una comida que te haga sano.",
      "Ni una noche que destruya tu salud.",
      "Pero miles de comidas, miles de noches y miles de decisiones repetidas terminan modificando la estructura y el funcionamiento de tus tejidos.",
      "La biología siempre escucha aquello que haces de forma repetida.",
    ],
  },
  {
    src: `${PRE}/5.webp`,
    paragraphs: [
      "Tu ADN sigue siendo prácticamente el mismo.",
      "Pero las proteínas que fabricas, las células que reemplazas, los tejidos que regeneras y la forma en que funcionan tus órganos dependen, en gran medida, de las señales que reciben cada día.",
      "Cada decisión es una instrucción.",
      "Cada hábito es un plano de construcción.",
      "La pregunta no es si tu cuerpo va a cambiar.",
      "La pregunta es en qué dirección lo estás reconstruyendo.",
    ],
  },
];
