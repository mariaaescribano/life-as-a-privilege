import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type Cuerpo } from "../astrologiaData";
import { Glifo, GlifoSigno } from "../Glifo";
import { SpaceBg } from "../SpaceBg";
import { esCuerpoCompleto, type Valor } from "./useCartaPlanetas";
void React;

interface ProfundizarBtnProps {
  label: string;
  color: string;
  enabled: boolean;
  onClick: () => void;
  align?: "left" | "right";
}

const ProfundizarBtn = ({ label, color, enabled, onClick, align = "left" }: ProfundizarBtnProps) => (
  <Box
    as="button"
    onClick={enabled ? onClick : undefined}
    disabled={!enabled}
    px={5}
    py={2.5}
    borderRadius="lg"
    bg="transparent"
    border={`1px solid ${enabled ? color + "77" : color + "22"}`}
    color={enabled ? color : `${color}55`}
    fontFamily="'EB Garamond', serif"
    fontSize={{ base: "md", md: "lg" }}
    letterSpacing="0.06em"
    fontStyle="italic"
    cursor={enabled ? "pointer" : "not-allowed"}
    display="flex"
    alignItems="center"
    justifyContent={align === "right" ? "flex-end" : "flex-start"}
    gap={2}
    transition="all 0.2s"
    boxShadow={enabled ? `0 0 10px rgba(255,255,255,0.2), 0 0 22px ${color}33` : "none"}
    textShadow={enabled ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${color}55` : "none"}
    _hover={enabled ? { borderColor: color, boxShadow: `0 0 16px rgba(255,255,255,0.4), 0 0 30px ${color}66`, color } : undefined}
    title={enabled ? undefined : "Elige primero para profundizar"}
  >
    <Text as="span">{label}</Text>
    <Box as="span" display="inline-flex" alignItems="center" style={{ filter: enabled ? `drop-shadow(0 0 6px rgba(255,255,255,0.45))` : "none" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </Box>
  </Box>
);

interface PlanetaBoxProps {
  cuerpo: Cuerpo;
  valor: Valor;
  bloqueado?: boolean;
  destacado?: boolean;
  onAbrirPicker: (campo: "signo" | "casa") => void;
  onProfundizarSigno: () => void;
  onProfundizarCasa: () => void;
  /** Si false no envuelve en su propio Box con SpaceBg/borde (útil para meterlo dentro de otro contenedor) */
  withFrame?: boolean;
}

export function PlanetaBox({
  cuerpo: c,
  valor,
  bloqueado = false,
  destacado = false,
  onAbrirPicker,
  onProfundizarSigno,
  onProfundizarCasa,
  withFrame = true,
}: PlanetaBoxProps) {
  const completo = esCuerpoCompleto(c, valor);

  const borderColor = bloqueado
    ? `${c.color}22`
    : destacado
    ? c.color
    : `${c.color}66`;
  const boxShadow = bloqueado
    ? "none"
    : destacado
    ? `0 0 36px ${c.color}cc, 0 0 80px ${c.color}88, 0 0 140px ${c.color}55`
    : `0 0 22px ${c.color}55, 0 0 60px ${c.color}33`;

  const inner = (
    <Box position="relative" zIndex={1} px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>
      {/* Cabecera */}
      <Flex align="center" gap={3} mb={3}>
        <Box
          w="44px"
          h="44px"
          borderRadius="full"
          bg={`${c.color}1f`}
          border={`1px solid ${c.color}55`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Glifo symbol={c.symbol} color={c.color} size={28} />
        </Box>
        <Text
          color={c.color}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.06em"
          style={{ textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.32), 0 0 56px ${c.color}66` }}
          flex="1"
        >
          {c.label}
        </Text>
        {completo && (
          <Box as="span" color={c.color} fontSize="lg" title="Completado" opacity={0.85}>✓</Box>
        )}
      </Flex>

      <Box h="1px" mb={4} bgGradient={`linear(to-r, ${c.color}66, transparent)`} />

      {/* Selectores */}
      <Flex direction={c.conCasa ? { base: "column", sm: "row" } : "column"} gap={3}>
        <Box flex="1">
          <Text
            color={`${c.color}cc`}
            fontSize="xs"
            letterSpacing="0.16em"
            mb={1.5}
            fontWeight="600"
            style={{ textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 16px ${c.color}55` }}
          >
            SIGNO
          </Text>
          <Box
            as="button"
            onClick={() => onAbrirPicker("signo")}
            w="100%"
            px={4}
            py={2.5}
            borderRadius="lg"
            bg="rgba(8,13,30,0.55)"
            border={`1px solid ${c.color}55`}
            color={valor.signo ? c.color : `${c.color}88`}
            fontFamily="'EB Garamond', serif"
            fontSize="lg"
            letterSpacing="0.04em"
            textAlign="left"
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            transition="all 0.2s"
            boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
            textShadow={valor.signo ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${c.color}55` : "none"}
            _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
          >
            <Flex align="center" gap={2}>
              {valor.signo && (
                <GlifoSigno nombre={valor.signo} size={22} color={c.color} />
              )}
              <Text as="span">{valor.signo || "Elegir…"}</Text>
            </Flex>
            <Text as="span" fontSize="xs" opacity={0.7}>▾</Text>
          </Box>
        </Box>

        {c.conCasa && (
          <Box w={{ base: "100%", sm: "130px" }}>
            <Text
              color={`${c.color}cc`}
              fontSize="xs"
              letterSpacing="0.16em"
              mb={1.5}
              fontWeight="600"
              style={{ textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 16px ${c.color}55` }}
            >
              CASA
            </Text>
            <Box
              as="button"
              onClick={() => onAbrirPicker("casa")}
              w="100%"
              px={4}
              py={2.5}
              borderRadius="lg"
              bg="rgba(8,13,30,0.55)"
              border={`1px solid ${c.color}55`}
              color={valor.casa != null ? c.color : `${c.color}88`}
              fontFamily="'EB Garamond', serif"
              fontSize="lg"
              letterSpacing="0.04em"
              textAlign="left"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              transition="all 0.2s"
              boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
              textShadow={valor.casa != null ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${c.color}55` : "none"}
              _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
            >
              <Text as="span">{valor.casa != null ? `Casa ${valor.casa}` : "—"}</Text>
              <Text as="span" fontSize="xs" opacity={0.7}>▾</Text>
            </Box>
          </Box>
        )}
      </Flex>

      {/* Botones profundizar */}
      <Flex mt={5} gap={3} justify={c.conCasa ? "space-between" : "center"} direction={{ base: "column", sm: "row" }}>
        <ProfundizarBtn
          label={valor.profundizadoSigno ? "Ver Signo ✓" : "Ver Signo"}
          color={c.color}
          enabled={!!valor.signo}
          onClick={onProfundizarSigno}
        />
        {c.conCasa && (
          <ProfundizarBtn
            label={valor.profundizadoCasa ? "Ver Casa ✓" : "Ver Casa"}
            color={c.color}
            enabled={valor.casa != null}
            onClick={onProfundizarCasa}
            align="right"
          />
        )}
      </Flex>
    </Box>
  );

  if (!withFrame) return inner;

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      border={`${destacado ? 2 : 1.5}px solid ${borderColor}`}
      boxShadow={boxShadow}
      opacity={bloqueado ? 0.4 : 1}
      filter={bloqueado ? "grayscale(0.45)" : "none"}
      pointerEvents={bloqueado ? "none" : "auto"}
      transition="all 0.3s ease"
    >
      <SpaceBg overlay="rgba(8,13,30,0.65)" />
      {inner}
    </Box>
  );
}
