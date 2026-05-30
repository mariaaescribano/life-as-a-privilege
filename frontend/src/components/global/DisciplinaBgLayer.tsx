import React from "react";
import { Box } from "@chakra-ui/react";
import {
  astrologiaNom,
  ayurvedaBg,
  ayurvedaNom,
  cabalaBg,
  cabalaNom,
  culturaBg,
  culturaNom,
  fisiologiaBg,
  fisiologiaNom,
  neuropsicologiaBg,
  neuropsicologiaNom,
  nutricionBg,
  nutricionNom,
  tcmBg,
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

// Color sólido de respaldo por disciplina. Se pinta DEBAJO de la imagen
// para rellenar cualquier hueco transparente (causado por el blur que
// desvanece los bordes hacia transparente, y por el bug de compositing del
// navegador cuando un hijo con `filter:` está dentro de un padre con
// `overflow:hidden + border-radius`).
const DISCIPLINA_FALLBACK_BG: Record<string, string> = {
  [tcmNom]: tcmBg,
  [ayurvedaNom]: ayurvedaBg,
  [neuropsicologiaNom]: neuropsicologiaBg,
  [fisiologiaNom]: fisiologiaBg,
  [nutricionNom]: nutricionBg,
  [cabalaNom]: cabalaBg,
  [culturaNom]: culturaBg,
};

const ImageBgLayer = ({
  src,
  borderRadius = "2xl",
  overlay,
  strongBlur = false,
  fallbackBg,
}: {
  src: string;
  borderRadius?: any;
  overlay?: string;
  /** Blur extra para los popups, donde el texto es grande y necesita destacar. */
  strongBlur?: boolean;
  /** Color sólido detrás de la imagen como respaldo (poco probable que se
   *  vea ahora que el blur se aplica vía backdrop-filter, pero es un seguro
   *  por si el navegador no soporta backdrop-filter). */
  fallbackBg?: string;
}) => {
  // Truco: usamos `backdrop-filter: blur()` en una capa hermana SOBRE la
  // imagen, en lugar de `filter: blur()` directo en el <img>. La diferencia
  // es clave: `filter: blur()` muestrea píxeles fuera del bounds del <img>
  // (los cuenta como transparentes) → bordes que se desvanecen a transparente.
  // `backdrop-filter` opera sobre lo que ya está pintado DETRÁS dentro del
  // contenedor → no hay "fuera de la imagen", no hay bordes transparentes,
  // la foto rellena todo el box hasta las esquinas redondeadas.
  const blurPx = strongBlur ? 8 : 3;
  return (
    <Box
      position="absolute"
      inset="0"
      pointerEvents="none"
      overflow="hidden"
      borderRadius={borderRadius}
      zIndex={0}
      bg={fallbackBg}
    >
      {/* Imagen NÍTIDA que cubre todo el box. Sin filter para que no se
          desvanezcan los bordes. */}
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
        }}
      />
      {/* Capa transparente que difumina lo que tiene detrás (la imagen
          nítida) → la imagen aparece blureada sin generar bordes
          transparentes. */}
      <Box
        position="absolute"
        inset="0"
        sx={{
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      />
      {overlay && (
        <Box position="absolute" inset="0" style={{ background: overlay }} />
      )}
    </Box>
  );
};

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
  return (
    <ImageBgLayer
      src={src}
      borderRadius={borderRadius}
      overlay={overlay}
      strongBlur={blur}
      fallbackBg={DISCIPLINA_FALLBACK_BG[nom]}
    />
  );
};
