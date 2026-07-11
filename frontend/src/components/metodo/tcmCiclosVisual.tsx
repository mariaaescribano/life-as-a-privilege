import React, { useState } from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { tcmBg, tcmTxt } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, CICLO_SHENG, CICLO_KE,
  SHENG_EXPLICACION, KE_EXPLICACION,
  type Elemento,
} from "./tcmRecorrido";
import { ICONO_ELEMENTO } from "./tcmElementosContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Artículo de cada elemento, para redactar los títulos ("La Madera genera el Fuego").
export const ARTICULO: Record<Elemento, string> = {
  madera: "la", fuego: "el", tierra: "la", metal: "el", agua: "el",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Geometría del pentágono ──────────────────────────────────────────────────
const CX = 150, CY = 150, R = 104, FOTO_R = 25;
export function verticePentagono(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}
export const idxElemento = (el: Elemento) => ORDEN_ELEMENTOS.indexOf(el);

// Segmento entre dos vértices, recortado para no pisar los iconos y dejando
// hueco para la punta de flecha.
export function segmentoPentagono(a: number, b: number) {
  const A = verticePentagono(a, R), B = verticePentagono(b, R);
  const dx = B.x - A.x, dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const inicio = { x: A.x + ux * (FOTO_R + 6), y: A.y + uy * (FOTO_R + 6) };
  const fin = { x: B.x - ux * (FOTO_R + 11), y: B.y - uy * (FOTO_R + 11) };
  return { inicio, fin, ux, uy };
}

export type Ciclo = "sheng" | "ke";
export interface Relacion { ciclo: Ciclo; origen: Elemento; destino: Elemento; }

// Foto de fondo por ciclo (fondo grande de la estrella y fondo del rectángulo del popup).
const FONDO_CICLO: Record<Ciclo, string> = {
  sheng: "/recorrido/tcm/fondos/generador.png",
  ke: "/recorrido/tcm/fondos/controlador.png",
};

// ── Estrella de un ciclo (pentágono con iconos + rayitas clicables) ──────────
export function EstrellaCiclo({ titulo, pinyin, hanzi, subtitulo, ciclo, onEdge }: {
  titulo: string;
  pinyin: string;
  hanzi: string;
  subtitulo: string;
  ciclo: Ciclo;
  onEdge: (ciclo: Ciclo, origen: Elemento) => void;
}) {
  const mapa = ciclo === "sheng" ? CICLO_SHENG : CICLO_KE;
  const [hover, setHover] = useState<Elemento | null>(null);

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      {/* Fondo grande: foto del ciclo (generador / controlador) */}
      <Box position="absolute" inset={0} bgImage={`url('${FONDO_CICLO[ciclo]}')`} bgSize="cover" bgPosition="center" />
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.32)" />
      <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} pt={{ base: 7, md: 9 }} pb={{ base: 6, md: 7 }}>
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
              lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
          <Text as="span" textTransform="uppercase" letterSpacing="0.05em">{titulo}</Text>
          <Text as="span" fontWeight="600"> · {pinyin} </Text>
          <Text as="span" color={tcmTxt}>{hanzi}</Text>
        </Text>
        <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
              textAlign="center" mt={1.5}>
          {subtitulo}
        </Text>

        {/* Separación horizontal elegante */}
        <Box mx="auto" mt={5} mb={2} w="62%" maxW="240px" h="1px"
             bgGradient={`linear(to-r, transparent, ${tcmTxt}cc, transparent)`} />

        <Flex justify="center" mt={{ base: 4, md: 6 }}>
          <Box as="svg" viewBox="-24 -14 372 306" w="100%" maxW={{ base: "400px", md: "600px" }} h="auto" overflow="visible">
            {/* Rayitas (aristas del ciclo) — se dibujan primero, bajo los iconos */}
            {ORDEN_ELEMENTOS.map((origen) => {
              const destino = mapa[origen];
              const { inicio, fin, ux, uy } = segmentoPentagono(idxElemento(origen), idxElemento(destino));
              const color = ELEMENTOS[origen].color;
              const activo = hover === origen;
              // Punta de flecha: triángulo limpio. La línea acaba en la BASE del
              // triángulo (no en la punta).
              const ah = activo ? 16 : 14;   // largo del triángulo
              const aw = activo ? 10 : 9;    // media anchura de la base
              const bc = { x: fin.x - ux * ah, y: fin.y - uy * ah };
              const px = -uy, py = ux;
              const p2 = { x: bc.x + px * aw, y: bc.y + py * aw };
              const p3 = { x: bc.x - px * aw, y: bc.y - py * aw };
              return (
                <g key={`${ciclo}-${origen}`} style={{ cursor: "pointer" }}
                   onClick={() => onEdge(ciclo, origen)}
                   onMouseEnter={() => setHover(origen)} onMouseLeave={() => setHover(null)}>
                  <line x1={inicio.x} y1={inicio.y} x2={fin.x} y2={fin.y}
                        stroke="transparent" strokeWidth={18} strokeLinecap="round" />
                  <line x1={inicio.x} y1={inicio.y} x2={bc.x} y2={bc.y}
                        stroke={color} strokeWidth={activo ? 4 : 2.5} strokeLinecap="butt"
                        strokeDasharray={ciclo === "ke" ? "6 5" : undefined}
                        opacity={activo ? 1 : 0.85}
                        style={{ filter: `drop-shadow(0 0 ${activo ? 7 : 3}px ${color})`, transition: "all 0.15s" }} />
                  <polygon points={`${fin.x},${fin.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                           fill={color} opacity={activo ? 1 : 0.9}
                           style={{ filter: `drop-shadow(0 0 ${activo ? 6 : 2}px ${color})` }} />
                </g>
              );
            })}

            <defs>
              {ORDEN_ELEMENTOS.map((el, i) => {
                const v = verticePentagono(i, R);
                return (
                  <clipPath id={`ciclo-${ciclo}-clip-${el}`} key={el}>
                    <circle cx={v.x} cy={v.y} r={FOTO_R} />
                  </clipPath>
                );
              })}
            </defs>
            {ORDEN_ELEMENTOS.map((el, i) => {
              const v = verticePentagono(i, R);
              const label = verticePentagono(i, R + 46);
              const color = ELEMENTOS[el].color;
              return (
                <g key={el}>
                  <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                  <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                         width={FOTO_R * 2} height={FOTO_R * 2}
                         clipPath={`url(#ciclo-${ciclo}-clip-${el})`} preserveAspectRatio="xMidYMid slice" />
                  <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none" stroke={color} strokeWidth={2}
                          style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
                  <text x={label.x} y={label.y} fill="white" fontSize={13} fontWeight={700}
                        textAnchor="middle" dominantBaseline="middle"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}>
                    {ELEMENTOS[el].nombre}
                  </text>
                </g>
              );
            })}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

// ── Divide el texto del guion en párrafos legibles ──────────────────────────
function enParrafos(texto: string, porParrafo = 2): string[] {
  const limpio = texto
    .replace(/\.(?=[^\s\d])/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
  const frases = limpio.split(/(?<=\.)\s+/).filter(Boolean);
  const parrafos: string[] = [];
  for (let i = 0; i < frases.length; i += porParrafo) {
    parrafos.push(frases.slice(i, i + porParrafo).join(" "));
  }
  return parrafos;
}

// ── Box de ilustración de una relación (origen → destino) ────────────────────
export function RelacionBox({ rel, onClose }: { rel: Relacion; onClose: () => void }) {
  const { ciclo, origen, destino } = rel;
  const O = ELEMENTOS[origen], D = ELEMENTOS[destino];
  const verbo = ciclo === "sheng" ? "genera" : "controla a";
  const titulo = `${cap(ARTICULO[origen])} ${O.nombre} ${verbo} ${ARTICULO[destino]} ${D.nombre}`;
  const texto = ciclo === "sheng" ? SHENG_EXPLICACION[origen] : KE_EXPLICACION[origen];
  const parrafos = enParrafos(texto);
  const acento = O.color;

  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      {/* Fondo del rectángulo: foto del ciclo (generador / controlador) */}
      <Box position="absolute" inset={0} bgImage={`url('${FONDO_CICLO[ciclo]}')`} bgSize="cover" bgPosition="center" />
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" />

      <IconButton aria-label="Cerrar" onClick={onClose} position="absolute" top={2} right={2} zIndex={3}
        variant="ghost" color={tcmTxt} _hover={{ bg: `${tcmTxt}22` }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={tcmTxt}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        } />

      <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 7, md: 8 }}>
        {/* Solo: título · separación horizontal · texto */}
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} textAlign="center" mb={1}
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
          {titulo}
        </Text>
        <Box h="1px" w="60%" mx="auto" my={4} bgGradient={`linear(to-r, transparent, ${acento}cc, transparent)`} />

        <Flex direction="column" gap={3.5}>
          {parrafos.map((p, i) => (
            <Text key={i} color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              {p}
            </Text>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
