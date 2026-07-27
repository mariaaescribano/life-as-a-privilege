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
  [tcmNom]: "/img/fondos/tcm.webp",
  [ayurvedaNom]: "/img/fondos/hinduismo.webp",
  [neuropsicologiaNom]: "/img/fondos/psciologia.webp",
  [fisiologiaNom]: "/img/fondos/fisio.webp",
  [nutricionNom]: "/img/fondos/nutri.webp",
  [cabalaNom]: "/img/fondos/cabala.webp",
  [culturaNom]: "/img/fondos/cultura.webp",
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

// Velo oscuro por defecto para disciplinas cuya imagen tiene zonas muy
// brillantes que compiten con el texto. Cábala (nebulosa con destellos
// dorados) lleva texto dorado, así que sin oscurecer el contraste cae en los
// puntos claros. Este velo plano sube el contraste de forma uniforme. Solo
// se usa cuando el llamante NO pasa su propio `overlay`.
const DISCIPLINA_OVERLAY: Record<string, string> = {
  [cabalaNom]: "rgba(0,0,0,0.4)",
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
  // Enfoque para que NUNCA haya huecos ni aros, independiente del tamaño:
  //  1) Color sólido de la disciplina (fallbackBg) como último respaldo.
  //  2) La MISMA imagen como fondo CSS NÍTIDO en el contenedor (background).
  //     Un `background-image` NO sufre el desvanecido a transparente que sí
  //     tiene `filter: blur()` en los bordes, así que cubre el box completo.
  //  3) Encima, la imagen con `filter: blur()` para el efecto difuminado.
  //     Donde el blur se desvanece en el borde, en vez de asomar el color
  //     claro de respaldo, asoma la imagen nítida del paso 2 → mismo dibujo,
  //     sin aro perceptible, a cualquier tamaño de círculo.
  //  (Antes escalábamos la imagen blureada para empujar el desvanecido fuera
  //   del recorte, pero el margen era relativo al tamaño y en los círculos
  //   pequeños del mandala dejaba un aro claro.)
  const blurPx = strongBlur ? 8 : 0;
  return (
    <Box
      position="absolute"
      inset="0"
      pointerEvents="none"
      overflow="hidden"
      borderRadius={borderRadius}
      zIndex={0}
      bgColor={fallbackBg}
      bgImage={`url('${src}')`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      // En iOS/Safari, `overflow:hidden + border-radius` NO recorta hijos
      // absolutos: la foto se ve como un cuadrado por encima del círculo.
      // Forzar una capa de composición propia (translateZ/isolate) hace que
      // el navegador respete el recorte.
      transform="translateZ(0)"
      sx={{ isolation: "isolate" }}
    >
      {/* Imagen difuminada encima del fondo nítido. Redondeamos también la
          propia imagen además del contenedor: así el recorte circular funciona
          aunque el navegador falle al recortar el hijo contra el padre. */}
      <Box
        as="img"
        src={src}
        alt=""
        loading="eager"
        position="absolute"
        inset="0"
        w="100%"
        h="100%"
        borderRadius={borderRadius}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          filter: `blur(${blurPx}px)`,
          transform: "scale(1.08)",
        }}
      />
      {overlay && (
        <Box
          position="absolute"
          inset="0"
          borderRadius={borderRadius}
          style={{ background: overlay }}
        />
      )}
    </Box>
  );
};

/** ¿Esta disciplina tiene un fondo propio (estrellado o imagen)? */
export const hasDisciplinaBg = (nom: string): boolean =>
  nom === astrologiaNom || nom in DISCIPLINA_BG_IMG;

/** Ruta de la imagen de fondo de la disciplina (undefined si usa estrellado o
 *  no tiene). Útil para reutilizar la foto en franjas/separadores. */
export const disciplinaBgImg = (nom: string): string | undefined => DISCIPLINA_BG_IMG[nom];

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
      overlay={overlay ?? DISCIPLINA_OVERLAY[nom]}
      strongBlur={blur}
      fallbackBg={DISCIPLINA_FALLBACK_BG[nom]}
    />
  );
};
