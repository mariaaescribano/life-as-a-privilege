import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import Certificaciones from "../../components/web/Certificaciones";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Quién soy. POR AHORA solo lleva: mi foto a la izquierda y mi texto a la derecha (sobre el beige,
 * sin mármol), y debajo «Mi formación y herramientas para asesorarte» con su botón (ese sí con el
 * mármol). La página completa se guardó en `QuienSoy.completa.tsx.txt`.
 */
const QuienSoy = () => {
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
        {/* ── Foto a la izquierda, mi texto a la derecha ── */}
        <Flex
          w="100%"
          maxW="1180px"
          mx="auto"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 8, md: 12 }}
          pb={{ base: 14, md: 20 }}
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 8, md: 12, lg: 16 }}
        >
          <Reveal activo={mounted} direction="right" distance={36} scaleFrom={0.94} blur duration={1.2} w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0}>
            {/* Doble marco: la foto con su borde y, por fuera, un filo fino desplazado. */}
            <Box position="relative">
              <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${T}66`} pointerEvents="none" />
              <Box borderRadius="22px" overflow="hidden" border={`1.5px solid ${T}`}>
                <Image src="/img/me/fotoclasica.webp" alt="María Escribano" w="100%" h="auto" display="block" />
              </Box>
            </Box>
          </Reveal>

          <Flex direction="column" flex="1" minW={0} gap={{ base: 5, md: 6 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
            <Reveal activo={mounted} direction="left" distance={36} duration={1} delay={0.35}>
              <Text color={T} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.75" letterSpacing="0.01em">
                {t("creadora.bio")}
                <Box as="span" display="block" mt={{ base: 3, md: 4 }}>{t("creadora.bio2")}</Box>
              </Text>
            </Reveal>
            <Reveal activo={mounted} direction="left" distance={36} duration={1} delay={0.6}>
              <Text color={T} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.75" letterSpacing="0.01em">
                {t("quienSoy.mision")}
              </Text>
            </Reveal>
          </Flex>
        </Flex>

        {/* ── Mi formación y herramientas para asesorarte + el botón (con el mármol) ── */}
        <Box pb={{ base: 20, md: 28 }}>
          <Certificaciones />
        </Box>
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default QuienSoy;
