import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { NUTRICION_CALORIAS } from "./comicNutricionCalorias";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de transición «Las calorías no existen». Va ENTRE la portada de
// Nutrición y la pantalla de Los nutrientes: se abre al pulsar «Comenzar» y
// termina navegando a /metodo/nutricion/nutrientes.
//
//   · onContinue → botón «Ir a los nutrientes →» de la última viñeta (o el tick
//                  final). El padre cierra y navega a nutrientes.
//   · onClose    → la X / Escape. El padre cierra, quedándose en la portada.
//
// Colores: acento claro (nutricionBg) para líneas/contador/botón y letra oscura
// (nutricionTxt) sobre el fondo claro. Sin sombra de texto (como el nutricómic).
// ─────────────────────────────────────────────────────────────────────────
interface ComicCaloriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function ComicCaloriasModal({ isOpen, onClose, onContinue }: ComicCaloriasModalProps) {
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
          vinetas={NUTRICION_CALORIAS}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={nutricionBg}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage="/img/fondos/nutri.png"
          disciplinaBgColor={nutricionBg}
        />

        {/* Botón «Ir a los nutrientes →» fijo, a la IZQUIERDA de la X del
            ComicViewer. Visible durante todo el cómic para poder pasar en
            cualquier momento. */}
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
          bg={nutricionBg}
          color={nutricionTxt}
          border={`1px solid ${nutricionTxt}`}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow={`0 0 18px ${nutricionBg}88, 0 0 40px ${nutricionBg}44, 0 2px 12px rgba(0,0,0,0.45)`}
          sx={{ backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 28px ${nutricionBg}aa, 0 0 58px ${nutricionBg}66` }}
        >
          Ir a los nutrientes
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
