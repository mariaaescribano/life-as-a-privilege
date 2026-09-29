import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { FlechaBonita } from "../global/FlechaBonita";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Ilustración (cómic) de un grupo de nutrientes, a pantalla completa. Reutiliza
// EXACTAMENTE el mismo visor que las ilustraciones de Medicina China / Hinduismo
// (ComicViewer), con la foto de Nutrición (nutri.png) de fondo y los colores de
// la disciplina. En la página de detalle hace de INTRO: se abre solo al entrar,
// y lleva el botón de continuar arriba, a la IZQUIERDA de la X (el mismo sitio
// que en ComicPasoModal), con el nombre del grupo al que se entra.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_IMG = disciplinaBgImg(nutricionNom) ?? "/img/fondos/nutri.webp";

export function NutrienteIlustracionModal({
  isOpen,
  vinetas,
  onClose,
  leida = false,
  initialIndex = 0,
  continueLabel,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  onClose: () => void;
  /** La ilustración ya se había leído antes de abrirla → aviso «✓ Leída». */
  leida?: boolean;
  /** Viñeta por la que abrir. Lo usa «El hambre», donde cada uno de los cuatro
   *  boxes abre el visor por SU lectura y desde dentro se pasa a las demás. */
  initialIndex?: number;
  /** Si se pasa, pinta el botón de CONTINUAR arriba a la izquierda de la X
   *  (patrón ComicPasoModal): la pastilla con la foto de Nutrición de fondo, el
   *  nombre del destino y la flecha (en móvil, solo la flecha). Pulsa → onClose.
   *  Lo usa el cómic-intro del detalle de un grupo, con el nombre del grupo. */
  continueLabel?: React.ReactNode;
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
        minH="100dvh"
        position="relative"
        fontFamily="'EB Garamond', serif"
        sx={{ transform: "none !important" }}
      >
        {isOpen && (
          <ComicViewer
            vinetas={vinetas}
            initialIndex={initialIndex}
            themeColor={nutricionTxt}
            textColor={nutricionTxt}
            textShadow="none"
            disciplinaBgImage={NUTRI_IMG}
            disciplinaBgColor={nutricionBg}
            loader={<AppleLoader />}
            cerrarColor={nutricionTxt}
            leida={leida ? () => true : undefined}
            onClose={onClose}
            onComplete={onClose}
          />
        )}

        {/* Botón de CONTINUAR — arriba, a la IZQUIERDA de la X, en el mismo
            sitio y con la misma pastilla que el «Saltar →» de ComicPasoModal,
            pero a la manera de Nutrición: la foto de la disciplina SIN velo
            oscuro (velo claro nutricionBg, como las cajas) y texto nutricionTxt.
            En el móvil se queda en la flecha sola. */}
        {isOpen && continueLabel != null && (
          <Box
            as="button"
            onClick={onClose}
            position="fixed"
            top={{ base: 3, md: 5 }}
            right={{ base: "74px", md: "90px" }}
            zIndex={11}
            overflow="hidden"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            h={{ base: "42px", md: "48px" }}
            px={{ base: 4, md: 6 }}
            borderRadius="full"
            border={`2px solid ${nutricionTxt}`}
            color={nutricionTxt}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.04em"
            whiteSpace="nowrap"
            cursor="pointer"
            boxShadow="0 2px 12px rgba(0,0,0,0.25)"
            transition="all 0.2s"
            _hover={{ transform: "translateY(-1px)" }}
          >
            <Box as="img" src={NUTRI_IMG} alt="" loading="eager" position="absolute" inset="0"
                 w="100%" h="100%"
                 style={{ objectFit: "cover", objectPosition: "center", filter: "saturate(1.05)" }}
                 pointerEvents="none" />
            <Box position="absolute" inset="0" bg={`${nutricionBg}55`} />
            <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" gap={2}>
              <Box as="span" display={{ base: "none", md: "inline" }}>{continueLabel}</Box>
              <FlechaBonita position="relative" zIndex={1} size={{ base: "30px", md: "24px" }} />
            </Box>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
}
