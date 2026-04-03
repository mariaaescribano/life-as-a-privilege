import React from "react";
import type { ModalidadInfo } from "./cursos.type";
import {
  CulturaIcon,
  culturaBg,
  culturaNom,
  culturaTxt,
} from "../../GlobalVariables";

export const culturaCursos: ModalidadInfo = {
  nom: culturaNom,
  bgColor: culturaBg,
  color: culturaTxt,
  icon: <CulturaIcon size={{ base: "35px", md: "45px" }} />,
  cursos: [],
};
