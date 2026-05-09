import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  FitoterapiaIcon,
  fitoterapiaBg,
  fitoterapiaNom,
  fitoterapiaTxt,
} from "../../GlobalVariables";
// import { modulosFitoterapia } from "../aprendizajes/Fitoterapia/ModulosFitoterpia";

export const fitoterapiaCursos: ModalidadInfo = {
  nom: fitoterapiaNom,
  bgColor: fitoterapiaBg,
  color: fitoterapiaTxt,
  icon: <FitoterapiaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [],
};
