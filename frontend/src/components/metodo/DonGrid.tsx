// ─────────────────────────────────────────────────────────────────────────
// DonGrid · rejilla de dones (boxes cuadrados), gemela de HeridaGrid.
//
// Se usa igual en dos páginas: al reunir los dones (el espejo) y en el listado
// («Tus dones»). Cada don es un box CUADRADO con su color (tonos claros, los
// mismos de la paleta del espejo), el icono de las manos a la izquierda, el
// nombre del don con una raya horizontal y debajo las piezas unidas
// (recuerdos ❝ y arquetipos).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import { RevealStagger, RevealItem } from "../global/Reveal";
import { Glifo } from "./Glifo";
import { cuerpoByKey } from "./astrologiaData";
import { arquetipoLabel } from "./integracionSimbolos";
import { neuropsicologiaTxt } from "../../GlobalVariables";
import { glowPanel } from "./psicologiaGlow";
import { arquetipoKey, type DonReconocido } from "./psicologiaRecorrido";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";

// Cada don toma un color por su posición (tonos CLAROS, como la paleta pastel
// de las heridas: nada oscuro; colores contiguos siempre distintos).
export const PALETA_DON = [
  "#e9d7a8", // oro claro
  "#e6c3b0", // terracota claro
  "#c6dbc8", // salvia claro
  "#d7cde8", // lavanda claro
  "#c1d8e6", // azul sereno claro
  "#ecccd9", // rosa palo claro
  "#d6dfb6", // oliva claro
  "#e4cfb2", // ámbar claro
];
export const colorDonIdx = (i: number): string =>
  PALETA_DON[((i % PALETA_DON.length) + PALETA_DON.length) % PALETA_DON.length];

// Icono de «don»: manos ofreciendo. Toma el color que se le pase.
export const DonIcon = ({ color, size = 20, glow }: { color: string; size?: number; glow?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={`${size}px`} h={`${size}px`} fill={color} flexShrink={0} display="inline-block"
       style={glow ? { filter: `drop-shadow(0 0 8px ${glow})` } : undefined}>
    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 19-16.5 39.5T472-358q0 30 10.5 59.5T519-243l84 83H160Zm556 0L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z" />
  </Box>
);

// Glifo de «recuerdo» (lo que la persona recordó de sí): una cita/comilla.
export const RecuerdoGlyph = ({ size = 14 }: { size?: number }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color: TINTA }}>❝</Box>
);

/** Pieza dentro de un don (chip de solo lectura). */
function Pieza({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Flex align="center" gap={2} px={3} py={1.5} borderRadius="full"
          bg={`${PAPEL}e8`} color={TINTA} border={`1px solid ${TINTA}30`}
          boxShadow={`0 1px 3px rgba(40,18,4,0.10), inset 0 1px 0 ${PAPEL}`}>
      {icon}
      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600" lineHeight="1.25" noOfLines={1}>{label}</Text>
    </Flex>
  );
}

/** Un box CUADRADO de don: icono a la izquierda, color propio, nombre con raya
 *  horizontal y debajo las piezas unidas. `onBorrar` opcional (muestra la ✕). */
