import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Breathe } from "../global/Reveal";
import { PalabrasVivas } from "../global/PalabrasVivas";
import { SpaceBg } from "./SpaceBg";
import { Glifo } from "./Glifo";
import { CUERPOS } from "./astrologiaData";
import { astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

/**
 * EL TEXTO QUE ESCRIBE MARÍA para una persona (las Áreas, la bienvenida, la despedida), todo con la misma presentación:
 * UNA caja, el texto seguido (sin scroll propio) y, en cada «---», una línea horizontal con el icono de Astrología en el
 * medio donde el fondo se vuelve a pintar (así no se estira ni se deforma). Las palabras se desvelan una a una.
 */

/** Los símbolos de planeta/punto: un párrafo que EMPIEZA por uno es la definición de ese planeta. */
const GLIFOS: Record<string, string> = Object.fromEntries(CUERPOS.filter((c) => c.key !== "ascendente").map((c) => [c.symbol, c.color]));

/** Aclara un color hacia el blanco (los colores oscuros de algunos planetas no se leen sobre el cielo). */
function aclarar(hex: string, k = 0.4): string {
  const n = parseInt(hex.slice(1), 16);
  const m = (v: number) => Math.round(v + (255 - v) * k);
  return `rgb(${m((n >> 16) & 255)}, ${m((n >> 8) & 255)}, ${m(n & 255)})`;
}

/**
 * El texto → secciones. Una línea «---» separa SECCIONES: cada una va en su propia caja, con la foto de fondo puesta de
 * nuevo, para que el fondo no se estire con un texto largo. Dentro de cada una, los párrafos se leen seguidos.
 */
export function construirSecciones(texto: string): string[][] {
  return texto.replace(/\r/g, "").split(/^[ \t]*-{3,}[ \t]*$/m)
    .map((sec) => sec.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean))
    .filter((ps) => ps.length > 0);
}

/**
 * Un párrafo del texto. Sus palabras se desvelan una a una (PalabrasVivas), cada párrafo un poco después del anterior.
 * Si es la definición de un planeta, va en cursiva, con su símbolo (en su color) delante, que asoma primero.
 */
function Parrafo({ texto, ultimo, retraso }: { texto: string; ultimo: boolean; retraso: number }) {
  const letras = Array.from(texto.trimStart());
  const simbolo = letras[0];
  if (GLIFOS[simbolo]) {
    const resto = letras.slice(1).join("").trimStart();
    return (
      <Flex gap={3} align="flex-start" mb={ultimo ? 0 : 4} fontStyle="italic" opacity={0.92}>
        <Reveal inView direction="none" scaleFrom={0.5} blur duration={0.8} delay={retraso} flexShrink={0} mt="0.1em" display="flex">
          <Glifo symbol={simbolo} color={aclarar(GLIFOS[simbolo])} size={22} />
        </Reveal>
        <Text><PalabrasVivas texto={resto} cursivas retraso={retraso + 0.15} /></Text>
      </Flex>
    );
  }
  return <Text mb={ultimo ? 0 : 4}><PalabrasVivas texto={texto} cursivas retraso={retraso} /></Text>;
}

const MotionBox = motion(Box);
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * La separación entre dos secciones («---») DENTRO de la misma caja, como en las tarjetas de Cursos: una línea fina
 * horizontal justo donde empieza el fondo de la sección siguiente, con el icono de Astrología en el medio. Va pegada al
 * borde de arriba de la sección y centrada sobre él (mitad por encima, mitad por debajo).
 *
 * Con vida: al llegar a ella, las dos mitades de la línea se dibujan desde el icono hacia los lados y el icono entra
 * girando y enfocándose con un muelle; después una luz recorre la línea muy despacio y el icono respira con un halo suave.
 * Con «reducir movimiento» todo queda quieto.
 */
