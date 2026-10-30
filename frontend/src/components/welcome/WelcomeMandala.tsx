import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { astrologiaNom, cabalaNom, culturaNom, fisiologiaNom, tcmNom } from "../../GlobalVariables";
import type { DisciplinaFila } from "./WelcomeDisciplinas";

/**
 * Las ocho disciplinas conectadas a un círculo con el mandala, sobre el mármol.
 *
 *  · En el centro, el mandala de la casa (`life.webp`, blanco) teñido de turquesa
 *    oscuro con una máscara, GIRANDO muy despacio dentro de un círculo con un borde
 *    trabajado: aro principal, aro fino interior, un aro de puntos que gira al revés,
 *    una corona de marcas y ocho nodos dorados, uno por disciplina.
 *  · De cada nodo sale una línea turquesa oscuro hasta el medallón de su disciplina
 *    (su icono sobre su foto, con el borde de su color). El medallón crece al pasar
 *    el ratón y al pulsarlo lleva a la portada de la disciplina (`link`), el mismo
 *    sitio que su tarjeta de más abajo.
 *
 * Entrada (cuando `activo`, que lo decide la banda de mármol al hacer scroll): el
 * aro se dibuja, aparece el mandala, las líneas salen del círculo hacia fuera y los
 * medallones asoman justo cuando la línea les llega.
 *
 * TODO se mide en un cuadrado de 100 × 100 (viewBox del SVG = porcentajes del
 * escenario): es la misma composición en móvil que en escritorio.
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";

const RADIO_NODO = 25.5;     // donde nace cada línea (aro de puntos)
const RADIO_MEDALLON = 41;   // centro de los medallones
const TAM_MEDALLON = 15;     // diámetro del medallón
/** Disciplinas cuya letra clara no se lee sobre el mármol: el nombre va con el color oscuro de su fondo. */
const NOMBRE_CON_FONDO = new Set<string>([astrologiaNom, tcmNom, culturaNom, cabalaNom, fisiologiaNom]);

const TAM_NODO = 3.6;        // diámetro del enganche con la foto de la disciplina
const TAM_MANDALA = 36;      // ancho del mandala que gira

const punto = (grados: number, r: number) => {
  const a = (grados * Math.PI) / 180;
  return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
};

