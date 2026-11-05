import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
void React;

export interface MarcaPlaneta {
  /** Ángulo (math angle 3D) del grado EXACTO del cuerpo. */
  real: number;
  color: string;
}

interface PlanetTicksProps {
  marcas: MarcaPlaneta[];
  /** Radio al que arranca la marca (borde interior del aro de casas). */
  radioMarca: number;
  /** Segundos de espera antes del fundido (que salgan con los planetas). */
  delay?: number;
}

const MARCA_LARGO = 0.1; // largo de la marca del grado exacto
const OPACIDAD = 0.85;

/**
 * UNA marca fina en el grado EXACTO de cada cuerpo, pegada al aro de las casas. Si el glifo se
 * ha apartado porque dos cuerpos estaban casi juntos, la marca sigue señalando su grado real.
 * (Sin líneas guía hasta el glifo: con una sola línea basta.)
 */
export function PlanetTicks({ marcas, radioMarca, delay = 0 }: PlanetTicksProps) {
  const { pos, col } = useMemo(() => {
    const p: number[] = [], c: number[] = [];
    for (const m of marcas) {
      const color = new THREE.Color(m.color);
      const r1 = radioMarca, r2 = radioMarca - MARCA_LARGO;
      p.push(Math.cos(m.real) * r1, Math.sin(m.real) * r1, 0, Math.cos(m.real) * r2, Math.sin(m.real) * r2, 0);
      c.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
    return { pos: new Float32Array(p), col: new Float32Array(c) };
  }, [marcas, radioMarca]);

  const mat = useRef<THREE.LineBasicMaterial>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const k = Math.min(1, Math.max(0, (t.current - delay) / 0.8));
    if (mat.current) mat.current.opacity = OPACIDAD * k;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={mat} vertexColors transparent opacity={0} depthWrite={false} toneMapped={false} />
    </lineSegments>
  );
}
