import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { fisiologiaTxt } from "../../GlobalVariables";
import { glowHeader } from "./FotoBox";

const SILUETA = "/recorrido/fisiologia/organos/anatomia.webp";
/** Proporción real de la imagen (933 × 1400). */
const RATIO = "933 / 1400";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// ─────────────────────────────────────────────────────────────────────────
// SiluetaAvance · el cuerpo que se va encendiendo de la cabeza a los pies.
//
// Es SOLO un indicador de avance (no se pulsa: la silueta-navegador de «Todas
// tus células» se quitó porque no funcionaba bien). `hasta` es el % de altura
// hasta el que está iluminada; al entrar sube desde 0 y cada vez que cambia
// recorre el tramo nuevo. Sin blur: la foto va nítida, solo se apaga con
// brillo y saturación.
// ─────────────────────────────────────────────────────────────────────────
export function SiluetaAvance({ hasta, maxW = "340px" }: { hasta: number; maxW?: any }) {
  const objetivo = Math.min(100, Math.max(0, hasta));
  // Arranca en 0 y sube al montar: la iluminación se VE entrar.
  const [mostrado, setMostrado] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setMostrado(objetivo), 450);
    return () => window.clearTimeout(id);
  }, [objetivo]);

  const linea = mostrado > 0 && mostrado < 100;

  return (
    <Box
      position="relative"
      w="100%"
      maxW={maxW}
      mx="auto"
      borderRadius="2xl"
      overflow="hidden"
      bg="#000"
      boxShadow={glowHeader(fisiologiaTxt)}
      sx={{ aspectRatio: RATIO }}
    >
      {/* Apagada: el cuerpo entero, a oscuras. */}
      <Box
        as="img"
        src={SILUETA}
        alt=""
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        style={{ objectFit: "cover", filter: "grayscale(1) brightness(0.3)" }}
      />
      {/* Encendida: la misma foto, a todo color, recortada hasta `mostrado`. */}
      <Box
        position="absolute"
        inset={0}
        style={{
          clipPath: `inset(0 0 ${100 - mostrado}% 0)`,
          transition: `clip-path 1.5s ${EASE}`,
        }}
      >
        <Box as="img" src={SILUETA} alt="" w="100%" h="100%" style={{ objectFit: "cover" }} />
      </Box>
      {/* La línea de luz en el borde del avance. */}
      <Box
        position="absolute"
        left={0}
        right={0}
        h="2px"
        pointerEvents="none"
        bgGradient={`linear(to-r, transparent, #ffffffd9, transparent)`}
        boxShadow={`0 0 12px rgba(255,255,255,0.7), 0 0 30px ${fisiologiaTxt}99`}
        style={{
          top: `${mostrado}%`,
          opacity: linea ? 1 : 0,
          transition: `top 1.5s ${EASE}, opacity 0.5s ease`,
        }}
      />
    </Box>
  );
}
