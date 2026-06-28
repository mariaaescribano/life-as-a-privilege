import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { HinduismoIlustracionesModal } from "./HinduismoIlustracionesModal";

// Icono de ojo para el botón "Ilustraciones".
export const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.38))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

/** Hook para añadir el botón "Ilustraciones" al `extra` del MetodoStepHeader
 *  de cualquier página de Ayurveda. Devuelve el objeto de botón y el modal a
 *  renderizar en la página. */
export function useIlustracionesAyurveda() {
  const [open, setOpen] = useState(false);
  const extra = {
    label: "Ilustraciones",
    onClick: () => setOpen(true),
    icon: <EyeIcon />,
  };
  const modal = <HinduismoIlustracionesModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
