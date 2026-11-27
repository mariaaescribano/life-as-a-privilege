import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { SIGNOS_ORDEN, trazosSigno } from "../metodo/signosIconos";
import { FONDO_PAGINA_BEIGE } from "../../GlobalVariables";

/**
 * Una carta astral de EJEMPLO, inventada y distinta cada vez: el Ascendente y los diez planetas caen en un sitio al
 * azar, y de ahí salen las casas (iguales, desde el Ascendente) y los aspectos (conjunción, sextil, cuadratura, trígono
 * y oposición, con su orbe). Se dibuja de dentro a fuera con un trazo que se va completando; los signos y los
 * planetas aparecen uno tras otro. Cada ~9 s se sortea otra (salvo con «reducir movimiento»). Se pinta en beige (va sobre un box de estrellas) y, como una carta de verdad, lleva marcas de grados, números de casa, ASC/MC y aspectos de color.
 */
const PLANETAS: { sim: string }[] = [
  { sim: "☉" }, { sim: "☽" }, { sim: "☿" }, { sim: "♀" }, { sim: "♂" },
  { sim: "♃" }, { sim: "♄" }, { sim: "♅" }, { sim: "♆" }, { sim: "♇" },
];
const ASPECTOS = [0, 60, 90, 120, 180];
// Color por tipo de aspecto: armónicos (sextil, trígono) en azul; tensos (cuadratura, oposición) en rojo suave; conjunción en dorado.
const COLOR_ASPECTO: Record<number, string> = { 0: "#e6c46a", 60: "#9cc7f5", 90: "#ff8a70", 120: "#9cc7f5", 180: "#ff8a70" };
const ORBE = 5;
const C = 200; // centro del lienzo (400 × 400)

const rad = (g: number) => (g * Math.PI) / 180;

function sortear() {
  const asc = Math.random() * 360;
  // Planetas al azar, separados al menos 9° para que no se pisen los símbolos.
  const lon: number[] = [];
  let intentos = 0;
  while (lon.length < PLANETAS.length && intentos++ < 500) {
    const n = Math.random() * 360;
    if (lon.every((l) => Math.min(Math.abs(l - n), 360 - Math.abs(l - n)) >= 9)) lon.push(n);
  }
  while (lon.length < PLANETAS.length) lon.push(Math.random() * 360); // por si acaso
  const aspectos: [number, number, number][] = [];
  for (let i = 0; i < lon.length; i++) {
    for (let j = i + 1; j < lon.length; j++) {
      const d = Math.abs(lon[i] - lon[j]);
      const dist = Math.min(d, 360 - d);
      const tipo = ASPECTOS.find((a) => Math.abs(dist - a) <= ORBE);
      if (tipo !== undefined) aspectos.push([i, j, tipo]);
    }
  }
  return { asc, lon, aspectos };
}

