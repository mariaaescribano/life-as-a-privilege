import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { AstrologiaLoader } from "./comicLoaders";
import { FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

/**
 * PANTALLA DE ESPERA DE ASTROLOGÍA, para cuando hay que aguardar de verdad (el servidor despertando): el octagrama de
 * siempre y, debajo, el mensaje. Nada más. Turquesa oscuro sobre el beige.
 */
export function EsperaAstro({ mensaje }: { mensaje: string }) {
  return (
    <Flex minH="100vh" direction="column" align="center" justify="center" bg={FONDO_PAGINA_BEIGE} px={6} gap={{ base: 6, md: 8 }}
          fontFamily="'EB Garamond', serif">
      <AstrologiaLoader color={T} />
      <Text color={T} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.6" textAlign="center" maxW="560px">{mensaje}</Text>
    </Flex>
  );
}
