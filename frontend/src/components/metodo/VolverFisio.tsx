import React from "react";
import { Box } from "@chakra-ui/react";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Botón «Volver» de PROFUNDIZA (Fisiología). NO va dentro del header/box: se
// coloca ABAJO DEL TODO, alineado a la DERECHA y fuera del box. Se usa como
// último hijo de la columna de contenido (que va centrada), por eso
// alignSelf="flex-end" lo empuja al borde derecho del ancho de la página.
// ─────────────────────────────────────────────────────────────────────────
export function VolverFisio({ onClick, label = "Volver" }: { onClick: () => void; label?: string }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      alignSelf="flex-end"
      mt={{ base: 3, md: 5 }}
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py={{ base: 2, md: 2.5 }}
      borderRadius="full"
      bg="rgba(255,255,255,0.08)"
      border={`1px solid ${fisiologiaTxt}66`}
      color={fisiologiaTxt}
      fontFamily="'EB Garamond', serif"
      fontStyle="italic"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.04em"
      cursor="pointer"
      transition="all 0.18s"
      _hover={{ bg: "rgba(255,255,255,0.14)", borderColor: fisiologiaTxt, transform: "translateY(-1px)" }}
      style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}
    >
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
        <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
      </Box>
      {label}
    </Box>
  );
}
