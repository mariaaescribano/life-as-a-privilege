import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { nutricionTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// AppleLoader — animación de espera de Nutrición: una manzana que da botes
// (con su squash/stretch), la hoja que se mece y una sombra que respira debajo.
// Sustituye al spinner mientras la ilustración de un cómic de Nutrición carga.
// Todo es CSS/SVG (sin imágenes ni librerías), así que es ligerísima.
//
// Estética «madura»: en vez de una manzana roja brillante (aire de emoji), es
// un ICONO monocromo en el verde de la disciplina (nutricionTxt). Plano y
// sobrio: sin degradado ni brillo especular; la hoja va en el mismo verde a
// menor opacidad para distinguirse del cuerpo.
// ─────────────────────────────────────────────────────────────────────────

// La manzana bota: al caer se aplasta un poco (más ancha, más baja) y en el
// punto más alto se estira. transform-origin en su base (60,100) para que el
// aplastado salga natural desde el suelo.
const bob = keyframes`
  0%   { transform: translateY(0)     scale(1.05, 0.95); }
  20%  { transform: translateY(-5px)  scale(1, 1); }
  50%  { transform: translateY(-20px) scale(0.97, 1.04); }
  80%  { transform: translateY(-5px)  scale(1, 1); }
  100% { transform: translateY(0)     scale(1.05, 0.95); }
`;

// La hoja se mece suavemente desde su base (junto al rabito).
const sway = keyframes`
  0%   { transform: rotate(-9deg); }
  50%  { transform: rotate(7deg); }
  100% { transform: rotate(-9deg); }
`;

// La sombra se encoge y aclara cuando la manzana sube.
const shadowPulse = keyframes`
  0%   { transform: scaleX(1);    opacity: 0.30; }
  50%  { transform: scaleX(0.72); opacity: 0.15; }
  100% { transform: scaleX(1);    opacity: 0.30; }
`;

const DUR = "1.5s";

export function AppleLoader({
  label = null,
  color = nutricionTxt,
  size,
}: { label?: string | null; color?: string; size?: any }) {
  const w = size ?? { base: "78px", md: "92px" };
  return (
    <Flex direction="column" align="center" justify="center" gap={4}>
      <Box as="svg" viewBox="0 0 120 120" w={w} h={w}
           overflow="visible" aria-label="Cargando">
        {/* Sombra en el suelo (no bota con la manzana) */}
        <Box
          as="ellipse"
          cx={60}
          cy={114}
          rx={27}
          ry={5}
          fill={color}
          opacity={0.28}
          animation={`${shadowPulse} ${DUR} ease-in-out infinite`}
          sx={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* Grupo que bota (manzana + hoja), todo en el verde de la disciplina */}
        <Box
          as="g"
          animation={`${bob} ${DUR} ease-in-out infinite`}
          sx={{ transformBox: "view-box", transformOrigin: "60px 100px" }}
        >
          {/* Rabito */}
          <path
            d="M60 34 C 61 25, 62 18, 66 13"
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
          />

          {/* Hoja (mece desde su base junto al rabito); mismo verde, más suave
              para separarla del cuerpo sin salir de la gama monocroma */}
          <Box
            as="path"
            d="M65 24 C 76 8, 99 9, 99 18 C 99 30, 77 35, 65 24 Z"
            fill={color}
            fillOpacity={0.55}
            animation={`${sway} 2.1s ease-in-out infinite`}
            sx={{ transformBox: "view-box", transformOrigin: "66px 25px" }}
          />

          {/* Cuerpo de la manzana (dos lóbulos con el hoyuelo arriba), sólido */}
          <path
            d="M60 36
               C 50 21, 25 23, 23 51
               C 21 80, 42 101, 60 101
               C 78 101, 99 80, 97 51
               C 95 23, 70 21, 60 36 Z"
            fill={color}
          />
        </Box>
      </Box>

      {label && (
        <Text color={color} fontFamily="'EB Garamond', serif" fontStyle="italic"
              fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.7)" }}>
          {label}
        </Text>
      )}
    </Flex>
  );
}
