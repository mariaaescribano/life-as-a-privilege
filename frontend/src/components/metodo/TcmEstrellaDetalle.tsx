import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import { ELEMENTOS, ORDEN_ELEMENTOS, type Elemento, type Balance } from "./tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO, CONTENIDO_ELEMENTOS } from "./tcmElementosContenido";

const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

const ESTADO_LABEL: Record<Balance, string> = {
  equilibrio: "En equilibrio", exceso: "En exceso", deficiencia: "En deficiencia",
};
const ESTADO_COLOR: Record<Balance, string> = {
  equilibrio: "#6f9463", exceso: "#d1495b", deficiencia: "#c8963e",
};

// Geometría del pentágono selector (centrada en el viewBox 400×348).
const CX = 200, CY = 184, R = 110, FOTO_R = 52;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export type EstadoElemento = { balance: Balance | null; nivel: number | null };

/**
 * Box "estrella de los cinco elementos + tu mensaje": pentágono selector a la
 * izquierda y detalle (foto de fondo + estado + texto) del elemento activo a la
 * derecha. Fuente única de verdad para Equilibrio y Diagnóstico.
 */
export function TcmEstrellaDetalle({ estados, predominante }: {
  estados: Partial<Record<Elemento, EstadoElemento>>;
  predominante: Elemento;
}) {
  const [elActivo, setElActivo] = useState<Elemento>(predominante);
  useEffect(() => { setElActivo(predominante); }, [predominante]);

  const E = ELEMENTOS[elActivo];
  const C = CONTENIDO_ELEMENTOS[elActivo];
  const balance = estados[elActivo]?.balance ?? null;
  const parrafos = balance ? C[balance] : C.intro;

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={5} w="100%" align="stretch">
      {/* Izquierda · la estrella de los cinco elementos (selector) */}
      <Box w={{ base: "100%", md: "540px" }} flexShrink={0}>
        <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
          <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
          <Box position="relative" zIndex={1} px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }} h="100%">
            <Flex justify="center" align="center" h="100%" minH={{ md: "440px" }}>
              <Box as="svg" viewBox="0 0 400 348" w={{ base: "340px", md: "480px" }} h="auto" overflow="visible">
                <defs>
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const v = vertice(i, R);
                    return (
                      <clipPath id={`star-clip-${el}`} key={el}>
                        <circle cx={v.x} cy={v.y} r={FOTO_R} />
                      </clipPath>
                    );
                  })}
                </defs>
                <polygon points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R); return `${v.x},${v.y}`; }).join(" ")}
                         fill="none" stroke={`${tcmTxt}55`} strokeWidth={1.5} />
                {ORDEN_ELEMENTOS.map((el, i) => {
                  const v = vertice(i, R);
                  const label = vertice(i, R + 64);
                  const Ei = ELEMENTOS[el];
                  const activo = el === elActivo;
                  return (
                    <g key={el} style={{ cursor: "pointer" }} onClick={() => setElActivo(el)}>
                      <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                      <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                             width={FOTO_R * 2} height={FOTO_R * 2}
                             clipPath={`url(#star-clip-${el})`} preserveAspectRatio="xMidYMid slice"
                             opacity={activo ? 1 : 0.6} />
                      <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none"
                              stroke={activo ? "white" : `${Ei.color}aa`} strokeWidth={activo ? 3 : 2}
                              style={{ filter: `drop-shadow(0 0 ${activo ? 7 : 3}px ${Ei.color})` }} />
                      <text x={label.x} y={label.y} fill="white" fontSize={15} fontWeight={activo ? 800 : 600}
                            textAnchor="middle" dominantBaseline="middle"
                            style={{ textShadow: "0 1px 4px rgba(58,10,10,0.95)" }}>
                        {Ei.nombre}
                      </text>
                    </g>
                  );
                })}
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* Derecha · detalle con la foto del elemento de fondo */}
      <Box flex="1" minW={0}>
        <Box position="relative" w="100%" h="100%" minH={{ base: "420px", md: "540px" }}
             borderRadius="2xl" overflow="hidden" border={`1px solid ${E.color}66`}
             boxShadow={`${CAJA_GLOW}, 0 0 48px ${E.color}55, inset 0 0 70px ${E.color}22`}>
          <Box key={`bg-${elActivo}`} position="absolute" inset={0}
               bgImage={`url('${encodeURI(FOTO_ELEMENTO[elActivo])}')`} bgSize="cover" bgPosition="center"
               sx={{ "@keyframes bgIn": { from: { opacity: 0 }, to: { opacity: 1 } } }}
               style={{ animation: "bgIn 0.5s ease" }} />
          <Box position="absolute" inset={0} bgGradient="linear(to-r, rgba(0,0,0,0.78), rgba(0,0,0,0.30))" />
          <Box position="absolute" inset={0} bg={`${E.color}1f`}
               bgGradient={`linear(to-t, ${E.color}4d, transparent 55%)`} />

          <Box key={elActivo} position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 10 }}
               sx={{ "@keyframes elemIn": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}
               style={{ animation: "elemIn 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
            <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={4}>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1.1"
                    style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                {C.nombre} <Text as="span" color={E.color}>{C.hanzi}</Text>
              </Text>
              {balance ? (
                <Box px={3} py={1} borderRadius="full" bg={`${ESTADO_COLOR[balance]}44`}
                     border={`1px solid ${ESTADO_COLOR[balance]}`} sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.04em">
                    {ESTADO_LABEL[balance]}
                  </Text>
                </Box>
              ) : (
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">
                  sin datos suficientes
                </Text>
              )}
            </Flex>
            <Box h="1px" w="100%" mb={5} bgGradient={`linear(to-r, ${E.color}, ${E.color}22, transparent)`} />
            <Flex direction="column" gap={4}>
              {parrafos.map((t, i) => (
                <Text key={i} color="rgba(255,255,255,0.96)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                  {t}
                </Text>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
