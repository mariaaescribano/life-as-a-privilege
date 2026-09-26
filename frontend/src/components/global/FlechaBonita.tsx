import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

/**
 * La flecha de la casa: un trazo fino y largo con la punta abierta, dibujado
 * con línea (no relleno) y extremos redondeados. Sustituye al chevron «‹ ›»
 * del header y a la flecha maciza de Material de los botones de los cómics.
 * Toma el color del texto (currentColor).
 */
export function FlechaBonita({
  dir = "next",
  size = "22px",
  grosor = 1.7,
  ...rest
}: { dir?: "prev" | "next"; size?: BoxProps["w"]; grosor?: number } & Omit<BoxProps, "dir">) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 14"
      w={size}
      h="auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      flexShrink={0}
      aria-hidden="true"
      style={{ transform: dir === "prev" ? "scaleX(-1)" : undefined, overflow: "visible" }}
      {...rest}
    >
      <path d="M1.5 7H25.5" />
      <path d="M19.8 1.6L25.6 7L19.8 12.4" />
    </Box>
  );
}
