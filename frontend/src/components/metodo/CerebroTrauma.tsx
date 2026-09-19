// ─────────────────────────────────────────────────────────────────────────────
// El dibujo del cerebro con las cuatro zonas, encendidas según SUS respuestas.
//
// Va dibujado (SVG) y no en foto porque tiene que ENCENDERSE: cada zona brilla
// más o menos según lo que la persona contestó en los dos tests, y eso una
// imagen fija no lo puede hacer. El dibujo es de perfil, mirando a la izquierda.
//
// Si algún día hay una ilustración propia del cerebro, se pone en `FOTO_CEREBRO`
// y las zonas se pintan encima sin tocar nada más: sus posiciones van en % del
// alto y el ancho, no en píxeles.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ZONAS, type ZonaKey } from "./psicologiaCerebro";

/** Ilustración propia del cerebro de perfil (mirando a la izquierda), si la hay.
 *  Mientras sea null se usa el dibujo en SVG de aquí abajo. */
const FOTO_CEREBRO: string | null = null;

const latido = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.55; }
  50%      { transform: scale(1.18); opacity: 0.9; }
`;

/** Dónde cae cada zona dentro del dibujo (en % del ancho y del alto). */
const POSICION: Record<ZonaKey, { x: number; y: number }> = {
  freno:   { x: 24, y: 37 },  // corteza prefrontal — delante y arriba
  alarma:  { x: 43, y: 58 },  // amígdala — dentro, en el lóbulo temporal
  archivo: { x: 55, y: 62 },  // hipocampo — justo detrás de la amígdala
  cuerpo:  { x: 64, y: 84 },  // tronco encefálico — abajo, hacia la médula
};

export interface CerebroTraumaProps {
  /** Cuánto se enciende cada zona (0-100). */
  valores: Record<ZonaKey, number>;
  /** La zona abierta ahora mismo, si hay alguna. */
  activa: ZonaKey | null;
  onZona: (key: ZonaKey) => void;
  /** Color de la tinta del recorrido (para el trazo del dibujo). */
  tinta: string;
}

export function CerebroTrauma({ valores, activa, onZona, tinta }: CerebroTraumaProps) {
  return (
    <Box position="relative" w="100%" maxW="560px" mx="auto">
      {/* ── El cerebro ── */}
      <Box position="relative" w="100%" sx={{ aspectRatio: "10 / 8" }}>
        {FOTO_CEREBRO ? (
          <Image src={FOTO_CEREBRO} alt="" w="100%" h="100%" objectFit="contain" />
        ) : (
          <Box
            as="svg"
            viewBox="0 0 100 80"
            w="100%"
            h="100%"
            style={{ display: "block" }}
          >
            {/* el cerebro, de perfil */}
            <path
              d="M14 44 C10 30, 22 13, 41 11 C60 9, 80 17, 86 33 C90 43, 86 51, 78 52
                 L70 52 C66 56, 60 58, 52 58 C44 60, 33 60, 25 56 C18 53, 14 50, 14 44 Z"
              fill={`${tinta}1f`}
              stroke={tinta}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* el surco que separa el lóbulo temporal (el «pulgar» de abajo) */}
            <path
              d="M22 45 C30 50, 40 53, 53 53"
              fill="none"
              stroke={tinta}
              strokeWidth="0.8"
              opacity="0.65"
              strokeLinecap="round"
            />
            {/* dos surcos más, para que se lea como un cerebro y no como una nube */}
            <path d="M33 14 C36 22, 34 30, 28 36" fill="none" stroke={tinta} strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
            <path d="M57 12 C58 22, 62 30, 70 34" fill="none" stroke={tinta} strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
            {/* el cerebelo */}
            <path
              d="M66 54 C76 52, 87 55, 86 62 C85 69, 74 71, 67 66 C63 63, 62 56, 66 54 Z"
              fill={`${tinta}1a`}
              stroke={tinta}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* el tronco, que baja hacia la médula: por ahí pasa todo lo del cuerpo */}
            <path
              d="M57 55 C60 62, 60 70, 58 78"
              fill="none"
              stroke={tinta}
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.85"
            />
          </Box>
        )}

        {/* ── Las cuatro zonas, encendidas ── */}
        {ZONAS.map((zona) => {
          const valor = valores[zona.key] ?? 0;
          const pos = POSICION[zona.key];
          const abierta = activa === zona.key;
          // Cuanto más dice su test, más grande y más viva la luz.
          const tamano = 13 + (valor / 100) * 13;

          return (
            <Box
              key={zona.key}
              as="button"
              onClick={() => onZona(zona.key)}
              aria-label={`${zona.nombre} — ${zona.apodo}`}
              position="absolute"
              left={`${pos.x}%`}
              top={`${pos.y}%`}
              transform="translate(-50%, -50%)"
              w={`${tamano}%`}
              sx={{ aspectRatio: "1 / 1" }}
              borderRadius="full"
              cursor="pointer"
              zIndex={abierta ? 3 : 2}
            >
              {/* el halo que late: más fuerte cuanto más alta es su lectura */}
              <Box
                position="absolute"
                inset="0"
                borderRadius="full"
                bg={zona.color}
                opacity={0.18 + (valor / 100) * 0.5}
                sx={{ animation: `${latido} ${3.6 - (valor / 100) * 1.4}s ease-in-out infinite` }}
              />
              {/* el punto */}
              <Box
                position="absolute"
                inset="28%"
                borderRadius="full"
                bg={zona.color}
                border={`2px solid ${abierta ? "#fbf4e8" : `${zona.color}`}`}
                transition="all 0.25s"
                style={{ boxShadow: `0 0 ${abierta ? 18 : 10}px ${zona.color}` }}
              />
            </Box>
          );
        })}
      </Box>

      {/* ── La leyenda: el nombre de cada zona con su color ── */}
      <Flex wrap="wrap" justify="center" gap={{ base: 2, md: 3 }} mt={3}>
        {ZONAS.map((zona) => (
          <Flex
            key={zona.key}
            as="button"
            onClick={() => onZona(zona.key)}
            align="center"
            gap={2}
            px={3}
            py="4px"
            borderRadius="full"
            bg={activa === zona.key ? "rgba(255,251,243,0.8)" : "rgba(255,251,243,0.5)"}
            border={`1.5px solid ${activa === zona.key ? zona.color : `${zona.color}88`}`}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,251,243,0.85)", borderColor: zona.color }}
          >
            <Box w="9px" h="9px" borderRadius="full" bg={zona.color} flexShrink={0} />
            <Text color={tinta} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" whiteSpace="nowrap">
              {zona.apodo}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

export default CerebroTrauma;
