import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NeuropsicologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { modulosNeuroPsicologia, modulosEsquizofrenia, modulosAnorexia } from "../aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";

export const neuropsicologiaCursos: ModalidadInfo = {
  nom: neuropsicologiaNom,
  bgColor: neuropsicologiaBg,
  color: neuropsicologiaTxt,
  icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "anorexia",
      titulo: "El enigma de la anorexia",
      foto: "/img/np/anorexia.png",
      descripcion:
        "Comprende la esencia de la manifestación del sufrimiento con la tasa de mortalidad más elevada. Entiende la realidad de alguien con anorexia.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/anorexia",
      modulos: modulosAnorexia,
    },
      {
      id: "esquizofrenia",
      titulo: "Más allá de la esquizofrenia",
      foto: "/img/np/esq.jpg",
      descripcion:
        "La esquizofrenia no es lo que nos habían hecho creer. La esquizofrenia es una manifestación caótica de un profundo dolor no sanado ni legitimado.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/esquizofrenia",
      modulos: modulosEsquizofrenia,
    },
    {
      id: "etapasVida",
      titulo: "Resumen de las etapas de la Vida",
      foto: "/img/np/neuroPsicologiafoto1.jpg",
      descripcion:
        "Entiende cómo tu familia de origen formó la base de los patrones que hoy moldean tu vida. Desde una nueva mirada, comprende cómo, sin darte cuenta, creas la realidad en la que vives.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom +"/etapasVida",
      modulos: modulosNeuroPsicologia,
    }, 
  ],
};
