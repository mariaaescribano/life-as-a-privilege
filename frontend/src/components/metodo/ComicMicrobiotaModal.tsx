import React from "react";
import { useT } from "../../i18n";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { NUTRICION_MICROBIOTA } from "./comicNutricionMicrobiota";
import { useComic } from "../../i18n/comics";
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
  const t = useT();
  // Sus viñetas en el idioma activo.
  const vinetas = useComic("nutricion-microbiota", NUTRICION_MICROBIOTA);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0}
                    fontFamily="'EB Garamond', serif" minH="100dvh">
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={nutricionBg}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage="/img/fondos/nutri.webp"
          disciplinaBgColor={nutricionBg}
          loader={<AppleLoader />}
          cerrarColor={nutricionTxt}
        />

        {/* Botón «Ir a la microbiota →» fijo, a la IZQUIERDA de la X del ComicViewer. */}
        <Box as="button" onClick={onContinue} position="fixed" top={{ base: 3, md: 5 }}
             right={{ base: "74px", md: "90px" }} zIndex={11} display="inline-flex" alignItems="center" gap={2}
             h={{ base: "42px", md: "48px" }} px={{ base: 4, md: 6 }} borderRadius="full" overflow="hidden"
             bg="transparent" color={nutricionTxt} border={`2px solid ${nutricionTxt}`}
             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xs", md: "sm" }}
             letterSpacing="0.04em" whiteSpace="nowrap" cursor="pointer"
             boxShadow="0 2px 12px rgba(0,0,0,0.45)"
             sx={{ backdropFilter: "blur(4px)" }} transition="all 0.2s"
             _hover={{ transform: "translateY(-1px)" }}>
          {/* Fondo imagen + velo, como el botón «Saltar»; letra en nutricionTxt. */}
          <Box as="img" src="/img/fondos/nutri.webp" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${nutricionBg}b3`} />
          <Box as="span" position="relative" zIndex={1}>{t("metodo.irA", { destino: t("metodo.destino.microbiota") })}</Box>
          <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
