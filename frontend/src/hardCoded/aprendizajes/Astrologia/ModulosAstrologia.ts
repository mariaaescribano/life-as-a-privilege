import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, MadreIcon, AdultIcon, ChildIcon, FamilyIcon, neuropsicologiaNom } from "../../../GlobalVariables";
import { letranp1, letranp10, letranp2, letranp3, letranp4, letranp5, letranp6, letranp7, letranp8, letranp9 } from "./LetraAstrologia";

const detalles: Detalles = { color: neuropsicologiaTxt, icon: NeuropsicologiaIcon, bgColor: neuropsicologiaBg };

const basePath = "/aprendizaje/videoLessonPage/" + neuropsicologiaNom;

export const modulosAstrologia: ModuloContenido[] = [
  {
    title: "1. Introducción",
    icon: MadreIcon,
    submodules: [
      { 
        id:"np1",
        nom: "1.1 La historia de la Astrología",
        link:`${basePath}/np1`,
        linkAnterior:"",
        linkNext:`${basePath}/np2`,
        descripcion:"Pequeño resumen de cómo esta sabiduría ancestral empezó a menospreciarse.",
        video:"-w67yUcj_SM",
        letra: letranp1,
        detalles: detalles,
        icon: MadreIcon
      },
      { 
        id:"np2",
        nom: "1.2 El Sol, el Ascendente y la Luna",
        link:`${basePath}/np2`,
        linkAnterior:`${basePath}/np1`,
        linkNext:`${basePath}/np3`,
        descripcion:"Nuestros arquetipos fundamentales.",
        video:"apYqTnx9kiM",
        letra: letranp2,
        detalles: detalles,
        icon: MadreIcon
      },
    ],
  },
  {
    title: "2. El Ascendente",
    icon: FamilyIcon,
    submodules: [
      { 
        id:"np3",
        nom: "2.1 Ascendente Aries",
        link:`${basePath}/np3`,
        linkAnterior:`${basePath}/np2`,
        linkNext:`${basePath}/np4`,
        descripcion:"Valientes, impulsivos",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles,
        icon: FamilyIcon
      },
      { 
        id:"np4",
        nom: "2.2 Ascendente Tauro",
        link:`${basePath}/np4`,
        linkAnterior:`${basePath}/np3`,
        linkNext:`${basePath}/np5`,
        descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
        video:"wRO7-7Z0zsM",
        letra: letranp4,
        detalles: detalles,
        icon: FamilyIcon
      },
    ],
  },

];