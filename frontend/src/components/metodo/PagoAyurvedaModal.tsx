import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { ayurvedaBg, ayurvedaTxt } from "../../GlobalVariables";

/** Pago de la 3ª disciplina (Hinduismo/Ayurveda). Estilo con los colores de Hinduismo. */
export function PagoAyurvedaModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={ayurvedaBg}
      txt={ayurvedaTxt}
      ordinal="Tercera disciplina"
      errorColor="#b00020"
      descripcion={
        <>
          Continúa el Mapa con el Hinduismo: descubre tu Dosha —tu constitución— y la naturaleza que te
          define, y aprende a comer, moverte y descansar en equilibrio con lo que de verdad eres.
        </>
      }
    />
  );
}

export default PagoAyurvedaModal;
