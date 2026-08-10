import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Wrapper genérico de cómic para los temas de PROFUNDIZA (Fisiología). Se abre
// «antes de empezar» un tema (p.ej. «Cómo se sintetiza un neurotransmisor»).
// Reutiliza el ComicViewer con el fondo/colores de Fisiología. La X y el tick
// final simplemente cierran el cómic y dejan al usuario en la página del tema.
// ─────────────────────────────────────────────────────────────────────────
export function ComicTemaModal({
  isOpen,
  vinetas,
  onClose,
  leida = false,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  onClose: () => void;
  /** El cómic ya se había leído antes de abrirlo → aviso discreto «✓ Leída». */
  leida?: boolean;
}) {
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
        minH="100dvh"
      >
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onClose}
          themeColor={fisiologiaTxt}
          disciplinaBgImage="/img/fondos/fisio.webp"
          disciplinaBgColor={fisiologiaBg}
          leida={leida ? () => true : undefined}
        />
      </ModalContent>
    </Modal>
  );
}
