import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { CulturaIcon, culturaBg, culturaNomLink, culturaTxt, SpinozaFiloIcon } from "../../../GlobalVariables";
import {
  letraCul1, letraCul2, letraCul3, letraCul4, letraCul5, letraCul6,
} from "./LetraCultura";

const detalles: Detalles = { color: culturaTxt, icon: CulturaIcon, bgColor: culturaBg };

const basePath = "/aprendizaje/videoLessonPage/" + culturaNomLink;

export const modulosCultura: ModuloContenido[] = [
  {
    title: "1. ¿Quién fue Spinoza?",
    icon: CulturaIcon,
    submodules: [
      {
        id: "cul-s1",
        nom: "1.1 ¿Quién fue Spinoza?",
        link: `${basePath}/cul-s1`,
        linkAnterior: "",
        linkNext: `${basePath}/cul-s2`,
        descripcion: "Descubre quién fue Baruch Spinoza, el filósofo excomulgado que transformó la filosofía moderna e influyó en mentes como las de Nietzsche y Einstein.",
        video: "od-ZegKpJuc",
        letra: letraCul1,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: CulturaIcon,
      },
    ],
  },
    {
    title: "2. La filosofía de Spinoza",
    icon: SpinozaFiloIcon,
    submodules: [
      {
        id: "cul-s2",
        nom: "2.1 El Dios de Spinoza",
        link: `${basePath}/cul-s2`,
        linkAnterior: `${basePath}/cul-s1`,
        linkNext: `${basePath}/cul-s3`,
        descripcion: "Comprende por qué Einstein admiraba el Dios de Spinoza y cómo este filósofo identificó a Dios con el universo entero.",
        video: "DdvVPONpLF4",
        letra: letraCul2,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: SpinozaFiloIcon,
      },
      {
        id: "cul-s3",
        nom: "2.2 El libre albedrío",
        link: `${basePath}/cul-s3`,
        linkAnterior: `${basePath}/cul-s2`,
        linkNext: `${basePath}/cul-s4`,
        descripcion: "Explora la visión de Spinoza sobre el libre albedrío y por qué defendía que somos parte de una cadena infinita de causas.",
        video: "l4_MUYu2vrs",
        letra: letraCul3,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: SpinozaFiloIcon,
      },
      {
        id: "cul-s4",
        nom: "2.3 Los estudios de la naturaleza",
        link: `${basePath}/cul-s4`,
        linkAnterior: `${basePath}/cul-s3`,
        linkNext: `${basePath}/cul-s5`,
        descripcion: "Entiende por qué Spinoza defendía que conocer y comprender la naturaleza es el camino hacia la verdadera libertad.",
        video: "F8J4tHuqyKw",
        letra: letraCul4,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: SpinozaFiloIcon,
      },
      {
        id: "cul-s5",
        nom: "2.4 El Conatus",
        link: `${basePath}/cul-s5`,
        linkAnterior: `${basePath}/cul-s4`,
        linkNext: `${basePath}/cul-s6`,
        descripcion: "Conoce el Conatus, el impulso básico de todo ser hacia la supervivencia y la elevación, y cómo comprender las emociones es clave para no ser dominados por ellas.",
        video: "jPR2aKZoDDw",
        letra: letraCul5,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: SpinozaFiloIcon,
      },
      {
        id: "cul-s6",
        nom: "2.5 El objetivo de la Vida",
        link: `${basePath}/cul-s6`,
        linkAnterior: `${basePath}/cul-s5`,
        linkNext: "",
        descripcion: "Descubre cuál era, según Spinoza, el objetivo de la Vida: vivir en armonía con la naturaleza y alcanzar la paz interior a través del amor intelectual.",
        video: "wr493uwxLhA",
        letra: letraCul6,
        cursoId: "cul-curso-1",
        detalles: detalles,
        icon: SpinozaFiloIcon,
      },
    ],
  },
];
