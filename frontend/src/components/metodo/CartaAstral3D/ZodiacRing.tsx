import React, { useMemo } from "react";
import * as THREE from "three";
import { ZODIAC_SIGNS } from "../astrologiaData";
void React;

interface ZodiacRingProps {
  innerRadius: number;
  outerRadius: number;
  ascendente: number;
}

const SERIF = "500 90px 'Times New Roman', Georgia, 'DejaVu Serif', serif";

function buildTexture(): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.82;
  const midR = innerR + (outerR - innerR) * 0.38;

  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + ((i - 3) * Math.PI) / 6;
    const x1 = cx + Math.cos(a) * innerR;
    const y1 = cy - Math.sin(a) * innerR;
    const x2 = cx + Math.cos(a) * outerR;
    const y2 = cy - Math.sin(a) * outerR;
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.font = SERIF;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < 12; i++) {
    const angle = -Math.PI / 2 + ((i - 3) * Math.PI) / 6 + Math.PI / 12;
    const x = cx + Math.cos(angle) * midR;
    const y = cy - Math.sin(angle) * midR;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-(angle) + Math.PI / 2);
    ctx.shadowColor = "rgba(255,255,255,0.45)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillText(ZODIAC_SIGNS[i].symbol + "︎", 0, 4);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function ZodiacRing({ innerRadius, outerRadius, ascendente }: ZodiacRingProps) {
  const texture = useMemo(() => buildTexture(), []);
  const rotationZ = useMemo(
    () => Math.PI - (ascendente * Math.PI) / 180,
    [ascendente]
  );

  return (
    <mesh rotation={[0, 0, rotationZ]}>
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
