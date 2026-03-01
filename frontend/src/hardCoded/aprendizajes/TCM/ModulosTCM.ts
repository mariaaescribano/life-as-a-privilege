import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { tcmTxt, TCMIcon, tcmBg, tcmNomLink, DiagnosticoIcon, CincoElementosIcon, LifestyleIcon, RecursosIcon } from "../../../GlobalVariables";
import { letranp1, letranp2, letranp3, letranp4, letranp5, letranp6, letranp7, letranp8 } from "./LetraTCM";

const detalles: Detalles = { color: tcmTxt, icon: TCMIcon, bgColor: tcmBg };

const basePath = "/aprendizaje/videoLessonPage/" + tcmNomLink;

export const modulostcm: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: RecursosIcon,
    submodules: [
      { 
        id:"tcm0",
        nom: "Recursos a tu disposición",
        link:`/recursos/` + tcmNomLink,
        linkAnterior:"",
        linkNext:"",
        descripcion:"El estado de la madre influye a su hijo desde antes del embarazo.",
        video:"-w67yUcj_SM",
        letra: letranp1,
        detalles: detalles
      },
    ],
  },
  {
    title: "1. Los fundamentos",
    icon: TCMIcon,
    submodules: [
      { 
        id:"tcm1",
        nom: "1.1 El taoísmo",
        link:`${basePath}/tcm1`,
        linkAnterior:"",
        linkNext:`${basePath}/tcm2`,
        descripcion:"El estado de la madre influye a su hijo desde antes del embarazo.",
        video:"-w67yUcj_SM",
        letra: letranp1,
        detalles: detalles
      },
      { 
        id:"tcm2",
        nom: "1.2 El yin y el yang",
        link:`${basePath}/tcm2`,
        linkAnterior:`${basePath}/tcm1`,
        linkNext:`${basePath}/tcm3`,
        descripcion:"Los padres tienen que ser seres completos antes del nacimiento o cargarán al hijo con su infelicidad y sueños rotos.",
        video:"apYqTnx9kiM",
        letra: letranp2,
        detalles: detalles
      },
    ],
  },
  {
    title: "2. Los Cinco Elementos",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm3",
        nom: "2.1 Los Cinco Elementos",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"La seguridad y el Amor no deberían ser un objetivo a alcanzar dentro de la familia, sino la base desde la que cada hijo comienza su Vida.",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm4",
        nom: "2.2 Las interrelaciones",
        link:`${basePath}/tcm4`,
        linkAnterior:`${basePath}/tcm3`,
        linkNext:`${basePath}/tcm5`,
        descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
        video:"wRO7-7Z0zsM",
        letra: letranp4,
        detalles: detalles
      },
    ],
  },
  {
    title: "3. El diagnóstico",
    icon: DiagnosticoIcon,
    submodules: [
      { 
        id:"tcm5",
        nom: "3.1 La lengua como espejo de los órganos",
        link:`${basePath}/tcm5`,
        linkAnterior:`${basePath}/tcm4`,
        linkNext:`${basePath}/tcm6`,
        descripcion:"En la individualización, la falta de Amor propio de los niños aflora, y la sociedad trata de tacharles de rotos asignándoles enfermedades mentales.",
        video:"MK9lQqogmbY",
        letra: letranp5,
        detalles: detalles
      },
      { 
        id:"tcm6",
        nom: "3.2 Los meridianos ~ los caminos del qi",
        link:`${basePath}/tcm6`,
        linkAnterior:`${basePath}/tcm5`,
        linkNext:`${basePath}/tcm7`,
        descripcion:"Usamos a los demás para darnos cuenta de lo rotos que ya estamos. Nadie nos rompe el corazón, solo nos muestra dónde lo estaba.",
        video:"CEE_gCwAdDM",
        letra: letranp6,
        detalles: detalles
      },
      { 
        id:"tcm7",
        nom: "3.3 El pulso",
        link:`${basePath}/tcm7`,
        linkAnterior:`${basePath}/tcm6`,
        linkNext:`${basePath}/tcm8`,
        descripcion:"Atraemos a personas para que nos muestren dónde no nos aceptamos.",
        video:"jmLKf9E-X6A",
        letra: letranp7,
        detalles: detalles
      },
    ],
  },
  {
    title: "4. El estilo de Vida",
    icon: LifestyleIcon,
    submodules: [
      { 
        id:"tcm8",
        nom: "4.1 El taichi y la paz interior",
        link:`${basePath}/tcm8`,
        linkAnterior:`${basePath}/tcm7`,
        linkNext:`${basePath}/tcm9`,
        descripcion:"La gran mayoría de los adultos se menosprecian y desvaloran, hundiéndose en la pereza, pensando que por cumplir años condenados a la decadencia.",
        video:"YezjA0ZSK2Y",
        letra: letranp8,
        detalles: detalles
      },
    ],
  },
];