import React, { useRef, useState } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { Reveal } from "../global/Reveal";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { focoBlanco } from "../global/foco";
import { MAPA, type DisciplinaMapa } from "./mapaDisciplinasData";

/**
 * El mapa de disciplinas de «Asesorías 1:1» (opción B).
 *
 * Las ocho disciplinas en una línea vertical, en orden, unidas por flechas blancas
 * que bajan. Se pulsa una y se DESPLIEGA ahí mismo: salen sus cajitas, unidas por
 * sus propias flechas (cada flecha puede llevar un texto corto encima). Una sola
 * abierta a la vez; la primera sale abierta.
 *
 * Los textos y las cajitas viven en `mapaDisciplinasData.tsx` (LÉELO: ahí están las
 * instrucciones para quien siga con esto). Este archivo no lleva texto propio.
 *
 * Movimiento: las disciplinas y sus flechas entran al bajar (la flecha se DIBUJA);
 * al abrir, el panel crece y las cajitas y sus flechas se dibujan en orden. Nada
 * reacciona al ratón por encima (sin hover). Respeta `prefers-reduced-motion`.
 */

const BLANCO = "rgba(255,255,255,0.9)";
const HALO = "0 0 14px rgba(255,255,255,0.14), 0 0 30px rgba(255,255,255,0.07), 0 0 54px rgba(180,255,245,0.08)";

/** Cajitas de ejemplo SOLO para ver el diseño (`?mapaDemo`). No salen en producción. */
const DEMO = [
  { titulo: "Caja de ejemplo 1", texto: "Una línea de texto", flecha: "luego" },
  { titulo: "Caja de ejemplo 2", texto: "Una línea de texto", flecha: "después" },
  { titulo: "Caja de ejemplo 3", texto: "Una línea de texto", flecha: "" },
];

type Caja = { titulo: string; texto?: string; flecha?: string };

/** Flecha blanca fina con punta y, si lleva texto, una pastilla encima. Se DIBUJA al entrar. */
const Flecha = ({ vertical, etiqueta, retraso = 0 }: { vertical: boolean; etiqueta?: string; retraso?: number }) => {
  const reducir = useReducedMotion();
  // En horizontal, la flecha es más larga si lleva texto, para que la pastilla quepa.
  const largo = vertical ? 64 : etiqueta ? 104 : 60;
  const dibujo = vertical ? `M12 2 L12 ${largo - 8}` : `M2 12 L${largo - 8} 12`;
  const punta = vertical ? `M5 ${largo - 15} L12 ${largo - 5} L19 ${largo - 15}` : `M${largo - 15} 5 L${largo - 5} 12 L${largo - 15} 19`;
  const anim = (extra = 0) =>
    reducir
      ? {}
      : { initial: { pathLength: 0, opacity: 0 }, whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.7, delay: retraso + extra, ease: [0.22, 1, 0.36, 1] as const } };
  return (
    <Flex position="relative" align="center" justify="center" flexShrink={0} w={vertical ? "24px" : `${largo}px`} h={vertical ? `${largo}px` : "24px"} aria-hidden="true">
      <svg width={vertical ? 24 : largo} height={vertical ? largo : 24} viewBox={vertical ? `0 0 24 ${largo}` : `0 0 ${largo} 24`} fill="none" style={{ overflow: "visible", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.35))" }}>
        <motion.path d={dibujo} stroke={BLANCO} strokeWidth="2" strokeLinecap="round" {...anim()} />
        <motion.path d={punta} stroke={BLANCO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...anim(0.35)} />
      </svg>
      {etiqueta ? (
        // La pastilla va del color de la página para tapar la raya y que el texto se lea.
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          px={3}
          py="2px"
          borderRadius="full"
          bg="#008080"
          border="1px solid rgba(255,255,255,0.45)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize="sm"
          letterSpacing="0.06em"
          whiteSpace="nowrap"
        >
          {etiqueta}
        </Box>
      ) : null}
    </Flex>
  );
};

/** Las cajitas de una disciplina abierta, con sus flechas. */
const Cajitas = ({ cajas, horizontal }: { cajas: Caja[]; horizontal: boolean }) => (
  <Flex direction={horizontal ? "row" : "column"} align={horizontal ? "stretch" : "center"} justify="center" flexWrap="nowrap" gap={horizontal ? 1 : 1} px={{ base: 2, md: 4 }} py={{ base: 5, md: 7 }}>
    {cajas.map((c, i) => (
      <React.Fragment key={i}>
        <Reveal activo direction="up" distance={18} scaleFrom={0.95} duration={0.6} delay={0.15 + i * 0.28} w={horizontal ? undefined : "100%"} flex={horizontal ? "1 1 0" : undefined} minW={0} maxW="340px" display="flex">
          <Flex
            flex="1"
            direction="column"
            gap={1}
            px={5}
            py={4}
            borderRadius="xl"
            bg="rgba(255,255,255,0.06)"
            border="1.5px solid rgba(255,255,255,0.6)"
            boxShadow={HALO}
          >
            <Text color="rgba(255,255,255,0.7)" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="sm" letterSpacing="0.2em">
              {String(i + 1).padStart(2, "0")}
            </Text>
            <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.2">
              {c.titulo}
            </Text>
            {c.texto ? (
              <Text color="rgba(255,255,255,0.9)" fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} lineHeight="1.45">
                {c.texto}
              </Text>
            ) : null}
          </Flex>
        </Reveal>
        {i < cajas.length - 1 ? <Flecha vertical={!horizontal} etiqueta={c.flecha} retraso={0.3 + i * 0.28} /> : null}
      </React.Fragment>
    ))}
  </Flex>
);

