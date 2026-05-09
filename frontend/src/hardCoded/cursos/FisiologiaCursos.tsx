import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { fisioCurso1ID, fisioCurso4ID, modulosFisiologia, modulosFisiologiaMeditacion } from "../aprendizajes/Fisiologia/ModulosFisiologia";

export const fisiologiaCursos: ModalidadInfo = {
  nom: fisiologiaNom,
  bgColor: fisiologiaBg,
  color: fisiologiaTxt,
  icon: <FisiologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: fisioCurso4ID,
      cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso4ID,
      titulo: "La neurociencia de la meditación",
      foto: "/img/fisio/meditacion.png",
      descripcion: "Descubre cómo meditar transforma físicamente tu cerebro: aumenta la neuroplasticidad, hace crecer la corteza prefrontal y el hipocampo, reduce la amígdala y protege tu salud.",
      precio: null,
      numLecciones: 7,
      icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
      modulos: modulosFisiologiaMeditacion,
    },
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
