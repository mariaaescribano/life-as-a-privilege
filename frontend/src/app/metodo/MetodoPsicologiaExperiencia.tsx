import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  estadoDelAno,
  lineaCompleta,
  aniosRecorridos,
  anoNatural,
  tramosDeAnios,
  type LineaDeVidaData,
  type EstadoAno,
} from "../../components/metodo/psicologiaRecorrido";
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
const INK_SHADOW = `0 1px 2px rgba(94,45,16,0.18)`;

// Fases de la experiencia «Línea de Vida». La edad ya no es una fase: se pide
// en un popup bloqueante al entrar en la línea de vida.
const FASE = { PROBLEMA: 0, LINEA: 1 } as const;

export default function MetodoPsicologiaExperiencia() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [fase, setFase] = useState<number>(FASE.PROBLEMA);
  const [edadInput, setEdadInput] = useState("");
  const [guardando, setGuardando] = useState(false);
  const guardadoRef = useRef<LineaDeVidaData>({});

  // Tramo visible de la timeline + año abierto (página de libro).
  const [tramoIdx, setTramoIdx] = useState(0);
  const [anoAbierto, setAnoAbierto] = useState<number | null>(null);
  const [transicionOpen, setTransicionOpen] = useState(false);

  const anioActual = new Date().getFullYear();

  // La edad se pide en un popup bloqueante al entrar en la línea de vida.
  const necesitaEdad = fase === FASE.LINEA && typeof data.edad !== "number";

  useLockBodyScroll(anoAbierto !== null || transicionOpen || necesitaEdad);

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

        // Arranca donde lo dejó. Si ya escribió el problema, va a la línea de
        // vida (el popup de edad aparece allí si todavía no la ha indicado).
        const problemaEscrito =
          typeof d["problema-actual"] === "string" && (d["problema-actual"] as string).trim().length > 0;
        setFase(problemaEscrito ? FASE.LINEA : FASE.PROBLEMA);
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

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  // ── Fase 0 · problema ──
  const problema = (data["problema-actual"] as string) || "";
  const setProblema = (t: string) => setData((p) => ({ ...p, "problema-actual": t }));

  const guardarSiCambio = async () => {
    if (JSON.stringify(data) !== JSON.stringify(guardadoRef.current)) {
      await persistir(data);
    }
  };

  const avanzarDesdeProblema = async () => {
    await guardarSiCambio();
    setFase(FASE.LINEA); // si no hay edad, el popup bloqueante aparecerá aquí
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  const guardarAno = async (edadAno: number, estado: { respuestas: Record<string, string>; sinRecuerdos: boolean }) => {
    const anos = { ...(data.anos || {}) };
    anos[String(edadAno)] = { respuestas: estado.respuestas, sinRecuerdos: estado.sinRecuerdos };
    const next = { ...data, anos };
    setData(next);
    await persistir(next);
  };

  const terminar = async () => {
    await guardarSiCambio();
    navigate("/metodo/psicologia");
  };

  // Al completar la línea de vida: guardar y abrir la transición a «Las Huellas».
  const irAHuellas = async () => {
    await guardarSiCambio();
    setTransicionOpen(true);
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

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={fase === FASE.PROBLEMA ? "Problemas" : "Línea de Vida"}
              pageLabel={fase === FASE.PROBLEMA ? "2/9" : "3/9"}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              prev={
                fase === FASE.PROBLEMA
                  ? { label: "← Vuelve", onClick: terminar }
                  : { label: "← Problema", onClick: () => { void guardarSiCambio(); setFase(FASE.PROBLEMA); window.scrollTo({ top: 0, behavior: "smooth" }); } }
              }
              next={
                fase === FASE.PROBLEMA
                  ? { label: "Línea de Vida →", onClick: avanzarDesdeProblema }
                  : { label: completa ? "Continuar →" : "Recorre toda tu vida", onClick: irAHuellas, disabled: !completa, disabledTooltip: "Marca cada año como completado o sin recuerdos" }
              }
            />

            {/* ── PROBLEMA · box con fondo de psicología sobre la página teal ── */}
            {fase === FASE.PROBLEMA && (
              <Box
                position="relative"
                w="100%"
                borderRadius="2xl"
                overflow="hidden"
                border={`1px solid ${TINTA}33`}
                boxShadow={`0 12px 44px rgba(94,45,16,0.22), 0 0 0 1px ${neuropsicologiaBg}55`}
              >
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex
                  position="relative"
                  zIndex={1}
                  direction="column"
                  align="center"
                  textAlign="center"
                  px={{ base: 7, md: 12 }}
                  py={{ base: 9, md: 12 }}
                  gap={{ base: 6, md: 7 }}
                >
                  <Text color={TINTA} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" lineHeight="1.3" maxW="620px" style={{ textShadow: INK_SHADOW }}>
                    {exp.problemaInicial.pregunta}
                  </Text>
                  {exp.problemaInicial.apoyo && (
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.85} maxW="520px">
                      {exp.problemaInicial.apoyo}
                    </Text>
                  )}
                  <Textarea
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    onBlur={guardarSiCambio}
                    placeholder={exp.problemaInicial.placeholder || "Escribe aquí…"}
                    {...textareaSx}
                  />
                  <GuardadoHint guardando={guardando} />
                </Flex>
              </Box>
            )}

            {/* ───────────────── LÍNEA DE VIDA ───────────────── */}
            {fase === FASE.LINEA && (
              <Flex direction="column" align="center" w="100%" gap={6}>
                {/* Contenedor editorial de la timeline */}
                <Box
                  position="relative"
                  w="100%"
                  borderRadius="2xl"
                  overflow="hidden"
                  border={`1px solid ${TINTA}33`}
                  boxShadow={`0 12px 44px rgba(94,45,16,0.2), 0 0 0 1px ${neuropsicologiaBg}55`}
                >
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }} py={{ base: 8, md: 11 }}>

                    {/* Etiqueta del tramo */}
                    <Text textAlign="center" color={TINTA} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.18em" textTransform="uppercase" opacity={0.7} fontWeight="600" mb={{ base: 7, md: 9 }}>
                      {tramos[tramoIdx] ? `Años ${tramos[tramoIdx][0]} – ${tramos[tramoIdx][tramos[tramoIdx].length - 1]}` : ""}
                    </Text>

                    {/* Nodos del tramo */}
                    <Flex align="flex-start" justify="center" wrap="nowrap">
                      {(tramos[tramoIdx] || []).map((edadAno, i, arr) => {
                        const estado = estadoDelAno(data, edadAno);
                        const est = colorNodo(estado);
                        const prevRecorrido = i > 0 ? estadoDelAno(data, arr[i - 1]) !== "vacio" : false;
                        const conectorOn = prevRecorrido && estado !== "vacio";
                        return (
                          <React.Fragment key={edadAno}>
                            {i > 0 && (
                              <Box
                                flex="1"
                                maxW={{ base: "26px", md: "52px" }}
                                h="2px"
                                mt={{ base: "21px", md: "27px" }}
                                bg={conectorOn ? TINTA : `${TINTA}30`}
                                boxShadow={conectorOn ? `0 0 8px ${TINTA}66` : "none"}
                                transition="all 0.3s ease"
                              />
                            )}
                            <Flex direction="column" align="center" gap={1.5} flexShrink={0}>
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
                                {edadAno}
                              </Box>
                              <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} opacity={0.65}>
                                {anoNatural(edad, edadAno, anioActual)}
                              </Text>
                            </Flex>
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

                {/* Progreso global de la vida recorrida */}
                <Flex align="center" gap={3} w="100%" maxW="420px">
                  <Box flex="1" h="8px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                    <Box h="100%" w={`${(recorridos / (edad + 1)) * 100}%`} bg={PAPEL} borderRadius="full" boxShadow="0 0 12px rgba(255,255,255,0.5)" transition="width 0.5s ease" />
                  </Box>
                  <Text color={CREMA} fontSize="sm" opacity={0.9} whiteSpace="nowrap">{recorridos}/{edad + 1} años</Text>
                </Flex>

                {completa && (
                  <Text color={CREMA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" maxW="560px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}>
                    Has reconstruido tu vida entera. Tómate un momento para mirarla completa antes de continuar.
                  </Text>
                )}

                <GuardadoHint guardando={guardando} color={CREMA} />
              </Flex>
            )}

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
            boxShadow={`0 0 0 1px ${neuropsicologiaBg}66, 0 30px 90px rgba(0,0,0,0.7)`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 8, md: 10 }} py={{ base: 10, md: 12 }} textAlign="center">
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" mb={3} style={{ textShadow: INK_SHADOW }}>
                {exp.preguntaEdad.pregunta}
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.82} mb={8} maxW="360px" mx="auto" lineHeight="1.7">
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
                _focus={{ borderColor: `${TINTA}99`, boxShadow: `0 0 0 1px ${TINTA}44`, bg: "rgba(255,251,243,0.6)" }}
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
                boxShadow={edadValida ? `0 6px 20px rgba(94,45,16,0.35)` : "none"}
                transition="all 0.2s"
                _hover={edadValida ? { transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.45)` } : {}}
              >
                Mi línea de tiempo
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ───────────────── TRANSICIÓN · «Las Huellas» ───────────────── */}
      {transicionOpen && (
        <Box
          position="fixed" inset={0} zIndex={2000}
          display="flex" alignItems="center" justifyContent="center"
          px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
          bg="rgba(60,34,12,0.62)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setTransicionOpen(false)}
          fontFamily="'EB Garamond', serif"
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative" w="100%" maxW="600px"
            maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
            borderRadius="2xl" overflow="hidden"
            border={`1px solid ${TINTA}55`}
            boxShadow={`0 0 0 1px ${neuropsicologiaBg}66, 0 30px 80px rgba(40,18,4,0.6)`}
            display="flex" flexDirection="column"
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 8, md: 12 }} py={{ base: 10, md: 14 }} textAlign="center"
                 overflowY="auto" overscrollBehavior="contain">
              <Text color={TINTA} fontSize="2xl" mb={4} style={{ filter: `drop-shadow(0 0 6px ${TINTA}55)` }}>✦</Text>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" letterSpacing="0.04em" mb={6} style={{ textShadow: INK_SHADOW }}>
                Las Huellas
              </Text>
              <Box mx="auto" mb={7} h="1px" w="120px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              <Flex direction="column" gap={4} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.95" opacity={0.92} maxW="460px" mx="auto">
                <Text>No todos los recuerdos permanecen con nosotros.</Text>
                <Text>Algunos se desvanecen con el tiempo. Otros continúan acompañándonos muchos años después.</Text>
                <Text>Las siguientes páginas contienen fragmentos de tu historia. Recórrelas una vez más.</Text>
                <Text fontStyle="italic">No busques los acontecimientos más importantes. Busca aquellos que dejaron una huella.</Text>
              </Flex>
              <Box
                as="button"
                mt={9}
                onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas`)}
                px={10} py={3}
                borderRadius="full"
                bg={TINTA} color={PAPEL}
                border={`1px solid ${TINTA}`}
                fontFamily="'EB Garamond', serif" fontWeight="700"
                fontSize={{ base: "md", md: "lg" }} letterSpacing="0.06em"
                cursor="pointer"
                boxShadow={`0 6px 20px rgba(94,45,16,0.32)`}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}
              >
                Recorrer mis huellas →
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
          preguntas={exp.preguntasPorAno}
          inicial={data.anos?.[String(anoAbierto)]}
          onCerrar={() => setAnoAbierto(null)}
          onGuardar={async (estado) => { await guardarAno(anoAbierto, estado); setAnoAbierto(null); }}
        />
      )}

      <SiteFooter />
    </Box>
  );
}

