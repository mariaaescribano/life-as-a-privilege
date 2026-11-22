import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { MandalaTinte } from "../global/MandalaTinte";
import { FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";

/**
 * Separación entre secciones de la portada: raya fina a cada lado y el mandala
 * (la flor) en medio, la misma de Quién soy.
 *
 * El aire de ARRIBA y el de ABAJO es el mismo (`py` simétrico): la flor tiene
 * que quedar justo en el centro del hueco entre las dos secciones. Por eso las
 * secciones de alrededor NO ponen su propio padding junto a este separador: todo
 * el hueco lo pone él, en un solo sitio.
 */
const SeparadorFlor = ({ icono = "/img/icono/life.webp" }: { icono?: string }) => (
  <Reveal inView amount={0.5} direction="none" scaleFrom={0.7} duration={0.9} w="100%">
    <Flex
      align="center"
      justify="center"
      gap={{ base: 4, md: 6 }}
      w="100%"
      py={{ base: 10, md: 14 }}
    >
      {/* Mismo tamaño que la separación de debajo del titular (WelcomeCabecera):
          mandala de 26/34 px y rayas de 60/150 px. */}
      <Box h="1px" w={{ base: "60px", md: "150px" }} bg={`linear-gradient(to right, transparent, ${FONDO_PAGINA_TURQUESA}8C)`} />
      <MandalaTinte h={{ base: "26px", md: "34px" }} src={icono} />
      <Box h="1px" w={{ base: "60px", md: "150px" }} bg={`linear-gradient(to left, transparent, ${FONDO_PAGINA_TURQUESA}8C)`} />
    </Flex>
  </Reveal>
);

export default SeparadorFlor;
