import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NeuropsicologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { modulosEsquizofrenia, modulosEsenciales, modulosDepresion } from "../aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";

export const neuropsicologiaCursos: ModalidadInfo = {
  nom: neuropsicologiaNom,
  bgColor: neuropsicologiaBg,
  color: neuropsicologiaTxt,
  icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "esenciales",
      titulo: "Esenciales",
      foto: "/img/np/esenciales.png",
      descripcion:
        "Las claves esenciales para entenderte a ti mismo y comenzar a sanar desde la raíz.",
      precio: null,
      numLecciones: 5,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/esenciales",
      modulos: modulosEsenciales,
    },
    {
      id: "depresion",
      titulo: "La depresión está en tu Vida",
      foto: "/img/np/depresion.png",
      descripcion:
        "La depresión no es un fallo químico: es un mensaje de tu Vida. Aprende a escucharlo y a salir de ella.",
      precio: null,
      numLecciones: 5,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/depresion",
      modulos: modulosDepresion,
    },
    // {
    //   id: "anorexia",
    //   titulo: "ANOREXIA: el infierno hacia la autovalía",
    //   foto: "/img/np/anorexia.png",
    //   descripcion:
    //     "1 de cada 100 chicas jóvenes tiene anorexia. 1 de cada 10 muere o se suicida. Ya basta.",
    //   precio: null,
    //   numLecciones: 10,
    //   icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
    //   cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/anorexia",
    //   modulos: modulosAnorexia,
    // },
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
    // {
    //   id: "etapasVida",
    //   titulo: "Resumen de las etapas de la Vida",
    //   foto: "/img/np/neuroPsicologiafoto1.jpg",
    //   descripcion:
    //     "Entiende cómo tu familia de origen formó la base de los patrones que hoy moldean tu vida. Desde una nueva mirada, comprende cómo, sin darte cuenta, creas la realidad en la que vives.",
    //   precio: null,
    //   numLecciones: 10,
    //   icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
    //   cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom +"/etapasVida",
    //   modulos: modulosNeuroPsicologia,
    // },
  ],
};
