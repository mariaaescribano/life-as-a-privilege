import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

/** Pago de la 7ª disciplina (Cábala). Estilo con los colores de Cábala. */
export function PagoCabalaModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={cabalaBg}
      txt={cabalaTxt}
      nom={cabalaNom}
      ordinal="Séptima disciplina"
      descripcion={
        <>
          Adéntrate en la Cábala y recorre el Árbol de la Vida: descubre las diez sefirot que te habitan, los
          22 senderos de la consciencia y aprende a reconocer en ti esas fuerzas para vivir desde tu esencia.
        </>
      }
    />
  );
}

export default PagoCabalaModal;
