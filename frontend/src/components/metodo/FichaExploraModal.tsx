import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import type { Ficha } from "../../hardCoded/espacio/ProfundizaFisiologia";

const TXT = fisiologiaTxt;

/**
 * Modal inmersivo de una FICHA de PROFUNDIZA (neurotransmisor, hormona…): foto a
 * la izquierda y, a la derecha, su nombre + explicación. Con flechas para pasar
 * de una ficha a otra (cíclicamente) sin cerrar. Calco de SistemaModal, pero
 * genérico: el título es el nombre de la ficha (no «Sistema x»).
 */
export function FichaExploraModal({
  ficha,
  fichas,
  temaColor,
  onSelect,
  onClose,
}: {
  ficha: Ficha | null;
  /** Lista completa para navegar con flechas. */
  fichas?: Ficha[];
  /** Color del tema (por si la ficha no trae color propio). */
  temaColor: string;
  onSelect?: (f: Ficha) => void;
  onClose: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  const puedeNavegar = !!fichas && fichas.length > 1 && !!onSelect;
  const idx = ficha && fichas ? fichas.findIndex((f) => f.key === ficha.key) : -1;
  const irAnterior = () => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(fichas![(idx - 1 + fichas!.length) % fichas!.length]);
  };
  const irSiguiente = () => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(fichas![(idx + 1) % fichas!.length]);
  };

  useEffect(() => { setImgErr(false); }, [ficha?.key]);

  useEffect(() => {
    if (!ficha) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [ficha]);

  useEffect(() => {
    if (!ficha) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") irAnterior();
      else if (e.key === "ArrowRight") irSiguiente();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ficha, onClose, puedeNavegar, idx]);

  if (!ficha) return null;
  const accent = ficha.color || temaColor;

  const scrollbarSx = {
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-track": { bg: "transparent" },
    "&::-webkit-scrollbar-thumb": { bg: TXT + "55", borderRadius: "full" },
  };

  const Foto = ({ w }: { w: string }) => (
    <Box
      flexShrink={0}
      w={w}
      aspectRatio={1}
      alignSelf="center"
      borderRadius="xl"
      overflow="hidden"
      boxShadow={`0 8px 32px rgba(0,0,0,0.3), 0 0 16px ${accent}44`}
      bg={TXT + "12"}
    >
      {ficha.foto && !imgErr ? (
        <Image src={encodeURI(ficha.foto)} alt={ficha.nombre} w="100%" h="100%" objectFit="cover" onError={() => setImgErr(true)} />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text color={accent} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            {ficha.nombre.charAt(0)}
          </Text>
        </Flex>
      )}
    </Box>
  );

  const Encabezado = ({ size }: { size: any }) => (
    <Box flexShrink={0}>
      {ficha.eyebrow && (
        <Text color={accent} fontSize={{ base: "2xs", md: "xs" }} fontWeight={700}
              letterSpacing="0.16em" textTransform="uppercase" mb={2}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
          {ficha.eyebrow}
        </Text>
      )}
      <Text
        color={TXT}
        fontSize={size}
        fontWeight="700"
        fontFamily="'EB Garamond', serif"
        letterSpacing="0.03em"
        lineHeight="1.2"
        style={{ textShadow: `0 0 16px ${accent}, 0 1px 4px rgba(0,0,0,0.6)` }}
      >
        {ficha.nombre}
      </Text>
    </Box>
  );

  const Texto = () => (
    <>
      {ficha.explicacion.map((p, i) => (
        <Text
          key={i}
          color={TXT}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.8"
          letterSpacing="0.02em"
          fontFamily="'EB Garamond', serif"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          {p}
        </Text>
      ))}
    </>
  );

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1100}
      bg="rgba(20,12,30,0.62)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        overflow="hidden"
        w={{ base: "95%", md: "920px" }}
        h={{ base: "auto", md: "420px" }}
        maxH={{ base: "calc(100dvh - 32px)", md: "420px" }}
        borderRadius="24px"
        border={`1px solid ${accent}55`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 30px ${accent}55`}
      >
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="24px" overlay="rgba(20,12,30,0.4)" />

        {/* Botón cerrar */}
        <Box
          as="button"
          position="absolute"
          top="14px"
          right="14px"
          w="34px"
          h="34px"
          borderRadius="full"
          bg={TXT + "18"}
          border={`1px solid ${TXT}33`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={TXT}
          fontSize="16px"
          fontWeight="700"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ bg: TXT + "33" }}
          onClick={onClose}
          zIndex={2}
        >
          ✕
        </Box>

        {/* ── MÓVIL: encabezado centrado → rallita → foto → texto ── */}
        <Flex
          display={{ base: "flex", md: "none" }}
          position="relative"
          zIndex={1}
          direction="column"
          align="center"
          textAlign="center"
          p={5}
          pt={12}
          gap={3}
          maxH="calc(100dvh - 32px)"
          overflowY="auto"
          sx={scrollbarSx}
        >
          <Encabezado size="2xl" />
          <Box w="54px" h="1px" borderRadius="full"
               bgGradient={`linear(to-r, transparent, ${accent}, transparent)`} my={1} />
          <Foto w="78%" />
          <Flex mt={2} w="100%" direction="column" gap={3} textAlign="left"><Texto /></Flex>
        </Flex>

        {/* ── ORDENADOR: foto fija a la izquierda, encabezado + texto a la derecha ── */}
        <Flex
          display={{ base: "none", md: "flex" }}
          position="relative"
          zIndex={1}
          h="100%"
          direction="row"
          p={7}
        >
          <Foto w="300px" />

          <Box flexShrink={0} alignSelf="center" w="1px" h="76%" borderRadius="full"
               bgGradient={`linear(to-b, transparent, ${accent}, transparent)`} mx={6} />

          <Flex direction="column" flex="1" minW={0} minH={0}>
            <Box mb={4} pr="40px" flexShrink={0}>
              <Encabezado size="3xl" />
            </Box>
            <Flex direction="column" gap={4} flex="1" minH={0} overflowY="auto" pr={2} sx={scrollbarSx}>
              <Texto />
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Flechas para pasar de una ficha a otra (por encima del box) */}
      {puedeNavegar && (
        <>
          <IconButton
            aria-label="Ficha anterior"
            onClick={(e) => { e.stopPropagation(); irAnterior(); }}
            position="fixed"
            left={{ base: 1, md: 5 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={3}
            variant="ghost"
            borderRadius="full"
            w={{ base: "40px", md: "52px" }}
            h={{ base: "40px", md: "52px" }}
            minW={{ base: "40px", md: "52px" }}
            bg="rgba(0,0,0,0.45)"
            border={`1px solid ${TXT}aa`}
            sx={{ backdropFilter: "blur(4px)" }}
            _hover={{ bg: "rgba(0,0,0,0.65)", borderColor: TXT }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "none" }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "28px" }} h={{ base: "22px", md: "28px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 5px ${TXT}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </Box>
            }
          />
          <IconButton
            aria-label="Ficha siguiente"
            onClick={(e) => { e.stopPropagation(); irSiguiente(); }}
            position="fixed"
            right={{ base: 1, md: 5 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={3}
            variant="ghost"
            borderRadius="full"
            w={{ base: "40px", md: "52px" }}
            h={{ base: "40px", md: "52px" }}
            minW={{ base: "40px", md: "52px" }}
            bg="rgba(0,0,0,0.45)"
            border={`1px solid ${TXT}aa`}
            sx={{ backdropFilter: "blur(4px)" }}
            _hover={{ bg: "rgba(0,0,0,0.65)", borderColor: TXT }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "none" }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "28px" }} h={{ base: "22px", md: "28px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 5px ${TXT}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </Box>
            }
          />
        </>
      )}
    </Box>
  );
}
