/* ══════════════════════════════════════════════════════════════
   TCM ELEMENT THEME
   Colores e iconos tomados directamente de TCMrecursos.tsx para
   garantizar coherencia visual en toda la experiencia TCM.
══════════════════════════════════════════════════════════════ */
import React from "react";

export type ElementTheme = {
  bg: string;     // color oscuro profundo del elemento
  accent: string; // color luminoso para texto, bordes e iconos
  icon: React.ReactNode;
};

/* ─── Iconos (mismos paths que TCMrecursos.tsx) ────────────── */
const EarthIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M200-80v-80h240v-160h-80q-83 0-141.5-58.5T160-520q0-60 33-110.5t89-73.5q9-75 65.5-125.5T480-880q76 0 132.5 50.5T678-704q56 23 89 73.5T800-520q0 83-58.5 141.5T600-320h-80v160h240v80H200Zm160-320h240q50 0 85-35t35-85q0-36-20.5-66T646-630l-42-18-6-46q-6-45-39.5-75.5T480-800q-45 0-78.5 30.5T362-694l-6 46-42 18q-33 14-53.5 44T240-520q0 50 35 85t85 35Zm120-200Z" />
  </svg>
);

const FireIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
  </svg>
);

const WoodIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M440-690v-100q0-42 29-71t71-29h100v100q0 42-29 71t-71 29H440ZM220-450q-58 0-99-41t-41-99v-140h140q58 0 99 41t41 99v140H220ZM640-90q-39 0-74.5-12T501-135l-33 33q-11 11-28 11t-28-11q-11-11-11-28t11-28l33-33q-21-29-33-64.5T400-330q0-100 70-170.5T640-571h241v241q0 100-70.5 170T640-90Zm0-80q67 0 113-47t46-113v-160H640q-66 0-113 46.5T480-330q0 23 5.5 43.5T502-248l110-110q11-11 28-11t28 11q11 11 11 28t-11 28L558-192q18 11 38.5 16.5T640-170Zm1-161Z" />
  </svg>
);

const MetalIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M480-80q-134 0-227-93t-93-227v-200q0-122 96-201t224-79q128 0 224 79t96 201v520H480Zm0-80h80q-19-25-29.5-55.5T520-280v-42q-10 1-20 1.5t-20 .5q-67 0-129.5-23.5T240-415v15q0 100 70 170t170 70Zm120-120q0 50 35 85t85 35v-255q-26 26-56 44.5T600-340v60ZM440-560q0-66-45-111t-109-48q-22 24-34 54t-12 65q0 89 72.5 144.5T480-400q95 0 167.5-55.5T720-600q0-35-12-65.5T674-720q-64 2-109 48t-45 112h-80Zm-128.5-11.5Q300-583 300-600t11.5-28.5Q323-640 340-640t28.5 11.5Q380-617 380-600t-11.5 28.5Q357-560 340-560t-28.5-11.5Zm280 0Q580-583 580-600t11.5-28.5Q603-640 620-640t28.5 11.5Q660-617 660-600t-11.5 28.5Q637-560 620-560t-28.5-11.5ZM370-778q34 14 62 37t48 52q20-29 47.5-52t61.5-37q-25-11-52.5-16.5T480-800q-29 0-56.5 5.5T370-778Zm430 618H520h280Zm-320 0q-100 0-170-70t-70-170q0 100 70 170t170 70h80-80Zm120-120q0 50 35 85t85 35q-50 0-85-35t-35-85ZM480-689Z" />
  </svg>
);

const WaterIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35Zm-239.5 26Q160-268 160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80q-137 0-228.5-94ZM652-230.5Q720-301 720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160q104 0 172-70.5ZM480-480Z" />
  </svg>
);

const YinYangIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M 100 2 A 98 98 0 0 1 100 198 A 49 49 0 0 1 100 100 A 49 49 0 0 0 100 2 Z" fill="currentColor" opacity="0.6" />
    <circle cx="100" cy="51" r="16" fill="currentColor" opacity="0.6" />
    <circle cx="100" cy="149" r="16" fill="currentColor" opacity="0.25" />
  </svg>
);

/* ─── Mapa de temas por nombre ─────────────────────────────── */
// Cinco Movimientos — colores exactos de TCMrecursos.tsx
const ELEMENT_THEMES: Record<string, ElementTheme> = {
  "Madera": { bg: "#3d1a08", accent: "#d4895a", icon: <EarthIcon /> },
  "Fuego":  { bg: "#3d0808", accent: "#e06060", icon: <FireIcon /> },
  "Tierra": { bg: "#082d08", accent: "#5ab85a", icon: <WoodIcon /> },
  "Metal":  { bg: "#083030", accent: "#5ecfca", icon: <MetalIcon /> },
  "Agua":   { bg: "#08102d", accent: "#5a90e0", icon: <WaterIcon /> },

  // Constituciones (mapeadas al sistema de órganos gobernante)
  "Equilibrado":          { bg: "#2a2408", accent: "#c8b45a", icon: <YinYangIcon /> },
  "Deficiencia de Qi":    { bg: "#082d08", accent: "#5ab85a", icon: <WoodIcon /> },
  "Deficiencia de Yang":  { bg: "#08102d", accent: "#5a90e0", icon: <WaterIcon /> },
  "Deficiencia de Yin":   { bg: "#0d1830", accent: "#7abbe8", icon: <WaterIcon /> },
  "Flema-Humedad":        { bg: "#082d08", accent: "#5ab85a", icon: <WoodIcon /> },
  "Calor-Humedad":        { bg: "#3d0808", accent: "#e06060", icon: <FireIcon /> },
  "Estancamiento de Qi":  { bg: "#3d1a08", accent: "#d4895a", icon: <EarthIcon /> },
};

const DEFAULT_THEME: ElementTheme = {
  bg: "#1a0808",
  accent: "#da7171",
  icon: null,
};

export const getTheme = (name: string): ElementTheme =>
  ELEMENT_THEMES[name] ?? DEFAULT_THEME;

/* ─── Iconos exportados para uso directo ──────────────────── */
export { EarthIcon, FireIcon, WoodIcon, MetalIcon, WaterIcon, YinYangIcon };
