import React, { useState } from "react";
import { Box, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import BandaFoto from "../global/BandaFoto";
import TituloSeccion from "../global/TituloSeccion";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { FONDO_PAGINA_BEIGE as BEIGE } from "../../GlobalVariables";
import { FOTOS_PLATAFORMA } from "../../data/plataformaFotos";

/**
 * «La plataforma a la que tendrás acceso»: la banda de mármol chocolate (letra beige) con el título entre dos
 * rayas horizontales y, debajo, una foto GRANDE a la izquierda y varias en miniatura ordenadas a la derecha.
 * Al pulsar una miniatura, esa foto pasa a la grande de la izquierda. Las fotos viven en `data/plataformaFotos.ts`.
 */
export function PlataformaGaleria({ titulo }: { titulo: string }) {
  const [sel, setSel] = useState(0);
  if (FOTOS_PLATAFORMA.length === 0) return null;
  const actual = FOTOS_PLATAFORMA[Math.min(sel, FOTOS_PLATAFORMA.length - 1)];

  return (
    <Box mt={{ base: 10, md: 16 }}>
      <BandaFoto foto="/img/fondos/marmol-chocolate.webp" fundido={55} pt={{ base: "56px", md: "80px" }} pb={{ base: "56px", md: "80px" }}>
        <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
          <TituloSeccion color={BEIGE}>{titulo}</TituloSeccion>

          <Flex
            mt={{ base: 8, md: 12 }}
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            gap={{ base: 5, md: 8 }}
          >
            {/* La foto grande: cambia con un fundido al elegir otra */}
            <Reveal inView direction="right" distance={30} duration={1} flex={{ base: "none", md: "1.6" }} minW={0}>
              <Box position="relative">
                <Box position="absolute" inset="-9px" borderRadius="22px" border={`1px solid ${BEIGE}66`} pointerEvents="none" />
                <Box borderRadius="14px" overflow="hidden" border={`1.5px solid ${BEIGE}`}>
                  <Image
                    key={actual.src}
                    src={actual.src}
                    alt={actual.alt}
                    w="100%"
                    h="auto"
                    display="block"
                    sx={{
                      "@keyframes platCambia": { from: { opacity: 0, transform: "scale(1.02)" }, to: { opacity: 1, transform: "none" } },
                      animation: "platCambia 0.45s cubic-bezier(0.22,1,0.36,1) both",
                      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    }}
                  />
                </Box>
              </Box>
            </Reveal>

            {/* Las miniaturas, ordenadas a la derecha */}
            <Reveal inView direction="left" distance={30} duration={1} delay={0.15} flex="1" minW={0}>
              <SimpleGrid columns={{ base: 3, md: 2 }} spacing={{ base: 3, md: 4 }}>
                {FOTOS_PLATAFORMA.map((f, i) => {
                  const on = i === sel;
                  return (
                    <Box
                      key={f.src}
                      as="button"
                      type="button"
                      onClick={() => setSel(i)}
                      aria-pressed={on}
                      aria-label={f.alt}
                      borderRadius="10px"
                      overflow="hidden"
                      border={`${on ? 2 : 1.5}px solid ${on ? BEIGE : `${BEIGE}66`}`}
                      opacity={on ? 1 : 0.8}
                      transition="all 0.25s ease"
                      _hover={{ opacity: 1, transform: "translateY(-2px)" }}
                      _focusVisible={focoBlanco}
                    >
                      <Image src={f.src} alt="" w="100%" display="block" loading="lazy" />
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Reveal>
          </Flex>
        </Box>
      </BandaFoto>
    </Box>
  );
}

export default PlataformaGaleria;
