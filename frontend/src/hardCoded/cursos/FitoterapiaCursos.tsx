import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  FitoterapiaIcon,
  fitoterapiaBg,
  fitoterapiaNom,
  fitoterapiaTxt,
} from "../../GlobalVariables";

export const fitoterapiaCursos: ModalidadInfo = {
  nom: fitoterapiaNom,
  bgColor: fitoterapiaBg,
  color: fitoterapiaTxt,
  icon: <FitoterapiaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    {
      id: "fito-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + fitoterapiaNom + "/fito-curso-1",
      titulo: "Plantas comunes",
      foto: "/img/fitoterapia/especias.jpg",
      descripcion:
        "Descubre las propiedades beneficiosas de las especias comunes.",
      precio: null,
      numLecciones: 10,
      icon: <FitoterapiaIcon size={{ base: "35px", md: "45px" }} />,
    },
  ],
};
