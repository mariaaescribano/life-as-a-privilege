import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { CulturaIcon, FisicaIcon, EstrellaCirculoIcon, CorazonIcon, culturaBg, culturaNomLink, culturaTxt } from "../../../GlobalVariables";
import {
  letraFis1, letraFis2, letraFis3, letraFis4,
} from "./LetraFisica";

const detalles: Detalles = { color: culturaTxt, icon: CulturaIcon, bgColor: culturaBg };

const basePath = "/aprendizaje/videoLessonPage/" + culturaNomLink;

export const modulosFisica: ModuloContenido[] = [
  {
    title: "1. El universo y la energía",
    icon: FisicaIcon,
    submodules: [
      {
        id: "cul-f1",
        nom: "1.1 Somos polvo de estrellas",
        link: `${basePath}/cul-f1`,
        linkAnterior: "",
        linkNext: `${basePath}/cul-f2`,
        descripcion: "Somos los átomos creados por las estrellas.",
        video: "EtoIP7EOW1k",
        letra: letraFis1,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: EstrellaCirculoIcon,
      },
      {
        id: "cul-f2",
        nom: "1.2 El taoísmo y la física cuántica",
        link: `${basePath}/cul-f2`,
        linkAnterior: `${basePath}/cul-f1`,
        linkNext: `${basePath}/cul-f3`,
        descripcion: "La física cuántica confirma lo que el taoísmo dice.",
        video: "x1E4AmIDdCQ",
        letra: letraFis2,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: FisicaIcon,
      },
    ],
  },
  {
    title: "2. La materia somos nosotros",
    icon: FisicaIcon,
    submodules: [
      {
        id: "cul-f3",
        nom: "2.1 Todo lo que existe es transformación",
        link: `${basePath}/cul-f3`,
        linkAnterior: `${basePath}/cul-f2`,
        linkNext: `${basePath}/cul-f4`,
        descripcion: "Nuestro cuerpo es energía.",
        video: "C6LU7tUsnVc",
        letra: letraFis3,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: FisicaIcon,
      },
      {
        id: "cul-f4",
        nom: "2.2 La inteligencia celular a nuestro servicio",
        link: `${basePath}/cul-f4`,
        linkAnterior: `${basePath}/cul-f3`,
        linkNext: "",
        descripcion: "La inteligencia molecular a nuestro servicio.",
        video: "-wytG5sgD9E",
        letra: letraFis4,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: CorazonIcon,
      },
    ],
  },
];
