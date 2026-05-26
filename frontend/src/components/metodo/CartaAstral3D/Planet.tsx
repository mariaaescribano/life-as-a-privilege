import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Cuerpo } from "../astrologiaData";
void React;

interface PlanetProps {
  cuerpo: Cuerpo;
  position: [number, number, number];
  focused: boolean;
  onClick?: () => void;
}

const SERIF = "500 130px 'Times New Roman', Georgia, 'DejaVu Serif', serif";

function buildGlyphTexture(symbol: string, color: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  ctx.font = SERIF;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = symbol + "︎";
  const cx = size / 2;
  const cy = size / 2 + 6;

  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(text, cx, cy);

  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.9;
  ctx.fillText(text, cx, cy);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function Planet({ cuerpo, position, focused, onClick }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);

  const glyphTexture = useMemo(
    () => buildGlyphTexture(cuerpo.symbol, cuerpo.color),
    [cuerpo.symbol, cuerpo.color]
  );

  const targetScale = focused ? 1.4 : 1;
  const targetBright = focused ? 1.6 : 1;

  useFrame((_, delta) => {
    if (groupRef.current) {
      const cur = groupRef.current.scale.x;
      const next = cur + (targetScale - cur) * Math.min(1, delta * 6);
      groupRef.current.scale.setScalar(next);
    }
    if (spriteRef.current) {
      const m = spriteRef.current.material as THREE.SpriteMaterial;
      const factor = (m as unknown as { __factor?: number }).__factor ?? 1;
      const next = factor + (targetBright - factor) * Math.min(1, delta * 6);
      (m as unknown as { __factor?: number }).__factor = next;
      m.color.setScalar(next);
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      <sprite ref={spriteRef} scale={[0.55, 0.55, 1]}>
        <spriteMaterial
          map={glyphTexture}
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
