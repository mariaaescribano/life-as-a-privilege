/**
 * La formación de María que se enseña en los popups de /asesorias («Mi formación»): el título, la imagen de su
 * diploma (nombre de fichero de `assets/certificados`, sin extensión) y, si el diploma lo dice, las horas.
 * Los títulos van tal cual figuran en cada diploma (los de Coursera, en inglés). Un diploma que no indica
 * horas no lleva `horas`: nunca se inventan.
 */
export type FormacionItem = { titulo: string; entidad?: string; img: string; horas?: number };

const certImages = import.meta.glob<string>("../assets/certificados/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" });

/** La imagen (ya empaquetada) del diploma con ese nombre de fichero. */
export const imagenDiploma = (nombre: string): string | undefined => {
  const hit = Object.entries(certImages).find(([ruta]) => ruta.split("/").pop()!.replace(/\.\w+$/, "") === nombre);
  return hit?.[1];
};

export const FORMACION_PSICOLOGIA: FormacionItem[] = [
  { titulo: "Experto en Psicopatología y Psiquiatría", entidad: "Formación Psicoterapia · SEMPyP", img: "fp0", horas: 300 },
  { titulo: "Experto en Trastornos Alimentarios", entidad: "Formación Psicoterapia · SEMPyP", img: "fp2", horas: 250 },
  { titulo: "Experto en Psicoterapia Breve de Pareja", entidad: "Formación Psicoterapia · SEMPyP", img: "fp1" },
];

export const FORMACION_FISIOLOGIA: FormacionItem[] = [
  { titulo: "Anatomy", entidad: "University of Michigan", img: "e1" },
  { titulo: "Human Anatomy & Physiology I", entidad: "Rice University", img: "e2" },
  { titulo: "Immunology: The Immune System and its Failures", entidad: "Imperial College London", img: "e0" },
  { titulo: "Vital Signs: Understanding What the Body Is Telling Us", entidad: "University of Pennsylvania", img: "32" },
  { titulo: "Engineering Health: Introduction to Yoga and Physiology", entidad: "New York University", img: "25" },
  { titulo: "Coaching and Training Women", entidad: "American Council on Exercise", img: "24" },
  { titulo: "Basic Principles of Cell Signaling", entidad: "KAIST", img: "13" },
  { titulo: "Contemporary Biology", entidad: "University of North Texas", img: "14" },
  { titulo: "Epigenetic Control of Gene Expression", entidad: "The University of Melbourne", img: "19" },
  { titulo: "Microbiology Foundations", entidad: "Lecturio", img: "20" },
  { titulo: "Introduction to the Biology of Cancer", entidad: "Johns Hopkins University", img: "35" },
  { titulo: "Cancer Biology", entidad: "Johns Hopkins University", img: "e5" },
  { titulo: "National Academy of Sports Medicine Nutrition Essentials", entidad: "NASM", img: "18" },
  { titulo: "Science of Diet and Exercise", entidad: "NASM", img: "e6" },
  { titulo: "Biochemical Principles of Energy Metabolism", entidad: "KAIST", img: "11" },
  { titulo: "Gut Check: Exploring Your Microbiome", entidad: "University of Colorado Boulder · UC San Diego", img: "7" },
  { titulo: "Understanding Plants - Part II: Fundamentals of Plant Biology", entidad: "Tel Aviv University", img: "3" },
];
