// ─────────────────────────────────────────────────────────────────────────
// RelacionGrid · rejilla de relaciones (boxes cuadrados), gemela de HeridaGrid.
//
// Se usa igual en dos páginas: al construir las relaciones («Relación») y en el
// listado («Tus relaciones»). Cada relación es un box CUADRADO, de un color
// distinto (la misma paleta pastel que las heridas), con el icono a la
// izquierda, el título con una raya horizontal y debajo las piezas reunidas
// (heridas y arquetipos) y, si la hay, la frase que escribió la persona.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import { RevealStagger, RevealItem } from "../global/Reveal";
import { RelacionIcon } from "./RelacionIcon";
import { HeridaIcon } from "./HeridaIcon";
import { Glifo } from "./Glifo";
import { colorHeridaIdx } from "./HeridaGrid";
import { cuerpoByKey } from "./astrologiaData";
import { arquetipoLabel } from "./integracionSimbolos";
import { neuropsicologiaTxt } from "../../GlobalVariables";
import { arquetipoKey, type Constelacion } from "./psicologiaRecorrido";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";

/** El color de una relación por su posición (la misma paleta que las heridas). */
export const colorRelacionIdx = colorHeridaIdx;

/** Pieza dentro de una relación (chip de solo lectura). */
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

/** Un box CUADRADO de relación: icono a la izquierda, color propio, título con
 *  raya horizontal, las piezas y la frase. `onBorrar` opcional (muestra la ✕). */
export function RelacionCard({ relacion, color, onBorrar }: {
  relacion: Constelacion;
  color: string;
  onBorrar?: () => void;
}) {
  const t = useT();
  // Blindaje: datos guardados con una forma antigua podían venir sin listas.
  const nudos = relacion.nudos || [];
  const arquetipos = relacion.arquetipos || [];
  const vacia = nudos.length === 0 && arquetipos.length === 0;
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden" h="100%"
         minH={{ base: "180px", md: "210px" }} maxH={{ base: "300px", md: "340px" }}
         boxShadow={`0 12px 34px rgba(40,18,4,0.20), 0 2px 8px rgba(40,18,4,0.12)`}
         border={`1px solid ${TINTA}26`}>
      {/* Lavado de color propio de la relación + brillo suave arriba */}
      <Box position="absolute" inset={0} bgGradient={`linear(155deg, ${PAPEL}, ${color})`} />
      <Box position="absolute" inset={0} bgGradient={`radial(120% 80% at 20% 0%, ${PAPEL}cc, transparent 60%)`} pointerEvents="none" />
      <Box position="absolute" inset={0} boxShadow={`inset 0 0 0 1px ${PAPEL}66, inset 0 1px 0 ${PAPEL}`} pointerEvents="none" />

      <Flex position="relative" zIndex={1} direction="column" h="100%" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
        {/* Cabecera: icono a la izquierda + título + borrar */}
        <Flex align="center" gap={2.5}>
          <Flex flexShrink={0} align="center" justify="center" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }}
                borderRadius="full" bg={`${PAPEL}ec`} border={`1px solid ${TINTA}40`}
                boxShadow={`0 2px 6px rgba(40,18,4,0.18), inset 0 1px 0 ${PAPEL}`}>
            <RelacionIcon size={19} color={TINTA} />
          </Flex>
          <Text flex="1" minW={0} color={TINTA} fontWeight="700" lineHeight="1.2"
                fontSize={{ base: "md", md: "lg" }} noOfLines={2} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
            {(relacion.titulo || "").trim() || t("metodo.psico.relacionSinTitulo")}
          </Text>
          {onBorrar && (
            <Box as="button" onClick={onBorrar} flexShrink={0} w="24px" h="24px" borderRadius="full"
                 bg={`${PAPEL}b3`} color={TINTA} display="flex" alignItems="center" justifyContent="center"
                 fontSize="11px" cursor="pointer" border={`1px solid ${TINTA}22`} transition="all 0.16s"
                 _hover={{ bg: `${TINTA}22`, transform: "scale(1.08)" }} title={t("metodo.psico.borrarRelacion")}>✕</Box>
          )}
        </Flex>

        {/* Raya horizontal bajo el título, en degradado */}
        <Box h="1px" w="100%" my={{ base: 3, md: 3.5 }} flexShrink={0}
             bgGradient={`linear(to-r, ${TINTA}55, ${TINTA}22, transparent)`} />

        {/* Piezas reunidas + la frase de la persona */}
        <Box flex="1" minH={0} overflowY="auto"
             sx={{ scrollbarWidth: "thin", scrollbarColor: `${TINTA}55 transparent`,
                   "&::-webkit-scrollbar": { width: "6px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          {vacia ? (
            <Flex align="center" justify="center" h="100%">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize={{ base: "sm", md: "md" }}>{t("metodo.sinPiezas")}</Text>
            </Flex>
          ) : (
            <>
              <Flex wrap="wrap" gap={2}>
                {nudos.map((n) => <Pieza key={`n-${n}`} icon={<HeridaIcon size={15} color={TINTA} />} label={n} />)}
                {arquetipos.map((a) => (
                  <Pieza key={`a-${arquetipoKey(a)}`}
                         icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
                         label={arquetipoLabel(a)} />
                ))}
              </Flex>
              {(relacion.texto || "").trim() !== "" && (
                <Text mt={3} color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                      lineHeight="1.6" style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                  {relacion.texto}
                </Text>
              )}
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

/** Rejilla de relaciones: 3 columnas en escritorio, como la de heridas. */
export function RelacionGrid({ relaciones, onBorrar }: {
  relaciones: Constelacion[];
  onBorrar?: (id: string) => void;
}) {
  return (
    // `key` ligado al nº de relaciones: al añadir (o borrar) una, el contenedor
    // se remonta y RELANZA la cascada (ver el mismo truco en HeridaGrid).
    <RevealStagger key={`relaciones-${relaciones.length}`} display="grid" w="100%"
         gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
         gap={{ base: 4, md: 5 }} stagger={0.06} delayChildren={0.12}>
      {relaciones.map((c, i) => (
        <RevealItem key={c.id} direction="up" distance={28} scaleFrom={0.95} duration={0.5}>
          <RelacionCard relacion={c} color={colorRelacionIdx(i)}
                        onBorrar={onBorrar ? () => onBorrar(c.id) : undefined} />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}
