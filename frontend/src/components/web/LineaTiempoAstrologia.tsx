import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { FlechaBonita } from "../global/FlechaBonita";
import { focoBlanco } from "../global/foco";
import { HISTORIA_ASTROLOGIA } from "../metodo/comicHistoriaAstrologia";
import { useComic } from "../../i18n/comics";
import { FONDO_PAGINA_BEIGE as BEIGE } from "../../GlobalVariables";

/**
 * Línea del tiempo de la Astrología: las quince viñetas de «La historia de la Astrología» (las mismas fotos y los
 * mismos textos de Ilustraciones, en el idioma activo), de una en una. La FOTO va a la izquierda, tal cual; el TEXTO
 * a la derecha, dentro de un box transparente con su barra de scroll vertical a la vista (el cielo estrellado de la
 * banda se sigue viendo detrás). A los lados, una flecha para pasar a la viñeta anterior o a la siguiente: al pasar,
 * entran la foto y el texto nuevos. Letra en beige.
 */
const entra = {
  "@keyframes lineaEntra": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "none" } },
  animation: "lineaEntra 0.55s cubic-bezier(0.22,1,0.36,1) both",
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

export function Flecha({ dir, onClick, desactivada, label }: { dir: "prev" | "next"; onClick: () => void; desactivada: boolean; label: string }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      disabled={desactivada}
      aria-label={label}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: "44px", md: "52px" }}
      h={{ base: "44px", md: "52px" }}
      flexShrink={0}
      borderRadius="full"
      border={`1.5px solid ${BEIGE}`}
      bg="transparent"
      color={BEIGE}
      cursor={desactivada ? "default" : "pointer"}
      opacity={desactivada ? 0.3 : 1}
      transition="background 0.25s ease, opacity 0.25s ease"
      _hover={desactivada ? {} : { bg: `${BEIGE}1f` }}
      _focusVisible={focoBlanco}
    >
      <FlechaBonita dir={dir} size="22px" />
    </Box>
  );
}

export default function LineaTiempoAstrologia({ activo }: { activo: boolean }) {
  const vinetas = useComic("astrologia-historia", HISTORIA_ASTROLOGIA);
  const [i, setI] = useState(0);
  const total = vinetas.length;
  const v = vinetas[Math.min(i, total - 1)];

  // Precarga la foto de la siguiente, para que el cambio sea inmediato.
  useEffect(() => {
    const sig = vinetas[i + 1]?.src;
    if (sig) { const img = new window.Image(); img.src = sig; }
  }, [i, vinetas]);

  // Teclado: ← y → pasan de viñeta.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
      if (e.key === "ArrowRight") setI((n) => Math.min(total - 1, n + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (!v) return null;
  const anterior = () => setI((n) => Math.max(0, n - 1));
  const siguiente = () => setI((n) => Math.min(total - 1, n + 1));

  return (
    <Reveal activo={activo} direction="up" distance={30} scaleFrom={0.97} blur duration={1} delay={0.2} w="100%">
      <Flex w="100%" maxW="1180px" mx="auto" align="center" gap={{ base: 3, md: 6 }} fontFamily="'EB Garamond', serif" color={BEIGE}>
        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
        </Box>

        <Flex direction="column" flex="1" minW={0} gap={{ base: 4, md: 5 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 5, md: 8 }} alignItems="stretch">
            {/* Foto, a la izquierda */}
            <Box key={`f${i}`} sx={entra} borderRadius="xl" overflow="hidden" border={`1px solid ${BEIGE}66`} alignSelf="start" w="100%" maxW={{ base: "320px", md: "none" }} mx={{ base: "auto", md: 0 }}>
              <Image src={v.src} alt={v.eyebrow ?? ""} w="100%" h="auto" display="block" />
            </Box>

            {/* Texto, a la derecha: box transparente con el scroll vertical a la vista. */}
            <Box
              key={`t${i}`}
              sx={entra}
              position="relative"
              border={`1.5px solid ${BEIGE}80`}
              borderRadius="2xl"
              bg="transparent"
              minH={{ base: "240px", md: "0" }}
            >
              <Box
                position={{ base: "relative", md: "absolute" }}
                inset={{ md: 0 }}
                maxH={{ base: "300px", md: "none" }}
                overflowY="scroll"
                overscrollBehavior="contain"
                px={{ base: 5, md: 7 }}
                py={{ base: 5, md: 6 }}
                tabIndex={0}
                sx={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${BEIGE}b3 ${BEIGE}26`,
                  "&::-webkit-scrollbar": { width: "9px" },
                  "&::-webkit-scrollbar-track": { background: `${BEIGE}26`, borderRadius: "8px", margin: "14px 0" },
                  "&::-webkit-scrollbar-thumb": { background: `${BEIGE}b3`, borderRadius: "8px" },
                }}
              >
                {v.eyebrow && (
                  <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.18em" textTransform="uppercase" mb={3} opacity={0.9}>
                    {v.eyebrow}
                  </Text>
                )}
                {v.paragraphs.map((p, j) => (
                  <Text key={j} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" mt={j === 0 ? 0 : 3}>
                    {p}
                  </Text>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Móvil: las flechas debajo; en escritorio, a los lados. Contador en medio. */}
          <Flex align="center" justify="center" gap={5}>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
            </Box>
            <Text fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.8}>
              {i + 1} / {total}
            </Text>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
            </Box>
          </Flex>
        </Flex>

        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
        </Box>
      </Flex>
    </Reveal>
  );
}
