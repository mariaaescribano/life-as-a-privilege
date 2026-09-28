import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { glowHeader } from "./FotoBox";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

// Piezas COMUNES de las estaciones de construcción de Fisiología (las usan
// /metodo/fisiologia/macromoleculas y /estructuras): compartirlas garantiza
// que la cabecera y el botón de volver sean idénticos en las dos páginas.

// Halo oscuro para leer el texto claro sobre el fondo morado de Fisiología.
export const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;

// ── Caja rectangular con el fondo/brillo de Fisiología ──────────────────────
export function PanelBox({ children, minH, px, py, ...rest }: any) {
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden"
         boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}
         {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%"
           px={px ?? { base: 5, md: 9 }} py={py ?? { base: 7, md: 9 }} minH={minH}>
        {children}
      </Box>
    </Box>
  );
}

// ── Botón «← volver» de una estación ────────────────────────────────────────
// Lleva el fondo propio de Fisiología (DisciplinaBgLayer) y el MISMO halo que
// la cabecera (glowHeader); al pasar por encima se desvanece un velo oscuro.
export function BotonVolverEstacion({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick}
         position="relative" overflow="hidden"
         display="inline-flex" alignItems="center" gap={2} px={4} py={1.5} borderRadius="full"
         color={fisiologiaTxt}
         fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }} cursor="pointer"
         boxShadow={glowHeader(fisiologiaTxt)}
         transition="all 0.2s"
         sx={{ "&:hover .volver-velo": { opacity: 0 } }}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="full" overlay={`${fisiologiaBg}bb`} />
      <Box className="volver-velo" position="absolute" inset={0} borderRadius="full"
           bg="rgba(0,0,0,0.18)" opacity={1} transition="opacity 0.2s" pointerEvents="none" />
      <Box position="relative" zIndex={1} style={{ textShadow: INK }}>
        {label}
      </Box>
    </Box>
  );
}

// ── Cabecera de una estación ────────────────────────────────────────────────
// Caja con el fondo de Fisiología (como el header de la página): título,
// antetítulo en mayúsculas («EXPLICACIÓN») y la instrucción en cursiva.
export function CabeceraEstacion({ titulo, kicker, instruccion }: {
  titulo: string; kicker: string; instruccion: string;
}) {
  return (
    <PanelBox w="100%" mb={5} py={{ base: 5, md: 6 }}>
      <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center"
            style={{ textShadow: INK }}>{titulo}</Text>
      <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
            textTransform="uppercase" textAlign="center" mt={2} opacity={0.75}
            style={{ textShadow: INK }}>
        {kicker}
      </Text>
      <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
            textAlign="center" mt={1} style={{ textShadow: INK }}>
        {instruccion}
      </Text>
    </PanelBox>
  );
}
