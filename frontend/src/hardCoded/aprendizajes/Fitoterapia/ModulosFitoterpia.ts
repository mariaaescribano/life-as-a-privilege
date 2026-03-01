import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { RecursosIconFitoterpia, fitoterapiaBg, FitoterapiaIcon, fitoterapiaTxt, fitoterapiaNom } from "../../../GlobalVariables";

const detalles: Detalles = { color: fitoterapiaTxt, icon: FitoterapiaIcon, bgColor: fitoterapiaBg };

const basePath = "/aprendizaje/videoLessonPage/" + fitoterapiaNom;

export const modulosFitoterapia: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: RecursosIconFitoterpia,
    submodules: [
      { 
        id:"ft1",
        nom: "Recursos a tu disposición",
        link:`/recursos/`+fitoterapiaNom,
        linkAnterior:"",
        linkNext:"",
        descripcion:"",
        video:"-w67yUcj_SM",
        letra: "",
        detalles: detalles
      },
    ],
  },
];