import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Ilustración (cómic) de UNA sefirá del Árbol de la Vida, a pantalla completa.
// Reutiliza el mismo visor que las ilustraciones del resto de disciplinas
// (ComicViewer), con la foto y los colores de Cábala.
//
// El header muestra SIEMPRE «Ilustraciones» (grande) con el nombre de la sefirá
// como antetítulo, sea cual sea la viñeta: forzamos titulo/eyebrow aquí para que
// no dependa del contenido de cada viñeta.
// ─────────────────────────────────────────────────────────────────────────

const CABALA_IMG = disciplinaBgImg(cabalaNom) ?? "/img/fondos/cabala.png";

export function CabalaSefiraIlustracionModal({
  isOpen,
  vinetas,
  sefiraNombre,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  /** Nombre de la sefirá (antetítulo del header, p.ej. «1 · Keter»). */
  sefiraNombre: string;
  onClose: () => void;
  /** Se llama al terminar de ver la ilustración (tick de la última viñeta). */
  onComplete?: () => void;
}) {
  const conCabecera = vinetas.map((v) => ({
    ...v,
    titulo: "Ilustraciones",
    eyebrow: sefiraNombre,
  }));

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
        {isOpen && conCabecera.length > 0 && (
          <ComicViewer
            vinetas={conCabecera}
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
