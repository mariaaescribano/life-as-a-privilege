import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { tcmTxt, TCMIcon, tcmBg, tcmNomLink, DiagnosticoIcon, CincoElementosIcon, LifestyleIcon, RecursosIconTCM } from "../../../GlobalVariables";
import { letranp1, letranp2, letranp3, letranp4, letranp5, letranp6, letranp7, letranp8 } from "./LetraTCM";

const detalles: Detalles = { color: tcmTxt, icon: TCMIcon, bgColor: tcmBg };

const basePath = "/aprendizaje/videoLessonPage/" + tcmNomLink;

export const modulostcm: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: RecursosIconTCM,
    submodules: [
      { 
        id:"tcm0",
        nom: "Recursos a tu disposición",
        link:`/recursos/` + tcmNomLink,
        linkAnterior:"",
        linkNext:"",
        descripcion:"",
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
        nom: "2.1 Introducción",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm4",
        nom: "2.2 La Madera 木",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm5",
        nom: "2.3 El Fuego 火 ",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm6",
        nom: "2.4 La Tierra 土 ",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm7",
        nom: "2.5 El Metal 金",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm8",
        nom: "2.6 El Agua 水 ",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
    ],
  },
  {
    title: "3. El ciclo generador 相生",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm9",
        nom: "3.1 Introducción",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm10",
        nom: "3.2 El Fuego genera la Tierra",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm11",
        nom: "3.3 La Tierra genera el Metal",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm12",
        nom: "3.4 El Metal genera el Agua",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm13",
        nom: "3.5 El Agua genera el Madera",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
       { 
        id:"tcm14",
        nom: "3.6 La Madera genera el Fuego",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
    ],
  },
  {
    title: "4. El ciclo controlador 相克",
    icon: CincoElementosIcon,
    submodules: [ //hacer 1 video por pareja
      { 
        id:"tcm15",
        nom: "4.1 Introducción",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm16",
        nom: "4.2 La Madera controla la Tierra",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm17",
        nom: "4.3 La Tierra controla el Agua",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm18",
        nom: "4.4 El Agua controla el Fuego",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
       { 
        id:"tcm19",
        nom: "4.5 El Fuego controla el Metal",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm20",
        nom: "4.6 El Metal controla la Madera",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
    ],
  },
  {
    title: "5. La lengua como espejo",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm21",
        nom: "5.1 Introducción",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm22",
        nom: "5.2 El color",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm23",
        nom: "5.3 La forma",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm24",
        nom: "5.4 La capa",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"tcm25",
        nom: "5.5 La relación con los órganos",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
    ],
  },
  {
    title: "6. El pulso",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm26",
        nom: "6.1 Introducción",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
    ],
  },
  {
    title: "7. El estilo de Vida",
    icon: LifestyleIcon,
    submodules: [
      { 
        id:"tcm27",
        nom: "7.1 El taichi y la paz interior",
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