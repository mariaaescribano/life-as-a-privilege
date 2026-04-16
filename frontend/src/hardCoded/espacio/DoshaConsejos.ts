export type DoshaRecs = {
  descripcion: string;
  alimentacion: string[];
  estiloDeVida: string[];
  hierbas: string[];
  evitar: string[];
};

export const DOSHA_CONSEJOS: Record<string, DoshaRecs> = {
  vata: {
    descripcion:
      "Vata es el principio del movimiento: aire y éter. Gobierna la respiración, la circulación y el sistema nervioso. Cuando está en equilibrio aporta creatividad, entusiasmo y ligereza. En desequilibrio genera ansiedad, insomnio y sequedad.",
    alimentacion: [
      "Alimentos calientes, cocinados y untuosos · sopas, guisos, cremas",
      "Sabores dulce, ácido y salado · equilibran la sequedad y el frío",
      "Grasas saludables · ghee, aceite de sésamo, aguacate",
      "Cereales calientes · arroz basmati, avena cocida, trigo",
      "Especias cálidas · jengibre, canela, comino, cardamomo",
      "Leche caliente con especias antes de dormir",
    ],
    estiloDeVida: [
      "Rutina diaria estable · acostarse y levantarse a la misma hora",
      "Masaje con aceite de sésamo templado (Abhyanga) antes de la ducha",
      "Yoga suave y restaurativo · evitar ejercicio muy intenso",
      "Meditación diaria para calmar la mente dispersa",
      "Mantener el cuerpo caliente · evitar corrientes de aire y frío",
      "Descanso suficiente · Vata necesita más horas de sueño que otros doshas",
    ],
    hierbas: [
      "Ashwagandha · adaptógeno que calma el sistema nervioso y nutre Vata",
      "Shatavari · tonifica y nutre los tejidos, hidrata la sequedad interna",
      "Triphala · regula la digestión y elimina toxinas con suavidad",
      "Jengibre · enciende el fuego digestivo y calienta el interior",
      "Valeriana · calma la ansiedad y favorece el sueño profundo",
    ],
    evitar: [
      "Alimentos crudos, fríos y secos · ensaladas frías, crackers, frutos secos en exceso",
      "Cafeína en exceso · sobreestimula el sistema nervioso de Vata",
      "Ayunos prolongados · desestabilizan la energía de Vata",
      "Exceso de viajes y cambios de rutina · agravan la dispersión",
      "Sabores amargo, picante y astringente en exceso",
    ],
  },
  pitta: {
    descripcion:
      "Pitta es el principio de la transformación: fuego y agua. Gobierna la digestión, el metabolismo y la inteligencia. En equilibrio aporta claridad, determinación y coraje. En desequilibrio genera irritabilidad, inflamación y acidez.",
    alimentacion: [
      "Alimentos frescos y de temporada · ensaladas, frutas, verduras crudas",
      "Sabores dulce, amargo y astringente · enfrían el exceso de fuego",
      "Cereales refrescantes · arroz basmati, cebada, trigo",
      "Lácteos frescos · leche, ghee, queso fresco (con moderación)",
      "Especias suaves · cilantro, hinojo, cúrcuma, menta",
      "Agua de coco y zumos frescos naturales",
    ],
    estiloDeVida: [
      "Evitar el sol directo en las horas centrales del día",
      "Ejercicio moderado en las horas frescas · natación, yoga, caminatas",
      "Meditación para cultivar la paciencia y soltar el control",
      "Contacto con la naturaleza · jardines, bosques, agua",
      "Masaje con aceite de coco · enfría y calma la piel",
      "No saltarse comidas · Pitta necesita comer a sus horas",
    ],
    hierbas: [
      "Amalaki (Amla) · refrescante, antioxidante, tonifica sin calentar",
      "Brahmi · enfría la mente, mejora la concentración sin agitación",
      "Shatavari · nutre y enfría, especialmente el sistema reproductivo",
      "Neem · purifica la sangre y la piel, enfría el exceso de Pitta",
      "Aloe vera (jugo) · enfría el tracto digestivo y reduce la acidez",
    ],
    evitar: [
      "Alimentos picantes, ácidos y fermentados · chile, vinagre, alcohol",
      "Exceso de sal y alimentos fritos o muy aceitosos",
      "Cafeína y estimulantes · agravan la irritabilidad de Pitta",
      "Exposición prolongada al calor y al sol intenso",
      "Competitividad excesiva y autoexigencia desmedida",
    ],
  },
  kapha: {
    descripcion:
      "Kapha es el principio de la estructura: tierra y agua. Gobierna la estabilidad, la lubricación y la inmunidad. En equilibrio aporta calma, fortaleza y lealtad. En desequilibrio genera letargia, retención de líquidos y apego.",
    alimentacion: [
      "Alimentos ligeros, calientes y secos · verduras al vapor, legumbres",
      "Sabores picante, amargo y astringente · activan el metabolismo",
      "Especias estimulantes · jengibre, pimienta negra, cúrcuma, mostaza",
      "Miel cruda (en pequeña cantidad) · es el único dulce que reduce Kapha",
      "Cereales ligeros · mijo, cebada, maíz, trigo sarraceno",
      "Verduras de hoja verde, crucíferas y rábanos",
    ],
    estiloDeVida: [
      "Ejercicio vigoroso diario · correr, nadar, bicicleta, danza",
      "Madrugar · levantarse antes de las 6 h para evitar la pesadez",
      "Evitar dormir durante el día · agrava la letargia de Kapha",
      "Masaje seco (Garshana) con guante de seda antes de la ducha",
      "Variedad y novedad · romper la rutina para evitar el estancamiento",
      "Sauna o baños de vapor · ayudan a eliminar toxinas y pesadez",
    ],
    hierbas: [
      "Trikatu (jengibre + pimienta + pimienta larga) · enciende el fuego digestivo",
      "Guggulu · ayuda al metabolismo de las grasas y reduce la pesadez",
      "Tulsi (albahaca sagrada) · despeja las vías respiratorias, aclara la mente",
      "Punarnava · diurético natural, reduce la retención de líquidos",
      "Triphala · limpia y tonifica el sistema digestivo",
    ],
    evitar: [
      "Alimentos pesados, fríos y aceitosos · frituras, lácteos, dulces",
      "Exceso de trigo, arroz y azúcares refinados",
      "Dormir en exceso y el sedentarismo · agravan Kapha directamente",
      "Ambientes húmedos y fríos sin ventilación",
      "Comer por aburrimiento o por confort emocional",
    ],
  },
};
