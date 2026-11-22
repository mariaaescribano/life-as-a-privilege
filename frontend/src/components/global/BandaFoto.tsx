import React from "react";
import { Box } from "@chakra-ui/react";

/**
 * Una banda a todo el ancho con una FOTO de fondo (el mármol de las bandas de la portada), con los bordes de
 * arriba y abajo desvanecidos hasta el beige de la página. El contenido va por encima y la banda tiene el
 * relleno justo para que no toque los fundidos. La foto se cambia en un solo sitio: `/img/fondos/marmol-bandas.webp`.
 */
const FOTO = "/img/fondos/marmol-bandas.webp";

const BandaFoto = ({
  children,
  pt = { base: "56px", md: "72px" },
  pb = { base: "56px", md: "72px" },
}: {
  children: React.ReactNode;
  pt?: { base: string; md: string };
  pb?: { base: string; md: string };
}) => (
  <Box position="relative" pt={pt} pb={pb}>
    <Box
      position="absolute"
      inset={0}
      pointerEvents="none"
      aria-hidden="true"
      bgImage={`url('${FOTO}')`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      sx={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
      }}
    />
    <Box position="relative" zIndex={1}>{children}</Box>
  </Box>
);

export default BandaFoto;
