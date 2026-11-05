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
import { glowHeaderDisciplina } from "./MetodoStepHeader";
import { MarcaLeido } from "./MarcaLeido";
import React, { useState } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { sombraSoloContraste } from "../global/disciplinaSombras";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { useT } from "../../i18n";

export interface PasoCamino {
  n: number;
  titulo: string;
  ruta: string;
  /** Cerrado para la persona (candado). María entra igualmente. */
  bloqueado: boolean;
  /** La casilla inicial (START): no es un paso, solo lleva al primero. */
  inicio?: boolean;
  /** La persona ya ha pasado por esta página: tick arriba a la derecha. */
  visto?: boolean;
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
  /** Pone delante la casilla inicial START, que lleva a esta ruta. */
  conInicio?: string;
  nom: string;
  bg: string;
  txt: string;
  secciones: SeccionCamino[];
  /** María entra a cualquier caja, esté cerrada o no. */
  entraAunCerrado?: boolean;
  admin?: ControlAdmin | null;
  onIr: (ruta: string) => void;
}

const ANCHO_FLECHA = 56;
/** Ancho de una caja con `columnas` por fila: lo que queda tras las flechas, a partes iguales. */
const anchoCaja = (columnas: number): string =>
  columnas <= 1 ? "min(84vw, 320px)" : `calc((100% - ${(columnas - 1) * ANCHO_FLECHA}px) / ${columnas})`;
/** Ancho máximo del camino en varias columnas (cajas de 208 px como siempre). */
const ANCHO_MAX_CAMINO = 1000;

/** Una flecha del camino: un hilo recto muy fino que se dibuja de una caja a la siguiente, con una
 *  punta pequeña, y una luz tenue que lo recorre de vez en cuando. Sobria, sin adornos. */
