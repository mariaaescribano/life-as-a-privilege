// ─────────────────────────────────────────────────────────────────────────
// IntroRecorrido · la frase de introducción bajo el header (sobre el turquesa),
// común a todas las páginas del recorrido de psicología. Mismo tamaño y mismo
// ancho en todas, para que se vean homogéneas.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Text } from "@chakra-ui/react";

export function IntroRecorrido({ children }: { children: React.ReactNode }) {
  return (
    <Text
      color="rgba(255,255,255,0.92)"
      fontSize={{ base: "md", md: "lg" }}
      fontStyle="italic"
      textAlign="center"
      lineHeight="1.7"
      maxW="640px"
      mx="auto"
      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}
    >
      {children}
    </Text>
  );
}
