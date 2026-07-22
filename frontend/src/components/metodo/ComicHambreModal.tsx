import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { NUTRICION_HAMBRE } from "./comicNutricionHambre";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de transición «El hambre». Va ENTRE la Microbiota y la página de El
// hambre: se abre al pulsar «El hambre →» y termina navegando a
// /metodo/nutricion/hambre. Mismo patrón que ComicMicrobiotaModal.
// ─────────────────────────────────────────────────────────────────────────
interface ComicHambreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function ComicHambreModal({ isOpen, onClose, onContinue }: ComicHambreModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0}
                    fontFamily="'EB Garamond', serif" minH="100vh">
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={NUTRICION_HAMBRE}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={nutricionBg}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage="/img/fondos/nutri.png"
          disciplinaBgColor={nutricionBg}
          loader={<AppleLoader />}
        />

        {/* Botón «Ir a El hambre →» fijo, a la IZQUIERDA de la X del ComicViewer. */}
        <Box as="button" onClick={onContinue} position="fixed" top={{ base: 3, md: 5 }}
             right={{ base: "60px", md: "72px" }} zIndex={11} display="inline-flex" alignItems="center" gap={2}
             h={{ base: "42px", md: "48px" }} px={{ base: 4, md: 6 }} borderRadius="full" overflow="hidden"
             bg="transparent" color={nutricionTxt} border={`1px solid ${nutricionTxt}`}
             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xs", md: "sm" }}
             letterSpacing="0.04em" whiteSpace="nowrap" cursor="pointer"
             boxShadow={`0 0 18px ${nutricionBg}88, 0 0 40px ${nutricionBg}44, 0 2px 12px rgba(0,0,0,0.45)`}
             sx={{ backdropFilter: "blur(4px)" }} transition="all 0.2s"
             _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 28px ${nutricionBg}aa, 0 0 58px ${nutricionBg}66` }}>
          {/* Fondo imagen + velo, como el botón «Saltar»; letra en nutricionTxt. */}
          <Box as="img" src="/img/fondos/nutri.png" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${nutricionBg}b3`} />
          <Box as="span" position="relative" zIndex={1}>Ir a El hambre</Box>
          <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
