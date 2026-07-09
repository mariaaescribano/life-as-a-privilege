import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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
  /** Segundos a esperar antes de empezar a dibujar las líneas (para que salgan
   *  después de los planetas). */
  startDelay?: number;
}

// Cada línea se "dibuja" (crece de un planeta al otro) en este tiempo, con un
// pequeño desfase entre líneas para que aparezcan una tras otra.
const DRAW_DUR = 0.55;
const LINE_STAGGER = 0.05;
const OPACITY = 0.55;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function Aspects({ planetas, aspectos, cusps, radio, startDelay = 0 }: AspectsProps) {
  // Extremos de cada línea (A → B). Arrancan colapsadas en A (longitud 0) y el
  // useFrame va estirando el extremo B hasta B.
  const { positions, colors, segments } = useMemo(() => {
    const posMap = new Map<string, THREE.Vector3>();
    for (const p of planetas) {
      const theta = gradoAVisualRad(p.grado, cusps);
      posMap.set(p.planeta, new THREE.Vector3(Math.cos(theta) * radio, Math.sin(theta) * radio, 0));
    }
    const pos: number[] = [];
    const col: number[] = [];
    const seg: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (const a of aspectos) {
      const pa = posMap.get(a.a);
      const pb = posMap.get(a.b);
      if (!pa || !pb) continue;
      const c = new THREE.Color(COLOR_ASPECTO[a.tipo]);
      // Ambos vértices en A al inicio (línea de longitud 0 → invisible).
      pos.push(pa.x, pa.y, pa.z, pa.x, pa.y, pa.z);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      seg.push({ a: pa, b: pb });
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      segments: seg,
    };
  }, [planetas, aspectos, cusps, radio]);

  const posRef = useRef<THREE.BufferAttribute>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  useFrame((_, delta) => {
    if (doneRef.current) return; // una vez dibujadas, no seguimos tocando el buffer
    elapsedRef.current += delta;
    const attr = posRef.current;
    if (!attr) return;
    const arr = attr.array as Float32Array;

    let allDone = true;
    for (let i = 0; i < segments.length; i++) {
      const { a, b } = segments[i];
      const raw = (elapsedRef.current - startDelay - i * LINE_STAGGER) / DRAW_DUR;
      const p = easeOutCubic(Math.max(0, Math.min(1, raw)));
      if (raw < 1) allDone = false;
      const o = i * 6;
      arr[o] = a.x; arr[o + 1] = a.y; arr[o + 2] = a.z;
      arr[o + 3] = a.x + (b.x - a.x) * p;
      arr[o + 4] = a.y + (b.y - a.y) * p;
      arr[o + 5] = a.z + (b.z - a.z) * p;
    }
    attr.needsUpdate = true;

    if (matRef.current) {
      const target = elapsedRef.current > startDelay ? OPACITY : 0;
      matRef.current.opacity += (target - matRef.current.opacity) * Math.min(1, delta * 6);
    }
    if (allDone) doneRef.current = true;
  });

  if (positions.length === 0) return null;

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={posRef} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
