import type { Detalles, FloatingButtonConfig, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { AyurvedaIcon, ayurvedaBg, ayurvedaNomLink, ayurvedaTxt } from "../../../GlobalVariables";
import {
  letraKarma1, letraKarma2, letraKarma3, letraKarma4,
  letraKarma5, letraKarma6, letraKarma7,
} from "./LetraKarma";

const detalles: Detalles = { color: ayurvedaTxt, icon: AyurvedaIcon, bgColor: ayurvedaBg };

const basePath = "/aprendizaje/videoLessonPage/" + ayurvedaNomLink;

const explorarMisHeridas: FloatingButtonConfig = {
  label: "Explorar mis heridas",
  action: "espacio-auth",
  route: "/espacio/questions/" + ayurvedaNomLink,
};

export const modulosKarma: ModuloContenido[] = [
  {
    title: "1. El sentido de la vida",
    icon: AyurvedaIcon,
    floatingButton: explorarMisHeridas,
    submodules: [
      {
        id: "ayu-kar1",
        nom: "1.1 ¿Sabes el sentido de tu vida?",
        link: `${basePath}/ayu-kar1`,
        linkAnterior: "",
        linkNext: `${basePath}/ayu-kar2`,
        descripcion: "Hemos reencarnado para sanar y recordar que somos dignos del amor y el disfrute.",
        video: "SXzMKDuRDAw",
        letra: letraKarma1,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
      {
        id: "ayu-kar2",
        nom: "1.2 Todo tiene una razón",
        link: `${basePath}/ayu-kar2`,
        linkAnterior: `${basePath}/ayu-kar1`,
        linkNext: `${basePath}/ayu-kar3`,
        descripcion: "Nada de lo que te ocurre es en tu contra: cada experiencia tiene un sentido preciso para tu crecimiento.",
        video: "Q8nO6TZmshU",
        letra: letraKarma3,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
      {
        id: "ayu-kar3",
        nom: "1.3 Una oportunidad de descubrirse",
        link: `${basePath}/ayu-kar3`,
        linkAnterior: `${basePath}/ayu-kar2`,
        linkNext: `${basePath}/ayu-kar4`,
        descripcion: "Cada dificultad es tu alma preguntándote si eres capaz de seguir amándote a pesar de ello.",
        video: "6R8Cr7yi4hc",
        letra: letraKarma6,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
    ],
  },
  {
    title: "2. El karma y los pactos entre almas",
    icon: AyurvedaIcon,
    floatingButton: explorarMisHeridas,
    submodules: [
      {
        id: "ayu-kar4",
        nom: "2.1 El karma es aquello que se repite",
        link: `${basePath}/ayu-kar4`,
        linkAnterior: `${basePath}/ayu-kar3`,
        linkNext: `${basePath}/ayu-kar5`,
        descripcion: "El karma es la situación que se repite y nos duele, y que elegimos para crecer a través de ella.",
        video: "Ue36Bv3UlKA",
        letra: letraKarma2,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
      {
        id: "ayu-kar5",
        nom: "2.2 Los pactos más duros",
        link: `${basePath}/ayu-kar5`,
        linkAnterior: `${basePath}/ayu-kar4`,
        linkNext: `${basePath}/ayu-kar6`,
        descripcion: "Las almas que más se aman se eligen para recordarse aquello que habían olvidado.",
        video: "jqgmbPcrRlQ",
        letra: letraKarma4,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
      {
        id: "ayu-kar6",
        nom: "2.3 Usamos a los demás para tomar consciencia de nuestras heridas",
        link: `${basePath}/ayu-kar6`,
        linkAnterior: `${basePath}/ayu-kar5`,
        linkNext: `${basePath}/ayu-kar7`,
        descripcion: "Cuando no vemos nuestras heridas, la vida nos pone espejos que nos señalan dónde están.",
        video: "xE_kd16eWBk",
        letra: letraKarma5,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
    ],
  },
  {
    title: "3. La visión cristiana",
    icon: AyurvedaIcon,
    floatingButton: explorarMisHeridas,
    submodules: [
      {
        id: "ayu-kar7",
        nom: "3.1 Los cristianos crean una deidad cruel",
        link: `${basePath}/ayu-kar7`,
        linkAnterior: `${basePath}/ayu-kar6`,
        linkNext: "",
        descripcion: "Cómo el cristianismo construye un Dios juez para sostener el sentimiento de indignidad.",
        video: "_Qui6-JqGKE",
        letra: letraKarma7,
        cursoId: "ayu-curso-3",
        detalles: detalles,
        icon: AyurvedaIcon,
        floatingButton: explorarMisHeridas,
      },
    ],
  },
];
