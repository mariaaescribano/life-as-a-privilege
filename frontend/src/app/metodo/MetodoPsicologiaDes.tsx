// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · DESCONEXIÓN (test DES-II)  ·  5/25
//
// Entre el resultado del ACE (paso 4) y la Línea de Vida (paso 7): si el ACE
// cuenta qué pasó, este cuenta cómo se sobrevivió. Y llega ANTES de recorrer la
// vida año a año a propósito, para que los huecos de memoria que aparezcan allí
// no se vivan como un fracaso propio sino como información.
//
// 28 frases; en cada una la persona marca QUÉ PORCENTAJE DEL TIEMPO le pasa
// (0–100, de diez en diez, como los círculos del cuestionario en papel).
//
// La página va casi muda a propósito: aquí NO se explica qué es disociar. Eso lo
// cuenta el cómic «La desconexión», que se intercala al ir al resultado — si se
// explicara antes, la persona responderería a la idea y no a su experiencia.
//
// NO es un diagnóstico: es un espejo de autoconocimiento (ver la nota de
// psicologiaRecorrido.ts y el «Aviso importante» del inicio del recorrido).
//
// Datos: data.des.respuestas = { [key]: 0..100 } (se guarda al instante).
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
import { COMIC_DISOCIACION } from "../../components/metodo/comicDisociacion";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  experienciaById,
  desRespondidas,
  desCompleto,
  desResultado,
  desResultadoIgual,
  DES_VALORES,
  type DesResultado,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { guardarDesResultado } from "../../data/psicologiaDesApi";
import { useDesIntro, useDesPreguntas } from "../../components/metodo/psicologiaRecorrido.en";
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

