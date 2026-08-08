export type PlantaRemedio = {
  nombre: string;
  uso: string;
};

export type Organo = {
  id: string;
  nombre: string;
  descripcionCorta: string;
  preguntas: string[];
  umbral: number;
  resultado: {
    titulo: string;
    descripcion: string;
    plantas: PlantaRemedio[];
  };
};

export const organosFisiologia: Organo[] = [
  {
    id: "cerebro",
    nombre: "Cerebro",
    descripcionCorta: "Centro de mando del sistema nervioso",
    preguntas: [
      "¿Tienes dificultad para concentrarte o sientes la mente nublada con frecuencia?",
      "¿Sufres dolores de cabeza recurrentes?",
      "¿Tu sueño es de mala calidad o insuficiente?",
      "¿Sientes ansiedad o estrés de forma crónica?",
      "¿Tienes episodios de olvidos frecuentes o confusión mental?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu cerebro pide más calma y nutrición",
      descripcion: "La niebla mental, el insomnio y el estrés crónico son señales de que tu sistema nervioso está sobreexigido. Necesita descanso, adaptógenos y antiinflamatorios naturales.",
      plantas: [
        { nombre: "Ashwagandha", uso: "Adaptógeno que reduce el cortisol y mejora la concentración. En polvo o cápsula por la mañana." },
        { nombre: "Ginkgo biloba", uso: "Mejora la circulación cerebral y la memoria. Infusión o cápsula en ayunas." },
        { nombre: "Romero", uso: "Estimula la circulación cerebral. Huele la planta fresca o úsala en infusión." },
        { nombre: "Pasiflora", uso: "Calma el sistema nervioso y mejora el sueño. Infusión antes de dormir." },
        { nombre: "Cúrcuma con pimienta", uso: "Antiinflamatoria cerebral. Añádela a tus comidas cada día para proteger las neuronas." },
      ],
    },
  },
  {
    id: "corazon",
    nombre: "Corazón",
    descripcionCorta: "Motor que impulsa la sangre por todo el cuerpo",
    preguntas: [
      "¿Sientes palpitaciones o latidos irregulares con frecuencia?",
      "¿Te fatigas con esfuerzos que antes no te cansaban?",
      "¿Tienes presión en el pecho o sensación de ahogo?",
      "¿Sientes las manos y los pies fríos habitualmente?",
      "¿Vives con niveles altos de estrés o ansiedad de forma crónica?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu corazón necesita más calma y apoyo circulatorio",
      descripcion: "Las palpitaciones, el cansancio y el estrés crónico son señales de que tu sistema cardiovascular está bajo presión. Pequeños cambios naturales pueden marcar una gran diferencia.",
      plantas: [
        { nombre: "Espino blanco", uso: "Tonifica el corazón y regula el ritmo cardíaco. Infusión dos veces al día." },
        { nombre: "Ajo crudo", uso: "Reduce la presión arterial y mejora la circulación. Un diente en ayunas o en las comidas." },
        { nombre: "Jengibre", uso: "Mejora la circulación y reduce la inflamación vascular. Rallado en infusión o en comidas." },
        { nombre: "Cacao puro", uso: "Rico en flavonoides que protegen el corazón. Una cucharada en agua caliente sin azúcar." },
        { nombre: "Semillas de calabaza", uso: "Ricas en magnesio, regulan el ritmo cardíaco y relajan la musculatura. Un puñado al día." },
      ],
    },
  },
  {
    id: "pulmones",
    nombre: "Pulmones",
    descripcionCorta: "Intercambian oxígeno y dióxido de carbono",
    preguntas: [
      "¿Tienes tos frecuente sin estar resfriado?",
      "¿Sientes dificultad para respirar profundamente?",
      "¿Tienes mucosidad recurrente o crónica?",
      "¿Sientes el pecho cargado o con presión?",
      "¿Estás expuesto a ambientes contaminados, polvo o humo de forma habitual?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tus pulmones necesitan limpieza y apoyo",
      descripcion: "La tos crónica, la mucosidad y la dificultad respiratoria indican que tus vías respiratorias están inflamadas o congestionadas. Las plantas expectorantes y antiinflamatorias son tus aliadas.",
      plantas: [
        { nombre: "Tomillo", uso: "Expectorante y antiséptico respiratorio. Infusión 3 veces al día con miel." },
        { nombre: "Orégano", uso: "Antimicrobiano natural. Aceite de orégano diluido o infusión de la hierba seca." },
        { nombre: "Jengibre con limón", uso: "Desinflamatorio y mucolítico. Infusión caliente con limón y miel cada mañana." },
        { nombre: "Eucalipto", uso: "Descongestionante potente. Inhalaciones con agua caliente y hojas de eucalipto." },
        { nombre: "Regaliz", uso: "Calma la tos y protege las mucosas respiratorias. Infusión suave, con moderación." },
      ],
    },
  },
  {
    id: "higado",
    nombre: "Hígado",
    descripcionCorta: "Gran depurador y gestor de nutrientes",
    preguntas: [
      "¿Sientes fatiga frecuente, incluso después de dormir bien?",
      "¿Tienes la piel con tono apagado, amarillento o con manchas?",
      "¿Sientes pesadez o molestia en el lado derecho del abdomen?",
      "¿Tienes digestiones pesadas, gases o hinchazón frecuente?",
      "¿Consumes alcohol, medicamentos o alimentos muy procesados habitualmente?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu hígado está sobrecargado",
      descripcion: "El hígado filtra todo lo que entra en tu cuerpo. La fatiga, la piel apagada y la digestión lenta son señales de que necesita apoyo para depurarse y regenerarse.",
      plantas: [
        { nombre: "Cardo mariano", uso: "La planta hepatoprotectora por excelencia. Infusión o cápsula en ayunas cada mañana." },
        { nombre: "Diente de león", uso: "Estimula la producción de bilis y la depuración hepática. Infusión antes de las comidas." },
        { nombre: "Cúrcuma", uso: "Antiinflamatoria y regeneradora del hígado. En comidas con pimienta negra para potenciar su absorción." },
        { nombre: "Limón en ayunas", uso: "Estimula el hígado y la vesícula biliar. Zumo de medio limón en agua tibia cada mañana." },
        { nombre: "Alcachofa", uso: "Protege y regenera el tejido hepático. Infusión de hojas o consumida en la dieta." },
      ],
    },
  },
  {
    id: "estomago",
    nombre: "Estómago",
    descripcionCorta: "Disuelve los alimentos en sus formas más simples",
    preguntas: [
      "¿Sientes ardor o acidez con frecuencia?",
      "¿Tienes náuseas o sensación de pesadez tras comer?",
      "¿Tu estómago se inflama habitualmente después de las comidas?",
      "¿Tienes episodios de reflujo?",
      "¿Comes con estrés, muy rápido o de forma irregular?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu estómago necesita calma y apoyo digestivo",
      descripcion: "El ardor, la acidez y la pesadez postprandial indican inflamación de la mucosa gástrica. Las plantas digestivas y calmantes pueden restaurar el equilibrio y proteger tu mucosa.",
      plantas: [
        { nombre: "Manzanilla", uso: "Antiinflamatoria y calmante de la mucosa gástrica. Infusión después de cada comida." },
        { nombre: "Jengibre", uso: "Estimula la digestión y reduce las náuseas. Rallado en infusión o en comidas." },
        { nombre: "Aloe vera", uso: "Cicatriza y calma la mucosa gástrica. Gel puro (1-2 cucharadas) en ayunas." },
        { nombre: "Regaliz deglicirrizinado", uso: "Protege la mucosa del estómago frente al ácido. En cápsulas antes de las comidas." },
        { nombre: "Semillas de lino", uso: "Forman una capa protectora sobre la mucosa irritada. Una cucharada en agua fría en ayunas." },
      ],
    },
  },
  {
    id: "intestinos",
    nombre: "Intestinos",
    descripcionCorta: "Tu segundo cerebro y hogar de la microbiota",
    preguntas: [
      "¿Tienes estreñimiento o diarrea con frecuencia?",
      "¿Sientes hinchazón y gases después de comer?",
      "¿Tu digestión es lenta o te sientes mal tras las comidas?",
      "¿Notas que tu estado de ánimo empeora cuando tu digestión está mal?",
      "¿Consumes poca fibra o muchos alimentos ultraprocesados?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu microbiota necesita reequilibrarse",
      descripcion: "Los intestinos son tu segundo cerebro. La hinchazón, el estreñimiento y los cambios de humor son señales de que tu microbiota está desequilibrada y tu tránsito intestinal necesita apoyo.",
      plantas: [
        { nombre: "Hinojo", uso: "Reduce los gases y calma los espasmos intestinales. Infusión después de las comidas." },
        { nombre: "Psyllium", uso: "Regula el tránsito intestinal en ambos sentidos. Una cucharada en agua abundante antes de comer." },
        { nombre: "Menta piperita", uso: "Relaja la musculatura intestinal y reduce los gases. Infusión entre comidas." },
        { nombre: "Jengibre", uso: "Estimula el movimiento intestinal y reduce la inflamación de la mucosa." },
        { nombre: "Chucrut o kéfir", uso: "Probióticos naturales que restauran la microbiota intestinal. Pequeñas cantidades a diario." },
      ],
    },
  },
  {
    id: "rinones",
    nombre: "Riñones",
    descripcionCorta: "Filtran la sangre y regulan el equilibrio hídrico",
    preguntas: [
      "¿Tienes molestias en la zona lumbar baja (no de origen muscular)?",
      "¿Orinas poco, con dificultad o con mal olor frecuentemente?",
      "¿Retienes líquidos (piernas, tobillos o cara hinchados)?",
      "¿Bebes menos de 1,5 litros de agua al día?",
      "¿Tu dieta es alta en sal, proteína animal o alimentos procesados?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tus riñones necesitan más agua y depuración",
      descripcion: "Los riñones filtran la sangre constantemente. La retención de líquidos, las molestias lumbares y la orina concentrada indican que necesitan más hidratación y plantas depurativas.",
      plantas: [
        { nombre: "Cola de caballo", uso: "Diurética y depurativa renal. Infusión 2-3 veces al día entre comidas." },
        { nombre: "Diente de León", uso: "Diurético natural que no agota el potasio. Infusión o ensalada con las hojas frescas." },
        { nombre: "Perejil fresco", uso: "Depurativo renal potente. Infusión de perejil fresco en ayunas, con moderación." },
        { nombre: "Ortosifón (té de Java)", uso: "Diurético suave y depurativo del tracto urinario. Infusión en ayunas." },
        { nombre: "Agua con limón y pepino", uso: "Hidratante, alcalinizante y depurativa. Al menos 2 litros al día, siempre." },
      ],
    },
  },
  {
    id: "bazo",
    nombre: "Bazo",
    descripcionCorta: "Guardián de la sangre y del sistema inmune",
    preguntas: [
      "¿Te enfermas frecuentemente (resfriados, infecciones recurrentes)?",
      "¿Sientes cansancio especialmente después de comer?",
      "¿Tienes anemia o niveles bajos de hierro?",
      "¿Sientes pesadez o malestar en el lado izquierdo del abdomen?",
      "¿Sufres bajones de energía o picos de azúcar frecuentes?",
    ],
    umbral: 3,
    resultado: {
      titulo: "Tu bazo e inmunidad necesitan refuerzo",
      descripcion: "El bazo es el guardián de tu sangre y tu sistema inmune. La fatiga postprandial, las infecciones recurrentes y la anemia son señales de que necesita apoyo.",
      plantas: [
        { nombre: "Equinácea", uso: "Estimula el sistema inmune. En cápsulas o infusión en los primeros síntomas o preventivamente en otoño." },
        { nombre: "Astragalus", uso: "Adaptógeno que fortalece la inmunidad a largo plazo. En cápsulas por las mañanas." },
        { nombre: "Bayas de saúco", uso: "Antiviral e inmunoestimulante. En jarabe o infusión especialmente en temporada de frío." },
        { nombre: "Cúrcuma con pimienta", uso: "Antiinflamatoria y depurativa de la sangre. En comidas a diario." },
        { nombre: "Ortiga", uso: "Rica en hierro biodisponible, ideal para la anemia. Infusión en ayunas durante varias semanas." },
      ],
    },
  },
];
