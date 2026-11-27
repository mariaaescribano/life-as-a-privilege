import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Reveal } from "./Reveal";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

/**
 * Título de sección con una raya horizontal fina a cada lado: ———  CIENCIA  ———.
 * Las rayas se difuminan hacia fuera (como las del mandala separador) y todo entra con `Reveal` al llegar a él.
 */
export function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
    <Reveal inView direction="up" distance={16} duration={0.9} w="100%">
      <Flex align="center" justify="center" gap={{ base: 4, md: 8 }} w="100%">
        <Box flex="1" h="1px" maxW="320px" bg={`linear-gradient(to right, ${T}00, ${T}99)`} />
        <Text
          color={T}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "lg", md: "2xl" }}
          letterSpacing="0.28em"
          textTransform="uppercase"
          textAlign="center"
          // El espaciado entre letras deja un hueco extra tras la última: se compensa para que quede centrado.
          pl="0.28em"
        >
          {children}
        </Text>
        <Box flex="1" h="1px" maxW="320px" bg={`linear-gradient(to left, ${T}00, ${T}99)`} />
      </Flex>
    </Reveal>
  );
}

export default TituloSeccion;
