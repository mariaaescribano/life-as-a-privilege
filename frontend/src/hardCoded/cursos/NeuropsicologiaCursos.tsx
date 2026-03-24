import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NeuropsicologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { modulosNeuroPsicologia } from "../aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";

export const neuropsicologiaCursos: ModalidadInfo = {
  nom: neuropsicologiaNom,
  bgColor: neuropsicologiaBg,
  color: neuropsicologiaTxt,
  icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "etapasVida",
      titulo: "Resumen de las etapas de la Vida",
      foto: "/img/np/neuropsicologia1Foto.jpg",
      descripcion:
        "Entiende cómo tu familia de origen formó la base de los patrones que hoy moldean tu vida. Desde una nueva mirada, comprende cómo, sin darte cuenta, creas la realidad en la que vives.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom +"/etapasVida",
      modulos: modulosNeuroPsicologia,
    },
  ],
};
