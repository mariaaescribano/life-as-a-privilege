// ─────────────────────────────────────────────────────────────────────────
// SendaNutrientes — la rejilla de grupos de nutrientes convertida en CAMINO.
//
// En vez de una cuadrícula donde todo está abierto a la vez, los grupos se
// andan en fila: cada uno tiene su nodo en una senda que serpentea (de
// izquierda a derecha, luego de derecha a izquierda), y solo se abre el
// siguiente cuando el anterior está leído.
//
//   ①━━━━━②━━━━━③
//   foto  foto  foto
//               ┃
//   ⑥━━━━━⑤━━━━━④
//   foto  foto  foto
//   ┃
//   ⑦
//   foto
//
// LOS TRES ESTADOS del nodo (y de su tarjeta):
//   · bloqueado → círculo gris translúcido con candado; la tarjeta se ve
//     apagada, en blanco y negro, y no se puede pulsar.
//   · aquí estás → círculo perfilado en verde claro con el número, latiendo.
//   · leído      → círculo verde relleno con el tick: es MarcaLeido, la misma
//     marca de lectura de todo el recorrido (no se inventa otra).
// El «verde» es el propio color de Nutrición (nutricionBg), no un verde suelto.
//
// La línea de la senda se enciende por tramos: el tramo entre dos grupos se
// ilumina cuando el primero de los dos está leído.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useT } from "../../i18n";
import { RevealItem, RevealStagger } from "../global/Reveal";
import { TarjetaNutri } from "./TarjetaNutri";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";
import { nutrienteAlcanzable, type Nutriente } from "../../hardCoded/espacio/NutrientesNutricion";

// Tick (el mismo dibujo que MarcaLeido) y candado.
const TICK = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";
const CANDADO =
  "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z";

// Latido del nodo en el que toca seguir: el halo respira, nada se mueve de sitio.
const latido = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${nutricionBg}66, 0 0 14px ${nutricionBg}55; }
  50%      { box-shadow: 0 0 0 9px ${nutricionBg}00, 0 0 22px ${nutricionBg}88; }
