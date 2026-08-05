// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · ENFRÉNTATE  ·  13/15
//
// El reverso de «Miedos». La página muestra los miedos como tarjetas limpias.
// Al tocar uno se abre un POPUP guiado tipo ritual: una pregunta por página,
// se avanza con flechas. Mirar el miedo de frente, uno cada vez.
//
// Datos: lee/escribe data.miedos[i].respuestas[key] (autoguardado con debounce).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { EjemplosPulsables } from "../../components/metodo/EjemplosPulsables";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  MIEDOS_PREGUNTAS,
  MIEDOS_ENFRENTAR_INTRO,
  miedoRespondidas,
  type LineaDeVidaData,
  type MiedoItem,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
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

export default function MetodoPsicologiaMiedosPreguntas() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [miedos, setMiedos] = useState<MiedoItem[]>([]);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<MiedoItem[] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setMiedos(Array.isArray(d.miedos) ? d.miedos : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Guardado SILENCIOSO: persistimos en segundo plano sin mostrar ningún
  // indicador («Guardando…» todo el rato resultaba agobiante). Los datos se
  // guardan igual; el usuario solo lo percibe al pulsar «Hecho» (que cierra el
  // popup y fuerza el guardado con flushGuardado).
  const persistir = async (next: MiedoItem[]): Promise<boolean> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return false;
    try {
      const data = { ...dataRef.current, miedos: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
      return true;
    } catch {
      return false;
    }
  };

  const commit = (next: MiedoItem[]) => {
    setMiedos(next);
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 800);
  };

  // Fuerza el guardado pendiente de inmediato (al cerrar el popup / «Hecho»).
  const flushGuardado = () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
  };

  // Flush al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRespuesta = (id: string, key: string, valor: string) =>
    commit(miedos.map((m) => (m.id === id ? { ...m, respuestas: { ...(m.respuestas || {}), [key]: valor } } : m)));

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  // Antes de navegar: fuerza el guardado pendiente y espera al flush.
  const irAMiedos = async () => { flushGuardado(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/miedos`); };
  const irAIntegracion = async () => { flushGuardado(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/mapa`); };

  const total = MIEDOS_PREGUNTAS.length;
  const abierto = miedos.find((m) => m.id === abiertoId) || null;
  // No se puede avanzar hasta que TODOS los miedos tengan TODAS sus preguntas
  // respondidas (y haya al menos un miedo nombrado).
  const todoRespondido = miedos.length > 0 && miedos.every((m) => miedoRespondidas(m) >= total);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Atrévete"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                step={{ current: 18, total: 23 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Miedos", onClick: irAMiedos }}
                next={{
                  label: "Integración →",
                  onClick: irAIntegracion,
                  disabled: !todoRespondido,
                  disabledTooltip: "Responde todas las preguntas de cada miedo para continuar.",
                }}
              />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{MIEDOS_ENFRENTAR_INTRO.intro}</IntroRecorrido>
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
            {miedos.length === 0 ? (
              // Estado vacío: aún no ha nombrado ningún miedo.
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                    Aún no has nombrado tus miedos. Vuelve a la página anterior para escribirlos.
                  </Text>
                  <Box as="button" onClick={irAMiedos} px={6} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)" }}>
                    Ir a Miedos →
                  </Box>
                </Flex>
              </Box>
            ) : (
              <>
  
                {/* Tarjetas de miedo · aparecen de una en una. Al tocar, se abre el popup guiado. */}
                <RevealStagger display="flex" flexDirection="column" w="100%" gap={{ base: 3.5, md: 4 }} stagger={0.1} delayChildren={0.1}>
                  {miedos.map((m) => {
                    const respondidas = miedoRespondidas(m);
                    const completo = respondidas >= total;
                    return (
                      <RevealItem key={m.id} direction="up" distance={26} scaleFrom={0.97} duration={0.5} w="100%">
                      <Box as="button" onClick={() => setAbiertoId(m.id)}
                           position="relative" w="100%" borderRadius="2xl" overflow="hidden" textAlign="left"
                           bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}
                           cursor="pointer" transition="transform 0.16s, filter 0.16s"
                           _hover={{ transform: "translateY(-2px)", filter: "brightness(1.04)" }}>
                        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                        <Flex position="relative" zIndex={1} align="center" gap={3}
                              px={{ base: 5, md: 7 }} py={{ base: 4, md: 5 }}>
                          <Text flex="1" minW={0} color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                                lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                            {m.texto}
                          </Text>
                          {/* Progreso */}
                          <Flex align="center" gap={2} flexShrink={0}>
                            <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                                  opacity={completo ? 1 : 0.65} style={{ textShadow: INK_SHADOW }}>
                              {completo ? "✓" : `${respondidas}/${total}`}
                            </Text>
                            <Box color={TINTA} opacity={0.8} transform="translateY(1px)">
                              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor">
                                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                              </Box>
                            </Box>
                          </Flex>
                        </Flex>
                      </Box>
                      </RevealItem>
                    );
                  })}
                </RevealStagger>
              </>
            )}
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      {/* ── POPUP GUIADO ── */}
      {abierto && (
        <PopupEnfrentar
          key={abierto.id}
          miedo={abierto}
          onUpdate={(key, v) => updateRespuesta(abierto.id, key, v)}
          onClose={() => { flushGuardado(); setAbiertoId(null); }}
        />
      )}

      <AyudaRecorrido pagina="miedos-preguntas" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup guiado: una pregunta por página, se avanza con flechas.
