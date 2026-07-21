import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { AppleLoader } from "./AppleLoader";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// Ficha de una tarjeta de nutriente (Glucosa, Fructosa…). Usa EXACTAMENTE el
// popup de «Ilustraciones» (ComicViewer), igual que la ilustración del grupo:
// foto a la izquierda, título + texto a la derecha, flechas/teclado y contador.
// Se abre en la tarjeta pulsada y se puede navegar por el resto.
// Fondo con la foto de Nutrición (nutri.png), colores de la disciplina y el
// texto SIN sombra.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_IMG = disciplinaBgImg(nutricionNom) ?? "/img/fondos/nutri.png";

export function NutrienteFichaModal({
  tarjetas,
  index,
  onClose,
  sinSaltar,
}: {
  tarjetas: NutrienteTarjeta[];
  index: number;
  onClose: () => void;
  /** Ya no se usa: el ComicViewer navega internamente. Se mantiene opcional por
   *  compatibilidad con las páginas que aún lo pasan. */
  onSelect?: (i: number) => void;
  /** Oculta el botón «Saltar»: en galerías de tarjetas independientes (mitos,
   *  preguntas…) saltar no tiene sentido, no son un cómic secuencial. */
  sinSaltar?: boolean;
}) {
  const vinetas: Vineta[] = tarjetas.map((t) => ({
    src: t.foto || "",
    paragraphs: t.parrafos,
    titulo: t.titulo,
  }));

  return (
    <Modal isOpen onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg={nutricionBg} sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        minH="100vh"
        position="relative"
        fontFamily="'EB Garamond', serif"
        sx={{ transform: "none !important" }}
      >
        <ComicViewer
          vinetas={vinetas}
          initialIndex={index}
          themeColor={nutricionTxt}
          textColor={nutricionTxt}
          textShadow="none"
          disciplinaBgImage={NUTRI_IMG}
          disciplinaBgColor={nutricionBg}
          loader={<AppleLoader />}
          sinSaltar={sinSaltar}
          onClose={onClose}
          onComplete={onClose}
        />
      </ModalContent>
    </Modal>
  );
}
