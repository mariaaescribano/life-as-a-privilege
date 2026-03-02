
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


export const plantas: Planta[] = [
    { id: 1, nombre: "Manzanilla", nombreCientifico: "Matricaria chamomilla", color: "#c8a83a", foto: "/img/plantas/manzanilla.jpg", fotos: ["/img/plantas/manzanilla.jpg", "/img/plantas/manzanilla-2.jpg"], uso: "Planta de uso interno y externo, indicada especialmente para calmar el sistema digestivo, reducir la ansiedad leve y tratar irritaciones cutáneas. Es una de las plantas más estudiadas y seguras para todas las edades.", propiedades: [ "Apigenina — flavonoide con acción ansiolítica y antiinflamatoria potente", "Bisabolol — aceite esencial con propiedades calmantes y cicatrizantes", "Camazuleno — antiinflamatorio generado durante la destilación al vapor", "Mucílagos — efecto suavizante sobre mucosas digestivas y respiratorias", "Ácidos fenólicos — antioxidantes naturales", ], beneficios: [ "Calma el sistema nervioso y reduce la ansiedad leve", "Alivia cólicos, gases y espasmos digestivos", "Antiinflamatoria en pieles sensibles e irritadas", "Facilita el sueño cuando se toma en infusión antes de dormir", "Cicatrizante y antiséptica en uso tópico", ], formaDeUso: "Infusión: 1–2 cucharaditas de flores secas en 250 ml de agua caliente, reposar 10 min. 2–3 tazas al día. Uso externo: compresas con infusión concentrada o aceite esencial diluido al 2–3 % en aceite portador.", datosCuriosos: [ "Es la hierba medicinal más consumida en forma de infusión en el mundo mediterráneo, por encima del té verde", "El camazuleno azulado del aceite esencial no existe en la planta fresca: se forma únicamente durante la destilación al vapor", "Los antiguos egipcios la consagraban al dios Ra y la utilizaban en rituales de embalsamamiento por sus propiedades conservantes", ], },
  {
    id: 2,
    nombre: "Diente de León",
    nombreCientifico: "Taraxacum officinale",
    color: "#f2c200",
    foto: "/img/plantas/diente-de-leon.jpg",
    uso: "Planta depurativa con acción principal sobre hígado, vesícula biliar y sistema digestivo. Indicada en trastornos hepáticos y biliares, digestiones lentas y problemas cutáneos asociados a sobrecarga hepática.",
    // propiedades: [
    //   "Flavonoides — acción antioxidante y depurativa",
    //   "Carotenoides — protectores celulares",
    //   "Inulina — fibra prebiótica que favorece la flora intestinal",
    //   "Principios amargos — estimulan hígado y digestión",
    //   "Sales potásicas — efecto diurético y depurativo",
    //   "Vitaminas B2, C y A — apoyo inmunológico y antioxidante",
    //   "Minerales como calcio, potasio, hierro, fósforo y magnesio"
    // ],
    beneficios: [
      "Estimula la producción y expulsión de bilis (colerético y colagogo)",
      "Mejora la digestión y actúa como eupéptico",
      "Ligeramente laxante",
      "Ayuda a depurar sangre y piel",
      "Útil como apoyo en psoriasis y dermatitis",
      "Favorece la salud del sistema linfático en uso externo"
    ],
    formaDeUso: "Infusión de hojas o raíz. La raíz tostada puede utilizarse como sustituto del café. Uso externo: oleato aplicado en masaje en zonas linfáticas como senos o axilas.",
    datosCuriosos: [
      "Dioscórides y Avicena lo comparaban con la endivia y la achicoria por su acción depurativa",
      "Antiguamente su raíz tostada se utilizaba como sustituto del café",
      "Sus flores tienen sabor agridulce y se consumen en ensaladas"
    ],
    precauciones: [
      "No aconsejado en personas sin vesícula biliar",
      "Puede causar molestias gástricas en personas con hiperacidez",
      "Se recomienda combinar con plantas ricas en mucílagos como malva o malvavisco"
    ]
  },
  {
    id: 3,
    nombre: "Fumaria",
    nombreCientifico: "Fumaria officinalis",
    color: "#b07aa1",
    foto: "/img/plantas/fumaria.jpg",
    uso: "Planta reguladora hepatobiliar y digestiva, utilizada tradicionalmente como depurativa y para equilibrar la función de la bilis.",
    // propiedades: [
    //   "Alcaloides — acción espasmolítica sobre el esfínter de Oddi",
    //   "Compuestos anfocoleréticos — regulan la producción de bilis",
    //   "Acción colagoga — facilita la expulsión de bilis",
    //   "Actividad antiespasmódica digestiva",
    //   "Modulación de neurotransmisores como GABA y serotonina"
    // ],
    beneficios: [
      "Regula el flujo biliar",
      "Mejora la digestión",
      "Reduce espasmos en estómago e intestino delgado",
      "Acción depurativa tradicional",
      "Efecto moderado sobre el sistema nervioso"
    ],
    formaDeUso: "Infusión de flores y hojas jóvenes.",
    datosCuriosos: [
      "Antiguamente los exorcistas la quemaban para ahuyentar malos espíritus",
      "Tradicionalmente se consumía en ensaladas depurativas pese a su sabor amargo"
    ],
    precauciones: [
      "Consultar al médico en caso de problemas hepatobiliares serios",
      "No aconsejada en personas sin vesícula biliar"
    ]
  },
  {
    id: 4,
    nombre: "Alcachofa",
    nombreCientifico: "Cynara scolymus",
    color: "#4f8a3c",
    foto: "/img/plantas/alcachofa.jpg",
    uso: "Planta hepatoprotectora y digestiva, indicada en digestiones pesadas, colesterol alto y apoyo metabólico.",
    beneficios: [
      "Hepatoprotectora y estimulante de la detoxificación hepática",
      "Facilita la expulsión de bilis",
      "Alivia digestiones pesadas y gases",
      "Ligeramente laxante",
      "Antiemética (reduce náuseas y vómitos)",
      "Diurética",
      "Disminuye colesterol y triglicéridos",
      "Recomendada en personas con diabetes o hiperglucemia"
    ],
    formaDeUso: "Tisanas, sopas y caldos para extraer la cinarina con agua caliente. También en tinturas hidroalcohólicas o hidroglicéridas.",
    datosCuriosos: [
      "Griegos y romanos la utilizaban habitualmente en su alimentación",
      "Brota de su cepa cada año aunque el tallo desaparezca en invierno"
    ]
  },
  {
    id: 5,
    nombre: "Cardo Mariano",
    nombreCientifico: "Silybum marianum",
    color: "#9c2f2f",
    foto: "/img/plantas/cardo-mariano.jpg",
    uso: "Planta hepatoprotectora indicada para regenerar y proteger el hígado frente a toxinas.",
    beneficios: [
      "Regenera células hepáticas",
      "Protege frente a sustancias hepatotóxicas",
      "Actividad antifibrótica",
      "Acción antiinflamatoria e inmunomoduladora",
      "Propiedad antihemorrágica asociada a mejora hepática"
    ],
    formaDeUso: "Consumir la semilla molida en polvo, ya que sus principios activos no se disuelven bien en agua. Puede elaborarse en cápsulas herbales.",
    precauciones: [
      "Puede tener efecto hipertensivo, evitar en personas con tensión alta"
    ]
  }
];