export default function CartaEjemplo({ color = FONDO_PAGINA_BEIGE }: { color?: string }) {
  const T = color;
  const [carta, setCarta] = useState(sortear);
  const [vuelta, setVuelta] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // Otra carta cada ~9 s mientras se ve (no hay cambio si el usuario pide menos movimiento).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 });
    obs.observe(el);
    const id = window.setInterval(() => {
      if (!visible) return;
      setCarta(sortear());
      setVuelta((v) => v + 1);
    }, 9000);
    return () => { obs.disconnect(); window.clearInterval(id); };
  }, []);

  // Posición en el lienzo de una longitud zodiacal: el Ascendente a la izquierda y el zodiaco en sentido antihorario.
  const punto = (lon: number, r: number) => {
    const a = Math.PI + rad(lon - carta.asc);
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  };

  const cuspides = useMemo(() => Array.from({ length: 12 }, (_, i) => carta.asc + i * 30), [carta.asc]);

  const trazo = (delay: number, dur = 1.1) => ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    style: { animation: `cartaTrazo ${dur}s cubic-bezier(0.22,1,0.36,1) ${delay}s forwards` } as React.CSSProperties,
  });
  const aparece = (delay: number): React.CSSProperties => ({
    opacity: 0,
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: `cartaPop 0.6s cubic-bezier(0.22,1.4,0.36,1) ${delay}s forwards`,
  });

  return (
    <Box
      ref={ref}
      w="100%"
      sx={{
        "@keyframes cartaTrazo": { to: { strokeDashoffset: 0 } },
        "@keyframes cartaPop": { from: { opacity: 0, transform: "scale(0.4)" }, to: { opacity: 1, transform: "scale(1)" } },
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important", opacity: "1 !important", strokeDashoffset: "0 !important" },
        },
      }}
    >
      <svg key={vuelta} viewBox="0 0 400 400" width="100%" height="auto" role="img" aria-label="Carta astral de ejemplo" style={{ display: "block", overflow: "visible" }}>
        <g fill="none" stroke={T} strokeLinecap="round" strokeLinejoin="round">
          {/* Círculos: borde, anillo de los signos, anillo de los planetas y círculo de los aspectos */}
          <circle cx={C} cy={C} r={190} strokeWidth={1.8} {...trazo(0)} />
          <circle cx={C} cy={C} r={158} strokeWidth={1.2} {...trazo(0.15)} />
          <circle cx={C} cy={C} r={104} strokeWidth={1.2} {...trazo(0.3)} />
          <circle cx={C} cy={C} r={26} strokeWidth={1} {...trazo(0.4)} />

          {/* Marcas de grados en el borde exterior: cada 5° (la de los 10° más larga) */}
          {Array.from({ length: 72 }, (_, i) => {
            const larga = i % 2 === 0;
            const a = punto(i * 5, 190), b = punto(i * 5, larga ? 183 : 186);
            return <line key={`g${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={0.8} strokeOpacity={0.8} {...trazo(0.2 + i * 0.006, 0.5)} />;
          })}

          {/* Divisiones de los signos (cada 30° del zodiaco, fijas) */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = punto(i * 30, 190), b = punto(i * 30, 158);
            return <line key={`s${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={1} {...trazo(0.5 + i * 0.03, 0.6)} />;
          })}

          {/* Casas: doce cúspides desde el Ascendente */}
          {cuspides.map((lon, i) => {
            const a = punto(lon, 158), b = punto(lon, 26);
            return <line key={`c${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={i % 3 === 0 ? 1.8 : 0.9} strokeOpacity={i % 3 === 0 ? 1 : 0.65} {...trazo(0.7 + i * 0.04, 0.7)} />;
          })}

          {/* Aspectos */}
          {carta.aspectos.map(([i, j, tipo], n) => {
            const a = punto(carta.lon[i], 104), b = punto(carta.lon[j], 104);
            return <line key={`a${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={COLOR_ASPECTO[tipo]} strokeWidth={1.1} strokeOpacity={0.85} {...trazo(2.2 + n * 0.07, 0.8)} />;
          })}
        </g>

        {/* Los doce signos, cada uno en el centro de su sector */}
        {SIGNOS_ORDEN.map((nom, i) => {
          const p = punto(i * 30 + 15, 174);
          const trazos = trazosSigno(nom) ?? [];
          const e = 0.62; // 24 → ~15 px
          return (
            <g key={nom} transform={`translate(${p.x - 12 * e} ${p.y - 12 * e}) scale(${e})`}>
              <g fill="none" stroke={T} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={aparece(1.0 + i * 0.07)}>
                {trazos.map((d, k) => <path key={k} d={d} />)}
              </g>
            </g>
          );
        })}

        {/* Números de las casas, en el centro de cada una (junto al círculo interior) */}
        {cuspides.map((lon, i) => {
          const p = punto(lon + 15, 70);
          return (
            <text key={`n${i}`} x={p.x} y={p.y} fill={T} fillOpacity={0.8} fontSize={11} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'EB Garamond', serif", ...aparece(1.2 + i * 0.05) }}>
              {i + 1}
            </text>
          );
        })}

        {/* ASC (a la izquierda) y MC (arriba) */}
        <text x={C - 205} y={C} fill={T} fontSize={12} fontWeight={700} textAnchor="end" dominantBaseline="central" style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.08em", ...aparece(1.3) }}>ASC</text>
        <text x={C} y={C - 202} fill={T} fontSize={12} fontWeight={700} textAnchor="middle" style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.08em", ...aparece(1.4) }}>MC</text>

        {/* Los diez planetas */}
        {PLANETAS.map((pl, i) => {
          const p = punto(carta.lon[i], 130);
          const m = punto(carta.lon[i], 104);
          const tick = punto(carta.lon[i], 112);
          return (
            <g key={pl.sim}>
              <line x1={m.x} y1={m.y} x2={tick.x} y2={tick.y} stroke={T} strokeWidth={1.4} style={aparece(1.6 + i * 0.1)} />
              <text
                x={p.x}
                y={p.y}
                fill={T}
                fontSize={20}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontFamily: "'Segoe UI Symbol','Noto Sans Symbols','Noto Sans Symbols 2','DejaVu Sans',serif", ...aparece(1.6 + i * 0.1) }}
              >
                {pl.sim + "︎"}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
}
