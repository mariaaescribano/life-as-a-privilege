// ─────────────────────────────────────────────────────────────────────────
// HeridaGrid · rejilla de heridas (boxes cuadrados) + separador de mandala.
//
// Se usa igual en dos páginas: al construir las heridas (página «Heridas») y en
// el listado («Tus heridas»). Cada herida es un box CUADRADO, de un color
// distinto, con el icono a la izquierda, el título con una raya horizontal y
// debajo las piezas seleccionadas (huellas ◈, nudos espiral, necesidades ◇).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { RevealStagger, RevealItem } from "../global/Reveal";
import { NudoEspiralIcon } from "./NudoEspiralIcon";
import { HeridaIcon } from "./HeridaIcon";
import { neuropsicologiaTxt } from "../../GlobalVariables";
import type { RelacionHuellaNudo } from "./psicologiaRecorrido";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";

// Paleta pastel: cada herida toma un color por su posición (colores contiguos
// siempre distintos).
export const PALETA_HERIDA = [
  "#e7c4ad", "#cfe0d2", "#d9cde8", "#e8dcb0",
  "#bfd6e6", "#ecc7cf", "#cdd9b8", "#e3cdbf",
];
export const colorHeridaIdx = (i: number): string => PALETA_HERIDA[((i % PALETA_HERIDA.length) + PALETA_HERIDA.length) % PALETA_HERIDA.length];

// Glifos de pieza (mismos que en la construcción).
export const HuellaGlyph = ({ size = 15 }: { size?: number }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color: TINTA }}>◈</Box>
);
export const NecesidadGlyph = ({ size = 15 }: { size?: number }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color: TINTA }}>◇</Box>
);

/** Separador elegante con el mandala de la vida en el centro. */
export function MandalaDivider() {
  return (
    <Flex align="center" w="100%" maxW="720px" mx="auto" gap={{ base: 4, md: 6 }} py={{ base: 1, md: 2 }}>
      <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${PAPEL}55)`} />
      <Image src="/img/icono/life.png" alt="" w={{ base: "40px", md: "52px" }} h={{ base: "40px", md: "52px" }}
             objectFit="contain" opacity={0.9} flexShrink={0}
             style={{ filter: "drop-shadow(0 0 10px rgba(255,251,243,0.45))" }} />
      <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${PAPEL}55)`} />
    </Flex>
  );
}

/** Pieza dentro de una herida (chip de solo lectura). */
function Pieza({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Flex align="center" gap={2} px={3} py={1.5} borderRadius="full"
          bg={`${PAPEL}d9`} color={TINTA} border={`1px solid ${TINTA}30`}>
      {icon}
      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600" lineHeight="1.25" noOfLines={1}>{label}</Text>
    </Flex>
  );
}

/** Un box CUADRADO de herida: icono a la izquierda, color propio, título con
 *  raya horizontal y debajo las piezas. `onBorrar` opcional (muestra la ✕). */
export function HeridaCard({ herida, color, onBorrar }: {
  herida: RelacionHuellaNudo;
  color: string;
  onBorrar?: () => void;
}) {
  const necesidades = herida.necesidades || [];
  const vacia = herida.huellas.length === 0 && herida.nudos.length === 0 && necesidades.length === 0;
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden"
         sx={{ aspectRatio: "1 / 1" }}
         boxShadow={`0 10px 30px rgba(40,18,4,0.18), 0 2px 8px rgba(40,18,4,0.12)`}
         border={`1px solid ${TINTA}26`}>
      {/* Lavado de color propio de la herida */}
      <Box position="absolute" inset={0} bgGradient={`linear(155deg, ${PAPEL}, ${color})`} />
      <Box position="absolute" inset={0} boxShadow={`inset 0 0 0 1px ${PAPEL}55`} pointerEvents="none" />

      <Flex position="relative" zIndex={1} direction="column" h="100%" px={{ base: 4, md: 5 }} py={{ base: 4, md: 4 }}>
        {/* Cabecera: icono a la izquierda + título + borrar */}
        <Flex align="center" gap={2.5}>
          <Flex flexShrink={0} align="center" justify="center" w={{ base: "30px", md: "36px" }} h={{ base: "30px", md: "36px" }}
                borderRadius="full" bg={`${PAPEL}d9`} border={`1px solid ${TINTA}40`}
                boxShadow={`0 1px 4px rgba(40,18,4,0.15)`}>
            <HeridaIcon size={18} color={TINTA} />
          </Flex>
          <Text flex="1" minW={0} color={TINTA} fontWeight="700" lineHeight="1.2"
                fontSize={{ base: "md", md: "lg" }} noOfLines={2} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
            {herida.titulo || "Herida sin título"}
          </Text>
          {onBorrar && (
            <Box as="button" onClick={onBorrar} flexShrink={0} w="22px" h="22px" borderRadius="full"
                 bg={`${TINTA}14`} color={TINTA} display="flex" alignItems="center" justifyContent="center"
                 fontSize="11px" cursor="pointer" _hover={{ bg: `${TINTA}26` }} title="Borrar herida">✕</Box>
          )}
        </Flex>

        {/* Raya horizontal bajo el título */}
        <Box h="1px" w="100%" my={{ base: 2.5, md: 3 }} bg={`${TINTA}40`} flexShrink={0} />

        {/* Piezas seleccionadas */}
        <Box flex="1" minH={0} overflowY="auto"
             sx={{ scrollbarWidth: "thin", scrollbarColor: `${TINTA}55 transparent`,
                   "&::-webkit-scrollbar": { width: "6px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          {vacia ? (
            <Flex align="center" justify="center" h="100%">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize={{ base: "sm", md: "md" }}>Sin piezas.</Text>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {herida.huellas.map((t) => <Pieza key={`h-${t}`} icon={<HuellaGlyph />} label={t} />)}
              {herida.nudos.map((t) => <Pieza key={`n-${t}`} icon={<NudoEspiralIcon size={15} color={TINTA} strokeWidth={2} />} label={t} />)}
              {necesidades.map((t) => <Pieza key={`q-${t}`} icon={<NecesidadGlyph />} label={t} />)}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

/** Rejilla de heridas: una columna por cada fuente (3 en escritorio), para que
 *  quede «un box debajo de cada columna». */
export function HeridaGrid({ heridas, onBorrar }: {
  heridas: RelacionHuellaNudo[];
  onBorrar?: (id: string) => void;
}) {
  return (
    // Las heridas entran de izquierda a derecha, una tras otra (en cascada).
    <RevealStagger display="grid" w="100%"
         gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
         gap={{ base: 4, md: 5 }} stagger={0.06} delayChildren={0.12}>
      {heridas.map((h, i) => (
        <RevealItem key={h.id} direction="up" distance={28} scaleFrom={0.95} duration={0.5}>
          <HeridaCard herida={h} color={colorHeridaIdx(i)}
                      onBorrar={onBorrar ? () => onBorrar(h.id) : undefined} />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}
