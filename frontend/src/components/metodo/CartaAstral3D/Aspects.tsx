import React, { useMemo } from "react";
import * as THREE from "three";
import {
  COLOR_ASPECTO,
  gradoAVisualRad,
  type Aspecto,
  type PosicionPlaneta,
} from "./types";
void React;

interface AspectsProps {
  planetas: PosicionPlaneta[];
  aspectos: Aspecto[];
  cusps: number[];
  radio: number;
}

export function Aspects({ planetas, aspectos, cusps, radio }: AspectsProps) {
  const { positions, colors } = useMemo(() => {
    const posMap = new Map<string, THREE.Vector3>();
    for (const p of planetas) {
      const theta = gradoAVisualRad(p.grado, cusps);
      posMap.set(p.planeta, new THREE.Vector3(Math.cos(theta) * radio, Math.sin(theta) * radio, 0));
    }
    const pos: number[] = [];
    const col: number[] = [];
    for (const a of aspectos) {
      const pa = posMap.get(a.a);
      const pb = posMap.get(a.b);
      if (!pa || !pb) continue;
      const c = new THREE.Color(COLOR_ASPECTO[a.tipo]);
      pos.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, [planetas, aspectos, cusps, radio]);

  if (positions.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
