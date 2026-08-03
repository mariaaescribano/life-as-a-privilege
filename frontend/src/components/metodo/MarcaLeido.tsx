import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

// El tick (mismo dibujo en la marquita de las tarjetas y en el aviso de los
// popups de lectura: es LA misma marca).
const TICK = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";

// ─────────────────────────────────────────────────────────────────────────
// MarcaLeido — LA marquita de «esto ya lo has leído».
//
// Un sello redondo con un tick, arriba a la derecha de la tarjeta. Es el ÚNICO
// estilo de marca de lectura del recorrido (viñetas, fichas, fotos, cómics):
// si algo se puede leer y queda marcado, se marca con ESTO, para que la marca
// sea siempre la misma en Nutrición, Fisiología y el resto de disciplinas.
//
//   · fondo del círculo  →  `bg`    (el <disc>Bg)
//   · tick y borde       →  `tinta` (el <disc>Txt)
//
// Por defecto va absoluta en la esquina superior derecha, así que la tarjeta
// que la contiene tiene que ser `position="relative"`. Con `inline` se pinta
// en el flujo normal (p.ej. en la fila de arriba de un panel, al lado del
// contador de fichas, o dentro de un botón).
// ─────────────────────────────────────────────────────────────────────────
export function MarcaLeido({
  tinta,
  bg,
  inline = false,
  size = "24px",
  iconSize = "14px",
  title = "Leído",
}: {
  /** Color del tick y del borde (el <disc>Txt). */
  tinta: string;
  /** Color de fondo del círculo (el <disc>Bg). */
  bg: string;
  /** La pinta en el flujo (sin position absolute) en vez de en la esquina. */
  inline?: boolean;
  /** Diámetro del sello. */
  size?: string;
  /** Tamaño del tick de dentro. */
  iconSize?: string;
  /** Texto del tooltip («Leído», «Leída», «Superado»…). */
  title?: string;
}) {
  return (
    <Flex
      title={title}
      align="center"
      justify="center"
      flexShrink={0}
      w={size}
      h={size}
      borderRadius="full"
      bg={bg}
      border={`1px solid ${tinta}`}
      boxShadow={`0 0 10px ${tinta}66, 0 1px 4px rgba(0,0,0,0.5)`}
      position={inline ? "relative" : "absolute"}
      top={inline ? undefined : "9px"}
      right={inline ? undefined : "9px"}
      zIndex={inline ? undefined : 2}
    >
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={iconSize} h={iconSize} fill={tinta}>
        <path d={TICK} />
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// AvisoLeida — la misma marca, pero DENTRO del popup de lectura: un mensajito
// discreto arriba del título, «✓ LEÍDA», que solo sale cuando esa viñeta/ficha
// ya se había leído antes de abrir el popup (si se está leyendo ahora, no dice
// nada). Sin caja ni fondo: tick + palabra, en el color del texto y con su
// misma sombra, para que no compita con la lectura.
// ─────────────────────────────────────────────────────────────────────────
export function AvisoLeida({
  color,
  textShadow,
  texto = "Leída",
}: {
  /** Color del tick y de la palabra (el del texto de lectura). */
  color: string;
  /** Sombra del texto (la misma que el título, para que no cante). */
  textShadow?: string;
  /** «Leída», «Leído»… */
  texto?: string;
}) {
  return (
    <Flex align="center" gap={1.5} mb={{ base: 2.5, md: 3 }}
          justify={{ base: "center", md: "flex-start" }} color={color} opacity={0.78}>
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w="13px" h="13px" fill="currentColor" flexShrink={0}>
        <path d={TICK} />
      </Box>
      <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.16em"
            textTransform="uppercase" lineHeight="1" style={{ textShadow }}>
        {texto}
      </Text>
    </Flex>
  );
}
