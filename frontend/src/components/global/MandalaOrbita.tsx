import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { focoBlanco } from "./foco";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";

/**
 * El mandala de las ocho disciplinas de «Asesorías 1:1», sobre el turquesa.
 *
 *  · En el centro, el mandala de la casa (`life.webp`, blanco) girando despacio dentro
 *    de un círculo con borde trabajado: aro principal, aro fino interior, aro de puntos
 *    que gira al revés, corona de marcas y ocho nodos dorados.
 *  · Las ocho disciplinas están alrededor, QUIETAS, en el orden en que se pasan (la primera
 *    arriba y, de ahí, en el sentido de las agujas del reloj). Cada una, unida al círculo por una
 *    línea recta. Lo único que se mueve es el mandala del centro y los aros decorativos.
 *  · La seleccionada crece y se enciende con el color de su disciplina, y su línea se
 *    ilumina; las demás quedan en gris suave. Pulsar un medallón la elige.
 *
 * Entrada (cuando `activo`): el aro se dibuja, aparece el mandala, las líneas salen del
 * círculo y los medallones asoman cuando la línea les llega. Con `prefers-reduced-motion`
 * no gira ni se anima nada.
 *
 * TODO se mide en un cuadrado de 100 × 100 (el SVG y los porcentajes coinciden), así
 * que es la misma composición en móvil que en escritorio.
 */
export type ItemOrbita = {
  nom: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
};

const BLANCO = "rgba(255,255,255,0.92)";

const R_NODO = 24.5;      // donde nace cada línea (aro de puntos)
const R_MEDALLON = 41;    // centro de los medallones
const TAM_MEDALLON = 15;  // diámetro del medallón
const TAM_MANDALA = 34;   // ancho del mandala central

const punto = (grados: number, r: number) => {
  const a = (grados * Math.PI) / 180;
  return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
};

