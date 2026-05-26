import React, { useMemo } from "react";
import * as THREE from "three";
void React;

interface HousesRingProps {
  innerRadius: number;
  outerRadius: number;
  cusps: number[];
  ascendente: number;
}

function buildTexture(cusps: number[], ascendente: number): THREE.CanvasTexture {
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

  const gradoAAngulo = (g: number) => {
    const delta = g - ascendente;
    return Math.PI + (delta * Math.PI) / 180;
  };

  for (let i = 0; i < 12; i++) {
    const a = gradoAAngulo(cusps[i]);
    const isAngular = i === 0 || i === 3 || i === 6 || i === 9;
    ctx.strokeStyle = isAngular ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = isAngular ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerR, cy - Math.sin(a) * innerR);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy - Math.sin(a) * outerR);
    ctx.stroke();
  }

  ctx.font = "500 48px 'EB Garamond', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12;
    const a1 = gradoAAngulo(cusps[i]);
    let a2 = gradoAAngulo(cusps[next]);
    if (a2 < a1) a2 += Math.PI * 2;
    const mid = (a1 + a2) / 2;
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

export function HousesRing({ innerRadius, outerRadius, cusps, ascendente }: HousesRingProps) {
  const texture = useMemo(() => buildTexture(cusps, ascendente), [cusps, ascendente]);

  return (
    <mesh>
      <ringGeometry args={[innerRadius, outerRadius, 128, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
