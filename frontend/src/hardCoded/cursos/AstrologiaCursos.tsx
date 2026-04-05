import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  AstrologiaIcon,
  astrologiaBg,
  astrologiaNom,
  astrologiaTxt,
} from "../../GlobalVariables";
import { modulosAstrologia, modulosAstrologiaCurso0, modulosArquetipos } from "../aprendizajes/Astrologia/ModulosAstrologia";

export const astroCurso0ID = "astro-curso-0";
export const astroCurso1ID = "astro-curso-1";
export const astroCurso2ID = "astro-curso-2";
export const astroCurso3ID = "astro-curso-3";

export const astrologiaCursos: ModalidadInfo = {
  nom: astrologiaNom,
  bgColor: astrologiaBg,
  color: astrologiaTxt,
  icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: astroCurso2ID,
      cursoLink: "/aprendizaje/modulosPage/" + astrologiaNom + "/" + astroCurso2ID,
      titulo: "Los Arquetipos",
      foto: "/img/astrologia/arqFoto.png",
      descripcion: "Entiende los arquetipos de la Astrología para un conocimiento más profundo y completo.",
      precio: null,
      numLecciones: 12,
      icon: <AstrologiaIcon size={{ base: "20px", md: "30px" }} />,
      modulos: modulosArquetipos,
    },
    {
      id: astroCurso0ID,
      cursoLink: "/aprendizaje/modulosPage/" + astrologiaNom + "/" + astroCurso0ID,
      titulo: "La Carta Natal y los Planetas",
      foto: "/img/astrologia/curso0.png",
      descripcion: "El primer paso para entenderte: descubrir tu carta natal y los arquetipos de los planetas.",
      precio: null,
      numLecciones: 13,
      icon: <AstrologiaIcon size={{ base: "20px", md: "30px" }} />,
      modulos: modulosAstrologiaCurso0,
    },
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
      modulos: modulosAstrologia,
    },
 
  ],
};
