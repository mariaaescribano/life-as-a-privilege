import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { astrologiaTxt, neuropsicologiaTxt } from "../../GlobalVariables";

const PAPEL = "#fbf4e8";
const TINTA = neuropsicologiaTxt;

/** Candado: la columna de arquetipos está cerrada hasta tener la carta astral. */
const CandadoIcon = ({ size = 30 }: { size?: number }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={`${size}px`} h={`${size}px`}
       fill={astrologiaTxt} flexShrink={0}
       style={{ filter: `drop-shadow(0 0 10px ${astrologiaTxt}77) drop-shadow(0 2px 4px rgba(0,0,0,0.6))` }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

/**
 * Columna de «Tus arquetipos» BLOQUEADA: se pinta cuando el usuario todavía no
 * ha hecho su carta astral (no ha recorrido Astrología). En vez de enseñar la
 * rejilla de arquetipos vacía, se explica para qué sirve esta página y qué le
 * falta para poder completarla, con la salida a Astrología.
 *
 * Va SIEMPRE sobre el fondo de estrellas de la columna, así que su letra es
 * clara (PAPEL) con sombra oscura.
 */
export function ArquetiposBloqueados({
  texto,
  onIr,
}: {
  /** Qué se puede hacer en ESTA página con los arquetipos (una o varias frases). */
  texto: string[];
  onIr: () => void;
}) {
  return (
    <Flex direction="column" align="center" justify="center" h="100%" gap={4} px={{ base: 3, md: 4 }} py={6}
          textAlign="center">
      {/* Chapa del candado */}
      <Flex align="center" justify="center" w="62px" h="62px" borderRadius="full" flexShrink={0}
            bg="rgba(0,0,0,0.42)" border={`1.5px solid ${astrologiaTxt}66`}
            boxShadow={`0 0 20px ${astrologiaTxt}44, inset 0 0 18px rgba(0,0,0,0.5)`}>
        <CandadoIcon />
      </Flex>

      <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.03em"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}>
        Necesitas tu carta astral
      </Text>

      <Flex direction="column" gap={2.5} maxW="300px">
        {texto.map((p, i) => (
          <Text key={i} color={PAPEL} fontSize="sm" lineHeight="1.65" opacity={0.94} fontStyle="italic"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}>
            {p}
          </Text>
        ))}
      </Flex>

      <Box as="button" onClick={onIr} px={5} py={2} borderRadius="full" bg={PAPEL} color={TINTA}
           fontWeight="700" fontSize="sm" cursor="pointer" flexShrink={0}
           boxShadow={`0 0 18px ${astrologiaTxt}44`}
           _hover={{ boxShadow: `0 0 26px ${astrologiaTxt}77`, transform: "translateY(-1px)" }}
           transition="all 0.18s">
        Hacer mi carta astral →
      </Box>
    </Flex>
  );
}