function Flecha({ dir, retraso = 0, entrada = 0 }: { dir: "right" | "left" | "down"; retraso?: number; entrada?: number }) {
  const reduce = useReducedMotion();
  const vertical = dir === "down";
  const giro = dir === "left" ? "scaleX(-1)" : vertical ? "rotate(90deg)" : "";
  const vista = { once: true, amount: 0.6 } as const;
  return (
    // Entra tras la caja de la que sale: el camino se va dibujando casilla a casilla.
    <Box
      display="flex"
      flexShrink={0}
      alignItems="center"
      justifyContent="center"
      position="relative"
      w={vertical ? "28px" : `${ANCHO_FLECHA}px`}
      h={vertical ? `${ANCHO_FLECHA}px` : "28px"}
      aria-hidden
    >
      <Box position="absolute" top="50%" left="50%" w={`${ANCHO_FLECHA}px`} h="28px"
           style={{ transform: `translate(-50%, -50%) ${giro}`.trim(), filter: "drop-shadow(0 0 3px rgba(255,255,255,0.35))" }}>
        <svg width={ANCHO_FLECHA} height="28" viewBox="0 0 56 28" fill="none">
          {/* El hilo. */}
          <motion.line
            x1="5" y1="14" x2="47" y2="14"
            stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={vista}
            transition={{ duration: 0.5, delay: entrada, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* La punta, al llegar. */}
          <motion.path
            d="M43 9.5 L49 14 L43 18.5"
            stroke="white" strokeOpacity="0.9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={vista}
            transition={{ duration: 0.3, delay: entrada + 0.4 }}
          />
          {/* La luz que lo recorre, despacio y con pausas largas (nunca todas a la vez). */}
          {!reduce && (
            <motion.line
              x1="5" y1="14" x2="47" y2="14"
              stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="9 120"
              initial={{ strokeDashoffset: 9, opacity: 0 }}
              animate={{ strokeDashoffset: [9, -45], opacity: [0, 0.95, 0.95, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.6, delay: entrada + 1.2 + retraso * 0.6 }}
            />
          )}
        </svg>
      </Box>
    </Box>
  );
}

/** El halo del header, un poco más grande (para cuando se pasa el ratón por una caja). */
const glowHeaderGrande = (color: string) =>
  `0 0 24px rgba(255,255,255,0.24), 0 0 52px rgba(255,255,255,0.13), 0 0 92px rgba(180,255,245,0.14), 0 0 30px ${color}2a, 0 0 72px ${color}1a`;

const Candado = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

function Caja({
  paso, nom, bg, txt, actual, entraAunCerrado, admin, seccion, onIr, retraso, ancho,
}: {
  ancho: string;
  paso: PasoCamino; nom: string; bg: string; txt: string; actual: boolean;
  entraAunCerrado: boolean; admin?: ControlAdmin | null; seccion: number;
  onIr: (ruta: string) => void; /** Segundos que espera antes de entrar (la coreografía del camino). */ retraso: number;
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
      aria-label={paso.inicio ? paso.titulo : `${paso.n}. ${paso.titulo}`}
      position="relative"
      overflow="hidden"
      w="100%"
      minH={{ base: "112px", md: "148px" }}
      borderRadius="24px"
      bg={bg}
      // El MISMO halo que el header; al pasar el ratón por ESTA caja (solo por ella), el halo crece.
      boxShadow={glowHeaderDisciplina(txt)}
      cursor={pulsable ? "pointer" : "not-allowed"}
      transition="box-shadow 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)"
      _hover={pulsable ? { boxShadow: glowHeaderGrande(txt) } : undefined}
      _active={pulsable ? { transform: "translateY(-1px) scale(0.985)" } : undefined}
      _focusVisible={focoBlanco}
    >
      {hasDisciplinaBg(nom) && (
        <Box position="absolute" inset={0}>
          <DisciplinaBgLayer nom={nom} borderRadius="24px" overlay={`${bg}59`} />
        </Box>
      )}
      {/* La casilla en la que vas: un aro de luz que late despacio. */}
      {actual && !cerrado && (
        <Box
          position="absolute" inset={0} borderRadius="24px" zIndex={1} pointerEvents="none"
          sx={{
            animation: "cajaLatido 3.6s ease-in-out infinite",
            "@keyframes cajaLatido": {
              "0%, 100%": { boxShadow: `inset 0 0 12px ${txt}1f, inset 0 0 34px ${txt}0f` },
              "50%": { boxShadow: `inset 0 0 22px ${txt}55, inset 0 0 52px ${txt}26` },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
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
          bg="transparent"
          border={`2px solid ${txt}`}
          color={txt}
          fontWeight="700"
          fontSize="md"
        >
          {paso.inicio ? (
            // La casilla inicial lleva una punta de «play» en vez de un número.
            <svg width="16" height="16" viewBox="0 0 24 24" fill={txt} aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          ) : paso.n}
        </Flex>
        <Text
          color={txt}
          fontWeight="700"
          fontSize={{ base: "lg", md: "lg" }}
          lineHeight="1.25"
          letterSpacing="0.02em"
          textAlign="center"
          noOfLines={3}
          style={{ textShadow: sombraSoloContraste(nom) }}
        >
          {paso.titulo}
        </Text>
      </Flex>
      {cerrado && (
        <Box position="absolute" top="12px" right="12px" zIndex={2} style={{ filter: `drop-shadow(0 0 4px ${bg})` }}>
          <Candado color={txt} />
        </Box>
      )}
      {/* Visto: el tick va en el mismo sitio que el candado. */}
      {!cerrado && paso.visto && !paso.inicio && (
        <Box position="absolute" top="10px" right="10px" zIndex={2}>
          <MarcaLeido tinta={txt} bg={bg} inline />
        </Box>
      )}
    </Box>
  );

  return (
    <Reveal inView direction="up" distance={22} scaleFrom={0.9} blur duration={0.8} delay={retraso} w={ancho} flexShrink={0} minW={0}>
      {caja}
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

export function CaminoVista({ nom, bg, txt, secciones: seccionesDe, conInicio, entraAunCerrado = false, admin, onIr }: Props) {
  const t = useT();
  // EMPEZAR (START en inglés): una casilla delante del primer paso, que lleva a donde diga `conInicio`.
  const secciones: SeccionCamino[] = conInicio && seccionesDe[0]
    ? [
        { ...seccionesDe[0], pasos: [{ n: 0, titulo: t("metodo.camino.empezar"), ruta: conInicio, bloqueado: false, inicio: true }, ...seccionesDe[0].pasos] },
        ...seccionesDe.slice(1),
      ]
    : seccionesDe;
  // Cajas por fila: 1 en móvil (columna), 3 en tablet, 4 en escritorio.
  const columnas = useBreakpointValue({ base: 1, md: 3, lg: 4 }, { ssr: false }) ?? 1;

  // El paso «actual» de cada tramo: el último abierto antes del primer candado.
  const actualDe = (pasos: PasoCamino[]): number | null => {
    const abiertos = pasos.filter((p) => !p.bloqueado);
    if (abiertos.length === 0 || abiertos.length === pasos.length) return null;
    return abiertos[abiertos.length - 1].n;
  };

  const adminConAviso: ControlAdmin | null = admin ?? null;

  // LA COREOGRAFÍA: el camino se va dibujando en el orden en que se lee. Caja, su flecha, la
  // siguiente caja, su flecha… cada «tiempo» dura PULSO segundos. Las primeras CAJAS_SEGUIDAS
  // (lo que cabe en la primera pantalla) van una tras otra; las de más abajo entran al asomar,
  // por filas, sin esperar a las de arriba (si no, habría que esperar medio minuto en Cábala).
  const PULSO = 0.17;
  const CAJAS_SEGUIDAS = 8;
  const tiempoCaja = (k: number) => (k < CAJAS_SEGUIDAS ? k : (k - CAJAS_SEGUIDAS) % Math.max(columnas, 1)) * 2 * PULSO;
  let k = 0; // índice de la caja en el orden de lectura (a lo largo de todos los tramos)

  return (
    <Flex direction="column" align="center" w="100%">
      {secciones.map((sec, si) => {
        const filas = trocear(sec.pasos, columnas);
        const actual = actualDe(sec.pasos);
        return (
          <Flex key={si} direction="column" align="center" w="100%">
            {si > 0 && <Flecha dir="down" entrada={Math.max(tiempoCaja(k) - PULSO, 0)} />}
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
            <Flex direction="column" align="stretch" w="100%" maxW={columnas > 1 ? `${ANCHO_MAX_CAMINO}px` : "100%"} mx="auto">
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
                            retraso={tiempoCaja(k)}
                            ancho={anchoCaja(columnas)}
                          />
                        );
                        const miK = k++;
                        return (
                          <React.Fragment key={p.n}>
                            {caja}
                            {ci < fila.length - 1 && <Flecha dir={invertida ? "left" : "right"} retraso={(ci % 4) * 0.35} entrada={tiempoCaja(miK) + PULSO} />}
                          </React.Fragment>
                        );
                      })}
                    </Flex>
                    {fi < filas.length - 1 && (
                      <Flex justify={columnas === 1 ? "center" : invertida ? "flex-start" : "flex-end"}>
                        <Flex w={anchoCaja(columnas)} justify="center">
                          <Flecha dir="down" retraso={0.2} entrada={tiempoCaja(k - 1) + PULSO} />
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
