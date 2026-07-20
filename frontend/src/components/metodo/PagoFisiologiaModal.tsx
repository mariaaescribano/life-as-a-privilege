import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

/** Pago de la 5ª disciplina (Fisiología). Estilo con los colores de Fisiología. */
export function PagoFisiologiaModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={fisiologiaBg}
      txt={fisiologiaTxt}
      nom={fisiologiaNom}
      ordinal="Quinta disciplina"
      descripcion={
        <>
          Continúa el Mapa con la Fisiología: viaja desde las partículas que te forman hasta el milagro de
          ser un cuerpo vivo, conoce tus células y tus sistemas y redescúbrete como el ser complejo y
          fascinante que eres.
        </>
      }
    />
  );
}

export default PagoFisiologiaModal;
