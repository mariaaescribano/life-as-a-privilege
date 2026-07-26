import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { AppleLoader } from "./AppleLoader";
import {
  astrologiaTxt, neuropsicologiaTxt, ayurvedaTxt, tcmTxt,
  fisiologiaTxt, nutricionTxt, cabalaTxt, culturaTxt,
} from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Loaders de los cómics, uno POR DISCIPLINA. Se muestran mientras la viñeta
// descarga (prop `loader` del ComicViewer). Todos son SVG + CSS (sin imágenes,
// sin emojis, sin librerías), monocromos en el color de la disciplina (`Txt`).
// El ComicViewer los elige solo según el `themeColor` (ver `comicLoaderPorColor`).
// ─────────────────────────────────────────────────────────────────────────

const SVG_W = { base: "74px", md: "90px" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Flex align="center" justify="center">
      <Box as="svg" viewBox="0 0 120 120" w={SVG_W} h={SVG_W} overflow="visible" aria-label="Cargando">
        {children}
      </Box>
    </Flex>
  );
}

// ── Life · el mandala/loto del logo de la web (8 pétalos que brotan y giran) ──
// Loader "de la casa": se usa FUERA del mapa (catálogos: Cursos, Libros,
// Ilustraciones…), donde no tiene sentido la estrella de astrología. Reproduce
// el logo (/img/icono/life.png): flor de 8 pétalos de loto radiales, en SVG +
// CSS, monocromo (blanco por defecto sobre el fondo turquesa).
const brotarPetalo = keyframes`
  0%, 100% { transform: scale(0.5);  opacity: 0.35; }
  50%      { transform: scale(1);    opacity: 1; }
`;
const girarMandala = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
// Pétalo de loto con la punta arriba, naciendo del centro (60,60).
const PETALO_VIDA = "M60,60 C 47,43 47,27 60,15 C 73,27 73,43 60,60 Z";
export function LifeLoader({ color }: { color?: string } = {}) {
  const c = color ?? "#ffffff";
  return (
    <Shell>
      <Box
        as="g"
        animation={`${girarMandala} 16s linear infinite`}
        sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <Box
            as="g"
            key={k}
            style={{ transform: `rotate(${k * 45}deg)` }}
            sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
          >
            <Box
              as="path"
              d={PETALO_VIDA}
              fill="none"
              stroke={c}
              strokeWidth={1.8}
              strokeLinejoin="round"
              animation={`${brotarPetalo} 2.8s ease-in-out ${k * 0.16}s infinite`}
              sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
              style={{ filter: `drop-shadow(0 0 4px ${c}55)` }}
            />
          </Box>
        ))}
      </Box>
      <Box
        as="circle"
        cx={60}
        cy={60}
        r={4.5}
        fill={c}
        animation={`${brotarPetalo} 2.8s ease-in-out infinite`}
        sx={{ transformBox: "fill-box", transformOrigin: "center" }}
        style={{ filter: `drop-shadow(0 0 5px ${c})` }}
      />
    </Shell>
  );
}

