import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type Cuerpo } from "../metodo/astrologiaData";
import { Glifo } from "../metodo/Glifo";
import { SpaceBg } from "../metodo/SpaceBg";
void React;

interface Props {
  cuerpo: Cuerpo;
  onClick: () => void;
  /** Línea bajo el nombre: el signo en la carta, o la frase del arquetipo. */
  subtitulo?: React.ReactNode;
  /** Marca de completado (✓) en la esquina. */
  hecho?: boolean;
  /** Barra de progreso del planeta. Sin esto, el box no la pinta. */
  progreso?: { hechas: number; total: number };
  /** Pie en cursiva («Pincha para responder», «Respondido»…). */
  nota?: string;
}

/**
 * Box de un planeta del estudio. Es EL MISMO en la portada y en la pantalla de
 * preguntas —a propósito: quien mira la portada ya está viendo la pantalla que
 * se va a encontrar— y solo cambia lo que se le cuelga dentro: en la portada
 * una frase del arquetipo, en las preguntas el signo y el progreso.
 */
export function PlanetaEstudioBox({ cuerpo: c, onClick, subtitulo, hecho, progreso, nota }: Props) {
  // Sin nada que colgar debajo (la portada), el box se queda en lo esencial:
  // icono y nombre. Ni rayita, ni barra, ni pie.
  const desnudo = !subtitulo && !progreso && !nota;

  return (
    <Flex
      as="button"
      onClick={onClick}
      direction="column"
      w="100%"
      h="100%"
      textAlign="left"
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      // Sin contorno: el box se recorta contra el turquesa por su propio halo del
      // color del planeta. Lo de «hecho» lo dicen el ✓ y la barra, no una línea.
      boxShadow={hecho
        ? `0 0 26px ${c.color}77, 0 0 62px ${c.color}3a`
        : `0 0 20px ${c.color}44, 0 0 52px ${c.color}22`}
      cursor="pointer"
      transition="transform 0.22s ease, box-shadow 0.22s ease"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: `0 0 30px ${c.color}99, 0 0 70px ${c.color}4d`,
      }}
    >
      <SpaceBg overlay="rgba(8,13,30,0.68)" />

      {/* En escritorio el box respira bastante más: más aire dentro, glifo y
          nombre más grandes. En móvil se queda como estaba (ahí manda el ancho
          de la pantalla, no el del box). */}
      <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 8 }} w="100%">
        {/* Icono y nombre, sin nada alrededor: el glifo va suelto, sin círculo. */}
        <Flex align="center" gap={{ base: 3, md: 4 }} mb={desnudo ? 0 : 4}>
          <Box display={{ base: "block", md: "none" }}>
            <Glifo symbol={c.symbol} color={c.color} size={34} />
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            <Glifo symbol={c.symbol} color={c.color} size={44} />
          </Box>
          <Box flex="1">
            <Text color={c.color} fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" letterSpacing="0.05em"
                  style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 28px ${c.color}66` }}>
              {c.label}
            </Text>
            {subtitulo}
          </Box>
          {hecho && <Text color={c.color} fontSize={{ base: "lg", md: "2xl" }} opacity={0.9} title="Respondido">✓</Text>}
        </Flex>

        {/* La rayita solo separa si hay algo debajo que separar. */}
        {!desnudo && <Box h="1px" mb={4} bgGradient={`linear(to-r, ${c.color}66, transparent)`} />}

        {progreso && (
          <Flex align="center" gap={3}>
            <Box flex="1" h={{ base: "3px", md: "4px" }} borderRadius="full" bg={`${c.color}22`}>
              <Box h="100%" borderRadius="full" bg={c.color} transition="width 0.35s ease"
                   w={`${progreso.total ? (progreso.hechas / progreso.total) * 100 : 0}%`}
                   boxShadow={`0 0 8px ${c.color}88`} />
            </Box>
            <Text color={`${c.color}bb`} fontSize={{ base: "xs", md: "sm" }} fontWeight="600"
                  letterSpacing="0.08em" flexShrink={0}>
              {progreso.hechas}/{progreso.total}
            </Text>
          </Flex>
        )}

        {nota && (
          <Text color={`${c.color}99`} fontSize={{ base: "xs", md: "sm" }} mt={progreso ? 3 : 0} fontStyle="italic">
            {nota}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
