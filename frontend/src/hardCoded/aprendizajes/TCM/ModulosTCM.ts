import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { tcmTxt, TCMIcon, tcmBg, tcmNomLink, CincoElementosIcon, RecursosIconTCM, MouthIcon } from "../../../GlobalVariables";
import { letratcm1, letratcm10, letratcm11, letratcm12, letratcm13, letratcm14, letratcm15, letratcm16, letratcm17, letratcm18, letratcm19, letratcm2, letratcm20, letratcm21, letratcm22, letratcm23, letratcm24, letratcm3, letratcm4, letratcm5, letratcm6, letratcm7, letratcm8, letratcm9 } from "./LetraTCM";

const detalles: Detalles = { color: tcmTxt, icon: TCMIcon, bgColor: tcmBg };

const basePath = "/aprendizaje/videoLessonPage/" + tcmNomLink;

export const modulostcmFundamentos: ModuloContenido[] = [
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
        descripcion:"Recursos esenciales para acompañar tu aprendizaje y profundizar en la Medicina Tradicional China.",
        video:"n0Cqpw_A3VU",
        letra: null,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon:null
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
        descripcion:"Eres parte del universo.",
        video:"pHbFMoTEftg",
        letra: letratcm1,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: TCMIcon
      },
      { 
        id:"tcm2",
        nom: "1.2 El Yin y el Yang",
        link:`${basePath}/tcm2`,
        linkAnterior:`${basePath}/tcm1`,
        linkNext:`${basePath}/tcm3`,
        descripcion:"El verdadero equilibrio es la armonía entre fuerzas que se complementan.",
        video:"OU5huhK-FxU",
        letra: letratcm2,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: TCMIcon,
      },
    ],
  },

  {
    title: "2. Los Cinco Elementos 五行",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm3",
        nom: "2.1 Introducción a los Cinco Elementos 五行",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"El ser humano es una extensión de la naturaleza.",
        video:"bL9v3VBJc8I",
        letra: letratcm3,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm9",
        nom: "3.1 Introducción al Ciclo Generador 相生",
        link:`${basePath}/tcm9`,
        linkAnterior:`${basePath}/tcm8`,
        linkNext:`${basePath}/tcm10`,
        descripcion:"Comprender los ciclos de la naturaleza, es comprender nuestros ciclos.",
        video:"OAYf3uHIJLY",
        letra: letratcm9,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
       { 
        id:"tcm15",
        nom: "4.1 Introducción al Ciclo Controlador 相克",
        link:`${basePath}/tcm15`,
        linkAnterior:`${basePath}/tcm14`,
        linkNext:`${basePath}/tcm16`,
        descripcion:"Respetar tus ciclos y tu cuerpo es el camino hacia una Vida llena de Amor.",
        video:"wC2Z3RxbK9E",
        letra: letratcm15,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
    ],
  },
  {
    title: "5. El diagnóstico de la lengua",
    icon: MouthIcon,
    submodules: [
      { 
        id:"tcm21",
        nom: "5.1 La lengua",
        link:`${basePath}/tcm21`,
        linkAnterior:`${basePath}/tcm20`,
        linkNext:`${basePath}/tcm22`,
        descripcion:"La lengua habla en silencio sobre el estado de tu equilibrio.",
        video:"XiG2Ll57It4",
        letra: letratcm21,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: MouthIcon
      },
      { 
        id:"tcm22",
        nom: "5.2 El color de la lengua",
        link:`${basePath}/tcm22`,
        linkAnterior:`${basePath}/tcm21`,
        linkNext:`${basePath}/tcm23`,
        descripcion:"El cuerpo siempre refleja lo que necesita sanar.",
        video:"EC1-aTmn2aE",
        letra: letratcm22,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: MouthIcon
      },
      { 
        id:"tcm23",
        nom: "5.3 La forma de la lengua",
        link:`${basePath}/tcm23`,
        linkAnterior:`${basePath}/tcm22`,
        linkNext:`${basePath}/tcm24`,
        descripcion:"La forma de tu lengua es un mapa sutil de tu energía interna.",
        video:"F8AiR97m0Qk",
        letra: letratcm23,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: MouthIcon
      },
      { 
        id:"tcm24",
        nom: "5.4 La capa de la lengua",
        link:`${basePath}/tcm24`,
        linkAnterior:`${basePath}/tcm23`,
        linkNext:"",
        descripcion:"La capa de la lengua revela tu armonía interior.",
        video:"AhobpjkmH0I",
        letra: letratcm24,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: MouthIcon
      },
    ],
  },
];

