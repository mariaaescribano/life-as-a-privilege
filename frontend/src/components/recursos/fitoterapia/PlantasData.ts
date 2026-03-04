
export type Planta = {
  id: number;
  nombre: string;
  nombreCientifico: string;
  color: string;
  foto: string;
  fotos?: string[];
  videoUrl?: string;
  uso: string;
  propiedades?: string[];
  beneficios: string[];
  formaDeUso: string;
  datosCuriosos?: string[];
  precauciones?: string[];
};


export const plantas: Planta[] = 
[
  {
    id: 1,
    nombre: "Perejil",
    nombreCientifico: "Petroselinum crispum",
    color: "#2e7d32",
    foto: "/img/plantas/Perejil.png",
    videoUrl: "https://youtu.be/tUB4apNjgcY?si=HmAEv1eMND5fQ2-H",
    uso: "Planta depurativa y diurética que apoya la función renal y fortalece el sistema inmunitario.",
    beneficios: [
      "Favorece el funcionamiento del riñón",
      "Ayuda a eliminar toxinas",
      "Rico en vitamina C y vitamina K",
      "Potente antioxidante",
      "Fortalece el sistema inmunitario",
      "Protege del daño oxidativo",
      "Favorece la circulación",
      "Apoya la salud cardiovascular"
    ],
    formaDeUso: "Fresco en ensaladas y platos, en infusión o como ingrediente en jugos verdes.",
    datosCuriosos: [
      "Es una de las plantas más depurativas que existen",
      "Se utiliza tanto en cocina como en remedios tradicionales"
    ]
  },
  {
    id: 2,
    nombre: "Manzanilla",
    nombreCientifico: "Matricaria chamomilla",
    color: "#f4c542",
    foto: "/img/plantas/Manzanilla.png",
    videoUrl: "https://youtu.be/uuFbrCorj7Y?si=XH-Z_LfWXkETLaK_",
    uso: "Planta digestiva, calmante y antiinflamatoria ideal para molestias digestivas y nerviosas.",
    beneficios: [
      "Favorece la digestión",
      "Antiinflamatoria y relajante muscular",
      "Alivia dolores digestivos y menstruales",
      "Rica en antioxidantes",
      "Cicatrizante y calmante de irritaciones",
      "Calma el sistema nervioso",
      "Reduce el estrés",
      "Favorece el descanso nocturno"
    ],
    formaDeUso: "En infusión diaria, compresas para la piel o como parte del cuidado natural.",
    datosCuriosos: [
      "Fue utilizada como ofrenda en la antigüedad",
      "Puede utilizarse a diario por su acción suave"
    ]
  },
  {
    id: 3,
    nombre: "Orégano",
    nombreCientifico: "Origanum vulgare",
    color: "#4a6b2f",
    foto: "/img/plantas/Oregano.png",
    videoUrl: "https://youtu.be/NFft0FeeVnE?si=e2SRy3TIQf_Pi6DW",
    uso: "Planta digestiva y antimicrobiana que favorece la microbiota y la salud cardiovascular.",
    beneficios: [
      "Potente antibacteriano y antifúngico",
      "Mejora la digestión",
      "Reduce la inflamación intestinal",
      "Favorece el equilibrio de la microbiota",
      "Refuerza el sistema inmunitario",
      "Puede disminuir el colesterol LDL",
      "Ayuda a aumentar el HDL",
      "Estimula el metabolismo"
    ],
    formaDeUso: "Como condimento en comidas o en infusión.",
    datosCuriosos: [
      "Su nombre significa “alegría de oro” en griego",
      "Es rico en aceites esenciales"
    ]
  },
  {
    id: 4,
    nombre: "Tomillo",
    nombreCientifico: "Thymus vulgaris",
    color: "#6a8f3c",
    foto: "/img/plantas/Tomillo.png",
    videoUrl: "https://youtu.be/xF0HvXVkMYY?si=9g1zEnjzUW_GzvnY",
    uso: "Planta antibacteriana y digestiva que fortalece el sistema inmunitario.",
    beneficios: [
      "Potente antibacteriano natural",
      "Inhibe la candidiasis",
      "Puede combatir Helicobacter pylori",
      "Favorece la digestión",
      "Rico en antioxidantes",
      "Refuerza el sistema inmunitario",
      "Protege del estrés oxidativo",
      "Aporta energía natural"
    ],
    formaDeUso: "En infusión, como condimento o vaporizaciones.",
    datosCuriosos: [
      "Es considerada una de las plantas más antibacterianas",
      "Puede estimular de forma equilibrada"
    ]
  },
  {
    id: 5,
    nombre: "Laurel",
    nombreCientifico: "Laurus nobilis",
    color: "#3f6b3f",
    foto: "/img/plantas/Laurel.png",
    videoUrl: "https://youtu.be/YY2EP3FoBj0?si=P1i8bvCPck5hVxgp",
    uso: "Planta digestiva y protectora usada tradicionalmente para comidas pesadas.",
    beneficios: [
      "Mejora la digestión",
      "Reduce la inflamación abdominal",
      "Propiedades antimicrobianas",
      "Acción antioxidante",
      "Protege frente a bacterias",
      "Ayuda a despejar vías respiratorias"
    ],
    formaDeUso: "En guisos, caldos o en infusión.",
    datosCuriosos: [
      "Símbolo de victoria en la antigüedad",
      "Muy utilizado en cocina mediterránea"
    ]
  },
  {
    id: 6,
    nombre: "Canela",
    nombreCientifico: "Cinnamomum verum",
    color: "#a0522d",
    foto: "/img/plantas/Canela.png",
    videoUrl: "https://youtu.be/-4PgvcvE_k0?si=MWQlLoJpMNpoKD42",
    uso: "Especia reguladora del azúcar en sangre y estimulante circulatoria.",
    beneficios: [
      "Regula los niveles de azúcar",
      "Mejora la sensibilidad a la insulina",
      "Antiinflamatoria",
      "Antibacteriana",
      "Estimula la circulación",
      "Mejora el estado de ánimo"
    ],
    formaDeUso: "En infusiones, postres, batidos o espolvoreada.",
    datosCuriosos: [
      "Una de las especias más antiguas del mundo",
      "Su aroma tiene efectos estimulantes"
    ]
  },
  {
    id: 7,
    nombre: "Jengibre",
    nombreCientifico: "Zingiber officinale",
    color: "#c68642",
    foto: "/img/plantas/Jengibre.png",
    videoUrl: "https://youtu.be/Fprj4svcHOc?si=8XS0G67roIHAEkjP",
    uso: "Raíz digestiva y antiinflamatoria que mejora la circulación.",
    beneficios: [
      "Mejora la digestión",
      "Alivia la pesadez estomacal",
      "Potente antiinflamatorio",
      "Útil para dolor muscular",
      "Rico en antioxidantes",
      "Refuerza el sistema inmunitario",
      "Mejora la circulación",
      "Aporta energía natural"
    ],
    formaDeUso: "En infusión, rallado en comidas o batidos.",
    datosCuriosos: [
      "Usado en medicina tradicional desde hace miles de años",
      "Muy versátil en cocina y salud natural"
    ]
  },
  {
    id: 8,
    nombre: "Cúrcuma",
    nombreCientifico: "Curcuma longa",
    color: "#d4a017",
    foto: "/img/plantas/Curcuma.png",
    videoUrl: "https://youtu.be/QRgp0yhtCoc?si=nt9KRA0RZUO8uZC8",
    uso: "Especia antiinflamatoria y antioxidante que favorece la salud hepática.",
    beneficios: [
      "Potente acción antiinflamatoria",
      "Reduce la inflamación crónica",
      "Antioxidante natural",
      "Favorece la salud del hígado",
      "Apoya la desintoxicación",
      "Mejora el rendimiento cognitivo"
    ],
    formaDeUso: "En sopas, guisos, infusiones o combinada con pimienta.",
    datosCuriosos: [
      "Contiene curcumina como compuesto activo",
      "Una de las especias más estudiadas"
    ]
  },
  {
    id: 9,
    nombre: "Pimienta",
    nombreCientifico: "Piper nigrum",
    color: "#1c1c1c",
    foto: "/img/plantas/Pimienta.png",
    videoUrl: "https://youtu.be/HXqVq14MM6U?si=YCmfJNHY9bu6Xsrh",
    uso: "Especia estimulante que activa el metabolismo y mejora la digestión.",
    beneficios: [
      "Activa el metabolismo",
      "Favorece la digestión",
      "Mejora la absorción de nutrientes",
      "Incrementa la capacidad cognitiva",
      "Rica en antioxidantes",
      "Propiedades antimicrobianas"
    ],
    formaDeUso: "Como condimento diario, preferiblemente recién molida.",
    datosCuriosos: [
      "Mejora la absorción de la curcumina",
      "Fue una de las especias más comercializadas históricamente"
    ]
  }
];