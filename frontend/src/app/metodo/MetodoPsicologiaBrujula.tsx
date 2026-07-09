// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · TU BRÚJULA  (después del Compromiso · paso 19/20 · le sigue Síntesis)
//
// Una brújula para el futuro. La persona se deja un mensaje libre a su yo del
// futuro, para cuando vuelva a sentirse bloqueada. No es análisis: es una guía
// práctica para no olvidar lo aprendido y volver a vivir desde la integración,
// no desde la herida. El paso siguiente es la Síntesis (el recap completo).
//
// Datos: lee y ESCRIBE (autoguardado) data.brujula.mensaje.
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
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import { BotonCompania } from "../../components/global/BotonCompania";
import {
  experienciaById,
  type LineaDeVidaData,
  type BrujulaData,
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

export default function MetodoPsicologiaBrujula() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [brujula, setBrujula] = useState<BrujulaData>({});
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<BrujulaData | null>(null);
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
        setBrujula(d.brujula && typeof d.brujula === "object" ? d.brujula : {});
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: BrujulaData): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const nuevo = { ...dataRef.current, brujula: next };
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
  const commit = (next: BrujulaData) => {
    setBrujula(next);
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

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 8 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Brújula"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              maxW="100%"
              step={{ current: 19, total: 20 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Compromiso", onClick: () => navigate(`/metodo/psicologia/${exp.id}/compromiso`) }}
              next={{ label: "Síntesis →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/sintesis`) }}
            />

            {/* Intro */}
            <IntroRecorrido>
              Habrá días en que vuelvas a sentirte bloqueado. Déjate ahora un mensaje para tu yo
              del futuro: esta será tu brújula para volver a ti.
            </IntroRecorrido>

            {/* ── La brújula: un mensaje libre a tu yo del futuro ── */}
            <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Flex direction="column" align="center" gap={3} mb={{ base: 7, md: 8 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                        lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                    Cuando vuelvas a bloquearte
                  </Text>
                  <Box h="2px" w="72px" bg={`${TINTA}66`} borderRadius="full" />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
                        maxW="620px" opacity={0.9} style={{ textShadow: INK_SHADOW }}>
                    Escríbete un mensaje para el próximo momento difícil. No para juzgarte:
                    para recordar el camino que ya conoces.
                  </Text>
                </Flex>

                <Textarea
                  value={brujula.mensaje || ""}
                  onChange={(e) => commit({ ...brujula, mensaje: e.target.value })}
                  placeholder="Yo del futuro, cuando vuelvas a sentirte bloqueado, recuerda…"
                  minH={{ base: "200px", md: "240px" }}
                  bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,251,243,0.92)" }}
                />

                <Flex justify="center" mt={{ base: 6, md: 7 }}>
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                </Flex>
              </Box>
            </Box>

            {/* Cierre */}
            <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.7" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Esta es tu guía práctica para no olvidar lo aprendido. Vuelve a ella siempre que la necesites.
            </Text>

          </Flex>
        </Flex>
      </Box>

      <BotonCompania color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} disciplinaNom={neuropsicologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de psicología" />

      <SiteFooter />
    </Box>
  );
}
