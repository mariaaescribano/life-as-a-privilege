import React, { useEffect, useState } from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import SpinnerTurquesa from "../global/Spinner";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic INLINE de un grupo de nutrientes. Mismo tipo que el cómic de intro de
// /metodo/tcm/elementos: foto a la izquierda, rayita separadora y texto a la
// derecha (grande y aireado), navegable con flechas + puntitos. Sobre el fondo
// de la disciplina (nutri.png), con líneas de luz arriba/abajo.
// ─────────────────────────────────────────────────────────────────────────

const TINTA = nutricionTxt;
const INK_SHADOW = `0 1px 3px ${nutricionBg}f5, 0 0 8px ${nutricionBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,222,170,0.12), 0 0 20px ${nutricionTxt}1a`;

export function NutrienteComic({ vinetas }: { vinetas: Vineta[] }) {
  const [idx, setIdx] = useState(0);
  const [imgOk, setImgOk] = useState(false);   // foto de la viñeta actual cargada
  const [imgErr, setImgErr] = useState(false); // foto de la viñeta actual no existe

  // Al cambiar de viñeta ocultamos la nueva foto hasta que cargue.
  useEffect(() => { setImgOk(false); setImgErr(false); }, [idx]);

  const total = vinetas.length;
  const v = vinetas[idx];
  const isFirst = idx === 0;
  const isLast = idx === total - 1;

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />

      {/* Línea de luz superior */}
      <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
            align="center" justify="center" gap={{ base: 5, md: 10 }}
            px={{ base: 6, md: 12 }} py={{ base: 7, md: 9 }}>

        {/* Foto (viñeta) 1:1 */}
        <Box key={`foto-${idx}`} w={{ base: "80%", md: "300px" }} maxW={{ base: "260px", md: "300px" }}
             aspectRatio={1} flexShrink={0} position="relative"
             sx={{ filter: `drop-shadow(0 0 20px rgba(255,255,255,0.25)) drop-shadow(0 0 60px ${nutricionTxt}33)` }}>
          {!imgErr ? (
            <Box as="img" src={encodeURI(v.src)} alt={`Viñeta ${idx + 1}/${total}`}
                 w="100%" h="100%" borderRadius="lg"
                 onLoad={() => setImgOk(true)} onError={() => setImgErr(true)}
                 style={{ objectFit: "contain", opacity: imgOk ? 1 : 0, transition: "opacity 0.5s ease" }} />
          ) : (
            <Flex position="absolute" inset={0} align="center" justify="center" direction="column" gap={2}
                  borderRadius="lg" bg={`${nutricionTxt}10`}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                   w={{ base: "40px", md: "48px" }} h={{ base: "40px", md: "48px" }} fill={`${nutricionTxt}66`}>
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
              </Box>
              <Text color={`${nutricionTxt}88`} fontSize="2xs" fontWeight="700" letterSpacing="0.14em"
                    textTransform="uppercase">
                Próximamente
              </Text>
            </Flex>
          )}
          {!imgErr && !imgOk && (
            <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
              <SpinnerTurquesa fullScreen={false} color={nutricionTxt} />
            </Box>
          )}
        </Box>

        {/* Separador: rayita horizontal en móvil, vertical en escritorio */}
        <Box flexShrink={0} alignSelf="center" borderRadius="full"
             w={{ base: "52px", md: "1px" }} h={{ base: "1px", md: "150px" }}
             bgGradient={{
               base: `linear(to-r, transparent, ${nutricionTxt}aa, transparent)`,
               md: `linear(to-b, transparent, ${nutricionTxt}aa, transparent)`,
             }} />

        {/* Texto — grande y aireado, como el cómic de TCM/Astrología. Altura
            limitada a la de la foto: si el texto es más largo, hace scroll
            vertical dentro en vez de agrandar el box. */}
        <Flex direction="column" gap={3} flex="1" minW={0} w={{ base: "100%", md: "auto" }}
              maxH={{ base: "300px", md: "300px" }} overflowY="auto" pr={{ base: 1, md: 2 }}
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}44`, borderRadius: "3px" },
                scrollbarWidth: "thin",
                scrollbarColor: `${nutricionTxt}44 transparent`,
              }}>
          {v.paragraphs.map((p, k) => (
            <Text key={`${idx}-${k}`} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.95"
                  letterSpacing="0.02em" fontWeight="400" textAlign={{ base: "center", md: "left" }}
                  style={{ textShadow: INK_SHADOW }}>
              {p}
            </Text>
          ))}
        </Flex>
      </Flex>

      {/* Navegación — flechas redondas + puntitos (el activo en píldora). */}
      <Flex position="relative" zIndex={1} align="center" justify="center" gap={6}
            pb={{ base: 5, md: 6 }} mt={{ base: -1, md: -2 }}>
        <IconButton aria-label="Anterior" onClick={() => setIdx((i) => Math.max(i - 1, 0))}
          isDisabled={isFirst} variant="ghost" color={nutricionTxt} opacity={isFirst ? 0.25 : 1}
          borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
          minW={{ base: "42px", md: "48px" }}
          bg={`${nutricionTxt}10`} border={`1px solid ${nutricionTxt}33`}
          boxShadow={isFirst ? "none" : `0 0 14px ${nutricionTxt}33, 0 0 32px ${nutricionTxt}1a`}
          _hover={isFirst ? {} : { bg: `${nutricionTxt}22`, borderColor: `${nutricionTxt}88`, boxShadow: `0 0 22px ${nutricionTxt}55, 0 0 50px ${nutricionTxt}2a` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={nutricionTxt}>
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </Box>
          } />
        <Flex align="center" justify="center" gap={2}>
          {vinetas.map((_, i) => {
            const activo = i === idx;
            return (
              <Box key={i} as="button" aria-label={`Viñeta ${i + 1}`} onClick={() => setIdx(i)}
                w={activo ? "22px" : "8px"} h="8px" borderRadius="full"
                bg={activo ? nutricionTxt : `${nutricionTxt}44`} cursor="pointer"
                transition="all 0.25s ease"
                boxShadow={activo ? `0 0 8px ${nutricionTxt}aa, 0 0 16px ${nutricionTxt}66` : "none"}
                _hover={{ bg: activo ? nutricionTxt : `${nutricionTxt}88` }} />
            );
          })}
        </Flex>
        <IconButton aria-label="Siguiente" onClick={() => setIdx((i) => Math.min(i + 1, total - 1))}
          isDisabled={isLast} variant="ghost" color={nutricionTxt} opacity={isLast ? 0.25 : 1}
          borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
          minW={{ base: "42px", md: "48px" }}
          bg={`${nutricionTxt}10`} border={`1px solid ${nutricionTxt}33`}
          boxShadow={isLast ? "none" : `0 0 14px ${nutricionTxt}33, 0 0 32px ${nutricionTxt}1a`}
          _hover={isLast ? {} : { bg: `${nutricionTxt}22`, borderColor: `${nutricionTxt}88`, boxShadow: `0 0 22px ${nutricionTxt}55, 0 0 50px ${nutricionTxt}2a` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={nutricionTxt}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          } />
      </Flex>

      {/* Línea de luz inferior */}
      <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
    </Box>
  );
}
