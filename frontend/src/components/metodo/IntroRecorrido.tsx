// ─────────────────────────────────────────────────────────────────────────
// IntroRecorrido · la frase de introducción bajo el header (sobre el turquesa),
// común a todas las páginas del recorrido de psicología. Mismo tamaño y mismo
// ancho en todas, para que se vean homogéneas.
//
// SIN sombra de texto, NUNCA: el texto que va debajo del header cae sobre el
// turquesa limpio y cualquier sombra se ve como una mancha sucia detrás de la
// letra. La sombra es para el texto que va sobre una foto, no para este.
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
    >
      {children}
    </Text>
  );
}
