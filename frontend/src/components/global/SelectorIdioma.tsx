import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { IDIOMAS, IDIOMA_ETIQUETA, IDIOMA_NOMBRE, useIdioma } from "../../i18n";

type Props = {
  /** El header privado es más compacto: baja un punto el tamaño. */
  compact?: boolean;
};

/**
 * Selector de idioma ES · EN del header.
 *
 * Va con el mismo lenguaje visual que el resto de la cabecera (EB Garamond,
 * blanco con glow): el idioma activo va opaco, el otro atenuado. Deliberadamente
 * discreto — es una preferencia, no un destino de navegación.
 */
const SelectorIdioma = ({ compact = false }: Props) => {
  const { idioma, cambiarIdioma } = useIdioma();

  return (
    <Flex align="center" gap={compact ? "5px" : "6px"} flexShrink={0}>
      {IDIOMAS.map((codigo, i) => {
        const activo = codigo === idioma;
        return (
          <Flex key={codigo} align="center" gap={compact ? "5px" : "6px"}>
            {i > 0 && (
              <Text
                as="span"
                color="rgba(255,255,255,0.35)"
                fontSize={{ base: "2xs", md: compact ? "xs" : "sm" }}
                userSelect="none"
                aria-hidden
              >
                ·
              </Text>
            )}
            <Text
              as="button"
              type="button"
              onClick={() => cambiarIdioma(codigo)}
              title={IDIOMA_NOMBRE[codigo]}
              aria-label={IDIOMA_NOMBRE[codigo]}
              aria-current={activo ? "true" : undefined}
              color="white"
              opacity={activo ? 1 : 0.5}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "2xs", md: compact ? "sm" : "md" }}
              letterSpacing="0.12em"
              bg="transparent"
              border="none"
              cursor={activo ? "default" : "pointer"}
              textShadow={activo ? "0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)" : "none"}
              _hover={{ opacity: 1, textShadow: "0 0 12px rgba(255,255,255,0.7), 0 0 26px rgba(180,255,245,0.4)" }}
              transition="opacity 0.25s ease, text-shadow 0.25s ease"
            >
              {IDIOMA_ETIQUETA[codigo]}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default SelectorIdioma;
