// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · COMPROMISO  (paso 18/19 · le sigue «Tu brújula»)
//
// El último paso: del entender al comprometerse. Recoge el problema con el que
// el usuario llegó («Lo que me trajo hasta aquí»), le muestra lo que ha
// comprendido (los nuevos patrones, uno por relación) y le pide definir un
// compromiso concreto consigo mismo con dos preguntas:
//   · ¿Qué necesitaste que nadie pudo darte?
//   · ¿Cómo puedes empezar a dártelo hoy?
//
// Datos: lee data["problema-actual"] + data.constelaciones[i].{titulo,verdadSana,coste};
//        lee y ESCRIBE (autoguardado) data.compromiso.{necesitaste,dartelo}.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import { BotonCompania } from "../../components/global/BotonCompania";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import {
  experienciaById,
  type LineaDeVidaData,
  type CompromisoData,
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
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaCompromiso() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [compromiso, setCompromiso] = useState<CompromisoData>({});
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<CompromisoData | null>(null);
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
        setCompromiso(d.compromiso && typeof d.compromiso === "object" ? d.compromiso : {});
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: CompromisoData): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const nuevo = { ...dataRef.current, compromiso: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data: nuevo },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = nuevo;
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

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: CompromisoData) => {
    setCompromiso(next);
    setEstadoGuardado("guardando");
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  // Flush al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardado inmediato (botón «Guardar»): cancela el debounce pendiente y persiste ya.
  const guardarAhora = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    pendiente.current = null;
    void persistir(compromiso);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  // No se puede avanzar hasta responder las dos preguntas del compromiso.
  const compromisoCompleto =
    (compromiso.necesitaste || "").trim() !== "" && (compromiso.dartelo || "").trim() !== "";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="860px" gap={{ base: 6, md: 8 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Compromiso"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                maxW="100%"
                step={{ current: 18, total: 20 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Integración", onClick: () => navigate(`/metodo/psicologia/${exp.id}/mapa`) }}
                next={{
                  label: "Carta →",
                  onClick: () => navigate(`/metodo/psicologia/${exp.id}/brujula`),
                  disabled: !compromisoCompleto,
                  disabledTooltip: "Responde las dos preguntas del compromiso para continuar.",
                }}
              />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>
               Ya entiendes tu historia. Toma conciencia de lo que no pudieron darte y comprométete a tratarte con un poco más de cariño cada día.
              </IntroRecorrido>
            </Reveal>

            {/* ── Mi compromiso conmigo mismo: las dos preguntas ── */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%">
            <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Flex direction="column" gap={{ base: 6, md: 7 }}>
                  <PreguntaCompromiso
                    numero={1}
                    pregunta="¿Qué necesitaste que nadie pudo darte?"
                    valor={compromiso.necesitaste || ""}
                    onChange={(v) => commit({ ...compromiso, necesitaste: v })}
                    placeholder="Lo que más eché en falta fue…"
                  />
                  <PreguntaCompromiso
                    numero={2}
                    pregunta="¿Cómo puedes empezar a dártelo hoy?"
                    valor={compromiso.dartelo || ""}
                    onChange={(v) => commit({ ...compromiso, dartelo: v })}
                    placeholder="Hoy puedo empezar a dármelo…"
                  />
                </Flex>

                <Flex justify="space-between" align="center" gap={3} wrap="wrap" mt={{ base: 6, md: 7 }}>
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                  <Box as="button" onClick={guardarAhora}
                       px={{ base: 6, md: 8 }} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.04em" cursor="pointer" boxShadow={`0 4px 16px rgba(94,45,16,0.3)`}
                       transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 24px rgba(94,45,16,0.42)` }}>
                    Guardar
                  </Box>
                </Flex>
              </Box>
            </Box>
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      <BotonCompania color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} disciplinaNom={neuropsicologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de psicología" />

      <AyudaRecorrido pagina="compromiso" ocultarCompania />
      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Una pregunta del compromiso: enunciado + área de escritura (autoguardado).
// ─────────────────────────────────────────────────────────────────────────
function PreguntaCompromiso({ numero, pregunta, valor, onChange, placeholder }: {
  numero: number; pregunta: string; valor: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <Box>
      <Flex align="baseline" gap={2.5} mb={2.5}>
        <Flex flexShrink={0} align="center" justify="center" w="26px" h="26px" borderRadius="full"
              bg={TINTA} color={PAPEL} fontSize="sm" fontWeight="700"
              boxShadow={`0 2px 8px ${TINTA}44`}>
          {numero}
        </Flex>
        <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.35"
              style={{ textShadow: INK_SHADOW }}>
          {pregunta}
        </Text>
      </Flex>
      <Textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        minH={{ base: "104px", md: "120px" }}
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
    </Box>
  );
}
