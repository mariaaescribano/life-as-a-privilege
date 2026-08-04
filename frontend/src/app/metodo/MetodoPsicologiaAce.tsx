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
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_ACE } from "../../components/metodo/comicAce";
import {
  experienciaById,
  ACE_INTRO,
  ACE_PREGUNTAS,
  aceRespondidas,
  aceCompleto,
  type LineaDeVidaData,
  type AceRespuesta,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
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
  // Cómic «Los ACE»: se intercala al ir al resultado (desde el header o el
  // botón). Solo aquí — no forma parte de las Ilustraciones del material.
  const [comicOpen, setComicOpen] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});
  const resultadoRef = useRef<HTMLDivElement | null>(null);
  // Último guardado en vuelo: se espera (flush) antes de navegar al resultado,
  // que rebota si lee del backend un ACE aún incompleto (red lenta).
  const savePromiseRef = useRef<Promise<unknown>>(Promise.resolve());
  const yaCompleto = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    const payload = { ...dataRef.current, ace: { respuestas: next } };
    dataRef.current = payload;
    savePromiseRef.current = axios.patch(
      `${API_URL}/metodo-psicologia/${userId}`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => { /* silencioso */ }).finally(() => setGuardando(false));

    // Al completar la última respuesta por primera vez, llevamos la vista al
    // botón de resultado con suavidad.
    const data: LineaDeVidaData = { ...dataRef.current, ace: { respuestas: next } };
    if (aceCompleto(data) && !yaCompleto.current) {
      yaCompleto.current = true;
      setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 220);
    }
  };

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  const data: LineaDeVidaData = { ...dataRef.current, ace: { respuestas } };
  const respondidas = aceRespondidas(data);
  const total = ACE_PREGUNTAS.length;
  const completo = aceCompleto(data);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="ACE"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 3, total: 22 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Problemas", onClick: () => navigate(`/metodo/psicologia/${exp.id}/problema`) }}
              next={{
                label: "Resultado →",
                onClick: () => setComicOpen(true),
                disabled: !completo,
                disabledTooltip: "Responde las 10 preguntas para ver tu resultado.",
              }}
            />
          </Reveal>

          {/* ── Sobre el turquesa: subtítulo + acceso a la explicación + progreso ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} w="100%" maxW="640px">
            <IntroRecorrido>{ACE_INTRO.subtituloTurquesa}</IntroRecorrido>

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
          </Reveal>

          {/* ── Las 10 preguntas · entran EN CASCADA, una tras otra ── */}
          <RevealStagger stagger={0.12} delayChildren={0.1} amount={0.15}
                         display="flex" flexDirection="column" w="100%" gap={{ base: 3.5, md: 4 }}>
            {ACE_PREGUNTAS.map((p) => {
              const elegido = respuestas[p.key];
              return (
                <RevealItem key={p.key} w="100%">
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                        align={{ base: "stretch", md: "center" }} gap={{ base: 4, md: 6 }}
                        px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>

                    {/* Texto de la pregunta */}
                    <Box flex="1" minW={0}>
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
                        return (
                          <Box
                            key={op}
                            as="button"
                            onClick={() => marcar(p.key, op)}
                            minW={{ base: "88px", md: "76px" }}
                            px={5}
                            py={2.5}
                            borderRadius="full"
                            bg={activo ? TINTA : "rgba(255,251,243,0.55)"}
                            border={`1.5px solid ${activo ? TINTA : `${TINTA}55`}`}
                            color={activo ? PAPEL : TINTA}
                            fontFamily="'EB Garamond', serif"
                            fontWeight="700"
                            fontSize={{ base: "md", md: "md" }}
                            letterSpacing="0.03em"
                            cursor="pointer"
                            boxShadow={activo ? `0 4px 16px ${TINTA}66` : "none"}
                            transition="all 0.18s"
                            _hover={{ transform: "translateY(-2px)", bg: activo ? TINTA : `${TINTA}22`,
                                      boxShadow: `0 6px 20px ${TINTA}55` }}
                            style={activo ? { textShadow: "0 1px 3px rgba(60,28,10,0.45)" } : { textShadow: `0 1px 2px ${PAPEL}` }}
                          >
                            {esSi ? "Sí" : "No"}{activo ? " ✓" : ""}
                          </Box>
                        );
                      })}
                    </Flex>
                  </Flex>
                </Box>
                </RevealItem>
              );
            })}
          </RevealStagger>

          {guardando && (
            <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic">Guardando…</Text>
          )}

          {/* ── Al completar las 10: invitación a ver el resultado ── */}
          {completo && (
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%">
            <Box ref={resultadoRef} w="100%" scrollMarginTop={{ base: 4, md: 6 }}>
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                      gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 14, md: 20 }}>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.3"
                        style={{ textShadow: INK_SHADOW }}>
                    Has terminado el test.
                  </Text>
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                        maxW="520px" style={{ textShadow: INK_SHADOW }}>
                    Vamos a ver qué significa tu resultado y cómo estas experiencias influyen en ti hoy.
                  </Text>
                  <Box as="button" onClick={() => setComicOpen(true)}
                       position="relative" overflow="hidden" px={8} py={3} borderRadius="full"
                       bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif"
                       fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                    <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
                      Ver mi resultado →
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="ace" />

      {/* Cómic «Los ACE» — se muestra entre el test y el resultado. Al terminarlo
          (o pulsar «Resultado →») avanza a ace-resultado. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={async () => { await savePromiseRef.current; await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/ace-resultado`); }}
        vinetas={COMIC_ACE}
        continueLabel="Continuar"
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={`0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`}
      />

      <SiteFooter />
    </Box>
  );
}
