import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { IDIOMAS, IDIOMA_ETIQUETA, IDIOMA_NOMBRE, useIdioma } from "../../i18n";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

type Props = {
  /** El header privado es más compacto: baja un punto el tamaño. */
  compact?: boolean;
  /**
   * Sobre qué fondo se pinta. "oscuro" (por defecto) = el turquesa de toda la
   * web: letra blanca con glow. "claro" = la landing de bienvenida (arena):
   * letra tinta y sin glow, que sobre crema el brillo blanco no se ve y el
   * selector desaparecía.
   */
  fondo?: "oscuro" | "claro";
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
  // Tinta cálida en la landing; blanco en el resto de la web.
  // Sobre el beige de la web: turquesa oscuro, sin brillos.
  const colorLetra = T;
  const colorPunto = `${T}66`;
  const glowActivo = "none";
  const glowHover = "none";

  return (
    <Flex align="center" gap={compact ? "5px" : "6px"} flexShrink={0}>
      {IDIOMAS.map((codigo, i) => {
        const activo = codigo === idioma;
        return (
          <Flex key={codigo} align="center" gap={compact ? "5px" : "6px"}>
            {i > 0 && (
              <Text
                as="span"
                color={colorPunto}
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
              color={colorLetra}
              opacity={activo ? 1 : 0.5}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "2xs", md: compact ? "sm" : "md" }}
              letterSpacing="0.12em"
              bg="transparent"
              border="none"
              cursor={activo ? "default" : "pointer"}
              textShadow={activo ? glowActivo : "none"}
              _hover={{ opacity: 1, textShadow: glowHover }}
              // El foco de teclado: el aro de la casa (blanco sobre turquesa,
              // tinta sobre la landing clara). Sin él, el tabulador pasaba por
              // aquí sin que se viera nada.
              borderRadius="sm"
              _focusVisible={{ opacity: 1, outline: `2px solid ${T}99`, outlineOffset: "2px" }}
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
