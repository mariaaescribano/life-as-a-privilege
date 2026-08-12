import React, { useState } from "react";
import { HinduismoIlustracionesModal } from "./HinduismoIlustracionesModal";

/** Hook para añadir el botón "Ilustraciones" al `extra` del MetodoStepHeader
 *  de cualquier página de Ayurveda. Devuelve el objeto de botón y el modal a
 *  renderizar en la página. */
export function useIlustracionesAyurveda() {
  const [open, setOpen] = useState(false);
  const extra = {
    label: "Ilustraciones",
    onClick: () => setOpen(true),
  };
  const modal = <HinduismoIlustracionesModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
