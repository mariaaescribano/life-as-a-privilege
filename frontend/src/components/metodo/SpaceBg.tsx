import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
void React;

// Vida del cielo: las estrellas titilan cada una a su ritmo, la foto se
// desplaza casi imperceptiblemente y de vez en cuando cruza una estrella
// fugaz. Todo con opacidad/transform (barato) y apagado con
// prefers-reduced-motion.
const titila = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(0.7); }
  50%      { opacity: 1;    transform: scale(1.25); }
`;
const deriva = keyframes`
  from { transform: scale(1.03) translate3d(0, 0, 0); }
  to   { transform: scale(1.09) translate3d(-1.2%, -0.8%, 0); }
`;
const fugaz = keyframes`
  0%, 84%  { opacity: 0; transform: translate3d(0, 0, 0) rotate(28deg); }
  86%      { opacity: 1; }
  100%     { opacity: 0; transform: translate3d(190px, 105px, 0) rotate(28deg); }
`;
const SIN_MOV = { "@media (prefers-reduced-motion: reduce)": { animation: "none !important" } };

// Posiciones fijas (no aleatorias en cada render): 26 estrellas repartidas.
const ESTRELLAS = Array.from({ length: 26 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 24634.6345;
  const x = (a - Math.floor(a)) * 100;
  const y = (b - Math.floor(b)) * 100;
  return { x, y, d: 2.4 + (i % 5) * 0.7, r: 1 + (i % 3) * 0.6, delay: (i * 0.53) % 4 };
});

/** Capa de estrellas que titilan + estrella fugaz. Se puede poner encima de
 *  cualquier fondo de cielo (SpaceBg ya la incluye). */
export const CieloVivo = () => (
  <Box position="absolute" inset="0" pointerEvents="none" overflow="hidden" borderRadius="inherit" aria-hidden>
    {ESTRELLAS.map((e, i) => (
      <Box
        key={i}
        position="absolute"
        left={`${e.x}%`}
        top={`${e.y}%`}
        w={`${e.r * 2}px`}
        h={`${e.r * 2}px`}
        borderRadius="full"
        bg="white"
        boxShadow="0 0 6px 1px rgba(255,255,255,0.8)"
        opacity={0.15}
        animation={`${titila} ${e.d}s ease-in-out ${e.delay}s infinite`}
        sx={SIN_MOV}
      />
    ))}
    {/* Estrella fugaz: una cada ~16 s, desde arriba a la izquierda. */}
    <Box
      position="absolute"
      left="12%"
      top="10%"
      w="70px"
      h="1.5px"
      borderRadius="full"
      opacity={0}
      bgGradient="linear(to-r, transparent, rgba(255,255,255,0.95))"
      boxShadow="0 0 8px rgba(255,255,255,0.7)"
      animation={`${fugaz} 16s linear 3s infinite`}
      sx={SIN_MOV}
    />
  </Box>
);

/** Ruta del fondo espacial, para poder precargarla (useImagesReady) desde las
 *  páginas y no mostrarlas hasta que la foto esté lista. */
export const SPACE_IMG = "/img/astrologia/space.webp";

interface SpaceBgProps {
  overlay?: string;
  /** Sin vida: ni estrellas que titilan, ni estrella fugaz, ni deriva de la
   *  foto. Para los popups de LECTURA: quien lee sobre sí mismo tiene que poder
   *  centrarse, y nada debe moverse en los bordes de su atención. */
  quieto?: boolean;
}

/* Fondo espacial con degradado cósmico de respaldo */
export const SpaceBg = ({ overlay = "rgba(8,13,30,0.25)", quieto = false }: SpaceBgProps) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src={SPACE_IMG}
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 1 }}
      animation={quieto ? undefined : `${deriva} 46s ease-in-out infinite alternate`}
      sx={SIN_MOV}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
    {!quieto && <CieloVivo />}
  </Box>
);
