import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// ComicModal — visor inmersivo genérico (sin botón «Leído» ni persistencia).
// Se usa en la galería de Ilustraciones: cada entrada abre este popup con las
// viñetas y el estilo (colores/fondo) de la disciplina a la que pertenece.
// ─────────────────────────────────────────────────────────────────────────

interface ComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  vinetas: Vineta[];
  themeColor?: string;
  /** Modo disciplina: imagen de fondo propia (hinduismo/tcm/fisio). Si se omite,
   *  fondo estrellado por defecto (astrología / espiritualidad). */
  disciplinaBgImage?: string;
  disciplinaBgColor?: string;
  textShadow?: string;
  /** Color de la LETRA si difiere del acento (themeColor). P.ej. Nutrición usa
   *  acento claro (nutricionBg) y letra oscura (nutricionTxt). */
  textColor?: string;
}

export function ComicModal({
  isOpen,
  onClose,
  vinetas,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
  textColor,
}: ComicModalProps) {
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
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
        />
      </ModalContent>
    </Modal>
  );
}
