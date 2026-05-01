import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CulturaIcon,
  culturaBg,
  culturaNom,
  culturaTxt,
} from "../../GlobalVariables";

export const culturaCursos: ModalidadInfo = {
  nom: culturaNom,
  bgColor: culturaBg,
  color: culturaTxt,
  icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    // {
    //   id: "cul-curso-1",
    //   cursoLink: "/aprendizaje/modulosPage/" + culturaNomLink + "/cul-curso-1",
    //   titulo: "Spinoza",
    //   foto: "/img/cultura/spinoza.png",
    //   descripcion:
    //     "Quién fue Spinoza, su visión de Dios y por qué influenció a personas como Einstein.",
    //   precio: null,
    //   numLecciones: 6,
    //   icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
    //   modulos: modulosCultura,
    // },
    // {
    //   id: "cul-curso-2",
    //   cursoLink: "/aprendizaje/modulosPage/" + culturaNomLink + "/cul-curso-2",
    //   titulo: "La física en el ser humano",
    //   foto: "/img/cultura/fisica.png",
    //   descripcion:
    //     "La realidad a la que estamos acostumbrados es, en verdad, un milagro de la física cuántica.",
    //   precio: null,
    //   numLecciones: 4,
    //   icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
    //   modulos: modulosFisica,
    // },
  ],
};
