import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NeuropsicologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";

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
        "Entiende el porqué de tus hábitos diarios, de tus enfados, frustraciones y dolores, para transformarlos en el impulso que te libere del pasado. Un viaje desde el vínculo materno hasta la madurez, que te lleva a comprender cómo tus experiencias tempranas moldean quién eres hoy.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom +"/etapasVida",
    },
  ],
};