// ── Astrología · estrella de 5 puntas que se dibuja y titila ─────────────────
const dibujarConst = keyframes`
  0%   { stroke-dashoffset: 1; }
  50%  { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -1; }
`;
const titilar = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50%      { opacity: 1;    transform: scale(1.2); }
`;
// Los 5 vértices de la estrella (centro 60,60 · radio 46, punta arriba).
const ESTRELLAS = [
  { x: 60, y: 14 }, { x: 104, y: 46 }, { x: 87, y: 97 }, { x: 33, y: 97 }, { x: 16, y: 46 },
];
// Orden de trazo del pentagrama: una sola línea continua y cerrada (la estrella
// se dibuja "de un tirón", como se dibuja una estrella a mano).
const TRAZO = [0, 2, 4, 1, 3, 0];
export function AstrologiaLoader({ color }: { color?: string } = {}) {
  const c = color ?? astrologiaTxt;
  return (
    <Shell>
      <Box
        as="polyline"
        points={TRAZO.map((i) => `${ESTRELLAS[i].x},${ESTRELLAS[i].y}`).join(" ")}
        fill="none"
        stroke={c}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        opacity={0.9}
        animation={`${dibujarConst} 2.4s ease-in-out infinite`}
        style={{ strokeDasharray: 1 }}
      />
      {ESTRELLAS.map((s, i) => (
        <Box
          as="circle"
          key={i}
          cx={s.x}
          cy={s.y}
          r={i === 0 ? 2.7 : 2.1}
          fill={c}
          animation={`${titilar} 1.8s ease-in-out ${i * 0.28}s infinite`}
          sx={{ transformBox: "fill-box", transformOrigin: "center" }}
          style={{ filter: `drop-shadow(0 0 4px ${c})` }}
        />
      ))}
    </Shell>
  );
}

// ── Psicología · neurona con el impulso viajando por el axón ─────────────────
const impulso = keyframes`
  0%   { stroke-dashoffset: 100; opacity: 0; }
  14%  { opacity: 1; }
  86%  { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
`;
const latirSoma = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
`;
export function PsicologiaLoader({ color }: { color?: string } = {}) {
  const c = color ?? neuropsicologiaTxt;
  const axon = "M50,60 C 72,60 78,44 104,50";
  return (
    <Shell>
      {/* Dendritas */}
      {[[24, 44], [18, 60], [24, 78], [32, 40]].map(([x, y], i) => (
        <line key={i} x1={40} y1={60} x2={x} y2={y} stroke={c} strokeWidth={2.4} strokeLinecap="round" opacity={0.6} />
      ))}
      {/* Axón base (tenue) */}
      <path d={axon} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" opacity={0.28} />
      {/* Impulso que recorre el axón */}
      <Box
        as="path"
        d={axon}
        fill="none"
        stroke={c}
        strokeWidth={3.4}
        strokeLinecap="round"
        pathLength={100}
        animation={`${impulso} 1.5s ease-in-out infinite`}
        style={{ strokeDasharray: "10 100", filter: `drop-shadow(0 0 5px ${c})` }}
      />
      {/* Ramas terminales */}
      <path d="M104,50 l 9,-7 M104,50 l 10,3 M104,50 l 4,10" stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* Soma (late) */}
      <Box
        as="circle"
        cx={40}
        cy={60}
        r={14}
        fill={c}
        animation={`${latirSoma} 1.5s ease-in-out infinite`}
        sx={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </Shell>
  );
}

// Pantalla de carga de PSICOLOGÍA: la neurona (misma animación) en BLANCO,
// centrada sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de psicología.
export function PsicologiaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <PsicologiaLoader color="#ffffff" />
    </Flex>
  );
}

// ── Ayurveda · flor de loto que abre y cierra los pétalos ────────────────────
const florecer = keyframes`
  0%, 100%   { transform: scale(0.4); opacity: 0.45; }
  45%, 70%   { transform: scale(1);   opacity: 1; }
`;
const PETALO = "M60,66 C 51,50 51,33 60,25 C 69,33 69,50 60,66 Z";
export function AyurvedaLoader({ color }: { color?: string } = {}) {
  const c = color ?? ayurvedaTxt;
  return (
    <Shell>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Box
          as="g"
          key={k}
          style={{ transform: `rotate(${k * 60}deg)` }}
          sx={{ transformBox: "view-box", transformOrigin: "60px 66px" }}
        >
          <Box
            as="path"
            d={PETALO}
            fill={c}
            fillOpacity={0.85}
            animation={`${florecer} 2.3s ease-in-out ${k * 0.1}s infinite`}
            sx={{ transformBox: "view-box", transformOrigin: "60px 66px" }}
          />
        </Box>
      ))}
      <Box
        as="circle"
        cx={60}
        cy={66}
        r={7}
        fill={c}
        animation={`${florecer} 2.3s ease-in-out infinite`}
        sx={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </Shell>
  );
}

