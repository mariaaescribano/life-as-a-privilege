import React, { useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type Cuerpo } from "../metodo/astrologiaData";
import { Glifo } from "../metodo/Glifo";
import { EstudioPopup } from "./EstudioPopup";
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
    <EstudioPopup onClose={onClose} color={color}>
      {/* Cabecera */}
      <Flex position="relative" zIndex={1} flexShrink={0} direction="column" align="center" gap={2}
            px={{ base: 5, md: 8 }} pt={{ base: 7, md: 8 }} pb={4} textAlign="center">
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

      <Box position="relative" zIndex={1} flexShrink={0} mx={{ base: 5, md: 8 }} h="1px"
           bgGradient={`linear(to-r, transparent, ${color}66, transparent)`} />

      {/* Texto — cierra la X de arriba, el clic fuera o Escape: sin botón de pie.
          Este es el que hace scroll cuando el texto no cabe en el cuadrado. */}
      <Flex position="relative" zIndex={1} flex="1 1 auto" minH={0} direction="column" justify="flex-start" gap={4}
            px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }} pb={{ base: 6, md: 7 }} overflowY="auto">
        {(texto?.parrafos ?? []).map((p, i) => (
          <Text key={i} color={`${color}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75"
                textAlign="center"
                style={{ textShadow: "0 0 12px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)" }}>
            {p}
          </Text>
        ))}
      </Flex>
    </EstudioPopup>
  );
}
