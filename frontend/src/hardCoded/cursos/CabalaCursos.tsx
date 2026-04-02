import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CabalaIcon,
  cabalaBg,
  cabalaNom,
  cabalaTxt,
} from "../../GlobalVariables";
import { modulosCabala } from "../aprendizajes/Cabala/ModulosCabala";
import { modulosCabala2 } from "../aprendizajes/Cabala/ModulosCabala2";

export const cabalaCursos: ModalidadInfo = {
  nom: cabalaNom,
  bgColor: cabalaBg,
  color: cabalaTxt,
  icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "cabala-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + cabalaNom + "/cabala-curso-1",
      titulo: "Los fundamentos",
      foto: "/img/cabala/cabala.png",
      descripcion:
        "Explora la sabiduría de la Cábala y descubre la estructura de la creación según el Árbol de la Vida.",
      precio: null,
      numLecciones: 12,
      icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
      modulos: modulosCabala,
    },
    {
      id: "cabala-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + cabalaNom + "/cabala-curso-2",
      titulo: "El Árbol de la Vida como camino",
      foto: "/img/cabala/arbolvidacurso.png",
      descripcion:
        "Cada sephirot del Árbol de la Vida es una herramienta para nuestro crecimiento y autoconocimiento.",
      precio: null,
      numLecciones: 12,
      icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
      modulos: modulosCabala2,
    },
  ],
};
