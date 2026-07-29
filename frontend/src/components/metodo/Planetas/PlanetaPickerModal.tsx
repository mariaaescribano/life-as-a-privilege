import React from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { CASAS, CUERPOS, ZODIAC_SIGNS, type CuerpoKey } from "../astrologiaData";
import { Glifo, GlifoSigno } from "../Glifo";
import { SpaceBg } from "../SpaceBg";
import { valorOf, type CartaData } from "./useCartaPlanetas";
void React;

export interface PickerState {
  key: CuerpoKey;
  campo: "signo" | "casa";
}

interface PlanetaPickerModalProps {
  picker: PickerState | null;
  carta: CartaData;
  onClose: () => void;
  onSelect: (campo: "signo" | "casa", valor: string | number) => void;
}

export function PlanetaPickerModal({ picker, carta, onClose, onSelect }: PlanetaPickerModalProps) {
  if (!picker) return null;

  const cuerpo = CUERPOS.find((c) => c.key === picker.key);
  if (!cuerpo) return null;
  const color = cuerpo.color;
  const esSigno = picker.campo === "signo";

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1100}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      onClick={onClose}
    >
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.78)" />

      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        w="100%"
        maxW="520px"
        maxH="88vh"
        display="flex"
        flexDirection="column"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}22, 0 12px 60px rgba(0,0,0,0.6)`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <SpaceBg overlay="rgba(8,13,30,0.7)" />

        <Box position="absolute" top={3} right={3} zIndex={2}>
          <Box
            as="button"
            onClick={onClose}
            w="32px"
            h="32px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(0,0,0,0.5)"
            border={`1px solid ${color}55`}
            color={`${color}aa`}
            cursor="pointer"
            transition="all 0.15s"
            _hover={{ color, borderColor: color, bg: "rgba(0,0,0,0.7)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </Box>
        </Box>

        <Box position="relative" zIndex={1} px={6} py={7} display="flex" flexDirection="column" gap={4} overflowY="auto">
          <Flex align="center" gap={3}>
            <Box
              w="48px"
              h="48px"
              borderRadius="full"
              bg={`${color}1f`}
              border={`1px solid ${color}66`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              boxShadow={`0 0 18px ${color}44`}
            >
              <Glifo symbol={cuerpo.symbol} color={color} size={28} />
            </Box>
            <Text
              color={color}
              fontSize="xl"
              fontWeight="700"
              letterSpacing="0.05em"
              style={{ textShadow: `0 0 10px ${color}88` }}
            >
              {cuerpo.label} — {esSigno ? "elige Signo" : "elige Casa"}
            </Text>
          </Flex>

          <Box h="1px" bgGradient={`linear(to-r, ${color}66, transparent)`} />

          {esSigno && (
            <Box maxH="56vh" overflowY="auto" px={1}>
              {ZODIAC_SIGNS.map((s) => {
                const elegido = valorOf(carta, picker.key).signo === s.name;
                return (
                  <Flex
                    key={s.name}
                    as="button"
                    align="center"
                    gap={3}
                    w="100%"
                    px={3}
                    py={2.5}
                    borderRadius="lg"
                    cursor="pointer"
                    transition="all 0.14s"
                    bg={elegido ? `${color}1c` : "transparent"}
                    border={`1px solid ${elegido ? color + "66" : "transparent"}`}
                    _hover={{ bg: `${color}14`, borderColor: `${color}44` }}
                    onClick={() => {
                      onSelect("signo", s.name);
                      onClose();
                    }}
                  >
                    <Box
                      w="38px"
                      h="38px"
                      borderRadius="full"
                      bg={`${color}12`}
                      border={`1px solid ${color}44`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color={color}
                      flexShrink={0}
                      boxShadow={`0 0 10px ${color}33`}
                    >
                      <GlifoSigno nombre={s.name} color={color} size={20} />
                    </Box>
                    <Text color={color} fontSize="lg" fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                      {s.name}
                    </Text>
                  </Flex>
                );
              })}
            </Box>
          )}

          {!esSigno && (
            <Grid templateColumns="repeat(4, 1fr)" gap={2.5}>
              {CASAS.map((n) => {
                const elegida = valorOf(carta, picker.key).casa === n;
                return (
                  <Box
                    key={n}
                    as="button"
                    py={4}
                    borderRadius="lg"
                    cursor="pointer"
                    transition="all 0.14s"
                    bg={elegida ? `${color}1f` : "rgba(8,13,30,0.55)"}
                    border={`1px solid ${elegida ? color : color + "44"}`}
                    color={color}
                    fontFamily="'EB Garamond', serif"
                    fontSize="lg"
                    fontWeight="600"
                    onClick={() => {
                      onSelect("casa", n);
                      onClose();
                    }}
                    _hover={{ borderColor: color, bg: `${color}18` }}
                  >
                    {n}
                  </Box>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}
