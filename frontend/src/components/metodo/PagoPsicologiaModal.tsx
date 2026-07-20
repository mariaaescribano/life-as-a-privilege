import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { neuropsicologiaBg, neuropsicologiaTxt } from "../../GlobalVariables";

/** Pago de la 2ª disciplina (Psicología). Estilo con los colores de Psicología. */
export function PagoPsicologiaModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={neuropsicologiaBg}
      txt={neuropsicologiaTxt}
      ordinal="Segunda disciplina"
      errorColor="#a02020"
      descripcion={
        <>
          Continúa el Mapa con Psicología: reconstruye tu historia y comprende cómo se fue construyendo tu
          mente, recorriendo tus huellas, tus miedos y tus heridas para habitarte con más libertad y coherencia.
        </>
      }
    />
  );
}

export default PagoPsicologiaModal;
