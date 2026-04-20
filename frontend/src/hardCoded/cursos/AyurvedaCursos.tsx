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
import { modulosKarma } from "../aprendizajes/Ayurveda/ModulosKarma";

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
    {
      id: "ayu-curso-2",
      cursoLink: "/aprendizaje/modulosPage/" + ayurvedaNomLink + "/ayu-curso-2",
      titulo: "Los Chakras",
      foto: "/img/ayurveda/chakras.png",
      descripcion:
        "Los 7 chakras explicados para que puedas hacerte cargo de ellos y, por extensión, de ti mismo.",
      precio: null,
      numLecciones: 9,
      icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosChakras,
    },
    {
      id: "ayu-curso-3",
      cursoLink: "/aprendizaje/modulosPage/" + ayurvedaNomLink + "/ayu-curso-3",
      titulo: "El karma de la herida",
      foto: "/img/ayurveda/karma.png",
      descripcion:
        "Reencarnamos para sanar. El karma y las personas que nos duelen son espejos que señalan las heridas que vinimos a recordar.",
      precio: null,
      numLecciones: 7,
      icon: <AyurvedaIcon size={{ base: "35px", md: "45px" }} />,
      modulos: modulosKarma,
    },
  ],
};
