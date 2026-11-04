// ─────────────────────────────────────────────────────────────────────────────
// EL CAMINO · una disciplina vista como un camino: cada página de dentro es una
// cajita con el fondo de la disciplina, unidas por flechas. En escritorio el
// camino serpentea (una fila de izquierda a derecha, la siguiente de derecha a
// izquierda, y una flecha baja en cada extremo) para que se lea como UN solo
// camino partido en filas; en móvil es una columna con flechas hacia abajo.
//
// Es solo la vista: no sabe de qué disciplina es ni qué pasos están abiertos.
// Quien la usa (CaminoDisciplina) le da los pasos con su candado puesto.
//
// Lo que ve cada quien:
//   · La persona: sus pasos abiertos y los cerrados con candado (no se pulsan).
//   · María (`admin`): entra a donde quiera, aunque esté cerrado, y además tiene
//     el control de cuántos pasos tiene abiertos la persona (− / +) y un botón
//     «Abrir hasta aquí» en cada caja cerrada. La persona NUNCA ve esto.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import { Breathe, Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";

export interface PasoCamino {
  n: number;
  titulo: string;
  ruta: string;
  /** Cerrado para la persona (candado). María entra igualmente. */
  bloqueado: boolean;
}

export interface SeccionCamino {
  /** Encabezado del tramo (fisiología: La materia · La Vida; ayurveda: el mapa y tu doṣha). */
  titulo?: string;
  pasos: PasoCamino[];
}

/** Lo que solo ve María: el techo de pasos abiertos de la persona y cómo moverlo. */
export interface ControlAdmin {
  pasoMax: number;
  total: number;
  /** Guarda el nuevo techo; lanza si el servidor lo rechaza. */
  fijar: (paso: number) => Promise<void>;
  /** Pasos a los que aplica el techo (el resto de pasos se abre por sus propias reglas). */
  aplicaA: (n: number, seccion: number) => boolean;
}

interface Props {
  nom: string;
  bg: string;
  txt: string;
  secciones: SeccionCamino[];
  /** María entra a cualquier caja, esté cerrada o no. */
  entraAunCerrado?: boolean;
  admin?: ControlAdmin | null;
  onIr: (ruta: string) => void;
}

const ANCHO_CAJA = { base: "min(84vw, 320px)", md: "208px" };
const ANCHO_FLECHA = 56;

/** Una flecha del camino: línea de puntos, punta y una chispa que va por ella. */
function Flecha({ dir, retraso = 0 }: { dir: "right" | "left" | "down"; retraso?: number }) {
  const reduce = useReducedMotion();
  const vertical = dir === "down";
  const giro = dir === "left" ? "scaleX(-1)" : vertical ? "rotate(90deg)" : "none";
  return (
    <Flex
      flexShrink={0}
      align="center"
      justify="center"
      position="relative"
      w={vertical ? "28px" : `${ANCHO_FLECHA}px`}
      h={vertical ? `${ANCHO_FLECHA}px` : "28px"}
      aria-hidden
    >
      <Box position="absolute" top="50%" left="50%" w={`${ANCHO_FLECHA}px`} h="28px" style={{ transform: `translate(-50%, -50%) ${giro}` }}>
        <svg width={ANCHO_FLECHA} height="28" viewBox="0 0 56 28" fill="none">
          <line x1="6" y1="14" x2="46" y2="14" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
          <path d="M40 7 L49 14 L40 21" stroke="white" strokeOpacity="0.95" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          {!reduce && (
            <motion.circle
              r="3"
              cy="14"
              fill="white"
              initial={{ cx: 6, opacity: 0 }}
              animate={{ cx: [6, 44], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: retraso, ease: "easeInOut" }}
            />
          )}
        </svg>
      </Box>
    </Flex>
  );
}

const Candado = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

