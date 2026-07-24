import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

/* ──────────────────────────────────────────────────────────────────────────
 * AutoguardadoIndicador — indicador discreto del autoguardado.
 *   guardando →  spinner + «Guardando…»
 *   ok        →  «Guardado ✓» (se desvanece solo a los ~2,5 s; no tiene sentido
 *                que se quede fijo todo el rato)
 *   idle      →  nada (mantiene el hueco para que no salte el layout)
 * Se usa en las páginas que guardan solas (debounce), en lugar de un botón.
 * ────────────────────────────────────────────────────────────────────────── */

export type EstadoGuardado = "idle" | "guardando" | "ok";

/** Segundos que se mantiene visible el «Guardado ✓» antes de esconderse solo. */
const OK_VISIBLE_MS = 2500;

export function AutoguardadoIndicador({
  estado,
  color,
  minH = "24px",
}: {
  estado: EstadoGuardado;
  color: string;
  minH?: any;
}) {
  // Aunque el padre siga en «ok», ocultamos el mensaje a los pocos segundos.
  const [okVisible, setOkVisible] = useState(false);

  useEffect(() => {
    if (estado === "ok") {
      setOkVisible(true);
      const t = setTimeout(() => setOkVisible(false), OK_VISIBLE_MS);
      return () => clearTimeout(t);
    }
    // Mientras guarda (o en idle) no hay «Guardado ✓» pendiente.
    setOkVisible(false);
  }, [estado]);

  const mostrarOk = estado === "ok" && okVisible;
  const visible = estado === "guardando" || mostrarOk;

  return (
    <Flex
      align="center"
      justify="center"
      gap={2}
      minH={minH}
      aria-live="polite"
      opacity={visible ? 1 : 0}
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
        {estado === "guardando" ? "Guardando…" : mostrarOk ? "Guardado ✓" : ""}
      </Text>
    </Flex>
  );
}

export default AutoguardadoIndicador;
