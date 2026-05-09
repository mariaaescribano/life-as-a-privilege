import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  NeuropsicologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { modulosEsquizofrenia, modulosDepresion, modulosPadresHeridos } from "../aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";

export const neuropsicologiaCursos: ModalidadInfo = {
  nom: neuropsicologiaNom,
  bgColor: neuropsicologiaBg,
  color: neuropsicologiaTxt,
  icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
  cursos: [
    {
      id: "padresHeridos",
      titulo: "Padres heridos, bebés heridos",
      foto: "/img/np/padresheridos.png",
      descripcion:
        "Las heridas no sanadas de los padres se imprimen en el sistema nervioso del hijo. Entiende cómo, para hacerte responsable de sanarte.",
      precio: null,
      numLecciones: 6,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/padresHeridos",
      modulos: modulosPadresHeridos,
    },
    {
      id: "depresion",
      titulo: "La depresión está en tu Vida",
      foto: "/img/np/depresion.png",
      descripcion:
        "La depresión no es un fallo químico: es un mensaje de tu Vida. Aprende a escucharlo y a salir de ella.",
      precio: null,
      numLecciones: 5,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/depresion",
      modulos: modulosDepresion,
    },
    {
      id: "esquizofrenia",
      titulo: "Más allá de la esquizofrenia",
      foto: "/img/np/esq.jpg",
      descripcion:
        "La esquizofrenia no es lo que nos habían hecho creer. La esquizofrenia es una manifestación caótica de un profundo dolor no sanado ni legitimado.",
      precio: null,
      numLecciones: 10,
      icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />,
      cursoLink: "/aprendizaje/modulosPage/" + neuropsicologiaNom + "/esquizofrenia",
      modulos: modulosEsquizofrenia,
    },
  ],
};
