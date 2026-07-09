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
  type LineaDeVidaData,
  type DonesData,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
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

export default function MetodoPsicologiaDones() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [sinIdeas, setSinIdeas] = useState<string[]>([]);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const [paso, setPaso] = useState(0); // carta actual de la baraja
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<{ resp: Record<string, string>; sin: string[] } | null>(null);
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
        setSinIdeas(Array.isArray(d.dones?.sinIdeas) ? [...(d.dones!.sinIdeas as string[])] : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (resp: Record<string, string>, sin: string[]): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const dones: DonesData = { ...(dataRef.current.dones || {}), respuestas: resp, sinIdeas: sin };
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

  // Guardado: debounce al escribir; inmediato en las acciones (botones).
  const programarGuardado = (resp: Record<string, string>, sin: string[]) => {
    setEstadoGuardado("guardando");
    pendiente.current = { resp, sin };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current.resp, pendiente.current.sin); pendiente.current = null; }
    }, 900);
  };
  const guardarAhora = (resp: Record<string, string>, sin: string[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    pendiente.current = null;
    void persistir(resp, sin);
  };

  // Flush al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current.resp, pendiente.current.sin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const total = DONES_PREGUNTAS.length;
  const p = DONES_PREGUNTAS[paso];
  const esPrimera = paso === 0;
  const esUltima = paso === total - 1;
  const anterior = () => setPaso((i) => Math.max(0, i - 1));
  const siguiente = () => setPaso((i) => Math.min(total - 1, i + 1));

  // Escribir texto quita la marca «sin ideas» de esa pregunta.
  const updateRespuesta = (key: string, valor: string) => {
    const resp = { ...respuestas, [key]: valor };
    const sin = valor.trim() ? sinIdeas.filter((k) => k !== key) : sinIdeas;
    setRespuestas(resp);
    if (sin !== sinIdeas) setSinIdeas(sin);
    programarGuardado(resp, sin);
  };
  // «Sin ideas»: marca la pregunta como resuelta (sin texto) y pasa a la siguiente.
  const marcarSinIdeas = (key: string) => {
    const resp = { ...respuestas, [key]: "" };
    const sin = sinIdeas.includes(key) ? sinIdeas : [...sinIdeas, key];
    setRespuestas(resp);
    setSinIdeas(sin);
    guardarAhora(resp, sin);
    if (!esUltima) siguiente();
  };
  // «Guardar»: fuerza el guardado y avanza (mantiene el ritmo del ejercicio).
  const guardarYSeguir = () => {
    guardarAhora(respuestas, sinIdeas);
    if (!esUltima) siguiente();
  };

  // Una pregunta queda resuelta con texto o marcada «sin ideas». El espejo solo
  // se abre cuando TODAS están resueltas.
  const estaResuelta = (key: string) => (respuestas[key] || "").trim().length > 0 || sinIdeas.includes(key);
  const resueltas = DONES_PREGUNTAS.filter((q) => estaResuelta(q.key)).length;
  const todoResuelto = resueltas === total;

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
              step={{ current: 13, total: 20 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Relación", onClick: irARelacion }}
              next={{
                label: "Dones →",
                onClick: irAEspejo,
                disabled: !todoResuelto,
                disabledTooltip: "Responde o marca «Sin ideas» las 15 preguntas para descubrir tus dones.",
              }}
            />

            {/* ── LA BARAJA: una carta (pregunta) cada vez ── */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} pt={{ base: 4, md: 5 }} pb={{ base: 8, md: 10 }}>
                {/* La pregunta */}
                <Flex align="center" justify="center" minH={{ base: "84px", md: "96px" }}>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.35"
                        textAlign="center" style={{ textShadow: INK_SHADOW }}>
                    {p.pregunta}
                  </Text>
                </Flex>

                <Textarea
                  value={respuestas[p.key] || ""}
                  onChange={(e) => updateRespuesta(p.key, e.target.value)}
                  placeholder="Escribe lo primero que te venga, sin pensarlo mucho…"
                  mt={4}
                  minH={{ base: "120px", md: "140px" }}
                  bg="rgba(255,251,243,0.75)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                  sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.9)" }}
                />

                <Flex justify="space-between" align="center" mt={4} gap={3} wrap="wrap">
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                  <Flex align="center" gap={2.5} ml="auto">
                    <Box as="button" onClick={() => marcarSinIdeas(p.key)}
                         px={{ base: 4, md: 5 }} py={2} borderRadius="full"
                         bg="transparent" border={`1.5px solid ${TINTA}66`} color={TINTA}
                         fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                         letterSpacing="0.02em" cursor="pointer" transition="all 0.18s"
                         _hover={{ bg: `${TINTA}12`, borderColor: TINTA }}>
                      Sin ideas
                    </Box>
                    <Box as="button" onClick={guardarYSeguir}
                         px={{ base: 5, md: 6 }} py={2} borderRadius="full"
                         bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                         fontSize={{ base: "sm", md: "md" }} letterSpacing="0.03em" cursor="pointer"
                         boxShadow={`0 2px 12px ${TINTA}3a`} transition="all 0.18s"
                         _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 16px ${TINTA}5a` }}>
                      Guardar
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            {/* Navegación entre preguntas — mismas flechas que en Huellas, con
                los puntos de progreso en medio (coherencia del programa). */}
            <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} w="100%">
              <FlechaPagina dir="prev" disabled={esPrimera} onClick={anterior} />
              <Flex justify="center" align="center" wrap="wrap" gap={2} maxW="520px">
                {DONES_PREGUNTAS.map((q, i) => {
                  const hecha = estaResuelta(q.key);
                  const activo = i === paso;
                  return (
                    <Box key={q.key} as="button" onClick={() => setPaso(i)} title={`Pregunta ${i + 1}`}
                         w={activo ? "24px" : "10px"} h="10px" borderRadius="full"
                         bg={activo ? PAPEL : hecha ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)"}
                         boxShadow={activo ? "0 0 10px rgba(255,255,255,0.6)" : "none"}
                         transition="all 0.2s" cursor="pointer"
                         _hover={{ bg: activo ? PAPEL : "rgba(255,255,255,0.85)" }} />
                  );
                })}
              </Flex>
              <FlechaPagina dir="next" disabled={esUltima} onClick={siguiente} />
            </Flex>

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="dones" />

      <SiteFooter />
    </Box>
  );
}

// Flecha circular de navegación (misma que en «Huellas», para coherencia).
const FlechaPagina = ({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) => (
  <Box
    as="button"
    onClick={disabled ? undefined : onClick}
    flexShrink={0}
    w="46px"
    h="46px"
    borderRadius="full"
    bg={`${neuropsicologiaBg}f0`}
    border={`1px solid ${TINTA}${disabled ? "22" : "66"}`}
    color={`${TINTA}${disabled ? "55" : "ff"}`}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize="xl"
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.5 : 1}
    transition="all 0.2s ease"
    _hover={disabled ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 14px ${AZUL}66, 0 0 30px ${AZUL}33` }}
    aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
  >
    {dir === "prev" ? "←" : "→"}
  </Box>
);
