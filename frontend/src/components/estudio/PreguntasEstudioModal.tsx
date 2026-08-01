import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type Cuerpo } from "../metodo/astrologiaData";
import { Glifo, GlifoSigno } from "../metodo/Glifo";
import { SpaceBg } from "../metodo/SpaceBg";
import type { Eje, PreguntaEstudio } from "../../data/estudioPreguntas";
void React;

/** Una pregunta con el eje del que viene, para saber dónde se guarda. */
export interface PreguntaConEje extends PreguntaEstudio {
  eje: Eje;
  /** La posición de esa persona en ese eje: "Leo" o "5". */
  posicion: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cuerpo: Cuerpo | null;
  /** Signo de ese planeta en la carta del participante. */
  signo: string;
  /** Casa en que cae (el Ascendente no tiene). */
  casa?: number | null;
  /** Las de su signo y las de su casa, en ese orden. */
  preguntas: PreguntaConEje[];
  /** Lo ya respondido de ESTE planeta: { "sol-leo-1": true, … } */
  respuestas: Record<string, boolean>;
  /** Guarda una respuesta. Si lanza, el popup lo enseña y no avanza. */
  onResponder: (pregunta: PreguntaConEje, respuesta: boolean) => Promise<void>;
}

/**
 * Popup de preguntas de un planeta. Se responden UNA A UNA, Sí o No, y cada
 * respuesta se guarda en el momento (no al final): si alguien cierra la pestaña
 * a mitad, lo contestado hasta ahí ya cuenta para el estudio.
 *
 * Todo va del color del planeta (los mismos de la carta natal), para que se
 * reconozca de un vistazo en qué planeta se está.
 */
