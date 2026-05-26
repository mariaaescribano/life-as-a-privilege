import React from "react";
import { Box } from "@chakra-ui/react";
void React;

interface SpaceBgProps {
  overlay?: string;
}

/* Fondo espacial con degradado cósmico de respaldo */
export const SpaceBg = ({ overlay = "rgba(8,13,30,0.55)" }: SpaceBgProps) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/astrologia/space.jpg"
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);
