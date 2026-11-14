import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Box, Flex } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { glowHeaderDisciplina } from "./MetodoStepHeader";
import { ZODIAC_SIGNS, cuerpoByKey } from "./astrologiaData";
import { COLOR_SIGNO, REGENTE_MODERNO } from "./casasAspectos";
import { trazosSigno } from "./signosIconos";
import { FUENTE_GLIFOS, VS_TEXTO } from "./glifosAstro";
import { useNombresAstro } from "./astrologiaNombres";
import { astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────────
// La rueda de las doce casas: de dentro afuera, el NÚMERO de la casa, el SIGNO que
// le corresponde de forma natural (casa 1 = Aries … casa 12 = Piscis) y el PLANETA
// que rige ese signo, cada uno de su color. Los nombres no se escriben en la rueda
// (no cabrían): salen en el centro al pasar el puntero o pulsar una casa, y por
// defecto sale la primera. Casa 1 empieza a la izquierda y se avanza hacia abajo,
// como en una carta astral de verdad.
// ─────────────────────────────────────────────────────────────────────────────

const C = 300;           // centro del lienzo (viewBox 600 × 600)
const R_CENTRO = 74;     // el círculo del centro (los nombres)
const R_CASAS = 128;     // fin del anillo de números
const R_SIGNOS = 198;    // fin del anillo de signos
const R_PLANETAS = 268;  // fin del anillo de planetas

const rad = (grados: number) => (grados * Math.PI) / 180;
// El eje y de la pantalla va hacia abajo: se invierte para girar en sentido contrario a las agujas.
const punto = (r: number, grados: number) => ({ x: C + r * Math.cos(rad(grados)), y: C - r * Math.sin(rad(grados)) });

/** Un sector de anillo entre dos radios y dos ángulos (en grados, sentido contrario a las agujas). */
function sector(r1: number, r2: number, a0: number, a1: number): string {
  const e0 = punto(r2, a0), e1 = punto(r2, a1), i1 = punto(r1, a1), i0 = punto(r1, a0);
  return `M${e0.x} ${e0.y} A${r2} ${r2} 0 0 0 ${e1.x} ${e1.y} L${i1.x} ${i1.y} A${r1} ${r1} 0 0 1 ${i0.x} ${i0.y} Z`;
}

export function RuedaCasasSignos() {
  const nombres = useNombresAstro();
  const ref = useRef<SVGSVGElement>(null);
  // Las casas entran una tras otra al llegar a la rueda (una sola vez); sin animación si se pide así.
  const visto = useInView(ref, { once: true, amount: 0.25 });
  const reducir = useReducedMotion();
  const entra = visto || !!reducir;
  const [activa, setActiva] = useState(0);

  const signo = ZODIAC_SIGNS[activa].name;
  const colorActivo = COLOR_SIGNO[signo] ?? astrologiaTxt;

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      w="100%"
      boxShadow={glowHeaderDisciplina(astrologiaTxt)}
    >
      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" overlay="rgba(8,13,30,0.28)" />
      <Flex position="relative" zIndex={1} justify="center" px={{ base: 3, md: 8 }} py={{ base: 5, md: 8 }}>
        <Box w="100%" maxW="600px">
          <svg ref={ref} viewBox="0 0 600 600" width="100%" role="group" style={{ display: "block", overflow: "visible" }}>
            {/* Las tres coronas y el centro: solo líneas finas, luz y no sombra. */}
            {[R_CENTRO, R_CASAS, R_SIGNOS, R_PLANETAS].map((r, n) => (
              <motion.circle key={r} cx={C} cy={C} r={r} fill="none" stroke={`${astrologiaTxt}66`} strokeWidth={1.2}
                             initial={reducir ? false : { opacity: 0 }} animate={{ opacity: entra ? 1 : 0 }}
                             transition={{ duration: 0.6, delay: n * 0.1 }} />
            ))}

            {ZODIAC_SIGNS.map((s, i) => {
              const a0 = 180 + i * 30;
              const centro = a0 + 15;
              const cuerpo = cuerpoByKey(REGENTE_MODERNO[i]);
              const color = COLOR_SIGNO[s.name] ?? astrologiaTxt;          // la casa, su número, su signo y el planeta que lo rige
              const seleccionada = activa === i;
              const trazos = trazosSigno(s.name) ?? [];
              const pNum = punto((R_CENTRO + R_CASAS) / 2, centro);
              const pSig = punto((R_CASAS + R_SIGNOS) / 2, centro);
              const pPla = punto((R_SIGNOS + R_PLANETAS) / 2, centro);
              const lado = 36; // tamaño del icono del signo dentro de su corona
              const k = lado / 24;

              return (
                <motion.g
                  key={s.name}
                  initial={reducir ? false : { opacity: 0, scale: 0.86 }}
                  animate={entra ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.86 }}
                  transition={{ duration: 0.65, delay: 0.5 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${i + 1} · ${nombres.signo(s.name)} · ${nombres.cuerpo(REGENTE_MODERNO[i])}`}
                  aria-pressed={seleccionada}
                  onMouseEnter={() => setActiva(i)}
                  onFocus={() => setActiva(i)}
                  onClick={() => setActiva(i)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiva(i); } }}
                  style={{ cursor: "pointer", outline: "none", transformOrigin: `${C}px ${C}px` }}
                >
                  {/* La casa entera, de dentro afuera: se enciende con el color de su planeta. */}
                  <path
                    d={sector(R_CENTRO, R_PLANETAS, a0, a0 + 30)}
                    fill={seleccionada ? `${color}66` : `${color}22`}
                    stroke={`${color}99`}
                    strokeWidth={1.2}
                    style={{ transition: "fill 0.3s ease" }}
                  />

                  <text x={pNum.x} y={pNum.y} textAnchor="middle" dominantBaseline="central"
                        fontSize={34} fontWeight={700} fill={color}
                        fontFamily="'EB Garamond', serif" style={{ pointerEvents: "none", filter: `drop-shadow(0 0 6px ${color}88)` }}>
                    {i + 1}
                  </text>

                  <g transform={`translate(${pSig.x - lado / 2} ${pSig.y - lado / 2}) scale(${k})`}
                     fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                     style={{ pointerEvents: "none", filter: `drop-shadow(0 0 5px ${color}88)` }}>
                    {trazos.map((d, j) => <path key={j} d={d} />)}
                  </g>

                  <text x={pPla.x} y={pPla.y} textAnchor="middle" dominantBaseline="central"
                        fontSize={38} fill={color} fontFamily={FUENTE_GLIFOS}
                        style={{ pointerEvents: "none", fontVariantEmoji: "text", filter: `drop-shadow(0 0 6px ${color}88)` } as React.CSSProperties}>
                    {cuerpo?.symbol}{VS_TEXTO}
                  </text>
                </motion.g>
              );
            })}

            {/* El centro: los nombres de la casa que se está mirando. */}
            <motion.g style={{ pointerEvents: "none" }} aria-live="polite"
                      initial={reducir ? false : { opacity: 0 }} animate={{ opacity: entra ? 1 : 0 }}
                      transition={{ duration: 0.7, delay: 0.5 + 12 * 0.16 }}>
              <text x={C} y={C - 20} textAnchor="middle" fontSize={34} fontWeight={700} fill={colorActivo}
                    fontFamily="'EB Garamond', serif" style={{ filter: `drop-shadow(0 0 8px ${colorActivo}aa)` }}>
                {activa + 1}
              </text>
              <text x={C} y={C + 6} textAnchor="middle" fontSize={17} fontWeight={700} letterSpacing="0.08em" fill={colorActivo}
                    style={{ filter: `drop-shadow(0 0 6px ${colorActivo}88)` }}
                    fontFamily="'EB Garamond', serif">
                {nombres.signo(signo).toLocaleUpperCase()}
              </text>
              <text x={C} y={C + 28} textAnchor="middle" fontSize={16} fontStyle="italic" fill={colorActivo}
                    style={{ filter: `drop-shadow(0 0 6px ${colorActivo}88)` }}
                    fontFamily="'EB Garamond', serif">
                {nombres.cuerpo(REGENTE_MODERNO[activa])}
              </text>
            </motion.g>
          </svg>
        </Box>
      </Flex>
    </Box>
  );
}
