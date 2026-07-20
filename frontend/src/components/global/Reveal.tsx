// ─────────────────────────────────────────────────────────────────────────
// Reveal · animaciones de ENTRADA reutilizables (framer-motion).
//
// La idea: que los elementos no "aparezcan" de golpe, sino que se coloquen en
// escena con movimiento (fundido + deslizamiento + leve zoom). Sube la calidad
// percibida sin tocar la lógica de cada página.
//
//   <Reveal>…</Reveal>                     un elemento entra al verse en pantalla
//   <Reveal direction="down" delay={0.1}>  con dirección/retraso a medida
//   <RevealStagger><RevealItem/>…</…>       un grupo lanza a sus hijos en cascada
//
// - Se dispara con `whileInView`: si el elemento ya está en pantalla al cargar,
//   entra al montar; si está más abajo, entra al hacer scroll hasta él.
// - `once` (por defecto true): entra una sola vez, no se re-anima al volver.
// - Respeta `prefers-reduced-motion`: si el usuario lo pide, no anima nada.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// `motion(Box)`: Chakra tipa `transition` como string CSS y framer como objeto,
// lo que choca al pasarle transiciones/variants. Casteamos para evitar el
// conflicto de tipos (las props que le pasamos ya van tipadas como BoxProps).
const MotionBox = motion(Box) as any;

// Curva suave y "premium" (la misma que ya usaba la tarjeta de cursos).
const EASE = [0.22, 1, 0.36, 1] as const;

export type RevealDir = "up" | "down" | "left" | "right" | "none";

// Posición inicial según la dirección desde la que entra el elemento.
const offset = (dir: RevealDir, dist: number) => {
  switch (dir) {
    case "up": return { y: dist };     // sube hasta su sitio
    case "down": return { y: -dist };  // baja hasta su sitio
    case "left": return { x: dist };   // entra desde la derecha
    case "right": return { x: -dist }; // entra desde la izquierda
    default: return {};
  }
};

interface EntradaBase {
  direction?: RevealDir;
  distance?: number;
  duration?: number;
  scaleFrom?: number; // p.ej. 0.96 para un leve zoom-in
  blur?: boolean;     // desenfoque de entrada (efecto "enfocar")
}

const initialDe = (dir: RevealDir, dist: number, scaleFrom?: number, blur?: boolean) => ({
  opacity: 0,
  ...offset(dir, dist),
  ...(scaleFrom != null ? { scale: scaleFrom } : {}),
  ...(blur ? { filter: "blur(10px)" } : {}),
});

const finalDe = (blur?: boolean) => ({
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  ...(blur ? { filter: "blur(0px)" } : {}),
});

// ── Reveal: un elemento entra al asomar en pantalla ──────────────────────
export function Reveal({
  children,
  direction = "up",
  distance = 26,
  duration = 0.7,
  delay = 0,
  scaleFrom,
  blur = false,
  once = true,
  amount = 0.2,
  inView = false,
  ...rest
}: EntradaBase & {
  delay?: number;
  once?: boolean;
  amount?: number;
  /** false (por defecto): entra al MONTAR (siempre ocurre; robusto ante cambios
   *  de ruta). true: entra al asomar en pantalla (whileInView) — úsalo solo para
   *  contenido claramente por debajo del pliegue en páginas largas. */
  inView?: boolean;
  children?: React.ReactNode;
} & BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Box {...rest}>{children}</Box>;

  const trigger = inView
    ? { whileInView: finalDe(blur), viewport: { once, amount } }
    : { animate: finalDe(blur) };

  return (
    <MotionBox
      initial={initialDe(direction, distance, scaleFrom, blur)}
      {...trigger}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionBox>
  );
}

// ── Float: movimiento continuo y sutil (flotar en vertical) ───────────────
// Para dar Vida PERPETUA a elementos no interactivos (iconos, fotos): un leve
// vaivén arriba-abajo en bucle. No es una entrada; convive con <Reveal> si se
// anida (Reveal hace la entrada por fuera, Float el vaivén por dentro).
export function Float({
  children,
  amplitude = 6, // px de recorrido vertical
  duration = 5,
  delay = 0,
  ...rest
}: {
  amplitude?: number;
  duration?: number;
  delay?: number;
  children?: React.ReactNode;
} & BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Box {...rest}>{children}</Box>;
  return (
    <MotionBox
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      {...rest}
    >
      {children}
    </MotionBox>
  );
}

// ── Breathe: escala continua muy leve (respirar) ──────────────────────────
// Igual que Float pero con un latido de escala en vez de vaivén: ideal para
// fotos/tarjetas grandes que quedarían raras moviéndose de sitio.
export function Breathe({
  children,
  scale = 0.012, // amplitud: 1 → 1 + scale
  duration = 6,
  delay = 0,
  ...rest
}: {
  scale?: number;
  duration?: number;
  delay?: number;
  children?: React.ReactNode;
} & BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Box {...rest}>{children}</Box>;
  return (
    <MotionBox
      animate={{ scale: [1, 1 + scale, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      {...rest}
    >
      {children}
    </MotionBox>
  );
}

// ── RevealStagger: contenedor que lanza a sus <RevealItem> en cascada ─────
// Se puede usar como Flex/Grid pasándole display/flexDirection/gap, etc.
export function RevealStagger({
  children,
  stagger = 0.1,
  delayChildren = 0.05,
  once = true,
  amount = 0.15,
  inView = false,
  ...rest
}: {
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
  /** false (por defecto): la cascada arranca al MONTAR (robusto ante cambios de
   *  ruta). true: arranca al asomar en pantalla (whileInView). */
  inView?: boolean;
  children?: React.ReactNode;
} & BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Box {...rest}>{children}</Box>;

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
  const trigger = inView
    ? { whileInView: "show", viewport: { once, amount } }
    : { animate: "show" };

  return (
    <MotionBox initial="hidden" {...trigger} variants={variants} {...rest}>
      {children}
    </MotionBox>
  );
}

// ── RevealItem: hijo de RevealStagger; hereda el momento de la cascada ────
export function RevealItem({
  children,
  direction = "up",
  distance = 24,
  duration = 0.65,
  scaleFrom,
  blur = false,
  ...rest
}: EntradaBase & { children?: React.ReactNode } & BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Box {...rest}>{children}</Box>;

  const variants: Variants = {
    hidden: initialDe(direction, distance, scaleFrom, blur),
    show: { ...finalDe(blur), transition: { duration, ease: EASE } },
  };
  return (
    <MotionBox variants={variants} {...rest}>
      {children}
    </MotionBox>
  );
}