function Separador() {
  const reducir = useReducedMotion();
  const quieto = { "@media (prefers-reduced-motion: reduce)": { animation: "none" } };
  const linea = (origen: "left" | "right") => (
    <MotionBox
      flex="1" h="1px" position="relative" overflow="hidden" bg={`${astrologiaTxt}66`}
      style={{ transformOrigin: origen === "left" ? "right center" : "left center" }}
      {...(reducir ? {} : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true, amount: 0.9 },
        transition: { duration: 1.2, delay: 0.25, ease: EASE },
      })}
    >
      {/* la luz que la recorre, despacio, cuando ya se ha dibujado */}
      <Box position="absolute" top={0} bottom={0} left={0} w="38%"
           bgGradient={`linear(to-r, ${astrologiaTxt}00, ${astrologiaTxt}ee, ${astrologiaTxt}00)`}
           sx={{ animation: "lineaLuz 6.5s ease-in-out 2s infinite", "@keyframes lineaLuz": { "0%": { transform: "translateX(-120%)" }, "55%, 100%": { transform: "translateX(320%)" } }, ...quieto }} />
    </MotionBox>
  );
  return (
    <Box position="absolute" left={0} right={0} top={0} transform="translateY(-50%)" zIndex={2}>
      <Flex align="center" gap={{ base: 3, md: 4 }} color={astrologiaTxt}>
        {linea("left")}
        <MotionBox
          position="relative" display="flex" alignItems="center" justifyContent="center" flexShrink={0}
          {...(reducir ? {} : {
            initial: { scale: 0.3, rotate: -50, opacity: 0, filter: "blur(6px)" },
            whileInView: { scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" },
            viewport: { once: true, amount: 0.9 },
            transition: { type: "spring", stiffness: 120, damping: 14, delay: 0.1 },
          })}
        >
          {/* el halo: luz, no sombra; late despacio */}
          <Box position="absolute" w={{ base: "58px", md: "70px" }} h={{ base: "58px", md: "70px" }} borderRadius="full" pointerEvents="none"
               bg={`radial-gradient(circle, ${astrologiaTxt}40 0%, ${astrologiaTxt}00 68%)`}
               sx={{ animation: "icoHalo 5.5s ease-in-out 1.6s infinite", "@keyframes icoHalo": { "0%, 100%": { opacity: 0.25, transform: "scale(0.85)" }, "50%": { opacity: 0.9, transform: "scale(1.1)" } }, ...quieto }} />
          <Breathe scale={0.1} duration={5.5} delay={1.4} position="relative" display="flex">
            <AstrologiaIcon size={{ base: "26px", md: "30px" }} />
          </Breathe>
        </MotionBox>
        {linea("right")}
      </Flex>
    </Box>
  );
}

/** La caja con todo el texto: `secciones` sale de `construirSecciones`. */
export function TextoPorSecciones({ secciones, retraso = 0.35 }: { secciones: string[][]; retraso?: number }) {
  return (
    <Reveal direction="up" distance={34} scaleFrom={0.96} blur duration={0.95} delay={retraso} w="100%" display="flex">
      <Flex position="relative" direction="column" w="100%" borderRadius="2xl" overflow="hidden">
        {secciones.map((parrafos, si) => (
          <Box key={si} position="relative">
            {/* El mismo cielo vivo que el header de Astrología (estrellas que titilan cada una a su aire y fugaces), con su propio reparto en cada sección. */}
            <SpaceBg overlay="rgba(8,13,30,0.25)" escala={0.45} estrellas={44} fugaces={2} semilla={si + 1} />
            {si > 0 && <Separador />}
            <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }}
                 pt={{ base: si > 0 ? 10 : 6, md: si > 0 ? 12 : 8 }} pb={{ base: si < secciones.length - 1 ? 10 : 6, md: si < secciones.length - 1 ? 12 : 8 }}
                 color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" letterSpacing="0.005em">
              {parrafos.map((p, k, arr) => (
                <Parrafo key={k} texto={p} ultimo={k === arr.length - 1} retraso={(si === 0 ? retraso + 0.4 : 0.35) + Math.min(k * 0.3, 2.4)} />
              ))}
            </Box>
          </Box>
        ))}
      </Flex>
    </Reveal>
  );
}