export const modulostcmCincoElementos: ModuloContenido[] = [
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
        descripcion:"Recursos esenciales para acompañar tu aprendizaje y profundizar en la Medicina Tradicional China.",
        video:"n0Cqpw_A3VU",
        letra: null,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon:null
      },
    ],
  },
  {
    title: "2. Los Cinco Elementos 五行",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm3",
        nom: "2.1 Introducción a los Cinco Elementos 五行",
        link:`${basePath}/tcm3`,
        linkAnterior:`${basePath}/tcm2`,
        linkNext:`${basePath}/tcm4`,
        descripcion:"El ser humano es una extensión de la naturaleza.",
        video:"bL9v3VBJc8I",
        letra: letratcm3,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm4",
        nom: "2.2 La Madera 木",
        link:`${basePath}/tcm4`,
        linkAnterior:`${basePath}/tcm3`,
        linkNext:`${basePath}/tcm5`,
        descripcion:"Sé como el bambú: firme en tus raíces, flexible en tus tormentas.",
        video:"1gMBVFKMAXY",
        letra: letratcm4,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm5",
        nom: "2.3 El Fuego 火",
        link:`${basePath}/tcm5`,
        linkAnterior:`${basePath}/tcm4`,
        linkNext:`${basePath}/tcm6`,
        descripcion:"El fuego es la semilla del Amor, que siempre debe de empezar en uno mismo.",
        video:"oqmoovl3Yio",
        letra: letratcm5,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm6",
        nom: "2.4 La Tierra 土",
        link:`${basePath}/tcm6`,
        linkAnterior:`${basePath}/tcm5`,
        linkNext:`${basePath}/tcm7`,
        descripcion:"Cultivar la tierra interior es aprender a confiar en la Vida.",
        video:"tXqEjnQPgwc",
        letra: letratcm6,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm7",
        nom: "2.5 El Metal 金",
        link:`${basePath}/tcm7`,
        linkAnterior:`${basePath}/tcm6`,
        linkNext:`${basePath}/tcm8`,
        descripcion:"Saber soltar es la muestra más profunda de Amor.",
        video:"BzgxPMYOqrA",
        letra: letratcm7,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm8",
        nom: "2.6 El Agua 水",
        link:`${basePath}/tcm8`,
        linkAnterior:`${basePath}/tcm7`,
        linkNext:`${basePath}/tcm9`,
        descripcion:"En el silencio del agua habita nuestra verdadera esencia.",
        video:"o2ot4bFWMoQ",
        letra: letratcm8,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
    ],
  },
  {
    title: "3. El Ciclo Generador 相生",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm9",
        nom: "3.1 Introducción al Ciclo Generador 相生",
        link:`${basePath}/tcm9`,
        linkAnterior:`${basePath}/tcm8`,
        linkNext:`${basePath}/tcm10`,
        descripcion:"Comprender los ciclos de la naturaleza, es comprender nuestros ciclos.",
        video:"OAYf3uHIJLY",
        letra: letratcm9,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm10",
        nom: "3.2 El Fuego genera la Tierra",
        link:`${basePath}/tcm10`,
        linkAnterior:`${basePath}/tcm9`,
        linkNext:`${basePath}/tcm11`,
        descripcion:"Cuando el corazón está en equilibrio, todo el cuerpo respira en armonía.",
        video:"ufDdxo0Ffxw",
        letra: letratcm10,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm11",
        nom: "3.3 La Tierra genera el Metal",
        link:`${basePath}/tcm11`,
        linkAnterior:`${basePath}/tcm10`,
        linkNext:`${basePath}/tcm12`,
        descripcion:"Nutrirte bien es el primer paso para vivir en armonía y equilibrio.",
        video:"n0Cqpw_A3VU",
        letra: letratcm11,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm12",
        nom: "3.4 El Metal genera el Agua",
        link:`${basePath}/tcm12`,
        linkAnterior:`${basePath}/tcm11`,
        linkNext:`${basePath}/tcm13`,
        descripcion:"La respiración consciente es el puente entre el cuerpo y el universo.",
        video:"AjwK8HIYBpU",
        letra: letratcm12,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm13",
        nom: "3.5 El Agua genera la Madera",
        link:`${basePath}/tcm13`,
        linkAnterior:`${basePath}/tcm12`,
        linkNext:`${basePath}/tcm14`,
        descripcion:"Cuando te escuchas, permites que todo en ti fluya sin resistencia.",
        video:"FD4FYd6utzM",
        letra: letratcm13,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm14",
        nom: "3.6 La Madera genera el Fuego",
        link:`${basePath}/tcm14`,
        linkAnterior:`${basePath}/tcm13`,
        linkNext:`${basePath}/tcm15`,
        descripcion:"Un corazón equilibrado protege tu cuerpo y permite la manifestación de tu verdadero yo.",
        video:"a8220pAxffc",
        letra: letratcm14,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
    ],
  },
  {
    title: "4. El Ciclo Controlador 相克",
    icon: CincoElementosIcon,
    submodules: [
      { 
        id:"tcm15",
        nom: "4.1 Introducción al Ciclo Controlador 相克",
        link:`${basePath}/tcm15`,
        linkAnterior:`${basePath}/tcm14`,
        linkNext:`${basePath}/tcm16`,
        descripcion:"Respetar tus ciclos y tu cuerpo es el camino hacia una Vida llena de Amor.",
        video:"wC2Z3RxbK9E",
        letra: letratcm15,
        cursoId: "tcm-curso-1",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm16",
        nom: "4.2 La Madera controla la Tierra",
        link:`${basePath}/tcm16`,
        linkAnterior:`${basePath}/tcm15`,
        linkNext:`${basePath}/tcm17`,
        descripcion:"La ira no resuelta se transforma en desequilibrio; la conciencia la transforma en crecimiento.",
        video:"aWJBZDaW8bM",
        letra: letratcm16,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm17",
        nom: "4.3 La Tierra controla el Agua",
        link:`${basePath}/tcm17`,
        linkAnterior:`${basePath}/tcm16`,
        linkNext:`${basePath}/tcm18`,
        descripcion:"La pre-ocupación debilita; la calma y la gestión emocional te hace más fuerte.",
        video:"U8iyzmfOWu0",
        letra: letratcm17,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm18",
        nom: "4.4 El Agua controla el Fuego",
        link:`${basePath}/tcm18`,
        linkAnterior:`${basePath}/tcm17`,
        linkNext:`${basePath}/tcm19`,
        descripcion:"El miedo se disuelve cuando encuentras te encuentras.",
        video:"s-b1j0Snz1w",
        letra: letratcm18,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm19",
        nom: "4.5 El Fuego controla el Metal",
        link:`${basePath}/tcm19`,
        linkAnterior:`${basePath}/tcm18`,
        linkNext:`${basePath}/tcm20`,
        descripcion:"Respirar con calma es regalarle claridad a tu corazón.",
        video:"6XUZromIhBE",
        letra: letratcm19,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
      { 
        id:"tcm20",
        nom: "4.6 El Metal controla la Madera",
        link:`${basePath}/tcm20`,
        linkAnterior:`${basePath}/tcm19`,
        linkNext:`${basePath}/tcm21`,
        descripcion:"Cada respiración consciente es un abrazo a nuestro interior y un agradecimiento a la Vida.",
        video:"PNqzu2Y2a9M",
        letra: letratcm20,
        cursoId: "tcm-curso-2",
        detalles: detalles,
        icon: CincoElementosIcon
      },
    ],
  },
];
