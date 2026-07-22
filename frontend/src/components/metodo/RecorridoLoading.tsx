import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../global/SiteHeader";
import SpinnerTurquesa from "../global/Spinner";

/**
 * Pantalla de carga de las páginas del recorrido. A diferencia de un spinner a
 * secas, pinta YA el HEADER (para que cargue antes de desbloquear la página) y,
 * debajo, el spinner centrado. El fondo se mantiene siempre en el turquesa
 * normal (#008080), sin velo oscuro, para que no aparezca un "box turquesa
 * oscuro" mientras carga.
 */
export function RecorridoLoading() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        {/* Fondo turquesa → spinner blanco (siempre). */}
        <SpinnerTurquesa fullScreen={false} color="#ffffff" />
      </Flex>
    </Box>
  );
}

export default RecorridoLoading;
