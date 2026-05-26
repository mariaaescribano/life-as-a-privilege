import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { ZODIAC_SIGNS, cuerpoByKey, type CuerpoKey } from "../astrologiaData";
import { Starfield } from "./Starfield";
import { ZodiacRing } from "./ZodiacRing";
import { HousesRing } from "./HousesRing";
import { Planet } from "./Planet";
import { Aspects } from "./Aspects";
import { cartaDemo } from "./demoChart";
import { gradoAVisualRad, type CartaNatal } from "./types";
void React;

interface CartaAstral3DProps {
  carta?: CartaNatal;
  color?: string;
  /** Si se proporciona, aparece un botón "¿Quieres saber más?" debajo del nombre del planeta enfocado. */
  onSaberMas?: (cuerpoKey: CuerpoKey) => void;
  /** Para marcar planetas ya completados (ponemos un ✓ en su etiqueta). */
  completados?: Partial<Record<CuerpoKey, boolean>>;
}

const R_ZODIAC_OUTER = 3.4;
const R_ZODIAC_INNER = 2.85;
const R_HOUSES_OUTER = 2.82;
const R_HOUSES_INNER = 2.35;
const R_PLANETS = 2.05;

export function CartaAstral3D({ carta = cartaDemo, color = "#dcd0ff", onSaberMas, completados }: CartaAstral3DProps) {
  const planetasOrdenados = useMemo(() => {
    return [...carta.planetas]
      .filter(p => p.planeta !== "ascendente")
      .sort((a, b) => a.grado - b.grado);
  }, [carta.planetas]);

  const [focusedIdx, setFocusedIdx] = useState(0);
  const focused = planetasOrdenados[focusedIdx];
  const focusedCuerpo = cuerpoByKey(focused?.planeta ?? "");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [focusInside, setFocusInside] = useState(false);

  const stepFocus = useCallback((dir: 1 | -1) => {
    setFocusedIdx(prev => {
      const n = planetasOrdenados.length;
      return (prev + dir + n) % n;
    });
  }, [planetasOrdenados.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!focusInside) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); stepFocus(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); stepFocus(1);  }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusInside, stepFocus]);

  const planetMeshes = useMemo(() => {
    return planetasOrdenados.map((p, i) => {
      const c = cuerpoByKey(p.planeta);
      if (!c) return null;
      const theta = gradoAVisualRad(p.grado, carta.ascendente);
      const x = Math.cos(theta) * R_PLANETS;
      const y = Math.sin(theta) * R_PLANETS;
      return (
        <Planet
          key={p.planeta}
          cuerpo={c}
          position={[x, y, 0]}
          focused={i === focusedIdx}
          onClick={() => setFocusedIdx(i)}
        />
      );
    });
  }, [planetasOrdenados, carta.ascendente, focusedIdx]);

  return (
    <Flex
      ref={wrapperRef}
      tabIndex={0}
      onFocus={() => setFocusInside(true)}
      onBlur={() => setFocusInside(false)}
      onMouseEnter={() => setFocusInside(true)}
      onMouseLeave={() => setFocusInside(false)}
      direction="column"
      align="center"
      gap={{ base: 4, md: 6 }}
      w="100%"
      outline="none"
      sx={{ userSelect: "none" }}
    >
      {/* ── Controles (flechas + etiqueta) ARRIBA del círculo ── */}
      <Flex
        align="center"
        justify="center"
        gap={{ base: 4, md: 6 }}
        w="100%"
        maxW="520px"
      >
        <ArrowButton dir="left"  color={color} onClick={() => stepFocus(-1)} />

        <Flex direction="column" align="center" gap={2} minW={{ base: "160px", md: "220px" }}>
          {focusedCuerpo && focused && (
            <>
              <Flex align="center" gap={2}>
                <Text
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  style={{ textShadow: `0 0 10px ${focusedCuerpo.color}cc, 0 0 22px ${focusedCuerpo.color}77` }}
                >
                  {focusedCuerpo.label}
                </Text>
                {completados?.[focusedCuerpo.key] && (
                  <Text
                    color={focusedCuerpo.color}
                    fontSize="md"
                    style={{ textShadow: `0 0 8px ${focusedCuerpo.color}` }}
                  >
                    ✓
                  </Text>
                )}
              </Flex>
              {onSaberMas ? (() => {
                const leido = !!completados?.[focusedCuerpo.key];
                return (
                  <Flex
                    as="button"
                    onClick={() => onSaberMas(focusedCuerpo.key)}
                    mt={1}
                    px={{ base: 4, md: 5 }}
                    py={{ base: 1.5, md: 2 }}
                    borderRadius="full"
                    bg={`${focusedCuerpo.color}10`}
                    color={focusedCuerpo.color}
                    border={`1px solid ${focusedCuerpo.color}77`}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "xs", md: "sm" }}
                    letterSpacing="0.06em"
                    cursor="pointer"
                    align="center"
                    gap={2}
                    sx={{
                      transition: "all 0.2s ease",
                      boxShadow: `0 0 10px ${focusedCuerpo.color}33, 0 0 22px ${focusedCuerpo.color}1f`,
                      textShadow: `0 0 8px ${focusedCuerpo.color}88, 0 0 18px rgba(255,255,255,0.25)`,
                      animation: leido ? "none" : "saberMasPulse 2.6s ease-in-out infinite",
                      "@keyframes saberMasPulse": {
                        "0%, 100%": { boxShadow: `0 0 10px ${focusedCuerpo.color}33, 0 0 22px ${focusedCuerpo.color}1f` },
                        "50%":       { boxShadow: `0 0 18px ${focusedCuerpo.color}77, 0 0 36px ${focusedCuerpo.color}44` },
                      },
                      _hover: {
                        bg: `${focusedCuerpo.color}22`,
                        borderColor: focusedCuerpo.color,
                        boxShadow: `0 0 22px ${focusedCuerpo.color}99, 0 0 44px ${focusedCuerpo.color}55`,
                        animation: "none",
                      },
                    }}
                  >
                    <Text as="span" fontStyle="italic">
                      {ZODIAC_SIGNS[focused.signoIdx].name} · Casa {focused.casa}
                    </Text>
                    <Box as="span" display="inline-flex" alignItems="center" opacity={0.95}>
                      {leido ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="M13 6l6 6-6 6" />
                        </svg>
                      )}
                    </Box>
                  </Flex>
                );
              })() : (
                <Text
                  color={`${focusedCuerpo.color}ee`}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontStyle="italic"
                  letterSpacing="0.05em"
                  style={{ textShadow: `0 0 8px rgba(255,255,255,0.4)` }}
                >
                  {ZODIAC_SIGNS[focused.signoIdx].name} · Casa {focused.casa}
                </Text>
              )}
            </>
          )}
        </Flex>

        <ArrowButton dir="right" color={color} onClick={() => stepFocus(1)}  />
      </Flex>

      {/* ── Círculo de la carta ── */}
      <Box
        w="100%"
        position="relative"
        sx={{
          aspectRatio: "1 / 1",
          borderRadius: "9999px",
          overflow: "hidden",
          boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}22, inset 0 0 60px rgba(255,255,255,0.05)`,
          border: `1px solid ${color}55`,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />

          <Starfield />

          <ZodiacRing
            innerRadius={R_ZODIAC_INNER}
            outerRadius={R_ZODIAC_OUTER}
            ascendente={carta.ascendente}
          />
          <HousesRing
            innerRadius={R_HOUSES_INNER}
            outerRadius={R_HOUSES_OUTER}
            cusps={carta.cusps}
            ascendente={carta.ascendente}
          />
          <Aspects
            planetas={carta.planetas}
            aspectos={carta.aspectos}
            ascendente={carta.ascendente}
            radio={R_PLANETS}
          />
          {planetMeshes}

          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.6}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </Box>
    </Flex>
  );
}

function ArrowButton({ dir, color, onClick }: { dir: "left" | "right"; color: string; onClick: () => void }) {
  const isLeft = dir === "left";
  return (
    <Flex
      as="button"
      onClick={onClick}
      w={{ base: "40px", md: "48px" }}
      h={{ base: "40px", md: "48px" }}
      borderRadius="full"
      bg="rgba(255,255,255,0.06)"
      border={`1px solid ${color}66`}
      color="white"
      align="center"
      justify="center"
      cursor="pointer"
      flexShrink={0}
      sx={{
        backdropFilter: "blur(6px)",
        boxShadow: `0 0 12px ${color}44, 0 0 24px ${color}22`,
        transition: "all 0.2s ease",
        _hover: {
          bg: "rgba(255,255,255,0.16)",
          boxShadow: `0 0 18px ${color}99, 0 0 38px ${color}55`,
        },
      }}
      aria-label={isLeft ? "Anterior" : "Siguiente"}
    >
      <Text fontSize={{ base: "xl", md: "2xl" }} lineHeight="1" style={{ textShadow: `0 0 8px ${color}cc` }}>
        {isLeft ? "‹" : "›"}
      </Text>
    </Flex>
  );
}
