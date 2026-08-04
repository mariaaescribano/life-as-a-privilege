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
import { BotonGuardar } from "../../components/global/BotonGuardar";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  REGULACION,
  REGULACION_AUDIO_SRC,
  type LineaDeVidaData,
  type RegulacionData,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const ORO = "#caa23c";            // dorado suave para los detalles del cierre
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
  // La persona puede añadir tantos fragmentos como quiera, uno debajo de otro.
  const [fragmentos, setFragmentos] = useState<string[]>([""]);
  // Cierre de grounding (popup): volver al presente antes de salir.
  const [cierreAbierto, setCierreAbierto] = useState(false);
  useLockBodyScroll(cierreAbierto);
  const dataRef = useRef<LineaDeVidaData>({});

  // Audio de estimulación bilateral.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [duracion, setDuracion] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [volumen, setVolumen] = useState(0.85);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<string[] | null>(null);
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);

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
        // Migración: si ya hay fragmentos, los usamos; si no, arrancamos con el
        // texto legado (un único bloque) o con un box vacío para empezar.
        const frags = d.regulacion?.fragmentos;
        if (Array.isArray(frags) && frags.length > 0) {
          setFragmentos(frags);
        } else {
          const legado = typeof d.regulacion?.texto === "string" ? d.regulacion.texto : "";
          setFragmentos(legado ? [legado] : [""]);
        }
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: string[]): Promise<boolean> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return false;
    try {
      // Guardamos los fragmentos y, por compatibilidad, una copia unificada en `texto`.
      const regulacion: RegulacionData = {
        ...(dataRef.current.regulacion || {}),
        fragmentos: next,
        texto: next.filter((t) => t.trim()).join("\n\n"),
      };
      const data = { ...dataRef.current, regulacion };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
      return true;
    } catch {
      return false;
    }
  };

  // Autoguardado silencioso mientras escribe (respaldo); el guardado explícito lo
  // hace el botón «Guardar».
  const commit = (next: string[]) => {
    setFragmentos(next);
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current !== null) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  // Editar el fragmento i.
  const editarFragmento = (i: number, valor: string) =>
    commit(fragmentos.map((f, idx) => (idx === i ? valor : f)));

  // Añadir un box vacío al final.
  const anadirFragmento = () => commit([...fragmentos, ""]);

  // Quitar un fragmento (dejando siempre al menos uno).
  const quitarFragmento = (i: number) => {
    const next = fragmentos.filter((_, idx) => idx !== i);
    commit(next.length > 0 ? next : [""]);
  };

  // Guardado explícito (botón): vuelca lo pendiente y persiste de inmediato.
  const guardarAhora = async (): Promise<boolean> => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    pendiente.current = null;
    return persistir(fragmentos);
  };

  // «Hacer el cierre»: guarda también lo escrito y abre el popup de grounding.
  const hacerCierre = async () => {
    await guardarAhora();
    setCierreAbierto(true);
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

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  const irAHeridas = async () => { await guardarAhora(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/heridas-lista`); };
  const irARelacion = async () => { await guardarAhora(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/integracion`); };

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

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Narra"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 13, total: 22 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Heridas", onClick: irAHeridas }}
              next={{ label: "Relación →", onClick: irARelacion }}
            />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <IntroRecorrido>{REGULACION.intro}</IntroRecorrido>
            </Reveal>

            {/* «Antes de empezar» (preparación) ya no vive aquí: se abre como popup
                desde el botón «Orientación» (ver AyudaRecorrido). */}

            {/* ── Reproductor del audio de estimulación bilateral ── */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%">
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
                                       boxShadow={`0 0 10px ${TINTA}66`} _focusVisible={{ boxShadow: `0 0 0 3px ${TINTA}55` }} />
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
                                       boxShadow={`0 0 8px ${TINTA}66`} _focusVisible={{ boxShadow: `0 0 0 3px ${TINTA}55` }} />
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
            </Reveal>

            {/* Escritura de descarga */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.42} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 6, md: 8 }}>
                <Box mb={{ base: 5, md: 6 }}>
                  <SeccionTitulo>Junta los fragmentos de tus recuerdos. Pon en palabras tu dolor para darle sentido y empezar a integrarlo.</SeccionTitulo>
                </Box>

                {/* Fragmentos: cada uno es un box de altura fija; si el texto lo
                    supera, hace scroll vertical dentro del propio box. */}
                <Flex direction="column" gap={{ base: 4, md: 5 }}>
                  {fragmentos.map((frag, i) => (
                    <Box key={i} position="relative">
                      <Textarea
                        value={frag}
                        onChange={(e) => editarFragmento(i, e.target.value)}
                        placeholder={i === 0 ? REGULACION.placeholder : "Escribe lo que recuerdes…"}
                        h={{ base: "180px", md: "220px" }}
                        maxH={{ base: "180px", md: "220px" }}
                        resize="none"
                        bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}3a`} color={TINTA}
                        borderRadius="lg" pl={4} pr={fragmentos.length > 1 ? 12 : 4} py={3.5}
                        fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                        sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                              "&::-webkit-scrollbar": { width: "8px" },
                              "&::-webkit-scrollbar-track": { background: "transparent" },
                              "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                        _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                        _hover={{ borderColor: `${TINTA}55` }}
                        _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.9)" }}
                      />
                      {fragmentos.length > 1 && (
                        <Box as="button" onClick={() => quitarFragmento(i)} title="Quitar este fragmento"
                             position="absolute" top={2.5} right={2.5} w="26px" h="26px" borderRadius="full"
                             bg={`${PAPEL}cc`} color={TINTA} border={`1px solid ${TINTA}33`}
                             display="flex" alignItems="center" justifyContent="center"
                             fontSize="12px" cursor="pointer" transition="all 0.16s"
                             _hover={{ bg: TINTA, color: PAPEL }}>✕</Box>
                      )}
                    </Box>
                  ))}
                </Flex>

                {/* Añadir otro fragmento */}
                <Flex justify="center" mt={{ base: 4, md: 5 }}>
                  <Box as="button" onClick={anadirFragmento} px={6} py={2.5} borderRadius="full"
                       bg="rgba(255,251,243,0.72)" color={TINTA} border={`1.5px dashed ${TINTA}66`}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.03em" cursor="pointer" transition="all 0.18s"
                       _hover={{ bg: "rgba(255,251,243,0.92)", borderColor: TINTA, transform: "translateY(-2px)" }}>
                    + Añadir
                  </Box>
                </Flex>

                <Flex justify="flex-end" align="center" gap={3} mt={{ base: 5, md: 6 }} wrap="wrap">
                  {/* «Hacer el cierre» — a la izquierda de Guardar; al pulsarlo guarda también */}
                  <Box as="button" onClick={() => void hacerCierre()} px={7} py={2.5} borderRadius="full"
                       bg="rgba(255,251,243,0.72)" color={TINTA} border={`1.5px solid ${TINTA}66`}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.03em" cursor="pointer" transition="all 0.18s"
                       _hover={{ bg: "rgba(255,251,243,0.92)", borderColor: TINTA, transform: "translateY(-2px)" }}>
                    Hacer el cierre
                  </Box>
                  <BotonGuardar onSave={guardarAhora} bg={TINTA} fg={neuropsicologiaBg}
                                minW="150px" px={7} py={2.5} fontSize={{ base: "sm", md: "md" }} />
                </Flex>
              </Box>
            </Box>
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      {/* ── Cierre de grounding · popup para volver al presente ── */}
      {cierreAbierto && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setCierreAbierto(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="520px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 9, md: 12 }} textAlign="center"
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto"
                 sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "9999px" } }}>
              <Box as="button" onClick={() => setCierreAbierto(false)} position="absolute" top={3} right={3} zIndex={2}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>

              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" pr={6} mb={2}
                    style={{ textShadow: INK_SHADOW }}>
                {REGULACION.cierre.titulo}
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.9} lineHeight="1.7" mb={6}
                    style={{ textShadow: INK_SHADOW }}>
                {REGULACION.cierre.intro}
              </Text>

              <Box borderRadius="xl" bg="rgba(255,251,243,0.66)" border={`1px solid ${TINTA}33`}
                   px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }} mb={5} textAlign="left"
                   sx={{ backdropFilter: "blur(4px)" }}>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" fontStyle="italic"
                      lineHeight="1.6" mb={4} textAlign="center">
                  {REGULACION.cierre.respiracion}
                </Text>
                <Flex direction="column" gap={2.5}>
                  {REGULACION.cierre.grounding.map((g, i) => (
                    <Flex key={i} align="center" gap={2.5}>
                      <Box as="span" color={ORO} fontSize="sm" flexShrink={0}
                           style={{ textShadow: `0 0 8px ${ORO}66` }}>✦</Box>
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.5">{g}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>

              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6" mb={7}
                    style={{ textShadow: INK_SHADOW }}>
                {REGULACION.cierre.frase}
              </Text>

              <Box as="button" onClick={() => setCierreAbierto(false)} px={9} py={3} borderRadius="full"
                   bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                   fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" cursor="pointer"
                   boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
                   _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>
                Estoy mejor
              </Box>
            </Box>
          </Box>
        </Box>
      )}

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
