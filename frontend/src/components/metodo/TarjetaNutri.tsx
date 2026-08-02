import React from "react";
import { FotoBox } from "./FotoBox";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// Tarjeta con foto de Nutrición (moléculas/tipos de un grupo, mitos…). Usa el box
// por defecto (FotoBox): foto a sangre arriba, línea y título abajo a la izq.
// Al pincharla se abre su ficha tipo cómic (NutrienteFichaModal).
export function TarjetaNutri({
  titulo, foto, numero, visto, onClick,
}: {
  titulo: string;
  foto?: string;
  numero?: number;
  /** Su ficha ya está abierta: tick arriba a la derecha, como en las rejillas. */
  visto?: boolean;
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
      visto={visto}
      onClick={onClick}
    />
  );
}
