import React from "react";
import { FotoBox } from "./FotoBox";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// Tarjeta con foto de Nutrición (moléculas/tipos de un grupo, mitos…). Usa el box
// por defecto (FotoBox): foto a sangre arriba, línea y título abajo a la izq.
// Al pincharla se abre su ficha tipo cómic (NutrienteFichaModal).
export function TarjetaNutri({
  titulo, foto, numero, visto, emoji, onClick,
}: {
  titulo: React.ReactNode;
  foto?: string;
  numero?: number;
  /** Su ficha ya está abierta: tick arriba a la derecha, como en las rejillas. */
  visto?: boolean;
  /** Emoji de reserva mientras no exista la foto (tarjetas con la portada aún
   *  pendiente de subir, p.ej. las lecturas de «¿De dónde vienen?»). */
  emoji?: string;
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
      emoji={emoji}
      onClick={onClick}
      vivo
    />
  );
}