const Medallon = ({ d, i, angulo, activo }: { d: DisciplinaFila; i: number; angulo: number; activo: boolean }) => {
  const nombreDe = useNombreDisciplina();
  const conFondo = hasDisciplinaBg(d.name);
  const { x, y } = punto(angulo, RADIO_MEDALLON);
  const arriba = Math.sin((angulo * Math.PI) / 180) < -0.1;

  return (
    <Box position="absolute" left={`${x}%`} top={`${y}%`} w={`${TAM_MEDALLON}%`} sx={{ aspectRatio: "1 / 1", transform: "translate(-50%, -50%)" }}>
      <Reveal activo={activo} direction="none" scaleFrom={0.5} duration={0.7} delay={1.15 + i * 0.12} w="100%" h="100%">
        <Box
          as="a"
          href={d.link}
          // En una PESTAÑA NUEVA, igual que su tarjeta de más abajo.
          target="_blank"
          rel="noopener noreferrer"
          display="block"
          aria-label={nombreDe(d.name)}
          position="relative"
          w="100%"
          h="100%"
          p={0}
          bg="transparent"
          border="none"
          cursor="pointer"
          borderRadius="full"
          transition="transform 0.35s cubic-bezier(0.22,1,0.36,1)"
          _hover={{ transform: "scale(1.18)", zIndex: 2 }}
          _focusVisible={{ ...focoBlanco, borderRadius: "full", transform: "scale(1.18)" }}
          sx={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Box
            position="relative"
            w="100%"
            h="100%"
            borderRadius="full"
            border={`2.5px solid ${d.txt}`}
            bg={conFondo ? "transparent" : d.bg}
            boxShadow={`0 0 12px ${d.txt}70, 0 0 26px ${d.txt}38`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
            <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center" transform={{ base: "scale(0.8)", md: "scale(1.1)" }}>
              {d.renderIcon("34px")}
            </Box>
          </Box>
        </Box>
      </Reveal>
      {/* El nombre, flojito y en cursiva: encima del medallón si está en la mitad de arriba,
          debajo en el resto. Del color de la disciplina; las de letra clara usan el color oscuro de su fondo. */}
      <Box
        position="absolute"
        left="50%"
        w="max-content"
        maxW="150px"
        {...(arriba ? { bottom: "calc(100% + 6px)" } : { top: "calc(100% + 6px)" })}
        sx={{ transform: "translateX(-50%)", pointerEvents: "none" }}
      >
        <Reveal activo={activo} direction="none" duration={0.9} delay={1.5 + i * 0.12}>
          <Text
            color={NOMBRE_CON_FONDO.has(d.name) ? d.bg : d.txt}
            opacity={0.8}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontWeight="500"
            fontSize={{ base: "xs", md: "md" }}
            letterSpacing="0.04em"
            lineHeight="1.1"
            textAlign="center"
            whiteSpace="nowrap"
          >
            {nombreDe(d.name)}
          </Text>
        </Reveal>
      </Box>
    </Box>
  );
};

const WelcomeMandala = ({ disciplinas, activo }: { disciplinas: DisciplinaFila[]; activo: boolean }) => {
  const reducir = useReducedMotion();
  const n = disciplinas.length;
  const angulos = disciplinas.map((_, i) => -90 + (360 / n) * i);
  // Marcas de la corona exterior: 48, repartidas en el aro.
  const marcas = Array.from({ length: 48 }, (_, k) => (360 / 48) * k);

  // Dibujo del trazo: de 0 a 1 cuando `activo`; sin movimiento, ya dibujado.
  const trazo = (delay: number, dur = 0.9) =>
    reducir
      ? {}
      : { initial: { pathLength: 0, opacity: 0 }, animate: activo ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }, transition: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <Flex w="100%" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }}>
      <Box position="relative" w={{ base: "min(100%, 380px)", md: "520px" }} sx={{ aspectRatio: "1 / 1" }}>
        <Box
          as="svg"
          viewBox="0 0 100 100"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          fill="none"
          aria-hidden="true"
          overflow="visible"
          sx={{
            filter: `drop-shadow(0 0 2px ${ORO}44)`,
            "@keyframes aroGira": { to: { transform: "rotate(360deg)" } },
            "@keyframes aroGiraInverso": { to: { transform: "rotate(-360deg)" } },
            "& .aro-gira": { transformOrigin: "50% 50%", transformBox: "view-box", animation: "aroGira 160s linear infinite" },
            "& .aro-gira-inv": { transformOrigin: "50% 50%", transformBox: "view-box", animation: "aroGiraInverso 110s linear infinite" },
            "@media (prefers-reduced-motion: reduce)": { "& .aro-gira, & .aro-gira-inv": { animation: "none" } },
          }}
        >
          {/* Cristal claro dentro del círculo, para que el mandala se lea sobre el mármol. */}
          <motion.circle cx="50" cy="50" r="23.5" fill="#ffffff" initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 0.22 : 0 }} transition={{ duration: 1, delay: 0.3 }} />

          {/* Aro principal y aro fino interior. */}
          <motion.circle cx="50" cy="50" r="23.5" stroke={TINTA} strokeWidth="0.9" {...trazo(0)} />
          <motion.circle cx="50" cy="50" r="22.2" stroke={TINTA} strokeWidth="0.25" strokeOpacity="0.75" {...trazo(0.25, 1)} />

          {/* Aro de puntos que gira al revés. */}
          <motion.g initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.5 }}>
            <g className="aro-gira-inv">
              <circle cx="50" cy="50" r="25.5" stroke={TINTA} strokeWidth="0.55" strokeLinecap="round" strokeDasharray="0.05 1.35" />
            </g>
          </motion.g>

          {/* Corona de marcas exterior, girando despacio. */}
          <motion.g initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.6 }}>
            <g className="aro-gira">
              {marcas.map((g, k) => {
                const a = punto(g, 27.3);
                const b = punto(g, k % 6 === 0 ? 28.6 : 27.9);
                return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={TINTA} strokeWidth={k % 6 === 0 ? 0.35 : 0.2} strokeLinecap="round" />;
              })}
            </g>
          </motion.g>

          {/* Las ocho líneas: del nodo del círculo al borde de su medallón. */}
          {angulos.map((g, i) => {
            const a = punto(g, RADIO_NODO + 1);
            const b = punto(g, RADIO_MEDALLON - TAM_MEDALLON / 2 - 0.3);
            return <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={TINTA} strokeWidth="0.5" strokeLinecap="round" {...trazo(0.9 + i * 0.12, 0.5)} />;
          })}

        </Box>

        {/* El mandala de la casa, teñido de turquesa oscuro, girando despacio dentro del círculo. */}
        <Box position="absolute" left="50%" top="50%" w={`${TAM_MANDALA}%`} sx={{ transform: "translate(-50%, -50%)" }}>
          <Reveal activo={activo} direction="none" scaleFrom={0.6} duration={1.2} delay={0.35}>
            <Box
              aria-hidden="true"
              w="100%"
              sx={{
                aspectRatio: "1 / 1",
                backgroundColor: TINTA,
                WebkitMaskImage: "url('/img/icono/life.webp')",
                maskImage: "url('/img/icono/life.webp')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                "@keyframes mandalaDiscGira": { to: { transform: "rotate(360deg)" } },
                animation: "mandalaDiscGira 90s linear infinite",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
          </Reveal>
        </Box>

        {/* El enganche de cada disciplina al círculo: un puntito con su foto, donde nace su línea. */}
        {disciplinas.map((d, i) => {
          const p = punto(angulos[i], RADIO_NODO);
          return (
            <Box key={d.name} position="absolute" left={`${p.x}%`} top={`${p.y}%`} w={`${TAM_NODO}%`} sx={{ aspectRatio: "1 / 1", transform: "translate(-50%, -50%)" }}>
              <Reveal activo={activo} direction="none" scaleFrom={0} duration={0.5} delay={0.85 + i * 0.12} w="100%" h="100%">
                <Box position="relative" w="100%" h="100%" borderRadius="full" overflow="hidden" bg={d.bg} border={`1.5px solid ${d.txt}`} boxShadow={`0 0 6px ${d.txt}66`}>
                  {hasDisciplinaBg(d.name) && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
                </Box>
              </Reveal>
            </Box>
          );
        })}

        {disciplinas.map((d, i) => (
          <Medallon key={d.name} d={d} i={i} angulo={angulos[i]} activo={activo} />
        ))}
      </Box>
    </Flex>
  );
};

export default WelcomeMandala;
