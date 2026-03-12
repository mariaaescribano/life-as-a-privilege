import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CabalaIcon,
  cabalaBg,
  cabalaNom,
  cabalaTxt,
} from "../../GlobalVariables";
import { modulosCabala } from "../aprendizajes/Cabala/ModulosCabala";

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
        "Explora la sabiduría de la Cábala y descubre qué te desequilibra para transformarlo y vivir desde la conexión con tu esencia.",
      precio: null,
      numLecciones: 12,
      icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
      modulos: modulosCabala,
    },
  ],
};
