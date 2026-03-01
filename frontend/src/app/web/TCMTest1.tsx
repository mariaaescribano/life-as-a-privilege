import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { tcmBg, tcmTxt } from "../../GlobalVariables";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
const SCALE_LABELS = ["Nunca", "A veces", "Frecuentemente", "Muy cierto"];

const ELEMENTOS = [
  {
    emoji: "🌿",
    nombre: "MADERA",
    numero: "1",
    subtitulo: "Hígado / Vesícula Biliar",
    descripcion:
      "Emociones: ira, frustración, visión, creatividad, tensión física en músculos y tendones.",
    acento: "#6aaa40",
    preguntas: [
      "Me frustro fácilmente cuando algo me bloquea.",
      "Me siento tenso(a) o rígido(a) en cuello, hombros o espalda.",
      "Tengo cambios de humor repentinos o me irrito con facilidad.",
      "Me siento inquieto(a) si no avanzo en mis metas.",
      "Experimento dolor de cabeza, migraña o fatiga ocular.",
      "Me cuesta tomar decisiones o liderar proyectos.",
      "Tengo problemas digestivos relacionados con estrés (acidez, gases).",
      "Me cuesta dormir cuando estoy preocupado(a) por el futuro.",
    ],
  },
  {
    emoji: "🔥",
    nombre: "FUEGO",
    numero: "2",
    subtitulo: "Corazón / Intestino Delgado",
    descripcion:
      "Emociones: alegría, pasión, entusiasmo, comunicación, sueño, corazón.",
    acento: "#e05c3a",
    preguntas: [
      "Me cuesta dormir o tengo sueños inquietos.",
      "Mi corazón late rápido o siento palpitaciones sin razón.",
      "Me emociono o me altero con facilidad.",
      "Disfruto ser social y compartir ideas, pero me siento agotado(a) emocionalmente.",
      "Me siento ansioso(a) cuando estoy solo(a) o sin contacto emocional.",
      "Me ruborizo o sudo con facilidad.",
      "Me cuesta manejar emociones intensas en relaciones.",
      "Mi lengua se ve roja o con signos de calor.",
    ],
  },
  {
    emoji: "🌾",
    nombre: "TIERRA",
    numero: "3",
    subtitulo: "Bazo / Estómago",
    descripcion:
      "Emociones: preocupación, nutrición, estabilidad, digestión, cuidado de otros.",
    acento: "#c8960a",
    preguntas: [
      "Me preocupo o pienso demasiado sobre situaciones cotidianas.",
      "Siento pesadez o inflamación después de comer.",
      "Busco alimentos reconfortantes (especialmente dulces).",
      "Me siento agotado(a) después de cuidar de otros.",
      "Me cuesta mantener rutina o concentración cuando estoy estresado(a).",
      "Aumento de peso con facilidad al estar ansioso(a) o estresado(a).",
      "Mi digestión empeora con el estrés o emociones fuertes.",
      "Me gusta sentirme seguro(a) y con rutina diaria.",
    ],
  },
  {
    emoji: "⚪",
    nombre: "METAL",
    numero: "4",
    subtitulo: "Pulmón / Intestino Grueso",
    descripcion:
      "Emociones: tristeza, disciplina, orden, limpieza, respiración.",
    acento: "#aaaaaa",
    preguntas: [
      "Me cuesta dejar ir resentimientos o emociones pasadas.",
      "Me siento triste o melancólico(a) sin motivo aparente.",
      "Tengo tos frecuente, congestión o problemas respiratorios leves.",
      "Me preocupo por la limpieza, el orden o la estructura en mi entorno.",
      "Me cuesta expresar mis emociones abiertamente.",
      "Me siento rígido(a) ante cambios o incertidumbre.",
      "Tengo piel seca o sensible.",
      "Siento tensión en el pecho o falta de aire al estresarme.",
    ],
  },
  {
    emoji: "🌊",
    nombre: "AGUA",
    numero: "5",
    subtitulo: "Riñón / Vejiga",
    descripcion:
      "Emociones: miedo, seguridad, voluntad, vitalidad, descanso.",
    acento: "#3a78c4",
    preguntas: [
      "Siento miedo o inseguridad con frecuencia.",
      "Me preocupa la salud, el envejecimiento o el futuro.",
      "Siento cansancio matutino o falta de energía para comenzar el día.",
      "Dolor o debilidad en zona lumbar o rodillas.",
      "Prefiero estar en silencio o tiempo a solas.",
      "Me cuesta confiar plenamente en otras personas.",
      "Siento frío con facilidad o necesito abrigarme constantemente.",
      "Mi sueño se ve afectado por ansiedad o preocupaciones profundas.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Madera", emoji: "🌿",
    desequilibrio: "Ira, frustración, tensión muscular, migrañas, dificultad para avanzar",
    sintomas: "Estrés, rigidez física, irritabilidad",
    acento: "#6aaa40",
  },
  {
    nombre: "Fuego", emoji: "🔥",
    desequilibrio: "Ansiedad, insomnio, palpitaciones, excitabilidad",
    sintomas: "Sueño interrumpido, emociones intensas, calor interno",
    acento: "#e05c3a",
  },
  {
    nombre: "Tierra", emoji: "🌾",
    desequilibrio: "Preocupación, digestión débil, fatiga por cuidar a otros",
    sintomas: "Pesadez, digestión lenta, ansiedad por rutina",
    acento: "#c8960a",
  },
  {
    nombre: "Metal", emoji: "⚪",
    desequilibrio: "Tristeza, dificultad para soltar, rigidez",
    sintomas: "Respiración superficial, tos, melancolía",
    acento: "#aaaaaa",
  },
  {
    nombre: "Agua", emoji: "🌊",
    desequilibrio: "Miedo, inseguridad, debilidad física",
    sintomas: "Dolor lumbar, cansancio, ansiedad profunda",
    acento: "#3a78c4",
  },
];

/* ══════════════════════════════════════════════
   COMPONENTES
══════════════════════════════════════════════ */

/* Divisor elegante */
const Divider = ({ color }: { color: string }) => (
  <Flex align="center" gap={3} my={5} mx={0}>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
    <Box w="5px" h="5px" borderRadius="full" bg={color} opacity={0.45} />
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
  </Flex>
);

/* Botón de escala (0-3) */
const ScaleBtn = ({
  val,
  selected,
  acento,
  onClick,
}: {
  val: number;
  selected: boolean;
  acento: string;
  onClick: () => void;
}) => (
  <Flex direction="column" align="center" gap={1}>
    <Box
      as="button"
      onClick={onClick}
      w={{ base: "44px", md: "50px" }}
      h={{ base: "44px", md: "50px" }}
      borderRadius="full"
      border={selected ? `2px solid ${acento}` : "1.5px solid rgba(255,255,255,0.22)"}
      bg={selected ? `${acento}30` : "rgba(255,255,255,0.06)"}
      color={selected ? acento : "rgba(255,255,255,0.55)"}
      fontSize={{ base: "lg", md: "xl" }}
      fontWeight="700"
      fontFamily="'EB Garamond', serif"
      cursor="pointer"
      transition="all 0.18s"
      _hover={{
        bg: `${acento}22`,
        borderColor: acento,
        color: acento,
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {val}
    </Box>
    <Text
      color={selected ? acento : "rgba(255,255,255,0.3)"}
      fontSize="9px"
      letterSpacing="0.06em"
      textAlign="center"
      maxW="48px"
      lineHeight="1.3"
      display={{ base: "none", md: "block" }}
      transition="color 0.18s"
    >
      {SCALE_LABELS[val]}
    </Text>
  </Flex>
);

/* Sección de un elemento */
const ElementoSection = ({
  el,
  index,
  respuestas,
  onAnswer,
}: {
  el: typeof ELEMENTOS[0];
  index: number;
  respuestas: (number | null)[];
  onAnswer: (qi: number, val: number) => void;
}) => {
  const total = respuestas.reduce((s, a) => s + (a ?? 0), 0);
  const answered = respuestas.filter((a) => a !== null).length;

  return (
    <Box
      w="100%"
      maxW="820px"
      bg="rgba(107,4,4,0.38)"
      border="1px solid rgba(218,113,113,0.22)"
      borderRadius="2xl"
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      mb={5}
    >
      {/* Cabecera del elemento */}
      <Flex align="center" gap={3} mb={4}>
        <Text fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1">{el.emoji}</Text>
        <Box>
          <Text
            color={el.acento}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="700"
            letterSpacing="0.18em"
            textTransform="uppercase"
          >
            {el.numero}) ELEMENTO {el.nombre}
          </Text>
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" letterSpacing="0.06em" fontStyle="italic">
            {el.subtitulo}
          </Text>
        </Box>
      </Flex>

      <Text
        color="rgba(255,255,255,0.52)"
        fontSize={{ base: "xs", md: "sm" }}
        letterSpacing="0.04em"
        fontStyle="italic"
        mb={5}
      >
        {el.descripcion}
      </Text>

      <Divider color={el.acento} />

      {/* Preguntas */}
      <Flex direction="column" gap={6}>
        {el.preguntas.map((pregunta, qi) => (
          <Box key={qi}>
            <Text
              color="rgba(255,255,255,0.88)"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.02em"
              lineHeight="1.7"
              mb={3}
            >
              {qi + 1}. {pregunta}
            </Text>
            <Flex gap={{ base: 3, md: 4 }} align="flex-start">
              {[0, 1, 2, 3].map((v) => (
                <ScaleBtn
                  key={v}
                  val={v}
                  selected={respuestas[qi] === v}
                  acento={el.acento}
                  onClick={() => onAnswer(qi, v)}
                />
              ))}
              {/* Labels en mobile como leyenda horizontal */}
              <Box display={{ base: "flex", md: "none" }} align="center" pl={1} pt={2}>
                <Text color="rgba(255,255,255,0.28)" fontSize="9px" letterSpacing="0.04em" fontStyle="italic">
                  0 = Nunca · 3 = Muy cierto
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      <Divider color={el.acento} />

      {/* Total parcial */}
      <Flex align="center" justify="space-between" mt={1}>
        <Text color="rgba(255,255,255,0.4)" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase">
          Total {el.nombre}
        </Text>
        <Flex align="center" gap={2}>
          <Text
            color={answered === 8 ? el.acento : "rgba(255,255,255,0.28)"}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            transition="color 0.3s"
          >
            {total}
          </Text>
          <Text color="rgba(255,255,255,0.3)" fontSize="sm">/ 24</Text>
          {answered < 8 && (
            <Text color="rgba(255,255,255,0.28)" fontSize="10px" fontStyle="italic" ml={1}>
              ({answered}/8)
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMTest1() {
  /* answers[elementoIndex][preguntaIndex] = 0-3 | null */
  const [answers, setAnswers] = useState<(number | null)[][]>(
    ELEMENTOS.map((el) => el.preguntas.map(() => null))
  );
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const totals = ELEMENTOS.map((el, ei) =>
    answers[ei].reduce((s, a) => s + (a ?? 0), 0)
  );
  const answered = answers.map((el) => el.filter((a) => a !== null).length);
  const allAnswered = answered.every((n) => n === 8);

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

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 4, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >

          {/* ── TÍTULO ── */}
          <Box textAlign="center" mb={{ base: 8, md: 10 }} maxW="680px">
            <Text
              color="rgba(255,255,255,0.45)"
              fontSize="10px"
              letterSpacing="0.25em"
              textTransform="uppercase"
              mb={3}
            >
              Medicina Tradicional China · Test 1
            </Text>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              lineHeight="1.25"
              textShadow="0 2px 10px rgba(0,50,40,0.4)"
              mb={3}
            >
              🧠 Test Orientativo de los Cinco Elementos
            </Text>
            <Flex justify="center" gap={1} mb={5}>
              <Box w="18px" h="1px" borderRadius="full" bg={tcmTxt} opacity={0.3} />
              <Box w="36px" h="1px" borderRadius="full" bg={tcmTxt} opacity={0.6} />
              <Box w="18px" h="1px" borderRadius="full" bg={tcmTxt} opacity={0.3} />
            </Flex>
          </Box>

          {/* ── INSTRUCCIONES ── */}
          <Box
            w="100%"
            maxW="820px"
            bg="rgba(107,4,4,0.42)"
            border="1px solid rgba(218,113,113,0.28)"
            borderRadius="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 5, md: 7 }}
            mb={7}
          >
            <Text
              color={tcmTxt}
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.18em"
              textTransform="uppercase"
              mb={4}
            >
              Instrucciones
            </Text>
            <Text
              color="rgba(255,255,255,0.82)"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1.85"
              mb={4}
            >
              Responde cada afirmación con honestidad, eligiendo la opción que mejor te describa en
              este momento de tu vida:
            </Text>
            <Flex gap={{ base: 4, md: 8 }} flexWrap="wrap">
              {SCALE_LABELS.map((label, i) => (
                <Flex key={i} align="center" gap={2}>
                  <Box
                    w="28px" h="28px" borderRadius="full"
                    border="1.5px solid rgba(218,113,113,0.5)"
                    display="flex" alignItems="center" justifyContent="center"
                    bg="rgba(218,113,113,0.1)"
                    flexShrink={0}
                  >
                    <Text color={tcmTxt} fontSize="sm" fontWeight="700">{i}</Text>
                  </Box>
                  <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "xs", md: "sm" }}>
                    {label}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Text
              color="rgba(255,255,255,0.45)"
              fontSize="xs"
              fontStyle="italic"
              mt={5}
              letterSpacing="0.03em"
            >
              Al final, el elemento con mayor puntaje indica el desequilibrio predominante.
              Los resultados son orientativos, no diagnósticos.
            </Text>
          </Box>

          {/* ── SECCIONES POR ELEMENTO ── */}
          {ELEMENTOS.map((el, ei) => (
            <ElementoSection
              key={ei}
              el={el}
              index={ei}
              respuestas={answers[ei]}
              onAnswer={(qi, val) => handleAnswer(ei, qi, val)}
            />
          ))}

          {/* ── BOTÓN VER RESULTADOS ── */}
          <Box
            w="100%"
            maxW="820px"
            textAlign="center"
            mt={4}
          >
            {!allAnswered && (
              <Text
                color="rgba(255,255,255,0.38)"
                fontSize="xs"
                letterSpacing="0.08em"
                fontStyle="italic"
                mb={4}
              >
                Responde todas las preguntas para ver los resultados
                ({answers.flat().filter((a) => a !== null).length} / 40)
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
              fontWeight="700"
              letterSpacing="0.08em"
              border={`1.5px solid ${allAnswered ? "rgba(218,113,113,0.7)" : "rgba(218,113,113,0.22)"}`}
              bg={allAnswered ? "rgba(107,4,4,0.6)" : "rgba(107,4,4,0.25)"}
              color={allAnswered ? "white" : "rgba(255,255,255,0.3)"}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.22s"
              _hover={allAnswered ? {
                bg: "rgba(107,4,4,0.82)",
                borderColor: tcmTxt,
                boxShadow: "0 0 24px rgba(218,113,113,0.25)",
              } : {}}
            >
              Ver mis resultados 📊
            </Box>
          </Box>

          {/* ── RESULTADOS ── */}
          {showResults && (
            <Box
              ref={resultsRef}
              w="100%"
              maxW="820px"
              mt={10}
            >
              {/* Tarjeta de puntuaciones */}
              <Box
                bg="rgba(107,4,4,0.48)"
                border="1px solid rgba(218,113,113,0.30)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
                mb={5}
              >
                <Text
                  color={tcmTxt}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  mb={6}
                  textAlign="center"
                >
                  📊 Tus Resultados
                </Text>

                <Flex direction="column" gap={3}>
                  {ELEMENTOS.map((el, ei) => {
                    const isMax = totals[ei] === maxTotal && maxTotal > 0;
                    const pct = Math.round((totals[ei] / 24) * 100);
                    return (
                      <Box key={ei}>
                        <Flex align="center" justify="space-between" mb={1.5}>
                          <Flex align="center" gap={2}>
                            <Text fontSize="lg">{el.emoji}</Text>
                            <Text
                              color={isMax ? el.acento : "rgba(255,255,255,0.75)"}
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={isMax ? "700" : "400"}
                              letterSpacing="0.06em"
                              transition="color 0.3s"
                            >
                              {el.nombre}
                            </Text>
                            {isMax && (
                              <Box
                                bg={`${el.acento}25`}
                                border={`1px solid ${el.acento}55`}
                                borderRadius="full"
                                px={2} py={0.5}
                              >
                                <Text color={el.acento} fontSize="9px" fontWeight="700" letterSpacing="0.14em">
                                  PREDOMINANTE
                                </Text>
                              </Box>
                            )}
                          </Flex>
                          <Text
                            color={isMax ? el.acento : "rgba(255,255,255,0.55)"}
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight="700"
                          >
                            {totals[ei]}
                            <Text as="span" fontSize="sm" fontWeight="400" color="rgba(255,255,255,0.3)"> / 24</Text>
                          </Text>
                        </Flex>
                        {/* Barra de progreso */}
                        <Box
                          w="100%" h="6px" borderRadius="full"
                          bg="rgba(255,255,255,0.08)"
                        >
                          <Box
                            h="100%" borderRadius="full"
                            bg={isMax ? el.acento : `${el.acento}60`}
                            w={`${pct}%`}
                            transition="width 0.8s ease"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Flex>

                {maxTotal > 0 && (
                  <Box
                    mt={7}
                    p={5}
                    bg="rgba(0,0,0,0.2)"
                    borderRadius="xl"
                    border="1px solid rgba(218,113,113,0.18)"
                  >
                    <Text
                      color="rgba(255,255,255,0.55)"
                      fontSize="xs"
                      letterSpacing="0.08em"
                      fontStyle="italic"
                      lineHeight="1.8"
                    >
                      El elemento con mayor puntaje indica tu desequilibrio predominante actual.
                      Patrones intermedios altos pueden indicar combinaciones de desequilibrio.
                      Estos resultados son orientativos: úsalos como punto de partida para la reflexión,
                      no como diagnóstico.
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Tabla de interpretación */}
              <Box
                bg="rgba(107,4,4,0.38)"
                border="1px solid rgba(218,113,113,0.22)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
              >
                <Text
                  color={tcmTxt}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  mb={6}
                  textAlign="center"
                >
                  Interpretación Orientativa
                </Text>

                <Flex direction="column" gap={4}>
                  {INTERPRETACIONES.map((interp, i) => {
                    const isMax = totals[i] === maxTotal && maxTotal > 0;
                    return (
                      <Box
                        key={i}
                        p={{ base: 4, md: 5 }}
                        bg={isMax ? `${interp.acento}18` : "rgba(255,255,255,0.04)"}
                        border={`1px solid ${isMax ? `${interp.acento}45` : "rgba(255,255,255,0.08)"}`}
                        borderRadius="xl"
                        transition="all 0.3s"
                      >
                        <Flex align="center" gap={2} mb={2}>
                          <Text fontSize="lg">{interp.emoji}</Text>
                          <Text
                            color={isMax ? interp.acento : "rgba(255,255,255,0.7)"}
                            fontWeight="700"
                            fontSize={{ base: "sm", md: "md" }}
                            letterSpacing="0.08em"
                          >
                            {interp.nombre}
                          </Text>
                        </Flex>
                        <Text
                          color="rgba(255,255,255,0.7)"
                          fontSize={{ base: "xs", md: "sm" }}
                          lineHeight="1.75"
                          mb={1}
                        >
                          <Text as="span" color={interp.acento} fontWeight="600">Desequilibrio: </Text>
                          {interp.desequilibrio}
                        </Text>
                        <Text
                          color="rgba(255,255,255,0.5)"
                          fontSize={{ base: "xs", md: "sm" }}
                          lineHeight="1.75"
                          fontStyle="italic"
                        >
                          <Text as="span" color="rgba(255,255,255,0.6)" fontStyle="normal">Síntomas comunes: </Text>
                          {interp.sintomas}
                        </Text>
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
        borderTop="1px solid rgba(255,255,255,0.12)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.45)"
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
