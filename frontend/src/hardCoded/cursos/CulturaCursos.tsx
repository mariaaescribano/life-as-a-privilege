import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CulturaIcon,
  culturaBg,
  culturaNom,
  culturaNomLink,
  culturaTxt,
} from "../../GlobalVariables";
import { modulosCultura } from "../aprendizajes/Cultura/ModulosCultura";

export const culturaCursos: ModalidadInfo = {
  nom: culturaNom,
  bgColor: culturaBg,
  color: culturaTxt,
  icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    {
      id: "cul-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + culturaNomLink + "/cul-curso-1",
      titulo: "Spinoza",
      foto: "/img/cultura/spinoza.png",
      descripcion:
        "Descubre quién fue Spinoza, su visión de Dios y por qué influenció tanto a personas como Einstein.",
      precio: null,
      numLecciones: 6,
      icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosCultura,
    },
  ],
};
