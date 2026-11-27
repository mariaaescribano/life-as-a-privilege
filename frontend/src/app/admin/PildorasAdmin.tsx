import React from "react";
import { Box } from "@chakra-ui/react";

// Piezas compartidas por las pantallas de Asesorías (la lista y la página de cada
// persona): el mandala turquesa y el botón en píldora.

/** Mandala de la casa en turquesa (el PNG es blanco: se usa de máscara). */
export const MandalaTurquesa = ({ tam, color = "#3B2418" }: { tam: string; color?: string }) => (
  <Box
    flexShrink={0}
    w={tam}
    bg={color}
    sx={{
      aspectRatio: "1 / 1",
      WebkitMaskImage: "url('/img/icono/life.webp')",
      maskImage: "url('/img/icono/life.webp')",
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    }}
  />
);

export const HALO = "none";

export function BotonPildora({ children, onClick, solido, peligro, titulo, ocupado, marmol, desactivado }: {
  children: React.ReactNode;
  onClick: () => void;
  /** Relleno turquesa oscuro (el botón principal de la fila). */
  solido?: boolean;
  /** Acción sin vuelta atrás (eliminar): borde y letra rojos, sin relleno. */
  peligro?: boolean;
  titulo?: string;
  ocupado?: boolean;
  /** No se puede pulsar (apagado y sin acción). */
  desactivado?: boolean;
  /** Para ir sobre una caja de mármol: turquesa oscuro (relleno si es `solido`, contorno si no). */
  marmol?: boolean;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={ocupado || desactivado ? undefined : onClick}
      disabled={desactivado}
      aria-disabled={desactivado || undefined}
      title={titulo}
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py="8px"
      borderRadius="full"
      border={marmol ? "1.5px solid #004f4f" : peligro ? "1.5px solid #b3261e" : "1.5px solid #3B2418"}
      bg={marmol ? (solido ? "#004f4f" : "rgba(255,255,255,0.45)") : solido ? "#3B2418" : "transparent"}
      color={marmol ? (solido ? "#F0DCC0" : "#004f4f") : solido ? "#F0DCC0" : peligro ? "#b3261e" : "#3B2418"}
      fontWeight="700"
      fontSize="sm"
      letterSpacing="0.04em"
      whiteSpace="nowrap"
      cursor={desactivado ? "not-allowed" : ocupado ? "wait" : "pointer"}
      opacity={desactivado ? 0.4 : ocupado ? 0.6 : 1}
      transition="all 0.2s ease"
      _hover={desactivado ? {} : marmol ? { transform: "translateY(-1px)", boxShadow: "0 0 18px #004f4f55" } : { transform: "translateY(-1px)", bg: solido ? "#004a4a" : peligro ? "#b3261e14" : "#3B241814" }}
      _focusVisible={{ outline: marmol ? "2px solid #004f4f" : "2px solid #3B2418cc", outlineOffset: "2px" }}
    >
      {children}
    </Box>
  );
}
