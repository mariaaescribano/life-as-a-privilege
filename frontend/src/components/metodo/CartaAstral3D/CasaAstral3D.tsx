import React, { useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { cuerpoByKey } from "../astrologiaData";
import { casasDelPlaneta } from "../astrologiaCasas";
import { ZodiacRing } from "./ZodiacRing";
import { HousesRing } from "./HousesRing";
import { Planet } from "./Planet";
import { PlanetTicks, type MarcaPlaneta } from "./PlanetTicks";
import { gradoAVisualRad, separarAngulos, type CartaNatal } from "./types";
void React;

/**
 * UNA CASA «sacada» de la carta de Tu Carta Astral: es la MISMA rueda (anillo de signos, anillo de casas, planetas
 * en su grado, marcas), pero ampliada y girada para que la casa `casa` llene el cuadro, con los planetas de esa casa
 * y los aros en beige. Los planetas mantienen su color.
 */
const R_ZODIAC_OUTER = 3.4;
const R_ZODIAC_INNER = 2.85;
const R_HOUSES_OUTER = 2.82;
const R_HOUSES_INNER = 2.35;
const R_PLANETS = 2.05;
const SEP_GLIFOS = 0.27;
const R_MIRA = 2.65; // a qué radio apunta la cámara (entre los glifos y el borde del zodíaco)
const TAU = Math.PI * 2;

function Camara({ y, z }: { y: number; z: number }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(0, y, z);
    camera.lookAt(0, y, 0); // recto al plano de la rueda, mirando al punto del tramo
    camera.updateProjectionMatrix();
  }, [camera, y, z]);
  return null;
}

export function CasaAstral3D({ carta, casa, tinte = "#F0DCC0" }: { carta: CartaNatal; casa: number; tinte?: string }) {
  const cusps = carta.cusps;
  const a0 = gradoAVisualRad(cusps[casa - 1], cusps);
  const a1 = gradoAVisualRad(cusps[casa % 12], cusps);
  const amplitud = (((a1 - a0) % TAU) + TAU) % TAU || Math.PI / 6;
  const medio = a0 + amplitud / 2;

  // Cuánto mundo cabe en el cuadro: el ancho del tramo en el borde del zodíaco, con holgura (y nunca menos que la
  // altura de los anillos + los glifos).
  const mitad = Math.max(1.12, R_ZODIAC_OUTER * Math.sin(Math.min(amplitud, 1.3) / 2) * 1.08);
  const z = mitad / Math.tan((25 * Math.PI) / 180);

  const planetas = useMemo(
    () => carta.planetas
      .filter((p) => p.planeta !== "ascendente" && !!cuerpoByKey(p.planeta) && casasDelPlaneta(p, carta.cusps).includes(casa))
      .sort((a, b) => a.grado - b.grado),
    [carta, casa],
  );
  const angulos = useMemo(() => {
    const real = planetas.map((p) => ({ key: p.planeta, ang: gradoAVisualRad(p.grado, cusps) }));
    return { real: new Map(real.map((r) => [r.key, r.ang])), glifo: separarAngulos(real, SEP_GLIFOS) };
  }, [planetas, cusps]);
  const marcas: MarcaPlaneta[] = planetas.flatMap((p) => {
    const c = cuerpoByKey(p.planeta);
    return c ? [{ real: angulos.real.get(p.planeta)!, color: c.color }] : [];
  });

  return (
    <Box position="absolute" inset={0} sx={{ clipPath: "inset(0 round 16px)", transform: "translateZ(0)" }}>
      <Canvas camera={{ position: [0, R_MIRA, z], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Camara y={R_MIRA} z={z} />
        <ambientLight intensity={0.3} />
        {/* Todo gira junto para que la casa quede arriba y derecha. */}
        <group rotation={[0, 0, Math.PI / 2 - medio]}>
          <ZodiacRing innerRadius={R_ZODIAC_INNER} outerRadius={R_ZODIAC_OUTER} cusps={cusps} tinte={tinte} />
          <HousesRing innerRadius={R_HOUSES_INNER} outerRadius={R_HOUSES_OUTER} cusps={cusps} tinte={tinte} />
          <PlanetTicks marcas={marcas} radioMarca={R_HOUSES_INNER} delay={0.6} />
          {planetas.map((p, i) => {
            const c = cuerpoByKey(p.planeta)!;
            const th = angulos.glifo.get(p.planeta) ?? angulos.real.get(p.planeta)!;
            return <Planet key={p.planeta} cuerpo={c} position={[Math.cos(th) * R_PLANETS, Math.sin(th) * R_PLANETS, 0]} focused={false} appearDelay={0.6 + i * 0.26} />;
          })}
        </group>
        <EffectComposer>
          <Bloom intensity={0.3} luminanceThreshold={0.5} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </Box>
  );
}
