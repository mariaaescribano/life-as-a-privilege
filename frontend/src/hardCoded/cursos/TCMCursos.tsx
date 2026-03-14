import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  TCMIcon,
  tcmBg,
  tcmNom,
  tcmNomLink,
  tcmTxt,
} from "../../GlobalVariables";

export const tcmCursos: ModalidadInfo = {
  nom: tcmNom,
  bgColor: tcmBg,
  color: tcmTxt,
  icon: <TCMIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "tcm-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + tcmNomLink + "/tcm-curso-1",
      titulo: "Los fundamentos",
      foto: "/img/tcm/tcm_curso1.jpg",
      descripcion:
        "Descubre la filosofía de la medicina china, los Cinco Elementos y su influencia en el cuerpo Humano, el Yin y el Yang y el diagnóstico de la lengua.",
      precio: null,
      numLecciones: 24,
      icon: <TCMIcon size={{ base: "40px", md: "50px" }} />,
    },
  ],
};
