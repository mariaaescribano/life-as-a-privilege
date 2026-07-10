import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
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
}

/**
 * Render Placidus: las 12 cúspides ocupan posiciones fijas en la carta, cada
 * una a 30° de ángulo (sumando 360°). La cúspide 1 está a la izquierda (math
 * angle π), la 4 abajo, la 7 a la derecha, la 10 arriba. Las cúspides
 * intermedias dividen cada cuadrante en 3 tercios iguales.
 */
function buildTexture(): THREE.CanvasTexture {
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

  // 12 cúspides a ángulos fijos (cada 30°). Convención math angle:
  //  cusp 1 → π (izquierda), cusp 4 → 3π/2 (abajo), cusp 7 → 0 (derecha), cusp 10 → π/2 (arriba)
  for (let i = 0; i < 12; i++) {
    const a = Math.PI + i * (Math.PI / 6);
    const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
    ctx.strokeStyle = isAngular ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = isAngular ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerR, cy - Math.sin(a) * innerR);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy - Math.sin(a) * outerR);
    ctx.stroke();
  }

  // Etiquetas de casa, en el centro de cada arco (chart angle de la cúspide + 15°).
  ctx.font = "500 48px 'EB Garamond', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const mid = Math.PI + i * (Math.PI / 6) + Math.PI / 12;
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

export function HousesRing({ innerRadius, outerRadius }: HousesRingProps) {
  const texture = useMemo(() => buildTexture(), []);

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
