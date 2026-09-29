import React, { useState } from "react";
import { HinduismoIlustracionesModal } from "./HinduismoIlustracionesModal";
import { useT } from "../../i18n";

/** Hook para añadir el botón "Ilustraciones" al `extra` del MetodoStepHeader
 *  de cualquier página de Ayurveda. Devuelve el objeto de botón y el modal a
 *  renderizar en la página. El label va con t(): es lo que el header compara
 *  para vestir el botón con el icono del marco de foto (icono + nombre, y en
 *  el móvil solo el icono). */
export function useIlustracionesAyurveda() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const extra = {
    label: t("metodo.ilustraciones"),
    onClick: () => setOpen(true),
  };
  const modal = <HinduismoIlustracionesModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
