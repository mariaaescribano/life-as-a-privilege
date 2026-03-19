import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  AstrologiaIcon,
  astrologiaBg,
  astrologiaNom,
  astrologiaTxt,
} from "../../GlobalVariables";

export const astroCurso1ID = "astro-curso-1";

export const astrologiaCursos: ModalidadInfo = {
  nom: astrologiaNom,
  bgColor: astrologiaBg,
  color: astrologiaTxt,
  icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: astroCurso1ID,
      cursoLink: "/aprendizaje/modulosPage/" + astrologiaNom + "/" + astroCurso1ID,
      titulo: "El Ascendente, el Sol y la Luna",
      foto: "/img/astrologia/astro.png",
      descripcion:
        "Entiende los arquetipos de tu Ascendente, de tu Sol y de tu Luna.",
      precio: null,
      numLecciones: 38,
      icon: <AstrologiaIcon size={{ base: "20px", md: "30px" }} />,
    },
  ],
};