// ── Estilos compartidos del textarea de las fases ──
const textareaSx = {
  w: "100%",
  maxW: "640px",
  minH: { base: "200px", md: "260px" },
  bg: "rgba(255,251,243,0.38)",
  border: `1px solid ${TINTA}3a`,
  color: TINTA,
  borderRadius: "xl",
  px: { base: 5, md: 7 },
  py: { base: 4, md: 5 },
  fontFamily: "'EB Garamond', serif",
  fontSize: { base: "lg", md: "xl" },
  lineHeight: "1.9",
  boxShadow: `inset 0 1px 4px rgba(94,45,16,0.08), 0 6px 24px rgba(94,45,16,0.1)`,
  sx: { caretColor: TINTA },
  _placeholder: { color: `${TINTA}66`, fontStyle: "italic" },
  _hover: { borderColor: `${TINTA}55` },
  _focus: {
    borderColor: `${TINTA}88`,
    boxShadow: `inset 0 1px 4px rgba(94,45,16,0.1), 0 0 0 1px ${TINTA}33, 0 8px 30px rgba(94,45,16,0.16)`,
    bg: "rgba(255,251,243,0.52)",
  },
} as const;

const GuardadoHint = ({ guardando, color = TINTA }: { guardando: boolean; color?: string }) => (
  <Text color={color} fontSize="xs" opacity={0.65} fontStyle="italic" minH="1.2em">
    {guardando ? "Guardando…" : "Se guarda solo. Tómate el tiempo que necesites."}
  </Text>
);

