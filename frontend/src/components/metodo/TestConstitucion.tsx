import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import { API_URL, tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { glowHeader } from "./FotoBox";
import { useT } from "../../i18n";
import type { DatosTcm } from "./tcmRecorrido";
import {
  BLOQUES, ENUNCIADO, FRASES_BLOQUE, NO, SI,
  TOTAL_FRASES_CONSTITUCION, respondidasConstitucion,
  respuestasConstitucion, type BloqueConstitucion,
} from "./tcmConstitucion";

// ─────────────────────────────────────────────────────────────────────────
// El test de la Constitución, EN LA PROPIA PÁGINA (como el de Ayurveda).
//
// Se responde UNA frase cada vez, dentro de un único box con la pintura de
// Medicina China de fondo: la frase entra con una animación suave, se contesta
// «Sí/No» y la siguiente entra sola. La flecha ‹ vuelve a la anterior por si
// se quiere corregir. Los dos bloques —cómo eres y cómo va tu cuerpo— siguen
// ahí: su enunciado cambia (animado) al cruzar de uno a otro, con las frases
// MEZCLADAS entre elementos para que no se vea el patrón.
//
// Y SE GUARDA SOLO: cada «Sí/No» viaja a la BD en el momento. Si se va a mitad,
// al volver el test se abre por la primera frase sin responder (regla de la
// casa: prerrellenar siempre lo que ya rellenó). El resultado —el pentágono de
// arriba— aparece en cuanto está la última frase.
// ─────────────────────────────────────────────────────────────────────────

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;

// Todas las frases seguidas, cada una sabiendo de qué bloque viene (para
// enseñar su enunciado y animarlo al cambiar de bloque).
const FRASES_TODAS: { key: string; texto: string; bloque: BloqueConstitucion }[] =
  BLOQUES.flatMap((b) => FRASES_BLOQUE[b].map((f) => ({ ...f, bloque: b })));

// Lo que se ve del cambio de frase: la que sale se desvanece hacia arriba y la
// nueva entra desde abajo (al revés cuando se vuelve atrás con la flecha).
const FRASE_VARIANTS = {
  enter: (d: number) => ({ opacity: 0, y: d >= 0 ? 26 : -26 }),
  center: { opacity: 1, y: 0 },
  exit: (d: number) => ({ opacity: 0, y: d >= 0 ? -22 : 22 }),
};

// Con «movimiento reducido» del sistema: solo fundido, sin desplazamiento.
const FRASE_VARIANTS_QUIETA = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// Cuánto se ve la respuesta encendida antes de pasar a la siguiente frase.
const PAUSA_AVANCE_MS = 300;

export function TestConstitucion({
  data,
  onChangeData,
  onCompletar,
  onTerminar,
}: {
  data: DatosTcm;
  onChangeData: (next: DatosTcm) => void;
  /** Se llama cuando la última frase acaba de contestarse (solo la primera vez:
   *  repasando respuestas ya completas no vuelve a saltar). */
  onCompletar?: () => void;
  /** Se llama al pulsar «Ver mi resultado» con el test completo. Quién enseña o
   *  esconde el test es la PÁGINA (el resultado y las tarjetas viven allí). */
  onTerminar?: () => void;
}) {
  const t = useT();
  const reduce = useReducedMotion();
  const guardadas = useMemo(() => respuestasConstitucion(data), [data]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>(guardadas);
  // La frase a la vista: se abre por la primera sin responder (o la primera, si
  // están todas y se está repasando).
  const [idx, setIdx] = useState(() => {
    const i = FRASES_TODAS.findIndex((f) => guardadas[f.key] === undefined);
    return i === -1 ? 0 : i;
  });
  // Hacia dónde se anima el cambio de frase: adelante (1) o atrás (-1).
  const [dir, setDir] = useState(1);
  // El avance automático tras responder, cancelable si se pulsa otra cosa.
  const avanceRef = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(avanceRef.current), []);

  // La copia más fresca de los datos: el blob `data` se REEMPLAZA entero en
  // cada PATCH, así que hay que construirlo siempre sobre lo último que hay.
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  const hechas = useMemo(() => respondidasConstitucion(respuestas), [respuestas]);
  const completo = hechas === TOTAL_FRASES_CONSTITUCION;

  const responder = (key: string, valor: string) => {
    const next = { ...respuestas, [key]: valor };
    setRespuestas(next);
    void guardar(next);
    // Solo al COMPLETARSE (no en cada cambio de un test ya completo): si no,
    // repasar una respuesta echaría al usuario del test a mitad de repaso.
    if (!completo && respondidasConstitucion(next) === TOTAL_FRASES_CONSTITUCION) onCompletar?.();
    // La respuesta se ve encendida un instante y la siguiente frase entra sola.
    window.clearTimeout(avanceRef.current);
    if (idx < FRASES_TODAS.length - 1) {
      avanceRef.current = window.setTimeout(() => {
        setDir(1);
        setIdx((i) => Math.min(i + 1, FRASES_TODAS.length - 1));
      }, PAUSA_AVANCE_MS);
    }
  };

  const atras = () => {
    window.clearTimeout(avanceRef.current);
    setDir(-1);
    setIdx((i) => Math.max(i - 1, 0));
  };

  const guardar = async (r: Record<string, string>) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const next: DatosTcm = { ...dataRef.current, constitucion: { respuestas: r } };
    dataRef.current = next;
    onChangeData(next);
    if (!userId || !token) return;
    try {
      await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* el estado local ya refleja el cambio */ }
  };

  // ── El test: una frase cada vez ─────────────────────────────────────────
  const frase = FRASES_TODAS[idx];
  const valor = respuestas[frase.key];

  return (
    <Flex direction="column" align="center" gap={5} w="100%">

      {/* Cuánto llevas. Se queda a la vista mientras respondes. */}
      <Reveal direction="up" distance={14} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
        <Box w="100%" maxW="520px">
          <Box h="6px" w="100%" borderRadius="full" bg="rgba(255,255,255,0.25)" overflow="hidden">
            <Box h="100%" borderRadius="full" bg={tcmTxt} transition="width 0.3s ease"
                 w={`${Math.round((hechas / TOTAL_FRASES_CONSTITUCION) * 100)}%`} />
          </Box>
          {/* Sobre el turquesa: blanco y sin sombra (regla de la casa). */}
          <Text color="white" fontSize="sm" textAlign="center" mt={1.5} opacity={0.9}>
            {t("metodo.tcm.constitucion.llevas", { hechas, total: TOTAL_FRASES_CONSTITUCION })}
          </Text>
          <Text color="white" fontSize="xs" fontStyle="italic" textAlign="center" mt={1} opacity={0.8} lineHeight="1.6">
            {t("metodo.tcm.constitucion.seGuardaSolo")}
          </Text>
        </Box>
      </Reveal>

      {/* El box del test: la pintura de TCM de fondo y una frase cada vez. */}
      <Reveal direction="up" distance={24} delay={0.16} duration={0.65} w="100%" display="flex">
        <Caja>
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} textAlign="center"
                minH={{ base: "300px", md: "290px" }}>

            {/* El enunciado del bloque, animado al cruzar de un bloque al otro. */}
            <Box minH="1.6em">
              <AnimatePresence mode="wait">
                <motion.div
                  key={frase.bloque}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="800"
                        letterSpacing="0.18em" textTransform="uppercase" opacity={0.85}>
                    {ENUNCIADO[frase.bloque]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* La frase, entrando y saliendo con suavidad. El alto va reservado
                para que el box no dé saltos entre frases cortas y largas. */}
            <Flex flex="1" align="center" justify="center" w="100%" px={{ base: 1, md: 10 }}>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={frase.key}
                  custom={dir}
                  variants={reduce ? FRASE_VARIANTS_QUIETA : FRASE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  style={{ width: "100%" }}
                >
                  <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                        lineHeight="1.55" maxW="640px" mx="auto">
                    {frase.texto}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </Flex>

            {/* Sí / No */}
            <Flex gap={{ base: 3, md: 4 }} justify="center">
              {[{ v: SI, r: t("metodo.tcm.constitucion.si") },
                { v: NO, r: t("metodo.tcm.constitucion.no") }].map(({ v, r }) => {
                const sel = valor === v;
                return (
                  <Box key={v} as="button" onClick={() => responder(frase.key, v)}
                       px={{ base: 9, md: 12 }} py={{ base: 2, md: 2.5 }} borderRadius="full"
                       bg={sel ? tcmTxt : "rgba(0,0,0,0.3)"}
                       color={sel ? tcmBg : tcmTxt}
                       border={`1px solid ${sel ? tcmTxt : `${tcmTxt}77`}`}
                       fontSize={{ base: "lg", md: "xl" }} fontWeight="800"
                       fontFamily="'EB Garamond', serif" cursor="pointer"
                       transition="background-color 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s"
                       boxShadow={sel ? `0 0 18px ${tcmTxt}88` : "none"}
                       style={{ textShadow: "none" }}
                       _hover={sel ? {} : { bg: `${tcmTxt}22` }}
                       _focusVisible={focoBlanco}>
                    {r}
                  </Box>
                );
              })}
            </Flex>

            {/* Volver a la frase anterior + por cuál vas. */}
            <Flex w="100%" align="center" justify="space-between" mt={{ base: 0, md: 1 }}>
              <Box as="button" onClick={atras} aria-label={t("comun.anterior")}
                   opacity={idx === 0 ? 0.3 : 0.9}
                   cursor={idx === 0 ? "default" : "pointer"}
                   w="38px" h="38px" borderRadius="full" display="flex"
                   alignItems="center" justifyContent="center"
                   bg="rgba(0,0,0,0.3)" border={`1px solid ${tcmTxt}66`}
                   transition="background-color 0.15s"
                   _hover={idx === 0 ? {} : { bg: "rgba(0,0,0,0.5)" }}
                   _focusVisible={focoBlanco}>
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                     w="20px" h="20px" fill={tcmTxt}>
                  <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </Box>
              </Box>
              <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    letterSpacing="0.14em" opacity={0.85}>
                {idx + 1} / {TOTAL_FRASES_CONSTITUCION}
              </Text>
            </Flex>
          </Flex>
        </Caja>
      </Reveal>

      {/* Al terminar: subir al pentágono, que está arriba del todo. */}
      <Flex direction="column" align="center" gap={2}>
        {!completo && (
          <Text color="white" fontSize="sm" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.7">
            {t("metodo.tcm.constitucion.faltan", { faltan: TOTAL_FRASES_CONSTITUCION - hechas })}
          </Text>
        )}
        {completo && (
          <Boton onClick={() => onTerminar?.()}>
            {t("metodo.tcm.constitucion.verResultado")}
          </Boton>
        )}
      </Flex>
    </Flex>
  );
}

