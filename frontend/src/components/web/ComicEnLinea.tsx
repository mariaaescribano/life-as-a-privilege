import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import FotoViva from "../global/FotoViva";
import PalabrasVivas from "../global/PalabrasVivas";
import { Flecha } from "./LineaTiempoAstrologia";
import type { Vineta } from "../metodo/ComicViewer";

/**
 * Un cómic leído EN la página (sin popup), con el MISMO estilo que el de la Astrología (`LineaTiempoAstrologia`): la
 * foto a la izquierda (se descorre desde el lado hacia el que se avanza y se inclina con el puntero), el texto a la
 * derecha en un box transparente con su filo y su scroll, una flecha a cada lado (en móvil, debajo), y en medio el
 * contador con su barra de progreso. Al pasar, entran la foto y el texto nuevos. Pensado para ir sobre la foto de la
 * disciplina.
 *
 * `color` = la tinta de la disciplina (letra, flechas, filos); `sombra` = su sombra de texto.
 */
const EASE = "cubic-bezier(0.22,1,0.36,1)";
const entra = (sentido: 1 | -1, retraso = 0) => ({
  "@keyframes comicEntraSig": { from: { opacity: 0, transform: "translateX(34px)", filter: "blur(4px)" }, to: { opacity: 1, transform: "none", filter: "blur(0)" } },
  "@keyframes comicEntraAnt": { from: { opacity: 0, transform: "translateX(-34px)", filter: "blur(4px)" }, to: { opacity: 1, transform: "none", filter: "blur(0)" } },
  animation: `${sentido === 1 ? "comicEntraSig" : "comicEntraAnt"} 0.8s ${EASE} ${retraso}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});
const entraTexto = (retraso: number) => ({
  "@keyframes comicTexto": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "none" } },
  animation: `comicTexto 0.7s ${EASE} ${retraso}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

const ComicEnLinea = ({ vinetas, color, sombra }: { vinetas: Vineta[]; color: string; sombra: string }) => {
  const [i, setI] = useState(0);
  // Hacia dónde se va (1 = siguiente, -1 = anterior), para que la viñeta nueva llegue desde ese lado.
  const sentido = useRef<1 | -1>(1);
  const total = vinetas.length;
  const ir = (f: (n: number) => number) =>
    setI((n) => { const m = f(n); if (m !== n) sentido.current = m > n ? 1 : -1; return m; });
  const v = vinetas[Math.min(i, total - 1)];

  // La siguiente viñeta se baja con antelación para que el cambio no espere a la red.
  useEffect(() => {
    const sig = vinetas[i + 1];
    if (sig) { const img = new window.Image(); img.src = encodeURI(sig.src); }
  }, [i, vinetas]);

  // Teclado: ← y → pasan de viñeta.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowLeft") ir((n) => Math.max(0, n - 1));
      if (e.key === "ArrowRight") ir((n) => Math.min(total - 1, n + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (!v) return null;
  const anterior = () => ir((n) => Math.max(0, n - 1));
  const siguiente = () => ir((n) => Math.min(total - 1, n + 1));
  const s = sentido.current;

  return (
    <Reveal inView direction="up" distance={30} scaleFrom={0.97} blur duration={1} delay={0.1} w="100%">
      <Flex w="100%" maxW="1180px" mx="auto" px={{ base: 4, md: 8 }} align="center" gap={{ base: 3, md: 6 }} fontFamily="'EB Garamond', serif" color={color}>
        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" color={color} />
        </Box>

        <Flex direction="column" flex="1" minW={0} gap={{ base: 4, md: 5 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 5, md: 8 }} alignItems="stretch">
            {/* Foto, a la izquierda: se descorre desde el lado hacia el que se avanza. */}
            <FotoViva key={`f${i}`} desde={s === 1 ? "der" : "izq"} radio="12px" border={`1px solid ${color}66`} alignSelf="start" w="100%" maxW={{ base: "320px", md: "none" }} mx={{ base: "auto", md: 0 }}>
              <Image src={encodeURI(v.src)} alt="" w="100%" h="auto" display="block" />
            </FotoViva>

            {/* Texto, a la derecha: box transparente con el scroll vertical a la vista. */}
            <Box
              key={`t${i}`}
              sx={entra(s, 0.08)}
              position="relative"
              border={`1.5px solid ${color}80`}
              borderRadius="2xl"
              bg="transparent"
              w="100%"
              maxW={{ base: "320px", md: "none" }}
              mx={{ base: "auto", md: 0 }}
            >
              <Box
                position={{ base: "relative", md: "absolute" }}
                inset={{ md: 0 }}
                overflowY={{ base: "visible", md: "auto" }}
                px={{ base: 5, md: 7 }}
                py={{ base: 5, md: 6 }}
                tabIndex={0}
                textShadow={sombra}
                sx={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${color}b3 ${color}26`,
                  "&::-webkit-scrollbar": { width: "9px" },
                  "&::-webkit-scrollbar-track": { background: `${color}26`, borderRadius: "8px", margin: "14px 0" },
                  "&::-webkit-scrollbar-thumb": { background: `${color}b3`, borderRadius: "8px" },
                }}
              >
                {v.paragraphs.map((p, j) => (
                  <Text key={j} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" mt={j === 0 ? 0 : 3}>
                    <PalabrasVivas texto={p} cursivas total={1.3} retraso={0.5 + j * 0.25} />
                  </Text>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Móvil: las flechas debajo; en escritorio, a los lados. Contador y barra de progreso en medio. */}
          <Flex align="center" justify="center" gap={5}>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" color={color} />
            </Box>
            <Flex direction="column" align="center" gap={2}>
              <Text key={i} sx={entraTexto(0)} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.8} textShadow={sombra}>
                {i + 1} / {total}
              </Text>
              <Box w={{ base: "120px", md: "180px" }} h="1.5px" bg={`${color}33`} borderRadius="full" overflow="hidden">
                <Box h="100%" bg={color} borderRadius="full" style={{ width: `${((i + 1) / total) * 100}%` }} transition={`width 0.7s ${EASE}`} />
              </Box>
            </Flex>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" color={color} />
            </Box>
          </Flex>
        </Flex>

        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" color={color} />
        </Box>
      </Flex>
    </Reveal>
  );
};

export default ComicEnLinea;
