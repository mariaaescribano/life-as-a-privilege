import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../global/SiteHeader";
import SpinnerTurquesa from "../global/Spinner";

/**
 * Pantalla de carga de las páginas del recorrido. A diferencia de un spinner a
 * secas, pinta YA el HEADER (para que cargue antes de desbloquear la página) y,
 * debajo, el spinner sobre un velo difuminado (fondo en blur). Así, al terminar
 * de cargar, el header ya está listo y no “salta”.
 */
export function RecorridoLoading() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        {/* Velo difuminado del fondo mientras carga. */}
        <Box
          position="absolute"
          inset="0"
          bg="rgba(0,32,32,0.22)"
          sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        />
        <Box position="relative" zIndex={1}>
          <SpinnerTurquesa fullScreen={false} />
        </Box>
      </Flex>
    </Box>
  );
}

export default RecorridoLoading;
