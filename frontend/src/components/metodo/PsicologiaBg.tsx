import React from "react";
import { Box } from "@chakra-ui/react";
void React;

interface PsicologiaBgProps {
  /** Velo cálido encima de la acuarela, para unificar y asentar el texto. */
  overlay?: string;
}

/**
 * Fondo cálido de Psicología — acuarela tipo pergamino. Es el contrapunto del
 * SpaceBg cósmico de Astrología: en vez de cosmos oscuro + texto claro, aquí
 * papel cálido + tinta marrón. Íntimo, como escribir en un cuaderno.
 *
 * Úsalo como hijo absoluto dentro de un contenedor con position:relative +
 * overflow:hidden, y eleva el contenido con position:relative + zIndex≥1.
 */
export const PsicologiaBg = ({ overlay = "rgba(247,236,220,0.32)" }: PsicologiaBgProps) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #f0e0c8 0%, #e6cca6 45%, #cda878 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/fondos/psciologia.png"
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.95 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);
