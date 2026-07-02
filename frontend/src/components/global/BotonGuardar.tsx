import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

/* ──────────────────────────────────────────────────────────────────────────
 * BotonGuardar — botón de «Guardar» REUTILIZABLE con feedback de estado.
 *
 *   idle      →  «Guardar»
 *   guardando →  spinner girando dentro del botón (bloqueado, no re-pulsable)
 *   ok        →  «Guardado ✓»  (vuelve a idle solo tras unos segundos)
 *   error     →  «Reintentar»  (si onSave lanza o devuelve false)
 *
 * `onSave` debe devolver true (o void) si el guardado en BD fue bien, o false
 * (o lanzar) si falló. El botón se tematiza con bg/fg.
 * ────────────────────────────────────────────────────────────────────────── */

type Estado = "idle" | "guardando" | "ok" | "error";

interface BotonGuardarProps {
  onSave: () => Promise<boolean | void> | boolean | void;
  /** Color de relleno del botón. */
  bg: string;
  /** Color del texto y del spinner (debe contrastar con bg). */
  fg: string;
  label?: string;
  labelGuardando?: string;
  labelOk?: string;
  labelError?: string;
  /** ms que se muestra «Guardado ✓» antes de volver a «Guardar». */
  okDuracion?: number;
  minW?: any;
  px?: any;
  py?: any;
  fontSize?: any;
  disabled?: boolean;
}

export function BotonGuardar({
  onSave,
  bg,
  fg,
  label = "Guardar",
  labelGuardando = "Guardando…",
  labelOk = "Guardado",
  labelError = "Reintentar",
  okDuracion = 2400,
  minW = "160px",
  px = 9,
  py = 3,
  fontSize = { base: "md", md: "lg" },
  disabled = false,
}: BotonGuardarProps) {
  const [estado, setEstado] = useState<Estado>("idle");
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);

  useEffect(() => {
    return () => {
      montado.current = false;
      if (okTimer.current) clearTimeout(okTimer.current);
    };
  }, []);

  const handleClick = async () => {
    if (estado === "guardando" || disabled) return;
    if (okTimer.current) { clearTimeout(okTimer.current); okTimer.current = null; }
    setEstado("guardando");
    try {
      const res = await onSave();
      if (!montado.current) return;
      if (res === false) {
        setEstado("error");
      } else {
        setEstado("ok");
        okTimer.current = setTimeout(() => {
          if (montado.current) setEstado("idle");
        }, okDuracion);
      }
    } catch {
      if (montado.current) setEstado("error");
    }
  };

  const bloqueado = estado === "guardando" || disabled;

  return (
    <Box
      as="button"
      onClick={bloqueado ? undefined : handleClick}
      disabled={bloqueado}
      position="relative"
      overflow="hidden"
      minW={minW}
      px={px}
      py={py}
      borderRadius="full"
      bg={estado === "error" ? "#8a2b2b" : bg}
      border={`1.5px solid ${estado === "error" ? "#8a2b2b" : bg}`}
      fontFamily="'EB Garamond', serif"
      fontWeight="700"
      fontSize={fontSize}
      letterSpacing="0.05em"
      whiteSpace="nowrap"
      textAlign="center"
      cursor={bloqueado ? "wait" : "pointer"}
      opacity={disabled ? 0.6 : 1}
      boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${bg}3a`}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={bloqueado ? {} : { transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${bg}5a` }}
    >
      <Flex position="relative" zIndex={1} align="center" justify="center" gap={2}
            color={fg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
        {estado === "guardando" && (
          <Box
            w="16px"
            h="16px"
            borderRadius="full"
            border={`2px solid ${fg}44`}
            borderTopColor={fg}
            flexShrink={0}
            sx={{
              animation: "botonGuardarSpin 0.7s linear infinite",
              "@keyframes botonGuardarSpin": { to: { transform: "rotate(360deg)" } },
            }}
          />
        )}
        {estado === "guardando"
          ? labelGuardando
          : estado === "ok"
            ? `${labelOk} ✓`
            : estado === "error"
              ? labelError
              : label}
      </Flex>
    </Box>
  );
}

export default BotonGuardar;
