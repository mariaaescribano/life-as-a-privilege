// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · REGULACIÓN (estimulación bilateral)  ·  8/13
//
// Un espacio de DESCARGA y regulación del sistema nervioso. NO es EMDR clínico
// ni sustituye a una terapia (así se le dice al usuario, sin ambigüedad).
//
//   1. Preparación · lugar seguro + la regla «trabaja con UNA cosa».
//   2. Durante · audio bilateral (auriculares) + escritura libre.
//
// Datos: data.regulacion.texto = string  (autoguardado con debounce).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Flex, Text, Textarea,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  REGULACION,
  REGULACION_AUDIO_SRC,
  type LineaDeVidaData,
  type RegulacionData,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const CREMA = "rgba(255,255,255,0.92)";
const ORO = "#caa24a";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// mm:ss a partir de segundos (para el reproductor).
function fmtTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function MetodoPsicologiaRegulacion() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState("");
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  // Audio de estimulación bilateral.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [duracion, setDuracion] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [volumen, setVolumen] = useState(0.85);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<string | null>(null);
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      if (okTimer.current) clearTimeout(okTimer.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
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
        setTexto(typeof d.regulacion?.texto === "string" ? d.regulacion.texto : "");
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: string): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const regulacion: RegulacionData = { ...(dataRef.current.regulacion || {}), texto: next };
      const data = { ...dataRef.current, regulacion };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
      if (montado.current) {
        setEstadoGuardado("ok");
        if (okTimer.current) clearTimeout(okTimer.current);
        okTimer.current = setTimeout(() => { if (montado.current) setEstadoGuardado("idle"); }, 2200);
      }
      return true;
    } catch {
      if (montado.current) setEstadoGuardado("idle");
      return false;
    }
  };

  const commit = (next: string) => {
    setTexto(next);
    setEstadoGuardado("guardando");
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current !== null) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  // Flush + pausa del audio al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current !== null) void persistir(pendiente.current);
    if (audioRef.current) audioRef.current.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Controles del reproductor ──
  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a || audioError) return;
    if (a.paused) { void a.play().catch(() => setAudioError(true)); }
    else { a.pause(); }
  };
  const reiniciar = () => {
    const a = audioRef.current;
    if (!a || audioError) return;
    a.currentTime = 0;
    setTiempo(0);
    void a.play().catch(() => setAudioError(true));
  };
  const buscar = (v: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = v;
    setTiempo(v);
  };
  const cambiarVolumen = (v: number) => {
    setVolumen(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const irAHeridas = () => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`);
  const irARelacion = () => navigate(`/metodo/psicologia/${exp.id}/integracion`);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* Elemento de audio (oculto). Sin loop: termina y se puede volver a poner. */}
      <Box
        as="audio"
        ref={audioRef as any}
        src={REGULACION_AUDIO_SRC}
        preload="metadata"
        display="none"
        onLoadedMetadata={(e: React.SyntheticEvent<HTMLAudioElement>) => {
          setDuracion(e.currentTarget.duration || 0);
          e.currentTarget.volume = volumen;
        }}
        onTimeUpdate={(e: React.SyntheticEvent<HTMLAudioElement>) => setTiempo(e.currentTarget.currentTime)}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        onEnded={() => { setReproduciendo(false); setTiempo(0); if (audioRef.current) audioRef.current.currentTime = 0; }}
        onError={() => setAudioError(true)}
      />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Regulación"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 8, total: 15 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Heridas", onClick: irAHeridas }}
              next={{ label: "Relación →", onClick: irARelacion }}
            />

            {/* Intro · reencuadre honesto (no es EMDR ni terapia) */}
            <Flex direction="column" align="center" gap={3} textAlign="center" maxW="640px">
              <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.7"
                    style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                {REGULACION.intro}
              </Text>
            </Flex>

            {/* Preparación · lugar seguro (texto directo sobre la acuarela, sin cajas) */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 8 }}>
                <Box mb={{ base: 6, md: 7 }}>
                  <SeccionTitulo>{REGULACION.preparacion.titulo}</SeccionTitulo>
                </Box>
                <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                  {REGULACION.preparacion.pasos.map((p, i) => (
                    <Flex key={i} align="flex-start" gap={3}>
                      <Box flexShrink={0} w="26px" h="26px" borderRadius="full" bg={TINTA} color={PAPEL}
                           display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="700" mt="2px"
                           style={{ boxShadow: `0 1px 6px ${neuropsicologiaBg}` }}>
                        {i + 1}
                      </Box>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                        {p}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* ── Reproductor del audio de estimulación bilateral ── */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 9 }}>
                <Flex direction="column" align="center" gap={{ base: 5, md: 6 }}>
                  <SeccionTitulo>Estimulación bilateral · usa auriculares </SeccionTitulo>

                  {audioError ? (
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.78}
                          textAlign="center" style={{ textShadow: INK_SHADOW }}>
                      El audio estará disponible muy pronto. Puedes escribir igualmente.
                    </Text>
                  ) : (
                    <>
                      {/* Botones: volver a empezar + play/pausa */}
                      <Flex align="center" justify="center" gap={{ base: 5, md: 7 }}>
                        <CircleBtn onClick={reiniciar} title="Volver a poner desde el principio" size="52px">
                          {/* icono replay */}
                          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="52%" h="52%" fill="currentColor">
                            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-820q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 105-114 172.5T480-160Z" />
                          </Box>
                        </CircleBtn>

                        <CircleBtn onClick={toggleAudio} title={reproduciendo ? "Pausar" : "Reproducir"} size="86px" fuerte>
                          {reproduciendo ? (
                            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="42%" h="42%" fill="currentColor">
                              <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Z" />
                            </Box>
                          ) : (
                            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="44%" h="44%" fill="currentColor" ml="5px">
                              <path d="M320-200v-560l440 280-440 280Z" />
                            </Box>
                          )}
                        </CircleBtn>
                      </Flex>

                      {/* Barra de progreso + tiempos */}
                      <Box w="100%" maxW="480px">
                        <Slider aria-label="Progreso del audio" value={tiempo} min={0}
                                max={duracion || 0} step={1} onChange={buscar} isDisabled={!duracion} focusThumbOnChange={false}>
                          <SliderTrack bg={`${TINTA}33`} h="6px" borderRadius="full">
                            <SliderFilledTrack bg={TINTA} />
                          </SliderTrack>
                          <SliderThumb boxSize="16px" bg={PAPEL} border={`2px solid ${TINTA}`}
                                       boxShadow={`0 0 10px ${TINTA}66`} _focusVisible={{ boxShadow: `0 0 0 3px ${ORO}55` }} />
                        </Slider>
                        <Flex justify="space-between" mt={1.5}>
                          <Text color={TINTA} fontSize="sm" fontWeight="600" opacity={0.85}>{fmtTime(tiempo)}</Text>
                          <Text color={TINTA} fontSize="sm" fontWeight="600" opacity={0.85}>{fmtTime(duracion)}</Text>
                        </Flex>
                      </Box>

                      {/* Volumen */}
                      <Flex align="center" gap={3} w="100%" maxW="320px">
                        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px"
                             fill={TINTA} flexShrink={0} opacity={0.85}>
                          <path d="M200-360v-240h160l200-200v640L360-360H200Z" />
                        </Box>
                        <Slider aria-label="Volumen" value={volumen} min={0} max={1} step={0.02}
                                onChange={cambiarVolumen} flex="1" focusThumbOnChange={false}>
                          <SliderTrack bg={`${TINTA}33`} h="5px" borderRadius="full">
                            <SliderFilledTrack bg={TINTA} />
                          </SliderTrack>
                          <SliderThumb boxSize="14px" bg={PAPEL} border={`2px solid ${TINTA}`}
                                       boxShadow={`0 0 8px ${TINTA}66`} _focusVisible={{ boxShadow: `0 0 0 3px ${ORO}55` }} />
                        </Slider>
                        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px"
                             fill={TINTA} flexShrink={0}>
                          <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm320-168L340-428v-104l100-100v304Z" />
                        </Box>
                      </Flex>
                    </>
                  )}
                </Flex>
              </Box>
            </Box>

            {/* Escritura de descarga */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 6, md: 8 }}>
                <Box mb={{ base: 5, md: 6 }}>
                  <SeccionTitulo>Suelta lo que necesites</SeccionTitulo>
                </Box>
                <Textarea
                  value={texto}
                  onChange={(e) => commit(e.target.value)}
                  placeholder={REGULACION.placeholder}
                  minH={{ base: "220px", md: "300px" }}
                  bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={4} py={3.5} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.9)" }}
                />
                <Flex justify="flex-end" mt={3}>
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                </Flex>
              </Box>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="regulacion" />

      <SiteFooter />
    </Box>
  );
}

// Cabecera de sección dentro de un box: título centrado + raya sólida a lo ancho.
function SeccionTitulo({ children }: { children: React.ReactNode }) {
  return (
    <Box w="100%">
      <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em"
            textAlign="center" style={{ textShadow: INK_SHADOW }}>
        {children}
      </Text>
      <Box mt={{ base: 3, md: 3.5 }} h="1px" w="100%" bg={`${TINTA}44`} />
    </Box>
  );
}

// Botón circular del reproductor, en estilo psicología (tinta sobre crema / lleno).
function CircleBtn({ children, onClick, title, size, fuerte }: {
  children: React.ReactNode; onClick: () => void; title: string; size: string; fuerte?: boolean;
}) {
  return (
    <Box as="button" onClick={onClick} title={title} aria-label={title}
         w={size} h={size} borderRadius="full"
         bg={fuerte ? TINTA : "rgba(255,251,243,0.72)"}
         color={fuerte ? PAPEL : TINTA}
         border={`2px solid ${TINTA}${fuerte ? "" : "66"}`}
         display="flex" alignItems="center" justifyContent="center" cursor="pointer"
         boxShadow={fuerte ? `0 0 22px ${TINTA}66, 0 0 50px ${TINTA}33` : `0 2px 10px ${neuropsicologiaBg}66`}
         transition="all 0.2s"
         _hover={{ transform: "translateY(-2px)",
                   boxShadow: fuerte ? `0 0 30px ${TINTA}88, 0 0 66px ${TINTA}44` : `0 4px 16px ${neuropsicologiaBg}88` }}>
      {children}
    </Box>
  );
}
