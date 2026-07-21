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
  /** Ya no se usa: el cómic de intro ahora SIEMPRE aparece (no se marca como
   *  visto). Se mantiene opcional por compatibilidad con las llamadas. */
  onFinish?: () => void;
  /** Se llama al cerrar (X / Escape / tick de la última viñeta). Solo cierra;
   *  como no marca «visto», el cómic volverá a salir la próxima vez. */
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
  /** Animación de espera mientras cada viñeta carga (por defecto, spinner).
   *  Nutrición pasa aquí su manzana (AppleLoader). */
  loader?: React.ReactNode;
  /** Si se define (junto a `onContinue`), muestra un botón a la IZQUIERDA de la
   *  X con esta etiqueta (p.ej. "Astrología"). Sirve para pasar directamente al
   *  contenido de la disciplina sin recorrer todo el cómic. */
  continueLabel?: string;
  /** Acción del botón de continuar (arriba, junto a la X). */
  onContinue?: () => void;
  /** Se llama al TERMINAR el cómic (avanzar más allá de la última viñeta). Si no
   *  se pasa, al terminar se cierra (onClose). Útil para encadenar cómics: el
   *  primero, al acabar, abre el siguiente. */
  onComplete?: () => void;
}

export function IntroComicModal({
  isOpen,
  vinetas,
  onClose,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
  textColor,
  loader,
  continueLabel,
  onContinue,
  onComplete,
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
          onComplete={onComplete}
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
          loader={loader}
          // Si este intro ya pinta su propio botón (p.ej. «Nutrición →») a la
          // izquierda de la X, ocultamos el «Saltar» genérico para no duplicar.
          sinSaltar={!!(continueLabel && onContinue)}
        />

        {/* Botón de continuar (p.ej. "Astrología →"), fijo a la IZQUIERDA de la X
            del ComicViewer. Visible durante todo el cómic para saltar al contenido
            de la disciplina en cualquier momento. */}
        {continueLabel && onContinue && (
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
            bg={themeColor}
            color="#0a0a1a"
            border={`1px solid ${themeColor}`}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.04em"
            whiteSpace="nowrap"
            cursor="pointer"
            boxShadow={`0 0 18px ${themeColor}66, 0 0 40px ${themeColor}33, 0 2px 12px rgba(0,0,0,0.45)`}
            sx={{ backdropFilter: "blur(4px)" }}
            transition="all 0.2s"
            _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 28px ${themeColor}88, 0 0 58px ${themeColor}44` }}
          >
            {continueLabel}
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
}
