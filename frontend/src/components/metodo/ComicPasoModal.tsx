import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de PASO (intercalado) del recorrido de una disciplina. Se muestra ANTES
// de avanzar al siguiente paso (astrología: signos → Sol/Luna/Asc, planetas →
// Arquetipos, casas → Casas; ayurveda: doshas → Energías…). Reutiliza el
// ComicViewer con el tema (color + fondo) de la disciplina.
//
//   · Botón «Saltar →» (arriba a la IZQUIERDA, en el color txt de la disciplina)
//     y botón del siguiente título (arriba, a la IZQUIERDA de la X, con la
//     imagen de la disciplina de fondo): ambos saltan al siguiente paso.
//   · onClose → la X / Escape. El padre cierra y se queda donde estaba.
// ─────────────────────────────────────────────────────────────────────────

// Flecha larga → (material «arrow_forward»), para el botón del siguiente título.
const FlechaDerecha = () => (
  <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </Box>
);

// Flecha → del botón «Saltar» (igual que el «Saltar» del ComicViewer).
const SaltarChevron = () => (
  <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </Box>
);

interface ComicPasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  /** Viñetas del cómic (VINETAS_SIGNOS / VINETAS_PLANETAS / VINETAS_DOSHAS…). */
  vinetas: Vineta[];
  /** Texto del botón de continuar (p.ej. "Arquetipos", "Energías"). */
  continueLabel: string;
  /** Color de acento de la disciplina (flechas, líneas, botones). */
  themeColor?: string;
  /** Foto de fondo de la disciplina. Si se omite, el ComicViewer usa el fondo
   *  estrellado por defecto (astrología). También es la imagen que se usa de
   *  fondo del botón del siguiente título. */
  disciplinaBgImage?: string;
  /** Color hex del fondo de la disciplina (velo/glow del box y del botón). */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas. */
  textShadow?: string;
  /** (En desuso) El botón del siguiente título ahora lleva SIEMPRE la imagen de
   *  la disciplina de fondo; estos props se ignoran. Se mantienen para no
   *  romper los llamadores que aún los pasan. */
  continueBtnBg?: string;
  continueBtnColor?: string;
}

export function ComicPasoModal({
  isOpen,
  onClose,
  onContinue,
  vinetas,
  continueLabel,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
}: ComicPasoModalProps) {
  // Imagen de la disciplina para el fondo del botón del siguiente título.
  // Astrología no pasa disciplinaBgImage → usa el fondo estrellado, igual que
  // hace el propio ComicViewer.
  const imgFondo = disciplinaBgImage ?? "/img/astrologia/space.jpg";
  // Velo sobre la imagen para que el texto del botón se lea bien.
  const veloBtn = disciplinaBgColor ? `${disciplinaBgColor}b3` : "rgba(0,0,0,0.5)";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100vh"
      >
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta.
            sinSaltar: ocultamos el «Saltar» propio del ComicViewer; aquí abajo
            pintamos el nuestro («Saltar →», en el color de la disciplina). */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          sinSaltar
        />

        {/* «Saltar »» — arriba a la IZQUIERDA. Mismo lenguaje que el «Saltar» del
            ComicViewer: imagen de la disciplina de fondo + velo y letra en el
            color de texto de la disciplina, con el doble chevron ». */}
        <Box
          as="button"
          onClick={onContinue}
          position="fixed"
          top={{ base: 3, md: 5 }}
          left={{ base: 3, md: 5 }}
          zIndex={11}
          overflow="hidden"
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 5 }}
          borderRadius="full"
          color={themeColor}
          border={`1px solid ${themeColor}aa`}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontStyle="italic"
          fontSize={{ base: "sm", md: "md" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow="0 2px 12px rgba(0,0,0,0.45)"
          sx={{ backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ borderColor: themeColor }}
        >
          {/* Fondo: imagen de la disciplina + velo */}
          <Box as="img" src={imgFondo} alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={veloBtn} />
          <Box as="span" position="relative" zIndex={1}>
            Saltar
          </Box>
          <SaltarChevron />
        </Box>

        {/* Botón del siguiente título — arriba, a la IZQUIERDA de la X, con la
            imagen de la disciplina de fondo (+ velo para leer el texto). */}
        <Box
          as="button"
          onClick={onContinue}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: "60px", md: "72px" }}
          zIndex={11}
          overflow="hidden"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 6 }}
          borderRadius="full"
          border={`1px solid ${themeColor}`}
          color={themeColor}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow={`0 0 18px ${themeColor}66, 0 0 40px ${themeColor}33, 0 2px 12px rgba(0,0,0,0.45)`}
          sx={{ backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 28px ${themeColor}88, 0 0 58px ${themeColor}44` }}
        >
          {/* Fondo: imagen de la disciplina + velo */}
          <Box as="img" src={imgFondo} alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={veloBtn} />
          <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" gap={2}
               style={{ textShadow: `0 1px 3px rgba(0,0,0,0.9), 0 0 6px ${themeColor}` }}>
            {continueLabel}
            <FlechaDerecha />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
