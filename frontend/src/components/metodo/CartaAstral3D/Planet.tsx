import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Cuerpo } from "../astrologiaData";
import { FUENTE_GLIFOS } from "../glifosAstro";
void React;

interface PlanetProps {
  cuerpo: Cuerpo;
  position: [number, number, number];
  focused: boolean;
  onClick?: () => void;
  /** Retraso (en segundos) de la entrada del planeta, para que salgan uno a uno. */
  appearDelay?: number;
}

// Cada planeta BROTA en su propio sitio (escala 0→1 + fundido), sin moverse.
// Lento y solemne: los planetas se van encendiendo uno a uno alrededor de la
// rueda hasta formar el círculo completo.
const APPEAR_DUR = 0.95;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const SERIF = `500 170px ${FUENTE_GLIFOS}`;

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
  ctx.shadowBlur = 7;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
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

export function Planet({ cuerpo, position, focused, onClick, appearDelay = 0 }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  // Tiempo acumulado desde el montaje: controla la aparición escalonada.
  const elapsedRef = useRef(0);

  const glyphTexture = useMemo(
    () => buildGlyphTexture(cuerpo.symbol, cuerpo.color),
    [cuerpo.symbol, cuerpo.color]
  );

  const targetScale = focused ? 1.4 : 1;
  const targetBright = focused ? 1.6 : 1;

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    // Progreso de la ENTRADA (0 antes de su turno → 1 cuando ya ha aparecido).
    const t = Math.max(0, elapsedRef.current - appearDelay);
    const appear = easeOutCubic(Math.min(1, t / APPEAR_DUR));

    if (groupRef.current) {
      // Brota EN SU SITIO: solo escala (no se mueve; la posición es la final).
      const desired = targetScale * appear;
      const cur = groupRef.current.scale.x;
      const next = cur + (desired - cur) * Math.min(1, delta * 10);
      groupRef.current.scale.setScalar(next);
    }
    if (spriteRef.current) {
      const m = spriteRef.current.material as THREE.SpriteMaterial;
      m.opacity = appear; // se funde al entrar
      const factor = (m as unknown as { __factor?: number }).__factor ?? 1;
      const next = factor + (targetBright - factor) * Math.min(1, delta * 6);
      (m as unknown as { __factor?: number }).__factor = next;
      m.color.setScalar(next);
    }
  });

  // Al pasar el ratón por encima de un planeta pulsable, el cursor cambia a
  // "mano" (pointer) para invitar a hacer clic, en vez de quedarse en flecha.
  const onOver = onClick
    ? () => { document.body.style.cursor = "pointer"; }
    : undefined;
  const onOut = onClick
    ? () => { document.body.style.cursor = "auto"; }
    : undefined;

  // Al desmontar (p.ej. al cambiar de planeta enfocado) reseteamos el cursor
  // por si el planeta se quita mientras el ratón estaba encima.
  useEffect(() => () => { document.body.style.cursor = "auto"; }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[0, 0, 0]}
      onClick={onClick}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      <sprite ref={spriteRef} scale={[0.78, 0.78, 1]}>
        <spriteMaterial
          map={glyphTexture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
