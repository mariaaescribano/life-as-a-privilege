import React, { useRef } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

// `motion(Box)`: mismo apaño de tipos que en Reveal.tsx.
const MotionBox = motion(Box) as any;
const EASE = [0.22, 1, 0.36, 1] as const;

/** De dónde se «descorre» la foto al aparecer. */
export type FotoDesde = "izq" | "der" | "arriba" | "abajo" | "centro";

const recorte = (desde: FotoDesde, radio: string, cerrado: boolean) => {
  if (!cerrado) return `inset(0% 0% 0% 0% round ${radio})`;
  switch (desde) {
    case "izq": return `inset(0% 100% 0% 0% round ${radio})`;
    case "der": return `inset(0% 0% 0% 100% round ${radio})`;
    case "arriba": return `inset(0% 0% 100% 0% round ${radio})`;
    case "abajo": return `inset(100% 0% 0% 0% round ${radio})`;
    default: return `inset(50% 50% 50% 50% round ${radio})`;
  }
};

/**
 * Foto con vida, para envolver una imagen (el marco, el borde y el radio los pone quien la usa, por props de Box):
 *   · ENTRADA: la foto se descorre como una cortina desde un lado (`desde`) mientras se asienta con un zoom lento,
 *     y al terminar un destello de luz la cruza una vez.
 *   · VIDA: al pasar el ratón se inclina unos grados hacia él (con muelle) y la imagen se desplaza un poco
 *     en sentido contrario, como una ventana con profundidad.
 *   · Con «reducir movimiento» se ve entera y quieta.
 * El hijo debe llenar el hueco (w/h 100% o la imagen sola); se amplía un 4 % para que el desplazamiento no deje bordes.
 */
export function FotoViva({
  children,
  desde = "izq",
  delay = 0,
  radio = "12px",
  inclina = true,
  listo = true,
  ...rest
}: {
  children: React.ReactNode;
  desde?: FotoDesde;
  delay?: number;
  /** Radio de las esquinas (el mismo del borde, para que el recorte no lo muerda). */
  radio?: string;
  inclina?: boolean;
  /** false = espera (aunque ya se vea) hasta que pase a true. */
  listo?: boolean;
} & BoxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.15 });
  const on = reduce || (visto && listo);

  // Posición del puntero dentro de la foto, de -0.5 a 0.5, suavizada con muelle.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 16 });
  const sy = useSpring(my, { stiffness: 110, damping: 16 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const rotX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const imgX = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const imgY = useTransform(sy, [-0.5, 0.5], [7, -7]);

  const mover = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !inclina) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const soltar = () => { mx.set(0); my.set(0); };

  if (reduce) {
    return (
      <Box ref={ref} overflow="hidden" borderRadius={radio} {...rest}>
        {children}
      </Box>
    );
  }

  return (
    // La perspectiva va en el contenedor; lo que se inclina es la foto.
    <Box ref={ref} style={{ perspective: 900 }} onMouseMove={mover} onMouseLeave={soltar} {...rest} border="none" bg="transparent" borderRadius={0} overflow="visible" p={0}>
      <MotionBox
        position="relative"
        overflow="hidden"
        h="100%"
        borderRadius={radio}
        border={(rest as any).border}
        bg={(rest as any).bg}
        initial={{ clipPath: recorte(desde, radio, true), opacity: 0 }}
        animate={{ clipPath: recorte(desde, radio, !on), opacity: on ? 1 : 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      >
        <MotionBox
          position="relative"
          h="100%"
          initial={{ scale: 1.22 }}
          animate={{ scale: on ? 1.04 : 1.22 }}
          transition={{ duration: 1.9, delay, ease: EASE }}
        >
          <motion.div style={{ x: imgX, y: imgY, height: "100%", position: "relative" }}>{children}</motion.div>
        </MotionBox>
        {/* Destello: una luz fina cruza la foto una sola vez, justo cuando termina de descorrerse. */}
        <MotionBox
          position="absolute"
          inset={0}
          pointerEvents="none"
          style={{ background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.26) 50%, transparent 62%)" }}
          initial={{ x: "-120%" }}
          animate={{ x: on ? "120%" : "-120%" }}
          transition={{ duration: 1.5, delay: delay + 0.8, ease: "easeInOut" }}
        />
      </MotionBox>
    </Box>
  );
}

export default FotoViva;
