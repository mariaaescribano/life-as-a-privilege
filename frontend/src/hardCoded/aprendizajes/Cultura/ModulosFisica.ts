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
        descripcion: "Del Big Bang a nuestra existencia: los átomos forjados en el interior de las estrellas viajaron hasta formar todo lo que somos.",
        video: "0BYQRhNpFss",
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
        descripcion: "El taoísmo intuía lo que la física cuántica confirma: el vacío no es vacío, sino un campo de energía en constante transformación.",
        video: "EDyMIYK5u3Q",
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
        descripcion: "La energía se convierte en materia y la materia en energía, nuestro cuerpo es un préstamo privilegiado del universo.",
        video: "gVa5g3vOKOE",
        letra: letraFis3,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: FisicaIcon,
      },
      {
        id: "cul-f4",
        nom: "2.2 Los átomos que nos forman",
        link: `${basePath}/cul-f4`,
        linkAnterior: `${basePath}/cul-f3`,
        linkNext: "",
        descripcion: "Nuestros átomos son inestables, y aun así sostienen miles de reacciones cada segundo.",
        video: "moZkd0IxtQk",
        letra: letraFis4,
        cursoId: "cul-curso-2",
        detalles: detalles,
        icon: CorazonIcon,
      },
    ],
  },
];
