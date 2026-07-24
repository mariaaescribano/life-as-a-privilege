import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../global/SiteHeader";
import { AstrologiaLoader } from "./comicLoaders";

/**
 * Pantalla de carga de las páginas del recorrido (solo Astrología). Pinta YA el
 * HEADER (para que cargue antes de desbloquear la página) y, centrada en la
 * pantalla, la animación de la ESTRELLA en blanco (en vez del spinner). El fondo
 * se mantiene siempre en el turquesa normal (#008080), sin velo oscuro, para que
 * no aparezca un "box turquesa oscuro" mientras carga.
 */
export function RecorridoLoading() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        {/* Fondo turquesa → estrella blanca dibujándose y titilando. */}
        <AstrologiaLoader color="#ffffff" />
      </Flex>
    </Box>
  );
}

export default RecorridoLoading;