export function PreguntasEstudioModal({
  isOpen, onClose, cuerpo, signo, casa, preguntas, respuestas, onResponder,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrir, se empieza por la primera SIN responder (no por el principio):
  // quien vuelve a entrar continúa donde lo dejó.
  useEffect(() => {
    if (!isOpen) return;
    const primeraSinResponder = preguntas.findIndex((p) => respuestas[p.id] === undefined);
    setIdx(primeraSinResponder === -1 ? preguntas.length : primeraSinResponder);
    setError(null);
    // Solo al abrir el popup de un planeta: dentro, el índice lo maneja el usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cuerpo?.key]);

  // Escape cierra, como en el resto de popups del recorrido.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !cuerpo) return null;

  const color = cuerpo.color;
  const total = preguntas.length;
  const terminado = idx >= total;
  const pregunta = terminado ? null : preguntas[idx];
  const respondidas = preguntas.filter((p) => respuestas[p.id] !== undefined).length;

  const responder = async (valor: boolean) => {
    if (!pregunta || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      await onResponder(pregunta, valor);
      setIdx((n) => n + 1);
    } catch {
      setError("No se ha podido guardar tu respuesta. Revisa la conexión e inténtalo otra vez.");
    } finally {
      setGuardando(false);
    }
  };

  const botonSiNo = (label: string, valor: boolean) => {
    const yaElegido = pregunta ? respuestas[pregunta.id] === valor : false;
    return (
      <Box
        as="button"
        onClick={() => void responder(valor)}
        flex="1"
        py={{ base: 4, md: 5 }}
        borderRadius="xl"
        bg={yaElegido ? `${color}33` : "rgba(8,13,30,0.55)"}
        border={`1px solid ${yaElegido ? color : `${color}66`}`}
        color={color}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="700"
        letterSpacing="0.14em"
        textTransform="uppercase"
        cursor={guardando ? "wait" : "pointer"}
        opacity={guardando ? 0.6 : 1}
        transition="all 0.2s"
        boxShadow={`0 0 16px ${color}22`}
        style={{ textShadow: `0 0 12px rgba(255,255,255,0.4), 0 0 26px ${color}55` }}
        _hover={guardando ? {} : { bg: `${color}33`, borderColor: color, boxShadow: `0 0 26px ${color}55` }}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 10 }}
      py={{ base: 6, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW="620px"
        h={{ base: "calc(100dvh - 48px)", md: "560px" }}
        maxH={{ base: "calc(100dvh - 48px)", md: "calc(100vh - 80px)" }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
      >
        <SpaceBg overlay="rgba(8,13,30,0.75)" />

        {/* X cerrar */}
        <Box
          position="absolute" top={3} right={3} zIndex={3}
          as="button" onClick={onClose}
          w="36px" h="36px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.6)" border={`1px solid ${color}66`} color={color}
          cursor="pointer" transition="all 0.15s" boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        {/* Cabecera: planeta + signo */}
        <Flex position="relative" zIndex={1} align="center" gap={3} px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={4}>
          <Flex w="46px" h="46px" borderRadius="full" flexShrink={0} align="center" justify="center"
                bg={`${color}1f`} border={`1px solid ${color}55`}>
            <Glifo symbol={cuerpo.symbol} color={color} size={28} />
          </Flex>
          <Box flex="1">
            <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.05em"
                  style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 30px ${color}66` }}>
              {cuerpo.label}
            </Text>
            <Flex align="center" gap={2} mt={0.5}>
              <GlifoSigno nombre={signo} size={18} color={color} />
              <Text color={`${color}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                en {signo}{casa != null ? ` · casa ${casa}` : ""}
              </Text>
            </Flex>
          </Box>
          <Text color={`${color}aa`} fontSize="sm" fontWeight="600" letterSpacing="0.1em" flexShrink={0}>
            {Math.min(respondidas, total)}/{total}
          </Text>
        </Flex>

        {/* Barra de progreso del planeta */}
        <Box position="relative" zIndex={1} mx={{ base: 5, md: 8 }} h="3px" borderRadius="full" bg={`${color}22`}>
          <Box h="100%" borderRadius="full" bg={color} transition="width 0.35s ease"
               w={`${total ? (Math.min(respondidas, total) / total) * 100 : 0}%`}
               boxShadow={`0 0 10px ${color}88`} />
        </Box>

        {/* Cuerpo: la pregunta, o el cierre del planeta */}
        <Flex position="relative" zIndex={1} flex="1" direction="column" justify="center"
              px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }} overflowY="auto">
          {pregunta ? (
            <>
              {/* Se dice de qué eje viene la pregunta: no es lo mismo que te
                  pregunten por tu Sol en Leo que por tu Sol en la casa 5. */}
              <Text color={`${color}88`} fontSize="xs" letterSpacing="0.2em" textTransform="uppercase"
                    textAlign="center" mb={4}>
                {pregunta.eje === "casa" ? `Casa ${pregunta.posicion}` : pregunta.posicion}
                {" · "}
                Pregunta {idx + 1} de {total}
              </Text>
              <Text color={`${color}f2`} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.55"
                    textAlign="center"
                    style={{ textShadow: "0 0 14px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)" }}>
                {pregunta.texto}
              </Text>
              {respuestas[pregunta.id] !== undefined && (
                <Text color={`${color}99`} fontSize="sm" fontStyle="italic" textAlign="center" mt={3}>
                  Ya respondiste «{respuestas[pregunta.id] ? "Sí" : "No"}». Puedes cambiarlo.
                </Text>
              )}
            </>
          ) : (
            <Flex direction="column" align="center" gap={3} textAlign="center">
              <Text color={color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                    style={{ textShadow: `0 0 16px rgba(255,255,255,0.45), 0 0 34px ${color}66` }}>
                {cuerpo.label} completado
              </Text>
              <Text color={`${color}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" maxW="420px">
                Tus respuestas ya están guardadas. Vuelve al cielo y sigue con otro planeta.
              </Text>
            </Flex>
          )}

          {error && (
            <Text color="#ffb8b8" fontSize="sm" fontStyle="italic" textAlign="center" mt={4}>{error}</Text>
          )}
        </Flex>

        {/* Pie: Sí / No, o el botón de volver al cielo */}
        <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} pb={{ base: 6, md: 7 }} pt={2}>
          {pregunta ? (
            <>
              <Flex gap={3}>
                {botonSiNo("Sí", true)}
                {botonSiNo("No", false)}
              </Flex>
              {idx > 0 && (
                <Flex justify="center" mt={3}>
                  <Box as="button" onClick={() => setIdx((n) => Math.max(0, n - 1))}
                       color={`${color}aa`} fontSize="sm" bg="transparent" border="none" cursor="pointer"
                       _hover={{ color }}>
                    ← Volver a la anterior
                  </Box>
                </Flex>
              )}
            </>
          ) : (
            <Box as="button" onClick={onClose} w="100%" py={{ base: 3.5, md: 4 }} borderRadius="full"
                 bg={`${color}22`} border={`1px solid ${color}`} color={color}
                 fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.12em"
                 textTransform="uppercase" cursor="pointer" transition="all 0.2s"
                 _hover={{ bg: `${color}33`, boxShadow: `0 0 22px ${color}55` }}>
              Volver al cielo
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
