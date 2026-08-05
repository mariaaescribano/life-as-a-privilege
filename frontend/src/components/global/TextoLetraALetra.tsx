// ─────────────────────────────────────────────────────────────────────────
// TEXTO LETRA A LETRA · el título se escribe solo al asomar en pantalla
//
// Hermano de `Reveal`: mientras aquél mueve un bloque entero, éste desgrana un
// texto carácter a carácter. Cada letra entra desenfocada y un poco más abajo,
// y se COLOCA en su sitio; la siguiente sale un pelín después, así que el
// título se lee como si se escribiera mientras bajas por la página.
//
//   <TextoLetraALetra fontSize="2xl" color={TINTA}>Mis heridas</TextoLetraALetra>
//
// Detalles que importan:
// - Un solo observador para todo el texto (no uno por letra): el retraso de
//   cada carácter se calcula por su posición, así la cascada es continua.
// - Las palabras van en un `inline-block` propio, con los espacios FUERA. Así
//   la frase sigue partiendo por donde debe y nunca se corta una palabra por
//   la mitad, que es lo que pasa si cada letra es su propia caja.
// - Para un lector de pantalla es un texto normal y corriente (`aria-label`);
//   las letras sueltas van ocultas.
// - Con `prefers-reduced-motion` no se anima nada: sale el texto y ya.
// ─────────────────────────────────────────────────────────────────────────
import React, { useMemo, useRef } from "react";
import { Text, type TextProps } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const MotionSpan = motion.span as any;
// Chakra tipa `Text` con tantas variantes que esparcirle las props sobrantes
// hace explotar al compilador («union type too complex»). Las props públicas de
// este componente sí van tipadas; lo único que se relaja es el reparto interno.
const TextoBase = Text as any;

// La misma curva suave que usa Reveal, para que todo el sitio se mueva igual.
const EASE = [0.22, 1, 0.36, 1] as const;

export interface TextoLetraALetraProps extends Omit<TextProps, "children"> {
  /** El texto. Tiene que ser una cadena: es lo que se desgrana. */
  children: string;
  /** Espera antes de la primera letra (s). Útil para entrar tras su caja. */
  delay?: number;
  /** Cuánto tarda cada letra en colocarse (s). */
  duration?: number;
  /** Hueco entre una letra y la siguiente (s). Más alto = se escribe más lento. */
  porLetra?: number;
  /** Cuánto tiene que asomar el texto para arrancar (0-1). */
  amount?: number;
  /** Si se repite al volver a pasar por él. Por defecto, una sola vez. */
  once?: boolean;
}

export function TextoLetraALetra({
  children,
  delay = 0,
  duration = 0.5,
  porLetra = 0.03,
  amount = 0.4,
  once = true,
  ...rest
}: TextoLetraALetraProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const dentro = useInView(ref, { once, amount });
  const texto = typeof children === "string" ? children : String(children ?? "");

  // El texto partido en palabras, sabiendo cada letra en qué posición global
  // está (su turno en la cascada).
  const palabras = useMemo(() => {
    let n = 0;
    return texto.split(" ").map((palabra) => ({
      letras: Array.from(palabra).map((ch) => ({ ch, i: n++ })),
      // El espacio también cuenta como turno: si no, la cascada se aceleraría
      // justo al cambiar de palabra.
      espacio: n++,
    }));
  }, [texto]);

  if (reduce) {
    return <TextoBase {...rest}>{texto}</TextoBase>;
  }

  return (
    <TextoBase ref={ref} {...rest} aria-label={texto}>
      {palabras.map((palabra, pi) => (
        <React.Fragment key={pi}>
          {/* La palabra entera es una caja: la línea puede partir entre
              palabras, nunca dentro de una. */}
          <span aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {palabra.letras.map(({ ch, i }) => (
              <MotionSpan
                key={i}
                style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                initial={{ opacity: 0, y: "0.42em", filter: "blur(6px)" }}
                animate={dentro
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: "0.42em", filter: "blur(6px)" }}
                transition={{ delay: delay + i * porLetra, duration, ease: EASE }}
              >
                {ch}
              </MotionSpan>
            ))}
          </span>
          {/* Espacio de verdad entre palabras (fuera de la caja), para que la
              frase pueda partir por aquí. */}
          {pi < palabras.length - 1 && " "}
        </React.Fragment>
      ))}
    </TextoBase>
  );
}
