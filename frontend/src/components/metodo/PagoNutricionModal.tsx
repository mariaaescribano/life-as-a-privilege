import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

/** Pago de la 6ª disciplina (Nutrición). Estilo con los colores de Nutrición. */
export function PagoNutricionModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={nutricionBg}
      txt={nutricionTxt}
      nom={nutricionNom}
      ordinal={t("metodo.pago.ordinal.6")}
      errorColor="#b00020"
      descripcion={t("metodo.pago.resumen.nutricion")}
    />
  );
}

export default PagoNutricionModal;
