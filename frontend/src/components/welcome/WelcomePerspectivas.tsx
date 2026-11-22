import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import SeparadorFlor from "./SeparadorFlor";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Segundo apartado de la portada: separación con el mandala (turquesa oscuro), el titular
 * «Lo importante eres tú, las perspectivas se adaptan a ti.» y cuatro fotos en cuadrícula
 * (cuatro en una fila en escritorio, 2 × 2 en móvil). Cada foto entra al llegar a ella, con un fundido
 * que sube y se enfoca; al pasar el ratón la foto hace zoom.
 *
 * Cada foto tiene hueco para su texto DEBAJO (`titulo` y `texto`); mientras no haya texto,
 * no se pinta nada.
 */
type Perspectiva = { foto: string; alt: string; titulo?: string; texto?: string };

const PERSPECTIVAS: Perspectiva[] = [
  { foto: "/img/welcome/perspectiva-mente.webp", alt: "" },
  { foto: "/img/welcome/perspectiva-filosofia.webp", alt: "" },
  { foto: "/img/welcome/perspectiva-astrologia.webp", alt: "" },
  { foto: "/img/welcome/perspectiva-acompanar.webp", alt: "" },
];

const WelcomePerspectivas = () => {
  const t = useT();
  return (
    <Box w="100%">
      <SeparadorFlor />

      <Flex direction="column" align="center" px={{ base: 6, md: 10, lg: 16 }} pb={{ base: 16, md: 24 }} maxW="1100px" mx="auto" gap={{ base: 6, md: 8 }}>
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

        <Box w="100%" maxW={{ base: "320px", md: "820px" }} display="grid" gridTemplateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={{ base: 4, md: 5 }}>
          {PERSPECTIVAS.map((p, i) => (
            <Reveal key={p.foto} inView direction="up" distance={34} scaleFrom={0.96} blur duration={1.1} delay={(i % 2) * 0.15}>
              <Flex direction="column" gap={4} role="group">
                <Box borderRadius="14px" overflow="hidden" border={`1px solid ${T}40`} sx={{ aspectRatio: "1 / 1" }}>
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
                    {p.titulo && <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }} lineHeight="1.3">{p.titulo}</Text>}
                    {p.texto && <Text mt={1} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.5">{p.texto}</Text>}
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
