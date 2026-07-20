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
//   · onContinue → botón (arriba, al lado de la X) o el tick de la última
//                  viñeta. El padre navega al siguiente paso.
//   · onClose    → la X / Escape. El padre cierra y se queda donde estaba.
// ─────────────────────────────────────────────────────────────────────────
interface ComicPasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  /** Viñetas del cómic (VINETAS_SIGNOS / VINETAS_PLANETAS / VINETAS_DOSHAS…). */
  vinetas: Vineta[];
  /** Texto del botón de continuar (p.ej. "Arquetipos", "Energías"). */
  continueLabel: string;
  /** Color de acento de la disciplina (flechas, líneas, botón). */
  themeColor?: string;
  /** Foto de fondo de la disciplina. Si se omite, el ComicViewer usa el fondo
   *  estrellado por defecto (astrología). */
  disciplinaBgImage?: string;
  /** Color hex del fondo de la disciplina (velo/glow del box). */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas. */
  textShadow?: string;
  /** Fondo del botón «continuar» (arriba, junto a la X). Por defecto el acento. */
  continueBtnBg?: string;
  /** Color del texto del botón «continuar». Por defecto oscuro. */
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
  continueBtnBg,
  continueBtnColor = "#0a0a1a",
}: ComicPasoModalProps) {
  // Fondo del botón «continuar»: por defecto el acento de la disciplina.
  const btnBg = continueBtnBg ?? themeColor;
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
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
        />

        {/* Botón de continuar fijo, a la IZQUIERDA de la X del ComicViewer.
            Visible durante todo el cómic para poder pasar en cualquier momento. */}
        <Box
          as="button"
          onClick={onContinue}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: "60px", md: "72px" }}
          zIndex={11}
          display="inline-flex"
          alignItems="center"
          gap={2}
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 6 }}
          borderRadius="full"
          bg={btnBg}
          color={continueBtnColor}
          border={`1px solid ${themeColor}`}
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
          {continueLabel}
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
