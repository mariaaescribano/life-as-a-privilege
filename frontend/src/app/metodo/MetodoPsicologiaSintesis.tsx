// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · SÍNTESIS  (última del recorrido · paso 20/20 · le sigue Ayurveda)
//
// El cierre de todo el camino: aquí la persona ve TODO lo que ha recorrido, de
// principio a fin y en solo lectura — su problema, lo que cargó (ACE), sus
// huellas, sus nudos, lo que le faltó, sus heridas, cómo se relaciona, sus
// miedos, sus dones, su compromiso y la carta que se escribió a su yo del
// futuro. No se edita nada: es el espejo completo del recorrido, para leerlo
// entero de una sola vez. Reúne, en el mismo orden, lo que también arma el PDF.
//
// Es también el paso que enlaza con Ayurveda (con el pago si aún no está
// desbloqueado), por ser el verdadero cierre del recorrido de psicología.
//
// Datos: solo LEE `metodo_psicologia.data` (no escribe nada).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import { generatePsicologiaPdf } from "../../utils/generatePsicologiaPdf";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  experienciaById,
  necesidadesNoCubiertas,
  aceScore,
  aceBanda,
  aceCompleto,
  MIEDOS_PREGUNTAS,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const ORO = "#c79a3c";            // dorado (los dones)
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

/** Todas las huellas marcadas a lo largo de la línea de vida (sin duplicar). */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const set = new Set<string>();
  for (const ano of Object.values(d.anos || {})) {
    for (const t of ano?.huellas || []) {
      const s = (t || "").trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set);
}

