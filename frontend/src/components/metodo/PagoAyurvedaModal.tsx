import React from "react";
import { useT } from "../../i18n";
import { PagoDisciplinaModal } from "./PagoDisciplinaModal";
import type { PagoDisciplinaModalProps } from "./PagoDisciplinaModal";
import { ayurvedaBg, ayurvedaNom, ayurvedaTxt } from "../../GlobalVariables";

/** Pago de la 3ª disciplina (Hinduismo/Ayurveda). Estilo con los colores de Hinduismo. */
export function PagoAyurvedaModal(props: PagoDisciplinaModalProps) {
  const t = useT();
  return (
    <PagoDisciplinaModal
      {...props}
      bg={ayurvedaBg}
      txt={ayurvedaTxt}
      nom={ayurvedaNom}
      ordinal={t("metodo.pago.ordinal.3")}
      errorColor="#b00020"
      descripcion={t("metodo.pago.resumen.ayurveda")}
    />
  );
}

export default PagoAyurvedaModal;
