import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { ZODIAC_SIGNS, cuerpoByKey } from "../astrologiaData";
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
}

const R_ZODIAC_OUTER = 3.4;
const R_ZODIAC_INNER = 2.85;
const R_HOUSES_OUTER = 2.82;
const R_HOUSES_INNER = 2.35;
const R_PLANETS = 2.05;

export function CartaAstral3D({ carta = cartaDemo, color = "#dcd0ff" }: CartaAstral3DProps) {
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
      <Box
        w="100%"
        maxW="640px"
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
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#050816"]} />
          <fog attach="fog" args={["#050816", 8, 30]} />
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

      {/* ── Controles (flechas + etiqueta) fuera del círculo ── */}
      <Flex
        align="center"
        justify="center"
        gap={{ base: 4, md: 6 }}
        w="100%"
        maxW="520px"
      >
        <ArrowButton dir="left"  color={color} onClick={() => stepFocus(-1)} />

        <Flex direction="column" align="center" gap={1} minW={{ base: "140px", md: "200px" }}>
          {focusedCuerpo && focused && (
            <>
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
            </>
          )}
        </Flex>

        <ArrowButton dir="right" color={color} onClick={() => stepFocus(1)}  />
      </Flex>
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
