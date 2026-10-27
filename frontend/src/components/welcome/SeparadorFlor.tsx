import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";

/**
 * Separación entre secciones de la portada: raya fina a cada lado y el mandala
 * (la flor) en medio, la misma de Quién soy.
 *
 * El aire de ARRIBA y el de ABAJO es el mismo (`py` simétrico): la flor tiene
 * que quedar justo en el centro del hueco entre las dos secciones. Por eso las
 * secciones de alrededor NO ponen su propio padding junto a este separador: todo
 * el hueco lo pone él, en un solo sitio.
 */
const SeparadorFlor = () => (
  <Reveal inView amount={0.5} direction="none" scaleFrom={0.7} duration={0.9} w="100%">
    <Flex
      align="center"
      justify="center"
      gap={{ base: 3, md: 4 }}
      w="100%"
      maxW="520px"
      mx="auto"
      px={{ base: 5, md: 0 }}
      py={{ base: 10, md: 14 }}
    >
      <Box flex="1" h="1px" bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))" boxShadow="0 0 6px rgba(255,255,255,0.24)" />
      <Image
        src="/img/icono/life.webp"
        alt=""
        h={{ base: "34px", md: "44px" }}
        objectFit="contain"
        flexShrink={0}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.42)) drop-shadow(0 0 22px rgba(255,255,255,0.24))" }}
      />
      <Box flex="1" h="1px" bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))" boxShadow="0 0 6px rgba(255,255,255,0.24)" />
    </Flex>
  </Reveal>
);

export default SeparadorFlor;
