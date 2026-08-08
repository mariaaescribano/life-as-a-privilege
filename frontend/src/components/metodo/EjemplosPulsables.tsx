// ─────────────────────────────────────────────────────────────────────────
// EjemplosPulsables — las pastillas de ejemplo que van BAJO el recuadro de
// respuesta en los popups del recorrido de psicología (Enfréntate, Integración…).
//
// A veces no hay palabras y es mejor que te den opciones: se toca una y se
// escribe en la respuesta, donde luego se puede editar.
//
// Reglas (una sola pieza para que todas las tarjetas se vean iguales):
// · La elegida se queda en MARRÓN CLARITO con un ✓, para que se note que ya
//   está puesta (y no se vuelve a añadir si se pulsa otra vez).
// · `tope` limita cuántas se pintan: el popup tiene alto FIJO y los ejemplos
//   solo pueden ocupar el hueco que sobra. Si son frases largas, baja el tope.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import { neuropsicologiaBg, neuropsicologiaTxt } from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export function EjemplosPulsables({
  ejemplos,
  respuesta,
  onElegir,
  tope = 4,
}: {
  ejemplos: string[];
  /** Lo que hay escrito ahora: sirve para saber qué ejemplos ya están puestos. */
  respuesta: string;
  onElegir: (ejemplo: string) => void;
  tope?: number;
}) {
  const t = useT();
  const lista = ejemplos.slice(0, tope);
  if (lista.length === 0) return null;

  return (
    <Box mt={3.5}>
      <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700"
            letterSpacing="0.14em" textTransform="uppercase" opacity={0.6} mb={2}
            style={{ textShadow: INK_SHADOW }}>
        {t("metodo.tocaEjemplo")}
      </Text>
      <Flex wrap="wrap" gap={2}>
        {lista.map((ej) => {
          const puesto = respuesta.includes(ej);
          return (
            <Flex
              as="button"
              key={ej}
              onClick={() => { if (!puesto) onElegir(ej); }}
              align="center"
              gap={1.5}
              textAlign="left"
              px={{ base: 3, md: 3.5 }}
              py={2}
              borderRadius="lg"
              // Elegido: marrón clarito y borde firme. Sin elegir: papel.
              bg={puesto ? `${TINTA}2b` : "rgba(255,251,243,0.72)"}
              border={`1px solid ${TINTA}${puesto ? "aa" : "33"}`}
              cursor={puesto ? "default" : "pointer"}
              transition="all 0.15s"
              _hover={puesto ? {} : { bg: "rgba(255,251,243,0.96)", borderColor: TINTA,
                                      transform: "translateY(-1px)", boxShadow: `0 3px 12px ${TINTA}26` }}
            >
              {puesto && (
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="14px" h="14px"
                     fill="none" stroke={TINTA} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                     flexShrink={0}>
                  <path d="M5 13l4 4L19 7" />
                </Box>
              )}
              <Text color={TINTA} fontSize={{ base: "sm", md: "sm" }} fontStyle="italic" lineHeight="1.4"
                    fontWeight={puesto ? "600" : "400"}>
                {ej}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
