import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { NUTRICION_MICROBIOTA } from "./comicNutricionMicrobiota";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de transición «La microbiota». Va ENTRE Los nutrientes y el apartado de
// la Microbiota: se abre al pulsar «Microbiota →» y termina navegando a
// /metodo/nutricion/microbiota. Mismo patrón que ComicCaloriasModal.
// ─────────────────────────────────────────────────────────────────────────
interface ComicMicrobiotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function ComicMicrobiotaModal({ isOpen, onClose, onContinue }: ComicMicrobiotaModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0}
                    fontFamily="'EB Garamond', serif" minH="100vh">
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={NUTRICION_MICROBIOTA}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={nutricionBg}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage="/img/fondos/nutri.png"
          disciplinaBgColor={nutricionBg}
        />

        {/* Botón «Ir a la microbiota →» fijo, a la IZQUIERDA de la X del ComicViewer. */}
        <Box as="button" onClick={onContinue} position="fixed" top={{ base: 3, md: 5 }}
             right={{ base: "60px", md: "72px" }} zIndex={11} display="inline-flex" alignItems="center" gap={2}
             h={{ base: "42px", md: "48px" }} px={{ base: 4, md: 6 }} borderRadius="full"
             bg={nutricionBg} color={nutricionTxt} border={`1px solid ${nutricionTxt}`}
             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xs", md: "sm" }}
             letterSpacing="0.04em" whiteSpace="nowrap" cursor="pointer"
             boxShadow={`0 0 18px ${nutricionBg}88, 0 0 40px ${nutricionBg}44, 0 2px 12px rgba(0,0,0,0.45)`}
             sx={{ backdropFilter: "blur(4px)" }} transition="all 0.2s"
             _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 28px ${nutricionBg}aa, 0 0 58px ${nutricionBg}66` }}>
          Ir a la microbiota
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
