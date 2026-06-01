import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MetodoStepHeader } from "../../metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../global/DisciplinaBgLayer";
import { TCMIlustracionesModal } from "../../metodo/TCMIlustracionesModal";
import SiteHeader from "../../global/SiteHeader";
import { API_URL, EspacioPersonalIcon, tcmBg, tcmNom, TCMIcon, tcmTxt } from "../../../GlobalVariables";
import { getTheme } from "../data/tcmTheme";
import { generateTcmPdf, generateTcmConsejosPdf, type TcmRespuesta } from "../../../utils/generateTcmPdf";
import type { Recs } from "../../espacio/data/tcmRecommendations";

// Icono ojo para el botón "Ilustraciones" del header.
const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

/* ══════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════ */
export interface TCMSeccion {
  nombre: string;
  preguntas: string[];
  numero?: string;
  dominio?: string;
}

 const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const TXT_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.75), 0 0 5px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.25)";

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
  recsMap?: Record<string, Recs>;
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
  recsMap,
}: TCMTestPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "true";
  const maxPerQ = Math.max(...scaleValues);
  // Con 3 o menos etiquetas de escala caben las 3 en una sola línea; con más
  // (tests de 4 niveles) dejamos que hagan wrap para no desbordar.
  const oneLineScale = scaleLabels.length <= 3;

  const [answers, setAnswers] = useState<(number | null)[][]>(
    secciones.map((s) => s.preguntas.map(() => null))
  );
  const [showResults, setShowResults] = useState(false);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
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
    if (!isGuest) {
      localStorage.setItem(localStorageKey, JSON.stringify(result));
    }

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
          <MetodoStepHeader
            icon={pageIcon ?? <TCMIcon size={{ base: "40px", md: "56px" }} />}
            title={pageTitle}
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={{ base: 0, md: 0 }}
            compact
            prev={{ label: "← Volver", onClick: () => navigate("/aprendizaje/cursosModalidad/medicinachina") }}
            next={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true), icon: <EyeIcon /> }}
          />

          {/* ── INSTRUCCIONES ── */}
          <Box
            position="relative"
            overflow="hidden"
            w="100%"
            maxW="850px"
            boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="2xl"
            mb={4}
            mt="20px"
          >
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" overlay={`${tcmBg}55`} imageSrc="/img/fondos/tcm-vertical.png" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }}>
              <Text
                color={tcmTxt}
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.2em"
                textTransform="uppercase"
                mb={4}
                textShadow={TXT_SHADOW}
              >
                {instruccionesTitle}
              </Text>
              <Text
                color={tcmTxt}
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.9"
                mb={5}
                textShadow={TXT_SHADOW}
              >
                {instruccionesText}
              </Text>
              <Flex
                gap={oneLineScale ? { base: 3, md: 5 } : { base: 4, md: 8 }}
                flexWrap={oneLineScale ? "nowrap" : "wrap"}
                justify="flex-start"
              >
                {scaleLabels.map((label, i) => (
                  <Flex key={i} align="center" gap={{ base: 1.5, md: 2 }} flexShrink={oneLineScale ? 1 : 0} minW={0}>
                    <Box
                      w={{ base: oneLineScale ? "30px" : "42px", md: "42px" }}
                      h={{ base: oneLineScale ? "30px" : "42px", md: "42px" }}
                      borderRadius="full"
                      border="1.5px solid rgba(218,113,113,0.45)"
                      display="flex" alignItems="center" justifyContent="center"
                      bg="rgba(255,255,255,0.10)"
                      flexShrink={0}
                    >
                      <Text color={tcmTxt} fontSize={{ base: oneLineScale ? "sm" : "md", md: "md" }} fontWeight="700" textShadow={TXT_SHADOW}>{i}</Text>
                    </Box>
                    <Text color={tcmTxt} fontSize={{ base: oneLineScale ? "sm" : "lg", md: "xl" }} whiteSpace="nowrap" textShadow={TXT_SHADOW}>
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
                  textShadow={TXT_SHADOW}
                >
                  {instruccionesNota}
                </Text>
              )}
            </Box>
          </Box>

          {/* ── PREGUNTAS ──
              Lista limpia y seguida, SIN agrupar en cajas ni mostrar el nombre
              del patrón ni la suma en vivo (eso sesga las respuestas). El
              cálculo por patrón se sigue haciendo por detrás con answers[si][qi]
              y solo se revela en los resultados. */}
          <Box w="100%" maxW="850px" mt="20px">
            {secciones
              .flatMap((sec, si) =>
                sec.preguntas.map((pregunta, qi) => ({ si, qi, pregunta }))
              )
              .map(({ si, qi, pregunta }, idx) => (
                <Box key={`${si}-${qi}`}>
                  {idx > 0 && <Divider color={tcmTxt} />}
                  <Text
                    color="rgba(255,255,255,0.92)"
                    fontSize={{ base: "xl", md: "2xl" }}
                    letterSpacing="0.02em"
                    lineHeight="1.75"
                    mb={3}
                  >
                    {idx + 1}. {pregunta}
                  </Text>
                  <Flex gap={{ base: 3, md: 5 }} align="flex-start" flexWrap="wrap">
                    {scaleValues.map((v) => (
                      <ScaleBtn
                        key={v}
                        val={v}
                        selected={answers[si][qi] === v}
                        scaleLabels={scaleLabels}
                        onClick={() => handleAnswer(si, qi, v)}
                        accent={tcmTxt}
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
          </Box>

          {/* ── BOTÓN VER RESULTADOS ── */}
          <Box w="100%" maxW="850px" textAlign="center" mt={6}>
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
              position="relative"
              overflow="hidden"
              px={{ base: 10, md: 14 }}
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              fontStyle="italic"
              border={`2px solid ${allAnswered ? tcmTxt : "rgba(218,113,113,0.18)"}`}
              bg={allAnswered ? tcmBg : "rgba(107,4,4,0.2)"}
              color={allAnswered ? tcmTxt : "rgba(255,255,255,0.25)"}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.28s"
              boxShadow={allAnswered ? GLOW : "none"}
              transform={allAnswered ? "scale(1)" : "scale(0.97)"}
              textShadow={allAnswered ? TXT_SHADOW : undefined}
              _hover={{}}
            >
              {allAnswered && (
                <DisciplinaBgLayer nom={tcmNom} borderRadius="full" overlay={`${tcmBg}77`} imageSrc="/img/fondos/tcm-vertical.png" />
              )}
              <Box as="span" position="relative" zIndex={1}>
                Ver mis resultados
              </Box>
            </Box>
          </Box>

          {/* ── RESULTADOS ── */}
          {showResults && (
            <Box ref={resultsRef} boxShadow={GLOW} w="100%" maxW="850px" mt={12}>

              {/* Puntuaciones */}
              <Box
                position="relative"
                overflow="hidden"
                border="1px solid rgba(218,113,113,0.35)"
                borderRadius="2xl"
                mb={5}
                boxShadow={GLOW}
              >
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" overlay={`${tcmBg}55`} blur imageSrc="/img/fondos/tcm-vertical.png" />
                <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
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
              </Box>

              {/* Interpretación */}
              {showInterpretacion && <Box
                position="relative"
                overflow="hidden"
                border="1px solid rgba(218,113,113,0.35)"
                borderRadius="2xl"
                boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
              >
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" overlay={`${tcmBg}55`} blur imageSrc="/img/fondos/tcm-vertical.png" />
                <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
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
                </Box>
              </Box>}
            </Box>
          )}
           {/* ── DESCARGAR RESPUESTAS ── */}
              {showResults && tcmField && (
                <Flex justify="center" mt={6}>
                  <Box
                    as="button"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
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
                      const maxIdx = totals.indexOf(Math.max(...totals));
                      const resultado = secciones[maxIdx]?.nombre;
                      const consejo = interpretaciones[maxIdx]?.descripcion;
                      generateTcmPdf(testNum, respuestasFlat, resultado, consejo);
                    }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 3, md: 4 }}
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.08em"
                    border={`2px solid ${tcmTxt}`}
                    bg={tcmBg}
                    color={tcmTxt}
                    cursor="pointer"
                    transition="all 0.22s"
                    boxShadow={GLOW}
                    _hover={{}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor" style={{ flexShrink: 0 }}>
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                    Descargar mis respuestas
                  </Box>
                </Flex>
              )}

              {/* ── CONSEJOS PERSONALIZADOS ── */}
              {showResults && recsMap && tcmField && (() => {
                const maxIdx = totals.indexOf(Math.max(...totals));
                const resultadoNombre = secciones[maxIdx]?.nombre;
                if (!resultadoNombre) return null;
                const recs = recsMap[resultadoNombre];
                if (!recs) return null;

                const categories = [
                  { key: "infusiones", label: "Infusiones", icon: "M480-80q-134 0-227-93t-93-227q0-7 .5-14t1.5-14L60-560h200l100 80h40l100-80h200l-34 120h78v80h-96q-3 17-9 42t-14 50l95 68-48 66-100-72q-45 72-119.5 114T480-80Zm0-80q75 0 137.5-40T714-310l-74 52 24-66 18-56H278l18 56 24 66-74-52q34 70 96.5 110T480-160Zm-184-400h368l-24-80H320l-24 80Zm184 180Z" },
                  { key: "hierbas", label: "Hierbas", icon: "M440-690v-100q0-42 29-71t71-29h100v100q0 42-29 71t-71 29H440ZM220-450q-58 0-99-41t-41-99v-140h140q58 0 99 41t41 99v140H220ZM640-90q-39 0-74.5-12T501-135l-33 33q-11 11-28 11t-28-11q-11-11-11-28t11-28l33-33q-21-29-33-64.5T400-330q0-100 70-170.5T640-571h241v241q0 100-70.5 170T640-90Z" },
                  { key: "nutricion", label: "Nutrici\u00f3n", icon: "M160-120v-640q0-33 23.5-56.5T240-840h480q33 0 56.5 23.5T800-760v640L480-240 160-120Zm80-122 240-74 240 74v-518H240v518Zm240-74L240-242v0-518h480v518L480-316Z" },
                  { key: "estiloDeVida", label: "Estilo de vida", icon: "M480-480ZM363-120H200q-33 0-56.5-23.5T120-200v-163q38 0 66-26t32-64H120v-107q0-33 23.5-56.5T200-640h163q0-38 26-66t64-32v-102h107q0 42 28.5 71t70.5 29q42 0 70.5-29t28.5-71h107v102q38 4 64 32t26 66h163q33 0 56.5 23.5T1200-560v107h-98q4 36 32 64t66 26v163q0 33-23.5 56.5T1120-120H957q0-42-28.5-70.5T858-219q-42 0-70.5 28.5T759-120H601q0-42-28.5-70.5T502-219q-42 0-70.5 28.5T403-120H363Z" },
                ] as const;

                const elTheme = getTheme(resultadoNombre);

                return (
                  <Box w="100%" maxW="850px" mt={8}>
                    <Text
                      color={tcmTxt}
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="700"
                      letterSpacing="0.08em"
                      mb={5}
                      textAlign="center"
                      fontFamily="'EB Garamond', serif"
                    >
                      Tus consejos personalizados
                    </Text>

                    <Flex direction="column" gap={4}>
                      {categories.map(({ key, label, icon }) => {
                        const items = recs[key as keyof Recs];
                        if (!items || items.length === 0) return null;
                        return (
                          <Box
                            key={key}
                            position="relative"
                            overflow="hidden"
                            border={`1px solid ${elTheme.accent}44`}
                            borderRadius="2xl"
                            boxShadow={GLOW}
                          >
                            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" overlay={`${tcmBg}55`} blur imageSrc="/img/fondos/tcm-vertical.png" />
                            <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                            <Flex align="center" gap={2.5} mb={4}>
                              <Box
                                w="32px" h="32px" borderRadius="full"
                                bg={`${elTheme.accent}18`}
                                border={`1px solid ${elTheme.accent}44`}
                                display="flex" alignItems="center" justifyContent="center"
                                color={elTheme.accent}
                                flexShrink={0}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                  <path d={icon} />
                                </svg>
                              </Box>
                              <Text
                                color={elTheme.accent}
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="700"
                                fontFamily="'EB Garamond', serif"
                                letterSpacing="0.06em"
                              >
                                {label}
                              </Text>
                            </Flex>
                            <Flex direction="column" gap={2}>
                              {items.map((item, j) => (
                                <Flex key={j} align="flex-start" gap={2.5}>
                                  <Text color={`${elTheme.accent}88`} fontSize="md" mt="2px" flexShrink={0}>·</Text>
                                  <Text
                                    color="rgba(255,255,255,0.82)"
                                    fontSize={{ base: "md", md: "lg" }}
                                    fontFamily="'EB Garamond', serif"
                                    lineHeight="1.7"
                                  >
                                    {item}
                                  </Text>
                                </Flex>
                              ))}
                            </Flex>
                            </Box>
                          </Box>
                        );
                      })}
                    </Flex>

                    {/* Descargar consejos */}
                    <Flex justify="center" mt={6}>
                      <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        onClick={() => {
                          const testNum = tcmField === "constitucion" ? 1 : tcmField === "elemento" ? 2 : 3;
                          generateTcmConsejosPdf(testNum, resultadoNombre, recs, interpretaciones[maxIdx]?.descripcion);
                        }}
                        px={{ base: 8, md: 10 }}
                        py={{ base: 3, md: 4 }}
                        borderRadius="full"
                        fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="700"
                        letterSpacing="0.08em"
                        border={`2px solid ${tcmTxt}`}
                        bg={tcmBg}
                        color={tcmTxt}
                        cursor="pointer"
                        transition="all 0.22s"
                        boxShadow={GLOW}
                        _hover={{
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                        </svg>
                        Descargar consejos
                      </Box>
                    </Flex>
                  </Box>
                );
              })()}

              {/* ── VOLVER A MI ESPACIO ── */}
              {backToSpaceLink && !isGuest && (
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

      <TCMIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

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