// Pantalla de carga de AYURVEDA: la flor de loto (misma animación) en BLANCO,
// centrada sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de ayurveda.
export function AyurvedaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <AyurvedaLoader color="#ffffff" />
    </Flex>
  );
}

// ── Medicina China · yin-yang girando ────────────────────────────────────────
const girar = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
export function TcmLoader({ color = tcmTxt }: { color?: string } = {}) {
  const c = color;
  return (
    <Shell>
      <Box
        as="g"
        animation={`${girar} 2.6s linear infinite`}
        sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
      >
        <circle cx={60} cy={60} r={46} fill="none" stroke={c} strokeWidth={2.4} />
        <path d="M60,14 a46,46 0 0,1 0,92 a23,23 0 0,1 0,-46 a23,23 0 0,0 0,-46 z" fill={c} />
        {/* Ojo en el lóbulo lleno (anillo) y en el vacío (relleno) */}
        <circle cx={60} cy={37} r={7} fill="none" stroke={c} strokeWidth={2.4} />
        <circle cx={60} cy={83} r={7} fill={c} />
      </Box>
    </Shell>
  );
}

// Pantalla de carga de MEDICINA CHINA: el yin-yang (misma animación) en BLANCO,
// centrado sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de TCM.
export function TcmLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <TcmLoader color="#ffffff" />
    </Flex>
  );
}

// ── Fisiología · corazón latiendo ────────────────────────────────────────────
const latido = keyframes`
  0%, 45%, 100% { transform: scale(1); }
  15%           { transform: scale(1.15); }
  30%           { transform: scale(1.04); }
`;
const brilloCorazon = keyframes`
  0%, 45%, 100% { filter: drop-shadow(0 0 3px currentColor); }
  15%           { filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 18px currentColor); }
`;
const CORAZON = "M60,98 C 18,66 22,28 46,28 C 57,28 60,40 60,45 C 60,40 63,28 74,28 C 98,28 102,66 60,98 Z";
export function FisiologiaLoader({ color }: { color?: string } = {}) {
  const c = color ?? fisiologiaTxt;
  return (
    <Shell>
      <Box
        as="path"
        d={CORAZON}
        fill={c}
        color={c}
        animation={`${latido} 1.3s ease-in-out infinite, ${brilloCorazon} 1.3s ease-in-out infinite`}
        sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
      />
    </Shell>
  );
}

// Pantalla de carga de FISIOLOGÍA: el corazón (misma animación) en BLANCO,
// centrado sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de fisiología.
export function FisiologiaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <FisiologiaLoader color="#ffffff" />
    </Flex>
  );
}

// Pantalla de carga de NUTRICIÓN: la manzana (misma animación del AppleLoader)
// en BLANCO, centrada sobre el fondo turquesa, a pantalla completa. Sustituye al
// spinner en todo el recorrido de nutrición.
export function NutricionLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <AppleLoader color="#ffffff" label={null} />
    </Flex>
  );
}

