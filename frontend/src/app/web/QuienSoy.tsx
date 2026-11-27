import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { Reveal } from "../../components/global/Reveal";
import Certificaciones from "../../components/web/Certificaciones";
import BandaFoto from "../../components/global/BandaFoto";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import TextoRico from "../../components/global/TextoRico";
import { FONDO_PAGINA_BEIGE as BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Quién soy. POR AHORA solo lleva: la cabecera (mandala + MARÍA ESCRIBANO), mi foto a la izquierda y mi texto a la derecha (sobre el beige,
 * sobre el mármol chocolate), y debajo «Mi formación y herramientas para asesorarte» con su botón (ese sí con el
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
        {/* ── Mandala + «MARÍA ESCRIBANO» + frase (la misma cabecera de la portada) ── */}
        <WelcomeCabecera activo={mounted} titulo="María Escribano" subtitulo={t("quienSoy.subtitulo")} mayusculas sinSeparador />

        <TrasCabecera>

        {/* ── PARTE 1 · sobre el mármol chocolate (letra beige): mi foto a la izquierda, el texto a la derecha ── */}
        <Box mt={{ base: 10, md: 16 }}>
        <BandaFoto foto="/img/fondos/marmol-chocolate.webp" fundido={55} pt={{ base: "56px", md: "80px" }} pb={{ base: "56px", md: "80px" }}>
          <Flex
            w="100%"
            maxW="1180px"
            mx="auto"
            px={{ base: 5, md: 10, lg: 16 }}
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={{ base: 8, md: 12, lg: 16 }}
          >
            <Reveal activo={mounted} direction="right" distance={36} scaleFrom={0.94} blur duration={1.2} w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0}>
              {/* Doble marco: la foto con su borde y, por fuera, un filo fino desplazado. */}
              <Box position="relative">
                <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${BEIGE}66`} pointerEvents="none" />
                <Box borderRadius="22px" overflow="hidden" border={`1.5px solid ${BEIGE}`}>
                  <Image src="/img/me/maria-portada.webp" alt="María Escribano" w="100%" h="auto" display="block" />
                </Box>
              </Box>
            </Reveal>

            <Flex direction="column" flex="1" minW={0} gap={{ base: 4, md: 5 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              {(["quienSoy.a2", "quienSoy.a3", "quienSoy.a4"] as const).map((k, i) => (
                <Reveal key={k} activo={mounted} direction="left" distance={30} duration={0.9} delay={0.3 + i * 0.2}>
                  <Text color={BEIGE} fontSize={{ base: "md", md: "lg", lg: "xl" }} lineHeight="1.7" letterSpacing="0.01em">
                    <TextoRico texto={t(k)} />
                  </Text>
                </Reveal>
              ))}
            </Flex>
          </Flex>
        </BandaFoto>
        </Box>

        {/* ── PARTE 2 · sobre el beige (letra chocolate): el texto a la izquierda, la segunda foto a la derecha ── */}
        <Flex
          w="100%"
          maxW="1180px"
          mx="auto"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 12, md: 20 }}
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 8, md: 12, lg: 16 }}
        >
          <Flex direction="column" flex="1" minW={0} gap={{ base: 4, md: 5 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }} order={{ base: 1, md: 0 }}>
            {(["quienSoy.b1", "quienSoy.b2", "quienSoy.b3"] as const).map((k, i) => (
              <Reveal key={k} inView direction="right" distance={30} duration={0.9} delay={i * 0.15}>
                <Text color={T} fontSize={{ base: "md", md: "lg", lg: "xl" }} lineHeight="1.7" letterSpacing="0.01em">
                  <TextoRico texto={t(k)} />
                </Text>
              </Reveal>
            ))}
          </Flex>

          <Reveal inView direction="left" distance={36} scaleFrom={0.94} blur duration={1.2} w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0} order={{ base: 0, md: 1 }}>
            <Box position="relative">
              <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${T}66`} pointerEvents="none" />
              <Box borderRadius="22px" overflow="hidden" border={`1.5px solid ${T}`}>
                <Image src="/img/me/maria-quiensoy.webp" alt="María Escribano" w="100%" h="auto" display="block" loading="lazy" />
              </Box>
            </Box>
          </Reveal>
        </Flex>

        {/* ── Cierre: las dos frases entre dos separaciones con el mandala ── */}
        <Box pt={{ base: 6, md: 10 }}>
          <SeparadorFlor />
          <Flex direction="column" align="center" textAlign="center" gap={{ base: 4, md: 5 }} maxW="860px" mx="auto" px={{ base: 5, md: 10 }} py={{ base: 2, md: 4 }}>
            <Reveal inView direction="up" distance={20} duration={1}>
              <Text color={T} fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} lineHeight="1.45" letterSpacing="0.01em">
                <TextoRico texto={t("quienSoy.c1")} />
              </Text>
            </Reveal>
            <Reveal inView direction="up" distance={16} duration={1} delay={0.2}>
              <Text color={T} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.6" letterSpacing="0.01em">
                <TextoRico texto={t("quienSoy.c2")} />
              </Text>
            </Reveal>
          </Flex>
          <SeparadorFlor />
        </Box>

        {/* ── Mi formación y herramientas para asesorarte + el botón: sobre el mármol chocolate, letra beige ── */}
        <Box mt={{ base: 10, md: 16 }} pb={{ base: 20, md: 28 }}>
          <BandaFoto foto="/img/fondos/marmol-chocolate.webp" fundido={55} pt={{ base: "56px", md: "80px" }} pb={{ base: "56px", md: "80px" }}>
            <Certificaciones />
          </BandaFoto>
        </Box>
        </TrasCabecera>
      </Box>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
};

export default QuienSoy;
