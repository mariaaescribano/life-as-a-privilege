import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Ilustración (cómic) de un grupo de nutrientes, a pantalla completa. Reutiliza
// EXACTAMENTE el mismo visor que las ilustraciones de Medicina China / Hinduismo
// (ComicViewer), con la foto de Nutrición (nutri.png) de fondo y los colores de
// la disciplina. Se abre desde el botón «Ver ilustración» del box principal.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_IMG = disciplinaBgImg(nutricionNom) ?? "/img/fondos/nutri.png";

export function NutrienteIlustracionModal({
  isOpen,
  vinetas,
  onClose,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg={nutricionBg} sx={{ backdropFilter: "blur(20px)" }} />
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
        {isOpen && (
          <ComicViewer
            vinetas={vinetas}
            themeColor={nutricionTxt}
            textColor={nutricionTxt}
            textShadow="none"
            disciplinaBgImage={NUTRI_IMG}
            disciplinaBgColor={nutricionBg}
            loader={<AppleLoader />}
            onClose={onClose}
            onComplete={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
