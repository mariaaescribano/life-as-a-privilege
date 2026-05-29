import React from "react";
import { Box } from "@chakra-ui/react";
import {
  astrologiaNom,
  ayurvedaNom,
  cabalaNom,
  culturaNom,
  fisiologiaNom,
  neuropsicologiaNom,
  nutricionNom,
  tcmNom,
} from "../../GlobalVariables";
import { StarsLayer } from "./StarsLayer";

// Cada disciplina con "fondo propio" tiene una imagen en /img/fondos/ (o un
// patrón especial — Astrología usa la capa de estrellas en lugar de imagen).
const DISCIPLINA_BG_IMG: Record<string, string> = {
  [tcmNom]: "/img/fondos/tcm.png",
  [ayurvedaNom]: "/img/fondos/hinduismo.png",
  [neuropsicologiaNom]: "/img/fondos/psciologia.png",
  [fisiologiaNom]: "/img/fondos/fisio.png",
  [nutricionNom]: "/img/fondos/nutri.png",
  [cabalaNom]: "/img/fondos/cabala.png",
  [culturaNom]: "/img/fondos/cultura.png",
};

const ImageBgLayer = ({
  src,
  borderRadius = "2xl",
  overlay,
  strongBlur = false,
}: {
  src: string;
  borderRadius?: any;
  overlay?: string;
  /** Blur extra para los popups, donde el texto es grande y necesita destacar. */
  strongBlur?: boolean;
}) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius={borderRadius}
    zIndex={0}
  >
    <Box
      as="img"
      src={src}
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{
        objectFit: "cover",
        objectPosition: "center",
        // Blur suave para que la foto no compita con el texto. El scale es
        // justo el necesario para que el desenfoque no deje bordes
        // transparentes — nunca un zoom agresivo que coma composición.
        filter: strongBlur ? "blur(8px)" : "blur(3px)",
        transform: strongBlur ? "scale(1.05)" : "scale(1.03)",
      }}
    />
    {overlay && (
      <Box position="absolute" inset="0" style={{ background: overlay }} />
    )}
  </Box>
);

/** ¿Esta disciplina tiene un fondo propio (estrellado o imagen)? */
export const hasDisciplinaBg = (nom: string): boolean =>
  nom === astrologiaNom || nom in DISCIPLINA_BG_IMG;

/** Capa de fondo específica de la disciplina. Devuelve null si no tiene una.
 *  Úsala como hijo absoluto dentro de un contenedor con overflow:hidden y
 *  position:relative. Eleva los demás hijos con position:relative + zIndex≥1.
 *  El prop `blur` activa el desenfoque en Astrología (para popups). Las
 *  imágenes del resto de disciplinas ya van blureadas siempre. */
export const DisciplinaBgLayer = ({
  nom,
  borderRadius,
  overlay,
  blur,
  imageSrc,
}: {
  nom: string;
  borderRadius?: any;
  overlay?: string;
  blur?: boolean;
  /** Sustituye la imagen por defecto de la disciplina por otra (mismo
   *  tratamiento de blur/overlay). Útil cuando un layout concreto pide una
   *  variante (p.ej. TCM vertical en los boxes de los tests). */
  imageSrc?: string;
}) => {
  if (nom === astrologiaNom) {
    return <StarsLayer borderRadius={borderRadius} overlay={overlay} blur={blur} />;
  }
  const src = imageSrc ?? DISCIPLINA_BG_IMG[nom];
  if (!src) return null;
  return <ImageBgLayer src={src} borderRadius={borderRadius} overlay={overlay} strongBlur={blur} />;
};
