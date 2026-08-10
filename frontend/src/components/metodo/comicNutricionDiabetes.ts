import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de transición «La diabetes». Va ENTRE «Tus calorías y macros» y el test
// «¿Cómo va tu azúcar?»: se abre al pulsar «Test →» y termina navegando a
// /metodo/nutricion/prediabetes.
//
// Por qué va justo AHÍ: el test pregunta por factores de riesgo, y una pregunta
// sobre algo que no entiendes se responde a ciegas. Estas cuatro viñetas cuentan
// primero qué es la glucosa, qué hace la insulina y qué se rompe en la diabetes,
// para que al llegar al test se sepa QUÉ se está midiendo.
//
// El arco es el de siempre: cómo funciona → qué se estropea → qué se ve →
// por qué importa.
//
// Imágenes: /viñetas/nutricion/diabetes/diabetes1.webp … diabetes4.webp
// (mientras no existan, el ComicViewer pinta un «próximamente» en su hueco).
// ─────────────────────────────────────────────────────────────────────────

const BASE = "/viñetas/nutricion/diabetes";

export const NUTRICION_DIABETES: Vineta[] = [
  {
    // Viñeta 1: la glucosa entrando en la sangre y el páncreas soltando insulina
    // como la llave que abre la célula.
    src: `${BASE}/diabetes1.webp`,
    paragraphs: [
      "Cuando comemos, los alimentos se digieren y parte de sus nutrientes se transforma en glucosa, una de las principales fuentes de energía del organismo. La glucosa pasa al torrente sanguíneo, por lo que aumenta temporalmente su concentración en la sangre.",
      "Para que esa glucosa pueda ser utilizada, el páncreas libera insulina. La insulina actúa como una señal que permite que las células del organismo capten la glucosa de la sangre y la utilicen como energía.",
    ],
  },
  {
    // Viñeta 2: el mismo sistema, roto. Poca insulina (o ninguna), o células que
    // ya no responden a ella, y la glucosa quedándose fuera.
    src: `${BASE}/diabetes2.webp`,
    paragraphs: [
      "En la diabetes, este sistema de regulación de la glucosa está alterado. Dependiendo del tipo de diabetes, el organismo puede producir muy poca insulina, no producirla o no responder adecuadamente a ella.",
      "Cuando la insulina no funciona correctamente, la glucosa tiene más dificultades para pasar de la sangre al interior de las células. Como consecuencia, empieza a acumularse en el torrente sanguíneo.",
    ],
  },
  {
    // Viñeta 3: la curva de glucosa después de comer. La normal, que sube y
    // vuelve; y la de la diabetes, que sube y se queda arriba (hiperglucemia).
    src: `${BASE}/diabetes3.webp`,
    paragraphs: [
      "Después de comer, es normal que la glucosa en sangre aumente. Sin embargo, en una persona con diabetes, la falta de insulina o la resistencia a su acción puede impedir que la glucosa sea controlada de forma adecuada.",
      "Esto provoca una hiperglucemia, es decir, niveles de glucosa en sangre demasiado elevados. Si se mantiene durante mucho tiempo, el exceso de glucosa puede comenzar a afectar a diferentes tejidos y órganos del organismo.",
    ],
  },
  {
    // Viñeta 4: a dónde llega el daño con los años — vasos y nervios, y de ahí
    // corazón, riñones y ojos.
    src: `${BASE}/diabetes4.webp`,
    paragraphs: [
      "La diabetes no consiste únicamente en tener «azúcar alta». Cuando la glucosa permanece elevada durante años, puede producir daños progresivos en los vasos sanguíneos y los nervios, aumentando el riesgo de enfermedades cardiovasculares y afectando a órganos como los riñones y los ojos.",
      "Por eso, controlar la glucemia, seguir el tratamiento indicado y mantener hábitos saludables es fundamental para prevenir o retrasar sus complicaciones. La diabetes puede controlarse, pero requiere un seguimiento continuado.",
    ],
  },
];
