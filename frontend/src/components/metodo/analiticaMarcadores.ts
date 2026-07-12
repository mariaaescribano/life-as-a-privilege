// Marcadores de una analítica de sangre de rutina, para el lector guiado
// «Tu analítica» (Fisiología). Los rangos son ORIENTATIVOS de adulto y varían
// según laboratorio, edad y sexo — la página deja claro que no es diagnóstico.

export type Sexo = "mujer" | "hombre";

// Rango normal: o común a ambos sexos [min, max], o distinto por sexo.
export type Rango = [number, number] | { m: [number, number]; h: [number, number] };

export interface Marcador {
  id: string;
  nombre: string;
  unidad: string;
  rango: Rango;
  /** Qué es / qué significa, en lenguaje llano (con guiños a lo aprendido). */
  explica: string;
  /** Un decimal de precisión razonable para el input (0, 1 o 2). */
  decimales?: number;
}

export interface GrupoMarcadores {
  grupo: string;
  emoji: string;
  marcadores: Marcador[];
}

export const rangoDe = (r: Rango, sexo: Sexo): [number, number] =>
  Array.isArray(r) ? r : (sexo === "mujer" ? r.m : r.h);

export const ANALITICA: GrupoMarcadores[] = [
  {
    grupo: "Sangre y oxígeno",
    emoji: "🩸",
    marcadores: [
      { id: "hemoglobina", nombre: "Hemoglobina", unidad: "g/dL", rango: { m: [12, 16], h: [13.5, 17.5] }, decimales: 1,
        explica: "La proteína de tus glóbulos rojos que transporta el oxígeno que respiras a cada célula. Baja = posible anemia (menos oxígeno)." },
      { id: "hematocrito", nombre: "Hematocrito", unidad: "%", rango: { m: [36, 46], h: [41, 53] }, decimales: 1,
        explica: "Qué proporción de tu sangre son glóbulos rojos. Va de la mano de la hemoglobina." },
      { id: "hematies", nombre: "Hematíes (glóbulos rojos)", unidad: "mill/µL", rango: { m: [4.0, 5.2], h: [4.5, 5.9] }, decimales: 2,
        explica: "El número de glóbulos rojos, los que llevan el oxígeno por todo el cuerpo." },
    ],
  },
  {
    grupo: "Defensas y coagulación",
    emoji: "🛡️",
    marcadores: [
      { id: "leucocitos", nombre: "Leucocitos (glóbulos blancos)", unidad: "/µL", rango: [4000, 11000], decimales: 0,
        explica: "Tu ejército de defensa. Suelen subir con infecciones e inflamación." },
      { id: "plaquetas", nombre: "Plaquetas", unidad: "/µL", rango: [150000, 400000], decimales: 0,
        explica: "Las que taponan las heridas y hacen que la sangre coagule." },
    ],
  },
  {
    grupo: "Energía y azúcar",
    emoji: "⚡",
    marcadores: [
      { id: "glucosa", nombre: "Glucosa (en ayunas)", unidad: "mg/dL", rango: [70, 100], decimales: 0,
        explica: "El azúcar en tu sangre: el combustible que tus mitocondrias convierten en energía (ATP). Alta y sostenida se asocia a diabetes." },
      { id: "hba1c", nombre: "Hemoglobina glicosilada (HbA1c)", unidad: "%", rango: [4, 5.6], decimales: 1,
        explica: "Tu media de azúcar de los últimos ~3 meses. Una foto de largo plazo, no del día." },
    ],
  },
  {
    grupo: "Grasas (lípidos)",
    emoji: "🫧",
    marcadores: [
      { id: "colesterol", nombre: "Colesterol total", unidad: "mg/dL", rango: [120, 200], decimales: 0,
        explica: "Una grasa necesaria para tus membranas y hormonas. En exceso, se acumula en las arterias." },
      { id: "hdl", nombre: "Colesterol HDL («bueno»)", unidad: "mg/dL", rango: { m: [50, 100], h: [40, 100] }, decimales: 0,
        explica: "El que retira el colesterol sobrante de las arterias. Aquí, cuanto más alto, mejor." },
      { id: "ldl", nombre: "Colesterol LDL («malo»)", unidad: "mg/dL", rango: [0, 130], decimales: 0,
        explica: "El que puede depositarse en las arterias. Cuanto más bajo, mejor (ideal < 100)." },
      { id: "trigliceridos", nombre: "Triglicéridos", unidad: "mg/dL", rango: [40, 150], decimales: 0,
        explica: "La grasa que usas como reserva de energía. Suben con azúcar, alcohol y exceso de calorías." },
    ],
  },
  {
    grupo: "Hígado",
    emoji: "🫀",
    marcadores: [
      { id: "got", nombre: "GOT / AST", unidad: "U/L", rango: [5, 34], decimales: 0,
        explica: "Una enzima del hígado (y el músculo). Sube cuando esas células están dañadas." },
      { id: "gpt", nombre: "GPT / ALT", unidad: "U/L", rango: { m: [5, 33], h: [5, 41] }, decimales: 0,
        explica: "Enzima muy específica del hígado. Una de las señales más finas de cómo está." },
      { id: "ggt", nombre: "GGT", unidad: "U/L", rango: { m: [6, 42], h: [8, 61] }, decimales: 0,
        explica: "Otra enzima hepática; sensible al alcohol y a las vías biliares." },
    ],
  },
  {
    grupo: "Riñón",
    emoji: "💧",
    marcadores: [
      { id: "creatinina", nombre: "Creatinina", unidad: "mg/dL", rango: { m: [0.5, 1.0], h: [0.7, 1.3] }, decimales: 2,
        explica: "Un residuo que filtran tus riñones. Si sube, puede que no estén filtrando bien." },
      { id: "urea", nombre: "Urea", unidad: "mg/dL", rango: [15, 45], decimales: 0,
        explica: "Otro residuo que eliminan los riñones; refleja también tu hidratación y tu dieta." },
      { id: "acidourico", nombre: "Ácido úrico", unidad: "mg/dL", rango: { m: [2.4, 6.0], h: [3.4, 7.0] }, decimales: 1,
        explica: "En exceso, puede cristalizar en las articulaciones (gota)." },
    ],
  },
  {
    grupo: "Hierro",
    emoji: "🧲",
    marcadores: [
      { id: "hierro", nombre: "Hierro", unidad: "µg/dL", rango: [50, 170], decimales: 0,
        explica: "El mineral con el que fabricas hemoglobina. Sin él, no puedes transportar bien el oxígeno." },
      { id: "ferritina", nombre: "Ferritina", unidad: "ng/mL", rango: { m: [15, 150], h: [30, 400] }, decimales: 0,
        explica: "Tu despensa de hierro. Baja = reservas agotadas, aunque el hierro del día parezca normal." },
    ],
  },
  {
    grupo: "Tiroides",
    emoji: "🦋",
    marcadores: [
      { id: "tsh", nombre: "TSH", unidad: "µU/mL", rango: [0.4, 4.0], decimales: 2,
        explica: "La orden que el cerebro le da a la tiroides. Alta suele indicar tiroides lenta; baja, acelerada." },
    ],
  },
  {
    grupo: "Vitaminas",
    emoji: "🌿",
    marcadores: [
      { id: "vitd", nombre: "Vitamina D", unidad: "ng/mL", rango: [30, 100], decimales: 0,
        explica: "Clave para huesos, defensas y ánimo. En muchos países casi todo el mundo la tiene baja." },
      { id: "vitb12", nombre: "Vitamina B12", unidad: "pg/mL", rango: [200, 900], decimales: 0,
        explica: "Esencial para los nervios y para fabricar glóbulos rojos. Suele bajar en dietas sin productos animales." },
      { id: "folico", nombre: "Ácido fólico", unidad: "ng/mL", rango: [3, 17], decimales: 1,
        explica: "Necesario para crear células nuevas; especialmente importante en el embarazo." },
    ],
  },
  {
    grupo: "Iones (sales)",
    emoji: "🧂",
    marcadores: [
      { id: "sodio", nombre: "Sodio", unidad: "mEq/L", rango: [135, 145], decimales: 0,
        explica: "Regula el agua de tu cuerpo y la señal de tus nervios. Muy estable normalmente." },
      { id: "potasio", nombre: "Potasio", unidad: "mEq/L", rango: [3.5, 5.1], decimales: 1,
        explica: "Vital para el latido del corazón y la contracción muscular. Su rango es estrecho por algo." },
    ],
  },
];

// Lista plana (útil para guardar/recorrer).
export const TODOS_MARCADORES: Marcador[] = ANALITICA.flatMap((g) => g.marcadores);
