import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
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
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
          loader={loader}
        />
      </ModalContent>
    </Modal>
  );
}
