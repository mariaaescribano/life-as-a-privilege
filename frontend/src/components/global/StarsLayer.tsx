import React from "react";
import { Box } from "@chakra-ui/react";

// Capa de fondo estrellado (cielo cósmico). Se renderiza absolutamente dentro
// del contenedor padre, con su propio overflow:hidden para clip al borderRadius
// que reciba. Reutilizable en cards, círculos de icono y modales de Astrología.
export const StarsLayer = ({
  borderRadius = "2xl",
  overlay = "rgba(8,13,30,0.62)",
  blur = false,
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
      src="/img/astrologia/space.jpg"
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
        opacity: talCual ? 1 : 0.85,
        // Blur opcional: las cards de Astrología no llevan blur, pero los
        // popups sí — con blur fuerte para que las letras destaquen del fondo.
        ...(blur ? { filter: "blur(8px)", transform: "scale(1.12)" } : {}),
      }}
    />
    {!talCual && (
      <Box position="absolute" inset="0" borderRadius={borderRadius} style={{ background: overlay }} />
    )}
  </Box>
);
