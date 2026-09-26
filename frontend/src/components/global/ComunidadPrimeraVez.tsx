import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL, WHATSAPP_COMUNIDAD_URL } from "../../GlobalVariables";
import { suplantacionActiva } from "../../api/suplantar";
import { useT } from "../../i18n";

const VISTO_KEY = "comunidadPopupVisto";

/**
 * Invitación a la comunidad de WhatsApp: sale UNA sola vez, la primera vez que
 * la persona entra (en /home). Quién la ha visto lo guarda la BD
 * (`comunidad_popup_visto`); el localStorage solo ahorra la consulta en las
 * siguientes visitas. Se cierre como se cierre, queda vista, y el texto avisa
 * de que para unirse más tarde está en Contactar → Comunidad.
 */
export function ComunidadPrimeraVez() {
  const t = useT();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!WHATSAPP_COMUNIDAD_URL) return;
    // Una admin «entrando como» otra persona no debe gastarle su popup.
    if (suplantacionActiva()) return;
    try { if (localStorage.getItem(VISTO_KEY)) return; } catch { /* sin storage */ }
    let cancelado = false;
    axios
      .get(`${API_URL}/user/me`)
      .then((r) => {
        if (cancelado) return;
        if (r.data?.comunidad_popup_visto === false) setAbierto(true);
        else { try { localStorage.setItem(VISTO_KEY, "1"); } catch { /* */ } }
      })
      .catch(() => { /* sin popup */ });
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    try { localStorage.setItem(VISTO_KEY, "1"); } catch { /* */ }
    void axios.post(`${API_URL}/user/me/comunidad-popup`).catch(() => { /* */ });
  };

  const unirme = () => {
    window.open(WHATSAPP_COMUNIDAD_URL, "_blank", "noopener,noreferrer");
    cerrar();
  };

  if (!abierto) return null;

  const boton = {
    color: "white",
    fontWeight: "700",
    fontSize: { base: "md", md: "lg" },
    letterSpacing: "0.1em",
    px: 8,
    py: 3,
    borderRadius: "full",
    cursor: "pointer",
    transition: "all 0.22s ease",
  } as const;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1100}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.65)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={cerrar}
      px={{ base: 5, md: 10 }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        bg="rgba(0,90,80,0.92)"
        border="1px solid rgba(255,255,255,0.3)"
        sx={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
        borderRadius="3xl"
        boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
        p={{ base: 8, md: 12 }}
        maxW="460px"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={5}
        textAlign="center"
        fontFamily="'EB Garamond', serif"
      >
        <Image
          src="/img/icono/life.webp"
          alt=""
          w="90px"
          objectFit="contain"
          filter="drop-shadow(0 4px 12px rgba(255, 255, 255, 0.35))"
        />
        <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em">
          {t("comunidadPopup.titulo")}
        </Text>
        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
          {t("comunidadPopup.texto")}
        </Text>
        <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
          {t("comunidadPopup.soloUnaVez")}
        </Text>
        <Flex gap={3} wrap="wrap" justify="center" mt={2}>
          <Box
            as="button"
            onClick={unirme}
            {...boton}
            border="2px solid rgba(255,255,255,0.65)"
            bg="rgba(255,255,255,0.14)"
            boxShadow="0 0 28px rgba(107,196,200,0.5), 0 2px 12px rgba(0,0,0,0.25)"
            _hover={{ bg: "rgba(255,255,255,0.26)", borderColor: "white" }}
          >
            {t("comunidadPopup.unirme")}
          </Box>
          <Box
            as="button"
            onClick={cerrar}
            {...boton}
            fontWeight="400"
            border="1.5px solid rgba(255,255,255,0.35)"
            bg="transparent"
            _hover={{ borderColor: "white" }}
          >
            {t("comunidadPopup.ahoraNo")}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
