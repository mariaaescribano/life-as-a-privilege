import React from "react";
import { Box, Flex } from "@chakra-ui/react";

/**
 * Botón de la barra de abajo de un programa (volver, anterior, siguiente,
 * escuchar el podcast, ver las diapositivas).
 *
 * Va SIEMPRE en blanco sobre el turquesa, porque vive fuera de las cajas: el
 * color de la disciplina se queda dentro de ellas.
 */
export function BotonBarra({
  texto, onClick, icono, alineado = "left",
}: {
  texto: string;
  onClick: () => void;
  /** Flechita o signo que acompaña al rótulo. */
  icono?: React.ReactNode;
  /** A qué lado del texto va el icono. */
  alineado?: "left" | "right";
}) {
  return (
    <Flex
      as="button"
      onClick={onClick}
      align="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py="10px"
      borderRadius="full"
      border="1px solid rgba(255,255,255,0.5)"
      bg="rgba(255,255,255,0.06)"
      color="white"
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize="xs"
      letterSpacing="0.16em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      transition="all 0.25s ease"
      _hover={{ bg: "rgba(255,255,255,0.16)", borderColor: "rgba(255,255,255,0.85)" }}
    >
      {alineado === "left" && icono && <Box as="span" display="flex">{icono}</Box>}
      {texto}
      {alineado === "right" && icono && <Box as="span" display="flex">{icono}</Box>}
    </Flex>
  );
}

export default BotonBarra;
