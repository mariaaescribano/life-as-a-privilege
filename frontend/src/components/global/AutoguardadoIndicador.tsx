import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

/* ──────────────────────────────────────────────────────────────────────────
 * AutoguardadoIndicador — indicador discreto del autoguardado.
 *   guardando →  spinner + «Guardando…»
 *   ok        →  «Guardado ✓»
 *   idle      →  nada (mantiene el hueco para que no salte el layout)
 * Se usa en las páginas que guardan solas (debounce), en lugar de un botón.
 * ────────────────────────────────────────────────────────────────────────── */

export type EstadoGuardado = "idle" | "guardando" | "ok";

export function AutoguardadoIndicador({
  estado,
  color,
  minH = "24px",
}: {
  estado: EstadoGuardado;
  color: string;
  minH?: any;
}) {
  return (
    <Flex
      align="center"
      justify="center"
      gap={2}
      minH={minH}
      aria-live="polite"
      opacity={estado === "idle" ? 0 : 1}
      transition="opacity 0.3s ease"
    >
      {estado === "guardando" && (
        <Box
          w="14px"
          h="14px"
          borderRadius="full"
          border={`2px solid ${color}44`}
          borderTopColor={color}
          flexShrink={0}
          sx={{
            animation: "autoguardadoSpin 0.7s linear infinite",
            "@keyframes autoguardadoSpin": { to: { transform: "rotate(360deg)" } },
          }}
        />
      )}
      <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="600" fontStyle="italic" letterSpacing="0.03em">
        {estado === "guardando" ? "Guardando…" : estado === "ok" ? "Guardado ✓" : ""}
      </Text>
    </Flex>
  );
}

export default AutoguardadoIndicador;
