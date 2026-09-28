import React from "react";
import { Box } from "@chakra-ui/react";

// Capa de fondo estrellado (cielo cósmico). Se renderiza absolutamente dentro
// del contenedor padre, con su propio overflow:hidden para clip al borderRadius
// que reciba. Reutilizable en cards, círculos de icono y modales de Astrología.
export const StarsLayer = ({
  borderRadius = "2xl",
  // Velo LIGERO a propósito: el cielo ya es oscuro de por sí y taparlo al 62%
  // (como iba antes) se comía las estrellas. La foto es el estilo de
  // Astrología: tiene que verse.
  overlay = "rgba(8,13,30,0.25)",
  // El prop `blur` se acepta (los llamantes lo siguen pasando) pero se ignora:
  // el cielo de Astrología nunca se difumina.
  blur: _blur = false,
  talCual = false,
}: {
  borderRadius?: any;
  overlay?: string;
  blur?: boolean;
  /** La foto TAL CUAL: sin velo de color encima y sin bajarle la opacidad.
   *  Se ve el color real de la imagen. Solo para sitios donde el texto ya se
   *  lee bien sobre la foto (el panel de admin de Astrología). */
  talCual?: boolean;
}) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius={borderRadius}
    zIndex={0}
    // En iOS/Safari, `overflow:hidden + border-radius` no recorta los hijos
    // absolutos → la foto se vería como cuadrado sobre el círculo. Forzar capa
    // de composición propia + redondear cada hijo arregla el recorte.
    transform="translateZ(0)"
    sx={{ isolation: "isolate" }}
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/astrologia/space.webp"
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
        // Siempre a plena opacidad y SIN blur: la foto del espacio no se
        // apaga ni se difumina (el prop `blur` se conserva por los llamantes,
        // pero ya no hace nada — la legibilidad la ponen las cajitas de tinta
        // de cada popup, no estropear el cielo).
        opacity: 1,
      }}
    />
    {!talCual && (
      <Box position="absolute" inset="0" borderRadius={borderRadius} style={{ background: overlay }} />
    )}
  </Box>
);
