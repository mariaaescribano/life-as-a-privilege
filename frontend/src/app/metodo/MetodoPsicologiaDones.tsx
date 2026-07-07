// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · RECUÉRDATE (preguntas de dones)  ·  10/13
//
// El reverso luminoso del recorrido. Tras sanar las heridas, la persona mira
// hacia lo que se le da con naturalidad. Aquí sólo SIEMBRA: responde las 15
// preguntas sin ver todavía ningún resultado (el resultado llega en el espejo,
// la página siguiente, para que responda con honestidad y no «para» un tipo).
//
// Datos: data.dones.respuestas[key] = string  (autoguardado con debounce).
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
  DONES_PREGUNTAS,
  DONES_INTRO,
  donesRespondidas,
  type LineaDeVidaData,
  type DonesData,
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
// Acento luminoso/dorado: los Dones son la cara luminosa del recorrido.
const ORO = "#caa24a";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaDones() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Record<string, string> | null>(null);
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
        setRespuestas({ ...(d.dones?.respuestas || {}) });
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: Record<string, string>): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const dones: DonesData = { ...(dataRef.current.dones || {}), respuestas: next };
      const data = { ...dataRef.current, dones };
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

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: Record<string, string>) => {
    setRespuestas(next);
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

  const updateRespuesta = (key: string, valor: string) =>
    commit({ ...respuestas, [key]: valor });

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const respondidas = donesRespondidas({ ...dataRef.current, dones: { ...dataRef.current.dones, respuestas } });
  const total = DONES_PREGUNTAS.length;

  const irARelacion = () => navigate(`/metodo/psicologia/${exp.id}/integracion`);
  const irAEspejo = () => navigate(`/metodo/psicologia/${exp.id}/dones-espejo`);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Recuérdate"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 10, total: 13 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Relación", onClick: irARelacion }}
              next={{ label: "Dones →", onClick: irAEspejo }}
            />

            {/* Intro: quita presión, explica qué es un don */}
            <Flex direction="column" align="center" gap={3} textAlign="center" maxW="640px">
              <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.7"
                    style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                {DONES_INTRO.preguntas}
              </Text>
            </Flex>

            {/* Panel con las 15 preguntas, cada una una banda */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1}>
                {DONES_PREGUNTAS.map((p, i) => (
                  <Box key={p.key}>
                    {i > 0 && <Box h="2px" w="100%" bg={`${TINTA}44`} />}
                    <Box position="relative" overflow="hidden">
                      <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 5, md: 6 }}>
                        <Flex align="baseline" gap={2.5} mb={2.5}>
                          <Text color={`${TINTA}88`} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
                                flexShrink={0} style={{ textShadow: INK_SHADOW }}>
                            {String(i + 1).padStart(2, "0")}
                          </Text>
                          <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.35"
                                style={{ textShadow: INK_SHADOW }}>
                            {p.pregunta}
                          </Text>
                        </Flex>
                        <Textarea
                          value={respuestas[p.key] || ""}
                          onChange={(e) => updateRespuesta(p.key, e.target.value)}
                          placeholder="Escribe lo que te venga…"
                          minH="72px"
                          bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}3a`} color={TINTA}
                          borderRadius="lg" px={3.5} py={2.5} fontFamily="'EB Garamond', serif"
                          fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                          sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                                "&::-webkit-scrollbar": { width: "8px" },
                                "&::-webkit-scrollbar-track": { background: "transparent" },
                                "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                          _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                          _hover={{ borderColor: `${TINTA}55` }}
                          _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.88)" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}

                {/* Pie: autoguardado */}
                <Box h="2px" w="100%" bg={`${TINTA}44`} />
                <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 4, md: 5 }}>
                  <Flex justify="flex-end">
                    <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                  </Flex>
                </Box>
              </Box>
            </Box>

            {/* Progreso */}
            <Flex align="center" gap={3} w="100%" maxW="420px">
              <Box flex="1" h="8px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                <Box h="100%" w={`${(respondidas / total) * 100}%`} bg={PAPEL} borderRadius="full"
                     boxShadow="0 0 12px rgba(255,255,255,0.5)" transition="width 0.5s ease" />
              </Box>
              <Text color={CREMA} fontSize="sm" opacity={0.9} whiteSpace="nowrap">{respondidas}/{total}</Text>
            </Flex>

            {/* Invitación a ver el espejo (botón claro) */}
            <Box as="button" onClick={irAEspejo} px={8} py={3} borderRadius="full"
                 bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                 fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 0 18px ${TINTA}66, 0 0 44px ${TINTA}33`} transition="all 0.2s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 26px ${TINTA}88, 0 0 60px ${TINTA}44` }}>
              Ver mis dones →
            </Box>

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="dones" />

      <SiteFooter />
    </Box>
  );
}
