import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { BookCallModal } from "./BookCallModal";
import { PopupLlamada } from "../metodo/LlamadaCta";
import { focoBlanco } from "./foco";
import { useT } from "../../i18n";

/**
 * Botón flotante «Contáctame» (abajo a la derecha, en móvil y en ordenador).
 * Al pulsarlo sale EL popup de la casa, el de «Hablemos juntos · sin coste»
 * (PopupLlamada, el mismo que sale solo en El Mapa), que ya trae las dos
 * maneras de hablar conmigo: escribir por WhatsApp y agendar la llamada (el
 * mismo calendario, BookCallModal).
 *
 * Discreto a propósito: pastilla pequeña de cristal con un halo muy suave, sin
 * latido ni sombra negra. Va FUERA de cualquier contenedor con `zoom`/transform:
 * un `position: fixed` dentro de uno se ancla a él y no a la ventana.
 */
const HALO = "0 0 12px rgba(255,255,255,0.12), 0 0 28px rgba(180,255,245,0.07)";
const HALO_HOVER = "0 0 16px rgba(255,255,255,0.2), 0 0 36px rgba(180,255,245,0.12)";

const IconoSobre = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="18px" h="18px" fill="currentColor" flexShrink={0}>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
  </Box>
);

const BotonContactame = () => {
  const t = useT();
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);

  return (
    <>
      <Flex
        as="button"
        type="button"
        onClick={() => setPopupAbierto(true)}
        position="fixed"
        right={{ base: "14px", md: "24px" }}
        bottom={{ base: "calc(14px + env(safe-area-inset-bottom))", md: "24px" }}
        // Por debajo del aviso de cookies (z 2000): mientras esté, no lo tapa.
        zIndex={150}
        align="center"
        gap={2}
        px={{ base: 4, md: 5 }}
        py={{ base: "9px", md: "10px" }}
        borderRadius="full"
        bg="rgba(0,110,110,0.55)"
        border="1px solid rgba(255,255,255,0.4)"
        color="white"
        fontFamily="'EB Garamond', serif"
        fontWeight="600"
        fontSize={{ base: "sm", md: "md" }}
        letterSpacing="0.06em"
        cursor="pointer"
        boxShadow={HALO}
        transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, background 0.3s ease"
        _hover={{ transform: "translateY(-2px)", bg: "rgba(0,110,110,0.8)", boxShadow: HALO_HOVER }}
        _active={{ transform: "translateY(0)" }}
        _focusVisible={focoBlanco}
        aria-label={t("contactame.boton")}
      >
        {IconoSobre}
        {t("contactame.boton")}
      </Flex>

      <PopupLlamada
        isOpen={popupAbierto}
        onClose={() => setPopupAbierto(false)}
        onAgendar={() => setCalendarioAbierto(true)}
      />
      <BookCallModal isOpen={calendarioAbierto} onClose={() => setCalendarioAbierto(false)} />
    </>
  );
};

export default BotonContactame;
