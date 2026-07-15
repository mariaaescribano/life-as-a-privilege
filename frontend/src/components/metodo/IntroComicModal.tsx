import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// IntroComicModal — cómic de bienvenida que se muestra la PRIMERA vez que el
// usuario entra en una disciplina (tras pagar). Reutiliza el ComicViewer, y en
// la ÚLTIMA viñeta añade un botón «Gracias, no volver a ver» que confirma la
// intro (el padre persiste el flag `intro_visto` y cierra).
//
//   · onFinish → última viñeta: botón «Gracias, no volver a ver» o el tick.
//                El padre marca intro_visto=true y cierra. No volverá a salir.
//   · onClose  → la X / Escape: cierra sin marcar (podrá reaparecer al reentrar).
// ─────────────────────────────────────────────────────────────────────────

interface IntroComicModalProps {
  isOpen: boolean;
  vinetas: Vineta[];
  /** Se llama al terminar el cómic (botón final o tick). Persiste + cierra. */
  onFinish: () => void;
  /** Se llama al cerrar sin terminar (X / Escape). Solo cierra. */
  onClose: () => void;
  /** Color de acento. Por defecto el dorado de astrología (que usa fondo
   *  estrellado). Ayurveda/TCM pasan el color de su disciplina. */
  themeColor?: string;
  /** Modo disciplina: imagen de fondo propia (p.ej. hinduismo/tcm/fisio). Si se
   *  omite, se usa el fondo estrellado por defecto (astrología). */
  disciplinaBgImage?: string;
  /** Color hex del fondo de la disciplina (para el velo/glow del box). */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas (opcional; ComicViewer tiene su default). */
  textShadow?: string;
  /** Color de la LETRA de las viñetas, si difiere del acento (themeColor). P.ej.
   *  Nutrición: acento claro (nutricionBg) para cajas/líneas y letra oscura
   *  (nutricionTxt) para que se lea sobre el fondo claro. */
  textColor?: string;
}

export function IntroComicModal({
  isOpen,
  vinetas,
  onFinish,
  onClose,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
  textColor,
}: IntroComicModalProps) {
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
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onFinish}
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
          pageExtra={(_index, { isLast }) =>
            isLast ? (
              <Box display="flex" justifyContent="center">
                <Box
                  as="button"
                  onClick={onFinish}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={{ base: 7, md: 9 }}
                  py={{ base: 2.5, md: 3 }}
                  borderRadius="full"
                  bg={themeColor}
                  color="#0a0a1a"
                  border={`1px solid ${themeColor}`}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.05em"
                  cursor="pointer"
                  boxShadow={`0 0 18px ${themeColor}66, 0 0 40px ${themeColor}33`}
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${themeColor}88, 0 0 58px ${themeColor}44` }}
                >
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
                    <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  Leído
                </Box>
              </Box>
            ) : null
          }
        />
      </ModalContent>
    </Modal>
  );
}
