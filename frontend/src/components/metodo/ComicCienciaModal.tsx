import React from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// Cómic del Origen «según la ciencia». Usa el mismo frontend (ComicViewer) que
// el resto de cómics, en modo disciplina con el fondo de Fisiología. Se exporta
// para reutilizarlo en la galería de Ilustraciones.
export const ORIGEN_CIENCIA: Vineta[] = [
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio1.png",
    paragraphs: [
      "Hace unos 13.800 millones de años, todo el universo estaba concentrado en un punto diminuto y extremadamente denso.",
      "Entonces ocurrió el Big Bang: el espacio comenzó a expandirse y nacieron las primeras partículas.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio2.png",
    paragraphs: [
      "La gravedad fue reuniendo aquellas partículas.",
      "Así nacieron las primeras estrellas, fábricas donde la fusión nuclear unió las partículas para crear nuevos átomos, como el carbono, el oxígeno o el hierro.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio3.png",
    paragraphs: [
      "Cuando esas estrellas murieron, liberaron los átomos formados por ellas al espacio.",
      "Con ese material se formaron nuevas estrellas, planetas y sistemas solares.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio4.png",
    paragraphs: [
      "Los planetas nacen de los átomos formados por estrellas ahora muertas. Uno de aquellos planetas era la Tierra.",
      "Durante millones de años, fue transformándose hasta convertirse en un lugar capaz de albergar vida.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio5.png",
    paragraphs: [
      "Los átomos se combinaron formando moléculas.",
      "Algunas llegaron a organizarse en células, y con el paso de millones de años, aquellas primeras células dieron origen a toda la diversidad de seres vivos.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio6.png",
    paragraphs: [
      "En la naturaleza, nada se desperdicia.",
      "Los átomos pasan continuamente de unos seres a otros mediante ciclos como los del agua, el carbono, el nitrógeno o el oxígeno. No existe la muerte, todo se transforma.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio7.png",
    paragraphs: [
      "Los átomos que forman tu cuerpo nacieron en el interior de estrellas.",
      "Antes de estar en ti, pudieron formar parte de una montaña, un océano, un animal o una flor. Hoy te forman a ti, mañana puede ser que no.",
    ],
  },
  {
    src: "/viñetas/comicInicioSegunCiencia/inicio8.png",
    paragraphs: [
      "No somos individuos hechos de polvo de estrellas.",
      "Somos el universo experimentándose a sí mismo.",
    ],
  },
];

interface ComicCienciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComicCienciaModal({ isOpen, onClose }: ComicCienciaModalProps) {
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
        {/* key={isOpen}: al reabrir el modal, ComicViewer se remonta y
            empieza desde la viñeta 1 con estado limpio. */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={ORIGEN_CIENCIA}
          onClose={onClose}
          themeColor={fisiologiaTxt}
          disciplinaBgImage="/img/fondos/fisio.png"
          disciplinaBgColor={fisiologiaBg}
        />
      </ModalContent>
    </Modal>
  );
}
