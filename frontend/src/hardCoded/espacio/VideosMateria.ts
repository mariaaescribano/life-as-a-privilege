// ─────────────────────────────────────────────────────────────────────────
// LOS VÍDEOS DE «LA MATERIA» (Fisiología · nivel 1)
//
// Antes de cada paso del nivel sale un reel de María, en un popup inmersivo
// (VideoMateriaModal). El camino queda así:
//
//   vídeo «átomo»            → crear el átomo        (/particulas y /atomos)
//   vídeo «molécula»         → crear una molécula    (/moleculas)
//   vídeo «se juntan»        → macromoléculas        (/macromoleculas)
//   vídeo «a la cooperación» → estructuras celulares (/estructuras)
//   vídeo «a las células»    → la célula (nivel VIDA) (/celula)
//
// ⚠️ PARA ACTIVAR UN VÍDEO: pegar su enlace de YouTube (Short, youtu.be, watch…
//    o solo el ID) en `url`. Mientras `url` esté vacío, el popup NO sale y la
//    página sigue como si nada: no queda ningún hueco.
// ⚠️ No cambiar las `key` tras publicar: con ellas se recuerda qué vídeo ya se vio.
// ─────────────────────────────────────────────────────────────────────────

export type VideoMateriaKey = "atomo" | "molecula" | "se-juntan" | "cooperacion" | "celulas" | "reconstruyen";

export interface VideoMateria {
  key: VideoMateriaKey;
  /** Qué cuenta (solo orientativo, para quien edite este fichero). */
  tema: string;
  /** Enlace o ID de YouTube. Vacío = aún no hay vídeo. */
  url: string;
}

export const VIDEOS_MATERIA: VideoMateria[] = [
  { key: "atomo",       tema: "Explicando el átomo",          url: "" },
  { key: "molecula",    tema: "Qué es una molécula",          url: "" },
  { key: "se-juntan",   tema: "Las moléculas se juntan",      url: "" },
  { key: "cooperacion", tema: "De las macros a la cooperación", url: "" },
  { key: "celulas",     tema: "De las estructuras a las células", url: "" },
  // Nivel DESARROLLO · página de los órganos (/metodo/fisiologia/organos).
  { key: "reconstruyen", tema: "Las células se reconstruyen todo el rato", url: "" },
];

export const videoMateria = (key: VideoMateriaKey): VideoMateria =>
  VIDEOS_MATERIA.find((v) => v.key === key)!;
