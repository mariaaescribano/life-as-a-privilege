import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  AyurvedaIcon,
  ayurvedaBg,
  ayurvedaNom,
  ayurvedaNomLink,
  ayurvedaTxt,
} from "../../GlobalVariables";
import { modulosAyurveda } from "../aprendizajes/Ayurveda/ModulosAyurveda";

export const ayurvedaCursos: ModalidadInfo = {
  nom: ayurvedaNom,
  bgColor: ayurvedaBg,
  color: ayurvedaTxt,
  icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    {
      id: "ayu-curso-1",
      cursoLink: "/aprendizaje/modulosPage/" + ayurvedaNomLink + "/ayu-curso-1",
      titulo: "Introducción al Ayurveda",
      foto: "/img/ayurveda/ayucurso1.png",
      descripcion:
        "La medicina tradicional india, los doshas y tu constitución única para respetarte y cuidarte según tu naturaleza y tu esencia.",
      precio: null,
      numLecciones: 9,
      icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosAyurveda,
    },
  ],
};
