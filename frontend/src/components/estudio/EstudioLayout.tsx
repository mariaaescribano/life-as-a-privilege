import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../global/SiteHeader";
import SiteFooter from "../global/Footer";

/**
 * Envoltorio común de las páginas del Estudio.
 *
 * Fondo turquesa de la casa, cabecera («auto»: quien tenga sesión la ve como
 * privada, quien no, como pública) y footer SIEMPRE abajo del todo: minH 100vh
 * + columna + contenido con flex 1, para que en las páginas cortas el footer no
 * suba a media pantalla.
 */
export function EstudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Flex
        flex="1"
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 12, md: 16 }}
      >
        {children}
      </Flex>

      <SiteFooter />
    </Box>
  );
}
