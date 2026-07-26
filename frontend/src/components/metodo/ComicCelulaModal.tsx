import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { CELULA_VIVA } from "./comicCelulaViva";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic «De las piezas a la Vida». Va ENTRE la pantalla de Estructuras celulares
// y la de «Crea la célula»: se abre al terminar de montar las cuatro estructuras.
//
//   · onContinue → botón «Crea la célula →» de la última viñeta (o el tick
//                  final). El padre navega a la página de la célula.
//   · onClose    → la X / Escape. El padre cierra y se queda en Estructuras.
// ─────────────────────────────────────────────────────────────────────────
interface ComicCelulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function ComicCelulaModal({ isOpen, onClose, onContinue }: ComicCelulaModalProps) {
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
          vinetas={CELULA_VIVA}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={fisiologiaTxt}
          disciplinaBgImage="/img/fondos/fisio.png"
          disciplinaBgColor={fisiologiaBg}
        />

        {/* Botón «Crea la célula →» fijo, a la IZQUIERDA de la X del ComicViewer.
            Visible durante todo el cómic para poder pasar en cualquier momento. */}
        <Box
          as="button"
          onClick={onContinue}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: "74px", md: "90px" }}
          zIndex={11}
          display="inline-flex"
          alignItems="center"
          gap={2}
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 6 }}
          borderRadius="full"
          overflow="hidden"
          // Fondo con la imagen de la disciplina (fisio) + velo, como el botón
          // «Saltar»; la letra en fisiologiaTxt (color de texto de la disciplina).
          bg="transparent"
          color={fisiologiaTxt}
          border={`1px solid ${fisiologiaTxt}`}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow="0 2px 12px rgba(0,0,0,0.45)"
          sx={{ backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)" }}
        >
          {/* Fondo imagen + velo, como el botón «Saltar». */}
          <Box as="img" src="/img/fondos/fisio.png" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${fisiologiaBg}b3`} />
          <Box as="span" position="relative" zIndex={1}>Crea la célula</Box>
          <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