const FlechaTramo = ({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) => (
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
    _hover={disabled ? {} : { bg: "rgba(255,251,243,0.85)", borderColor: TINTA, transform: "translateY(-2px)", boxShadow: `0 6px 16px rgba(94,45,16,0.22)` }}
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
}: {
  edadAno: number;
  anioNatural: number;
  preguntas: { key: string; pregunta: string; apoyo?: string }[];
  inicial?: { sinRecuerdos?: boolean; respuestas?: Record<string, string> };
  onCerrar: () => void;
  onGuardar: (estado: { respuestas: Record<string, string>; sinRecuerdos: boolean }) => Promise<void> | void;
}) {
  const [respuestas, setRespuestas] = useState<Record<string, string>>(inicial?.respuestas || {});
  const [sinRecuerdos, setSinRecuerdos] = useState<boolean>(!!inicial?.sinRecuerdos);
  const [guardando, setGuardando] = useState(false);

  const algoEscrito = Object.values(respuestas).some((v) => v && v.trim().length > 0);

  const guardar = async () => {
    setGuardando(true);
    await onGuardar({ respuestas, sinRecuerdos: sinRecuerdos && !algoEscrito ? true : sinRecuerdos });
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
      bg="rgba(60,34,12,0.6)"
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
        border={`1px solid ${TINTA}55`}
        boxShadow={`0 0 0 1px ${neuropsicologiaBg}66, 0 30px 80px rgba(40,18,4,0.6), 0 0 50px rgba(94,45,16,0.3)`}
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
          {/* Encabezado del año */}
          <Flex direction="column" align="center" textAlign="center" gap={1} mb={{ base: 7, md: 9 }}>
            <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.1" style={{ textShadow: INK_SHADOW }}>
              Año {edadAno}
            </Text>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7}>
              {anioNatural}
            </Text>
            <Box mt={3} h="1px" w="120px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
          </Flex>

          {/* Preguntas evocadoras */}
          <Flex direction="column" gap={{ base: 7, md: 8 }}>
            {preguntas.map((p) => (
              <Box key={p.key}>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                  {p.pregunta}
                </Text>
                <Textarea
                  value={respuestas[p.key] || ""}
                  onChange={(e) => setRespuestas((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  placeholder="Escribe lo que recuerdes…"
                  minH={{ base: "84px", md: "92px" }}
                  bg="rgba(255,251,243,0.6)"
                  border={`1px solid ${TINTA}2e`}
                  color={TINTA}
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.8"
                  sx={{ caretColor: TINTA }}
                  _placeholder={{ color: `${TINTA}55`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}4d` }}
                  _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,251,243,0.8)" }}
                />
              </Box>
            ))}
          </Flex>

          {/* Acciones */}
          <Flex direction={{ base: "column", sm: "row" }} align="center" justify="center" gap={3} mt={{ base: 9, md: 11 }}>
            <Box
              as="button"
              onClick={() => setSinRecuerdos((v) => !v)}
              px={6}
              py={3}
              borderRadius="full"
              bg={sinRecuerdos ? `${TINTA}` : "transparent"}
              color={sinRecuerdos ? PAPEL : TINTA}
              border={`1px solid ${TINTA}66`}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: sinRecuerdos ? `${TINTA}` : `${TINTA}14`, borderColor: TINTA }}
            >
              {sinRecuerdos ? "✓ Sin recuerdos de este año" : "No tengo recuerdos de este año"}
            </Box>
            <Box
              as="button"
              onClick={guardando ? undefined : guardar}
              px={9}
              py={3}
              borderRadius="full"
              bg={TINTA}
              color={PAPEL}
              border={`1px solid ${TINTA}`}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.06em"
              cursor={guardando ? "wait" : "pointer"}
              opacity={guardando ? 0.7 : 1}
              boxShadow={`0 6px 20px rgba(94,45,16,0.32)`}
              transition="all 0.2s"
              _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}
            >
              {guardando ? "Guardando…" : "Guardar y cerrar"}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
