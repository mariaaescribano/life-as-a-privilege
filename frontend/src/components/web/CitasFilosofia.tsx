import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { Flecha } from "./LineaTiempoAstrologia";
import PalabrasVivas from "../global/PalabrasVivas";
import TextoRico from "../global/TextoRico";
import { useT, type ClaveTexto } from "../../i18n";

// `motion(Box)`: mismo apaño de tipos que en Reveal.tsx.
const MotionBox = motion(Box) as any;
const EASE = [0.22, 1, 0.36, 1] as const;

const CITAS: { cita: ClaveTexto; autor: ClaveTexto }[] = [
  { cita: "filoPortada.cita1", autor: "filoPortada.cita1Autor" },
  { cita: "filoPortada.cita2", autor: "filoPortada.cita2Autor" },
  { cita: "filoPortada.cita3", autor: "filoPortada.cita3Autor" },
  { cita: "filoPortada.cita4", autor: "filoPortada.cita4Autor" },
  { cita: "filoPortada.cita5", autor: "filoPortada.cita5Autor" },
];

/**
 * Las cinco citas de Filosofía, de una en una, grandes y centradas sobre la foto de la disciplina (letra `color`
 * con su sombra `sombra`). Al pasar de cita la nueva se enciende palabra a palabra; bajo ella nace una raya desde
 * el centro hacia los lados y, cuando se ha extendido, aparece el autor. Flechas a los lados (debajo en móvil),
 * teclado ← →, y contador con barra de progreso.
 */
export default function CitasFilosofia({ color, sombra }: { color: string; sombra: string }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const total = CITAS.length;
  const c = CITAS[i];
  const anterior = () => setI((n) => Math.max(0, n - 1));
  const siguiente = () => setI((n) => Math.min(total - 1, n + 1));

  // Teclado: ← y → pasan de cita (igual que la línea del tiempo de Astrología).
  const refFn = useRef({ anterior, siguiente });
  refFn.current = { anterior, siguiente };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "ArrowLeft") refFn.current.anterior();
      if (e.key === "ArrowRight") refFn.current.siguiente();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Flex w="100%" maxW="1080px" mx="auto" align="center" gap={{ base: 2, md: 6 }} color={color} fontFamily="'EB Garamond', serif">
      <Box display={{ base: "none", md: "block" }}>
        <Flecha color={color} dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
      </Box>

      <Flex direction="column" flex="1" minW={0} align="center" gap={{ base: 5, md: 6 }}>
        {/* Alto reservado: las citas son de distinta longitud y la caja no debe saltar al cambiar. */}
        <Flex key={i} direction="column" align="center" justify="center" textAlign="center" w="100%" minH={{ base: "300px", md: "280px" }} px={{ base: 2, md: 8 }} gap={{ base: 5, md: 6 }} textShadow={sombra}>
          <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} lineHeight="1.4" letterSpacing="0.01em">
            <PalabrasVivas texto={t(c.cita)} cursivas total={1.4} retraso={0.15} />
          </Text>

          {/* La raya nace en el centro y se abre hacia los lados; después, el autor. */}
          <MotionBox
            w="100%"
            maxW="360px"
            h="1px"
            style={{ transformOrigin: "center", background: `linear-gradient(to right, ${color}00, ${color}cc 30%, ${color}cc 70%, ${color}00)` }}
            initial={reduce ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
          />
          <MotionBox
            initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
          >
            <Text fontSize={{ base: "md", md: "xl" }} letterSpacing="0.03em">
              <TextoRico texto={t(c.autor)} />
            </Text>
          </MotionBox>
        </Flex>

        {/* Móvil: flechas debajo con el contador en medio; escritorio: a los lados. Barra de progreso bajo el contador. */}
        <Flex align="center" justify="center" gap={5}>
          <Box display={{ base: "block", md: "none" }}>
            <Flecha color={color} dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
          </Box>
          <Flex direction="column" align="center" gap={2}>
            <Text fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.85} textShadow={sombra}>
              {i + 1} / {total}
            </Text>
            <Box w={{ base: "120px", md: "180px" }} h="1.5px" bg={`${color}33`} borderRadius="full" overflow="hidden">
              <Box h="100%" bg={color} borderRadius="full" style={{ width: `${((i + 1) / total) * 100}%` }} transition="width 0.7s cubic-bezier(0.22,1,0.36,1)" />
            </Box>
          </Flex>
          <Box display={{ base: "block", md: "none" }}>
            <Flecha color={color} dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
          </Box>
        </Flex>
      </Flex>

      <Box display={{ base: "none", md: "block" }}>
        <Flecha color={color} dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
      </Box>
    </Flex>
  );
}
