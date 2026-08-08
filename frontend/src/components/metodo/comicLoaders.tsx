import React from "react";
import { useT } from "../../i18n";
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

/** Props comunes a todos los loaders. `size` es el lado del SVG: por defecto el
 *  tamaño grande de pantalla de carga; pásalo más pequeño para los huecos
 *  inline (miniaturas, botones, celdas de una rejilla). */
type LoaderProps = { color?: string; size?: any };

function Shell({ children, size }: { children: React.ReactNode; size?: any }) {
  const t = useT();
  const w = size ?? SVG_W;
  return (
    <Flex align="center" justify="center">
      <Box as="svg" viewBox="0 0 120 120" w={w} h={w} overflow="visible" aria-label={t("comun.cargando")}>
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
export function LifeLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? "#ffffff";
  return (
    <Shell size={size}>
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

// ── Astrología · octagrama de 8 puntas que se dibuja, gira y titila ──────────
const dibujarConst = keyframes`
  0%   { stroke-dashoffset: 1; }
  50%  { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -1; }
`;
const titilar = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50%      { opacity: 1;    transform: scale(1.2); }
`;
// Giro lento de todo el astro: le da un aire místico/celeste (rueda del cielo)
// sin distraer. En 30s da una vuelta; en el rato de carga apenas se completa.
const girarAstro = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
// Los 8 vértices, repartidos cada 45° (centro 60,60 · radio 46, punta arriba).
const ESTRELLAS = [
  { x: 60, y: 14 },   { x: 92.5, y: 27.5 }, { x: 106, y: 60 },  { x: 92.5, y: 92.5 },
  { x: 60, y: 106 },  { x: 27.5, y: 92.5 }, { x: 14, y: 60 },   { x: 27.5, y: 27.5 },
];
// Trazo del octagrama {8/3}: uniendo cada 3er vértice sale UNA sola línea
// continua con 8 puntas afiladas (estrella de Ishtar/brújula), mucho más mística
// que el pentagrama y sin recordar a la estrella de David (que son 6 puntas).
const TRAZO = [0, 3, 6, 1, 4, 7, 2, 5, 0];
export function AstrologiaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? astrologiaTxt;
  return (
    <Shell size={size}>
      <Box
        as="g"
        animation={`${girarAstro} 30s linear infinite`}
        sx={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
      >
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
      </Box>
    </Shell>
  );
}

// Pantalla de carga de ASTROLOGÍA: el octagrama (misma animación) en BLANCO,
// centrado sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de astrología.
export function AstrologiaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <AstrologiaLoader color="#ffffff" />
    </Flex>
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
export function PsicologiaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? neuropsicologiaTxt;
  const axon = "M50,60 C 72,60 78,44 104,50";
  return (
    <Shell size={size}>
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
export function AyurvedaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? ayurvedaTxt;
  return (
    <Shell size={size}>
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
export function TcmLoader({ color = tcmTxt, size }: LoaderProps = {}) {
  const c = color;
  return (
    <Shell size={size}>
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
export function FisiologiaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? fisiologiaTxt;
  return (
    <Shell size={size}>
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
// El Árbol es alto y estrecho (solo ocupa de x=32 a x=88), así que al tamaño
// común se veía más pequeño que el resto de loaders: va un punto más grande.
const CABALA_SVG_W = { base: "96px", md: "118px" };

export function CabalaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? cabalaTxt;
  return (
    <Shell size={size ?? CABALA_SVG_W}>
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

// Pantalla de carga de CÁBALA: el Árbol de la Vida (misma animación) en BLANCO,
// centrado sobre el fondo turquesa, a pantalla completa. Sustituye al spinner
// en todo el recorrido de cábala.
export function CabalaLoading() {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      <CabalaLoader color="#ffffff" />
    </Flex>
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
// La flor de la Vida son circunferencias finas y muy abiertas: al tamaño común
// se quedaba pequeña en la pantalla de carga. Va un 20 % por encima (74→89,
// 90→108), igual que el Árbol de Cábala tiene el suyo propio. Quien pase un
// `size` explícito (los huecos pequeños del registro) manda sobre esto.
const CULTURA_SVG_W = { base: "89px", md: "108px" };

export function CulturaLoader({ color, size }: LoaderProps = {}) {
  const c = color ?? culturaTxt;
  return (
    <Shell size={size ?? CULTURA_SVG_W}>
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
// Nutrición conserva su manzana (AppleLoader). `pintar` sin valor = cada loader
// usa el color propio de su disciplina.
const LOADER_POR_TXT: Record<string, (pintar?: string, size?: any) => React.ReactNode> = {
  [astrologiaTxt.toLowerCase()]: (c, s) => <AstrologiaLoader color={c} size={s} />,
  [neuropsicologiaTxt.toLowerCase()]: (c, s) => <PsicologiaLoader color={c} size={s} />,
  [ayurvedaTxt.toLowerCase()]: (c, s) => <AyurvedaLoader color={c} size={s} />,
  [tcmTxt.toLowerCase()]: (c, s) => <TcmLoader color={c} size={s} />,
  [fisiologiaTxt.toLowerCase()]: (c, s) => <FisiologiaLoader color={c} size={s} />,
  [cabalaTxt.toLowerCase()]: (c, s) => <CabalaLoader color={c} size={s} />,
  [culturaTxt.toLowerCase()]: (c, s) => <CulturaLoader color={c} size={s} />,
  [nutricionTxt.toLowerCase()]: (c, s) => <AppleLoader color={c} size={s} label={null} />,
};

const clave = (color?: string) => (color ?? "").trim().toLowerCase();

/** Loader para el interior de un cómic/ilustración: va sobre la viñeta, así que
 *  cada disciplina se pinta en SU color. Excepción: Astrología en blanco, más
 *  nítida sobre el cielo estrellado oscuro. Si el color no es de ninguna
 *  disciplina, cae en el mandala de la casa. */
export function comicLoaderPorColor(color?: string, size?: any): React.ReactNode {
  const key = clave(color);
  const pintar = key === clave(astrologiaTxt) ? "#ffffff" : undefined;
  return LOADER_POR_TXT[key]?.(pintar, size) ?? <LifeLoader color={color} size={size} />;
}

/** Loader de la disciplina EN BLANCO, para las pantallas de carga sobre el
 *  turquesa (#008080), donde el color propio de la disciplina no contrastaría.
 *  Si el color no es de ninguna disciplina, cae en el mandala de la casa. */
export function loaderDisciplinaBlanco(color?: string, size?: any): React.ReactNode {
  return LOADER_POR_TXT[clave(color)]?.("#ffffff", size) ?? <LifeLoader color="#ffffff" size={size} />;
}

/** Pantalla de carga completa (turquesa + loader blanco) de la disciplina cuyo
 *  `<disc>Txt` es `color`. Es lo que va en los `if (loading) return …` de todas
 *  las páginas del recorrido. */
export function LoadingDisciplina({ color }: { color?: string }) {
  return (
    <Flex minH="100vh" bg="#008080" align="center" justify="center">
      {loaderDisciplinaBlanco(color)}
    </Flex>
  );
}
