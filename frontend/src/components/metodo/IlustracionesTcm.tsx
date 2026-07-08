import React, { useState } from "react";
import { TCMIlustracionesModal } from "./TCMIlustracionesModal";
import { EyeIcon } from "./IlustracionesAyurveda";

/** Hook para añadir el botón "Ilustraciones" al `extra` del MetodoStepHeader
 *  de cualquier página de Medicina China. Devuelve el objeto de botón y el
 *  modal a renderizar en la página (mismo patrón que useIlustracionesAyurveda). */
export function useIlustracionesTcm() {
  const [open, setOpen] = useState(false);
  const extra = {
    label: "Ilustraciones",
    onClick: () => setOpen(true),
    icon: <EyeIcon />,
  };
  const modal = <TCMIlustracionesModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