export default function MetodoPsicologiaSintesis() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [descargando, setDescargando] = useState(false);
  const [ayurvedaSuscrito, setAyurvedaSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    axios.get(`${API_URL}/payment/test/enabled`)
      .then((r) => setTestPagos(!!r.data?.enabled))
      .catch(() => {});

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }
        setAyurvedaSuscrito(!!me.data?.ayurveda_suscrito);

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(psi.data?.data || {});
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Enlace con Ayurveda: abre el pago si aún no está desbloqueado.
  const onAyurveda = () => {
    if (ayurvedaSuscrito) navigate("/metodo/ayurveda");
    else { setPagoError(null); setPagoOpen(true); }
  };

  const pagarAyurveda = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/ayurveda/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoError(
        status === 403
          ? "Necesitas completar el pago de Psicología antes de adquirir Ayurveda."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoLoading(false);
    }
  };

  const testUnlockAyurveda = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "ayurveda" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/metodo/ayurveda");
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const descargarPdf = async () => {
    setDescargando(true);
    try {
      await generatePsicologiaPdf(data);
    } catch {
      // silencioso
    } finally {
      setDescargando(false);
    }
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  // ── Recogida de TODO lo escrito (mismo orden y criterios que el PDF) ──
  const problemas = (typeof data["problema-actual"] === "string" ? (data["problema-actual"] as string) : "")
    .split(/\n+/).map((s) => s.trim()).filter(Boolean);

  const aceListo = aceCompleto(data);
  const score = aceListo ? aceScore(data) : 0;
  const banda = aceListo ? aceBanda(score) : null;

  const huellas = todasLasHuellas(data);
  const nudos = (data.nudos || []).map((n) => (n || "").trim()).filter(Boolean);
  const necesidades = necesidadesNoCubiertas(data);

  const heridas = (data.heridas || []).filter((h) => (h.titulo || "").trim() || (h.texto || "").trim());

  const relaciones = (data.constelaciones || []).filter(
    (c) => (c.titulo || "").trim() || (c.texto || "").trim() || (c.verdadSana || "").trim(),
  );

  const miedos = (data.miedos || []).filter((m) => (m.texto || "").trim());
  const dones = (data.dones?.lista || []).map((x) => (x.texto || "").trim()).filter(Boolean);

  const comp = data.compromiso || {};
  const hayCompromiso = (comp.necesitaste || "").trim() || (comp.dartelo || "").trim();

  const b = data.brujula || {};
  const brujulaMensaje = (b.mensaje || "").trim();
  const brujulaPreg: [string, string][] = [
    ["¿Qué herida se ha activado?", (b.herida || "").trim()],
    ["¿Qué necesidad hay debajo?", (b.necesidad || "").trim()],
    ["¿Qué miedo está hablando?", (b.miedo || "").trim()],
    ["¿Qué don puedes utilizar ahora?", (b.don || "").trim()],
  ].filter(([, v]) => v) as [string, string][];
  const hayBrujula = !!brujulaMensaje || brujulaPreg.length > 0;

  const nada =
    problemas.length === 0 && !aceListo && huellas.length === 0 && nudos.length === 0 &&
    necesidades.length === 0 && heridas.length === 0 && relaciones.length === 0 &&
    miedos.length === 0 && dones.length === 0 && !hayCompromiso && !hayBrujula;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 8 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Síntesis"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              maxW="100%"
              step={{ current: 20, total: 20 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Brújula", onClick: () => navigate(`/metodo/psicologia/${exp.id}/brujula`) }}
              next={{ label: "Ayurveda →", onClick: onAyurveda }}
            />

            {/* Intro */}
            <IntroRecorrido>
              Aquí está todo tu recorrido, de principio a fin. Desde el problema con el que
              llegaste hasta la carta que te escribiste. Léelo entero: esto eres tú, contándote a ti mismo.
            </IntroRecorrido>

            {nada ? (
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                    Aún no hay nada que sintetizar. A medida que recorras el camino, aquí aparecerá todo lo que escribas.
                  </Text>
                </Box>
              </Box>
            ) : (
              <>
                {/* 1 · De dónde vengo */}
                {problemas.length > 0 && (
                  <Seccion titulo="De dónde vengo">
                    <Flex direction="column" gap={{ base: 3, md: 4 }}>
                      {problemas.map((p, i) => (
                        <Cita key={i} texto={p} />
                      ))}
                    </Flex>
                  </Seccion>
                )}

                {/* 2 · Lo que cargué (ACE) */}
                {aceListo && banda && (
                  <Seccion titulo="Lo que cargué">
                    <Flex align="baseline" gap={2.5} wrap="wrap" mb={3}>
                      <Text color={ORO} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1"
                            style={{ textShadow: INK_SHADOW }}>
                        {score}<Text as="span" fontSize={{ base: "md", md: "lg" }} opacity={0.7}> / 10</Text>
                      </Text>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                        {banda.titulo}
                      </Text>
                    </Flex>
                    <Parrafo texto={banda.texto} />
                  </Seccion>
                )}

                {/* 3 · Lo que dejó huella */}
                {huellas.length > 0 && (
                  <Seccion titulo="Lo que dejó huella">
                    <Puntos items={huellas} />
                  </Seccion>
                )}

                {/* 4 · Los nudos */}
                {nudos.length > 0 && (
                  <Seccion titulo="Los nudos">
                    <Puntos items={nudos} />
                  </Seccion>
                )}

                {/* 5 · Lo que me faltó */}
                {necesidades.length > 0 && (
                  <Seccion titulo="Lo que me faltó">
                    <Chips items={necesidades} />
                  </Seccion>
                )}

                {/* 6 · Mis heridas */}
                {heridas.length > 0 && (
                  <Seccion titulo="Mis heridas">
                    <Flex direction="column" gap={{ base: 4, md: 5 }}>
                      {heridas.map((h) => {
                        const piezas = [...(h.huellas || []), ...(h.nudos || []), ...(h.necesidades || [])].filter(Boolean);
                        return (
                          <Cita key={h.id} titulo={(h.titulo || "").trim() || "Herida"} texto={(h.texto || "").trim()} piezas={piezas} />
                        );
                      })}
                    </Flex>
                  </Seccion>
                )}

                {/* 7 · Cómo me relaciono */}
                {relaciones.length > 0 && (
                  <Seccion titulo="Cómo me relaciono">
                    <Flex direction="column" gap={{ base: 4, md: 5 }}>
                      {relaciones.map((c) => {
                        const piezas = [
                          ...(c.nudos || []),
                          ...(c.arquetipos || []).map((a) => arquetipoLabel(a)),
                        ].filter(Boolean);
                        return (
                          <Box key={c.id}>
                            <Cita titulo={(c.titulo || "").trim() || "Relación"} texto={(c.texto || "").trim()} piezas={piezas} />
                            {(c.verdadSana || "").trim() && (
                              <Box pl={{ base: 4, md: 5 }} mt={2}>
                                <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.14em"
                                      textTransform="uppercase" opacity={0.7} mb={1}>
                                  Me comprometo a
                                </Text>
                                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="600" fontStyle="italic"
                                      lineHeight="1.5" style={{ textShadow: INK_SHADOW }}>
                                  «{(c.verdadSana as string).trim()}»
                                </Text>
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Flex>
                  </Seccion>
                )}

                {/* 8 · Mis miedos */}
                {miedos.length > 0 && (
                  <Seccion titulo="Mis miedos">
                    <Flex direction="column" gap={{ base: 6, md: 7 }}>
                      {miedos.map((m) => {
                        const respuestas = MIEDOS_PREGUNTAS
                          .map((p) => ({ pregunta: p.pregunta, resp: (m.respuestas?.[p.key] || "").trim() }))
                          .filter((x) => x.resp);
                        return (
                          <Box key={m.id}>
                            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.3" mb={respuestas.length ? 3 : 0}
                                  style={{ textShadow: INK_SHADOW }}>
                              {(m.texto || "").trim()}
                            </Text>
                            {respuestas.length > 0 && (
                              <Flex direction="column" gap={3} pl={{ base: 3, md: 4 }}>
                                {respuestas.map((x, i) => (
                                  <PreguntaRespuesta key={i} pregunta={x.pregunta} respuesta={x.resp} />
                                ))}
                              </Flex>
                            )}
                          </Box>
                        );
                      })}
                    </Flex>
                  </Seccion>
                )}

                {/* 9 · Mis dones */}
                {dones.length > 0 && (
                  <Seccion titulo="Mis dones">
                    <Flex wrap="wrap" gap={2.5}>
                      {dones.map((x, i) => (
                        <Box key={i} px={{ base: 4, md: 4.5 }} py={2} borderRadius="full"
                             bg={`${ORO}1f`} border={`1px solid ${ORO}88`}>
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
                        </Box>
                      ))}
                    </Flex>
                  </Seccion>
                )}

                {/* 10 · Mi compromiso conmigo mismo */}
                {hayCompromiso && (
                  <Seccion titulo="Mi compromiso conmigo mismo">
                    <Flex direction="column" gap={4}>
                      {(comp.necesitaste || "").trim() && (
                        <PreguntaRespuesta pregunta="¿Qué necesitaste que nadie pudo darte?" respuesta={(comp.necesitaste as string).trim()} />
                      )}
                      {(comp.dartelo || "").trim() && (
                        <PreguntaRespuesta pregunta="¿Cómo puedes empezar a dártelo hoy?" respuesta={(comp.dartelo as string).trim()} />
                      )}
                    </Flex>
                  </Seccion>
                )}

                {/* 11 · Mi brújula */}
                {hayBrujula && (
                  <Seccion titulo="Mi brújula">
                    <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7} mb={3}
                          style={{ textShadow: INK_SHADOW }}>
                      Para cuando vuelva a sentirme bloqueado:
                    </Text>
                    {brujulaMensaje ? (
                      <Cita texto={brujulaMensaje} />
                    ) : (
                      <Flex direction="column" gap={4}>
                        {brujulaPreg.map(([q, v], i) => (
                          <PreguntaRespuesta key={i} pregunta={q} respuesta={v} />
                        ))}
                      </Flex>
                    )}
                  </Seccion>
                )}

                {/* ── Descarga en PDF · CTA grande y elegante ── */}
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     border={`1px solid ${ORO}66`}
                     boxShadow={`0 0 0 1px ${ORO}22, 0 14px 46px rgba(94,45,16,0.28), 0 0 34px ${ORO}22`}
                     bgColor={neuropsicologiaBg}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  {/* Velo cálido para que resalte del resto de secciones */}
                  <Box position="absolute" inset={0} zIndex={1}
                       bgGradient={`linear(to-b, ${ORO}14, transparent 60%)`} pointerEvents="none" />
                  <Flex position="relative" zIndex={2} direction="column" align="center" gap={{ base: 5, md: 6 }}
                        px={{ base: 6, md: 12 }} py={{ base: 10, md: 14 }} textAlign="center">
                    {/* Sello con icono de descarga */}
                    <Flex align="center" justify="center" w={{ base: "60px", md: "72px" }} h={{ base: "60px", md: "72px" }}
                          borderRadius="full" bg={TINTA} border={`2px solid ${ORO}`} flexShrink={0}
                          boxShadow={`0 8px 24px rgba(94,45,16,0.4), 0 0 22px ${ORO}55`}>
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w={{ base: "30px", md: "36px" }} h={{ base: "30px", md: "36px" }} fill={PAPEL}>
                        <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                      </Box>
                    </Flex>

                    <Box>
                      <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.2"
                            style={{ textShadow: INK_SHADOW }}>
                        Llévate todo tu recorrido
                      </Text>
                      <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6"
                            mt={2} maxW="520px" mx="auto" style={{ textShadow: INK_SHADOW }}>
                        Descárgalo en un cuaderno en PDF, cuidado y bonito, para releerlo siempre que lo necesites.
                      </Text>
                    </Box>

                    <Box as="button" onClick={descargando ? undefined : descargarPdf} position="relative"
                         display="inline-flex" alignItems="center" justifyContent="center" gap={3}
                         px={{ base: 8, md: 12 }} py={{ base: 3.5, md: 4.5 }} borderRadius="full"
                         bg={TINTA} color={PAPEL} border={`1px solid ${ORO}aa`}
                         fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.03em"
                         cursor={descargando ? "wait" : "pointer"} opacity={descargando ? 0.8 : 1}
                         boxShadow={`0 10px 30px rgba(94,45,16,0.4), 0 0 26px ${ORO}44`} transition="all 0.2s"
                         _hover={descargando ? {} : { transform: "translateY(-3px)", boxShadow: `0 16px 40px rgba(94,45,16,0.5), 0 0 34px ${ORO}66` }}>
                      {!descargando && (
                        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                             w={{ base: "22px", md: "24px" }} h={{ base: "22px", md: "24px" }} fill={PAPEL} flexShrink={0}>
                          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                        </Box>
                      )}
                      {descargando ? "Preparando tu PDF…" : "Descargar mi recorrido"}
                    </Box>
                  </Flex>
                </Box>
              </>
            )}

            {/* Cierre */}
            <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.7" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              No mirabas tu historia para quedarte en ella, sino para transformarla. Este recorrido es la prueba de que ya empezaste.
            </Text>

          </Flex>
        </Flex>
      </Box>

      <PagoAyurvedaModal
        isOpen={pagoOpen}
        onClose={() => { setPagoOpen(false); setPagoError(null); }}
        onPagar={pagarAyurveda}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlockAyurveda : undefined}
      />

      <BotonCompania color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} disciplinaNom={neuropsicologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de psicología" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Piezas de presentación (solo lectura) — comparten el lenguaje visual del
// recorrido: panel de acuarela con tinta marrón, títulos con línea de corte.
// ─────────────────────────────────────────────────────────────────────────

// Una sección: su propio panel de acuarela, con título y línea de separación.
function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
         border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
        <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
              style={{ textShadow: INK_SHADOW }}>
          {titulo}
        </Text>
        <Box h="2px" w="52px" my={{ base: 3.5, md: 4 }} bg={`${TINTA}66`} borderRadius="full" />
        {children}
      </Box>
    </Box>
  );
}

// Párrafo suave (para textos interpretativos, p. ej. la banda ACE).
function Parrafo({ texto }: { texto: string }) {
  return (
    <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75"
          whiteSpace="pre-wrap" style={{ textShadow: INK_SHADOW }}>
      {texto}
    </Text>
  );
}

// Cita con barra vertical (heridas, relaciones, problemas, mensaje de la brújula).
function Cita({ titulo, texto, piezas }: { titulo?: string; texto: string; piezas?: string[] }) {
  return (
    <Box pl={{ base: 4, md: 5 }} borderLeft={`3px solid ${TINTA}66`}>
      {titulo && (
        <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.3" mb={1.5}
              style={{ textShadow: INK_SHADOW }}>
          {titulo}
        </Text>
      )}
      {texto && (
        <Text color={`${TINTA}ee`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
              whiteSpace="pre-wrap" style={{ textShadow: INK_SHADOW }}>
          {texto}
        </Text>
      )}
      {piezas && piezas.length > 0 && (
        <Flex wrap="wrap" gap={1.5} mt={2.5}>
          {piezas.map((p, i) => (
            <Box key={i} px={{ base: 2.5, md: 3 }} py={1} borderRadius="full"
                 bg="rgba(255,251,243,0.6)" border={`1px solid ${TINTA}30`}>
              <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} fontWeight="600" opacity={0.85} lineHeight="1.2">{p}</Text>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// Lista con viñetas.
function Puntos({ items }: { items: string[] }) {
  return (
    <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
      {items.map((it, i) => (
        <Flex key={i} align="flex-start" gap={3}>
          <Box flexShrink={0} w="7px" h="7px" borderRadius="full" bg={TINTA} mt={{ base: 2, md: 2.5 }} boxShadow={`0 0 6px ${TINTA}55`} />
          <Text color={`${TINTA}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
            {it}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

// Chips (necesidades no cubiertas).
function Chips({ items }: { items: string[] }) {
  return (
    <Flex wrap="wrap" gap={2.5}>
      {items.map((x, i) => (
        <Box key={i} px={{ base: 3.5, md: 4 }} py={2} borderRadius="full"
             bg="rgba(255,251,243,0.66)" border={`1px solid ${TINTA}33`}>
          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
        </Box>
      ))}
    </Flex>
  );
}

// Pregunta (etiqueta) + respuesta (cita con barra) — miedos, compromiso, brújula antigua.
function PreguntaRespuesta({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  return (
    <Box>
      <Text color={`${TINTA}cc`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={1.5}
            style={{ textShadow: INK_SHADOW }}>
        {pregunta}
      </Text>
      <Box pl={{ base: 4, md: 5 }} borderLeft={`3px solid ${TINTA}66`}>
        <Text color={`${TINTA}ee`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
              whiteSpace="pre-wrap" style={{ textShadow: INK_SHADOW }}>
          {respuesta}
        </Text>
      </Box>
    </Box>
  );
}
