import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "./SiteHeader";
import { LifeLoader } from "../metodo/comicLoaders";

/**
 * Pantalla de carga "de la casa" para las páginas públicas de conversión
 * (Inicio y El Mapa). Pinta YA el header (para que la barra esté lista cuando
 * se revele la página) y, centrado sobre el turquesa habitual (#008080, sin
 * velo oscuro), el mandala/loto del logo animándose (LifeLoader). Se muestra
 * mientras se precargan las fotos; al terminar, la página entra con animación.
 */
export function LifeLoading({
  variant = "auto",
}: {
  variant?: "public" | "private" | "auto";
}) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant={variant} />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        <Box transform={{ base: "scale(1.4)", md: "scale(1.9)" }}>
          <LifeLoader color="#ffffff" />
        </Box>
      </Flex>
    </Box>
  );
}

export default LifeLoading;
