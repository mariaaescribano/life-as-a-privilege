import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { culturaBg, culturaNom, culturaTxt } from "../../GlobalVariables";

/** Pago de la 8ª disciplina (Cultura). Estilo con los colores de Cultura. */
export function PagoCulturaModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={culturaBg}
      txt={culturaTxt}
      nom={culturaNom}
      ordinal="Octava disciplina"
      descripcion={
        <>
          Cierra El Mapa recorriendo la Historia de la Filosofía, la Medicina, la Religión y la cultura
          general: recuerda de dónde venimos para entender dónde estamos y poder crear un futuro más bonito.
        </>
      }
    />
  );
}

export default PagoCulturaModal;
