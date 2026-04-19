export interface Video {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  video: string; // YouTube video ID
}

export const videos: Video[] = [
  {
    id: "ritmo-circadiano",
    titulo: "El ritmo circadiano a tu servicio",
    foto: "/img/videos/ciclocircadiano.png",
    descripcion: "Usa tu naturaleza intrínseca para ser tu mejor versión",
    video: "5gTDzZC3HsM",
  },
];
