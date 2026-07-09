// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · ACE — Experiencias Adversas en la Infancia  ·  7/16
//
// Entre «Necesidades» y «Heridas» (bloque de infancia: lo que necesitaste →
// lo que viviste → las heridas que dejó). Un test de 10 preguntas Sí/No que,
// al completarse, revela la puntuación, su interpretación y —con honestidad y
// esperanza— qué se sabe de estas experiencias.
//
// NO es un diagnóstico: es un espejo de autoconocimiento. Ver la nota de
// psicologiaRecorrido.ts (ACE_ESPERANZA.caveat) y el «Aviso importante» del
// inicio del recorrido.
//
// Datos: data.ace.respuestas = { [key]: "si" | "no" } (se guarda al instante).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  ACE_INTRO,
  ACE_PREGUNTAS,
  ACE_CONSECUENCIAS,
  ACE_ESPERANZA,
  aceScore,
  aceRespondidas,
  aceCompleto,
  aceBanda,
  type LineaDeVidaData,
  type AceRespuesta,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaAce() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, AceRespuesta>>({});
  const [guardando, setGuardando] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});
  const resultadoRef = useRef<HTMLDivElement | null>(null);
  const yaCompleto = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        const r = d.ace?.respuestas && typeof d.ace.respuestas === "object" ? { ...d.ace.respuestas } : {};
        setRespuestas(r);
        yaCompleto.current = aceCompleto(d);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const marcar = (key: string, value: AceRespuesta) => {
    const next = { ...respuestas, [key]: value };
    setRespuestas(next);

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    const payload = { ...dataRef.current, ace: { respuestas: next } };
    dataRef.current = payload;
    axios.patch(
      `${API_URL}/metodo-psicologia/${userId}`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => { /* silencioso */ }).finally(() => setGuardando(false));

    // Al completar la última respuesta por primera vez, llevamos la vista al
    // resultado con suavidad (sin robar el foco si la persona ya lo había visto).
    const data: LineaDeVidaData = { ...dataRef.current, ace: { respuestas: next } };
    if (aceCompleto(data) && !yaCompleto.current) {
      yaCompleto.current = true;
      setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 220);
    }
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  const data: LineaDeVidaData = { ...dataRef.current, ace: { respuestas } };
  const respondidas = aceRespondidas(data);
  const total = ACE_PREGUNTAS.length;
  const completo = aceCompleto(data);
  const score = aceScore(data);
  const banda = aceBanda(score);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title="ACE"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 7, total: 16 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Necesidades", onClick: () => navigate(`/metodo/psicologia/${exp.id}/necesidades`) }}
            next={{ label: "Heridas →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`) }}
          />

          {/* ── Sobre el turquesa: subtítulo + acceso a la explicación + progreso ── */}
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} w="100%" maxW="640px">
            <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                  textAlign="center" lineHeight="1.6" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}>
              {ACE_INTRO.subtituloTurquesa}
            </Text>

            <Box
              as="button"
              onClick={() => setInfoOpen(true)}
              px={5}
              py={2}
              borderRadius="full"
              bg="rgba(255,255,255,0.1)"
              border="1px solid rgba(255,255,255,0.45)"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: "rgba(255,255,255,0.18)", transform: "translateY(-1px)" }}
            >
              ¿Qué es el test ACE?
            </Box>

            {/* Progreso */}
            <Flex align="center" gap={3} w="100%" maxW="380px">
              <Box flex="1" h="7px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                <Box h="100%" borderRadius="full" w={`${(respondidas / total) * 100}%`}
                     bg={TINTA} boxShadow={`0 0 10px ${TINTA}cc`} transition="width 0.4s ease" />
              </Box>
              <Text color={TINTA} fontSize="sm" fontWeight="700" whiteSpace="nowrap"
                    style={{ textShadow: "0 0 10px rgba(255,255,255,0.55), 0 1px 2px rgba(255,255,255,0.7)" }}>
                {respondidas}/{total}
              </Text>
            </Flex>
          </Flex>

          {/* ── Las 10 preguntas ── */}
          <Flex direction="column" w="100%" gap={{ base: 3.5, md: 4 }}>
            {ACE_PREGUNTAS.map((p, i) => {
              const elegido = respuestas[p.key];
              return (
                <Box key={p.key} position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                        align={{ base: "stretch", md: "center" }} gap={{ base: 4, md: 6 }}
                        px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>

                    {/* Texto de la pregunta */}
                    <Box flex="1" minW={0}>
                      <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.16em"
                            textTransform="uppercase" opacity={0.6} mb={1.5} style={{ textShadow: INK_SHADOW }}>
                        {i + 1}. {p.categoria}
                      </Text>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="600" lineHeight="1.5"
                            style={{ textShadow: INK_SHADOW }}>
                        {p.pregunta}
                      </Text>
                      {p.apoyo && (
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.82}
                              mt={1.5} lineHeight="1.55" style={{ textShadow: INK_SHADOW }}>
                          {p.apoyo}
                        </Text>
                      )}
                    </Box>

                    {/* Botones Sí / No */}
                    <Flex gap={2.5} flexShrink={0} justify={{ base: "center", md: "flex-end" }}>
                      {(["si", "no"] as AceRespuesta[]).map((op) => {
                        const activo = elegido === op;
                        const esSi = op === "si";
                        const acento = esSi ? "#c5613e" : "#3f9d6b";
                        return (
                          <Box
                            key={op}
                            as="button"
                            onClick={() => marcar(p.key, op)}
                            minW={{ base: "88px", md: "76px" }}
                            px={5}
                            py={2.5}
                            borderRadius="full"
                            bg={activo ? acento : "rgba(255,251,243,0.55)"}
                            border={`1.5px solid ${activo ? acento : `${TINTA}55`}`}
                            color={activo ? PAPEL : TINTA}
                            fontFamily="'EB Garamond', serif"
                            fontWeight="700"
                            fontSize={{ base: "md", md: "md" }}
                            letterSpacing="0.03em"
                            cursor="pointer"
                            boxShadow={activo ? `0 4px 16px ${acento}66` : "none"}
                            transition="all 0.18s"
                            _hover={{ transform: "translateY(-2px)", bg: activo ? acento : `${acento}22`,
                                      boxShadow: `0 6px 20px ${acento}55` }}
                            style={activo ? { textShadow: "0 1px 3px rgba(60,28,10,0.45)" } : { textShadow: `0 1px 2px ${PAPEL}` }}
                          >
                            {esSi ? "Sí" : "No"}{activo ? " ✓" : ""}
                          </Box>
                        );
                      })}
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>

          {guardando && (
            <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic">Guardando…</Text>
          )}

          {/* ── Resultado (aparece al completar las 10) ── */}
          {completo && (
            <Box ref={resultadoRef} w="100%" scrollMarginTop={{ base: 4, md: 6 }}>
              <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>

                {/* Puntuación + banda */}
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                        gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}>
                    <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em"
                          textTransform="uppercase" opacity={0.65} style={{ textShadow: INK_SHADOW }}>
                      Tu puntuación ACE
                    </Text>

                    {/* Círculo con la cifra */}
                    <Flex align="center" justify="center" w={{ base: "116px", md: "134px" }} h={{ base: "116px", md: "134px" }}
                          borderRadius="full" bg="rgba(255,251,243,0.72)" border={`3px solid ${banda.color}`}
                          boxShadow={`0 0 26px ${banda.color}66`} sx={{ backdropFilter: "blur(4px)" }}>
                      <Text color={banda.color} fontSize={{ base: "5xl", md: "6xl" }} fontWeight="700" lineHeight="1"
                            style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                        {score}
                      </Text>
                      <Text color={`${banda.color}cc`} fontSize={{ base: "xl", md: "2xl" }} fontWeight="600"
                            alignSelf="flex-end" mb={{ base: 4, md: 5 }}>
                        /10
                      </Text>
                    </Flex>

                    <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25"
                          style={{ textShadow: INK_SHADOW }}>
                      {banda.titulo}
                    </Text>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                          maxW="560px" style={{ textShadow: INK_SHADOW }}>
                      {banda.texto}
                    </Text>
                  </Flex>
                </Box>

                {/* Consecuencias (dosis-respuesta) */}
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" gap={{ base: 4, md: 5 }}
                        px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                    <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                          lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                      {ACE_CONSECUENCIAS.titulo}
                    </Text>
                    <Box h="1px" w="55%" maxW="240px" mx="auto"
                         bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                          style={{ textShadow: INK_SHADOW }}>
                      {ACE_CONSECUENCIAS.intro}
                    </Text>
                    <Flex direction="column" gap={3}>
                      {ACE_CONSECUENCIAS.puntos.map((p, i) => (
                        <Flex key={i} align="flex-start" gap={3}>
                          <Box mt="9px" w="7px" h="7px" borderRadius="full" bg={TINTA} flexShrink={0}
                               boxShadow={`0 0 8px ${TINTA}88`} />
                          <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" opacity={0.92}
                                style={{ textShadow: INK_SHADOW }}>
                            {p}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>
                </Box>

                {/* Esperanza / resiliencia */}
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" gap={{ base: 4, md: 5 }}
                        px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                    <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                          lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                      {ACE_ESPERANZA.titulo}
                    </Text>
                    <Box h="1px" w="55%" maxW="240px" mx="auto"
                         bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                    {ACE_ESPERANZA.texto.map((t, i) => (
                      <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                            style={{ textShadow: INK_SHADOW }}>
                        {t}
                      </Text>
                    ))}
                    <Box mt={1} px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} borderRadius="xl"
                         bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}33`} sx={{ backdropFilter: "blur(4px)" }}>
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.7">
                        {ACE_ESPERANZA.caveat}
                      </Text>
                    </Box>

                    {/* Seguir el recorrido */}
                    <Flex justify="center" pt={2}>
                      <Box as="button" onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`)}
                           position="relative" overflow="hidden" px={8} py={3} borderRadius="full"
                           bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif"
                           fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                           boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                        <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                             style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
                          Continuar a Heridas →
                        </Box>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          )}
        </Flex>
      </Flex>

      {/* ── Popup: qué es el test ACE ── */}
      <Modal isOpen={infoOpen} onClose={() => setInfoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center"
                      lineHeight="1.25" style={{ textShadow: INK_SHADOW }}>
                  {ACE_INTRO.titulo}
                </Text>
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center"
                      opacity={0.8} style={{ textShadow: INK_SHADOW }}>
                  {ACE_INTRO.subtitulo}
                </Text>
                <Box h="1px" w="55%" maxW="240px" mx="auto"
                     bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                {ACE_INTRO.que.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                        style={{ textShadow: INK_SHADOW }}>
                    {p}
                  </Text>
                ))}
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      <AyudaRecorrido pagina="ace" />

      <SiteFooter />
    </Box>
  );
}