export function DonCard({ don, color, onBorrar }: {
  don: DonReconocido;
  color: string;
  onBorrar?: () => void;
}) {
  const t = useT();
  // Blindaje: datos guardados con una forma antigua podían venir sin listas.
  const recuerdos = don.recuerdos || [];
  const arquetipos = don.arquetipos || [];
  const vacio = recuerdos.length === 0 && arquetipos.length === 0;
  return (
    // En móvil el box CRECE hacia abajo con su contenido (sin tope ni scroll
    // interno); el tope y el scroll de dentro son solo de escritorio.
    <Box position="relative" borderRadius="2xl" overflow="hidden" h="100%"
         minH={{ base: "180px", md: "210px" }} maxH={{ base: "none", md: "340px" }}
         // Glow ligero de la casa (glowPanel), no sombra oscura de profundidad:
         // sobre el turquesa, la sombra negra hacía flotar el box como un modal.
         boxShadow={glowPanel}
         border={`1px solid ${TINTA}26`}>
      {/* Lavado de color propio del don (a plena tinta: son tonos claros,
          como en las heridas) */}
      <Box position="absolute" inset={0} bgGradient={`linear(155deg, ${PAPEL}, ${color})`} />
      <Box position="absolute" inset={0} bgGradient={`radial(120% 80% at 20% 0%, ${PAPEL}cc, transparent 60%)`} pointerEvents="none" />
      <Box position="absolute" inset={0} boxShadow={`inset 0 0 0 1px ${PAPEL}66, inset 0 1px 0 ${PAPEL}`} pointerEvents="none" />

      <Flex position="relative" zIndex={1} direction="column" h="100%" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
        {/* Cabecera: icono a la izquierda + nombre + borrar */}
        <Flex align="center" gap={2.5}>
          <Flex flexShrink={0} align="center" justify="center" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }}
                borderRadius="full" bg={`${PAPEL}ec`} border={`1px solid ${TINTA}40`}
                boxShadow={`0 2px 6px rgba(40,18,4,0.18), inset 0 1px 0 ${PAPEL}`}>
            {/* En TINTA (no en el color del don): con la paleta clara, el
                icono en su color no se leía sobre el círculo crema. */}
            <DonIcon color={TINTA} size={19} />
          </Flex>
          <Text flex="1" minW={0} color={TINTA} fontWeight="700" lineHeight="1.2"
                fontSize={{ base: "md", md: "lg" }} noOfLines={2} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
            {(don.texto || "").trim() || t("metodo.psico.donSinNombre")}
          </Text>
          {onBorrar && (
            <Box as="button" onClick={onBorrar} flexShrink={0} w="24px" h="24px" borderRadius="full"
                 bg={`${PAPEL}b3`} color={TINTA} display="flex" alignItems="center" justifyContent="center"
                 fontSize="11px" cursor="pointer" border={`1px solid ${TINTA}22`} transition="all 0.16s"
                 _hover={{ bg: `${TINTA}22`, transform: "scale(1.08)" }} title={t("metodo.psico.borrarDon")}>✕</Box>
          )}
        </Flex>

        {/* Raya horizontal bajo el nombre, en degradado */}
        <Box h="1px" w="100%" my={{ base: 3, md: 3.5 }} flexShrink={0}
             bgGradient={`linear(to-r, ${TINTA}55, ${TINTA}22, transparent)`} />

        {/* Piezas unidas */}
        <Box flex="1" minH={0} overflowY={{ base: "visible", md: "auto" }}
             sx={{ scrollbarWidth: "thin", scrollbarColor: `${TINTA}55 transparent`,
                   "&::-webkit-scrollbar": { width: "6px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          {vacio ? (
            <Flex align="center" justify="center" h="100%">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize={{ base: "sm", md: "md" }}>{t("metodo.sinPiezas")}</Text>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {recuerdos.map((r) => <Pieza key={`r-${r}`} icon={<RecuerdoGlyph />} label={r} />)}
              {arquetipos.map((a) => (
                <Pieza key={`a-${arquetipoKey(a)}`}
                       icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
                       label={arquetipoLabel(a)} />
              ))}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

/** Rejilla de dones: 3 columnas en escritorio, como la de heridas. */
export function DonGrid({ dones, onBorrar }: {
  dones: DonReconocido[];
  onBorrar?: (id: string) => void;
}) {
  return (
    // `key` ligado al nº de dones: al añadir (o borrar) uno, el contenedor se
    // remonta y RELANZA la cascada (ver el mismo truco en HeridaGrid).
    <RevealStagger key={`dones-${dones.length}`} display="grid" w="100%"
         gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
         gap={{ base: 4, md: 5 }} stagger={0.06} delayChildren={0.12}>
      {dones.map((d, i) => (
        <RevealItem key={d.id} direction="up" distance={28} scaleFrom={0.95} duration={0.5}>
          <DonCard don={d} color={colorDonIdx(i)}
                   onBorrar={onBorrar ? () => onBorrar(d.id) : undefined} />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}
