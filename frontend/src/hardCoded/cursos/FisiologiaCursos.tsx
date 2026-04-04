import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { fisioCurso1ID, fisioCurso2ID, modulosFisiologia, modulosFisiologiaInflamacion } from "../aprendizajes/Fisiologia/ModulosFisiologia";

export const fisiologiaCursos: ModalidadInfo = {
  nom: fisiologiaNom,
  bgColor: fisiologiaBg,
  color: fisiologiaTxt,
  icon: <FisiologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: fisioCurso1ID,
      cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso1ID,
      titulo: "El cuerpo humano como milagro",
      foto: "/img/fisio/fisioCurso1.jpg",
      descripcion: "Este curso te invita a redescubrir al ser humano desde los átomos que lo forman hasta la inteligencia que lo coordina. Es una pequeña introducción a tomar consciencia del milagro que es nuestro cuerpo.",
      precio: null,
      numLecciones: 7,
      icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
      modulos: modulosFisiologia,
    },
    {
      id: fisioCurso2ID,
      cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso2ID,
      titulo: "La inflamación crónica",
      foto: "/img/fisio/inflam.png",
      descripcion: "En este curso descubrirás la inflamación y sus efectos en tu cuerpo.",
      precio: null,
      numLecciones: 8,
      icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
      modulos: modulosFisiologiaInflamacion,
    },
  ],
};