export default function MandalaOrbita({
  items, selectedNom, onSelect, activo,
}: {
  items: ItemOrbita[];
  selectedNom: string;
  onSelect: (nom: string) => void;
  activo: boolean;
}) {
  const reducir = useReducedMotion();
  const nombreEnMapa = useNombreDisciplinaEnMapa();
  const n = items.length;
  const angulos = items.map((_, i) => -90 + (360 / n) * i);
  const marcas = Array.from({ length: 48 }, (_, k) => (360 / 48) * k);

  const trazo = (delay: number, dur = 0.9) =>
    reducir
      ? {}
      : { initial: { pathLength: 0, opacity: 0 }, animate: activo ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }, transition: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <Flex w="100%" justify="center" py={{ base: 2, md: 4 }}>
      <Box
        position="relative"
        w={{ base: "min(100%, 360px)", md: "430px", lg: "460px" }}
        flexShrink={0}
        sx={{
          aspectRatio: "1 / 1",
          "@keyframes mandalaCentroGira": { to: { transform: "rotate(360deg)" } },
          "@keyframes aroDeGira": { to: { transform: "rotate(360deg)" } },
          "@keyframes aroDeGiraInverso": { to: { transform: "rotate(-360deg)" } },
          "@media (prefers-reduced-motion: reduce)": {
            "& .aro-de-gira, & .aro-de-gira-inv, & .centro-gira": { animation: "none !important" },
          },
        }}
      >
        {/* ── Decoración del círculo: aros, puntos y corona (lo único que gira, junto al mandala) ── */}
        <Box as="svg" viewBox="0 0 100 100" position="absolute" inset={0} w="100%" h="100%" fill="none" aria-hidden="true" overflow="visible"
          sx={{ filter: `drop-shadow(0 0 1.6px rgba(255,255,255,0.45))` }}>
          <motion.circle cx="50" cy="50" r="22.5" fill="#ffffff" initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 0.07 : 0 }} transition={{ duration: 1, delay: 0.3 }} />
          <motion.circle cx="50" cy="50" r="22.5" stroke={BLANCO} strokeWidth="0.75" {...trazo(0)} />
          <motion.circle cx="50" cy="50" r="21.3" stroke={BLANCO} strokeWidth="0.22" strokeOpacity="0.7" {...trazo(0.25, 1)} />
          <motion.g initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.5 }}>
            <g className="aro-de-gira-inv" style={{ transformOrigin: "50% 50%", transformBox: "view-box", animation: "aroDeGiraInverso 110s linear infinite" } as React.CSSProperties}>
              <circle cx="50" cy="50" r="24.5" stroke={BLANCO} strokeWidth="0.5" strokeLinecap="round" strokeDasharray="0.05 1.3" />
            </g>
          </motion.g>
          <motion.g initial={reducir ? false : { opacity: 0 }} animate={{ opacity: activo ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.6 }}>
            <g className="aro-de-gira" style={{ transformOrigin: "50% 50%", transformBox: "view-box", animation: "aroDeGira 170s linear infinite" } as React.CSSProperties}>
              {marcas.map((g, k) => {
                const a = punto(g, 26.3);
                const b = punto(g, k % 6 === 0 ? 27.6 : 26.9);
                return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BLANCO} strokeWidth={k % 6 === 0 ? 0.3 : 0.18} strokeLinecap="round" />;
              })}
            </g>
          </motion.g>
        </Box>

        {/* ── El mandala de la casa, girando despacio dentro del círculo ── */}
        <Box position="absolute" left="50%" top="50%" w={`${TAM_MANDALA}%`} sx={{ transform: "translate(-50%, -50%)" }}>
          <motion.div initial={reducir ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: activo ? 1 : 0, scale: activo ? 1 : 0.6 }} transition={{ duration: 1.2, delay: 0.35 }}>
            <Box
              as="img"
              src="/img/icono/life.webp"
              alt=""
              aria-hidden="true"
              display="block"
              w="100%"
              className="centro-gira"
              sx={{
                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.25))",
                animation: "mandalaCentroGira 90s linear infinite",
              }}
            />
          </motion.div>
        </Box>

        {/* ── Líneas y nodos: quietos ── */}
        <Box as="svg" viewBox="0 0 100 100" position="absolute" inset={0} w="100%" h="100%" fill="none" aria-hidden="true" overflow="visible">
          {angulos.map((g, i) => {
            const on = items[i].nom === selectedNom;
            const a = punto(g, R_NODO + 0.8);
            const b = punto(g, R_MEDALLON - TAM_MEDALLON / 2 - 0.3);
            return (
              <motion.line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={on ? items[i].txt : BLANCO}
                strokeWidth={on ? 0.9 : 0.4}
                strokeLinecap="round"
                style={{ opacity: on ? 1 : 0.55, transition: "stroke-width 0.4s ease, opacity 0.4s ease" }}
                {...trazo(0.9 + i * 0.12, 0.5)}
              />
            );
          })}
        </Box>
        {angulos.map((g, i) => {
          const p = punto(g, R_NODO);
          const on = items[i].nom === selectedNom;
          return (
            <Box key={i} position="absolute" left={`${p.x}%`} top={`${p.y}%`} w="2.4%" sx={{ aspectRatio: "1 / 1", transform: "translate(-50%, -50%)" }}>
              <motion.div
                // La bolita lleva la foto de SU disciplina (y el color de su letra en el filo).
                style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", borderRadius: "50%", background: hasDisciplinaBg(items[i].nom) ? "transparent" : items[i].bg, border: `1px solid ${items[i].txt}`, boxShadow: on ? `0 0 10px ${items[i].txt}` : "none" }}
                initial={reducir ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: activo ? 1 : 0, scale: activo ? (on ? 1.5 : 1) : 0 }}
                transition={{ duration: 0.4, delay: activo ? 0.85 + i * 0.12 : 0 }}
              >
                {hasDisciplinaBg(items[i].nom) && <DisciplinaBgLayer nom={items[i].nom} borderRadius="full" talCual />}
              </motion.div>
            </Box>
          );
        })}

        {/* ── Los medallones: quietos ── */}
        {items.map((d, i) => {
          const { x, y } = punto(angulos[i], R_MEDALLON);
          const on = d.nom === selectedNom;
          const conFondo = hasDisciplinaBg(d.nom);
          return (
            <Box key={d.nom} position="absolute" left={`${x}%`} top={`${y}%`} w={`${TAM_MEDALLON}%`} sx={{ aspectRatio: "1 / 1", transform: "translate(-50%, -50%)" }} zIndex={on ? 3 : 1}>
              <motion.div
                style={{ width: "100%", height: "100%" }}
                initial={reducir ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: activo ? 1 : 0, scale: activo ? 1 : 0.5 }}
                transition={{ duration: 0.7, delay: activo ? 1.15 + i * 0.12 : 0 }}
              >
                <Box
                  as="button"
                  type="button"
                  onClick={() => onSelect(d.nom)}
                  aria-label={nombreEnMapa(d.nom)}
                  aria-pressed={on}
                  position="relative"
                  display="block"
                  w="100%"
                  h="100%"
                  p={0}
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  borderRadius="full"
                  transform={on ? "scale(1.24)" : "scale(1)"}
                  transition="transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease"
                  _hover={{ transform: on ? "scale(1.3)" : "scale(1.12)", filter: "none" }}
                  _focusVisible={{ ...focoBlanco, borderRadius: "full" }}
                  sx={{ filter: on ? "none" : "grayscale(0.65) brightness(0.9)", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
                >
                  <Box
                    position="relative"
                    w="100%"
                    h="100%"
                    borderRadius="full"
                    border={`2.5px solid ${d.txt}`}
                    bg={conFondo ? "transparent" : d.bg}
                    boxShadow={on ? `0 0 16px ${d.txt}, 0 0 38px ${d.txt}99, 0 0 64px ${d.txt}44` : `0 0 8px ${d.txt}55`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    transition="box-shadow 0.45s ease"
                  >
                    {conFondo && <DisciplinaBgLayer nom={d.nom} borderRadius="full" />}
                    <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center" transform={{ base: "scale(0.78)", md: "scale(1.05)" }}>
                      {d.renderIcon("34px")}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}
