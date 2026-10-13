import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { glowHeader } from "./FotoBox";
import { COLOR_CATEGORIA, type CategoriaVida } from "../../hardCoded/espacio/OrganosVida";

// ─────────────────────────────────────────────────────────────────────────
// FiguraHumana · el cuerpo dibujado con línea fina, con cada órgano en el color
// de su categoría (Imprescindible, Te puede interesar, No obligatorio…).
//
//   · el órgano de la categoría ABIERTA se enciende (relleno, halo y un latido
//     suave); los de las otras categorías quedan tenues, en su color;
//   · `resaltado` (el órgano sobre el que se pasa en la lista) brilla más;
//   · cada órgano se puede pulsar (o enfocar con el teclado) para abrirlo.
//
// Todo es SVG propio (viewBox 200 × 460): sin fotos, sin blur.
// ─────────────────────────────────────────────────────────────────────────

type Forma =
  | { t: "e"; cx: number; cy: number; rx: number; ry: number; rot?: number }
  | { t: "p"; d: string; linea?: boolean };

const CUERPO =
  "M92 58 L92 68 C76 70 60 74 54 86 L34 196 L42 199 L62 118 C64 150 66 200 64 250 L58 336 L62 446 L80 446 L86 338 L100 268 L114 338 L120 446 L138 446 L142 336 L136 250 C134 200 136 150 138 118 L158 199 L166 196 L146 86 C140 74 124 70 108 68 L108 58 Z";

// Del fondo al frente: lo que va por detrás se pinta primero.
const ORGANOS_DIBUJO: { key: string; formas: Forma[] }[] = [
  { key: "piel", formas: [{ t: "p", d: CUERPO, linea: true }] },
  { key: "huesos", formas: [
    { t: "p", d: "M100 74 L100 262", linea: true },
    { t: "p", d: "M76 268 C90 280 110 280 124 268", linea: true },
    { t: "p", d: "M81 290 L79 436", linea: true },
    { t: "p", d: "M119 290 L121 436", linea: true },
  ] },
  { key: "sangre", formas: [
    { t: "p", d: "M96 122 C72 140 58 170 47 198", linea: true },
    { t: "p", d: "M112 122 C138 140 152 170 153 198", linea: true },
    { t: "p", d: "M100 268 C92 320 88 380 86 440", linea: true },
    { t: "p", d: "M100 268 C108 320 112 380 114 440", linea: true },
  ] },
  { key: "musculo", formas: [
    { t: "e", cx: 50, cy: 140, rx: 6, ry: 30, rot: 10 },
    { t: "e", cx: 150, cy: 140, rx: 6, ry: 30, rot: -10 },
    { t: "e", cx: 81, cy: 322, rx: 9, ry: 34 },
    { t: "e", cx: 119, cy: 322, rx: 9, ry: 34 },
  ] },
  { key: "grasa", formas: [{ t: "e", cx: 100, cy: 238, rx: 34, ry: 11 }] },
  { key: "intestino", formas: [{ t: "p", d: "M80 182 C80 176 120 176 120 182 C126 192 124 206 114 208 C108 214 92 214 86 208 C76 206 74 192 80 182 Z" }] },
  { key: "rinones", formas: [
    { t: "e", cx: 82, cy: 168, rx: 4.5, ry: 8, rot: 12 },
    { t: "e", cx: 118, cy: 168, rx: 4.5, ry: 8, rot: -12 },
  ] },
  { key: "pancreas", formas: [{ t: "e", cx: 100, cy: 160, rx: 14, ry: 3.6 }] },
  { key: "bazo", formas: [{ t: "e", cx: 127, cy: 138, rx: 4, ry: 7 }] },
  { key: "vesicula", formas: [{ t: "e", cx: 91, cy: 158, rx: 3.2, ry: 4.4 }] },
  { key: "estomago", formas: [{ t: "e", cx: 113, cy: 146, rx: 10, ry: 8, rot: -20 }] },
  { key: "higado", formas: [{ t: "e", cx: 86, cy: 148, rx: 16, ry: 8, rot: 8 }] },
  { key: "pulmones", formas: [
    { t: "e", cx: 85, cy: 104, rx: 11, ry: 20, rot: 4 },
    { t: "e", cx: 115, cy: 104, rx: 11, ry: 20, rot: -4 },
  ] },
  { key: "corazon", formas: [{ t: "p", d: "M105 126 C96 119 98 108 105 111 C112 108 114 119 105 126 Z" }] },
  { key: "tiroides", formas: [{ t: "p", d: "M91 70 C94 66 98 68 100 71 C102 68 106 66 109 70 C108 75 103 75 100 73 C97 75 92 75 91 70 Z" }] },
  { key: "lengua", formas: [{ t: "e", cx: 100, cy: 53, rx: 5, ry: 2.4 }] },
  { key: "nariz", formas: [{ t: "e", cx: 100, cy: 44, rx: 2.6, ry: 4.4 }] },
  { key: "orejas", formas: [
    { t: "e", cx: 80, cy: 37, rx: 2.4, ry: 5 },
    { t: "e", cx: 120, cy: 37, rx: 2.4, ry: 5 },
  ] },
  { key: "ojos", formas: [
    { t: "e", cx: 92.5, cy: 35, rx: 3.6, ry: 2.1 },
    { t: "e", cx: 107.5, cy: 35, rx: 3.6, ry: 2.1 },
  ] },
  { key: "cerebro", formas: [{ t: "e", cx: 100, cy: 21, rx: 13, ry: 8.5 }] },
];

