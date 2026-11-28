import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import FotoViva from "../global/FotoViva";
import PalabrasVivas from "../global/PalabrasVivas";
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
// Entrada de la viñeta: llega desde el lado hacia el que se avanza (derecha si va a la siguiente, izquierda si vuelve),
// con un desenfoque leve que se aclara. Los párrafos entran después, uno a uno (`entraTexto`).
const EASE = "cubic-bezier(0.22,1,0.36,1)";
const entra = (sentido: 1 | -1, retraso = 0) => ({
  "@keyframes lineaEntraSig": { from: { opacity: 0, transform: "translateX(34px)", filter: "blur(4px)" }, to: { opacity: 1, transform: "none", filter: "blur(0)" } },
  "@keyframes lineaEntraAnt": { from: { opacity: 0, transform: "translateX(-34px)", filter: "blur(4px)" }, to: { opacity: 1, transform: "none", filter: "blur(0)" } },
  animation: `${sentido === 1 ? "lineaEntraSig" : "lineaEntraAnt"} 0.8s ${EASE} ${retraso}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});
const entraTexto = (retraso: number) => ({
  "@keyframes lineaTexto": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "none" } },
  animation: `lineaTexto 0.7s ${EASE} ${retraso}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

export function Flecha({ dir, onClick, desactivada, label, color = BEIGE }: { dir: "prev" | "next"; onClick: () => void; desactivada: boolean; label: string; color?: string }) {
  return (
    <Box
      as="button"
      type="button"
      role="group"
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
      border={`1.5px solid ${color}`}
      bg="transparent"
      color={color}
      cursor={desactivada ? "default" : "pointer"}
      opacity={desactivada ? 0.3 : 1}
      transition="background 0.25s ease, opacity 0.25s ease, transform 0.25s ease"
      _hover={desactivada ? {} : { bg: `${color}1f`, transform: "scale(1.06)" }}
      _active={desactivada ? {} : { transform: "scale(0.94)" }}
      _focusVisible={focoBlanco}
    >
      {/* La flecha se adelanta un poco hacia donde lleva. */}
      <Box display="flex" transition={`transform 0.35s ${EASE}`} _groupHover={desactivada ? {} : { transform: `translateX(${dir === "next" ? 3 : -3}px)` }}>
        <FlechaBonita dir={dir} size="22px" />
      </Box>
    </Box>
  );
}

export default function LineaTiempoAstrologia({ activo }: { activo: boolean }) {
  const vinetas = useComic("astrologia-historia", HISTORIA_ASTROLOGIA);
  const [i, setI] = useState(0);
  // Hacia dónde se va (1 = siguiente, -1 = anterior), para que la viñeta nueva llegue desde ese lado.
  const sentido = useRef<1 | -1>(1);
  const ir = (f: (n: number) => number) =>
    setI((n) => { const m = f(n); if (m !== n) sentido.current = m > n ? 1 : -1; return m; });
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
    <Reveal activo={activo} direction="up" distance={30} scaleFrom={0.97} blur duration={1} delay={0.2} w="100%">
      <Flex w="100%" maxW="1180px" mx="auto" align="center" gap={{ base: 3, md: 6 }} fontFamily="'EB Garamond', serif" color={BEIGE}>
        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
        </Box>

        <Flex direction="column" flex="1" minW={0} gap={{ base: 4, md: 5 }}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 5, md: 8 }} alignItems="stretch">
            {/* Foto, a la izquierda */}
            {/* La foto se descorre desde el lado hacia el que se avanza, se asienta con zoom y, al pasar el ratón, se inclina. */}
            <FotoViva key={`f${i}`} desde={s === 1 ? "der" : "izq"} radio="12px" border={`1px solid ${BEIGE}66`} alignSelf="start" w="100%" maxW={{ base: "320px", md: "none" }} mx={{ base: "auto", md: 0 }}>
              <Image src={v.src} alt={v.eyebrow ?? ""} w="100%" h="auto" display="block" />
            </FotoViva>

            {/* Texto, a la derecha: box transparente con el scroll vertical a la vista. */}
            <Box
              key={`t${i}`}
              sx={entra(s, 0.08)}
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
                    <PalabrasVivas texto={v.eyebrow} total={0.7} retraso={0.35} />
                  </Text>
                )}
                {/* El texto se enciende palabra a palabra, párrafo tras párrafo, y las que quedan más abajo esperan a que bajes. */}
                {v.paragraphs.map((p, j) => (
                  <Text key={j} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" mt={j === 0 ? 0 : 3}>
                    <PalabrasVivas texto={p} cursivas total={1.3} retraso={0.5 + j * 0.25} />
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
            <Flex direction="column" align="center" gap={2}>
              <Text key={i} sx={entraTexto(0)} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.8}>
                {i + 1} / {total}
              </Text>
              {/* Barra de progreso: la línea se va llenando con el tiempo recorrido. */}
              <Box w={{ base: "120px", md: "180px" }} h="1.5px" bg={`${BEIGE}33`} borderRadius="full" overflow="hidden">
                <Box h="100%" bg={BEIGE} borderRadius="full" style={{ width: `${((i + 1) / total) * 100}%` }} transition={`width 0.7s ${EASE}`} />
              </Box>
            </Flex>
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