function Caja({
  paso, nom, bg, txt, actual, entraAunCerrado, admin, seccion, onIr, orden,
}: {
  paso: PasoCamino; nom: string; bg: string; txt: string; actual: boolean;
  entraAunCerrado: boolean; admin?: ControlAdmin | null; seccion: number;
  onIr: (ruta: string) => void; orden: number;
}) {
  const [abriendo, setAbriendo] = useState(false);
  const cerrado = paso.bloqueado;
  const pulsable = !cerrado || entraAunCerrado;
  const puedeAbrir = !!admin && cerrado && admin.aplicaA(paso.n, seccion);

  const abrirHasta = async () => {
    if (!admin || abriendo) return;
    setAbriendo(true);
    try { await admin.fijar(paso.n); } catch { /* el aviso lo da quien usa la vista */ } finally { setAbriendo(false); }
  };

  const caja = (
    <Box
      as="button"
      type="button"
      onClick={pulsable ? () => onIr(paso.ruta) : undefined}
      aria-disabled={!pulsable}
      aria-label={`${paso.n}. ${paso.titulo}`}
      role="group"
      position="relative"
      overflow="hidden"
      w="100%"
      minH={{ base: "112px", md: "148px" }}
      borderRadius="24px"
      bg={bg}
      border={`1px solid ${txt}${actual ? "dd" : "66"}`}
      boxShadow={actual ? `0 0 34px ${txt}99, 0 0 70px ${txt}44` : `0 0 20px ${txt}44`}
      cursor={pulsable ? "pointer" : "not-allowed"}
      transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
      _hover={pulsable ? { transform: "translateY(-4px)", boxShadow: `0 0 34px ${txt}88, 0 0 70px ${txt}33`, borderColor: `${txt}cc` } : undefined}
      _focusVisible={focoBlanco}
    >
      {hasDisciplinaBg(nom) && (
        <Box position="absolute" inset={0} transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)" _groupHover={pulsable ? { transform: "scale(1.07)" } : undefined}>
          <DisciplinaBgLayer nom={nom} borderRadius="24px" overlay={`${bg}59`} />
        </Box>
      )}
      <Flex
        position="relative"
        zIndex={1}
        direction="column"
        align="center"
        justify="center"
        gap={3}
        px={4}
        py={5}
        minH="inherit"
        opacity={cerrado ? 0.62 : 1}
        style={cerrado ? { filter: "saturate(0.6)" } : undefined}
      >
        <Flex
          align="center"
          justify="center"
          w="38px"
          h="38px"
          borderRadius="full"
          bg={bg}
          border={`2px solid ${txt}`}
          color={txt}
          fontWeight="700"
          fontSize="md"
          style={{ boxShadow: `0 0 12px ${txt}88` }}
        >
          {paso.n}
        </Flex>
        <Text
          color={txt}
          fontWeight="700"
          fontSize={{ base: "lg", md: "lg" }}
          lineHeight="1.25"
          letterSpacing="0.02em"
          textAlign="center"
          noOfLines={3}
          style={{ textShadow: sombraTexto(nom, bg) }}
        >
          {paso.titulo}
        </Text>
      </Flex>
      {cerrado && (
        <Box position="absolute" top="12px" right="12px" zIndex={2} style={{ filter: `drop-shadow(0 0 4px ${bg})` }}>
          <Candado color={txt} />
        </Box>
      )}
    </Box>
  );

  return (
    <Reveal inView direction="up" distance={20} scaleFrom={0.95} delay={Math.min(orden * 0.05, 0.45)} w={ANCHO_CAJA} flexShrink={0}>
      {actual ? <Breathe scale={0.025} duration={3.4}>{caja}</Breathe> : caja}
      {puedeAbrir && (
        <Flex justify="center" mt={2}>
          <Box
            as="button"
            type="button"
            onClick={abrirHasta}
            px={4}
            py="5px"
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.7)"
            bg="rgba(255,255,255,0.14)"
            color="white"
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.04em"
            cursor={abriendo ? "wait" : "pointer"}
            opacity={abriendo ? 0.6 : 1}
            boxShadow="0 0 16px rgba(255,255,255,0.25)"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.26)", transform: "translateY(-1px)" }}
            _focusVisible={focoBlanco}
          >
            {abriendo ? "Abriendo…" : "Abrir hasta aquí"}
          </Box>
        </Flex>
      )}
    </Reveal>
  );
}

const trocear = <T,>(lista: T[], n: number): T[][] => {
  const filas: T[][] = [];
  for (let i = 0; i < lista.length; i += n) filas.push(lista.slice(i, i + n));
  return filas;
};

