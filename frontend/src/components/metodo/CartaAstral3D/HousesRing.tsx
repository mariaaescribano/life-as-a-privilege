import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gradoAVisualRad } from "./types";
void React;

// Entrada: el anillo de casas SOLO se funde (no rota). Contiene los ejes
// angulares (horizonte AC-DC y meridiano MC-IC), que son líneas fijas de la
// carta: si rotaran, esas «rayas» se verían mal colocadas hasta encajar.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const H_DUR = 1.3;
const H_DELAY = 0.2;

interface HousesRingProps {
  innerRadius: number;
  outerRadius: number;
  /** Las 12 cúspides reales (longitud eclíptica): las casas miden lo que miden. */
  cusps: number[];
}

/**
 * Las 12 cúspides van en su grado real (gradoAVisualRad): la 1 (Ascendente) a la izquierda y
 * la 7 a la derecha; la 4 y la 10 donde caigan, igual que en cualquier carta natal.
 */
function buildTexture(cusps: number[]): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.72;
  const midR = (outerR + innerR) / 2;

  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255,255,255,0.30)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  const ang = cusps.map((c) => gradoAVisualRad(c, cusps));

  for (let i = 0; i < 12; i++) {
    const a = ang[i];
    const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
    ctx.strokeStyle = isAngular ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = isAngular ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerR, cy - Math.sin(a) * innerR);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy - Math.sin(a) * outerR);
    ctx.stroke();
  }

  // Etiquetas de casa, en el centro angular de cada arco.
  ctx.font = "500 48px 'EB Garamond', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const a0 = ang[i];
    let a1 = ang[(i + 1) % 12];
    if (a1 <= a0) a1 += Math.PI * 2;
    const mid = (a0 + a1) / 2;
    const x = cx + Math.cos(mid) * midR;
    const y = cy - Math.sin(mid) * midR;
    ctx.shadowColor = "rgba(255,255,255,0.35)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(String(i + 1), x, y);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function HousesRing({ innerRadius, outerRadius, cusps }: HousesRingProps) {
  const texture = useMemo(() => buildTexture(cusps), [cusps]);

  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (elapsed.current > H_DELAY + H_DUR) return;
    elapsed.current += delta;
    const t = Math.max(0, elapsed.current - H_DELAY);
    const p = easeOutCubic(Math.min(1, t / H_DUR));
    if (matRef.current) matRef.current.opacity = p;
  });

  return (
    <mesh>
      <ringGeometry args={[innerRadius, outerRadius, 128, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
