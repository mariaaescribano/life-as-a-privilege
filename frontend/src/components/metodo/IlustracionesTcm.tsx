import React, { useState } from "react";
import { TCMIlustracionesModal } from "./TCMIlustracionesModal";
import { useT } from "../../i18n";

/** Hook para añadir el botón "Ilustraciones" al `extra` del MetodoStepHeader
 *  de cualquier página de Medicina China. Devuelve el objeto de botón y el
 *  modal a renderizar en la página (mismo patrón que useIlustracionesAyurveda).
 *  El label sale del diccionario: es como el header lo reconoce para ponerle
 *  el icono del marco de foto (y dejar solo el icono en móvil). */
export function useIlustracionesTcm() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const extra = {
    label: t("metodo.ilustraciones"),
    onClick: () => setOpen(true),
  };
  const modal = <TCMIlustracionesModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
