import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";

/** Pago de la 6ª disciplina (Nutrición). Estilo con los colores de Nutrición. */
export function PagoNutricionModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={nutricionBg}
      txt={nutricionTxt}
      ordinal="Sexta disciplina"
      errorColor="#b00020"
      descripcion={
        <>
          Continúa el Mapa con la Nutrición: descubre qué hay más allá de lo que comes cada día y nútrete con
          lo que de verdad te reconstruye. Recuerda cómo no destruirte con los alimentos.
        </>
      }
    />
  );
}

export default PagoNutricionModal;