`;

const VIA_APAGADA = "rgba(255,255,255,0.22)";
const VIA_ANDADA = `${nutricionBg}d9`;

/** Tramo de la senda a un lado del nodo (mitad izquierda o derecha). */
function Tramo({ lado, encendido, visible }: { lado: "left" | "right"; encendido: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <Box
      position="absolute"
      top="50%"
      h="3px"
      mt="-1.5px"
      borderRadius="full"
      left={lado === "left" ? 0 : "50%"}
      right={lado === "left" ? "50%" : 0}
      bg={encendido ? VIA_ANDADA : VIA_APAGADA}
      transition="background 0.4s ease"
    />
  );
}

/** El nodo redondo de un paso de la senda, en sus tres estados. */
function Nodo({ n, hecho, actual }: { n: number; hecho: boolean; actual: boolean }) {
  const t = useT();
  const size = { base: "30px", md: "34px" };
  if (hecho) {
    return (
      <Flex align="center" justify="center" w={size} h={size} borderRadius="full" flexShrink={0}
            bg={nutricionBg} border={`1px solid ${nutricionTxt}`}
            boxShadow={`0 0 12px ${nutricionBg}99, 0 1px 4px rgba(0,0,0,0.45)`}
            title={t("comun.leido")}>
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
             w={{ base: "15px", md: "17px" }} h={{ base: "15px", md: "17px" }} fill={nutricionTxt}>
          <path d={TICK} />
        </Box>
      </Flex>
    );
  }
  if (actual) {
    return (
      <Flex align="center" justify="center" w={size} h={size} borderRadius="full" flexShrink={0}
            bg="rgba(0,0,0,0.18)" border={`2px solid ${nutricionBg}`} color={nutricionBg}
            fontWeight="800" fontSize={{ base: "sm", md: "md" }} lineHeight="1"
            sx={{ animation: `${latido} 2.4s ease-in-out infinite` }}>
        {n}
      </Flex>
    );
  }
  return (
    <Flex align="center" justify="center" w={size} h={size} borderRadius="full" flexShrink={0}
          bg="rgba(255,255,255,0.12)" border="1px solid rgba(255,255,255,0.32)">
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "13px", md: "15px" }} h={{ base: "13px", md: "15px" }} fill="rgba(255,255,255,0.6)">
        <path d={CANDADO} />
      </Box>
    </Flex>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export function SendaNutrientes({
  pasos,
  hechos,
  onAbrir,
}: {
  /** Los grupos de esta página, en el orden en que se andan. */
  pasos: Nutriente[];
  /** Las `key` de los grupos que ya se han leído. */
  hechos: Set<string>;
  onAbrir: (n: Nutriente) => void;
}) {
  const t = useT();
  // Cuántos grupos caben en una fila. Es lo que decide el serpenteo, así que
  // hace falta el valor de verdad (no una lista responsive de CSS).
  const porFila = useBreakpointValue({ base: 2, md: 3 }) ?? 2;

  // Estado de cada paso. Un grupo se abre si ya está leído (lo andado no se
  // vuelve a cerrar, aunque el orden de antes fuera otro) o si TODOS los
  // anteriores lo están. El primero sin leer con todo lo anterior hecho es el
  // «aquí estás».
  const estados = pasos.map((p) => {
    const hecho = hechos.has(p.key);
    // El MISMO cálculo que usa el guarda de la página de detalle, para que el
    // candado del camino y el rebote por URL no puedan decir cosas distintas.
    const abierto = nutrienteAlcanzable(p.key, hechos);
    return { hecho, abierto, actual: !hecho && abierto };
  });

  // Las filas, ya partidas. Las impares se recorren al revés (serpenteo).
  const filas: number[][] = [];
  for (let i = 0; i < pasos.length; i += porFila) {
    filas.push(pasos.map((_, k) => k).slice(i, i + porFila));
  }

  const hechosN = estados.filter((e) => e.hecho).length;
  const gap = { base: 4, md: 6 };

  return (
    <Flex direction="column" w="100%" gap={0}>
      {/* Cuánto llevas andado del camino: una línea fina y su cuenta. */}
      <Flex direction="column" w="100%" gap={2} mb={{ base: 5, md: 6 }} align="center">
        <Box w="100%" maxW="420px" h="4px" borderRadius="full" bg="rgba(255,255,255,0.2)" overflow="hidden">
          <Box h="100%" borderRadius="full" bg={VIA_ANDADA} transition="width 0.5s ease"
               w={`${Math.round((hechosN / Math.max(1, pasos.length)) * 100)}%`} />
        </Box>
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.06em">
          {t("metodo.nutri.senda.progreso", { hechos: hechosN, total: pasos.length })}
        </Text>
      </Flex>

      {filas.map((fila, r) => {
        const invertida = r % 2 === 1;
        const direccion = invertida ? "row-reverse" : "row";
        return (
          <React.Fragment key={r}>
            {/* La fila: nodo + tarjeta, en el orden del camino. */}
            <RevealStagger inView stagger={0.07} amount={0.12} w="100%"
                           display="flex" flexDirection={direccion} gap={gap} alignItems="stretch">
              {fila.map((idx, c) => {
                const p = pasos[idx];
                const e = estados[idx];
                return (
                  <RevealItem key={p.key} direction="up" distance={22} scaleFrom={0.96} duration={0.55}
                              flex="1" minW={0} display="flex" flexDirection="column">
                    {/* La vía y su nodo. Los tramos se dibujan a los lados del
                        nodo; con la fila invertida, el «anterior» cae a la
                        derecha, así que los lados se cambian. */}
                    <Box position="relative" w="100%" h={{ base: "34px", md: "38px" }}>
                      {/* El primero de cada fila recibe la senda por ARRIBA (el
                          giro que baja de la fila anterior): media vía vertical
                          hasta el nodo, para que el tramo no quede en el aire. */}
                      {c === 0 && r > 0 && (
                        <Box position="absolute" left="50%" ml="-1.5px" top={0} h="50%" w="3px"
                             borderRadius="full" transition="background 0.4s ease"
                             bg={estados[idx - 1].hecho ? VIA_ANDADA : VIA_APAGADA} />
                      )}
                      <Tramo lado={invertida ? "right" : "left"} visible={c > 0}
                             encendido={c > 0 && estados[fila[c - 1]].hecho} />
                      <Tramo lado={invertida ? "left" : "right"} visible={c < fila.length - 1}
                             encendido={e.hecho} />
                      <Flex position="absolute" inset={0} align="center" justify="center">
                        <Nodo n={idx + 1} hecho={e.hecho} actual={e.actual} />
                      </Flex>
                    </Box>

                    {/* La tarjeta. Bloqueada: apagada, en gris y sin pulsar. */}
                    <Box position="relative" w="100%" flex="1" display="flex"
                         title={e.abierto ? undefined : t("metodo.nutri.senda.bloqueado")}
                         opacity={e.abierto ? 1 : 0.42}
                         transition="opacity 0.35s ease, filter 0.35s ease"
                         sx={e.abierto ? undefined : { filter: "grayscale(1)", pointerEvents: "none" }}>
                      <TarjetaNutri titulo={p.label} foto={p.img} visto={e.hecho}
                                    onClick={() => e.abierto && onAbrir(p)} />
                    </Box>
                  </RevealItem>
                );
              })}
              {/* Huecos para que la última fila, si está a medias, no estire
                  las tarjetas que tiene (una sola no debe ocupar el ancho). */}
              {Array.from({ length: porFila - fila.length }).map((_, k) => (
                <Box key={`hueco-${k}`} flex="1" minW={0} />
              ))}
            </RevealStagger>

            {/* El giro de la senda hacia la fila siguiente: un tramo vertical
                bajo el último grupo de la fila. Va en una fila con la MISMA
                dirección y el mismo hueco, para que caiga justo debajo. */}
            {r < filas.length - 1 && (
              <Flex w="100%" gap={gap} flexDirection={direccion} h={{ base: "26px", md: "30px" }}>
                {Array.from({ length: porFila }).map((_, c) => (
                  <Box key={c} flex="1" minW={0} position="relative">
                    {c === fila.length - 1 && (
                      <Box position="absolute" left="50%" ml="-1.5px" top={0} bottom={0} w="3px"
                           borderRadius="full" transition="background 0.4s ease"
                           bg={estados[fila[fila.length - 1]].hecho ? VIA_ANDADA : VIA_APAGADA} />
                    )}
                  </Box>
                ))}
              </Flex>
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
}
