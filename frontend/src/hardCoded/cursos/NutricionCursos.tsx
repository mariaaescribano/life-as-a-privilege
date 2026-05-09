import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NutricionIcon,
  nutricionBg,
  nutricionNom,
  nutricionNomLink,
  nutricionTxt,
} from "../../GlobalVariables";
import { modulosNutricion, modulosMicrobiota } from "../aprendizajes/Nutricion/ModulosNutricion";

export const nutricionCursos: ModalidadInfo = {
  nom: nutricionNom,
  bgColor: nutricionBg,
  color: nutricionTxt,
  icon: <NutricionIcon size={{ base: "35px", md: "45px" }}  />,
  cursos: [
    {
      id: "nut-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + nutricionNomLink + "/nut-curso-2",
      titulo: "La Microbiota",
      foto: "/img/nutri/microbiota.png",
      descripcion:
        "El ecosistema invisible que influye en tu bienestar, tus emociones y tus decisiones. Cuidarlo es cuidarte.",
      precio: null,
      numLecciones: 6,
      icon: <NutricionIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosMicrobiota,
    },
    {
      id: "nut-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + nutricionNomLink + "/nut-curso-1",
      titulo: "Las bases de la nutrición",
      foto: "/img/nutri/nutriFotoCurso1.png",
      descripcion:
        "Qué hay más allá de los alimentos que consumimos cada día. Toma las riendas de tu claridad mental transformando tu dieta.",
      precio: null,
      numLecciones: 6,
      icon: <NutricionIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosNutricion,
    },
  ],
};
