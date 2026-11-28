import React, { useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

// `motion(Box)`: mismo apaño de tipos que en Reveal.tsx.
const MotionBox = motion(Box) as any;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Título de sección con una raya horizontal fina a cada lado: ———  CIENCIA  ———.
 * Las rayas se difuminan hacia fuera (como las del mandala separador).
 *
 * Entrada en tres tiempos, al llegar a él:
 *   1. aparece el TÍTULO, desde una bruma y con las letras muy abiertas que se recogen hasta su sitio;
 *   2. de los extremos del título nacen las RAYAS y se extienden hacia los lados;
 *   3. un destello de luz recorre cada raya hasta su punta.
 */
export function TituloSeccion({ children, color = T, grande = false }: { children: React.ReactNode; color?: string; /** Letra más grande (los títulos de las bandas con foto). */ grande?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.6 });
  const on = reduce || visto;

  const raya = (lado: "izq" | "der") => (
    <Box flex="1" maxW="320px" h="1px" position="relative" overflow="hidden">
      {/* La raya, que crece desde el título hacia fuera. */}
      <MotionBox
        position="absolute"
        inset={0}
        bg={`linear-gradient(to ${lado === "izq" ? "right" : "left"}, ${color}00, ${color}99)`}
        style={{ transformOrigin: lado === "izq" ? "right center" : "left center" }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
      />
      {/* El destello: una luz fina que corre por la raya hacia su punta y se apaga. */}
      {!reduce && (
        <MotionBox
          position="absolute"
          top={0}
          bottom={0}
          w="38%"
          bg={`linear-gradient(to ${lado === "izq" ? "left" : "right"}, ${color}00, ${color}, ${color}00)`}
          initial={{ opacity: 0, [lado === "izq" ? "right" : "left"]: "0%" }}
          animate={on ? { opacity: [0, 1, 0], [lado === "izq" ? "right" : "left"]: ["0%", "70%"] } : { opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: "easeOut" }}
        />
      )}
    </Box>
  );

  return (
    <Flex ref={ref} align="center" justify="center" gap={{ base: 4, md: 8 }} w="100%">
      {raya("izq")}
      <MotionBox
        initial={reduce ? false : { opacity: 0, filter: "blur(8px)", y: 10 }}
        animate={on ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(8px)", y: 10 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <MotionBox
          as="p"
          color={color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={grande ? { base: "xl", md: "4xl" } : { base: "lg", md: "2xl" }}
          textTransform="uppercase"
          textAlign="center"
          // Las letras arrancan muy abiertas y se recogen hasta su espaciado final.
          initial={reduce ? false : { letterSpacing: "0.7em" }}
          animate={{ letterSpacing: on ? "0.28em" : "0.7em" }}
          transition={{ duration: 1.3, ease: EASE }}
          // El espaciado entre letras deja un hueco extra tras la última: se compensa para que quede centrado.
          pl="0.28em"
        >
          {children}
        </MotionBox>
      </MotionBox>
      {raya("der")}
    </Flex>
  );
}

export default TituloSeccion;