export function CaminoVista({ nom, bg, txt, secciones, entraAunCerrado = false, admin, onIr }: Props) {
  // Cajas por fila: 1 en móvil (columna), 3 en tablet, 4 en escritorio.
  const columnas = useBreakpointValue({ base: 1, md: 3, lg: 4 }, { ssr: false }) ?? 1;
  const [errorFijar, setErrorFijar] = useState(false);

  // El paso «actual» de cada tramo: el último abierto antes del primer candado.
  const actualDe = (pasos: PasoCamino[]): number | null => {
    const abiertos = pasos.filter((p) => !p.bloqueado);
    if (abiertos.length === 0 || abiertos.length === pasos.length) return null;
    return abiertos[abiertos.length - 1].n;
  };

  const adminConAviso: ControlAdmin | null = admin
    ? {
        ...admin,
        fijar: async (n) => {
          setErrorFijar(false);
          try { await admin.fijar(n); } catch (e) { setErrorFijar(true); throw e; }
        },
      }
    : null;

  let orden = 0;

  return (
    <Flex direction="column" align="center" w="100%">
      {/* ── Solo María: cuántos pasos tiene abiertos la persona ── */}
      {adminConAviso && (
        <Reveal direction="down" distance={14} mb={{ base: 8, md: 10 }}>
          <Flex
            align="center"
            gap={3}
            px={5}
            py={2}
            borderRadius="full"
            bg="rgba(255,255,255,0.1)"
            border="1.5px solid rgba(255,255,255,0.6)"
            boxShadow="0 0 22px rgba(255,255,255,0.2)"
            color="white"
            wrap="wrap"
            justify="center"
          >
            <Text fontSize="md" fontWeight="600" letterSpacing="0.04em">
              Abierto hasta el paso {adminConAviso.pasoMax} de {adminConAviso.total}
            </Text>
            {(["−", "+"] as const).map((signo) => {
              const nuevo = adminConAviso.pasoMax + (signo === "+" ? 1 : -1);
              const fuera = nuevo < 1 || nuevo > adminConAviso.total;
              return (
                <Box
                  key={signo}
                  as="button"
                  type="button"
                  onClick={fuera ? undefined : () => { void adminConAviso.fijar(nuevo).catch(() => {}); }}
                  disabled={fuera}
                  aria-label={signo === "+" ? "Abrir el siguiente paso" : "Cerrar el último paso abierto"}
                  title={signo === "+" ? "Abrir el siguiente paso" : "Cerrar el último paso abierto"}
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  border="1.5px solid rgba(255,255,255,0.75)"
                  bg="rgba(255,255,255,0.14)"
                  color="white"
                  fontWeight="700"
                  fontSize="lg"
                  lineHeight="1"
                  cursor={fuera ? "not-allowed" : "pointer"}
                  opacity={fuera ? 0.4 : 1}
                  transition="all 0.2s"
                  _hover={fuera ? undefined : { bg: "rgba(255,255,255,0.28)" }}
                  _focusVisible={focoBlanco}
                >
                  {signo}
                </Box>
              );
            })}
          </Flex>
          {errorFijar && (
            <Text color="#ffe7bd" fontSize="sm" fontStyle="italic" textAlign="center" mt={2}>No se pudo guardar. Inténtalo de nuevo.</Text>
          )}
        </Reveal>
      )}

      {secciones.map((sec, si) => {
        const filas = trocear(sec.pasos, columnas);
        const actual = actualDe(sec.pasos);
        return (
          <Flex key={si} direction="column" align="center" w="100%">
            {si > 0 && <Flecha dir="down" />}
            {sec.titulo && (
              <Reveal inView direction="up" distance={14} w="100%" mb={{ base: 5, md: 7 }} mt={si > 0 ? 3 : 0}>
                <Flex align="center" gap={4} w="100%" maxW="900px" mx="auto">
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.4)" />
                  <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.14em" textTransform="uppercase" textAlign="center">
                    {sec.titulo}
                  </Text>
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.4)" />
                </Flex>
              </Reveal>
            )}

            {/* El camino de este tramo: una columna que mide lo que la fila más larga. */}
            <Flex direction="column" align="stretch" w="fit-content" maxW="100%">
              {filas.map((fila, fi) => {
                const invertida = columnas > 1 && fi % 2 === 1;
                return (
                  <React.Fragment key={fi}>
                    <Flex direction={invertida ? "row-reverse" : "row"} justify="flex-start" align="center">
                      {fila.map((p, ci) => {
                        const caja = (
                          <Caja
                            key={p.n}
                            paso={p}
                            nom={nom}
                            bg={bg}
                            txt={txt}
                            actual={p.n === actual}
                            entraAunCerrado={entraAunCerrado}
                            admin={adminConAviso}
                            seccion={si}
                            onIr={onIr}
                            orden={orden++}
                          />
                        );
                        return (
                          <React.Fragment key={p.n}>
                            {caja}
                            {ci < fila.length - 1 && <Flecha dir={invertida ? "left" : "right"} retraso={(ci % 4) * 0.35} />}
                          </React.Fragment>
                        );
                      })}
                    </Flex>
                    {fi < filas.length - 1 && (
                      <Flex justify={columnas === 1 ? "center" : invertida ? "flex-start" : "flex-end"}>
                        <Flex w={ANCHO_CAJA} justify="center">
                          <Flecha dir="down" retraso={0.2} />
                        </Flex>
                      </Flex>
                    )}
                  </React.Fragment>
                );
              })}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}
