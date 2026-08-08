import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";

/** Pago de la 2ª disciplina (Psicología). Estilo con los colores de Psicología. */
export function PagoPsicologiaModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={neuropsicologiaBg}
      txt={neuropsicologiaTxt}
      nom={neuropsicologiaNom}
      ordinal={t("metodo.pago.ordinal.2")}
      errorColor="#a02020"
      descripcion={t("metodo.pago.resumen.psicologia")}
    />
  );
}

export default PagoPsicologiaModal;
