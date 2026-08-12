import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import { ELEMENTOS, ORDEN_ELEMENTOS, type Elemento, type EstadoDiagnostico, type VeredictoBalance } from "./tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO, CONTENIDO_ELEMENTOS } from "./tcmElementosContenido";
import { useContenidoElemento, useNombresElementos } from "./tcmElementosEn";
import { useT, type ClaveTexto } from "../../i18n";

const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Los 5 elementos del selector «florecen» uno a uno al asomar el box en pantalla.
const MotionG = motion.g as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
const STAR_BASE = 0.1, STAR_STEP = 0.13, STAR_DUR = 0.55;

// El rótulo del estado es el mismo que titula esa sección en la página de cada
// elemento: se pide por su clave, no se escribe otra vez.
const ESTADO_CLAVE: Record<VeredictoBalance, ClaveTexto> = {
  equilibrio: "metodo.tcm.el.equilibrio",
  exceso: "metodo.tcm.el.exceso",
  deficiencia: "metodo.tcm.el.deficiencia",
};
const ESTADO_COLOR: Record<VeredictoBalance, string> = {
  equilibrio: "#6f9463", exceso: "#d1495b", deficiencia: "#c8963e",
};
// Qué texto del elemento mostrar según el veredicto. Son los tres únicos estados
// posibles: un elemento tira hacia un lado, hacia el otro, o está en equilibrio.
const CONTENT_KEY: Record<VeredictoBalance, "equilibrio" | "exceso" | "deficiencia"> = {
  equilibrio: "equilibrio", exceso: "exceso", deficiencia: "deficiencia",
};

// Altura FIJA del box en escritorio (md+). El detalle de cada elemento tiene un
// texto de largo distinto: si la caja se adaptase, la página daría un salto cada
// vez que se pincha otro elemento. Se fija una vez y lo que sobra se scrollea.
const ALTO_FIJO = "560px";

// Geometría del pentágono selector (centrada en el viewBox 400×348).
const CX = 200, CY = 184, R = 110, FOTO_R = 52;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export type EstadoElemento = EstadoDiagnostico | null;

/**
 * Box "estrella de los cinco elementos + tu mensaje": pentágono selector a la
 * izquierda y detalle (foto de fondo + estado + texto) del elemento activo a la
 * derecha. Fuente única de verdad para Equilibrio y Diagnóstico.
 */
