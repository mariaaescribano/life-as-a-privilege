import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  estadoDelAno,
  lineaCompleta,
  aniosRecorridos,
  anoNatural,
  tramosDeAnios,
  itemsDeRespuesta,
  preguntasDeAno,
  ANO_GESTACION,
  type LineaDeVidaData,
  type EstadoAno,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;          // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";                    // crema claro para el texto sobre tinta
const CREMA = "rgba(255,255,255,0.92)";    // texto sobre el fondo teal de la página
// Halo claro (crema + color de la disciplina) para despegar la tinta oscura del
// fondo de acuarela y que se lea bien.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// `motion(Box)` casteado: evita el choque de tipos entre el `transition` de
// Chakra (string) y el de framer (objeto). Se usa para «pintar» la timeline.
const MotionBox = motion(Box) as any;

export default function MetodoPsicologiaExperiencia() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [edadInput, setEdadInput] = useState("");
  const [, setGuardando] = useState(false);
  const guardadoRef = useRef<LineaDeVidaData>({});

  // Tramo visible de la timeline + año abierto (página de libro).
  const [tramoIdx, setTramoIdx] = useState(0);
  const [anoAbierto, setAnoAbierto] = useState<number | null>(null);
  // Popup de recomendación antes de avanzar sin haber rellenado toda la Vida, y
  // popup de reserva de llamada por si le resulta muy difícil.
  const [avisoOpen, setAvisoOpen] = useState(false);
  const [llamadaOpen, setLlamadaOpen] = useState(false);

  const anioActual = new Date().getFullYear();

  // La edad se pide en un popup bloqueante al entrar en la línea de Vida.
  const necesitaEdad = typeof data.edad !== "number";

  useLockBodyScroll(anoAbierto !== null || necesitaEdad || avisoOpen || llamadaOpen);

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
        setData(d);
        guardadoRef.current = JSON.parse(JSON.stringify(d));
        if (typeof d.edad === "number") setEdadInput(String(d.edad));
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Persiste el objeto `data` completo (la tabla guarda la columna entera).
  const persistir = async (next: LineaDeVidaData) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      guardadoRef.current = JSON.parse(JSON.stringify(next));
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const edad = typeof data.edad === "number" ? data.edad : 0;
  const tramos = useMemo(() => (edad > 0 ? tramosDeAnios(edad) : []), [edad]);
  const completa = edad > 0 && lineaCompleta(data, edad);
  const recorridos = edad > 0 ? aniosRecorridos(data, edad) : 0;
  // Basta con AL MENOS un año relleno (o marcado sin recuerdos) para poder
  // avanzar. Si no ha rellenado toda la Vida, antes de avanzar le recomendamos
  // hacerlo (popup) y le ofrecemos pedir una llamada.
  const puedeAvanzar = recorridos >= 1;

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  const guardarSiCambio = async () => {
    if (JSON.stringify(data) !== JSON.stringify(guardadoRef.current)) {
      await persistir(data);
    }
  };

  // ── Edad (popup bloqueante) ──
  const edadValida = (() => {
    const n = parseInt(edadInput, 10);
    return Number.isFinite(n) && n >= 1 && n <= 120;
  })();

  const confirmarEdad = async () => {
    const n = parseInt(edadInput, 10);
    if (!Number.isFinite(n) || n < 1 || n > 120) return;
    const next = { ...data, edad: n };
    setData(next);          // necesitaEdad pasa a false → el popup se cierra
    await persistir(next);
    setTramoIdx(0);
  };

  // ── Página de un año (popup tipo libro) ──
  const guardarAno = async (edadAno: number, estado: { respuestas: Record<string, string[]>; sinRecuerdos: boolean }) => {
    const anos = { ...(data.anos || {}) };
    const prev = anos[String(edadAno)] || {};
    // Conservamos `huella` (marca de Las Huellas) al guardar el año.
    anos[String(edadAno)] = { ...prev, respuestas: estado.respuestas, sinRecuerdos: estado.sinRecuerdos };
    const next = { ...data, anos };
    setData(next);
    await persistir(next);
  };

  // Pasar a «Las Huellas». Si ha rellenado toda su Vida, va directo. Si solo ha
  // rellenado algunos años, le mostramos primero un aviso que le recomienda
  // rellenar todo lo que pueda (o pedir una llamada si le resulta difícil).
  const irAHuellas = async () => {
    await guardarSiCambio();
    await flushSaves();
    if (completa) { navigate(`/metodo/psicologia/${exp.id}/huellas`); return; }
    setAvisoOpen(true);
  };

  // Continuar de todas formas desde el aviso.
  const continuarIgual = async () => {
    setAvisoOpen(false);
    await guardarSiCambio();
    await flushSaves();
    navigate(`/metodo/psicologia/${exp.id}/huellas`);
  };

  // Estilos de nodo por estado.
  const colorNodo = (estado: EstadoAno) =>
    estado === "completado"
      ? { bg: TINTA, color: PAPEL, border: TINTA, shadow: `0 0 16px ${TINTA}88, 0 0 30px ${TINTA}55`, op: 1 }
      : estado === "sin-recuerdos"
      ? { bg: `${TINTA}55`, color: PAPEL, border: `${TINTA}99`, shadow: `0 0 10px ${TINTA}44`, op: 0.92 }
      : { bg: "rgba(255,251,243,0.45)", color: `${TINTA}99`, border: `${TINTA}3a`, shadow: "none", op: 0.85 };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Línea de Vida"
                pageLabel="5/20"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Resultado ACE", onClick: async () => { await guardarSiCambio(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/ace-resultado`); } }}
                next={{ label: puedeAvanzar ? "Huellas →" : "Rellena al menos un año", onClick: irAHuellas, disabled: !puedeAvanzar, disabledTooltip: "Rellena al menos un año (o márcalo sin recuerdos) para continuar" }}
              />
            </Reveal>

            {/* ───────────────── LÍNEA DE VIDA ───────────────── */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Flex direction="column" align="center" w="100%" gap={6}>
                {/* Contenedor editorial de la timeline */}
                <Box
                  position="relative"
                  w="100%"
                  borderRadius="2xl"
                  overflow="hidden"
                  border={azulBorde}
                  boxShadow={glowPanel}
                >
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }} pt={{ base: 4, md: 6 }} pb={{ base: 8, md: 11 }}>

                    {/* Etiqueta del tramo */}
                    <Text textAlign="center" color={TINTA} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.18em" textTransform="uppercase" opacity={0.7} fontWeight="600" mb={{ base: 7, md: 9 }}>
                      {(() => {
                        const tr = tramos[tramoIdx];
                        if (!tr) return "";
                        const fin = tr[tr.length - 1];
                        return tr[0] === ANO_GESTACION ? `Antes de nacer – ${fin} años` : `Años ${tr[0]} – ${fin}`;
                      })()}
                    </Text>

                    {/* Nodos del tramo */}
                    <Flex align="flex-start" justify="center" wrap="nowrap">
                      {(tramos[tramoIdx] || []).map((edadAno, i, arr) => {
                        const estado = estadoDelAno(data, edadAno);
                        const est = colorNodo(estado);
                        const prevRecorrido = i > 0 ? estadoDelAno(data, arr[i - 1]) !== "vacio" : false;
                        const conectorOn = prevRecorrido && estado !== "vacio";
                        // La gestación no es un hito aparte: es el inicio de la Vida.
                        // Su conector con el año 0 va siempre encendido para que se
                        // lea como parte de él.
                        const esGestacionAAno0 = arr[i - 1] === ANO_GESTACION;
                        const conectorLit = conectorOn || esGestacionAAno0;
                        // Se «pinta» de izquierda a derecha: círculo, línea,
                        // círculo, línea… Cada elemento entra con un retraso
                        // incremental según su posición visual (nodo i = 2·i;
                        // conector previo = 2·i − 1). Se re-dibuja al cambiar de tramo.
                        const STEP = 0.13;
                        const BASE = 0.3;
                        const delayNodo = BASE + i * 2 * STEP;
                        const delayConector = BASE + (i * 2 - 1) * STEP;
                        return (
                          <React.Fragment key={edadAno}>
                            {i > 0 && (
                              <MotionBox
                                flex="1"
                                maxW={{ base: "26px", md: "52px" }}
                                h="2px"
                                mt={{ base: "21px", md: "27px" }}
                                bg={conectorLit ? TINTA : `${TINTA}30`}
                                boxShadow={conectorLit ? `0 0 8px ${TINTA}66` : "none"}
                                style={{ transformOrigin: "left center" }}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ delay: delayConector, duration: 0.3, ease: "easeOut" }}
                              />
                            )}
                            <MotionBox
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              gap={1.5}
                              flexShrink={0}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: delayNodo, duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
                            >
                              <Box
                                as="button"
                                onClick={() => setAnoAbierto(edadAno)}
                                w={{ base: "44px", md: "56px" }}
                                h={{ base: "44px", md: "56px" }}
                                borderRadius="full"
                                bg={est.bg}
                                color={est.color}
                                border={`2px solid ${est.border}`}
                                boxShadow={est.shadow}
                                opacity={est.op}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontFamily="'EB Garamond', serif"
                                fontWeight="700"
                                fontSize={{ base: "lg", md: "xl" }}
                                cursor="pointer"
                                transition="all 0.22s ease"
                                _hover={{ transform: "translateY(-3px)", boxShadow: `0 0 20px ${TINTA}99, 0 6px 18px rgba(94,45,16,0.3)` }}
                              >
                                {edadAno === ANO_GESTACION ? null : edadAno}
                              </Box>
                              <Text
                                color={TINTA}
                                fontSize={{ base: "2xs", md: "xs" }}
                                opacity={0.65}
                                textAlign="center"
                                lineHeight="1.15"
                                whiteSpace={edadAno === ANO_GESTACION ? "normal" : "nowrap"}
                                maxW={edadAno === ANO_GESTACION ? { base: "48px", md: "60px" } : undefined}
                                // Reservamos 2 líneas siempre (la etiqueta de gestación
                                // ocupa dos): así todos los tramos miden igual y el box
                                // no cambia de altura al pasar de un tramo a otro.
                                minH="2.3em"
                              >
                                {edadAno === ANO_GESTACION ? "Antes de nacer" : anoNatural(edad, edadAno, anioActual)}
                              </Text>
                            </MotionBox>
                          </React.Fragment>
                        );
                      })}
                    </Flex>

                    {/* Flechas inferiores para cambiar de tramo */}
                    {tramos.length > 1 && (
                      <Flex align="center" justify="center" gap={6} mt={{ base: 8, md: 10 }}>
                        <FlechaTramo dir="prev" disabled={tramoIdx === 0} onClick={() => setTramoIdx((i) => Math.max(0, i - 1))} />
                        <Text color={TINTA} fontSize="sm" opacity={0.7} letterSpacing="0.06em" minW="60px" textAlign="center">
                          {tramoIdx + 1} / {tramos.length}
                        </Text>
                        <FlechaTramo dir="next" disabled={tramoIdx === tramos.length - 1} onClick={() => setTramoIdx((i) => Math.min(tramos.length - 1, i + 1))} />
                      </Flex>
                    )}
                  </Box>
                </Box>

                {/* Progreso global de la Vida recorrida */}
                <Flex align="center" gap={3} w="100%" maxW="420px">
                  <Box flex="1" h="8px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                    <Box h="100%" w={`${(recorridos / (edad + 1)) * 100}%`} bg={PAPEL} borderRadius="full" boxShadow="0 0 12px rgba(255,255,255,0.5)" transition="width 0.5s ease" />
                  </Box>
                  <Text color={CREMA} fontSize="sm" opacity={0.9} whiteSpace="nowrap">{recorridos}/{edad + 1} años</Text>
                </Flex>

                {completa && (
                  <Text color={CREMA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" maxW="560px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}>
                    Has reconstruido tu Vida entera. Enhorabuena por no abandonarte.
                  </Text>
                )}

                {/* <GuardadoHint guardando={guardando} color={CREMA} /> */}

                {/* Recomendación discreta */}
                <Text color={CREMA} fontSize={{ base: "xs", md: "sm" }} opacity={0.78} fontStyle="italic" textAlign="center" maxW="520px" mt={2}>
                  Se recomienda buscar fotos de todas las edades de tu Vida.
                </Text>
              </Flex>
            </Reveal>

        </Flex>
      </Flex>

      {/* ───────────────── EDAD · popup bloqueante ───────────────── */}
      {necesitaEdad && (
        <Box
          position="fixed" inset={0} zIndex={2100}
          display="flex" alignItems="center" justifyContent="center"
          px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          fontFamily="'EB Garamond', serif"
        >
          <Box
            position="relative" w="100%" maxW="440px"
            borderRadius="2xl" overflow="hidden"
            border={`1px solid ${TINTA}44`}
            boxShadow={`0 0 44px ${TINTA}77, 0 0 100px ${TINTA}33`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 8, md: 10 }} py={{ base: 10, md: 12 }} textAlign="center">
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" mb={3} style={{ textShadow: INK_SHADOW }}>
                {exp.preguntaEdad.pregunta}
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.82} mb={8} maxW="360px" mx="auto" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                {exp.preguntaEdad.apoyo}
              </Text>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                autoFocus
                value={edadInput}
                onChange={(e) => setEdadInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && edadValida) void confirmarEdad(); }}
                placeholder={exp.preguntaEdad.placeholder || "Tu edad"}
                w="150px"
                textAlign="center"
                bg="rgba(255,251,243,0.45)"
                border={`1px solid ${TINTA}44`}
                color={TINTA}
                borderRadius="xl"
                size="lg"
                fontFamily="'EB Garamond', serif"
                fontSize="3xl"
                fontWeight="700"
                sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}55`, fontStyle: "italic", fontSize: "lg", fontWeight: 400 }}
                _hover={{ borderColor: `${TINTA}66` }}
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.6)" }}
              />
              <Box
                as="button"
                onClick={() => { if (edadValida) void confirmarEdad(); }}
                disabled={!edadValida}
                display="block"
                mx="auto"
                mt={8}
                px={10}
                py={3}
                borderRadius="full"
                bg={edadValida ? TINTA : `${TINTA}55`}
                color={PAPEL}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.06em"
                cursor={edadValida ? "pointer" : "not-allowed"}
                opacity={edadValida ? 1 : 0.7}
                boxShadow={edadValida ? `0 0 18px ${TINTA}66, 0 0 44px ${TINTA}33` : "none"}
                transition="all 0.2s"
                _hover={edadValida ? { transform: "translateY(-2px)", boxShadow: `0 0 26px ${TINTA}88, 0 0 60px ${TINTA}44` } : {}}
              >
                Mi línea de tiempo
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ───────────────── PÁGINA DE UN AÑO (popup tipo libro) ───────────────── */}
      {anoAbierto !== null && (
        <PaginaDeAno
          key={anoAbierto}
          edadAno={anoAbierto}
          anioNatural={anoNatural(edad, anoAbierto, anioActual)}
          preguntas={preguntasDeAno(exp, anoAbierto)}
          inicial={data.anos?.[String(anoAbierto)]}
          onCerrar={() => setAnoAbierto(null)}
          onGuardar={async (estado) => { await guardarAno(anoAbierto, estado); setAnoAbierto(null); }}
          onGuardarSinCerrar={async (estado) => { await guardarAno(anoAbierto, estado); }}
        />
      )}

      {/* ── AVISO antes de avanzar sin haber rellenado toda la Vida ── */}
      {avisoOpen && (
        <Box
          position="fixed" inset={0} zIndex={2200}
          display="flex" alignItems="center" justifyContent="center"
          px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setAvisoOpen(false)}
          fontFamily="'EB Garamond', serif"
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative" w="100%" maxW="480px"
            borderRadius="2xl" overflow="hidden"
            border={`1px solid ${TINTA}44`}
            boxShadow={`0 0 44px ${TINTA}55, 0 0 100px ${TINTA}28`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 10 }} py={{ base: 9, md: 11 }} textAlign="center">
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.3" mb={4} style={{ textShadow: INK_SHADOW }}>
                Antes de continuar
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92} mb={3} style={{ textShadow: INK_SHADOW }}>
                Cuanto más completes tu línea de Vida, más claro verás después tus huellas, tus nudos y tus heridas.
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92} mb={3} style={{ textShadow: INK_SHADOW }}>
                Rellénala entera, o todo lo que puedas.
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" fontStyle="italic" opacity={0.85} mb={7} style={{ textShadow: INK_SHADOW }}>
                Y si te resulta muy difícil recordar o remueve demasiado, no tienes que hacerlo solo: puedes pedir una llamada y lo hacemos juntos.
              </Text>

              <Flex direction="column" gap={3} align="stretch">
                <Box
                  as="button"
                  onClick={() => setAvisoOpen(false)}
                  py={3} borderRadius="full" bg={TINTA} color={PAPEL}
                  border={`1px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                  boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}
                >
                  Seguir rellenando
                </Box>
                <Box
                  as="button"
                  onClick={() => { setAvisoOpen(false); setLlamadaOpen(true); }}
                  py={3} borderRadius="full" bg="rgba(255,251,243,0.5)" color={TINTA}
                  border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: "rgba(255,251,243,0.75)", transform: "translateY(-1px)" }}
                >
                  Pedir una llamada
                </Box>
                <Box
                  as="button"
                  onClick={() => void continuarIgual()}
                  py={2} bg="transparent" color={`${TINTA}cc`}
                  fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.03em" cursor="pointer" textDecoration="underline"
                  _hover={{ color: TINTA }}
                >
                  Continuar de todas formas →
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Reserva de llamada (si le resulta difícil hacerlo solo) ── */}
      {llamadaOpen && (
        <Box
          position="fixed" inset={0} zIndex={2300}
          display="flex" alignItems="flex-start" justifyContent="center"
          px={{ base: 3, md: 10 }} py={{ base: 5, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setLlamadaOpen(false)}
          fontFamily="'EB Garamond', serif" overflowY="auto"
        >
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="640px" my="auto">
            <Box as="button" onClick={() => setLlamadaOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                 w="36px" h="36px" borderRadius="full"
                 bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                 display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                 _hover={{ bg: "#fff" }}>✕</Box>
            <AgendarLlamada
              color={neuropsicologiaTxt}
              bgColor={neuropsicologiaBg}
              disciplinaNom={neuropsicologiaNom}
              precio={60}
              titulo="¿Prefieres compañía?"
              subtitulo="Recorre tu línea de Vida conmigo. Agenda una llamada · horario peninsular España"
            />
          </Box>
        </Box>
      )}

      {/* El botón flotante de ayuda y la reserva acompañada los aporta ahora
          AyudaRecorrido (común a todo el recorrido). */}
      <AyudaRecorrido pagina="linea-de-Vida" />

      <SiteFooter />
    </Box>
  );
}

