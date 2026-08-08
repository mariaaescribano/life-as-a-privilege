import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { culturaBg, culturaNom, culturaTxt } from "../../GlobalVariables";

/** Pago de la 8ª disciplina (Cultura). Estilo con los colores de Cultura. */
export function PagoCulturaModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={culturaBg}
      txt={culturaTxt}
      nom={culturaNom}
      ordinal={t("metodo.pago.ordinal.8")}
      descripcion={t("metodo.pago.resumen.cultura")}
    />
  );
}

export default PagoCulturaModal;
