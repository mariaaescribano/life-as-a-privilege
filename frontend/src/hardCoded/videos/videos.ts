export interface Video {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  video: string; // YouTube video ID
}

export const videos: Video[] = [
  {
    id: "eres-temporal",
    titulo: "Eres temporal",
    foto: "/miniaturas/fisio/atomos.png",
    descripcion: "Una mirada a lo efímero que somos desde los átomos que nos forman.",
    video: "MIvyslofulM",
  },
  {
    id: "cambiar-de-pareja",
    titulo: "¿Cambiar de pareja?",
    foto: "/miniaturas/psicologia/cambiarpareja.png",
    descripcion: "Reflexiona sobre cuándo el problema es la relación y cuándo eres tú.",
    video: "tVQxJcSrTZ8",
  },
  {
    id: "adios-ansiedad",
    titulo: "Adiós ansiedad",
    foto: "/miniaturas/psicologia/ansiedad.png",
    descripcion: "Aprende a gestionar la ansiedad y recupera tu calma.",
    video: "-fDJ0ZhDluM",
  },
  // {
  //   id: "ritmo-circadiano",
  //   titulo: "El ritmo circadiano a tu servicio",
  //   foto: "/img/videos/ciclocircadiano.png",
  //   descripcion: "Usa tu naturaleza intrínseca para ser tu mejor versión",
  //   video: "5gTDzZC3HsM",
  // },
  {
    id: "tu-inconsciente",
    titulo: "Tu Inconsciente",
    foto: "/miniaturas/psicologia/inconsciente.png",
    descripcion: "Descubre cómo tu inconsciente moldea tus hábitos, emociones y decisiones.",
    video: "1LY9J84VZxo",
  },
  {
    id: "carta-astral-einstein",
    titulo: "Leyendo la carta astral de Einstein",
    foto: "/img/videos/einsteinCartAstral.png",
    descripcion: "Un recorrido por la carta astral de Albert Einstein.",
    video: "-CgjqTOi8u4",
  },
];
