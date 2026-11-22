import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import SeparadorFlor from "./SeparadorFlor";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT, type ClaveTexto } from "../../i18n";

/**
 * Segundo apartado de la portada: separación con el mandala (turquesa oscuro), el titular
 * «Lo importante eres tú, las perspectivas se adaptan a ti.» y cuatro fotos en cuadrícula
 * (cuatro en horizontal en escritorio; una debajo de otra en móvil). Cada foto entra al llegar a ella, con un fundido
 * que sube y se enfoca; al pasar el ratón la foto hace zoom.
 *
 * Cada foto tiene hueco para su texto DEBAJO (`titulo` y `texto`); mientras no haya texto,
 * no se pinta nada.
 */
type Perspectiva = { foto: string; alt: string; titulo?: ClaveTexto; texto?: ClaveTexto };

const PERSPECTIVAS: Perspectiva[] = [
  { foto: "/img/welcome/perspectiva-mente.webp", alt: "", titulo: "welcome.persp.1.titulo" },
  { foto: "/img/welcome/perspectiva-filosofia.webp", alt: "", titulo: "welcome.persp.2.titulo" },
  { foto: "/img/welcome/perspectiva-astrologia.webp", alt: "", titulo: "welcome.persp.3.titulo" },
  { foto: "/img/welcome/perspectiva-acompanar.webp", alt: "", titulo: "welcome.persp.4.titulo" },
];

const WelcomePerspectivas = () => {
  const t = useT();
  return (
    <Box w="100%">
      <SeparadorFlor />

      <Flex direction="column" align="center" px={{ base: 0, md: 10, lg: 14 }} pb={{ base: 16, md: 24 }} maxW="1440px" mx="auto" gap={{ base: 5, md: 6 }}>
        <Reveal inView direction="up" distance={22} blur duration={1} w="100%">
          <Text
            color={T}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            textAlign="center"
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="1.35"
            letterSpacing="0.02em"
            maxW="520px"
            mx="auto"
          >
            {t("welcome.perspectivas.titular")}
          </Text>
        </Reveal>

        {/* Entradilla en cursiva, centrada, antes de las fotos. */}
        <Reveal inView direction="up" distance={16} duration={1} delay={0.2} w="100%">
          <Text
            color={T}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            textAlign="center"
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="1.5"
            letterSpacing="0.02em"
            px={{ base: 6, md: 0 }}
            mb={{ base: 2, md: 6 }}
          >
            {t("welcome.perspectivas.subtitulo")}
          </Text>
        </Reveal>

        {/* Las cuatro EN HORIZONTAL en escritorio (cuatro columnas anchas); en móvil, una debajo de otra. */}
        <Box
          w="100%"
          maxW={{ base: "420px", md: "1360px" }}
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={{ base: 10, md: 6, lg: 8 }}
          px={{ base: 6, md: 0 }}
        >
          {PERSPECTIVAS.map((p, i) => (
            <Reveal key={p.foto} inView direction="up" distance={34} scaleFrom={0.96} blur duration={1.1} delay={i * 0.15}>
              <Flex direction="column" gap={4} role="group">
                <Box borderRadius="18px" overflow="hidden" border={`1px solid ${T}40`} sx={{ aspectRatio: "1 / 1" }}>
                  <Image
                    src={p.foto}
                    alt={p.alt}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    display="block"
                    transition="transform 1s cubic-bezier(0.22,1,0.36,1)"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                {(p.titulo || p.texto) && (
                  <Box textAlign="center" color={T} fontFamily="'EB Garamond', serif">
                    {p.titulo && <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} lineHeight="1.3">{t(p.titulo)}</Text>}
                    {p.texto && <Text mt={1} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.5">{t(p.texto)}</Text>}
                  </Box>
                )}
              </Flex>
            </Reveal>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default WelcomePerspectivas;
