export type Producto = {
  id: string;
  title: string;
  imgs: string[];
  desc: string;
  descFull: string;
  price: number;
};

export const productos: Producto[] = [
  {
    id: "jabon-artesanal",
    title: "Jabón Artesanal",
    imgs: ["/img/jabones.png", "/img/jabones.png", "/img/jabones.png"],
    desc: "Elaborado a mano con aceites vegetales y plantas medicinales. Sin sulfatos, sin parabenos, solo lo que la naturaleza nos ofrece...",
    descFull:
      "Elaborado a mano con aceites vegetales y plantas medicinales de primera calidad. Sin sulfatos, sin parabenos, sin conservantes artificiales. Solo lo que la naturaleza nos ofrece en su forma más pura y poderosa.\n\nCada jabón es único, con variaciones naturales en su color y textura. Contiene aceites de oliva, coco y argán, enriquecidos con extractos de lavanda, romero y caléndula para nutrir y equilibrar tu piel.",
    price: 12.99,
  },
  {
    id: "aceite-natural",
    title: "Aceite Natural",
    imgs: ["/img/jabones.png", "/img/jabones.png", "/img/jabones.png"],
    desc: "Blend de aceites esenciales puros para nutrir tu piel y calmar tu mente. Un ritual de cuidado consciente cada día...",
    descFull:
      "Un blend magistral de aceites esenciales 100% puros, seleccionados por su poder nutritivo y aromático. Formulado para nutrir en profundidad tu piel mientras calma tu mente y eleva tu espíritu.\n\nContiene aceites de rosa mosqueta, jojoba, argán y sándalo, combinados con esencias de bergamota y ylang-ylang. Ideal como sérum facial, aceite corporal o para masajes de relajación.",
    price: 24.99,
  },
  {
    id: "crema-nutritiva",
    title: "Crema Nutritiva",
    imgs: ["/img/jabones.png", "/img/jabones.png", "/img/jabones.png"],
    desc: "Hidratación profunda con manteca de karité, aloe vera y extractos botánicos. Tu piel, en armonía con la tierra...",
    descFull:
      "Hidratación profunda y duradera gracias a una fórmula rica en manteca de karité virgen, gel de aloe vera ecológico y una sinfonía de extractos botánicos. Formulada sin ingredientes artificiales, respetando tu piel y el medio ambiente.\n\nIdeal para pieles secas, sensibles o con necesidad de regeneración. Se absorbe fácilmente y deja una sensación de suavidad y confort durante todo el día.",
    price: 19.99,
  },
];
