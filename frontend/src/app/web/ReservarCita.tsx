import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { BookCallModal } from "../../components/global/BookCallModal";
import { useT } from "../../i18n";

/**
 * Página para pedir la sesión gratuita (el botón «Pedir una sesión gratuita» de la portada): elegir día, hora y dejar
 * los datos. Al terminar, la reserva se guarda y salen DOS correos: a quien la pide (con sus datos) y a María
 * (con los mismos datos y el correo de la persona para responderle). Todo en el turquesa oscuro sobre beige.
 */
const ReservarCita = () => {
  const t = useT();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1" pb={{ base: 16, md: 24 }}>
        <WelcomeCabecera activo={mounted} titulo={t("welcome.hero.pedirCita")} subtitulo={t("llamada.gratis")} mayusculas />
        <TrasCabecera><BookCallModal isOpen enPagina onClose={() => navigate("/")} /></TrasCabecera>
      </Box>
      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
};

export default ReservarCita;
