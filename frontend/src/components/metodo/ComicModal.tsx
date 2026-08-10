import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// ComicModal — visor inmersivo genérico (sin botón «Leído» ni persistencia).
// Se usa en la galería de Ilustraciones: cada entrada abre este popup con las
// viñetas y el estilo (colores/fondo) de la disciplina a la que pertenece.
// ─────────────────────────────────────────────────────────────────────────

interface ComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  vinetas: Vineta[];
  themeColor?: string;
  /** Modo disciplina: imagen de fondo propia (hinduismo/tcm/fisio). Si se omite,
   *  fondo estrellado por defecto (astrología / espiritualidad). */
  disciplinaBgImage?: string;
  disciplinaBgColor?: string;
  textShadow?: string;
  /** Color de la LETRA si difiere del acento (themeColor). P.ej. Nutrición usa
   *  acento claro (nutricionBg) y letra oscura (nutricionTxt). */
  textColor?: string;
  /** Color de la X de cerrar (se pasa tal cual a ComicViewer). Nutrición la pide
   *  en nutricionTxt, no blanca. */
  cerrarColor?: string;
  /** El cómic ya se había leído antes de abrirlo: sale el aviso discreto
   *  «✓ Leída» arriba del texto (en todas sus viñetas). */
  leida?: boolean;
  /** Animación de espera mientras carga la viñeta. El ComicViewer la elige sola
   *  a partir del `themeColor`, pero solo acierta si ese color es el `<disc>Txt`;
   *  Nutrición pasa acento CLARO (nutricionBg), así que aquí se le pone su
   *  manzana a mano para que no caiga en el mandala de la casa. */
  loader?: React.ReactNode;
}

export function ComicModal({
  isOpen,
  onClose,
  vinetas,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
  textColor,
  cerrarColor,
  leida,
  loader,
}: ComicModalProps) {
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
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
          cerrarColor={cerrarColor}
          loader={loader}
          leida={leida ? () => true : undefined}
          // En la galería de Ilustraciones no hay «Saltar»: es un visor, la X ya
          // cierra. Saltar solo tiene sentido en el cómic de intro de disciplina.
          sinSaltar
        />
      </ModalContent>
    </Modal>
  );
}
