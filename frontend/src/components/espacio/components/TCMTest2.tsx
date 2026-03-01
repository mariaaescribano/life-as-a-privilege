import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
const SCALE_LABELS = [
  "No me describe",
  "Leve tendencia",
  "Moderadamente característico",
  "Muy característico",
];

const ELEMENTOS = [
  {
    nombre: "Madera",
    numero: "I",
    subtitulo: "Hígado · Vesícula Biliar",
    dominio: "Impulso vital, dirección, capacidad decisional",
    preguntas: [
      "Tendencia natural al liderazgo o iniciativa.",
      "Necesidad de progreso y crecimiento constante.",
      "Reactividad emocional rápida ante obstáculos.",
      "Personalidad competitiva o orientada a metas.",
      "Expresión directa de opiniones.",
      "Energía que se activa rápidamente ante estímulo.",
      "Incomodidad ante la pasividad prolongada.",
      "Facilidad para planificar o proyectar a futuro.",
    ],
  },
  {
    nombre: "Fuego",
    numero: "II",
    subtitulo: "Corazón · Intestino Delgado",
    dominio: "Expresión emocional, vínculo, vitalidad relacional",
    preguntas: [
      "Carácter expresivo y comunicativo.",
      "Búsqueda natural de conexión emocional.",
      "Facilidad para entusiasmarse.",
      "Sensibilidad emocional marcada.",
      "Presencia social cálida o carismática.",
      "Necesidad de compartir experiencias internas.",
      "Intensidad afectiva en vínculos.",
      "Tendencia a experimentar alegría como emoción dominante.",
    ],
  },
  {
    nombre: "Tierra",
    numero: "III",
    subtitulo: "Bazo · Estómago",
    dominio: "Nutrición, sostén, estabilidad",
    preguntas: [
      "Tendencia a cuidar o sostener a otros.",
      "Búsqueda de estabilidad y rutina.",
      "Personalidad confiable y constante.",
      "Empatía desarrollada.",
      "Preferencia por entornos armoniosos.",
      "Sentido práctico en la toma de decisiones.",
      "Capacidad de contención emocional.",
      "Necesidad de seguridad estructural.",
    ],
  },
  {
    nombre: "Metal",
    numero: "IV",
    subtitulo: "Pulmón · Intestino Grueso",
    dominio: "Orden interno, ética, introspección",
    preguntas: [
      "Autoexigencia o estándares elevados.",
      "Valoración marcada del orden y la estructura.",
      "Sentido ético fuerte.",
      "Tendencia a la reserva emocional.",
      "Incomodidad ante el caos.",
      "Orientación hacia profundidad más que superficialidad.",
      "Necesidad de claridad y definición.",
      "Personalidad introspectiva.",
    ],
  },
  {
    nombre: "Agua",
    numero: "V",
    subtitulo: "Riñón · Vejiga",
    dominio: "Voluntad, profundidad, conservación de energía",
    preguntas: [
      "Tendencia natural a la introspección.",
      "Necesidad frecuente de soledad para recargar energía.",
      "Interés por temas existenciales o profundos.",
      "Prudencia antes de confiar.",
      "Sensación de voluntad fuerte ante lo importante.",
      "Preferencia por entornos tranquilos.",
      "Energía interna intensa aunque poco expresiva.",
      "Intuición desarrollada.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Madera",
    descripcion:
      "Tu terreno constitucional es el Movimiento Madera. Tu naturaleza tiende al impulso, la dirección y la iniciativa. El Hígado rige tu capacidad de planificar y avanzar. Cuida el exceso de tensión y frustración como señales de desequilibrio.",
  },
  {
    nombre: "Fuego",
    descripcion:
      "Tu terreno constitucional es el Movimiento Fuego. Tu naturaleza es expresiva, relacional y cálida. El Corazón rige tu vitalidad emocional y la conexión. Cuida la intensidad afectiva y la sobre-estimulación como señales de desequilibrio.",
  },
  {
    nombre: "Tierra",
    descripcion:
      "Tu terreno constitucional es el Movimiento Tierra. Tu naturaleza tiende al sostén, la estabilidad y el cuidado. El Bazo rige tu capacidad nutritiva y de contención. Cuida la rumiación y el agotamiento por cuidar a otros como señales de desequilibrio.",
  },
  {
    nombre: "Metal",
    descripcion:
      "Tu terreno constitucional es el Movimiento Metal. Tu naturaleza es introspectiva, precisa y ética. El Pulmón rige tu sentido del orden y los límites. Cuida la rigidez y la dificultad para soltar como señales de desequilibrio.",
  },
  {
    nombre: "Agua",
    descripcion:
      "Tu terreno constitucional es el Movimiento Agua. Tu naturaleza es profunda, intuitiva y reservada. El Riñón rige tu voluntad y la energía vital de base. Cuida el agotamiento y el miedo como señales de desequilibrio.",
  },
];

/* ══════════════════════════════════════════════
   COMPONENTES
══════════════════════════════════════════════ */

const Divider = () => (
  <Flex align="center" gap={3} my={5}>
    <Box flex="1" h="1px" bg={tcmTxt} opacity={0.15} />
    <Box w="4px" h="4px" borderRadius="full" bg={tcmTxt} opacity={0.35} />
    <Box flex="1" h="1px" bg={tcmTxt} opacity={0.15} />
  </Flex>
);

const ScaleBtn = ({
  val,
  selected,
  onClick,
}: {
  val: number;
  selected: boolean;
  onClick: () => void;
}) => (
  <Flex direction="column" align="center" gap={1.5}>
    <Box
      as="button"
      onClick={onClick}
      w={{ base: "40px", md: "48px" }}
      h={{ base: "40px", md: "48px" }}
      borderRadius="full"
      border={selected ? `2px solid ${tcmTxt}` : "1.5px solid rgba(255,255,255,0.2)"}
      bg={selected ? "rgba(107,4,4,0.65)" : "rgba(255,255,255,0.05)"}
      color={selected ? tcmTxt : "rgba(255,255,255,0.45)"}
      fontSize={{ base: "md", md: "lg" }}
      fontWeight="700"
      fontFamily="'EB Garamond', serif"
      cursor="pointer"
      transition="all 0.18s"
      boxShadow={selected ? "0 0 14px rgba(218,113,113,0.35)" : "none"}
      _hover={{
        bg: "rgba(107,4,4,0.45)",
        borderColor: "rgba(218,113,113,0.65)",
        color: tcmTxt,
        boxShadow: "0 0 10px rgba(218,113,113,0.2)",
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {val}
    </Box>
    <Text
      color={selected ? tcmTxt : "rgba(255,255,255,0.28)"}
      fontSize="7px"
      letterSpacing="0.03em"
      textAlign="center"
      maxW="50px"
      lineHeight="1.3"
      display={{ base: "none", md: "block" }}
      transition="color 0.18s"
    >
      {SCALE_LABELS[val]}
    </Text>
  </Flex>
);

const ElementoSection = ({
  el,
  respuestas,
  onAnswer,
}: {
  el: typeof ELEMENTOS[0];
  respuestas: (number | null)[];
  onAnswer: (qi: number, val: number) => void;
}) => {
  const total = respuestas.reduce((s, a) => s + (a ?? 0), 0);
  const answered = respuestas.filter((a) => a !== null).length;
  const complete = answered === 8;

  return (
    <Box
      w="100%"
      maxW="820px"
      bg="rgba(107,4,4,0.28)"
      border={`1px solid ${complete ? "rgba(218,113,113,0.32)" : "rgba(218,113,113,0.15)"}`}
      borderRadius="2xl"
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      mb={4}
      transition="border-color 0.3s"
    >
      {/* Cabecera */}
      <Flex align="baseline" gap={3} mb={2}>
        <Text
          color="rgba(218,113,113,0.45)"
          fontSize="sm"
          letterSpacing="0.28em"
          textTransform="uppercase"
          flexShrink={0}
        >
          {el.numero}
        </Text>
        <Text
          color={tcmTxt}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.1em"
        >
          {el.nombre}
        </Text>
      </Flex>

      <Text
        color="rgba(255,255,255,0.42)"
        fontSize="sm"
        letterSpacing="0.12em"
        textTransform="uppercase"
        mb={4}
      >
        {el.dominio}
      </Text>

      <Divider />

      {/* Preguntas */}
      <Flex direction="column" gap={7}>
        {el.preguntas.map((pregunta, qi) => (
          <Box key={qi}>
            <Text
              color={tcmTxt}
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.02em"
              lineHeight="1.75"
              mb={3}
            >
              {qi + 1}. {pregunta}
            </Text>
            <Flex gap={{ base: 2, md: 4 }} align="flex-start" flexWrap="wrap">
              {[0, 1, 2, 3].map((v) => (
                <ScaleBtn
                  key={v}
                  val={v}
                  selected={respuestas[qi] === v}
                  onClick={() => onAnswer(qi, v)}
                />
              ))}
              <Box display={{ base: "flex", md: "none" }} alignItems="center" pl={1} pt={3}>
                <Text color="rgba(255,255,255,0.25)" fontSize="9px" fontStyle="italic">
                  0 = No me describe · 3 = Muy característico
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      <Divider />

      {/* Puntuación parcial */}
      <Flex align="center" justify="space-between">
        <Text color="rgba(255,255,255,0.35)" fontSize="xs" letterSpacing="0.12em" textTransform="uppercase">
          Subtotal {el.nombre}
        </Text>
        <Flex align="center" gap={2}>
          <Text
            color={complete ? tcmTxt : "rgba(255,255,255,0.22)"}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            transition="color 0.3s"
            textShadow={complete ? "0 0 12px rgba(218,113,113,0.4)" : "none"}
          >
            {total}
          </Text>
          <Text color="rgba(255,255,255,0.28)" fontSize="sm">/ 24</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMTest2() {
  const [answers, setAnswers] = useState<(number | null)[][]>(
    ELEMENTOS.map(() => Array(8).fill(null))
  );
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const totals = ELEMENTOS.map((_e, ei) =>
    answers[ei].reduce((s: number, a) => s + (a ?? 0), 0)
  );

  const totalAnswered = answers.flat().filter((a) => a !== null).length;
  const allAnswered = answers.every((group) => group.filter((a) => a !== null).length === 8);

  const handleAnswer = (ei: number, qi: number, val: number) => {
    setAnswers((prev) => {
      const next = prev.map((r) => [...r]);
      next[ei][qi] = val;
      return next;
    });
  };

  const handleShowResults = () => {
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const maxTotal = Math.max(...totals);
  const sortedIdx = [...totals.map((t, i) => ({ t, i }))].sort((a, b) => b.t - a.t);

  const handleSaveResult = () => {
    const primaryIdx = totals.indexOf(maxTotal);
    const result = {
      date: new Date().toISOString().split("T")[0],
      primaryElemento: ELEMENTOS[primaryIdx]?.nombre,
      scores: ELEMENTOS.map((e, i) => ({
        nombre: e.nombre,
        score: totals[i],
        max: 24,
      })),
    };
    localStorage.setItem("tcm_test2_result", JSON.stringify(result));
    setSaved(true);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg={tcmBg}
      fontFamily="'EB Garamond', serif"
    >
      <Flex justify="center" w="100%">
        <DisciplineHeader
          icon={<TCMIcon size={{ base: "36px", md: "52px" }} />}
          title="Tu elemento predominante"
          bgColor="rgba(107,4,4,0.6)"
          color={tcmTxt}
          maxW="820px"
        />
      </Flex>

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 4, md: 10, lg: 16 }}
          pt={{ base: 8, md: 10 }}
          pb={{ base: 14, md: 20 }}
        >
          {/* ── INTRO ── */}
          <Box
            w="100%"
            maxW="820px"
            bg="rgba(107,4,4,0.38)"
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 5, md: 7 }}
            mb={8}
          >
            <Text color={tcmTxt} fontSize="sm" fontWeight="700" letterSpacing="0.2em" textTransform="uppercase" mb={3}>
              Cuestionario I · Terreno Constitucional
            </Text>
            <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" mb={5}>
              Evaluación de Tendencia Energética Base según los Cinco Movimientos.
              Responde según cómo ha sido la mayor parte de tu vida adulta, no según el estado actual.
            </Text>
            <Flex gap={{ base: 3, md: 6 }} flexWrap="wrap">
              {SCALE_LABELS.map((label, i) => (
                <Flex key={i} align="center" gap={2}>
                  <Box
                    w="26px" h="26px" borderRadius="full"
                    border="1.5px solid rgba(218,113,113,0.45)"
                    display="flex" alignItems="center" justifyContent="center"
                    bg="rgba(107,4,4,0.4)"
                    flexShrink={0}
                  >
                    <Text color={tcmTxt} fontSize="xs" fontWeight="700">{i}</Text>
                  </Box>
                  <Text color="rgba(255,255,255,0.65)" fontSize={{ base: "xs", md: "sm" }}>{label}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* ── SECCIONES ── */}
          {ELEMENTOS.map((el, ei) => (
            <ElementoSection
              key={ei}
              el={el}
              respuestas={answers[ei]}
              onAnswer={(qi, val) => handleAnswer(ei, qi, val)}
            />
          ))}

          {/* ── BOTÓN ── */}
          <Box w="100%" maxW="820px" textAlign="center" mt={6}>
            {!allAnswered && (
              <Text color="rgba(255,255,255,0.35)" fontSize="xs" letterSpacing="0.08em" fontStyle="italic" mb={4}>
                Responde todas las preguntas para ver los resultados ({totalAnswered} / 40)
              </Text>
            )}
            <Box
              as="button"
              onClick={allAnswered ? handleShowResults : undefined}
              px={10} py={4}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.1em"
              border={`1.5px solid ${allAnswered ? "rgba(218,113,113,0.6)" : "rgba(218,113,113,0.18)"}`}
              bg={allAnswered ? "rgba(107,4,4,0.58)" : "rgba(107,4,4,0.2)"}
              color={allAnswered ? "white" : "rgba(255,255,255,0.25)"}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.22s"
              boxShadow={allAnswered ? "0 0 20px rgba(218,113,113,0.15)" : "none"}
              _hover={allAnswered ? { bg: "rgba(107,4,4,0.8)", borderColor: tcmTxt, boxShadow: "0 0 32px rgba(218,113,113,0.3)" } : {}}
            >
              Ver mis resultados
            </Box>
          </Box>

          {/* ── RESULTADOS ── */}
          {showResults && (
            <Box ref={resultsRef} w="100%" maxW="820px" mt={12}>

              {/* Puntuaciones */}
              <Box
                bg="rgba(107,4,4,0.42)"
                border="1px solid rgba(218,113,113,0.28)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
                mb={5}
              >
                <Text color={tcmTxt} fontSize="xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase" mb={7} textAlign="center">
                  Tus Resultados
                </Text>

                <Flex direction="column" gap={4}>
                  {ELEMENTOS.map((el, ei) => {
                    const isMax = totals[ei] === maxTotal && maxTotal > 0;
                    const pct = Math.round(((totals[ei] ?? 0) / 24) * 100);
                    return (
                      <Box key={ei}>
                        <Flex align="center" justify="space-between" mb={2}>
                          <Flex align="center" gap={2}>
                            <Text
                              color={isMax ? "white" : "rgba(255,255,255,0.65)"}
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={isMax ? "600" : "400"}
                              letterSpacing="0.06em"
                              textShadow={isMax ? "0 0 12px rgba(255,255,255,0.2)" : "none"}
                            >
                              {el.nombre}
                            </Text>
                            {isMax && (
                              <Box
                                bg="rgba(107,4,4,0.6)"
                                border="1px solid rgba(218,113,113,0.5)"
                                borderRadius="full"
                                px={2.5} py={0.5}
                                boxShadow="0 0 10px rgba(218,113,113,0.2)"
                              >
                                <Text color={tcmTxt} fontSize="9px" fontWeight="700" letterSpacing="0.16em">
                                  PREDOMINANTE
                                </Text>
                              </Box>
                            )}
                          </Flex>
                          <Text
                            color={isMax ? tcmTxt : "rgba(255,255,255,0.4)"}
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight="700"
                            textShadow={isMax ? "0 0 12px rgba(218,113,113,0.4)" : "none"}
                          >
                            {totals[ei]}
                            <Text as="span" fontSize="sm" fontWeight="400" color="rgba(255,255,255,0.25)"> / 24</Text>
                          </Text>
                        </Flex>
                        <Box w="100%" h="5px" borderRadius="full" bg="rgba(255,255,255,0.07)">
                          <Box
                            h="100%" borderRadius="full"
                            bg={isMax ? tcmTxt : "rgba(218,113,113,0.35)"}
                            boxShadow={isMax ? "0 0 8px rgba(218,113,113,0.5)" : "none"}
                            w={`${pct}%`}
                            transition="width 0.9s ease"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Flex>

                {/* Nota de interpretación */}
                {maxTotal > 0 && (
                  <Box mt={7} p={5} bg="rgba(0,0,0,0.18)" borderRadius="xl" border="1px solid rgba(218,113,113,0.14)">
                    <Flex direction="column" gap={1.5}>
                      <Text color="rgba(255,255,255,0.48)" fontSize="xs" fontStyle="italic" lineHeight="1.9">
                        El mayor puntaje indica tu terreno constitucional predominante.
                        El segundo puntaje corresponde al movimiento de soporte.
                        {sortedIdx.length >= 2 && sortedIdx[0] && sortedIdx[1] && Math.abs((sortedIdx[0].t ?? 0) - (sortedIdx[1].t ?? 0)) < 3 && (
                          " La diferencia menor a 3 puntos entre los dos primeros sugiere constitución mixta."
                        )}
                      </Text>
                      <Text color="rgba(255,255,255,0.35)" fontSize="xs" fontStyle="italic">
                        Esta lectura se alinea con los principios del Huangdi Neijing respecto a la diferenciación del terreno energético.
                      </Text>
                    </Flex>
                  </Box>
                )}

                {/* Guardar */}
                <Flex justify="center" mt={8}>
                  {saved ? (
                    <Flex direction="column" align="center" gap={2}>
                      <Text color="rgba(218,113,113,0.85)" fontSize="sm" letterSpacing="0.08em" fontWeight="600">
                        Resultado guardado en tu espacio
                      </Text>
                      <Text color="rgba(255,255,255,0.35)" fontSize="xs" fontStyle="italic">
                        Puedes consultarlo en cualquier momento desde tu espacio TCM
                      </Text>
                    </Flex>
                  ) : (
                    <Box
                      as="button"
                      onClick={handleSaveResult}
                      px={8} py={3}
                      borderRadius="full"
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="600"
                      letterSpacing="0.1em"
                      border="1.5px solid rgba(218,113,113,0.5)"
                      bg="rgba(107,4,4,0.42)"
                      color="rgba(255,255,255,0.88)"
                      cursor="pointer"
                      transition="all 0.22s"
                      _hover={{ bg: "rgba(107,4,4,0.7)", borderColor: tcmTxt, boxShadow: "0 0 24px rgba(218,113,113,0.28)" }}
                    >
                      Guardar resultado en mi espacio
                    </Box>
                  )}
                </Flex>
              </Box>

              {/* Interpretación */}
              <Box
                bg="rgba(107,4,4,0.32)"
                border="1px solid rgba(218,113,113,0.2)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
              >
                <Text color={tcmTxt} fontSize="xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase" mb={6} textAlign="center">
                  Interpretación Constitucional
                </Text>
                <Flex direction="column" gap={3}>
                  {INTERPRETACIONES.map((interp, i) => {
                    const isMax = totals[i] === maxTotal && maxTotal > 0;
                    return (
                      <Box
                        key={i}
                        p={{ base: 4, md: 5 }}
                        bg={isMax ? "rgba(107,4,4,0.55)" : "rgba(255,255,255,0.03)"}
                        border={`1px solid ${isMax ? "rgba(218,113,113,0.42)" : "rgba(255,255,255,0.07)"}`}
                        borderRadius="xl"
                        boxShadow={isMax ? "0 0 20px rgba(218,113,113,0.18)" : "none"}
                        transition="all 0.35s"
                      >
                        <Flex align="center" gap={3} mb={isMax ? 2 : 0}>
                          <Text
                            color={isMax ? "white" : "rgba(255,255,255,0.6)"}
                            fontWeight={isMax ? "600" : "400"}
                            fontSize={{ base: "sm", md: "md" }}
                            letterSpacing="0.08em"
                          >
                            {interp.nombre}
                          </Text>
                          {isMax && (
                            <Text color="rgba(218,113,113,0.75)" fontSize="9px" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
                              · Tu Terreno
                            </Text>
                          )}
                        </Flex>
                        {isMax && (
                          <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.85">
                            {interp.descripcion}
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>

      <Box as="footer" borderTop="1px solid rgba(255,255,255,0.1)" px={{ base: 6, md: 16 }} py={{ base: 8, md: 10 }}>
        <Text color="rgba(255,255,255,0.38)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