// ── Cábala · el Árbol de la Vida encendiendo las sefirot una a una ───────────
const SEFIROT = [
  { x: 60, y: 14 }, { x: 88, y: 34 }, { x: 32, y: 34 }, { x: 88, y: 58 }, { x: 32, y: 58 },
  { x: 60, y: 70 }, { x: 88, y: 82 }, { x: 32, y: 82 }, { x: 60, y: 94 }, { x: 60, y: 112 },
];
// Senderos (subconjunto de las conexiones del árbol, para no recargar).
const SENDEROS: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [0, 5],
  [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [5, 8], [8, 9],
];
const encender = keyframes`
  0%, 100% { fill-opacity: 0.12; filter: none; }
  18%      { fill-opacity: 1; filter: drop-shadow(0 0 6px currentColor); }
  40%      { fill-opacity: 0.12; filter: none; }
`;
export function CabalaLoader() {
  const c = cabalaTxt;
  return (
    <Shell>
      {SENDEROS.map(([a, b], i) => (
        <line key={i} x1={SEFIROT[a].x} y1={SEFIROT[a].y} x2={SEFIROT[b].x} y2={SEFIROT[b].y}
              stroke={c} strokeWidth={1.4} opacity={0.22} />
      ))}
      {SEFIROT.map((s, i) => (
        <Box
          as="circle"
          key={i}
          cx={s.x}
          cy={s.y}
          r={6}
          fill={c}
          stroke={c}
          strokeWidth={1.6}
          color={c}
          animation={`${encender} 3s ease-in-out ${i * 0.24}s infinite`}
          sx={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </Shell>
  );
}

// ── Cultura · mandala (flor de la Vida) que gira mientras la luz recorre sus
// pétalos uno a uno ──────────────────────────────────────────────────────────
const girarLento = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
// El anillo exterior respira suavemente (opacidad).
const respirarAnillo = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.7; }
`;
// Cada pétalo se enciende y crece un poco; con un desfase por pétalo, la luz
// «viaja» dando la vuelta a la flor (efecto de carga girando).
const encenderPetalo = keyframes`
  0%, 100% { opacity: 0.28; transform: scale(0.9); }
  50%      { opacity: 1;    transform: scale(1.05); }
`;
const MANDALA = [
  { x: 60, y: 60 }, { x: 80, y: 60 }, { x: 70, y: 77.3 }, { x: 50, y: 77.3 },
  { x: 40, y: 60 }, { x: 50, y: 42.7 }, { x: 70, y: 42.7 },
];
export function CulturaLoader({ color }: { color?: string } = {}) {
  const c = color ?? culturaTxt;
  return (
    <Shell>
      <Box
        as="g"
        animation={`${girarLento} 12s linear infinite`}
        sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
      >
        <Box
          as="circle"
          cx={60}
          cy={60}
          r={40}
          fill="none"
          stroke={c}
          strokeWidth={1.4}
          animation={`${respirarAnillo} 3s ease-in-out infinite`}
        />
        {MANDALA.map((p, i) => (
          <Box
            as="circle"
            key={i}
            cx={p.x}
            cy={p.y}
            r={20}
            fill="none"
            stroke={c}
            strokeWidth={1.6}
            animation={`${encenderPetalo} 2.4s ease-in-out ${i * 0.18}s infinite`}
            sx={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </Box>
    </Shell>
  );
}

// Pantalla de carga de CULTURA: la flor de la Vida (misma animación) en BLANCO,
// centrada sobre el fondo turquesa, a pantalla completa. Sustituye al spinner en
// todo el recorrido de cultura.
export function CulturaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <CulturaLoader color="#ffffff" />
    </Flex>
  );
}

// ── Registro: elige el loader por el color de la disciplina (themeColor) ─────
// Nutrición conserva su manzana (AppleLoader). Si el color no coincide con
// ninguna disciplina, se devuelve null y el ComicViewer cae en el spinner.
const LOADER_POR_TXT: Record<string, () => React.ReactNode> = {
  // Astrología: estrella en BLANCO (más nítida sobre el fondo estrellado oscuro
  // de las ilustraciones y los cómics del recorrido).
  [astrologiaTxt.toLowerCase()]: () => <AstrologiaLoader color="#ffffff" />,
  [neuropsicologiaTxt.toLowerCase()]: () => <PsicologiaLoader />,
  [ayurvedaTxt.toLowerCase()]: () => <AyurvedaLoader />,
  [tcmTxt.toLowerCase()]: () => <TcmLoader />,
  [fisiologiaTxt.toLowerCase()]: () => <FisiologiaLoader />,
  [cabalaTxt.toLowerCase()]: () => <CabalaLoader />,
  [culturaTxt.toLowerCase()]: () => <CulturaLoader />,
  [nutricionTxt.toLowerCase()]: () => <AppleLoader label={null} />,
};

export function comicLoaderPorColor(color?: string): React.ReactNode | null {
  const key = (color ?? "").trim().toLowerCase();
  return LOADER_POR_TXT[key]?.() ?? null;
}
