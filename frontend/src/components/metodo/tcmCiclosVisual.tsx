import React, { useState } from "react";
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { tcmBg, tcmTxt } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, CICLO_SHENG, CICLO_KE,
  SHENG_EXPLICACION, KE_EXPLICACION,
  type Elemento,
} from "./tcmRecorrido";
import { ICONO_ELEMENTO } from "./tcmElementosContenido";
import { ComicViewer } from "./ComicViewer";

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

// Foto de fondo por ciclo (fondo grande de la estrella de cada ciclo).
const FONDO_CICLO: Record<Ciclo, string> = {
  sheng: "/recorrido/tcm/fondos/generador.png",
  ke: "/recorrido/tcm/fondos/controlador.png",
};

// Foto propia de CADA relación (fondo del popup RelacionBox). Cada ciclo tiene
// una carpeta con las 5 fotos, nombradas <origen><destino>.png (con una excepción
// en Ke: madera→tierra usa "tierramadera.png").
const FOTO_RELACION: Record<Ciclo, Record<Elemento, string>> = {
  sheng: {
    madera: "/recorrido/tcm/generador/maderafuego.png",
    fuego: "/recorrido/tcm/generador/fuegotierra.png",
    tierra: "/recorrido/tcm/generador/tierrametal.png",
    metal: "/recorrido/tcm/generador/metalagua.png",
    agua: "/recorrido/tcm/generador/aguamadera.png",
  },
  ke: {
    madera: "/recorrido/tcm/controlador/tierramadera.png", // madera → tierra
    tierra: "/recorrido/tcm/controlador/tierraagua.png",
    agua: "/recorrido/tcm/controlador/aguafuego.png",
    fuego: "/recorrido/tcm/controlador/fuegometal.png",
    metal: "/recorrido/tcm/controlador/metalmadera.png",
  },
};

/** Foto propia de una relación (para el fondo del popup y su overlay). */
export const fotoRelacion = (rel: Relacion): string => FOTO_RELACION[rel.ciclo][rel.origen];

