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
import { modulosChakras } from "../aprendizajes/Ayurveda/ModulosChakras";

export const ayurvedaCursos: ModalidadInfo = {
  nom: ayurvedaNom,
  bgColor: ayurvedaBg,
  color: ayurvedaTxt,
  icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [
    {
      id: "ayu-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + ayurvedaNomLink + "/ayu-curso-2",
      titulo: "Los Chakras",
      foto: "/img/ayurveda/chakras.png",
      descripcion:
        "Los siete chakras: dónde el cuerpo y el alma se encuentran. Conócelos uno a uno.",
      precio: null,
      numLecciones: 9,
      icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosChakras,
    },
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
