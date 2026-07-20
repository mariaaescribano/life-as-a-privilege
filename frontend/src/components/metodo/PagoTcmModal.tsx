import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { tcmBg, tcmTxt } from "../../GlobalVariables";

/** Pago de la 4ª disciplina (Medicina China). Estilo con los colores de Medicina China. */
export function PagoTcmModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={tcmBg}
      txt={tcmTxt}
      ordinal="Cuarta disciplina"
      descripcion={
        <>
          Continúa el Mapa con la Medicina China: descubre cómo los Cinco Elementos y sus ciclos te habitan,
          y lee las señales de tu cuerpo —hasta en tu lengua— para volver al equilibrio entre todo lo que nos
          forma, que es a lo que llamamos salud.
        </>
      }
    />
  );
}

export default PagoTcmModal;
