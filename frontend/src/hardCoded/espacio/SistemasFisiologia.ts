// Los 12 sistemas del cuerpo que rodean al ser humano en /metodo/fisiologia/sistemas.
// Cada uno tendrá (María lo irá pasando):
//   · su propio CÓMIC (viñetas)
//   · un TEST de autorregistro: cómo se siente el usuario / qué tal va ese sistema.
// Las fotos (foto) llegan mañana; de momento se muestra la inicial con el color.
import type { Vineta } from "../../components/metodo/ComicViewer";

export type PreguntaTest = {
  texto: string;
  /** Opcional: etiquetas de la escala (por defecto 0-4 / nunca→siempre). */
  opciones?: string[];
};

export type Sistema = {
  key: string;
  label: string;
  /** Color de acento del sistema. */
  color: string;
  /** Foto del sistema (pendiente). */
  foto: string;
  /** Viñetas del cómic del sistema (pendiente de texto e imágenes). */
  comic: Vineta[];
  /** Preguntas del test de autorregistro (pendiente de contenido definitivo). */
  test: PreguntaTest[];
};

const FOTO = (k: string) => `/recorrido/fisiologia/sistemas/${k}.png`;

export const SISTEMAS: Sistema[] = [
  { key: "nervioso",      label: "Nervioso",      color: "#c9a7ff", foto: FOTO("nervioso"),      comic: [], test: [] },
  { key: "cardiovascular", label: "Cardiovascular", color: "#f28b8b", foto: FOTO("cardiovascular"), comic: [], test: [] },
  { key: "respiratorio",  label: "Respiratorio",  color: "#8fd0e6", foto: FOTO("respiratorio"),  comic: [], test: [] },
  { key: "digestivo",     label: "Digestivo",     color: "#f2c86b", foto: FOTO("digestivo"),     comic: [], test: [] },
  { key: "urinario",      label: "Urinario",      color: "#a7d9f2", foto: FOTO("urinario"),      comic: [], test: [] },
  { key: "endocrino",     label: "Endocrino",     color: "#e6a7d9", foto: FOTO("endocrino"),     comic: [], test: [] },
  { key: "linfatico",     label: "Linfático / Inmune", color: "#9fe6b8", foto: FOTO("linfatico"), comic: [], test: [] },
  { key: "muscular",      label: "Muscular",      color: "#e3a6a6", foto: FOTO("muscular"),      comic: [], test: [] },
  { key: "oseo",          label: "Óseo",          color: "#e8e0cf", foto: FOTO("oseo"),          comic: [], test: [] },
  { key: "tegumentario",  label: "Tegumentario (piel)", color: "#f2b48f", foto: FOTO("tegumentario"), comic: [], test: [] },
  { key: "reproductor",   label: "Reproductor",   color: "#d9a7c9", foto: FOTO("reproductor"),   comic: [], test: [] },
  { key: "sensorial",     label: "Sensorial",     color: "#b8d98f", foto: FOTO("sensorial"),     comic: [], test: [] },
];
