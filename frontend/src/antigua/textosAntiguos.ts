// Textos de la web de antes (27-oct-2026) que ya no están en el diccionario de la casa. Son los de María tal cual
// estaban; solo los usa la copia de /antigua.
const ES = {
  "welcome.hero.frase": "Descubre nuevas perspectivas de ti a través de una mirada multidisciplinar",
  "welcome.hero.gratis": "Introducción gratuita",
  "welcome.hero.foto": "Te asesoro en mente, cuerpo y tradición para construir una visión integrada de ti.",
  "welcome.pilar.1.titulo": "Autoconocimiento",
  "welcome.pilar.1.texto": "Explora tu propia historia, identifica tus patrones y comprende cómo determinadas formas de pensar o actuar pudieron tener sentido en el pasado pero ya no son útiles en el presente.",
  "welcome.pilar.2.titulo": "Autoaceptación",
  "welcome.pilar.2.texto": "Aprende a observarte desde perspectivas diferentes, sin reducir la propia identidad a una etiqueta, un defecto o una dificultad.",
  "welcome.pilar.3.titulo": "Automejora",
  "welcome.pilar.3.texto": "No te justifiques con lo que parece negativo. Úsalo para saber dónde poner el foco y mejorar la calidad de vida, mejorando cada día como ser humano.",
} as const;

const EN: Record<keyof typeof ES, string> = {
  "welcome.hero.frase": "Discover new perspectives of yourself through a multidisciplinary lens",
  "welcome.hero.gratis": "Free introduction",
  "welcome.hero.foto": "I guide you in mind, body and tradition to build an integrated vision of yourself.",
  "welcome.pilar.1.titulo": "Self-knowledge",
  "welcome.pilar.1.texto": "Explore your own story, identify your patterns and understand how certain ways of thinking or acting may have made sense in the past but are no longer useful in the present.",
  "welcome.pilar.2.titulo": "Self-acceptance",
  "welcome.pilar.2.texto": "Learn to see yourself from different perspectives, without reducing your identity to a label, a flaw or a difficulty.",
  "welcome.pilar.3.titulo": "Self-improvement",
  "welcome.pilar.3.texto": "Don't justify yourself with what seems negative. Use it to know where to put your focus and improve your quality of life, getting better every day as a human being.",
};

export type ClaveAntigua = keyof typeof ES;
export const textoAntiguo = (idioma: string, k: ClaveAntigua): string => (idioma === "en" ? EN[k] : ES[k]);
