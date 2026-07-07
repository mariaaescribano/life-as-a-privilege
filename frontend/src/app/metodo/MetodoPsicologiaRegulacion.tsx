// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · REGULACIÓN (estimulación bilateral)  ·  8/13
//
// Un espacio de DESCARGA y regulación del sistema nervioso, con contención por
// diseño. NO es EMDR clínico ni sustituye a una terapia (así se le dice al
// usuario, sin ambigüedad).
//
// Marco de seguridad, imitando lo que hace un terapeuta:
//   1. Preparación · lugar seguro + la regla «trabaja con UNA cosa».
//   2. Durante · audio bilateral (auriculares) + escritura libre, con un botón
//      «Necesito parar» SIEMPRE visible que pausa el audio y abre el cierre.
//   3. Cierre · grounding (respiración + 5-4-3-2-1) para volver al presente.
//
// Datos: data.regulacion.texto = string  (autoguardado con debounce).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
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

  // Cierre de grounding (overlay). Se abre desde «Necesito parar» o al terminar.
  const [cierreAbierto, setCierreAbierto] = useState(false);

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

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a || audioError) return;
    if (a.paused) { void a.play().catch(() => setAudioError(true)); }
    else { a.pause(); }
  };

  const pausarAudio = () => { if (audioRef.current) audioRef.current.pause(); };

  // «Necesito parar»: pausa el audio y abre el cierre de grounding.
  const necesitoParar = () => {
    pausarAudio();
    setCierreAbierto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const irAHeridas = () => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`);
  const irARelacion = () => navigate(`/metodo/psicologia/${exp.id}/integracion`);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* Elemento de audio (oculto). Loop: la estimulación se mantiene mientras escribe. */}
      <Box
        as="audio"
        ref={audioRef as any}
        src={REGULACION_AUDIO_SRC}
        loop
        preload="auto"
        display="none"
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
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
              step={{ current: 8, total: 13 }}
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

            {/* Preparación · lugar seguro */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 8 }}>
                <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                      textTransform="uppercase" textAlign="center" opacity={0.8} mb={{ base: 5, md: 6 }}
                      style={{ textShadow: INK_SHADOW }}>
                  {REGULACION.preparacion.titulo}
                </Text>
                <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
                  {REGULACION.preparacion.pasos.map((p, i) => (
                    <Flex key={i} align="flex-start" gap={3} borderRadius="xl"
                          bg="rgba(255,251,243,0.6)" border={`1px solid ${TINTA}26`}
                          px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }}>
                      <Box flexShrink={0} w="24px" h="24px" borderRadius="full" bg={TINTA} color={PAPEL}
                           display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="700" mt="1px">
                        {i + 1}
                      </Box>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.55">{p}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* Reproductor del audio de estimulación bilateral */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 8 }}>
                <Flex direction="column" align="center" gap={4} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                        textTransform="uppercase" opacity={0.8} style={{ textShadow: INK_SHADOW }}>
                    Estimulación bilateral · usa auriculares
                  </Text>

                  {audioError ? (
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.78}
                          style={{ textShadow: INK_SHADOW }}>
                      El audio estará disponible muy pronto. Puedes escribir igualmente.
                    </Text>
                  ) : (
                    <>
                      {/* Botón play/pause */}
                      <Box as="button" onClick={toggleAudio} w={{ base: "78px", md: "92px" }} h={{ base: "78px", md: "92px" }}
                           borderRadius="full" bg={TINTA} color={PAPEL} display="flex" alignItems="center" justifyContent="center"
                           cursor="pointer" boxShadow={`0 0 22px ${TINTA}66, 0 0 50px ${TINTA}33`} transition="all 0.2s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 30px ${TINTA}88, 0 0 66px ${TINTA}44` }}
                           aria-label={reproduciendo ? "Pausar" : "Reproducir"}>
                        {reproduciendo ? (
                          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="42%" h="42%" fill="currentColor">
                            <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Z" />
                          </Box>
                        ) : (
                          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="44%" h="44%" fill="currentColor" ml="4px">
                            <path d="M320-200v-560l440 280-440 280Z" />
                          </Box>
                        )}
                      </Box>
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.85}>
                        {reproduciendo ? "Sonando… deja que el sonido te acompañe mientras escribes." : "Pulsa para empezar cuando estés listo."}
                      </Text>
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

            {/* Cierre suave · disponible siempre para terminar en calma */}
            <Box as="button" onClick={() => setCierreAbierto(true)} px={7} py={2.5} borderRadius="full"
                 bg="transparent" color={CREMA} border="1.5px solid rgba(255,255,255,0.55)"
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                 _hover={{ bg: "rgba(255,255,255,0.12)", transform: "translateY(-1px)" }}>
              Hacer el cierre y volver al presente
            </Box>

          </Flex>
        </Flex>
      </Box>

      {/* ── Botón «Necesito parar» — SIEMPRE visible (flotante, abajo centro) ── */}
      {!cierreAbierto && (
        <Box position="fixed" bottom={{ base: 4, md: 6 }} left="50%" transform="translateX(-50%)" zIndex={30}>
          <Box as="button" onClick={necesitoParar} px={{ base: 6, md: 8 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
               bg={PAPEL} color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="800"
               fontSize={{ base: "sm", md: "md" }} letterSpacing="0.05em" cursor="pointer"
               border={`2px solid ${TINTA}`} boxShadow="0 6px 24px rgba(0,0,0,0.4)"
               transition="all 0.18s" _hover={{ transform: "translateY(-2px)", boxShadow: "0 10px 32px rgba(0,0,0,0.5)" }}>
            ✋ {REGULACION.botonParar}
          </Box>
        </Box>
      )}

      {/* ── Cierre de grounding (overlay) ── */}
      {cierreAbierto && (
        <Box position="fixed" inset={0} zIndex={2200} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(40,20,8,0.78)"
             sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
             fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box position="relative" w="100%" maxW="520px" my="auto" borderRadius="2xl" overflow="hidden"
               boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 9, md: 12 }} textAlign="center">
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" mb={2}
                    style={{ textShadow: INK_SHADOW }}>
                {REGULACION.cierre.titulo}
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.9} lineHeight="1.7" mb={6}
                    style={{ textShadow: INK_SHADOW }}>
                {REGULACION.cierre.intro}
              </Text>

              <Box borderRadius="xl" bg="rgba(255,251,243,0.66)" border={`1px solid ${TINTA}33`}
                   px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }} mb={5}>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" fontStyle="italic" lineHeight="1.6" mb={4}>
                  {REGULACION.cierre.respiracion}
                </Text>
                <Flex direction="column" gap={2}>
                  {REGULACION.cierre.grounding.map((g, i) => (
                    <Flex key={i} align="center" gap={2.5}>
                      <Box as="span" color={ORO} fontSize="sm" flexShrink={0}>✦</Box>
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.5" textAlign="left">{g}</Text>
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