const FlechaTramo =({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) => (
  <Box
    as="button"
    onClick={disabled ? undefined : onClick}
    w="44px"
    h="44px"
    borderRadius="full"
    bg="rgba(255,251,243,0.55)"
    border={`1px solid ${TINTA}${disabled ? "22" : "55"}`}
    color={`${TINTA}${disabled ? "44" : "ff"}`}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize="xl"
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.5 : 1}
    transition="all 0.2s ease"
    _hover={disabled ? {} : { bg: "rgba(255,251,243,0.85)", borderColor: TINTA, transform: "translateY(-2px)", boxShadow: `0 0 14px ${AZUL}66, 0 0 30px ${AZUL}33` }}
  >
    {dir === "prev" ? "←" : "→"}
  </Box>
);

// ───────────────────────── Página de un año ─────────────────────────
function PaginaDeAno({
  edadAno,
  anioNatural,
  preguntas,
  inicial,
  onCerrar,
  onGuardar,
  onGuardarSinCerrar,
}: {
  edadAno: number;
  anioNatural: number;
  preguntas: { key: string; pregunta: string; apoyo?: string }[];
  inicial?: { sinRecuerdos?: boolean; respuestas?: Record<string, string[] | string> };
  onCerrar: () => void;
  onGuardar: (estado: { respuestas: Record<string, string[]>; sinRecuerdos: boolean }) => Promise<void> | void;
  onGuardarSinCerrar: (estado: { respuestas: Record<string, string[]>; sinRecuerdos: boolean }) => Promise<void> | void;
}) {
  // Cada pregunta guarda una LISTA de ítems (coerciona datos antiguos en string).
  const [respuestas, setRespuestas] = useState<Record<string, string[]>>(() => {
    const out: Record<string, string[]> = {};
    for (const p of preguntas) out[p.key] = itemsDeRespuesta(inicial?.respuestas?.[p.key]);
    return out;
  });
  // Texto en curso por pregunta (aún no añadido como ítem).
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [sinRecuerdos, setSinRecuerdos] = useState<boolean>(!!inicial?.sinRecuerdos);
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);

  const añadirItem = (key: string) => {
    const v = (draft[key] || "").trim();
    if (!v) return;
    setRespuestas((prev) => ({ ...prev, [key]: [...(prev[key] || []), v] }));
    setDraft((prev) => ({ ...prev, [key]: "" }));
    setGuardadoOk(false);
  };
  const quitarItem = (key: string, i: number) => {
    setRespuestas((prev) => ({ ...prev, [key]: (prev[key] || []).filter((_, idx) => idx !== i) }));
    setGuardadoOk(false);
  };
  const cambiarDraft = (key: string, v: string) => {
    setDraft((prev) => ({ ...prev, [key]: v }));
    setGuardadoOk(false);
  };

  // Vuelca lo que haya escrito sin pulsar Enter como un ítem más (no se pierde).
  const flushDrafts = (): Record<string, string[]> => {
    const next: Record<string, string[]> = { ...respuestas };
    let changed = false;
    for (const p of preguntas) {
      const d = (draft[p.key] || "").trim();
      if (d) { next[p.key] = [...(next[p.key] || []), d]; changed = true; }
    }
    if (changed) { setRespuestas(next); setDraft({}); }
    return next;
  };
  const estadoDe = (r: Record<string, string[]>) => {
    const algo = preguntas.some((p) => (r[p.key] || []).some((x) => x.trim().length > 0));
    return { respuestas: r, sinRecuerdos: sinRecuerdos && !algo ? true : sinRecuerdos };
  };

  const guardar = async () => {
    const r = flushDrafts();
    setGuardando(true);
    await onGuardar(estadoDe(r));
    setGuardando(false);
  };

  // Guarda sin cerrar el año, con feedback breve.
  const guardarSinCerrar = async () => {
    const r = flushDrafts();
    setGuardando(true);
    await onGuardarSinCerrar(estadoDe(r));
    setGuardando(false);
    setGuardadoOk(true);
  };

  // Marcar «Sin recuerdos» guarda y cierra el año directamente (sin tener que
  // pulsar luego «Guardar y cerrar»). Forzamos sinRecuerdos:true en el estado
  // porque setSinRecuerdos aún no se habrá aplicado en este mismo tick.
  const marcarSinRecuerdosYCerrar = async () => {
    const r = flushDrafts();
    setSinRecuerdos(true);
    setGuardando(true);
    await onGuardar({ respuestas: r, sinRecuerdos: true });
    setGuardando(false);
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={2000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 3, md: 10 }}
      py={{ base: 4, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      onClick={onCerrar}
      fontFamily="'EB Garamond', serif"
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW="720px"
        maxH={{ base: "calc(100vh - 32px)", md: "calc(100vh - 80px)" }}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow={`0 0 44px ${TINTA}77, 0 0 100px ${TINTA}33`}
        display="flex"
        flexDirection="column"
      >
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box
          as="button"
          onClick={onCerrar}
          position="absolute"
          top={3}
          right={3}
          zIndex={3}
          w="38px"
          h="38px"
          borderRadius="full"
          bg="rgba(255,251,243,0.7)"
          border={`1px solid ${TINTA}44`}
          color={TINTA}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="lg"
          cursor="pointer"
          _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}
        >
          ✕
        </Box>

        {/* Contenido scrollable — la página del libro */}
        <Box
          position="relative"
          zIndex={1}
          px={{ base: 6, md: 12 }}
          py={{ base: 9, md: 12 }}
          overflowY="auto"
          overscrollBehavior="contain"
          sx={{
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" },
          }}
        >
          {/* Encabezado del año (la gestación tiene su propio título) */}
          <Flex direction="column" align="center" textAlign="center" gap={1} mb={{ base: 7, md: 9 }}>
            {edadAno === ANO_GESTACION ? (
              <>
                <Text color={TINTA} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.15" style={{ textShadow: INK_SHADOW }}>
                  Antes de nacer
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7} style={{ textShadow: INK_SHADOW }}>
                  El embarazo de tu madre · {anioNatural}
                </Text>
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.8} maxW="440px" mt={2} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                  Tu historia empieza mucho antes de nacer.
                </Text>
              </>
            ) : (
              <>
                <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.1" style={{ textShadow: INK_SHADOW }}>
                  Año {edadAno}
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7} style={{ textShadow: INK_SHADOW }}>
                  {anioNatural}
                </Text>
              </>
            )}
            <Box mt={3} h="1px" w="120px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
          </Flex>

          {/* Preguntas — cada una en su box; las respuestas son una lista de
              ítems: escribe y pulsa Enter para añadir cada recuerdo. */}
          <Flex direction="column" gap={{ base: 5, md: 6 }}>
            {preguntas.map((p) => {
              const items = respuestas[p.key] || [];
              return (
                <Box
                  key={p.key}
                  borderRadius="xl"
                  px={{ base: 5, md: 6 }}
                  py={{ base: 4, md: 5 }}
                  bg="rgba(255,251,243,0.42)"
                  border={`1px solid ${TINTA}26`}
                >
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.5" mb={items.length ? 3 : 2} style={{ textShadow: INK_SHADOW }}>
                    {p.pregunta}
                  </Text>

                  {/* Lista de ítems añadidos */}
                  {items.length > 0 && (
                    <Flex direction="column" gap={1.5} mb={3}>
                      {items.map((it, i) => (
                        <Flex key={i} align="flex-start" gap={2.5} role="group">
                          <Box as="span" color={TINTA} opacity={0.55} mt="7px" flexShrink={0} fontSize="2xs">✦</Box>
                          <Text flex="1" color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6">
                            {it}
                          </Text>
                          <Box
                            as="button"
                            onClick={() => quitarItem(p.key, i)}
                            flexShrink={0}
                            mt="2px"
                            w="22px" h="22px"
                            borderRadius="full"
                            color={`${TINTA}88`}
                            fontSize="sm"
                            display="flex" alignItems="center" justifyContent="center"
                            opacity={0}
                            transition="opacity 0.15s, background 0.15s, color 0.15s"
                            _groupHover={{ opacity: 1 }}
                            _hover={{ bg: `${TINTA}14`, color: TINTA }}
                            aria-label="Quitar"
                          >
                            ✕
                          </Box>
                        </Flex>
                      ))}
                    </Flex>
                  )}

                  {/* Campo discreto: escribir + Enter añade un ítem */}
                  <Input
                    value={draft[p.key] || ""}
                    onChange={(e) => cambiarDraft(p.key, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); añadirItem(p.key); } }}
                    placeholder={items.length ? "Añade otro…" : "Escribe y pulsa Enter…"}
                    variant="unstyled"
                    color={TINTA}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "lg" }}
                    sx={{ caretColor: TINTA }}
                    _placeholder={{ color: `${TINTA}55`, fontStyle: "italic" }}
                  />
                  <Box h="1px" mt={2} bg={`${TINTA}22`} />
                </Box>
              );
            })}
          </Flex>

          {/* Acciones — fila horizontal estable: anchos fijos para que no se
              reordenen ni cambien de tamaño al guardar. */}
          <Flex direction="row" wrap="nowrap" align="center" justify="center" gap={{ base: 2, md: 3 }} mt={{ base: 12, md: 20 }} w="100%">
              <Box
                as="button"
                onClick={() => {
                  if (guardando) return;
                  // Ya marcado → desmarcar (sin cerrar). Sin marcar → marcar y
                  // guardar+cerrar directamente.
                  if (sinRecuerdos) { setSinRecuerdos(false); setGuardadoOk(false); }
                  else void marcarSinRecuerdosYCerrar();
                }}
                flexShrink={0}
                minW={{ base: "120px", md: "168px" }}
                px={{ base: 3, md: 5 }}
                py={3}
                borderRadius="full"
                bg={sinRecuerdos ? `${TINTA}` : "transparent"}
                color={sinRecuerdos ? PAPEL : TINTA}
                border={`1px solid ${TINTA}66`}
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "xs", md: "md" }}
                letterSpacing="0.03em"
                whiteSpace="nowrap"
                textAlign="center"
                cursor="pointer"
                transition="background 0.2s, border-color 0.2s, transform 0.2s"
                _hover={{ bg: sinRecuerdos ? `${TINTA}` : `${TINTA}14`, borderColor: TINTA }}
              >
                {sinRecuerdos ? "✓ Sin recuerdos" : "Sin recuerdos"}
              </Box>
              <Box
                as="button"
                onClick={guardando ? undefined : guardarSinCerrar}
                flexShrink={0}
                minW={{ base: "104px", md: "134px" }}
                px={{ base: 3, md: 5 }}
                py={3}
                borderRadius="full"
                bg="transparent"
                color={TINTA}
                border={`1.5px solid ${TINTA}`}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "xs", md: "md" }}
                letterSpacing="0.03em"
                whiteSpace="nowrap"
                textAlign="center"
                cursor={guardando ? "wait" : "pointer"}
                transition="background 0.2s, transform 0.2s"
                _hover={guardando ? {} : { bg: `${TINTA}14`, transform: "translateY(-1px)" }}
              >
                {guardando ? "Guardando…" : guardadoOk ? "Guardado ✓" : "Guardar"}
              </Box>
              <Box
                as="button"
                onClick={guardando ? undefined : guardar}
                flexShrink={0}
                px={{ base: 4, md: 8 }}
                py={3}
                borderRadius="full"
                bg={TINTA}
                color={PAPEL}
                border={`1px solid ${TINTA}`}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "xs", md: "lg" }}
                letterSpacing="0.04em"
                whiteSpace="nowrap"
                textAlign="center"
                cursor={guardando ? "wait" : "pointer"}
                opacity={guardando ? 0.7 : 1}
                boxShadow={`0 0 18px ${TINTA}66, 0 0 44px ${TINTA}33`}
                transition="transform 0.2s, box-shadow 0.2s, opacity 0.2s"
                _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 26px ${TINTA}88, 0 0 60px ${TINTA}44` }}
              >
                Guardar y cerrar
              </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
