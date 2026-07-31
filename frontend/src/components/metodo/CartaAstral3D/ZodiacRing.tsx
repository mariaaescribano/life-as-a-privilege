import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIGNOS_ORDEN, SIGNO_TRAZOS } from "../signosIconos";
import { gradoAVisualRad } from "./types";
void React;

// Entrada «materialización»: el anillo aparece SIEMPRE en su ángulo final (nunca
// gira), así que sus líneas de signos jamás se desajustan de las casas ni de los
// planetas. La sensación de movimiento la da un fundido + un ligero scale-in
// concéntrico con un pequeño rebote (easeOutBack): la rueda "cristaliza" en su
// sitio. Antes se hacía con un giro de 270° tenue, pero el desajuste se percibía.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
// easeOutBack: llega a 1 con un leve sobreimpulso → da Vida al scale sin rotar.
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const APPEAR_DUR = 1.2;            // duración de la materialización
const SCALE_FROM = 0.82;           // escala inicial (crece hasta 1, concéntrico)
const FADE_FRAC = 0.6;             // el fundido completa en el primer 60% del tiempo

interface ZodiacRingProps {
  innerRadius: number;
  outerRadius: number;
  cusps: number[];
}

// El anillo pinta los signos DIBUJADOS, con los mismos trazos que el resto de
// la app (signosIconos.ts). Con el carácter (♈♉♊…) no había forma: en canvas no
// llega el CSS y el sistema lo resolvía con su fuente de emoji — morado, con
// recuadro y sin respetar el color que le pide el código.
const ICONO_LADO = 100;   // lado del icono dentro del lienzo de 2048
const ICONO_TRAZO = 4.8;  // grosor del trazo a ese tamaño

/**
 * Anillo del zodíaco usando el mismo mapeo no-lineal que los planetas:
 * para cada límite de signo (0°, 30°, 60°, …) calculamos su chart angle vía
 * gradoAVisualRad(g, cusps). El glifo del signo se coloca en el punto medio
 * (en chart angle) entre su inicio y su fin. Esto hace que los signos no
 * tengan todos el mismo ancho visual en la rueda — como debe ser en Placidus.
 */
function buildTexture(cusps: number[], innerRatio: number): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  // innerR del canvas alineado con el inner real del anillo 3D.
  const innerR = outerR * innerRatio;
  const midR = (innerR + outerR) / 2;
  // El icono ya está centrado en su lienzo; solo se separa un pelín hacia el
  // interior del anillo para que no roce el borde exterior.
  const GLYPH_INNER_OFFSET = Math.round((outerR - innerR) * 0.06);

  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  // Chart angle (math angle 3D) de cada inicio de signo (0°, 30°, … 330°).
  const signStartAngles: number[] = [];
  for (let i = 0; i < 12; i++) {
    signStartAngles.push(gradoAVisualRad(i * 30, cusps));
  }

  // Líneas divisoras entre signos.
  for (let i = 0; i < 12; i++) {
    const a = signStartAngles[i];
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

  // Iconos: el centro angular del signo (a chart angle), no del zodíaco.
  // Punto medio gestionando wrap-around: avanzamos CCW (math angle creciente).
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < 12; i++) {
    const aStart = signStartAngles[i];
    let aEnd = signStartAngles[(i + 1) % 12];
    if (aEnd <= aStart) aEnd += Math.PI * 2;
    const angle = (aStart + aEnd) / 2;

    const x = cx + Math.cos(angle) * midR;
    const y = cy - Math.sin(angle) * midR;

    ctx.save();
    ctx.translate(x, y);
    // Orientar el icono tangente al anillo (igual que antes: que "mire" hacia fuera).
    ctx.rotate(-(angle) + Math.PI / 2);
    // +y en el frame rotado = hacia el centro del anillo: el offset separa el
    // icono del borde exterior.
    ctx.translate(0, GLYPH_INNER_OFFSET);
    ctx.shadowColor = "rgba(255,255,255,0.14)";
    ctx.shadowBlur = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    // El icono viene en un lienzo de 24×24: se escala y se centra en el punto.
    const escala = ICONO_LADO / 24;
    ctx.scale(escala, escala);
    ctx.lineWidth = ICONO_TRAZO / escala;
    ctx.translate(-12, -12);
    for (const d of SIGNO_TRAZOS[SIGNOS_ORDEN[i]] ?? []) {
      ctx.stroke(new Path2D(d));
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function ZodiacRing({ innerRadius, outerRadius, cusps }: ZodiacRingProps) {
  const texture = useMemo(
    () => buildTexture(cusps, innerRadius / outerRadius),
    [cusps, innerRadius, outerRadius],
  );

  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (elapsed.current > APPEAR_DUR) return; // ya asentado: no seguir calculando
    elapsed.current += delta;
    const p = Math.min(1, elapsed.current / APPEAR_DUR);
    // Scale-in concéntrico con leve rebote. SIN rotación → siempre alineado.
    if (meshRef.current) {
      const s = SCALE_FROM + (1 - SCALE_FROM) * easeOutBack(p);
      meshRef.current.scale.setScalar(s);
    }
    // Fundido de entrada (completa en el primer 60% para que se lea nítido pronto).
    if (matRef.current) {
      matRef.current.opacity = easeOutCubic(Math.min(1, p / FADE_FRAC));
    }
  });

  return (
    <mesh ref={meshRef} scale={SCALE_FROM}>
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
