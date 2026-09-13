// ─────────────────────────────────────────────────────────────────────────
// TEST DEL PAR DE CONTROL · caja al pie de Los ciclos (paso 4).
//
// Seis frases, y todas de lo mismo: del VAIVÉN entre los dos elementos del par
// que los cuestionarios ya proponen (ver tcmCicloKe.ts). No vuelve a medir nada
// —eso ya está hecho—: confirma o descarta que esa diferencia entre dos números
// se viva de verdad como un balanceo.
//
// Si los cinco pares están igualados, aquí no hay test: se dice, y ya está.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ELEMENTOS, ESCALAS, type DatosTcm } from "./tcmRecorrido";
import { resultadoPar } from "./tcmCicloKe";
import { ICONO_ELEMENTO } from "./tcmElementosContenido";

const ROTULOS = ESCALAS.acuerdo;

export function TestParKe({
  data, respuestas, onElegir, color, bg,
}: {
  data: DatosTcm;
  /** Lo respondido hasta ahora (`data.parKe.respuestas`, en vivo). */
  respuestas: Record<string, string>;
  onElegir: (key: string, valor: string) => void;
  color: string;
  bg: string;
}) {
  const res = resultadoPar({ ...data, parKe: { respuestas } });

  // Ningún par destaca sobre los otros cuatro. Es un resultado, no un hueco.
  if (!res) {
    return (
      <Caja color={color} bg={bg}>
        <Titulo color={color}>Tu par de control</Titulo>
        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center">
          De momento tus cinco elementos se sostienen bastante entre sí: ninguna relación de
          control tira más que las otras. Cuando termines los cinco cuestionarios —o si tu
          equilibrio cambia— aquí aparecerá el par que más te pese.
        </Text>
      </Caja>
    );
  }

  const { par } = res.candidato;
  const a = ELEMENTOS[par.origen];
  const b = ELEMENTOS[par.destino];

  return (
    <Caja color={color} bg={bg}>
      <Titulo color={color}>Tu par de control</Titulo>

      {/* Quiénes son: los dos elementos del par, con sus órganos. */}
      <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} flexWrap="wrap">
        <Cara el={par.origen} nombre={a.nombre} color={color} />
        <Text color={color} fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1">·</Text>
        <Cara el={par.destino} nombre={b.nombre} color={color} />
      </Flex>
      <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
        {par.organos}
      </Text>

      <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="620px" mx="auto">
        Por tus cuestionarios, esta es la relación de control que más descompensada va.
        Lo que los cuestionarios no pueden ver es si eso lo vives como un vaivén entre los
        dos. Eso es lo que preguntan estas seis frases.
      </Text>

      {/* La escala, una sola vez. */}
      <Box borderRadius="lg" px={{ base: 3.5, md: 5 }} py={{ base: 3, md: 3.5 }}
           bg="rgba(0,0,0,0.42)" border={`1px solid ${color}66`}>
        <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={2}>
          Responde del 0 al 4:
        </Text>
        <Flex wrap="wrap" gap={{ base: 2, md: 3.5 }}>
          {ROTULOS.map((r, n) => (
            <Flex key={n} align="center" gap={1.5}>
              <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="800">{n}</Text>
              <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "xs", md: "sm" }}>{r}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Las seis frases. */}
      <Flex direction="column" gap={5} w="100%">
        {par.frases.map((f, i) => {
          const valor = respuestas[f.key];
          return (
            <Box key={f.key}>
              <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" mb={2.5}>
                {i + 1}. {f.texto}
              </Text>
              <Flex align="center" gap={{ base: 2, md: 2.5 }} wrap="wrap">
                {ROTULOS.map((rotulo, n) => {
                  const sel = valor === String(n);
                  return (
                    <Box
                      key={n}
                      as="button"
                      title={rotulo}
                      onClick={() => onElegir(f.key, String(n))}
                      w={{ base: "42px", md: "48px" }}
                      h={{ base: "42px", md: "48px" }}
                      flexShrink={0}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={sel ? color : "rgba(0,0,0,0.42)"}
                      border={`1px solid ${sel ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)"}`}
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="800"
                      cursor="pointer"
                      transition="all 0.15s"
                      boxShadow={sel ? `0 0 16px ${color}` : "none"}
                      _hover={{ bg: sel ? color : "rgba(0,0,0,0.6)", transform: "translateY(-1px)" }}
                    >
                      {n}
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          );
        })}
      </Flex>

      <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center">
        {res.respondidas} de {par.frases.length}
        {res.intensidad !== null && " · lo verás en tu diagnóstico"}
      </Text>
    </Caja>
  );
}

// ── Piezas ────────────────────────────────────────────────────────────────
function Caja({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <Flex
      direction="column"
      gap={5}
      w="100%"
      maxW="820px"
      px={{ base: 5, md: 9 }}
      py={{ base: 6, md: 8 }}
      borderRadius="2xl"
      bg={`${bg}e6`}
      border={`1px solid ${color}55`}
      boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 20px ${color}1a`}
    >
      {children}
    </Flex>
  );
}

function Titulo({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Text
      color={color}
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="800"
      letterSpacing="0.14em"
      textTransform="uppercase"
      textAlign="center"
    >
      {children}
    </Text>
  );
}

function Cara({ el, nombre, color }: { el: keyof typeof ICONO_ELEMENTO; nombre: string; color: string }) {
  return (
    <Flex direction="column" align="center" gap={1.5}>
      <Box
        w={{ base: "58px", md: "72px" }}
        h={{ base: "58px", md: "72px" }}
        borderRadius="full"
        overflow="hidden"
        border={`1px solid ${color}aa`}
        backgroundImage={`url('${ICONO_ELEMENTO[el]}')`}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.1em"
            textTransform="uppercase">
        {nombre}
      </Text>
    </Flex>
  );
}
