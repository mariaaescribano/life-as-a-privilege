import React from "react";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

/** Pago de la 1ª disciplina (Astrología). Estilo con los colores de Astrología. */
export function PagoMetodoModal(props: PagoDisciplinaModalProps) {
  return (
    <PagoDisciplinaModal
      {...props}
      bg={astrologiaBg}
      txt={astrologiaTxt}
      nom={astrologiaNom}
      ordinal="Primera disciplina"
      descripcion={
        <>
          Empieza el Mapa con tu carta natal: descubre tus puntos clave, tus dones y tus conflictos.
          Aprende a leerte para reconocerte, comprenderte y respetarte como el ser único que eres.
        </>
      }
    />
  );
}

export default PagoMetodoModal;
