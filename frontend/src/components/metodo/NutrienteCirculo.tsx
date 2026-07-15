import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { nutricionTxt } from "../../GlobalVariables";
import type { NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// Círculo de colores: coloca las tarjetas (p.ej. las vitaminas) alrededor de un
// anillo, cada una con su color. Al pinchar un nodo se abre su ficha (onSelect).
// Cada nodo muestra la foto (cuando exista) o su sigla sobre el color.
// ─────────────────────────────────────────────────────────────────────────

function CirculoNodo({ tar, x, y, onClick }: {
  tar: NutrienteTarjeta; x: number; y: number; onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const color = tar.color ?? nutricionTxt;
  return (
    <Box
      as="button"
      onClick={onClick}
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      transform="translate(-50%, -50%)"
      w={{ base: "44px", sm: "52px", md: "62px" }}
      h={{ base: "44px", sm: "52px", md: "62px" }}
      borderRadius="full"
      overflow="hidden"
      bg={color}
      border="2px solid rgba(255,255,255,0.85)"
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow={`0 0 12px ${color}cc, 0 4px 14px rgba(0,0,0,0.3)`}
      transition="transform 0.18s ease, box-shadow 0.18s ease"
      _hover={{ transform: "translate(-50%, -50%) scale(1.12)", boxShadow: `0 0 20px ${color}, 0 6px 18px rgba(0,0,0,0.4)` }}
      _active={{ transform: "translate(-50%, -50%) scale(1.04)" }}
      title={tar.titulo}
    >
      {tar.foto && !imgErr ? (
        <Box as="img" src={encodeURI(tar.foto)} alt={tar.titulo} w="100%" h="100%"
             style={{ objectFit: "cover" }} onError={() => setImgErr(true)} />
      ) : (
        <Text color="white" fontWeight="800" fontSize={{ base: "sm", md: "lg" }} lineHeight="1"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {tar.sigla ?? tar.titulo.charAt(0)}
        </Text>
      )}
    </Box>
  );
}

export function NutrienteCirculo({ tarjetas, onSelect, tituloCentro }: {
  tarjetas: NutrienteTarjeta[];
  onSelect: (i: number) => void;
  tituloCentro?: string;
}) {
  const N = tarjetas.length;
  const R = 41; // radio del anillo (% del contenedor)

  return (
    <Box position="relative" w="100%" maxW={{ base: "340px", md: "460px" }} mx="auto"
         sx={{ aspectRatio: "1 / 1" }}>
      {/* Anillo guía */}
      <Box position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)"
           w={`${R * 2}%`} h={`${R * 2}%`} borderRadius="full"
           border={`1px dashed ${nutricionTxt}33`} pointerEvents="none" />

      {/* Centro */}
      {tituloCentro && (
        <Flex position="absolute" inset={0} align="center" justify="center" pointerEvents="none"
              direction="column" gap={1} px="26%" textAlign="center">
          <Text color={nutricionTxt} fontWeight="800" fontSize={{ base: "lg", md: "2xl" }} lineHeight="1.1"
                style={{ textShadow: "0 1px 6px rgba(255,255,255,0.6)" }}>
            {tituloCentro}
          </Text>
          <Text color={`${nutricionTxt}aa`} fontSize={{ base: "2xs", md: "xs" }} fontStyle="italic">
            Toca cada una
          </Text>
        </Flex>
      )}

      {/* Nodos */}
      {tarjetas.map((tar, i) => {
        const ang = (-90 + i * (360 / N)) * (Math.PI / 180);
        const x = 50 + R * Math.cos(ang);
        const y = 50 + R * Math.sin(ang);
        return <CirculoNodo key={tar.key} tar={tar} x={x} y={y} onClick={() => onSelect(i)} />;
      })}
    </Box>
  );
}
