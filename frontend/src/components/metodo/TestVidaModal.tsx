import React, { useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import { focoBlanco } from "../global/foco";
import { FlechaBonita } from "../global/FlechaBonita";
import { BotonCerrarDisciplina } from "./BotonCerrarDisciplina";
import { glowHeader } from "./FotoBox";
import { useT, type ClaveTexto } from "../../i18n";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { TEST_VIDA, type RespuestasVida } from "../../hardCoded/espacio/OrganosVida";

const MBox = motion(Box);
const FONDO = "/img/fondos/fisio.webp";
const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);
const TICK = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";

// ─────────────────────────────────────────────────────────────────────────
// TestVidaModal · el test que averigua qué le importa a la persona (3 preguntas,
// una por pantalla). Popup inmersivo: la foto de Fisiología a pantalla completa
// y, encima, una caja con halo. Con las respuestas se construye su recorrido
// individualizado (ver OrganosVida.ts → rankingVida).
//
//   · opciones de varias en varias hasta el máximo de cada pregunta;
//   · «Ninguna» (molestias) se excluye con las demás;
//   · la X lo cierra sin contestar (`onCancelar`).
// ─────────────────────────────────────────────────────────────────────────
export function TestVidaModal({
  onFinish,
  onCancelar,
  inicial,
  nombreOrgano,
}: {
  onFinish: (r: RespuestasVida) => void;
  onCancelar: () => void;
  inicial?: RespuestasVida;
  /** Nombre de un órgano (para las opciones de la pregunta 3). */
  nombreOrgano: (key: string) => string;
}) {
  const t = useT();
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<RespuestasVida>(inicial ?? {});
  const pregunta = TEST_VIDA[paso];
  const marcadas = resp[pregunta.id] ?? [];
  const ultima = paso === TEST_VIDA.length - 1;

  const alternar = (id: string, ninguna?: boolean) => {
    setResp((prev) => {
      const actual = prev[pregunta.id] ?? [];
      if (actual.includes(id)) return { ...prev, [pregunta.id]: actual.filter((x) => x !== id) };
      if (ninguna) return { ...prev, [pregunta.id]: [id] };
      const sinNinguna = actual.filter((x) => !pregunta.opciones.find((o) => o.id === x)?.ninguna);
      if (sinNinguna.length >= pregunta.max) return prev;
      return { ...prev, [pregunta.id]: [...sinNinguna, id] };
    });
  };

  const textoOpcion = (id: string) =>
    pregunta.id === "curiosidad"
      ? nombreOrgano(id)
      : t(`fisiologia.vida.test.o.${pregunta.id === "interes" ? "interes" : "molestias"}.${id}` as ClaveTexto);

  const Pildora = ({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => (
    <Box as="button" onClick={disabled ? undefined : onClick} disabled={disabled}
         display="inline-flex" alignItems="center" gap={2.5}
         px={{ base: 5, md: 7 }} py={{ base: 2, md: 2.5 }} borderRadius="full" color={fisiologiaTxt}
         bg={`${fisiologiaTxt}1a`} border={`1.5px solid ${fisiologiaTxt}aa`}
         fontStyle="italic" letterSpacing="0.05em" fontSize={{ base: "md", md: "lg" }}
         opacity={disabled ? 0.45 : 1} cursor={disabled ? "not-allowed" : "pointer"}
         boxShadow={disabled ? "none" : `0 0 10px rgba(255,255,255,0.16), 0 0 22px ${fisiologiaTxt}44`}
         transition="all 0.15s ease" style={{ textShadow: SOMBRA }}
         _hover={disabled ? undefined : { bg: `${fisiologiaTxt}2b`, transform: "translateY(-2px)" }}
         _active={disabled ? undefined : { transform: "scale(0.96)" }}
         _focusVisible={focoBlanco}>
      {children}
    </Box>
  );

  return (
    <Box position="fixed" inset={0} zIndex={300} bg={fisiologiaBg} overflowY="auto" fontFamily="'EB Garamond', serif">
      <Box position="fixed" inset={0} overflow="hidden" pointerEvents="none">
        <Box as="img" src={FONDO} alt="" loading="eager" position="absolute" inset={0} w="100%" h="100%"
             style={{ objectFit: "cover", objectPosition: "center" }} />
      </Box>
      <BotonCerrarDisciplina onClose={onCancelar} bg={fisiologiaBg} txt={fisiologiaTxt} zIndex={2} />

      <Flex position="relative" minH="100%" align="center" justify="center" px={{ base: 4, md: 8 }} py={{ base: 20, md: 12 }}>
        <Box position="relative" overflow="hidden" w="100%" maxW="760px" borderRadius="2xl" boxShadow={glowHeader(fisiologiaTxt)}>
          <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
          <Flex position="relative" zIndex={1} direction="column" gap={{ base: 5, md: 6 }} px={{ base: 5, md: 10 }} py={{ base: 7, md: 9 }}>

            {/* Progreso */}
            <Flex justify="center" gap={2}>
              {TEST_VIDA.map((p, i) => (
                <Box key={p.id} w="9px" h="9px" borderRadius="full"
                     bg={i <= paso ? fisiologiaTxt : "rgba(255,255,255,0.22)"}
                     boxShadow={i === paso ? `0 0 10px ${fisiologiaTxt}` : "none"} transition="all 0.3s" />
              ))}
            </Flex>

            <AnimatePresence mode="wait">
              <MBox key={pregunta.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <Text color={fisiologiaTxt} textAlign="center" fontWeight={700} lineHeight="1.25" letterSpacing="0.02em"
                      fontSize={{ base: "2xl", md: "3xl" }} style={{ textShadow: SOMBRA }}>
                  {t(`fisiologia.vida.test.q.${pregunta.id}` as ClaveTexto)}
                </Text>
                <Text color={fisiologiaTxt} textAlign="center" fontStyle="italic" mt={2} mb={{ base: 5, md: 6 }}
                      fontSize={{ base: "md", md: "lg" }} style={{ textShadow: SOMBRA }}>
                  {t(`fisiologia.vida.test.q.${pregunta.id}.ayuda` as ClaveTexto)}
                </Text>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 2.5, md: 3 }}>
                  {pregunta.opciones.map((op) => {
                    const on = marcadas.includes(op.id);
                    const lleno = !on && !op.ninguna && marcadas.filter((x) => !pregunta.opciones.find((o) => o.id === x)?.ninguna).length >= pregunta.max;
                    return (
                      <Box key={op.id} as="button" onClick={() => alternar(op.id, op.ninguna)}
                           aria-pressed={on}
                           display="flex" alignItems="center" gap={3} textAlign="left"
                           px={4} py={3} borderRadius="xl"
                           bg={on ? `${fisiologiaTxt}2b` : `${fisiologiaBg}80`}
                           border={`1.5px solid ${on ? fisiologiaTxt : `${fisiologiaTxt}44`}`}
                           boxShadow={on ? `0 0 14px ${fisiologiaTxt}44` : "none"}
                           opacity={lleno ? 0.45 : 1}
                           cursor={lleno ? "not-allowed" : "pointer"}
                           transition="all 0.18s ease"
                           _hover={lleno ? undefined : { borderColor: fisiologiaTxt, transform: "translateY(-1px)" }}
                           _active={lleno ? undefined : { transform: "scale(0.985)" }}
                           _focusVisible={focoBlanco}>
                        <Flex flexShrink={0} w="22px" h="22px" borderRadius="full" align="center" justify="center"
                              border={`1.5px solid ${fisiologiaTxt}`} bg={on ? fisiologiaTxt : "transparent"}>
                          {on && (
                            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={fisiologiaBg}>
                              <path d={TICK} />
                            </Box>
                          )}
                        </Flex>
                        <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.3" style={{ textShadow: SOMBRA }}>
                          {textoOpcion(op.id)}
                        </Text>
                      </Box>
                    );
                  })}
                </Grid>
              </MBox>
            </AnimatePresence>

            <Flex justify="space-between" align="center" gap={3} mt={1}>
              {paso > 0 ? (
                <Pildora onClick={() => setPaso(paso - 1)}>
                  <FlechaBonita dir="prev" size="20px" />
                  <Text as="span" display={{ base: "none", md: "inline" }}>{t("comun.anterior")}</Text>
                </Pildora>
              ) : <Box />}
              <Pildora disabled={marcadas.length === 0} onClick={() => (ultima ? onFinish(resp) : setPaso(paso + 1))}>
                <Text as="span">{ultima ? t("fisiologia.vida.test.ver") : t("comun.siguiente")}</Text>
                <FlechaBonita dir="next" size="20px" />
              </Pildora>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
