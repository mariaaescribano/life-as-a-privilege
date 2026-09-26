import React from "react";
import { FlechaBonita } from "../global/FlechaBonita";
import { useT } from "../../i18n";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { NUTRICION_CALORIAS } from "./comicNutricionCalorias";
import { useComic } from "../../i18n/comics";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de transición «Las calorías no existen». Va ENTRE la portada de
// Nutrición y la pantalla de los Macronutrientes: se abre al pulsar «Comenzar»
// y termina navegando a /metodo/nutricion/macronutrientes.
//
//   · onContinue → botón «Ir a los nutrientes →» de la última viñeta (o el tick
//                  final). El padre cierra y navega a los macronutrientes.
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
  const t = useT();
  // Sus viñetas en el idioma activo.
  const vinetas = useComic("nutricion-calorias", NUTRICION_CALORIAS);
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
          onComplete={onContinue}
          themeColor={nutricionBg}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage="/img/fondos/nutri.webp"
          disciplinaBgColor={nutricionBg}
          loader={<AppleLoader />}
          cerrarColor={nutricionTxt}
        />

        {/* Botón «Ir a los nutrientes →» fijo, a la IZQUIERDA de la X del
            ComicViewer. Visible durante todo el cómic para poder pasar en
            cualquier momento. */}
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
          // Fondo con la imagen de la disciplina (nutri) + velo, como el botón
          // «Saltar»; la letra en nutricionTxt (color de texto de la disciplina).
          bg="transparent"
          color={nutricionTxt}
          border={`2px solid ${nutricionTxt}`}
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
          <Box as="img" src="/img/fondos/nutri.webp" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${nutricionBg}b3`} />
          <Box as="span" position="relative" zIndex={1} display={{ base: "none", md: "inline" }}>{t("metodo.irA", { destino: t("metodo.destino.nutrientes") })}</Box>
          <FlechaBonita position="relative" zIndex={1} size={{ base: "30px", md: "24px" }} />
        </Box>
      </ModalContent>
    </Modal>
  );
}
