// ─────────────────────────────────────────────────────────────────────────
// AvatarPersona · el círculo de un familiar (mapa, popups y tarjetas de «Tu
// familia» y «Genograma»). Los familiares NO llevan foto: no se guardan fotos
// de terceros. En su lugar, su inicial sobre un degradado cálido de papel y
// tinta, que se ve cuidado igual con una persona que con doce.
// Un solo componente para todas las páginas: si cambia el aspecto, cambia en
// todas.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { neuropsicologiaTxt } from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;

export function AvatarPersona({
  nombre, size, fontSize, borde = `1.5px solid ${TINTA}88`, sombra = `0 3px 12px ${TINTA}33`,
}: {
  /** Lo que se lee de la persona (su nombre o, si no, su parentesco). */
  nombre: string;
  size: string | { base: string; md: string };
  fontSize?: string | { base: string; md: string };
  borde?: string;
  sombra?: string;
}) {
  const inicial = (nombre.trim()[0] || "?").toUpperCase();
  return (
    <Flex w={size} h={size} flexShrink={0} align="center" justify="center"
          borderRadius="full" overflow="hidden" border={borde} boxShadow={sombra}
          bgGradient={`radial(circle at 30% 25%, #fffbf3, #f1e3cb 70%, #e6d2b2)`}
          aria-hidden>
      <Text color={`${TINTA}cc`} fontSize={fontSize ?? { base: "2xl", md: "3xl" }} fontWeight="700"
            lineHeight="1" fontFamily="'EB Garamond', serif">
        {inicial}
      </Text>
    </Flex>
  );
}
