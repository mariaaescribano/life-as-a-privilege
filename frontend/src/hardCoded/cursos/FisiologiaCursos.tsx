import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { fisioCurso1ID, modulosFisiologia } from "../aprendizajes/Fisiologia/ModulosFisiologia";

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
  ],
};
