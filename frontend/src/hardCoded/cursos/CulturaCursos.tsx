import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CulturaIcon,
  culturaBg,
  culturaNom,
  culturaNomLink,
  culturaTxt,
} from "../../GlobalVariables";
import { modulosFisica } from "../aprendizajes/Cultura/ModulosFisica";

export const culturaCursos: ModalidadInfo = {
  nom: culturaNom,
  bgColor: culturaBg,
  color: culturaTxt,
  icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    {
      id: "cul-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + culturaNomLink + "/cul-curso-2",
      titulo: "La física en el ser humano",
      foto: "/img/cultura/fisica.jpg",
      descripcion:
        "La realidad a la que estamos acostumbrados es, en verdad, un milagro de la física cuántica.",
      precio: null,
      numLecciones: 4,
      icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosFisica,
    },
  ],
};
