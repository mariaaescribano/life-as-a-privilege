import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { useT } from "../../i18n";

/**
 * «Cómo veo la Astrología» (/astrologia). Por ahora solo lleva la apertura: el mandala, ASTROLOGÍA en
 * marrón chocolate y debajo la frase en cursiva (la segunda línea, además, en negrita). El resto de la
 * página (las secciones que explican mi visión) se irá añadiendo debajo de la cabecera.
 */
const AstrologiaVision = () => {
  const t = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <WelcomeCabecera activo={mounted} titulo={t("header.astrologia")} subtitulo={t("astroVision.frase")} mayusculas />
        <TrasCabecera>
          {/* Aquí irán las secciones de la página. */}
          <Box pb={{ base: 16, md: 24 }} />
        </TrasCabecera>
      </Box>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
};

export default AstrologiaVision;
