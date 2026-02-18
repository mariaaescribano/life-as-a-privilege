import type { Detalles, ModuloContenido } from "../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt } from "../../GlobalVariables";

const detalles:Detalles = {color:neuropsicologiaTxt , icon:NeuropsicologiaIcon, bgColor:neuropsicologiaBg }

export const modulosNeuroPsicologia: ModuloContenido[] = [
  {
    title: "1. Neuropsicología",
    submodules: [
      { 
        nom: "eefe",
        link:"/aprendizaje/videoLessonPage/neuropsicologia/eefe",
        descripcion:"ssjjsjsjsjs",
        video:"",
        detalles: detalles
      },
    ],
  },
  {
    title: "2. Fisiología",
    submodules: [
      { 
        nom: "eefe",
        link:"/aprendizaje/videoLessonPage/neuropsicologia/eefe",
        descripcion:"ssjjsjsjsjs",
        video:"",
        detalles: detalles
      },
    ],
  },
];
