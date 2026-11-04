import React from "react";
import { Box } from "@chakra-ui/react";
import { focoBlanco } from "../../components/global/foco";

// Piezas compartidas por las pantallas de Asesorías (la lista y la página de cada
// persona): el mandala turquesa y el botón en píldora.

/** Mandala de la casa en turquesa (el PNG es blanco: se usa de máscara). */
export const MandalaTurquesa = ({ tam }: { tam: string }) => (
  <Box
    flexShrink={0}
    w={tam}
    bg="#008080"
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

export const HALO = "0 0 22px rgba(255,255,255,0.3)";

export function BotonPildora({ children, onClick, solido, peligro, titulo, ocupado }: {
  children: React.ReactNode;
  onClick: () => void;
  /** Relleno blanco (el botón principal de la fila). */
  solido?: boolean;
  /** Acción sin vuelta atrás (eliminar): borde y letra rosados, sin relleno. */
  peligro?: boolean;
  titulo?: string;
  ocupado?: boolean;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={ocupado ? undefined : onClick}
      title={titulo}
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py="8px"
      borderRadius="full"
      border={peligro ? "1.5px solid rgba(255,200,200,0.8)" : "1.5px solid rgba(255,255,255,0.75)"}
      bg={solido ? "white" : peligro ? "rgba(255,160,160,0.1)" : "rgba(255,255,255,0.14)"}
      color={solido ? "#008080" : peligro ? "#ffd6d6" : "white"}
      fontWeight="700"
      fontSize="sm"
      letterSpacing="0.04em"
      whiteSpace="nowrap"
      cursor={ocupado ? "wait" : "pointer"}
      opacity={ocupado ? 0.6 : 1}
      boxShadow={HALO}
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-1px)", bg: solido ? "#e8fffc" : "rgba(255,255,255,0.26)" }}
      _focusVisible={focoBlanco}
    >
      {children}
    </Box>
  );
}