// La caja de la casa: la pintura de TCM detrás, VISIBLE (velo fino de color +
// un punto de sombra para que la letra rosa se sostenga) y el halo del header.
function Caja({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tcmTxt)}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      {/* Dos velos finos (hex-alpha, nada de rgba en gradientes): el tinte de la
          disciplina y un oscurecido suave. Antes iba un velo del 70% que se
          comía la pintura; ahora la tinta china se ve detrás del texto. */}
      <Box position="absolute" inset={0} bg={`${tcmBg}66`} />
      <Box position="absolute" inset={0} bg="#00000040" />
      <Box position="relative" px={{ base: 5, md: 8 }} py={{ base: 5, md: 8 }}
           style={{ textShadow: INK_SHADOW }}>
        {children}
      </Box>
    </Box>
  );
}

function Boton({ children, onClick, tenue }: {
  children: React.ReactNode; onClick: () => void; tenue?: boolean;
}) {
  return (
    <Box as="button" onClick={onClick}
         mt={2} px={{ base: 8, md: 11 }} py={{ base: 2.5, md: 3 }} borderRadius="full"
         bg={tenue ? "transparent" : tcmTxt}
         color={tenue ? tcmTxt : tcmBg}
         border={`${tenue ? 1 : 2}px solid ${tenue ? `${tcmTxt}88` : "rgba(255,255,255,0.75)"}`}
         fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} fontWeight="800"
         letterSpacing="0.06em" cursor="pointer" transition="transform 0.18s ease"
         boxShadow={tenue ? "none" : glowHeader(tcmTxt)} style={{ textShadow: "none" }}
         _hover={{ transform: "translateY(-2px)", ...(tenue ? { bg: `${tcmTxt}22` } : {}) }}
         _focusVisible={focoBlanco}>
      {children}
    </Box>
  );
}