export function TcmEstrellaDetalle({ estados, predominante }: {
  estados: Partial<Record<Elemento, EstadoElemento>>;
  predominante: Elemento;
}) {
  const t = useT();
  const nombres = useNombresElementos();
  const [elActivo, setElActivo] = useState<Elemento>(predominante);
  useEffect(() => { setElActivo(predominante); }, [predominante]);

  const reduce = useReducedMotion();
  const starRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(starRef, { once: true, amount: 0.3 });
  const enter = reduce || inView;

  const E = ELEMENTOS[elActivo];
  // El texto del elemento en el idioma activo (el hanzi y el color siguen
  // saliendo del español, que es quien manda la estructura).
  const C = useContenidoElemento(elActivo) ?? CONTENIDO_ELEMENTOS[elActivo];
  const veredicto = estados[elActivo]?.veredicto ?? null;
  // Defensivo: si `veredicto` no fuese válido o faltase el contenido, se cae a
  // intro / a un array vacío en vez de reventar el .map (pantalla en blanco).
  const parrafos = (veredicto ? C?.[CONTENT_KEY[veredicto]] : C?.intro) ?? C?.intro ?? [];

  return (
    // De md hacia arriba el box tiene ALTURA FIJA: así no da saltos al cambiar de
    // elemento (cada uno tiene un texto de largo distinto) y el texto que no cabe
    // se lee con scroll vertical dentro. En móvil se deja crecer libremente.
    <Flex direction={{ base: "column", md: "row" }} gap={5} w="100%" align="stretch"
          h={{ base: "auto", md: ALTO_FIJO }}>
      {/* Izquierda · la estrella de los cinco elementos (selector) */}
      <Box w={{ base: "100%", md: "540px" }} flexShrink={0}>
        <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
          <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
          <Box position="relative" zIndex={1} px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }} h="100%">
            <Flex ref={starRef} justify="center" align="center" h="100%" minH={{ md: "440px" }}>
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
                    <MotionG key={el}
                             initial={reduce ? false : { opacity: 0, scale: 0.3 }}
                             animate={reduce ? {} : (enter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 })}
                             transition={{ delay: STAR_BASE + i * STAR_STEP, duration: STAR_DUR, ease: EASE_POP }}
                             style={{ cursor: "pointer", transformBox: "view-box", transformOrigin: `${v.x}px ${v.y}px` }}
                             onClick={() => setElActivo(el)}>
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
                            style={{ textShadow: `0 0 ${activo ? 10 : 7}px ${Ei.color}, 0 0 ${activo ? 20 : 13}px ${Ei.color}aa, 0 1px 4px rgba(58,10,10,0.95)` }}>
                        {nombres[el]}
                      </text>
                    </MotionG>
                  );
                })}
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* Derecha · detalle con la foto del elemento de fondo */}
      <Box flex="1" minW={0}>
        <Box position="relative" w="100%" h="100%" minH={{ base: "420px", md: "0" }}
             borderRadius="2xl" overflow="hidden" border={`1px solid ${E.color}66`}
             boxShadow={`${CAJA_GLOW}, 0 0 48px ${E.color}55, inset 0 0 70px ${E.color}22`}>
          <Box key={`bg-${elActivo}`} position="absolute" inset={0}
               bgImage={`url('${encodeURI(FOTO_ELEMENTO[elActivo])}')`} bgSize="cover" bgPosition="center"
               sx={{ "@keyframes bgIn": { from: { opacity: 0 }, to: { opacity: 1 } } }}
               style={{ animation: "bgIn 0.5s ease" }} />
          <Box position="absolute" inset={0} bgGradient="linear(to-r, rgba(0,0,0,0.78), rgba(0,0,0,0.30))" />
          <Box position="absolute" inset={0} bg={`${E.color}1f`}
               bgGradient={`linear(to-t, ${E.color}4d, transparent 55%)`} />

          {/* La caja de fondo no se mueve: solo scrollea este contenido. `pr` 0
              para que la barra quede pegada al borde derecho; ese aire lo pone
              el `pr` de dentro. Al cambiar de elemento vuelve arriba (key). */}
          <Box key={elActivo} position="relative" zIndex={1} h="100%"
               overflowY={{ base: "visible", md: "auto" }}
               pl={{ base: 6, md: 10 }} pr={0} py={{ base: 7, md: 10 }}
               sx={{
                 "@keyframes elemIn": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                 "&::-webkit-scrollbar": { width: "8px" },
                 "&::-webkit-scrollbar-track": { background: "transparent" },
                 "&::-webkit-scrollbar-thumb": { background: `${E.color}aa`, borderRadius: "8px" },
                 "&::-webkit-scrollbar-thumb:hover": { background: E.color },
                 scrollbarWidth: "thin",
                 scrollbarColor: `${E.color}aa transparent`,
               }}
               style={{ animation: "elemIn 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
           <Box pr={{ base: 6, md: 10 }}>
            <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={4}>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1.1"
                    style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                {C.nombre} <Text as="span" color={E.color}>{C.hanzi}</Text>
              </Text>
              {veredicto ? (
                <Box px={3} py={1} borderRadius="full" bg={`${ESTADO_COLOR[veredicto]}44`}
                     border={`1px solid ${ESTADO_COLOR[veredicto]}`} sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.04em">
                    {t(ESTADO_CLAVE[veredicto])}
                  </Text>
                </Box>
              ) : (
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">
                  {t("metodo.tcm.diag.sinDatosSuficientes")}
                </Text>
              )}
            </Flex>
            <Box h="1px" w="100%" mb={5} bgGradient={`linear(to-r, ${E.color}, ${E.color}22, transparent)`} />
            <Flex direction="column" gap={4}>
              {parrafos.map((t, i) => (
                <Text key={i} color="rgba(255,255,255,0.96)" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                  {t}
                </Text>
              ))}
            </Flex>
           </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
