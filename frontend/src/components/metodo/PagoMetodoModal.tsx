import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

/** Pago de la 1ª disciplina (Astrología). Estilo con los colores de Astrología. */
export function PagoMetodoModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={astrologiaBg}
      txt={astrologiaTxt}
      nom={astrologiaNom}
      ordinal={t("metodo.pago.ordinal.1")}
      descripcion={t("metodo.pago.resumen.astrologia")}
    />
  );
}

export default PagoMetodoModal;
