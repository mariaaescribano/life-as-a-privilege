import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { focoBlanco } from "../../components/global/foco";
import { FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Asesoría 1:1. POR AHORA solo lleva el titular «Asesorías 1:1» con su frase de debajo y, en medio, el
 * botón «Pedir una sesión gratuita» (que lleva a /reservar-cita). Todo lo demás (foto, cajas, «¿Cómo trabajo?»,
 * mapa de disciplinas, opiniones, formulario…) está fuera: la página completa se guardó en
 * `Asesoria.completa.tsx.txt`.
 */
const Asesoria = () => {
  const t = useT();
  const navigate = useNavigate();

  // La cabecera arranca un instante después de montar, para que se vea entrar.
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
        <WelcomeCabecera activo={mounted} titulo={t("asesoria.titulo")} subtitulo={t("asesoria.subtitulo")} mayusculas sinSeparador />

        <TrasCabecera>

        {/* ── El botón, en medio ── */}
        <Flex justify="center" pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }} px={5}>
          <Reveal activo={mounted} direction="up" distance={16} duration={0.9} delay={0.2}>
            <Flex
              as="button"
              type="button"
              onClick={() => navigate("/reservar-cita")}
              align="center"
              px={{ base: 8, md: 10 }}
              py="14px"
              borderRadius="full"
              bg={T}
              color={FONDO_PAGINA_BEIGE}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              cursor="pointer"
              transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease"
              _hover={{ transform: "translateY(-2px)", opacity: 0.92 }}
              _active={{ transform: "translateY(0)" }}
              _focusVisible={focoBlanco}
            >
              {t("welcome.hero.pedirCita")}
            </Flex>
          </Reveal>
        </Flex>
        </TrasCabecera>
      </Box>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
};

export default Asesoria;
