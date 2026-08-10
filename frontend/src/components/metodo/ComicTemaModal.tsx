import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Wrapper genérico de cómic para los temas de PROFUNDIZA (Fisiología). Se abre
// «antes de empezar» un tema (p.ej. «Cómo se sintetiza un neurotransmisor»).
// Reutiliza el ComicViewer con el fondo/colores de Fisiología. La X y el tick
// final simplemente cierran el cómic y dejan al usuario en la página del tema.
// ─────────────────────────────────────────────────────────────────────────
export function ComicTemaModal({
  isOpen,
  vinetas,
  onClose,
  leida = false,
  initialIndex = 0,
  leidaPorIndice,
  onPageView,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  onClose: () => void;
  /** El cómic ya se había leído antes de abrirlo → aviso discreto «✓ Leída». */
  leida?: boolean;
  /** Viñeta por la que abrir. Los temas que muestran el cómic como una rejilla
   *  de cajas (el cáncer) abren por la que se ha pulsado, no por la primera. */
  initialIndex?: number;
  /** Igual que `leida` pero viñeta a viñeta: cuando cada una se marca por su
   *  cuenta, el aviso «✓ Leída» depende de en cuál estés. Tiene prioridad sobre
   *  `leida`, y debe ser la foto fija del estado de ANTES de abrir el visor. */
  leidaPorIndice?: (index: number) => boolean;
  /** Se llama con el índice de cada viñeta que se muestra (también al abrir),
   *  para poder marcarlas leídas según se navega con las flechas. */
  onPageView?: (index: number) => void;
}) {
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
        {/* La key lleva también la viñeta de entrada: al reabrir por otra caja el
            ComicViewer se remonta y arranca en ESA, no donde se quedó. */}
        <ComicViewer
          key={`${String(isOpen)}-${initialIndex}`}
          vinetas={vinetas}
          initialIndex={initialIndex}
          onClose={onClose}
          onComplete={onClose}
          onPageView={onPageView}
          themeColor={fisiologiaTxt}
          disciplinaBgImage="/img/fondos/fisio.webp"
          disciplinaBgColor={fisiologiaBg}
          leida={leidaPorIndice ?? (leida ? () => true : undefined)}
        />
      </ModalContent>
    </Modal>
  );
}
