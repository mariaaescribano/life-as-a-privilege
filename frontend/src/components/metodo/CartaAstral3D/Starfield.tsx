import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
void React;

interface StarfieldProps {
  count?: number;
  radius?: number;
  speed?: number;
}

export function Starfield({ count = 1200, radius = 30, speed = 0.008 }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = radius * (0.55 + Math.random() * 0.45);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint < 0.7) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      } else if (tint < 0.88) {
        colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.86; colors[i * 3 + 2] = 0.6;
      }

      sizes[i] = 0.04 + Math.random() * 0.08;
    }
    return { positions, colors, sizes };
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.35;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.92}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
