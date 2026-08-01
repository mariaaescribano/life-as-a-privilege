import React, { useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type Cuerpo } from "../metodo/astrologiaData";
import { Glifo } from "../metodo/Glifo";
import { SpaceBg } from "../metodo/SpaceBg";
import { TEXTOS_PLANETAS } from "../../data/estudioPlanetasTextos";
void React;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cuerpo: Cuerpo | null;
}

/**
 * Popup de la PORTADA: explica brevemente qué es cada arquetipo. Mismo cielo de
 * fondo y mismo color del planeta que el popup de preguntas, para que quien
 * llega a la portada reconozca después la pantalla en la que va a responder.
 */
export function PlanetaInfoModal({ isOpen, onClose, cuerpo }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !cuerpo) return null;

  const color = cuerpo.color;
  const texto = TEXTOS_PLANETAS[cuerpo.key];

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 10 }}
      py={{ base: 6, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW="620px"
        h={{ base: "calc(100dvh - 48px)", md: "560px" }}
        maxH={{ base: "calc(100dvh - 48px)", md: "calc(100vh - 80px)" }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
      >
        <SpaceBg overlay="rgba(8,13,30,0.75)" />

        {/* X cerrar */}
        <Box
          position="absolute" top={3} right={3} zIndex={3}
          as="button" onClick={onClose}
          w="36px" h="36px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.6)" border={`1px solid ${color}66`} color={color}
          cursor="pointer" transition="all 0.15s" boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        {/* Cabecera */}
        <Flex position="relative" zIndex={1} direction="column" align="center" gap={2}
              px={{ base: 5, md: 8 }} pt={{ base: 8, md: 9 }} pb={4} textAlign="center">
          <Flex w="62px" h="62px" borderRadius="full" align="center" justify="center"
                bg={`${color}1f`} border={`1px solid ${color}55`} boxShadow={`0 0 22px ${color}44`}>
            <Glifo symbol={cuerpo.symbol} color={color} size={38} />
          </Flex>
          <Text color={color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.05em"
                style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 32px ${color}66` }}>
            {cuerpo.label}
          </Text>
          <Text color={`${color}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
            {texto?.titulo}
          </Text>
        </Flex>

        <Box position="relative" zIndex={1} mx={{ base: 5, md: 8 }} h="1px"
             bgGradient={`linear(to-r, transparent, ${color}66, transparent)`} />

        {/* Texto — cierra la X de arriba, el clic fuera o Escape: sin botón de pie. */}
        <Flex position="relative" zIndex={1} flex="1" direction="column" justify="center" gap={4}
              px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }} pb={{ base: 8, md: 9 }} overflowY="auto">
          {(texto?.parrafos ?? []).map((p, i) => (
            <Text key={i} color={`${color}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75"
                  textAlign="center"
                  style={{ textShadow: "0 0 12px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)" }}>
              {p}
            </Text>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
