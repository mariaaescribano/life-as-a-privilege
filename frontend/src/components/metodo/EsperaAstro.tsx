import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Glifo } from "./Glifo";
import { AstrologiaLoader } from "./comicLoaders";
import { CUERPOS } from "./astrologiaData";
import { astrologiaNom, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

/**
 * PANTALLA DE ESPERA DE ASTROLOGÍA, para cuando hay que aguardar de verdad (el servidor despertando): el octagrama de
 * siempre en el centro, planetas que giran a su alrededor en tres órbitas, estrellas que titilan al fondo y, debajo,
 * el mensaje. Todo en turquesa oscuro sobre el beige; cada planeta, con su color, sobre un disco de cielo.
 * Con «reducir movimiento» no gira ni titila nada.
 */

const girar = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const titilar = keyframes`0%, 100% { opacity: 0.15; transform: scale(0.8); } 50% { opacity: 0.85; transform: scale(1.15); }`;

// Tres órbitas: radio (px, en el lienzo de 340), segundos por vuelta, sentido y los planetas que la recorren.
const ORBITAS: { r: number; seg: number; fase: number; inversa?: boolean; planetas: string[] }[] = [
  { r: 88, seg: 16, fase: 20, planetas: ["luna", "mercurio"] },
  { r: 124, seg: 28, fase: 95, inversa: true, planetas: ["venus", "marte"] },
  { r: 160, seg: 44, fase: 150, planetas: ["jupiter", "saturno"] },
];

// Estrellas: posiciones fijas (generadas una vez con una semilla) para que no salten al re-renderizar.
const ESTRELLAS = (() => {
  let s = 7;
  const azar = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  return Array.from({ length: 34 }, () => ({ x: azar() * 100, y: azar() * 100, d: 1.5 + azar() * 2.2, t: 2 + azar() * 3.5, r: azar() * 4 }));
})();

export function EsperaAstro({ mensaje }: { mensaje: string }) {
  const quieto = { "@media (prefers-reduced-motion: reduce)": { animation: "none !important" } };
  return (
    <Flex minH="100vh" direction="column" align="center" justify="center" bg={FONDO_PAGINA_BEIGE} position="relative" overflow="hidden"
          px={6} gap={{ base: 6, md: 8 }} fontFamily="'EB Garamond', serif">
      {/* las estrellas del fondo */}
      <Box position="absolute" inset={0} pointerEvents="none" aria-hidden>
        {ESTRELLAS.map((e, i) => (
          <Box key={i} position="absolute" left={`${e.x}%`} top={`${e.y}%`} w={`${e.d}px`} h={`${e.d}px`} borderRadius="full" bg={T}
               animation={`${titilar} ${e.t}s ease-in-out ${e.r}s infinite`} sx={quieto} />
        ))}
      </Box>

      {/* el octagrama y los planetas en órbita */}
      <Box position="relative" w="340px" h="340px" flexShrink={0} sx={{ "@media (max-width: 480px)": { transform: "scale(0.78)", margin: "-36px 0" } }} aria-hidden>
        {ORBITAS.map((o) => (
          <React.Fragment key={o.r}>
            <Box position="absolute" left="50%" top="50%" w={`${o.r * 2}px`} h={`${o.r * 2}px`} ml={`-${o.r}px`} mt={`-${o.r}px`}
                 borderRadius="full" border={`1px solid ${T}`} opacity={0.22} />
            <Box position="absolute" left="50%" top="50%" w={`${o.r * 2}px`} h={`${o.r * 2}px`} ml={`-${o.r}px`} mt={`-${o.r}px`}
                 animation={`${girar} ${o.seg}s linear infinite ${o.inversa ? "reverse" : ""}`} sx={quieto}>
              {o.planetas.map((k, j) => {
                const c = CUERPOS.find((x) => x.key === k)!;
                const grados = o.fase + j * 180; // los planetas de una órbita, enfrentados (y cada órbita empieza en un punto distinto)
                return (
                  <Box key={k} position="absolute" left="50%" top="50%" w="0" h="0" transform={`rotate(${grados}deg) translateY(-${o.r}px)`}>
                    {/* contragiro: el planeta se queda derecho mientras la órbita gira */}
                    <Box position="absolute" w="38px" h="38px" ml="-19px" mt="-19px" borderRadius="full" overflow="hidden"
                         display="flex" alignItems="center" justifyContent="center"
                         animation={`${girar} ${o.seg}s linear infinite ${o.inversa ? "" : "reverse"}`} sx={quieto}>
                      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="full" />
                      <Box position="relative" zIndex={1} display="flex" transform={`rotate(-${grados}deg)`}><Glifo symbol={c.symbol} color={c.color} size={24} /></Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </React.Fragment>
        ))}
        <Flex position="absolute" inset={0} align="center" justify="center"><AstrologiaLoader color={T} /></Flex>
      </Box>

      <Text color={T} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.6" textAlign="center" maxW="560px" position="relative">{mensaje}</Text>
    </Flex>
  );
}
