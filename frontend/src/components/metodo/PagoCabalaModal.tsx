import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

/** Pago de la 7ª disciplina (Cábala). Estilo con los colores de Cábala. */
export function PagoCabalaModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={cabalaBg}
      txt={cabalaTxt}
      nom={cabalaNom}
      ordinal={t("metodo.pago.ordinal.7")}
      descripcion={t("metodo.pago.resumen.cabala")}
    />
  );
}

export default PagoCabalaModal;
