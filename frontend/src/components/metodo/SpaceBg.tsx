import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
void React;

// Vida del cielo: las estrellas titilan cada una a su ritmo, la foto se
// desplaza casi imperceptiblemente y de vez en cuando cruza una estrella
// fugaz. Todo con opacidad/transform (barato) y apagado con
// prefers-reduced-motion.
// Cada estrella trae su propio brillo máximo (--pico) y su propio tamaño al brillar (--esc).
const titila = keyframes`
  0%, 100% { opacity: 0.12; transform: scale(0.7); }
  50%      { opacity: var(--pico, 1); transform: scale(var(--esc, 1.25)); }
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

// Posiciones fijas (no aleatorias en cada render) pero DISTINTAS en cada caja si se pasa una `semilla`:
// cada estrella con su ritmo, su retraso, su brillo máximo y su tamaño, para que ninguna brille igual.
const alAzar = (n: number) => { const v = Math.sin(n) * 43758.5453; return v - Math.floor(v); };
const estrellasDe = (semilla: number, cuantas: number) =>
  Array.from({ length: cuantas }, (_, i) => {
    const o = semilla * 1000.37;
    const x = alAzar(i * 12.9898 + o) * 100;
    const y = alAzar(i * 78.233 + 1.7 + o) * 100;
    const k = alAzar(i * 39.346 + 5.1 + o);
    const m = alAzar(i * 11.135 + 9.3 + o);
    const n = alAzar(i * 62.17 + 2.9 + o);
    return {
      x, y,
      d: 1.8 + k * 5.2,            // 1,8 – 7 s por latido
      r: 0.9 + m * 1.5,            // radio del punto
      delay: n * 7,                // empiezan a destiempo
      pico: 0.45 + alAzar(i * 5.77 + o) * 0.55, // brillo máximo
      esc: 1.05 + alAzar(i * 3.31 + o) * 0.6,   // cuánto crece al brillar
    };
  });
const ESTRELLAS = estrellasDe(0, 26);

/** Capa de estrellas que titilan + estrella fugaz. Se puede poner encima de
 *  cualquier fondo de cielo (SpaceBg ya la incluye). */
export const CieloVivo = ({ sinEstrellas = false, estrellas = ESTRELLAS.length, escala = 1, semilla = 0, fugaces = 1 }: { sinEstrellas?: boolean; estrellas?: number; escala?: number; semilla?: number; fugaces?: number }) => {
  const lista = semilla === 0 && estrellas <= ESTRELLAS.length ? ESTRELLAS.slice(0, estrellas) : estrellasDe(semilla, estrellas);
  return (
  <Box position="absolute" inset="0" pointerEvents="none" overflow="hidden" borderRadius="inherit" aria-hidden>
    {!sinEstrellas && lista.map((e, i) => (
      <Box
        key={i}
        position="absolute"
        left={`${e.x}%`}
        top={`${e.y}%`}
        w={`${e.r * 2 * escala}px`}
        h={`${e.r * 2 * escala}px`}
        borderRadius="full"
        bg="white"
        boxShadow={`0 0 ${6 * escala}px ${1 * escala}px rgba(255,255,255,0.8)`}
        opacity={0.12}
        style={{ ["--pico" as string]: e.pico, ["--esc" as string]: e.esc }}
        animation={`${titila} ${e.d}s ease-in-out ${e.delay}s infinite`}
        sx={SIN_MOV}
      />
    ))}
    {/* Estrellas fugaces: cada una a su hora y en su sitio (la primera, la de siempre: una cada ~16 s). */}
    {Array.from({ length: fugaces }, (_, f) => (
      <Box
        key={f}
        position="absolute"
        left={`${f === 0 && semilla === 0 ? 12 : 4 + alAzar(f * 7.7 + semilla * 3.1) * 55}%`}
        top={`${f === 0 && semilla === 0 ? 10 : 4 + alAzar(f * 4.3 + semilla * 5.9) * 70}%`}
        w={`${70 * escala}px`}
        h={`${Math.max(1, 1.5 * escala)}px`}
        borderRadius="full"
        opacity={0}
        bgGradient="linear(to-r, transparent, rgba(255,255,255,0.95))"
        boxShadow={`0 0 ${8 * escala}px rgba(255,255,255,0.7)`}
        animation={`${fugaz} ${f === 0 && semilla === 0 ? 16 : 11 + alAzar(f * 2.2 + semilla) * 12}s linear ${f === 0 && semilla === 0 ? 3 : alAzar(f * 9.1 + semilla * 1.7) * 9}s infinite`}
        sx={SIN_MOV}
      />
    ))}
  </Box>
  );
};

/** Ruta del fondo espacial, para poder precargarla (useImagesReady) desde las
 *  páginas y no mostrarlas hasta que la foto esté lista. */
export const SPACE_IMG = "/img/astrologia/space.webp";

interface SpaceBgProps {
  overlay?: string;
  /** Sin vida: ni estrellas que titilan, ni estrella fugaz, ni deriva de la
   *  foto. Para los popups de LECTURA: quien lee sobre sí mismo tiene que poder
   *  centrarse, y nada debe moverse en los bordes de su atención. */
  quieto?: boolean;
  /** Sin los puntitos que titilan (solo queda la estrella fugaz): para cielos
   *  donde las únicas estrellas visibles deben ser las pulsables. */
  sinEstrellas?: boolean;
  /** Cuántos puntitos que titilan (de 26). Pocos = cielo sobrio y elegante. */
  estrellas?: number;
  /** Tamaño de las estrellas y de la fugaz (1 = el de las cajas grandes; menos = más finas). */
  escala?: number;
  /** Cambia el reparto de las estrellas (cada caja con su propio cielo). 0 = el de siempre. */
  semilla?: number;
  /** Cuántas estrellas fugaces (por defecto 1). */
  fugaces?: number;
}

/* Fondo espacial con degradado cósmico de respaldo */
export const SpaceBg = ({ overlay = "rgba(8,13,30,0.25)", quieto = false, sinEstrellas = false, estrellas, escala, semilla, fugaces }: SpaceBgProps) => (
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
    {!quieto && <CieloVivo sinEstrellas={sinEstrellas} estrellas={estrellas} escala={escala} semilla={semilla} fugaces={fugaces} />}
  </Box>
);
