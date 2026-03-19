import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SiteHeader from "../../global/SiteHeader";
import { API_URL, EspacioPersonalIcon, tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";
import { getTheme } from "../data/tcmTheme";
import { generateTcmPdf, type TcmRespuesta } from "../../../utils/generateTcmPdf";

/* ══════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════ */
export interface TCMSeccion {
  nombre: string;
  preguntas: string[];
  numero?: string;
  dominio?: string;
}

export interface TCMInterpretacion {
  nombre: string;
  subtitulo?: string;
  descripcion: string;
}

export interface TCMTestPageProps {
  pageBg?: string;
  pageTitle: string;
  pageIcon?: React.ReactNode;
  instruccionesTitle: string;
  instruccionesText: string;
  instruccionesNota?: string;
  scaleValues: number[];
  scaleLabels: string[];
  scaleMobileHint: string;
  secciones: TCMSeccion[];
  resultadosNota?: (totals: number[], maxTotal: number) => React.ReactNode;
  interpretacionTitle: string;
  interpretaciones: TCMInterpretacion[];
  resultadoEtiqueta: string;
  localStorageKey: string;
  savePrimaryKey: string;
  tcmField?: 'constitucion' | 'elemento' | 'desequilibrio';
  monoColor?: boolean;
  showInterpretacion?: boolean;
  backToSpaceLink?: string;
}

/* ══════════════════════════════════════════════
   SUBCOMPONENTES
══════════════════════════════════════════════ */
const Divider = ({ color = tcmTxt }: { color?: string }) => (
  <Flex align="center" gap={3} my={5}>
    <Box flex="1" h="1px" bg={color} opacity={0.15} />
    <Box w="4px" h="4px" borderRadius="full" bg={color} opacity={0.35} />
    <Box flex="1" h="1px" bg={color} opacity={0.15} />
  </Flex>
);

const ScaleBtn = ({
  val,
  selected,
  scaleLabels,
  onClick,
  accent = tcmTxt,
}: {
  val: number;
  selected: boolean;
  scaleLabels: string[];
  onClick: () => void;
  accent?: string;
}) => (
  <Flex direction="column" align="center" gap={1.5} w={{ base: "auto", md: "120px" }}>
    <Box
      as="button"
      onClick={onClick}
      w={{ base: "44px", md: "52px" }}
      h={{ base: "44px", md: "52px" }}
      borderRadius="full"
      border={selected ? `2px solid ${accent}` : "1.5px solid rgba(255,255,255,0.2)"}
      bg={selected ? "rgba(107,4,4,0.65)" : "rgba(255,255,255,0.05)"}
      color={selected ? accent : "rgba(255,255,255,0.45)"}
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="700"
      fontFamily="'EB Garamond', serif"
      cursor="pointer"
      transition="all 0.18s"
      boxShadow={selected ? `0 0 14px ${accent}55, 0 0 4px ${accent}33` : "none"}
      _hover={{
        bg: "rgba(107,4,4,0.45)",
        borderColor: `${accent}aa`,
        color: accent,
        boxShadow: `0 0 10px ${accent}33`,
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {val}
    </Box>
    <Text
      color={selected ? accent : "rgba(255,255,255,0.28)"}
      fontSize={{ base: "lg", md: "xl" }}
      letterSpacing="0.04em"
      textAlign="center"
      lineHeight="1.3"
      display={{ base: "none", md: "block" }}
      transition="color 0.18s"
    >
      {scaleLabels[val]}
    </Text>
  </Flex>
);

const SeccionCard = ({
  el,
  respuestas,
  scaleValues,
  scaleLabels,
  scaleMobileHint,
  onAnswer,
  monoColor = false,
}: {
  el: TCMSeccion;
  respuestas: (number | null)[];
  scaleValues: number[];
  scaleLabels: string[];
  scaleMobileHint: string;
  onAnswer: (qi: number, val: number) => void;
  monoColor?: boolean;
}) => {
  const maxPerQ = Math.max(...scaleValues);
  const maxScore = el.preguntas.length * maxPerQ;
  const total = respuestas.reduce((s: number, a) => s + (a ?? 0), 0);
  const answered = respuestas.filter((a) => a !== null).length;
  const complete = answered === el.preguntas.length;
  const elTheme = getTheme(el.nombre);
  const accent = monoColor ? tcmTxt : elTheme.accent;

  return (
    <Box
      w="100%"
      maxW="820px"
     boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
      bg={tcmBg}
      border={`1px solid ${complete ? `${accent}55` : `${accent}1a`}`}
      borderRadius="2xl"
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      mb={4}
      transition="border-color 0.3s, box-shadow 0.3s"
    >
      <Flex align="center" gap={3} mb={2}>
        {!monoColor && (
          <Box
            w="36px"
            h="36px"
            borderRadius="full"
            bg={elTheme.accent}
            border={`1.5px solid ${elTheme.accent}88`}
            boxShadow={`0 0 14px ${elTheme.accent}66, 0 0 4px ${elTheme.accent}44`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={elTheme.bg}
            flexShrink={0}
          >
            {elTheme.icon}
          </Box>
        )}
        <Text
          color={tcmTxt}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="600"
          letterSpacing="0.1em"
          textShadow={`0 0 18px ${tcmTxt}33`}
        >
          {el.nombre}
        </Text>
      </Flex>

      <Divider color={accent} />

      <Flex direction="column" gap={7}>
        {el.preguntas.map((pregunta, qi) => (
          <Box key={qi}>
            <Text
              color="rgba(255,255,255,0.82)"
              fontSize={{ base: "xl", md: "2xl" }}
              letterSpacing="0.02em"
              lineHeight="1.75"
              mb={3}
            >
              {qi + 1}. {pregunta}
            </Text>
            <Flex gap={{ base: 3, md: 5 }} align="flex-start" flexWrap="wrap">
              {scaleValues.map((v) => (
                <ScaleBtn
                  key={v}
                  val={v}
                  selected={respuestas[qi] === v}
                  scaleLabels={scaleLabels}
                  onClick={() => onAnswer(qi, v)}
                  accent={accent}
                />
              ))}
              <Box display={{ base: "flex", md: "none" }} alignItems="center" pl={1} pt={3}>
                <Text color="rgba(255,255,255,0.25)" fontSize="15px" letterSpacing="0.04em" fontStyle="italic">
                  {scaleMobileHint}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      <Divider color={accent} />

      <Flex align="center" justify="space-between">
        <Text color={`${accent}85`} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase">
          Suma {el.nombre}
        </Text>
        <Flex align="center" gap={2}>
          <Text
            color={complete ? accent : "rgba(255,255,255,0.22)"}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            transition="color 0.3s"
            textShadow={complete ? `0 0 12px ${accent}66` : "none"}
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
   PÁGINA
══════════════════════════════════════════════ */
export default function TCMTestPage({
  pageBg = "#008080",
  pageTitle,
  pageIcon,
  instruccionesTitle,
  instruccionesText,
  instruccionesNota,
  scaleValues,
  scaleLabels,
  scaleMobileHint,
  secciones,
  resultadosNota,
  interpretacionTitle,
  interpretaciones,
  resultadoEtiqueta,
  localStorageKey,
  savePrimaryKey,
  tcmField,
  monoColor = false,
  showInterpretacion = true,
  backToSpaceLink,
}: TCMTestPageProps) {
  const navigate = useNavigate();
  const maxPerQ = Math.max(...scaleValues);

  const [answers, setAnswers] = useState<(number | null)[][]>(
    secciones.map((s) => s.preguntas.map(() => null))
  );
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const totals: number[] = secciones.map((_s, si) =>
    answers[si].reduce<number>((sum, a) => sum + (a ?? 0), 0)
  );

  const totalAnswered = answers.flat().filter((a) => a !== null).length;
  const totalQuestions = secciones.reduce((s, sec) => s + sec.preguntas.length, 0);
  const allAnswered = answers.every(
    (group, gi) => group.filter((a) => a !== null).length === secciones[gi].preguntas.length
  );

  const handleAnswer = (si: number, qi: number, val: number) => {
    setAnswers((prev) => {
      const next = prev.map((r) => [...r]);
      next[si][qi] = val;
      return next;
    });
  };

  const maxTotal = Math.max(...totals);

  const handleSaveResult = async () => {
    const primaryIdx = totals.indexOf(maxTotal);
    const primaryNombre = secciones[primaryIdx]?.nombre;
    const result = {
      date: new Date().toISOString().split("T")[0],
      [savePrimaryKey]: primaryNombre,
      scores: secciones.map((s, i) => ({
        nombre: s.nombre,
        score: totals[i],
        max: s.preguntas.length * maxPerQ,
      })),
    };
    localStorage.setItem(localStorageKey, JSON.stringify(result));

    const userId = sessionStorage.getItem("userId");
    if (userId) {
      if (tcmField && primaryNombre) {
        try {
          await axios.post(`${API_URL}/tcm/${tcmField}`, {
            userId,
            [tcmField]: primaryNombre,
          });
        } catch (e) {
          console.error("Error al guardar resultado TCM:", e);
        }
      }

      // Guardar respuestas individuales
      if (tcmField) {
        const testNum = tcmField === "constitucion" ? 1 : tcmField === "elemento" ? 2 : 3;
        const respuestas = secciones.flatMap((sec, si) =>
          sec.preguntas.map((pregunta, qi) => ({
            seccion: sec.nombre,
            preguntaIdx: qi,
            pregunta,
            respuesta: answers[si][qi] ?? 0,
          }))
        );
        try {
          await axios.post(`${API_URL}/tcm/respuestas`, { userId, testNum, respuestas });
        } catch (e) {
          console.error("Error al guardar respuestas TCM:", e);
        }
      }
    }
  };

  const handleShowResults = () => {
    setShowResults(true);
    handleSaveResult();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg} fontFamily="'EB Garamond', serif">

      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 3, md: 3 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={pageIcon ?? <TCMIcon size={{ base: "36px", md: "52px" }} />}
            title={pageTitle}
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="820px"
          />

          {/* ── INSTRUCCIONES ── */}
          <Box
            w="100%"
            maxW="820px"
            boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
            bg={tcmBg}
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 5, md: 7 }}
            mb={4}
          >
            <Text
              color={tcmTxt}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mb={4}
            >
              {instruccionesTitle}
            </Text>
            <Text
              color={tcmTxt}
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.9"
              mb={5}
            >
              {instruccionesText}
            </Text>
            <Flex gap={{ base: 4, md: 8 }} flexWrap="wrap">
              {scaleLabels.map((label, i) => (
                <Flex key={i} align="center" gap={2}>
                  <Box
                    w="42px" h="42px" borderRadius="full"
                    border="1.5px solid rgba(218,113,113,0.45)"
                    display="flex" alignItems="center" justifyContent="center"
                    bg={tcmBg}
                    flexShrink={0}
                  >
                    <Text color={tcmTxt} fontSize="md" fontWeight="700">{i}</Text>
                  </Box>
                  <Text color={tcmTxt} fontSize={{ base: "lg", md: "xl" }}>
                    {label}
                  </Text>
                </Flex>
              ))}
            </Flex>
            {instruccionesNota && (
              <Text
                color={tcmTxt}
                fontSize="sm"
                fontStyle="italic"
                mt={5}
                letterSpacing="0.03em"
              >
                {instruccionesNota}
              </Text>
            )}
          </Box>

          {/* ── SECCIONES ── */}
          {secciones.map((sec, si) => (
            <SeccionCard
              key={si}
              el={sec}
              respuestas={answers[si]}
              scaleValues={scaleValues}
              scaleLabels={scaleLabels}
              scaleMobileHint={scaleMobileHint}
              onAnswer={(qi, val) => handleAnswer(si, qi, val)}
              monoColor={monoColor}
            />
          ))}

          {/* ── BOTÓN VER RESULTADOS ── */}
          <Box w="100%" maxW="820px" textAlign="center" mt={6}>
            {!allAnswered && (
              <Text
                color="rgba(255,255,255,0.35)"
                fontSize="md"
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
              px={{ base: 10, md: 14 }}
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              fontStyle="italic"
              border={`2px solid ${allAnswered ? tcmTxt : "rgba(218,113,113,0.18)"}`}
              bg={allAnswered ? tcmTxt : "rgba(107,4,4,0.2)"}
              color={allAnswered ? tcmBg : "rgba(255,255,255,0.25)"}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.28s"
              boxShadow={allAnswered ? `0 0 40px ${tcmTxt}66, 0 4px 24px rgba(0,0,0,0.3)` : "none"}
              transform={allAnswered ? "scale(1)" : "scale(0.97)"}
              _hover={allAnswered ? {
                bg: "white",
                borderColor: "white",
                color: tcmBg,
                boxShadow: `0 0 60px ${tcmTxt}99, 0 6px 32px rgba(0,0,0,0.35)`,
                transform: "translateY(-3px) scale(1.03)",
              } : {}}
            >
              Ver mis resultados
            </Box>
          </Box>

          {/* ── RESULTADOS ── */}
          {showResults && (
            <Box ref={resultsRef} boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"} w="100%" maxW="820px" mt={12}>

              {/* Puntuaciones */}
              <Box
                bg={tcmBg}
                border="1px solid rgba(218,113,113,0.35)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
                mb={5}
                boxShadow="0 4px 24px rgba(0,0,0,0.25), 0 0 18px rgba(107,4,4,0.38)"
              >
                <Text
                  color={tcmTxt}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.08em"
                  mb={7}
                  textAlign="center"
                  fontFamily="'EB Garamond', serif"
                >
                  Tus Resultados
                </Text>

                <Flex direction="column" gap={5}>
                  {secciones.map((sec, si) => {
                    const isMax = totals[si] === maxTotal && maxTotal > 0;
                    const maxPossible = sec.preguntas.length * maxPerQ;
                    const pct = Math.round(((totals[si] ?? 0) / maxPossible) * 100);
                    const elTheme = getTheme(sec.nombre);
                    const barColor = monoColor ? tcmTxt : elTheme.accent;
                    return (
                      <Box key={si}>
                        <Flex align="center" justify="space-between" mb={2}>
                          <Flex align="center" gap={3} flexWrap="wrap">
                            <Text
                              color={isMax ? "white" : "rgba(255,255,255,0.65)"}
                              fontSize={{ base: "2xl", md: "3xl" }}
                              fontWeight={isMax ? "600" : "400"}
                              letterSpacing="0.04em"
                              transition="all 0.3s"
                              textShadow={isMax ? `0 0 12px ${barColor}50` : "none"}
                            >
                              {sec.nombre}
                            </Text>
                            {isMax && (
                              <Box
                                bg={monoColor ? `${tcmBg}cc` : `${elTheme.bg}cc`}
                                border={`1px solid ${barColor}70`}
                                borderRadius="full"
                                px={3} py={0.5}
                                boxShadow={`0 0 10px ${barColor}28`}
                              >
                                <Text color={barColor} fontSize="xs" fontWeight="700" letterSpacing="0.16em">
                                  PREDOMINANTE
                                </Text>
                              </Box>
                            )}
                          </Flex>
                          <Text
                            color={isMax ? barColor : "rgba(255,255,255,0.4)"}
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="700"
                            textShadow={isMax ? `0 0 12px ${barColor}55` : "none"}
                            transition="all 0.3s"
                            flexShrink={0}
                          >
                            {totals[si]}
                            <Text as="span" fontSize={{ base: "md", md: "lg" }} fontWeight="400" color="rgba(255,255,255,0.25)">
                              {" "}/ {maxPossible}
                            </Text>
                          </Text>
                        </Flex>
                        <Box w="100%" h="6px" borderRadius="full" bg="rgba(255,255,255,0.07)">
                          <Box
                            h="100%"
                            borderRadius="full"
                            bg={isMax ? barColor : `${barColor}44`}
                            boxShadow={isMax ? `0 0 8px ${barColor}60` : "none"}
                            w={`${pct}%`}
                            transition="width 0.9s ease"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Flex>

                {maxTotal > 0 && resultadosNota && (
                  <Box mt={7} p={5} bg="rgba(0,0,0,0.18)" borderRadius="xl" border="1px solid rgba(218,113,113,0.14)">
                    {resultadosNota(totals, maxTotal)}
                  </Box>
                )}
              </Box>

              {/* Interpretación */}
              {showInterpretacion && <Box
                bg={tcmBg}
                border="1px solid rgba(218,113,113,0.35)"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
                boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
              >
                <Text
                  color={tcmTxt}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.08em"
                  mb={6}
                  textAlign="center"
                  fontFamily="'EB Garamond', serif"
                >
                  {interpretacionTitle}
                </Text>

                <Flex direction="column" gap={3}>
                  {interpretaciones.map((interp, i) => {
                    const isMax = totals[i] === maxTotal && maxTotal > 0;
                    const elTheme = getTheme(interp.nombre);
                    return (
                      <Box
                        key={i}
                        p={{ base: 4, md: 5 }}
                        bg={isMax ? `${elTheme.bg}cc` : "rgba(255,255,255,0.03)"}
                        border={`1px solid ${isMax ? `${elTheme.accent}55` : "rgba(218,113,113,0.1)"}`}
                        borderLeft={isMax ? `3px solid ${elTheme.accent}bb` : undefined}
                        borderRadius="xl"
                        boxShadow={isMax ? `0 0 22px ${elTheme.accent}1e, 0 2px 14px rgba(0,0,0,0.22)` : "none"}
                        transition="all 0.35s"
                      >
                        <Flex align="center" gap={3} mb={isMax ? 3 : 0} flexWrap="wrap">
                          {/* Icono del elemento para el predominante */}
                          {isMax && !monoColor && (
                            <Box
                              w="36px" h="36px"
                              borderRadius="full"
                              bg={elTheme.accent}
                              border={`1.5px solid ${elTheme.accent}88`}
                              boxShadow={`0 0 14px ${elTheme.accent}66, 0 0 4px ${elTheme.accent}44`}
                              display="flex" alignItems="center" justifyContent="center"
                              color={elTheme.bg}
                              flexShrink={0}
                            >
                              {elTheme.icon}
                            </Box>
                          )}
                          <Flex align="baseline" gap={2} flexWrap="wrap">
                            <Text
                              color={isMax ? "white" : "rgba(255,255,255,0.55)"}
                              fontWeight={isMax ? "600" : "400"}
                              fontSize={{ base: "2xl", md: "3xl" }}
                              letterSpacing="0.06em"
                            >
                              {interp.nombre}
                            </Text>
                            {interp.subtitulo && (
                              <Text
                                color={isMax ? `${elTheme.accent}cc` : "rgba(255,255,255,0.3)"}
                                fontSize={{ base: "md", md: "lg" }}
                                fontStyle="italic"
                                letterSpacing="0.04em"
                              >
                                · {interp.subtitulo}
                              </Text>
                            )}
                            {isMax && (
                              <Text
                                color={`${elTheme.accent}cc`}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.16em"
                                textTransform="uppercase"
                              >
                                · {resultadoEtiqueta}
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                        {isMax && (
                          <Text
                            color="rgba(255,255,255,0.82)"
                            fontSize={{ base: "lg", md: "xl" }}
                            lineHeight="1.85"
                          >
                            {interp.descripcion}
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </Flex>
              </Box>}
            </Box>
          )}
           {/* ── DESCARGAR PDF ── */}
              {showResults && tcmField && (
                <Flex justify="center" mt={4}>
                  <Box
                    as="button"
                    onClick={() => {
                      const testNum =
                        tcmField === "constitucion" ? 1 : tcmField === "elemento" ? 2 : 3;
                      const respuestasFlat: TcmRespuesta[] = secciones.flatMap((sec, si) =>
                        sec.preguntas.map((pregunta, qi) => ({
                          seccion: sec.nombre,
                          pregunta_idx: qi,
                          pregunta,
                          respuesta: answers[si][qi] ?? 0,
                        }))
                      );
                      const resultado = secciones[totals.indexOf(Math.max(...totals))]?.nombre;
                      generateTcmPdf(testNum, respuestasFlat, resultado);
                    }}
                    px={8}
                    py={3}
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="600"
                    letterSpacing="0.08em"
                    border="1.5px solid rgba(218,113,113,0.6)"
                    bg="transparent"
                    color="#da7171"
                    cursor="pointer"
                    transition="all 0.22s"
                    _hover={{
                      boxShadow: "0 0 16px rgba(218,113,113,0.35)",
                      borderColor: "#da7171",
                    }}
                  >
                    Descargar mis respuestas
                  </Box>
                </Flex>
              )}

              {/* ── VOLVER A MI ESPACIO ── */}
              {backToSpaceLink && (
                <Flex justify="center" mt={8}>
                  <Box
                    as="button"
                    onClick={() => navigate(backToSpaceLink)}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    px={8}
                    py={3}
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="600"
                    letterSpacing="0.08em"
                    border={`1.5px solid ${tcmTxt}55`}
                    bg={`${tcmBg}`}
                    borderColor= {tcmTxt}
                    color={tcmTxt}
                    cursor="pointer"
                    transition="all 0.22s"
                    boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
                    _hover={{
                      bg: `${tcmBg}dd`,
                      
                    }}
                  >
                    <EspacioPersonalIcon color={tcmTxt} size="22px" />
                    Volver a Mi Espacio
                  </Box>
                </Flex>
              )}
        </Flex>
      </Box>

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
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
      </Box>
    </Box>
  );
}
