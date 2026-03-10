import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CabalaIcon,
  cabalaBg,
  cabalaNom,
  cabalaTxt,
} from "../../GlobalVariables";

export const cabalaCursos: ModalidadInfo = {
  moduloLink: "/aprendizaje/modulosPage/" + cabalaNom,
  nom: cabalaNom,
  bgColor: cabalaBg,
  color: cabalaTxt,
  icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "cabala-curso-1",
      titulo: "Cábala: Sabiduría y equilibrio",
      foto: "/img/extras/flor.png",
      descripcion:
        "Explora la sabiduría de la Cábala y descubre qué te desequilibra para transformarlo y vivir desde la conexión con tu esencia. Un camino hacia el autoconocimiento a través de los símbolos y la tradición mística.",
      precio: null,
      numLecciones: 12,
      icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />,
    },
  ],
};
