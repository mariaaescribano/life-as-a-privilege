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
  moduloLink: "/aprendizaje/modulosPage/" + tcmNomLink,
  nom: tcmNom,
  bgColor: tcmBg,
  color: tcmTxt,
  icon: <TCMIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "tcm-curso-1",
      titulo: "Los fundamentos",
      foto: "/img/tcm/tcm_curso1.jpg",
      descripcion:
        "Comprende el funcionamiento del ser humano y el origen de sus desequilibrios desde la medicina tradicional china y su visión taoísta. Descubre los cinco elementos, el yin y el yang, y cómo aplicarlos en tu vida diaria.",
      precio: null,
      numLecciones: 24,
      icon: <TCMIcon size={{ base: "40px", md: "50px" }} />,
    },
  ],
};