const latido = keyframes`
  0%, 100% { opacity: 0.8; }
  50%      { opacity: 1; }
`;

export function FiguraHumana({
  categorias,
  abierta,
  resaltado,
  onOrgano,
  onResaltar,
  nombre,
  maxW = "300px",
}: {
  /** Categoría de cada órgano (key → categoría). */
  categorias: Record<string, CategoriaVida>;
  /** La categoría desplegada (sus órganos se encienden), o null. */
  abierta: CategoriaVida | null;
  resaltado?: string | null;
  onOrgano: (key: string) => void;
  onResaltar?: (key: string | null) => void;
  /** Nombre accesible de un órgano. */
  nombre: (key: string) => string;
  maxW?: any;
}) {
  return (
    <Box
      position="relative"
      w="100%"
      maxW={maxW}
      mx="auto"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={glowHeader(fisiologiaTxt)}
      sx={{ aspectRatio: "200 / 460" }}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box
        as="svg"
        viewBox="0 0 200 460"
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        role="group"
        sx={{
          "@media (prefers-reduced-motion: no-preference)": {
            ".organo-activo": { animation: `${latido} 3.4s ease-in-out infinite` },
          },
          ".organo:focus-visible": { outline: "2px solid #fff", outlineOffset: "2px" },
        }}
      >
        {/* La figura: línea fina de la tinta de la disciplina. */}
        <ellipse cx="100" cy="34" rx="19" ry="24" fill={`${fisiologiaTxt}0f`} stroke={`${fisiologiaTxt}99`} strokeWidth="1.2" />
        <path d={CUERPO} fill={`${fisiologiaTxt}0f`} stroke={`${fisiologiaTxt}99`} strokeWidth="1.2" strokeLinejoin="round" />

        {ORGANOS_DIBUJO.map(({ key, formas }) => {
          const cat = categorias[key];
          if (!cat) return null;
          const col = COLOR_CATEGORIA[cat];
          const activo = abierta === cat;
          const brilla = resaltado === key;
          const relleno = brilla ? `${col}99` : activo ? `${col}55` : `${col}14`;
          const trazo = brilla ? "#ffffff" : activo ? col : `${col}77`;
          return (
            <g
              key={key}
              className={`organo${activo ? " organo-activo" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={nombre(key)}
              onClick={() => onOrgano(key)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOrgano(key); } }}
              onMouseEnter={() => onResaltar?.(key)}
              onMouseLeave={() => onResaltar?.(null)}
              onFocus={() => onResaltar?.(key)}
              onBlur={() => onResaltar?.(null)}
              style={{
                cursor: "pointer",
                opacity: activo || brilla ? 1 : 0.7,
                filter: activo || brilla ? `drop-shadow(0 0 ${brilla ? 5 : 3}px ${col})` : "none",
                transition: "opacity 0.4s ease, filter 0.4s ease",
              }}
            >
              {formas.map((f, i) =>
                f.t === "e" ? (
                  <ellipse key={i} cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry}
                           transform={f.rot ? `rotate(${f.rot} ${f.cx} ${f.cy})` : undefined}
                           fill={relleno} stroke={trazo} strokeWidth={brilla ? 1.8 : 1.2} />
                ) : (
                  <path key={i} d={f.d} fill={f.linea ? "none" : relleno} stroke={trazo}
                        strokeWidth={f.linea ? (brilla ? 2.4 : activo ? 1.8 : 1.2) : brilla ? 1.8 : 1.2}
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray={key === "huesos" ? "3 3" : undefined} />
                ),
              )}
            </g>
          );
        })}
      </Box>
    </Box>
  );
}