// Geometría PROPIA de la estrella de ciclo: iconos grandes y bien centrados.
// No comparte constantes con el Diagnóstico, así puede crecer sin afectarlo.
const C_CX = 200, C_CY = 180, C_R = 116, C_FOTO_R = 40;
function cVertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: C_CX + radio * Math.cos(ang), y: C_CY + radio * Math.sin(ang) };
}
function cSegmento(a: number, b: number) {
  const A = cVertice(a, C_R), B = cVertice(b, C_R);
  const dx = B.x - A.x, dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const inicio = { x: A.x + ux * (C_FOTO_R + 8), y: A.y + uy * (C_FOTO_R + 8) };
  const fin = { x: B.x - ux * (C_FOTO_R + 14), y: B.y - uy * (C_FOTO_R + 14) };
  return { inicio, fin, ux, uy };
}
// Sombra negra para los títulos (no roja).
const TITLE_SHADOW = "0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.85)";

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
      {/* Fondo grande: foto del ciclo, atenuada (oscura + leve desenfoque) para
          que no se lleve la atención y la estrella se lea bien encima */}
      <Box position="absolute" inset={0} bgImage={`url('${FONDO_CICLO[ciclo]}')`} bgSize="cover" bgPosition="center"
           style={{ filter: "blur(2px)", transform: "scale(1.04)" }} />
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.55)" />
      <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} pt={{ base: 7, md: 9 }} pb={{ base: 6, md: 7 }}>
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
              lineHeight="1.3" style={{ textShadow: TITLE_SHADOW }}>
          <Text as="span" textTransform="uppercase" letterSpacing="0.06em">{titulo}</Text>
          <Text as="span" fontWeight="600"> · {pinyin} </Text>
          <Text as="span" color="white">{hanzi}</Text>
        </Text>
        <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
              textAlign="center" mt={1.5}>
          {subtitulo}
        </Text>

        {/* Separación horizontal elegante (siempre blanca) */}
        <Box mx="auto" mt={5} mb={2} w="62%" maxW="240px" h="1px"
             bgGradient="linear(to-r, transparent, rgba(255,255,255,0.9), transparent)" />

        <Flex justify="center" mt={{ base: 4, md: 6 }}>
          <Box as="svg" viewBox="0 0 400 348" w="100%" maxW={{ base: "400px", md: "600px" }} h="auto" overflow="visible">
            {/* Rayitas (aristas del ciclo) — se dibujan primero, bajo los iconos */}
            {ORDEN_ELEMENTOS.map((origen) => {
              const destino = mapa[origen];
              const { inicio, fin, ux, uy } = cSegmento(idxElemento(origen), idxElemento(destino));
              const color = ELEMENTOS[origen].color;
              const activo = hover === origen;
              // Punta de flecha: triángulo limpio. La línea acaba en la BASE del
              // triángulo (no en la punta).
              const ah = activo ? 18 : 16;   // largo del triángulo
              const aw = activo ? 11 : 10;   // media anchura de la base
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
                const v = cVertice(i, C_R);
                return (
                  <clipPath id={`ciclo-${ciclo}-clip-${el}`} key={el}>
                    <circle cx={v.x} cy={v.y} r={C_FOTO_R} />
                  </clipPath>
                );
              })}
            </defs>
            {ORDEN_ELEMENTOS.map((el, i) => {
              const v = cVertice(i, C_R);
              const label = cVertice(i, C_R + 54);
              const color = ELEMENTOS[el].color;
              return (
                <g key={el}>
                  <circle cx={v.x} cy={v.y} r={C_FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                  <image href={ICONO_ELEMENTO[el]} x={v.x - C_FOTO_R} y={v.y - C_FOTO_R}
                         width={C_FOTO_R * 2} height={C_FOTO_R * 2}
                         clipPath={`url(#ciclo-${ciclo}-clip-${el})`} preserveAspectRatio="xMidYMid slice" />
                  <circle cx={v.x} cy={v.y} r={C_FOTO_R} fill="none" stroke={color} strokeWidth={2.5}
                          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
                  <text x={label.x} y={label.y} fill="white" fontSize={15} fontWeight={700}
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

// ── Popup de una relación: REUTILIZA el ComicViewer (inmersivo, con scroll) ──
// Fondo a pantalla completa Y fondo del box = foto del CICLO (generador /
// controlador). Foto de la izquierda = la de la pareja de esta relación.
export function RelacionModal({ rel, onClose }: { rel: Relacion | null; onClose: () => void }) {
  return (
    <Modal isOpen={!!rel} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg="rgba(0,0,0,0.6)" />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0}
                    minH="100vh" position="relative" sx={{ transform: "none !important" }}>
        {rel && (() => {
          const { ciclo, origen, destino } = rel;
          const O = ELEMENTOS[origen], D = ELEMENTOS[destino];
          const verbo = ciclo === "sheng" ? "genera" : "controla a";
          const titulo = `${cap(ARTICULO[origen])} ${O.nombre} ${verbo} ${ARTICULO[destino]} ${D.nombre}`;
          const texto = ciclo === "sheng" ? SHENG_EXPLICACION[origen] : KE_EXPLICACION[origen];
          return (
            <ComicViewer
              vinetas={[{
                src: FOTO_RELACION[ciclo][origen],
                eyebrow: ciclo === "sheng" ? "Ciclo generador" : "Ciclo de control",
                titulo,
                paragraphs: enParrafos(texto),
              }]}
              themeColor={O.color}
              textColor="#ffffff"
              disciplinaBgImage={FONDO_CICLO[ciclo]}
              disciplinaBgColor={O.color}
              fondoNitido
              onClose={onClose}
            />
          );
        })()}
      </ModalContent>
    </Modal>
  );
}
