import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Ilustraciones del Árbol de la Vida, a pantalla completa. Reutiliza el visor
// del resto de disciplinas (ComicViewer), con la foto y los colores de Cábala.
//
// Se le pasa la SECUENCIA completa de sefirot (una viñeta por dimensión) y el
// índice por el que abrir: así, con las flechas del visor, se va de una
// dimensión a la siguiente. Solo se muestra el texto de la viñeta (sin título ni
// antetítulo). `onPageView` marca cada sefirá como leída según se navega.
// ─────────────────────────────────────────────────────────────────────────

const CABALA_IMG = disciplinaBgImg(cabalaNom) ?? "/img/fondos/cabala.png";

export function CabalaSefiraIlustracionModal({
  isOpen,
  vinetas,
  initialIndex = 0,
  onClose,
  onComplete,
  onPageView,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  /** Índice de la viñeta por la que abrir (la sefirá pulsada). */
  initialIndex?: number;
  onClose: () => void;
  /** Se llama al terminar (tick de la última viñeta). */
  onComplete?: () => void;
  /** Se llama con el índice de la viñeta que se está viendo (para marcarla leída). */
  onPageView?: (index: number) => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg={cabalaBg} sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        minH="100vh"
        position="relative"
        fontFamily="'EB Garamond', serif"
        sx={{ transform: "none !important" }}
      >
        {isOpen && vinetas.length > 0 && (
          <ComicViewer
            vinetas={vinetas}
            initialIndex={initialIndex}
            onPageView={onPageView}
            themeColor={cabalaTxt}
            textColor={cabalaTxt}
            disciplinaBgImage={CABALA_IMG}
            disciplinaBgColor={cabalaBg}
            onClose={onClose}
            onComplete={onComplete ?? onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

export default CabalaSefiraIlustracionModal;
