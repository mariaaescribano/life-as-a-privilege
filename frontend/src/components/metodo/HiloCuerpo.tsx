import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { ESTACIONES, TRAMOS } from "../../hardCoded/espacio/EstacionesCuerpo";
import { sombraTexto } from "../global/disciplinaSombras";
import { focoBlanco } from "../global/foco";
import { useT } from "../../i18n";
import { CajaFisio } from "./CajaFisio";

const late = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,181,209,0.55); }
  50%      { box-shadow: 0 0 0 7px rgba(200,181,209,0); }
`;

// ─────────────────────────────────────────────────────────────────────────
// HiloCuerpo · el camino entero en una línea: 4 tramos, una bolita por parte.
// Hechas = encendidas; la que toca = con anillo que late; el resto, apagadas.
// Las que ya se pueden abrir son pulsables (`onSelect`).
// ─────────────────────────────────────────────────────────────────────────
export function HiloCuerpo({
  hechas,
  actual,
  abiertas,
  onSelect,
}: {
  hechas: string[];
  /** La estación que se está viendo (o la que toca). */
  actual?: string;
  /** Claves de las estaciones a las que ya se puede ir. */
  abiertas?: string[];
  onSelect?: (key: string) => void;
}) {
  const t = useT();
  const sombra = sombraTexto(fisiologiaNom, fisiologiaBg);

  return (
    <CajaFisio>
      <Flex gap={{ base: 2.5, md: 5 }} px={{ base: 4, md: 8 }} py={{ base: 3.5, md: 4.5 }}>
        {TRAMOS.map((tramo) => {
          const partes = ESTACIONES.filter((e) => e.tramo === tramo);
          return (
            <Flex key={tramo} direction="column" gap={2} flex={partes.length} minW={0}>
              <Flex align="center">
                {partes.map((e, i) => {
                  const hecha = hechas.includes(e.key);
                  const esActual = e.key === actual;
                  const pulsable = !!onSelect && (abiertas ?? []).includes(e.key);
                  const bola = (
                    <Box
                      as={pulsable ? "button" : "div"}
                      onClick={pulsable ? () => onSelect!(e.key) : undefined}
                      aria-label={pulsable ? e.label : undefined}
                      flexShrink={0}
                      w={{ base: "12px", md: "15px" }}
                      h={{ base: "12px", md: "15px" }}
                      borderRadius="full"
                      bg={hecha ? fisiologiaTxt : esActual ? "transparent" : `${fisiologiaTxt}33`}
                      border={esActual ? `2px solid ${fisiologiaTxt}` : "none"}
                      boxShadow={hecha ? `0 0 10px ${fisiologiaTxt}aa` : undefined}
                      animation={esActual && !hecha ? `${late} 2.2s ease-in-out infinite` : undefined}
                      cursor={pulsable ? "pointer" : "default"}
                      transition="background 0.5s ease, box-shadow 0.5s ease, transform 0.2s ease"
                      _hover={pulsable ? { transform: "scale(1.35)" } : undefined}
                      _focusVisible={focoBlanco}
                    />
                  );
                  return (
                    <React.Fragment key={e.key}>
                      {bola}
                      {i < partes.length - 1 && (
                        <Box
                          flex={1}
                          h="2px"
                          mx={{ base: 1, md: 1.5 }}
                          borderRadius="full"
                          bg={hecha ? `${fisiologiaTxt}cc` : `${fisiologiaTxt}28`}
                          transition="background 0.5s ease"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </Flex>
              <Text
                color={fisiologiaTxt}
                fontSize={{ base: "2xs", md: "xs" }}
                letterSpacing={{ base: "0.1em", md: "0.2em" }}
                textTransform="uppercase"
                fontWeight="600"
                noOfLines={1}
                textShadow={sombra}
              >
                {t(`fisiologia.cuerpo.tramo.${tramo}` as any)}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </CajaFisio>
  );
}
