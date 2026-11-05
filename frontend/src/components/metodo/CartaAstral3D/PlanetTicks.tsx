import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
void React;

export interface MarcaPlaneta {
  /** Ángulo (math angle 3D) del grado EXACTO del cuerpo. */
  real: number;
  /** Ángulo donde se dibuja su glifo (puede estar desplazado si hay amontonamiento). */
  glifo: number;
  color: string;
}

interface PlanetTicksProps {
  marcas: MarcaPlaneta[];
  /** Radio al que arranca la marca (borde interior del aro de casas). */
  radioMarca: number;
  /** Radio del centro de los glifos. */
  radioGlifo: number;
  /** Segundos de espera antes del fundido (que salgan con los planetas). */
  delay?: number;
}

const MARCA_LARGO = 0.1;   // largo de la marca del grado exacto
const GLIFO_HUECO = 0.3;   // la guía se detiene antes de tocar el glifo
const OPACIDAD = 0.85;
const GUIA_OPACIDAD = 0.4;

/**
 * Una marca fina en el grado EXACTO de cada cuerpo, pegada al aro de las casas, y —cuando el
 * glifo se ha tenido que apartar porque dos cuerpos estaban casi juntos— una guía muy fina de
 * la marca hasta su glifo. Así, aunque se amontonen, se sabe dónde está cada uno de verdad.
 */
export function PlanetTicks({ marcas, radioMarca, radioGlifo, delay = 0 }: PlanetTicksProps) {
  const { marcaPos, marcaCol, guiaPos, guiaCol } = useMemo(() => {
    const mp: number[] = [], mc: number[] = [], gp: number[] = [], gc: number[] = [];
    for (const m of marcas) {
      const c = new THREE.Color(m.color);
      const r1 = radioMarca, r2 = radioMarca - MARCA_LARGO;
      mp.push(Math.cos(m.real) * r1, Math.sin(m.real) * r1, 0, Math.cos(m.real) * r2, Math.sin(m.real) * r2, 0);
      mc.push(c.r, c.g, c.b, c.r, c.g, c.b);
      if (Math.abs(m.glifo - m.real) > 0.02) {
        const rg = radioGlifo + GLIFO_HUECO;
        gp.push(Math.cos(m.real) * r2, Math.sin(m.real) * r2, 0, Math.cos(m.glifo) * rg, Math.sin(m.glifo) * rg, 0);
        gc.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
    }
    return {
      marcaPos: new Float32Array(mp), marcaCol: new Float32Array(mc),
      guiaPos: new Float32Array(gp), guiaCol: new Float32Array(gc),
    };
  }, [marcas, radioMarca, radioGlifo]);

  const marcaMat = useRef<THREE.LineBasicMaterial>(null);
  const guiaMat = useRef<THREE.LineBasicMaterial>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const k = Math.min(1, Math.max(0, (t.current - delay) / 0.8));
    if (marcaMat.current) marcaMat.current.opacity = OPACIDAD * k;
    if (guiaMat.current) guiaMat.current.opacity = GUIA_OPACIDAD * k;
  });

  return (
    <>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[marcaPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[marcaCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={marcaMat} vertexColors transparent opacity={0} depthWrite={false} toneMapped={false} />
      </lineSegments>
      {guiaPos.length > 0 && (
        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[guiaPos, 3]} />
            <bufferAttribute attach="attributes-color" args={[guiaCol, 3]} />
          </bufferGeometry>
          <lineBasicMaterial ref={guiaMat} vertexColors transparent opacity={0} depthWrite={false} toneMapped={false} />
        </lineSegments>
      )}
    </>
  );
}
