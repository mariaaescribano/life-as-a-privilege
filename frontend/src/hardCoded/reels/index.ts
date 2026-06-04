import {
  fisiologiaNom,
  ayurvedaNomLink,
  astrologiaNom,
  neuropsicologiaNom,
} from "../../GlobalVariables";

/* ─────────────────────────────────────────────────────────────
   REELS POR DISCIPLINA
   ---------------------------------------------------------------
   Cada disciplina puede mostrar 3/4 reels (vídeos verticales de
   YouTube) en su página /aprendizaje/cursosModalidad/:moduloId.

   Para añadir un vídeo a una disciplina, mete un objeto en su lista:
     • titulo   → el título que aparece debajo de la portada.
     • portada  → (opcional) ruta a tu imagen de portada VERTICAL (9:16).
                  Ej: "/img/reels/fisiologia-1.jpg"
                  (colócala en frontend/public/img/reels/)
                  Si la dejas vacía, se usa la miniatura del propio vídeo.
     • embedUrl → URL embed del reel/short de YouTube.
                  Para un Short youtube.com/shorts/VIDEO_ID, el embed es
                  "https://www.youtube.com/embed/VIDEO_ID"

   La clave del Record es el `moduloId` de la URL, que coincide con
   los nombres/links canónicos de GlobalVariables.
───────────────────────────────────────────────────────────────── */

export interface ReelVideo {
  id: string;
  titulo: string;
  /** (Opcional) Imagen de portada VERTICAL 9:16. Si está vacía se usa la miniatura de YouTube. */
  portada: string;
  /** URL embed de YouTube. Ej: "https://www.youtube.com/embed/VIDEO_ID" */
  embedUrl: string;
}

export const reelsPorDisciplina: Record<string, ReelVideo[]> = {
  [fisiologiaNom]: [
    {
      id: "fisio-correr",
      titulo: "Correr = Antidepresivos",
      portada: "/miniaturas/fisio/portadacorrer.png",
      embedUrl: "https://www.youtube.com/embed/_cW744qC1UY",
    },
  ],
  [ayurvedaNomLink]: [
    {
      id: "ayur-introduccion",
      titulo: "Ayurveda introducción",
      portada: "/miniaturas/hinduismo/ayurveda.png",
      embedUrl: "https://www.youtube.com/embed/iVLveGXr1Pw",
    },
  ],
  [astrologiaNom]: [
    {
      id: "astro-heridas",
      titulo: "Tus heridas",
      portada: "/miniaturas/astro/heridas.png",
      embedUrl: "https://www.youtube.com/embed/3nyN4gX4q04",
    },
  ],
  [neuropsicologiaNom]: [
    {
      id: "psico-procrastinar",
      titulo: "Deja de procrastinar",
      portada: "/miniaturas/psicologia/procrastinar.png",
      embedUrl: "https://www.youtube.com/embed/8_KZn3ca8io",
    },
  ],
};

/** Devuelve los reels de una disciplina por su `moduloId` (tolerante a mayúsculas). */
export function getReelsDisciplina(moduloId?: string | null): ReelVideo[] {
  if (!moduloId) return [];
  if (reelsPorDisciplina[moduloId]) return reelsPorDisciplina[moduloId];
  const lower = moduloId.toLowerCase();
  const key = Object.keys(reelsPorDisciplina).find((k) => k.toLowerCase() === lower);
  return key ? reelsPorDisciplina[key] : [];
}
