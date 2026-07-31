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
          Empieza el mapa con tu carta natal: descubre tus puntos clave, tus dones y tus conflictos. Encuentra dónde nacieron tus patrones, para qué y por qué los mantienes, y cuál es tu propósito.
        </>
      }
    />
  );
}

export default PagoMetodoModal;
