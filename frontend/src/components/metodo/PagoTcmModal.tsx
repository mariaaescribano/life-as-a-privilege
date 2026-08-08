import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";

/** Pago de la 4ª disciplina (Medicina China). Estilo con los colores de Medicina China. */
export function PagoTcmModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={tcmBg}
      txt={tcmTxt}
      nom={tcmNom}
      ordinal={t("metodo.pago.ordinal.4")}
      descripcion={t("metodo.pago.resumen.tcm")}
    />
  );
}

export default PagoTcmModal;
