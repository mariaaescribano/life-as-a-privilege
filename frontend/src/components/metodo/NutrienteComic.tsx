import React, { useEffect, useRef, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { AppleLoader } from "./AppleLoader";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic INLINE de un grupo de nutrientes. Estilo «Ilustraciones» (ComicViewer):
// foto grande a la izquierda, rayita separadora y texto grande y aireado a la
// derecha. Se pasa de página con flechas circulares GRANDES a los lados de la
// caja (o swipe en móvil), con puntitos de progreso centrados abajo. Sobre el
// fondo de la disciplina (nutri.png), con líneas de luz arriba/abajo.
// ─────────────────────────────────────────────────────────────────────────

const TINTA = nutricionTxt;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,222,170,0.12), 0 0 20px ${nutricionTxt}1a`;

// Flecha lateral circular grande (estilo Ilustraciones), superpuesta al borde
// de la caja y centrada verticalmente.
function FlechaLateral({ lado, onClick, disabled }: { lado: "izq" | "der"; onClick: () => void; disabled: boolean }) {
  return (
    <IconButton
      aria-label={lado === "izq" ? "Anterior" : "Siguiente"}
      onClick={onClick}
      isDisabled={disabled}
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      {...(lado === "izq" ? { left: { base: 1, md: 3 } } : { right: { base: 1, md: 3 } })}
      zIndex={4}
      variant="ghost"
      opacity={disabled ? 0.25 : 1}
      borderRadius="full"
      w={{ base: "40px", md: "56px" }} h={{ base: "40px", md: "56px" }} minW={{ base: "40px", md: "56px" }}
      bg={`${nutricionTxt}14`} border={`1px solid ${nutricionTxt}44`}
      sx={{ backdropFilter: "blur(4px)" }}
      boxShadow={disabled ? "none" : `0 0 14px ${nutricionTxt}33, 0 0 32px ${nutricionTxt}1a`}
      _hover={disabled ? {} : { bg: `${nutricionTxt}26`, borderColor: `${nutricionTxt}88`, boxShadow: `0 0 22px ${nutricionTxt}55, 0 0 50px ${nutricionTxt}2a` }}
      icon={
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
             w={{ base: "24px", md: "30px" }} h={{ base: "24px", md: "30px" }} fill={nutricionTxt}>
          {lado === "izq"
            ? <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            : <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />}
        </Box>
      } />
  );
}

export function NutrienteComic({ vinetas }: { vinetas: Vineta[] }) {
  const t = useT();
  const [idx, setIdx] = useState(0);
  const [imgOk, setImgOk] = useState(false);   // foto de la viñeta actual cargada
  const [imgErr, setImgErr] = useState(false); // foto de la viñeta actual no existe
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Al cambiar de viñeta ocultamos la nueva foto hasta que cargue.
  useEffect(() => { setImgOk(false); setImgErr(false); }, [idx]);

  const total = vinetas.length;
  const v = vinetas[idx];
  const isFirst = idx === 0;
  const isLast = idx === total - 1;

  const irPrev = () => setIdx((i) => Math.max(i - 1, 0));
  const irNext = () => setIdx((i) => Math.min(i + 1, total - 1));

  // Swipe horizontal en móvil para pasar de página.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) irPrev(); else irNext();
    }
  };

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
         onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} sx={{ touchAction: "pan-y" }}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />

      {/* Línea de luz superior */}
      <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

      {/* Flechas laterales grandes (estilo Ilustraciones) */}
      <FlechaLateral lado="izq" onClick={irPrev} disabled={isFirst} />
      <FlechaLateral lado="der" onClick={irNext} disabled={isLast} />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
            align="center" justify="center" gap={{ base: 5, md: 10 }}
            px={{ base: 12, md: 20 }} py={{ base: 8, md: 10 }}>

        {/* Foto (viñeta) 1:1 — grande, como en Ilustraciones */}
        <Box key={`foto-${idx}`} w={{ base: "100%", md: "380px" }} maxW={{ base: "300px", md: "380px" }}
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
                {t("comun.proximamente")}
              </Text>
            </Flex>
          )}
          {!imgErr && !imgOk && (
            <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
              <AppleLoader color={nutricionTxt} label={null} />
            </Box>
          )}
        </Box>

        {/* Texto — grande y aireado, como en Ilustraciones. Altura limitada a la
            de la foto: si el texto es más largo, hace scroll vertical dentro en
            vez de agrandar el box. */}
        <Flex direction="column" gap={4} flex="1" minW={0} w={{ base: "100%", md: "auto" }}
              maxH={{ base: "360px", md: "380px" }} overflowY="auto" pr={{ base: 1, md: 2 }}
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}44`, borderRadius: "3px" },
                scrollbarWidth: "thin",
                scrollbarColor: `${nutricionTxt}44 transparent`,
              }}>
          {v.paragraphs.map((p, k) => (
            <Text key={`${idx}-${k}`} color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.9"
                  letterSpacing="0.02em" fontWeight="400" textAlign={{ base: "center", md: "left" }}>
              {p}
            </Text>
          ))}
        </Flex>
      </Flex>

      {/* Puntitos de progreso (el activo en píldora), centrados abajo. */}
      <Flex position="relative" zIndex={1} align="center" justify="center" gap={2}
            pb={{ base: 5, md: 6 }} mt={{ base: -1, md: -2 }}>
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

      {/* Línea de luz inferior */}
      <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
    </Box>
  );
}
