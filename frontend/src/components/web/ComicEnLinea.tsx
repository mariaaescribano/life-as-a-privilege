import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FlechaBonita } from "../global/FlechaBonita";
import { focoBlanco } from "../global/foco";
import { Reveal } from "../global/Reveal";
import type { Vineta } from "../metodo/ComicViewer";

/**
 * Un cómic leído EN la página (sin popup): la viñeta a la izquierda, su texto a la derecha y dos flechas
 * debajo del texto para ir pasando. El texto de todas las viñetas ocupa el mismo hueco (el de la más larga),
 * así la caja no salta de alto al cambiar. Pensado para ir sobre la foto de la disciplina.
 *
 * `color` = la tinta de la disciplina (letra, flechas, filo); `sombra` = su sombra de texto.
 */
const ComicEnLinea = ({ vinetas, color, sombra }: { vinetas: Vineta[]; color: string; sombra: string }) => {
  const [i, setI] = useState(0);
  const n = vinetas.length;

  // La siguiente viñeta se baja con antelación para que el cambio no espere a la red.
  useEffect(() => {
    const sig = vinetas[i + 1];
    if (sig) { const img = new window.Image(); img.src = encodeURI(sig.src); }
  }, [i, vinetas]);

  const Flecha = ({ dir, desactivada }: { dir: "prev" | "next"; desactivada: boolean }) => (
    <Box
      as="button"
      type="button"
      aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
      disabled={desactivada}
      onClick={() => setI((x) => Math.min(n - 1, Math.max(0, x + (dir === "prev" ? -1 : 1))))}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: "52px", md: "60px" }}
      h={{ base: "52px", md: "60px" }}
      borderRadius="full"
      color={color}
      border={`1.5px solid ${color}aa`}
      bg={`${color}1a`}
      boxShadow={`0 0 10px rgba(255,255,255,0.16), 0 0 22px ${color}44, inset 0 0 12px ${color}22`}
      cursor={desactivada ? "default" : "pointer"}
      opacity={desactivada ? 0.35 : 1}
      transition="background 0.2s ease, transform 0.2s ease, opacity 0.2s ease"
      _hover={desactivada ? {} : { bg: `${color}2b`, transform: "translateY(-2px)" }}
      _active={desactivada ? {} : { transform: "scale(0.96)" }}
      _focusVisible={focoBlanco}
    >
      <FlechaBonita dir={dir} size="26px" />
    </Box>
  );

  return (
    <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 8, md: 12, lg: 16 }} maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }}>
      {/* Izquierda: la viñeta, con un fundido corto al cambiar. */}
      <Reveal inView direction="right" distance={36} scaleFrom={0.94} duration={1.2} w={{ base: "100%", md: "46%" }} maxW={{ base: "420px", md: "none" }} flexShrink={0}>
        <Box
          position="relative"
          borderRadius="22px"
          overflow="hidden"
          border={`1.5px solid ${color}`}
          sx={{ "@keyframes vinetaEntra": { from: { opacity: 0 }, to: { opacity: 1 } } }}
        >
          <Image
            key={i}
            src={encodeURI(vinetas[i].src)}
            alt=""
            w="100%"
            h="auto"
            display="block"
            sx={{ animation: "vinetaEntra 0.5s ease both", "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
          />
        </Box>
      </Reveal>

      {/* Derecha: el texto y las flechas. */}
      <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
        <Box display="grid" w="100%">
          {vinetas.map((v, k) => (
            <Flex
              key={k}
              direction="column"
              gap={4}
              gridArea="1 / 1"
              visibility={k === i ? "visible" : "hidden"}
              aria-hidden={k === i ? undefined : true}
              opacity={k === i ? 1 : 0}
              transition="opacity 0.5s ease"
              align={{ base: "center", md: "flex-start" }}
            >
              {v.paragraphs.map((p, j) => (
                <Text key={j} color={color} textShadow={sombra} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55" letterSpacing="0.01em">
                  {p}
                </Text>
              ))}
            </Flex>
          ))}
        </Box>
        <Flex align="center" gap={4}>
          <Flecha dir="prev" desactivada={i === 0} />
          <Flecha dir="next" desactivada={i === n - 1} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ComicEnLinea;
