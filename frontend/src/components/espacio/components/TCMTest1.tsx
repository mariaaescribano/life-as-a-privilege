import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SiteHeader from "../../global/SiteHeader";
import { tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
const SCALE_LABELS = ["Nunca / Rara vez", "A veces", "Frecuentemente / Siempre"];

const CONSTITUCIONES = [
  {
    nombre: "Equilibrado",
    numero: "1",
    subtitulo: "Balanced · Constitución Armónica",
    descripcion: "Energía estable durante el día, buen descanso y digestión regular. Ausencia de desequilibrios frecuentes.",
    preguntas: [
      "Me siento con energía estable durante todo el día.",
      "Duermo bien y me despierto descansado(a).",
      "Mi digestión es buena y regular.",
      "No tengo problemas frecuentes de frío, calor, cansancio o emociones extremas.",
    ],
  },
  {
    nombre: "Deficiencia de Qi",
    numero: "2",
    subtitulo: "Qi Deficiency",
    descripcion: "Fatiga fácil, voz débil, tendencia a resfriados frecuentes y sudoración espontánea sin calor.",
    preguntas: [
      "Me canso fácilmente con actividad física o mental.",
      "Tengo voz baja o débil.",
      "Me resfrío con frecuencia.",
      "Sudor espontáneo incluso sin calor.",
      "Palidez en la cara o lengua.",
    ],
  },
  {
    nombre: "Deficiencia de Yang",
    numero: "3",
    subtitulo: "Yang Deficiency",
    descripcion: "Frialdad en extremidades, cansancio profundo incluso en reposo, orina clara y abundante, edemas matutinos.",
    preguntas: [
      "Siento frío en manos y pies, especialmente en invierno.",
      "Me canso fácilmente, incluso en reposo.",
      "Orino claro y abundante.",
      "Hinchazón en piernas o párpados por la mañana.",
      "Lengua pálida y húmeda.",
    ],
  },
  {
    nombre: "Deficiencia de Yin",
    numero: "4",
    subtitulo: "Yin Deficiency",
    descripcion: "Calor interno, sudor nocturno, sequedad en boca o garganta, palpitaciones y agitación emocional.",
    preguntas: [
      "Tengo sensación de calor interno, sudor nocturno o manos y pies calientes.",
      "Boca o garganta seca.",
      "Palpitaciones o insomnio.",
      "Lengua roja sin capa o con grietas.",
      "Emociones inestables, ansiedad o inquietud.",
    ],
  },
  {
    nombre: "Flema-Humedad",
    numero: "5",
    subtitulo: "Phlegm-Damp",
    descripcion: "Pesadez corporal y mental, exceso de mucosidad, digestión lenta y tendencia a retención de líquidos.",
    preguntas: [
      "Me siento pesado(a) o lento(a) después de comer.",
      "Tengo exceso de mucosidad, resfriados frecuentes o congestión.",
      "Digestión lenta, sensación de hinchazón o gases.",
      "Obesidad o tendencia a retención de líquidos.",
      "Lengua hinchada con capa blanca y pegajosa.",
    ],
  },
  {
    nombre: "Calor-Humedad",
    numero: "6",
    subtitulo: "Damp-Heat",
    descripcion: "Calor interno con sudoración o enrojecimiento, problemas digestivos e inflamaciones frecuentes.",
    preguntas: [
      "Siento calor interno acompañado de sudoración o enrojecimiento.",
      "Problemas digestivos con acidez o diarrea.",
      "Acné, inflamación o infecciones frecuentes.",
      "Orina amarilla o sensación de calor en el cuerpo.",
      "Lengua amarilla, húmeda o pegajosa.",
    ],
  },
  {
    nombre: "Estancamiento de Qi",
    numero: "7",
    subtitulo: "Qi Stagnation",
    descripcion: "Tensión emocional, dolor por presión en costados o abdomen, digestión irregular y cambios de humor.",
    preguntas: [
      "Me siento tenso(a), irritado(a) o frustrado(a) con facilidad.",
      "Dolor o presión en pecho, abdomen o costados.",
      "Digestión irregular, gases o sensación de plenitud.",
      "Cambios de humor repentinos.",
      "Movimientos intestinales irregulares.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Equilibrado",
    descripcion: "Tu cuerpo está en buena armonía. Mantén tus hábitos de vida y sigue escuchando tu cuerpo con regularidad.",
  },
  {
    nombre: "Deficiencia de Qi",
    descripcion: "El Qi (energía vital) está disminuido. Descansa más, come caliente y nutritivo, y evita el sobreesfuerzo físico y mental.",
  },
  {
    nombre: "Deficiencia de Yang",
    descripcion: "El Yang (fuerza calórica) está débil. Abrígate, prioriza alimentos calientes, y evita crudos, frío y humedad.",
  },
  {
    nombre: "Deficiencia de Yin",
    descripcion: "El Yin (fluidos y refrigeración interna) está disminuido. Descansa, hidrátate, reduce el estrés y evita los picantes.",
  },
  {
    nombre: "Flema-Humedad",
    descripcion: "Hay exceso de Humedad interna. Evita lácteos y azúcares refinados, muévete a diario y come ligero y caliente.",
  },
  {
    nombre: "Calor-Humedad",
    descripcion: "Hay Calor y Humedad acumulados. Evita frituras, alcohol y picantes; come fresco, ligero y reduce el estrés.",
  },
  {
    nombre: "Estancamiento de Qi",
    descripcion: "El Qi está bloqueado. Muévete con regularidad, expresa tus emociones, practica respiración consciente y evita el sedentarismo.",
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
      w={{ base: "44px", md: "52px" }}
      h={{ base: "44px", md: "52px" }}
      borderRadius="full"
      border={selected ? `2px solid ${tcmTxt}` : "1.5px solid rgba(255,255,255,0.2)"}
      bg={selected ? "rgba(107,4,4,0.65)" : "rgba(255,255,255,0.05)"}
      color={selected ? tcmTxt : "rgba(255,255,255,0.45)"}
      fontSize={{ base: "lg", md: "xl" }}
      fontWeight="700"
      fontFamily="'EB Garamond', serif"
      cursor="pointer"
      transition="all 0.18s"
      boxShadow={selected ? "0 0 14px rgba(218,113,113,0.35), 0 0 4px rgba(218,113,113,0.2)" : "none"}
      _hover={{
        bg: "rgba(107,4,4,0.45)",
        borderColor: `rgba(218,113,113,0.65)`,
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
      fontSize="8px"
      letterSpacing="0.04em"
      textAlign="center"
      maxW="54px"
      lineHeight="1.3"
      display={{ base: "none", md: "block" }}
      transition="color 0.18s"
    >
      {SCALE_LABELS[val]}
    </Text>
  </Flex>
);

const ConstitucionSection = ({
  el,
  respuestas,
  onAnswer,
}: {
  el: typeof CONSTITUCIONES[0];
  respuestas: (number | null)[];
  onAnswer: (qi: number, val: number) => void;
}) => {
  const numPreguntas = el.preguntas.length;
  const maxScore = numPreguntas * 2;
  const total = respuestas.reduce((s, a) => s + (a ?? 0), 0);
  const answered = respuestas.filter((a) => a !== null).length;
  const complete = answered === numPreguntas;

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
        color="rgba(255,255,255,0.55)"
        fontSize={{ base: "sm", md: "md" }}
        letterSpacing="0.02em"
        fontStyle="italic"
        mb={4}
        lineHeight="1.7"
      >
        {el.descripcion}
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
            <Flex gap={{ base: 3, md: 5 }} align="flex-start" flexWrap="wrap">
              {[0, 1, 2].map((v) => (
                <ScaleBtn
                  key={v}
                  val={v}
                  selected={respuestas[qi] === v}
                  onClick={() => onAnswer(qi, v)}
                />
              ))}
              <Box display={{ base: "flex", md: "none" }} alignItems="center" pl={1} pt={3}>
                <Text color="rgba(255,255,255,0.25)" fontSize="9px" letterSpacing="0.04em" fontStyle="italic">
                  0 = Nunca · 2 = Siempre
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
          Suma {el.nombre}
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
          <Text color="rgba(255,255,255,0.28)" fontSize="sm">/ {maxScore}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMTest1() {
  const [answers, setAnswers] = useState<(number | null)[][]>(
    CONSTITUCIONES.map((c) => c.preguntas.map(() => null))
  );
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const totals = CONSTITUCIONES.map((_c, ci) =>
    answers[ci].reduce((s, a) => s + (a ?? 0), 0)
  );

  const totalAnswered = answers.flat().filter((a) => a !== null).length;
  const totalQuestions = CONSTITUCIONES.reduce((s, c) => s + c.preguntas.length, 0);
  const allAnswered = answers.every(
    (group, gi) => group.filter((a) => a !== null).length === CONSTITUCIONES[gi].preguntas.length
  );

  const handleAnswer = (ci: number, qi: number, val: number) => {
    setAnswers((prev) => {
      const next = prev.map((r) => [...r]);
      next[ci][qi] = val;
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

  const handleSaveResult = () => {
    const primaryIdx = totals.indexOf(maxTotal);
    const result = {
      date: new Date().toISOString().split("T")[0],
      primaryConstitution: CONSTITUCIONES[primaryIdx].nombre,
      scores: CONSTITUCIONES.map((c, i) => ({
        nombre: c.nombre,
        score: totals[i],
        max: c.preguntas.length * 2,
      })),
    };
    localStorage.setItem("tcm_test1_result", JSON.stringify(result));
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
      {/* ── HEADER ── */}
      <Flex justify="center" w="100%">
        <DisciplineHeader
          icon={<TCMIcon size={{ base: "36px", md: "52px" }} />}
          title="Conoce tu constitución"
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
          {/* ── INSTRUCCIONES ── */}
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
            <Text
              color={tcmTxt}
              fontSize="sm"
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mb={4}
            >
              Instrucciones
            </Text>
            <Text
              color="rgba(255,255,255,0.75)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              mb={5}
            >
              Responde cada afirmación eligiendo la opción que mejor te describa en este momento de tu vida.
              Suma los puntos de cada patrón: el que mayor puntaje obtenga indica tu constitución predominante.
            </Text>
            <Flex gap={{ base: 4, md: 8 }} flexWrap="wrap">
              {SCALE_LABELS.map((label, i) => (
                <Flex key={i} align="center" gap={2}>
                  <Box
                    w="28px" h="28px" borderRadius="full"
                    border="1.5px solid rgba(218,113,113,0.45)"
                    display="flex" alignItems="center" justifyContent="center"
                    bg="rgba(107,4,4,0.4)"
                    flexShrink={0}
                  >
                    <Text color={tcmTxt} fontSize="sm" fontWeight="700">{i}</Text>
                  </Box>
                  <Text color="rgba(255,255,255,0.68)" fontSize={{ base: "xs", md: "sm" }}>
                    {label}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Text
              color="rgba(255,255,255,0.35)"
              fontSize="xs"
              fontStyle="italic"
              mt={5}
              letterSpacing="0.03em"
            >
              Los resultados son orientativos, no diagnósticos.
              Si hay empates, puede indicar constituciones mixtas, lo cual es muy común.
            </Text>
          </Box>

          {/* ── SECCIONES ── */}
          {CONSTITUCIONES.map((c, ci) => (
            <ConstitucionSection
              key={ci}
              el={c}
              respuestas={answers[ci]}
              onAnswer={(qi, val) => handleAnswer(ci, qi, val)}
            />
          ))}

          {/* ── BOTÓN VER RESULTADOS ── */}
          <Box w="100%" maxW="820px" textAlign="center" mt={6}>
            {!allAnswered && (
              <Text
                color="rgba(255,255,255,0.35)"
                fontSize="xs"
                letterSpacing="0.08em"
                fontStyle="italic"
                mb={4}
              >
                Responde todas las preguntas para ver los resultados
                ({totalAnswered} / {totalQuestions})
              </Text>
            )}
            <Box
              as="button"
              onClick={allAnswered ? handleShowResults : undefined}
              px={10}
              py={4}
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
              _hover={allAnswered ? {
                bg: "rgba(107,4,4,0.8)",
                borderColor: tcmTxt,
                boxShadow: "0 0 32px rgba(218,113,113,0.3)",
              } : {}}
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
                <Text
                  color={tcmTxt}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.22em"
                  textTransform="uppercase"
                  mb={7}
                  textAlign="center"
                >
                  Tus Resultados
                </Text>

                <Flex direction="column" gap={4}>
                  {CONSTITUCIONES.map((c, ci) => {
                    const isMax = totals[ci] === maxTotal && maxTotal > 0;
                    const maxPossible = c.preguntas.length * 2;
                    const pct = Math.round(((totals[ci] ?? 0) / maxPossible) * 100);
                    return (
                      <Box key={ci}>
                        <Flex align="center" justify="space-between" mb={2}>
                          <Flex align="center" gap={2}>
                            <Text
                              color={isMax ? "white" : "rgba(255,255,255,0.65)"}
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={isMax ? "600" : "400"}
                              letterSpacing="0.06em"
                              transition="all 0.3s"
                              textShadow={isMax ? "0 0 12px rgba(255,255,255,0.2)" : "none"}
                            >
                              {c.nombre}
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
                            transition="all 0.3s"
                          >
                            {totals[ci]}
                            <Text as="span" fontSize="sm" fontWeight="400" color="rgba(255,255,255,0.25)">
                              {" "}/ {maxPossible}
                            </Text>
                          </Text>
                        </Flex>
                        <Box w="100%" h="5px" borderRadius="full" bg="rgba(255,255,255,0.07)">
                          <Box
                            h="100%"
                            borderRadius="full"
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

                {maxTotal > 0 && (
                  <Box mt={7} p={5} bg="rgba(0,0,0,0.18)" borderRadius="xl" border="1px solid rgba(218,113,113,0.14)">
                    <Text
                      color="rgba(255,255,255,0.48)"
                      fontSize="xs"
                      fontStyle="italic"
                      letterSpacing="0.03em"
                      lineHeight="1.9"
                    >
                      El patrón con mayor puntaje indica tu constitución predominante.
                      Si hay empates, puede indicar constituciones mixtas, lo cual es muy común.
                      Si el patrón Equilibrado es el más alto, tu cuerpo está en buena armonía.
                      Estos resultados son orientativos: úsalos como punto de partida para la reflexión, no como diagnóstico.
                    </Text>
                  </Box>
                )}

                {/* ── GUARDAR RESULTADO ── */}
                <Flex justify="center" mt={8}>
                  {saved ? (
                    <Flex align="center" gap={2} direction="column">
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
                      px={8}
                      py={3}
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
                      _hover={{
                        bg: "rgba(107,4,4,0.7)",
                        borderColor: tcmTxt,
                        boxShadow: "0 0 24px rgba(218,113,113,0.28)",
                      }}
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
                <Text
                  color={tcmTxt}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.22em"
                  textTransform="uppercase"
                  mb={6}
                  textAlign="center"
                >
                  Interpretación Orientativa
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
                        boxShadow={isMax ? "0 0 20px rgba(218,113,113,0.18), 0 2px 12px rgba(0,0,0,0.2)" : "none"}
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
                            <Text
                              color="rgba(218,113,113,0.75)"
                              fontSize="9px"
                              fontWeight="700"
                              letterSpacing="0.16em"
                              textTransform="uppercase"
                            >
                              · Tu Constitución
                            </Text>
                          )}
                        </Flex>
                        {isMax && (
                          <Text
                            color="rgba(255,255,255,0.72)"
                            fontSize={{ base: "xs", md: "sm" }}
                            lineHeight="1.85"
                          >
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

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.1)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.38)"
          fontSize="xs"
          letterSpacing="0.05em"
          textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