const Nodo = ({
  d, abierta, caja, onToggle, nombre, lema,
}: {
  d: DisciplinaMapa; abierta: boolean; caja: Caja[]; onToggle: () => void; nombre: string; lema: string;
}) => {
  const reducir = useReducedMotion();
  const conFondo = hasDisciplinaBg(d.name);
  const desplegable = caja.length > 0;
  const horizontal = useBreakpointValue({ base: false, md: true }) ?? false;
  const id = `mapa-${d.name}`;

  const cuerpo = (
    <>
      {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="2xl" />}
      <Box
        position="relative"
        zIndex={1}
        flexShrink={0}
        w={{ base: "56px", md: "66px" }}
        h={{ base: "56px", md: "66px" }}
        borderRadius="full"
        border={`3px solid ${d.txt}`}
        bg={conFondo ? "transparent" : d.bg}
        boxShadow={`0 0 12px ${d.txt}70, 0 0 26px ${d.txt}38`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
        <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">{d.renderIcon("38px")}</Box>
      </Box>
      <Flex position="relative" zIndex={1} direction="column" gap={0.5} flex="1" minW={0} textAlign="left">
        <Text color={d.txt} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.04em" lineHeight="1.15" textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 14px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}>
          {nombre}
        </Text>
        <Text color={d.txt} opacity={0.95} fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }} lineHeight="1.4" textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 12px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}>
          {lema}
        </Text>
      </Flex>
      {desplegable && (
        // El chevron invita a pulsar; gira al abrir (un gesto, no al pasar el ratón).
        <Box position="relative" zIndex={1} flexShrink={0} color={d.txt} aria-hidden="true" transform={abierta ? "rotate(180deg)" : "none"} transition={reducir ? "none" : "transform 0.4s cubic-bezier(0.22,1,0.36,1)"}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </Box>
      )}
    </>
  );

  const comun = {
    w: "100%",
    position: "relative" as const,
    overflow: "hidden" as const,
    align: "center",
    gap: { base: 4, md: 5 },
    textAlign: "left" as const,
    px: { base: 4, md: 5 },
    py: { base: 3.5, md: 4 },
    minH: { base: "88px", md: "100px" },
    borderRadius: "2xl",
    bg: conFondo ? "transparent" : d.bg,
    boxShadow: `0 0 18px ${d.txt}28, 0 0 40px ${d.txt}12`,
  };

  return (
    <Box w="100%">
      {desplegable ? (
        <Flex as="button" type="button" aria-expanded={abierta} aria-controls={id} onClick={onToggle} cursor="pointer" _focusVisible={focoBlanco} {...comun}>
          {cuerpo}
        </Flex>
      ) : (
        <Flex {...comun}>{cuerpo}</Flex>
      )}
      <AnimatePresence initial={false}>
        {abierta && desplegable && (
          <motion.div
            id={id}
            key="panel"
            initial={reducir ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducir ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <Cajitas cajas={caja} horizontal={horizontal} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

const MapaDisciplinas = () => {
  const t = useT();
  const nombreDe = useNombreDisciplina();
  const demo = new URLSearchParams(useLocation().search).has("mapaDemo");
  const raiz = useRef<HTMLDivElement>(null);

  // Cajitas de cada disciplina ya en el idioma activo (o las de ejemplo en `?mapaDemo`).
  const cajasDe = (d: DisciplinaMapa): Caja[] =>
    demo ? DEMO : d.cajitas.map((c) => ({ titulo: t(c.titulo), texto: c.texto ? t(c.texto) : undefined, flecha: c.flecha ? t(c.flecha) : undefined }));

  const hayContenido = demo || MAPA.some((d) => d.cajitas.length > 0);
  const primera = MAPA.find((d) => demo || d.cajitas.length > 0)?.name ?? null;
  const [abierta, setAbierta] = useState<string | null>(primera);

  // Hasta que María pase los textos la sección no se pinta (no se publica a medias).
  if (!hayContenido) return null;

  return (
    <Box ref={raiz} w="100%" maxW="960px" mx="auto" px={{ base: 5, md: 10 }}>
      <Flex direction="column" align="center">
        {MAPA.map((d, i) => (
          <React.Fragment key={d.name}>
            <Reveal inView amount={0.3} direction="up" distance={26} scaleFrom={0.97} duration={0.8} w="100%">
              <Nodo
                d={d}
                abierta={abierta === d.name}
                caja={cajasDe(d)}
                nombre={nombreDe(d.name)}
                lema={t(d.lemaKey)}
                onToggle={() => setAbierta((a) => (a === d.name ? null : d.name))}
              />
            </Reveal>
            {i < MAPA.length - 1 ? (
              <Box py={2}>
                <Flecha vertical etiqueta={d.flecha ? t(d.flecha) : undefined} />
              </Box>
            ) : null}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
};

export default MapaDisciplinas;