export default function MetodoPsicologiaDes() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  // El texto del test, en el idioma activo (la estructura la manda el español).
  const desIntro = useDesIntro();
  const desPreguntas = useDesPreguntas();

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [guardando, setGuardando] = useState(false);
  // Cómic «La desconexión»: se intercala al ir al resultado (desde el header o el
  // botón). Solo aquí — no forma parte de las Ilustraciones del material.
  const [comicOpen, setComicOpen] = useState(false);
  // Las viñetas en el idioma activo (el español manda: fotos y orden salen de él).
  const comicVinetas = useComic("psicologia-disociacion", COMIC_DISOCIACION);
  const dataRef = useRef<LineaDeVidaData>({});
  const resultadoRef = useRef<HTMLDivElement | null>(null);
  // El último resultado que se mandó a su tabla, para no repetir el guardado
  // cuando cambiar una respuesta no mueve ninguna cifra.
  const ultimoResultadoRef = useRef<DesResultado | undefined>(undefined);
  // Último guardado en vuelo: se espera (flush) antes de navegar al resultado,
  // que rebota si lee del backend un test aún incompleto (red lenta).
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
        // Blindado: solo números (0 es una respuesta válida y hay que conservarla).
        const guardadas = d.des?.respuestas;
        const r: Record<string, number> = {};
        if (guardadas && typeof guardadas === "object") {
          Object.entries(guardadas).forEach(([k, v]) => {
            if (typeof v === "number" && Number.isFinite(v)) r[k] = Math.min(100, Math.max(0, v));
          });
        }
        setRespuestas(r);
        yaCompleto.current = desCompleto(d);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const marcar = (key: string, valor: number) => {
    const next = { ...respuestas, [key]: valor };
    setRespuestas(next);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    const payload = { ...dataRef.current, des: { respuestas: next } };
    dataRef.current = payload;

    // El RESULTADO va a su propia tabla (`psicologia_des`), no al blob. Se manda
    // desde aquí —el mismo sitio donde se guarda la respuesta— para que no pueda
    // quedar desfasado de las respuestas que lo produjeron, y solo cuando cambia
    // alguna cifra: mover una respuesta no siempre mueve la media redondeada.
    const resultado = desResultado(payload);
    if (resultado && !desResultadoIgual(resultado, ultimoResultadoRef.current)) {
      ultimoResultadoRef.current = resultado;
      void guardarDesResultado(resultado);
    }
    savePromiseRef.current = axios.patch(
      `${API_URL}/metodo-psicologia/${userId}`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => { /* silencioso */ }).finally(() => setGuardando(false));

    // Al completar la última respuesta por primera vez, llevamos la vista al
    // botón de resultado con suavidad.
    if (desCompleto(payload) && !yaCompleto.current) {
      yaCompleto.current = true;
      setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 220);
    }
  };

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  const data: LineaDeVidaData = { ...dataRef.current, des: { respuestas } };
  const respondidas = desRespondidas(data);
  const total = desPreguntas.length;
  const completo = desCompleto(data);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.des")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 5, total: 26 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.resultadoAce")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/ace-resultado`) }}
              next={{
                label: `${t("metodo.psico.paso.desResultado")} →`,
                onClick: () => setComicOpen(true),
                disabled: !completo,
                disabledTooltip: t("metodo.psico.responderTodas"),
              }}
            />
          </Reveal>

          {/* ── Sobre el turquesa: subtítulo + progreso ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} w="100%" maxW="640px">
            <IntroRecorrido>{desIntro.subtituloTurquesa}</IntroRecorrido>

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

          {/* ── Las 28 frases · entran EN CASCADA, una tras otra ── */}
          <RevealStagger stagger={0.06} delayChildren={0.1} amount={0.15}
                         display="flex" flexDirection="column" w="100%" gap={{ base: 3.5, md: 4 }}>
            {desPreguntas.map((p, i) => {
              const elegido = respuestas[p.key];
              return (
                <RevealItem key={p.key} w="100%">
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column"
                        gap={{ base: 4, md: 5 }} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>

                    {/* Número + categoría + enunciado */}
                    <Box>
                      <Text color={`${TINTA}bb`} fontSize="2xs" fontWeight="700" letterSpacing="0.18em"
                            textTransform="uppercase" mb={1.5} style={{ textShadow: INK_SHADOW }}>
                        {i + 1} · {p.categoria}
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

                    {/* Regleta de porcentajes (los círculos del cuestionario en papel) */}
                    <Box>
                      <Box position="relative" px={1}>
                        {/* Carril */}
                        <Box position="absolute" left={2} right={2} top="50%" h="2px"
                             transform="translateY(-50%)" bg={`${TINTA}33`} borderRadius="full" />
                        {/* Once círculos como los del cuestionario en papel. El botón
                            es más alto que el círculo (área de toque decente en
                            móvil) y transparente: lo que se ve es el círculo. */}
                        <Flex position="relative" zIndex={1} align="center" justify="space-between">
                          {DES_VALORES.map((v) => {
                            const activo = elegido === v;
                            return (
                              <Box
                                key={v}
                                as="button"
                                onClick={() => marcar(p.key, v)}
                                title={`${v}%`}
                                aria-label={`${v}%`}
                                h={{ base: "38px", md: "44px" }}
                                w={activo ? { base: "28px", md: "38px" } : { base: "18px", md: "26px" }}
                                flexShrink={0}
                                display="flex" alignItems="center" justifyContent="center"
                                bg="transparent" cursor="pointer"
                                sx={{ "&:hover > div": { transform: "translateY(-2px)" } }}
                              >
                                <Box
                                  w="100%"
                                  h={activo ? { base: "28px", md: "38px" } : { base: "18px", md: "26px" }}
                                  borderRadius="full"
                                  display="flex" alignItems="center" justifyContent="center"
                                  bg={activo ? TINTA : "rgba(255,251,243,0.72)"}
                                  border={`1.5px solid ${activo ? TINTA : `${TINTA}55`}`}
                                  color={PAPEL}
                                  fontFamily="'EB Garamond', serif" fontWeight="700"
                                  fontSize={{ base: "9px", md: "xs" }}
                                  boxShadow={activo ? `0 3px 14px ${TINTA}66` : "none"}
                                  transition="all 0.18s"
                                >
                                  {activo ? v : ""}
                                </Box>
                              </Box>
                            );
                          })}
                        </Flex>
                      </Box>

                      {/* Extremos + lo elegido */}
                      <Flex align="baseline" justify="space-between" mt={2} gap={3}>
                        <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.75}
                              style={{ textShadow: INK_SHADOW }}>0% · {desIntro.nunca}</Text>
                        {elegido !== undefined && (
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
                                style={{ textShadow: INK_SHADOW }}>{elegido}%</Text>
                        )}
                        <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.75}
                              style={{ textShadow: INK_SHADOW }}>100% · {desIntro.siempre}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
                </RevealItem>
              );
            })}
          </RevealStagger>

          {guardando && (
            <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic">{t("metodo.psico.guardando")}</Text>
          )}

          {/* Crédito del instrumento, como el ACE cita el CDC-Kaiser */}
          <Text color="rgba(255,255,255,0.72)" fontSize="xs" fontStyle="italic" textAlign="center"
                lineHeight="1.7" maxW="560px">
            {desIntro.credito}
          </Text>

          {/* ── Al completar las 28: invitación a ver el resultado ── */}
          {completo && (
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%">
            <Box ref={resultadoRef} w="100%" scrollMarginTop={{ base: 4, md: 6 }}>
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                      gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 14, md: 20 }}>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.3"
                        style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.testTerminado")}</Text>
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                        maxW="520px" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.desTerminadoPie")}</Text>
                  <Box as="button" onClick={() => setComicOpen(true)}
                       position="relative" overflow="hidden" px={8} py={3} borderRadius="full"
                       bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif"
                       fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                    <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.verMiResultado")}</Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="des" />

      {/* Cómic «La desconexión» — se muestra entre el test y el resultado. Al
          terminarlo (o pulsar «Tu desconexión →») avanza a des-resultado. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={async () => { await savePromiseRef.current; await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/des-resultado`); }}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
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
