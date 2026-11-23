import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useCabeceraEscribiendo } from "./cabeceraEntrada";

const aparece = keyframes`from { opacity: 0; } to { opacity: 1; }`;

/**
 * El cuerpo de una página con cabecera (`WelcomeCabecera`). Orden de entrada, siempre el mismo:
 * mandala → titular → frase → y SOLO DESPUÉS todo lo demás. Mientras la cabecera se escribe, este
 * envoltorio no monta nada (ni siquiera las entradas con `Reveal`, que así se ven de verdad al
 * llegar su turno en vez de gastarse detrás de la cabecera); queda su hueco (`flex`) para que el pie
 * no salte. Sin cabecera en la página la señal está apagada y se muestra todo al momento.
 * Las `props` (p. ej. `flex="1"`) van al contenedor.
 */
export const TrasCabecera = ({ children, ...rest }: { children?: React.ReactNode } & BoxProps) => {
  const escribiendo = useCabeceraEscribiendo();
  if (escribiendo) return <Box {...rest} />;
  return <Box {...rest} sx={{ animation: `${aparece} 0.6s ease` }}>{children}</Box>;
};

export default TrasCabecera;
