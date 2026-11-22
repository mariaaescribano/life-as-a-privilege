import { Box, Image } from "@chakra-ui/react";
import { FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";
import React from "react";
import type { CSSProperties } from "react";

/** El mandala de la casa pintado de un solo color (por defecto, el turquesa oscuro de `FONDO_PAGINA_TURQUESA`).
 *  La imagen invisible da el tamaño; encima, un bloque de color recortado con la silueta del mandala. */
export const MandalaTinte = ({
  h,
  color = FONDO_PAGINA_TURQUESA,
  src = "/img/icono/life.webp",
  style,
}: {
  h: any;
  color?: string;
  src?: string;
  style?: CSSProperties;
}) => (
  <Box position="relative" display="inline-block" h={h} flexShrink={0} style={style}>
    <Image src={src} alt="" h="100%" objectFit="contain" opacity={0} />
    <Box
      position="absolute"
      inset={0}
      bg={color}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  </Box>
);
