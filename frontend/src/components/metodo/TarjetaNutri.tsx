import React from "react";
import { FotoBox } from "./FotoBox";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// Tarjeta con foto de Nutrición (moléculas/tipos de un grupo, mitos…). Usa el box
// por defecto (FotoBox): foto a sangre arriba, línea y título abajo a la izq.
// Al pincharla se abre su ficha tipo cómic (NutrienteFichaModal).
export function TarjetaNutri({
  titulo, foto, numero, onClick,
}: {
  titulo: string;
  foto?: string;
  numero?: number;
  onClick?: () => void;
}) {
  return (
    <FotoBox
      titulo={titulo}
      foto={foto}
      nom={nutricionNom}
      tinta={nutricionTxt}
      bg={nutricionBg}
      numero={numero}
      onClick={onClick}
    />
  );
}
