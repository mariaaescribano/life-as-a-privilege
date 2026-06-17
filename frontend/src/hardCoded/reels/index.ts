import {
  fisiologiaNom,
  neuropsicologiaNom,
  nutricionNomLink,
  culturaNom,
} from "../../GlobalVariables";

/* ─────────────────────────────────────────────────────────────
   REELS POR DISCIPLINA
   ---------------------------------------------------------------
   Cada disciplina puede mostrar 3/4 reels (vídeos verticales de
   YouTube) en su página /aprendizaje/cursos/:moduloId.

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
  [neuropsicologiaNom]: [
    {
      id: "psico-darmas",
      titulo: "Personas que te importan no te valoran",
      portada: "/miniaturas/psicologia/darmas.png",
      embedUrl: "https://www.youtube.com/embed/1OfA8r-Jd3s",
    },
    {
      id: "psico-cuidarte",
      titulo: "Puedes empezar a cuidarte",
      portada: "/miniaturas/psicologia/cuidarte.png",
      embedUrl: "https://www.youtube.com/embed/tNezw66zv-4",
    },
    {
      id: "psico-trastorno",
      titulo: "¿Qué es un trastorno mental?",
      portada: "/miniaturas/psicologia/trastorno.png",
      embedUrl: "https://www.youtube.com/embed/tf_6H4fM6-w",
    },
    {
      id: "psico-estudiar",
      titulo: "¿Estudiar ya no sirve?",
      portada: "/miniaturas/psicologia/estudiar.png",
      embedUrl: "https://www.youtube.com/embed/RTEBJbN-yn4",
    },
    {
      id: "psico-inconsciente",
      titulo: "Tu inconsciente",
      portada: "/miniaturas/psicologia/inconsciente.png",
      embedUrl: "https://www.youtube.com/embed/1LY9J84VZxo",
    },
  ],
  [nutricionNomLink]: [
    {
      id: "nutri-keto",
      titulo: "Dieta keto",
      portada: "/miniaturas/nutri/keto.png",
      embedUrl: "https://www.youtube.com/embed/olD-2hiG8SQ",
    },
  ],
  [culturaNom]: [
    {
      id: "cultura-nube",
      titulo: "La nube",
      portada: "/miniaturas/cultura/nube.jpeg",
      embedUrl: "https://www.youtube.com/embed/deSo8HdR4Ms",
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
