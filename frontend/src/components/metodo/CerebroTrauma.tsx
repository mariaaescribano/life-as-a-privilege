// ─────────────────────────────────────────────────────────────────────────────
// El dibujo del cerebro con sus cuatro zonas, cada una con su luz.
//
// Las cuatro laten IGUAL: aquí no se mide a nadie (ver la cabecera de
// psicologiaCerebro.ts). Va dibujado (SVG) y no en foto porque las zonas tienen
// que poder encenderse y responder al toque. El dibujo es de perfil, mirando a
// la izquierda.
//
// Si algún día hay una ilustración propia del cerebro, se pone en `FOTO_CEREBRO`
// y las zonas se pintan encima sin tocar nada más: sus posiciones van en % del
// alto y el ancho, no en píxeles.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FlechaBonita } from "../global/FlechaBonita";
import { useEnPantalla } from "../../hooks/useEnPantalla";
import { ZONAS, type ZonaKey } from "./psicologiaCerebro";

/** Ilustración propia del cerebro de perfil (mirando a la izquierda), si la hay.
 *  Mientras sea null se usa el dibujo en SVG de aquí abajo. */
const FOTO_CEREBRO: string | null = null;

const latido = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.55; }
  50%      { transform: scale(1.18); opacity: 0.9; }
`;

// ── La entrada, en tres actos (se dispara al asomar en pantalla) ──
// 1) el cerebro se DIBUJA: cada trazo recorre su camino y luego llega el relleno;
// 2) las zonas se encienden de una en una, con un pop que se pasa un pelín y
//    vuelve (y ahí empalman con su latido de siempre);
// 3) los botones suben de uno en uno.
// Todos los caminos llevan pathLength={1}: así el dasharray va de 0 a 1 sea cual
// sea la longitud real del trazo, y el retardo es lo único que cambia entre ellos.
const trazo = keyframes`to { stroke-dashoffset: 0; }`;
const relleno = keyframes`to { fill-opacity: 1; }`;
const aparece = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;
const popZona = keyframes`
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  60%  { opacity: 1; transform: translate(-50%, -50%) scale(1.22); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;
const subeBoton = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
// Cuándo entra cada acto (segundos desde que el dibujo asoma).
const ZONA_DESDE = 1.6;   // primera zona (el dibujo ya casi está)
const ZONA_CADA = 0.2;
const BOTON_DESDE = 2.5;  // primer botón (las últimas zonas aún están entrando)
const BOTON_CADA = 0.12;

/** Dónde cae cada zona dentro del dibujo (en % del ancho y del alto). */
const POSICION: Record<ZonaKey, { x: number; y: number }> = {
  razonador:  { x: 24, y: 37 },  // corteza prefrontal — delante y arriba
  alarma:     { x: 43, y: 58 },  // amígdala — dentro, en el lóbulo temporal
  biblioteca: { x: 55, y: 62 },  // hipocampo — justo detrás de la amígdala
  freno:      { x: 64, y: 84 },  // tronco encefálico — abajo, hacia la médula
};

export interface CerebroTraumaProps {
  /** La zona abierta ahora mismo, si hay alguna. */
  activa: ZonaKey | null;
  onZona: (key: ZonaKey) => void;
  /** Color de la tinta del recorrido (para el trazo del dibujo). */
  tinta: string;
}

export function CerebroTrauma({ activa, onZona, tinta }: CerebroTraumaProps) {
  // La entrada espera a que el dibujo asome de verdad (ver useEnPantalla): con
  // un `mounted` animaría metros más abajo y no lo vería nadie.
  const { ref, visto } = useEnPantalla();

  return (
    <Box ref={ref} position="relative" w="100%" maxW="560px" mx="auto">
      {/* ── El cerebro ── */}
      <Box position="relative" w="100%" sx={{ aspectRatio: "10 / 8" }}>
        {FOTO_CEREBRO ? (
          <Image
            src={FOTO_CEREBRO} alt="" w="100%" h="100%" objectFit="contain"
            opacity={visto ? 1 : 0}
            sx={{ animation: visto ? `${aparece} 0.9s ease 0.1s backwards` : "none" }}
          />
        ) : (
          <Box
            as="svg"
            viewBox="0 0 100 80"
            w="100%"
            h="100%"
            style={{ display: "block" }}
            // Cada trazo empieza sin recorrer (dashoffset 1) y sin relleno, y su
            // animación lo dibuja cuando le toca. `forwards` los deja puestos.
            sx={{
              "& path": { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 },
              "& path:nth-of-type(1)": { animation: visto ? `${trazo} 0.9s ease-out 0.1s forwards, ${relleno} 0.7s ease 0.6s forwards` : "none" },
              "& path:nth-of-type(2)": { animation: visto ? `${trazo} 0.5s ease-out 0.7s forwards` : "none" },
              "& path:nth-of-type(3)": { animation: visto ? `${trazo} 0.45s ease-out 0.85s forwards` : "none" },
              "& path:nth-of-type(4)": { animation: visto ? `${trazo} 0.45s ease-out 0.95s forwards` : "none" },
              "& path:nth-of-type(5)": { animation: visto ? `${trazo} 0.6s ease-out 1s forwards, ${relleno} 0.6s ease 1.3s forwards` : "none" },
              "& path:nth-of-type(6)": { animation: visto ? `${trazo} 0.5s ease-out 1.2s forwards` : "none" },
            }}
          >
            {/* el cerebro, de perfil */}
            <path
              d="M14 44 C10 30, 22 13, 41 11 C60 9, 80 17, 86 33 C90 43, 86 51, 78 52
                 L70 52 C66 56, 60 58, 52 58 C44 60, 33 60, 25 56 C18 53, 14 50, 14 44 Z"
              pathLength={1}
              fill={`${tinta}1f`}
              stroke={tinta}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* el surco que separa el lóbulo temporal (el «pulgar» de abajo) */}
            <path
              d="M22 45 C30 50, 40 53, 53 53"
              pathLength={1}
              fill="none"
              stroke={tinta}
              strokeWidth="0.8"
              opacity="0.65"
              strokeLinecap="round"
            />
            {/* dos surcos más, para que se lea como un cerebro y no como una nube */}
            <path d="M33 14 C36 22, 34 30, 28 36" pathLength={1} fill="none" stroke={tinta} strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
            <path d="M57 12 C58 22, 62 30, 70 34" pathLength={1} fill="none" stroke={tinta} strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
            {/* el cerebelo */}
            <path
              d="M66 54 C76 52, 87 55, 86 62 C85 69, 74 71, 67 66 C63 63, 62 56, 66 54 Z"
              pathLength={1}
              fill={`${tinta}1a`}
              stroke={tinta}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* el tronco, que baja hacia la médula: por ahí pasa todo lo del cuerpo */}
            <path
              d="M57 55 C60 62, 60 70, 58 78"
              pathLength={1}
              fill="none"
              stroke={tinta}
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.85"
            />
          </Box>
        )}

        {/* ── Las cuatro zonas, encendidas ── */}
        {ZONAS.map((zona, i) => {
          const pos = POSICION[zona.key];
          const abierta = activa === zona.key;
          // Todas del mismo tamaño; la abierta es la única que destaca.
          const tamano = 19;

          return (
            <Box
              key={zona.key}
              as="button"
              onClick={() => onZona(zona.key)}
              aria-label={`${zona.apodo || zona.nombre} — ${zona.nombre}`}
              position="absolute"
              left={`${pos.x}%`}
              top={`${pos.y}%`}
              transform="translate(-50%, -50%)"
              w={`${tamano}%`}
              // Cada zona se enciende cuando le toca, con su pop. `backwards` la
              // esconde mientras espera su turno y al acabar la suelta, para que
              // el translate/scale vuelva a ser del elemento (hover, latido…).
              opacity={visto ? 1 : 0}
              sx={{
                aspectRatio: "1 / 1",
                animation: visto
                  ? `${popZona} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${ZONA_DESDE + i * ZONA_CADA}s backwards`
                  : "none",
              }}
              borderRadius="full"
              cursor="pointer"
              zIndex={abierta ? 3 : 2}
            >
              {/* el halo que late; la zona abierta late un punto más fuerte */}
              <Box
                position="absolute"
                inset="0"
                borderRadius="full"
                bg={zona.color}
                opacity={abierta ? 0.55 : 0.34}
                sx={{ animation: `${latido} 2.9s ease-in-out infinite` }}
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

      {/* ── Los cuatro botones de las zonas: iguales, repartidos en una línea
             (en móvil, de dos en dos). Rectangulares, con el nombre de su zona,
             el marco del color de la zona y la flecha de la casa. ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 2.5, md: 3 }} mt={{ base: 12, md: 16 }} w="100%">
        {ZONAS.map((zona, i) => (
          <Flex
            key={zona.key}
            as="button"
            onClick={() => onZona(zona.key)}
            align="center"
            justify="center"
            gap={2}
            px={3}
            py={{ base: 2, md: 2.5 }}
            w="100%"
            borderRadius="md"
            bg={activa === zona.key ? "rgba(255,251,243,0.85)" : "rgba(255,251,243,0.55)"}
            border={`2px solid ${zona.color}`}
            color={tinta}
            cursor="pointer"
            transition="all 0.2s"
            // Suben de uno en uno cuando las zonas ya casi están. `backwards`
            // (y no forwards): al acabar, el transform vuelve a ser del botón
            // y el hover puede levantarlo.
            opacity={visto ? 1 : 0}
            sx={{
              animation: visto
                ? `${subeBoton} 0.5s ease ${BOTON_DESDE + i * BOTON_CADA}s backwards`
                : "none",
            }}
            _hover={{ bg: "rgba(255,251,243,0.9)", transform: "translateY(-1px)" }}
          >
            {/* El apodo si lo tiene; si no, el nombre (la alarma va sin apodo
                y su nombre largo necesita poder partirse en dos líneas). */}
            <Text color={tinta} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
                  textAlign="center" lineHeight="1.25">
              {zona.apodo || zona.nombre}
            </Text>
            <FlechaBonita size={{ base: "16px", md: "18px" }} />
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default CerebroTrauma;
