import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  FitoterapiaIcon,
  NutricionIcon,
  nutricionBg,
  nutricionNom,
  nutricionNomLink,
  nutricionTxt,
} from "../../GlobalVariables";
import { modulosNutricion, modulosMicrobiota } from "../aprendizajes/Nutricion/ModulosNutricion";
import { modulosFitoterapia } from "../aprendizajes/Fitoterapia/ModulosFitoterpia";

export const nutricionCursos: ModalidadInfo = {
  nom: nutricionNom,
  bgColor: nutricionBg,
  color: nutricionTxt,
  icon: <NutricionIcon size={{ base: "35px", md: "45px" }}  />,
  cursos: [
    {
      id: "nut-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + nutricionNomLink + "/nut-curso-1",
      titulo: "Las bases de la nutrición",
      foto: "/img/nutri/nutriFotoCurso1.png",
      descripcion:
        "Entiende qué hay más allá de los alimentos que consumimos cada día y toma las riendas de tu claridad mental transformando tu dieta.",
      precio: null,
      numLecciones: 6,
      icon: <NutricionIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosNutricion,
    },
    {
      id: "nut-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + nutricionNomLink + "/nut-curso-2",
      titulo: "La Microbiota",
      foto: "/img/nutri/microbiotacurso.png",
      descripcion:
        "Conoce el ecosistema invisible que vive en ti, cómo influye en tu bienestar, tus emociones y tus decisiones. Aprende a cuidarlo y a cuidarte.",
      precio: null,
      numLecciones: 10,
      icon: <NutricionIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosMicrobiota,
    },
    {
      id: "fito-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + nutricionNomLink + "/fito-curso-1",
      titulo: "Plantas comunes",
      foto: "/img/fitoterapia/especias.jpg",
      descripcion:
        "Descubre las propiedades beneficiosas de las especias comunes, disponibles en cualquier supermercado.",
      precio: null,
      numLecciones: 10,
      icon: <FitoterapiaIcon size={{ base: "35px", md: "45px" }} color={nutricionTxt} />,
      modulos: modulosFitoterapia,
    },
  ],
};