// ─────────────────────────────────────────────────────────────────────────
function PopupEnfrentar({ miedo, onUpdate, onClose }: {
  miedo: MiedoItem;
  onUpdate: (key: string, valor: string) => void;
  onClose: () => void;
}) {
  const preguntas = MIEDOS_PREGUNTAS;
  const total = preguntas.length;
  const [paso, setPaso] = useState(0);
  const esPrimero = paso === 0;
  const esUltimo = paso === total - 1;

  useLockBodyScroll(true);

  // Una pregunta por página: al cambiar de paso, subimos la vista y damos el foco.
  const cuerpoRef = useRef<HTMLDivElement | null>(null);
  const actualRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    // Al cambiar de pregunta, subimos la vista arriba del todo (se ve desde la
    // pregunta, no desde el recuadro) y damos el foco SIN volver a bajar la
    // vista al textarea (preventScroll).
    cuerpoRef.current?.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => actualRef.current?.focus({ preventScroll: true }), 220);
    return () => clearTimeout(t);
  }, [paso]);

  const anterior = () => setPaso((i) => Math.max(0, i - 1));
  const siguiente = () => { if (esUltimo) onClose(); else setPaso((i) => Math.min(total - 1, i + 1)); };

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 3, md: 10 }} py={{ base: 4, md: 10 }} bg="rgba(0,0,0,0.82)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "500px" }}
           // Altura FIJA: el popup mide siempre lo mismo, no cambia según lo larga
           // que sea la pregunta (el cuerpo hace scroll interno si hace falta).
           h={{ base: "calc(100vh - 48px)", md: "600px" }}
           maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* Cabecera: el miedo, separado por una raya sólida a lo ancho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderBottom={`1px solid ${TINTA}55`}
             px={{ base: 6, md: 9 }} pt={{ base: 6, md: 7 }} pb={{ base: 3.5, md: 4 }}>
          <Flex direction="column" align="center" textAlign="center" gap={0.5}>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.25"
                  style={{ textShadow: INK_SHADOW }}>
              {miedo.texto}
            </Text>
          </Flex>
        </Box>

        {/* Cuerpo scrollable: la conversación con el guía, acumulativa */}
        <Box ref={cuerpoRef} position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}
             sx={{ scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "8px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          {(() => {
            const q = preguntas[paso];
            const respuesta = miedo.respuestas?.[q.key] || "";
            return (
              <Box>
                {/* La pregunta */}
                <Box>
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.35"
                        style={{ textShadow: INK_SHADOW }}>
                    {q.pregunta}
                  </Text>
                  {q.apoyo && (
                    <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.78} mt={1}
                          style={{ textShadow: INK_SHADOW }}>
                      {q.apoyo}
                    </Text>
                  )}
                </Box>

                {/* La respuesta */}
                <Textarea
                  ref={actualRef}
                  value={respuesta}
                  onChange={(e) => onUpdate(q.key, e.target.value)}
                  placeholder={q.placeholder || "Escribe aquí…"}
                  mt={4}
                  minH={{ base: "120px", md: "150px" }}
                  bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                  sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
                />

                {/* Ejemplos: a veces no hay palabras y ayuda que te den opciones.
                    Van en el hueco que YA queda bajo el recuadro (el popup no
                    crece: alto y ancho siguen fijos), así que solo se pintan los
                    que caben. Misma pieza que en «Integración». */}
                <EjemplosPulsables
                  ejemplos={q.ejemplos || []}
                  respuesta={respuesta}
                  onElegir={(ej) => {
                    const actual = respuesta.trim();
                    onUpdate(q.key, actual ? `${actual}\n${ej}` : ej);
                    actualRef.current?.focus({ preventScroll: true });
                  }}
                />

              </Box>
            );
          })()}
        </Box>

        {/* Footer: navegación abajo del todo + autoguardado */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 6, md: 9 }} pt={{ base: 3.5, md: 4 }} pb={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            <Box as="button" onClick={anterior} disabled={esPrimero}
                 px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                 border={`1.5px solid ${TINTA}${esPrimero ? "22" : "88"}`}
                 color={esPrimero ? `${TINTA}44` : TINTA}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 cursor={esPrimero ? "not-allowed" : "pointer"} transition="all 0.18s"
                 _hover={esPrimero ? {} : { bg: `${TINTA}14` }}>
              ‹ Anterior
            </Box>

            <Flex align="center" gap={2.5} flexShrink={0}>
              <Text color={TINTA} fontSize="xs" fontWeight="600" opacity={0.6}>{paso + 1} / {total}</Text>
            </Flex>

            <Box as="button" onClick={siguiente}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
              {esUltimo ? "Hecho ✓" : "Siguiente ›"}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
