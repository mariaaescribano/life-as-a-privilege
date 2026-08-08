import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

/** Pago de la 5ª disciplina (Fisiología). Estilo con los colores de Fisiología. */
export function PagoFisiologiaModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={fisiologiaBg}
      txt={fisiologiaTxt}
      nom={fisiologiaNom}
      ordinal={t("metodo.pago.ordinal.5")}
      descripcion={t("metodo.pago.resumen.fisiologia")}
    />
  );
}

export default PagoFisiologiaModal;
