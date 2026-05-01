export interface Video {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  video: string; // YouTube video ID
}

export const videos: Video[] = [
  // {
  //   id: "ritmo-circadiano",
  //   titulo: "El ritmo circadiano a tu servicio",
  //   foto: "/img/videos/ciclocircadiano.png",
  //   descripcion: "Usa tu naturaleza intrínseca para ser tu mejor versión",
  //   video: "5gTDzZC3HsM",
  // },
  {
    id: "carta-astral-einstein",
    titulo: "Leyendo la carta astral de Einstein",
    foto: "/img/videos/einsteinCartAstral.png",
    descripcion: "Un recorrido por la carta astral de Albert Einstein.",
    video: "-CgjqTOi8u4",
  },
];
