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
    // {
    //   id: fisioCurso5ID,
    //   cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso5ID,
    //   titulo: "El ejercicio, el cerebro y el cuerpo",
    //   foto: "/img/fisio/ejercicio.jpg",
    //   descripcion: "El equilibrio, la fuerza y el cardio transforman tu cerebro, fortalecen tu cuerpo y mejoran tu vida desde dentro.",
    //   precio: null,
    //   numLecciones: 7,
    //   icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
    //   modulos: modulosFisiologiaEjercicio,
    // },
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
    // {
    //   id: fisioCurso4ID,
    //   cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso4ID,
    //   titulo: "La meditación y el cerebro",
    //   foto: "/img/fisio/medit.png",
    //   descripcion: "La meditación transforma físicamente tu cuerpo, incrementa la neuroplasticidad y te permite ser tu mejor versión cuando quieras.",
    //   precio: null,
    //   numLecciones: 7,
    //   icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
    //   modulos: modulosFisiologiaMeditacion,
    // },
    // {
    //   id: fisioCurso3ID,
    //   cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso3ID,
    //   titulo: "La fisiología del cáncer",
    //   foto: "/img/fisio/fisioCancer.png",
    //   descripcion: "Entiende qué es el cáncer desde dentro: cómo mutan las células, cómo crece un tumor y qué puedes hacer tú para prevenirlo.",
    //   precio: null,
    //   numLecciones: 11,
    //   icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
    //   modulos: modulosFisiologiaCancer,
    // },
    // {
    //   id: fisioCurso2ID,
    //   cursoLink: "/aprendizaje/modulosPage/" + fisiologiaNom + "/" + fisioCurso2ID,
    //   titulo: "La inflamación crónica",
    //   foto: "/img/fisio/inflam.png",
    //   descripcion: "La inflamación crónica y sus efectos silenciosos en todo tu cuerpo.",
    //   precio: null,
    //   numLecciones: 8,
    //   icon: <FisiologiaIcon size={{ base: "20px", md: "30px" }} />,
    //   modulos: modulosFisiologiaInflamacion,
    // },
   
  ],
};
