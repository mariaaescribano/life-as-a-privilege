import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Canvas, useThree } from "@react-three/fiber";
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

// Distancia de cámara: a fov 50 la media-altura visible = z·tan(25°). El anillo
// zodiacal llega a 3.4, así que con z≈7.3 (media-altura ≈ 3.40) la rueda LLENA
// el círculo justo hasta el borde, sin recortarse en 4 lados planos (que pasa si
// z es menor) ni dejar hueco/«segundo círculo» (que pasa si z es mayor).
const CAM_Z = 7.3;

// Aplica la posición de la cámara de forma REACTIVA. La prop `camera` de <Canvas>
// solo se lee al montar, así que un cambio de CAM_Z no se reflejaba con HMR (y
// tampoco si se quisiera animar). Este rig la fija en un efecto → siempre aplica.
function CameraRig({ z }: { z: number }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(0, 0, z);
    camera.updateProjectionMatrix();
  }, [camera, z]);
  return null;
}

export function CartaAstral3D({ carta = cartaDemo, color = "#dcd0ff", onSaberMas, completados }: CartaAstral3DProps) {
  // Solo planetas que REALMENTE se dibujan (tienen glifo). Excluimos el
  // ascendente y cualquier cuerpo sin ilustración: así los aspectos nunca
  // trazan una raya hacia un punto vacío (donde no hay planeta).
  const planetasOrdenados = useMemo(() => {
    return [...carta.planetas]
      .filter(p => p.planeta !== "ascendente" && !!cuerpoByKey(p.planeta))
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
      if (e.key === "ArrowLeft")  { e.preventDefault(); stepFocus(1); }
      if (e.key === "ArrowRight") { e.preventDefault(); stepFocus(-1);  }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusInside, stepFocus]);

  const planetMeshes = useMemo(() => {
    return planetasOrdenados.map((p, i) => {
      const c = cuerpoByKey(p.planeta);
      if (!c) return null;
      const theta = gradoAVisualRad(p.grado, carta.cusps);
      const x = Math.cos(theta) * R_PLANETS;
      const y = Math.sin(theta) * R_PLANETS;
      return (
        <Planet
          key={p.planeta}
          cuerpo={c}
          position={[x, y, 0]}
          focused={i === focusedIdx}
          onClick={() => setFocusedIdx(i)}
          // Brotan uno a uno, alrededor de la rueda, con un desfase amplio para
          // que sea pausado y solemne (más épico que rápido).
          appearDelay={0.6 + i * 0.26}
        />
      );
    });
  }, [planetasOrdenados, carta.cusps, focusedIdx]);

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
      {/* ── Controles (flechas + etiqueta) DEBAJO del círculo (order flex) ── */}
      <Flex
        order={1}
        align="center"
        justify="center"
        gap={{ base: 3, md: 6 }}
        w="100%"
        maxW="520px"
        mt={{ base: 1, md: 2 }}
      >
        <ArrowButton dir="left"  color={color} onClick={() => stepFocus(1)} />

        <Flex
          direction="column"
          align="stretch"
          gap={2}
          // Se adapta al ancho disponible (no se desborda en pantallas estrechas)
          // pero con un tope: así el botón tampoco cambia de tamaño al cambiar de
          // planeta (el ancho lo fija el contenedor, no la longitud del nombre).
          flex="1"
          minW={0}
          maxW="300px"
        >
          {focusedCuerpo && focused && (() => {
            const leido = !!completados?.[focusedCuerpo.key];
            const c = focusedCuerpo.color;
            const interactivo = !!onSaberMas;

            const contenido = (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap={1}
                w="100%"
                // Padding interno para no chocar con el círculo del icono lateral.
                px={interactivo ? { base: 8, md: 10 } : 0}
              >
                <Text
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  lineHeight="1.1"
                  textAlign="center"
                  // noOfLines + nowrap: el texto no rompe ni desborda; si fuera
                  // demasiado largo se trunca con ellipsis manteniendo el tamaño.
                  noOfLines={1}
                  w="100%"
                  // Halo del nombre un 20% más bajo (antes cc / 77): con el
                  // Bloom de la rueda al lado, el nombre daba demasiada luz.
                  style={{ textShadow: `0 0 10px ${c}a3, 0 0 22px ${c}5f` }}
                >
                  {focusedCuerpo.label}
                </Text>
                <Text
                  color={`${c}ee`}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "2xs", md: "xs" }}
                  fontStyle="italic"
                  letterSpacing="0.04em"
                  textAlign="center"
                  noOfLines={1}
                  w="100%"
                  style={{ textShadow: `0 0 8px rgba(255,255,255,0.28)` }}
                >
                  {ZODIAC_SIGNS[focused.signoIdx].name} · Casa {focused.casa}
                </Text>
              </Flex>
            );

            const iconoLateral = interactivo ? (
              <Box
                position="absolute"
                right={{ base: 3, md: 3.5 }}
                top="50%"
                transform="translateY(-50%)"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={{ base: "26px", md: "30px" }}
                h={{ base: "26px", md: "30px" }}
                borderRadius="full"
                bg={leido ? `${c}33` : `${c}22`}
                color={c}
                pointerEvents="none"
                sx={{ boxShadow: `0 0 10px ${c}44` }}
              >
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
            ) : null;

            // Altura FIJA del botón: nunca cambia entre planetas.
            const fixedH = { base: "62px", md: "72px" };

            if (!interactivo) {
              return (
                <Box
                  position="relative"
                  h={fixedH}
                  display="flex"
                  alignItems="center"
                  px={{ base: 4, md: 5 }}
                  borderRadius="xl"
                  bg={`${c}08`}
                  // Borde del color del arquetipo (cada planeta el suyo).
                  border={`1px solid ${c}55`}
                >
                  {contenido}
                </Box>
              );
            }

            return (
              <Box
                as="button"
                onClick={() => onSaberMas?.(focusedCuerpo.key)}
                position="relative"
                h={fixedH}
                display="flex"
                alignItems="center"
                px={{ base: 4, md: 5 }}
                borderRadius="xl"
                bg={`${c}12`}
                // Borde del color del arquetipo: cada planeta enmarca su botón
                // con SU color (Neptuno malva, Júpiter dorado…).
                border={`1px solid ${c}99`}
                color={c}
                cursor="pointer"
                textAlign="center"
                sx={{
                  transition: "all 0.22s ease",
                  boxShadow: `0 0 14px ${c}29, 0 0 32px ${c}19, inset 0 0 16px rgba(255,255,255,0.032)`,
                  animation: leido ? "none" : "saberMasPulse 2.6s ease-in-out infinite",
                  "@keyframes saberMasPulse": {
                    "0%, 100%": { boxShadow: `0 0 14px ${c}29, 0 0 32px ${c}19, inset 0 0 16px rgba(255,255,255,0.032)` },
                    "50%":       { boxShadow: `0 0 22px ${c}6d, 0 0 50px ${c}44, inset 0 0 18px rgba(255,255,255,0.064)` },
                  },
                  _hover: {
                    bg: `${c}22`,
                    borderColor: c,
                    transform: "translateY(-1px)",
                    boxShadow: `0 0 26px ${c}7a, 0 0 56px ${c}44, inset 0 0 18px rgba(255,255,255,0.064)`,
                    animation: "none",
                  },
                  _active: { transform: "translateY(0)" },
                }}
              >
                {contenido}
                {iconoLateral}
              </Box>
            );
          })()}
        </Flex>

        <ArrowButton dir="right" color={color} onClick={() => stepFocus(-1)}  />
      </Flex>

      {/* ── Círculo de la carta (va ARRIBA; los controles debajo vía order) ── */}
      <Box
        order={0}
        // Antes 80% en desktop: dejaba el círculo pequeño dentro de la caja.
        // Ahora 90%: la rueda es un 10% más pequeña que el ancho disponible, y
        // encoge el DISCO ENTERO (fondo + halo + rueda). Ojo: no escalar solo la
        // rueda por dentro del Canvas — el disco se quedaría del tamaño de antes
        // y aparecería un aro vacío alrededor (el feo "doble círculo").
        w="90%"
        maxW="612px"
        mx="auto"
        mt={0}
        position="relative"
        sx={{
          // Cuadrado A PRUEBA DE BALAS: algunos navegadores móviles no aplican
          // bien `aspect-ratio` dentro de un flex, y el Canvas salía con alto ≠
          // ancho → el círculo se veía ovalado. El truco del padding-bottom
          // garantiza alto = ancho en todos los navegadores.
          "&::before": { content: '""', display: "block", paddingBottom: "100%" },
          borderRadius: "9999px",
          overflow: "hidden",
          // Interior 15% más oscuro que el fondo (capa negra al 15% sobre el SpaceBg,
          // visible por la transparencia del Canvas).
          background: "rgba(0,0,0,0.15)",
          // Sin `border`: era el "segundo círculo" que se veía por fuera del
          // anillo zodiacal. Dejamos solo el glow suave (halo, no una línea).
          boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}22, inset 0 0 60px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Capa absoluta que rellena el cuadrado (el ::before ocupa el flujo).
            clipPath circular OBLIGATORIO: el <canvas> WebGL se compone en su
            propia capa GPU y NO respeta el overflow:hidden + border-radius del
            padre, así que las esquinas del cuadrado (estrellas del Starfield y
            bloom) asomaban como una "luz cuadrada". clip-path sí recorta capas
            compuestas → el canvas queda perfectamente circular. */}
        <Box position="absolute" inset={0}
             sx={{ clipPath: "circle(50% at 50% 50%)", borderRadius: "9999px", overflow: "hidden", transform: "translateZ(0)" }}>
        <Canvas
          camera={{ position: [0, 0, CAM_Z], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <CameraRig z={CAM_Z} />
          <ambientLight intensity={0.3} />

          <Starfield />

          <ZodiacRing
            innerRadius={R_ZODIAC_INNER}
            outerRadius={R_ZODIAC_OUTER}
            cusps={carta.cusps}
          />
          <HousesRing
            innerRadius={R_HOUSES_INNER}
            outerRadius={R_HOUSES_OUTER}
          />
          <Aspects
            planetas={planetasOrdenados}
            aspectos={carta.aspectos}
            cusps={carta.cusps}
            radio={R_PLANETS}
            // Arranca cuando ya ha brotado el último planeta (ver appearDelay + APPEAR_DUR).
            startDelay={0.6 + (planetasOrdenados.length - 1) * 0.26 + 1.1}
          />
          {planetMeshes}

          {/* Bloom contenido: el umbral alto deja fuera los medios tonos (antes,
              con 0.18, TODO el halo de los planetas florecía y la rueda parecía
              iluminada por dentro) y la intensidad baja hace que solo el núcleo
              de cada cuerpo desprenda un poco de luz. */}
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
        </Box>
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
      w={{ base: "30px", md: "34px" }}
      h={{ base: "30px", md: "34px" }}
      borderRadius="full"
      bg="rgba(255,255,255,0.06)"
      border={`1px solid ${color}55`}
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
      <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1" style={{ textShadow: `0 0 8px ${color}cc` }}>
        {isLeft ? "‹" : "›"}
      </Text>
    </Flex>
  );
}
