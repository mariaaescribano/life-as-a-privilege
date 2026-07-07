// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · DONES (el espejo)  ·  11/13
//
// El reverso de la página anterior: aquí se COSECHA. Le devolvemos a la persona
// sus propias respuestas junto a los arquetipos de su carta astral, y ella
// reconoce y nombra sus dones (los escribe: la plataforma nunca interpreta).
//
// Datos: lee data.dones.respuestas + la carta astral (metodo-astrologia).
//        escribe data.dones.lista = string[]  (los dones reconocidos).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Glifo } from "../../components/metodo/Glifo";
import { CUERPOS, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { type CartaData } from "../../components/metodo/Planetas/useCartaPlanetas";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  experienciaById,
  DONES_PREGUNTAS,
  DONES_INTRO,
  arquetipoKey,
  type LineaDeVidaData,
  type DonesData,
  type ArquetipoRef,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  AstrologiaIcon,
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

// Una faceta de arquetipo con su símbolo/color, lista para pintar como chip.
interface ArqChip extends ArquetipoRef { symbol: string; color: string }

function arquetiposDeCarta(carta: CartaData): ArqChip[] {
  const out: ArqChip[] = [];
  for (const c of CUERPOS) {
    const v = carta[c.key as CuerpoKey];
    if (!v) continue;
    const signo = v.signo || null;
    const casa = c.conCasa && v.casa != null ? v.casa : null;
    if (signo) out.push({ cuerpoKey: c.key, faceta: "signo", signo, casa: null, symbol: c.symbol, color: c.color });
    if (casa != null) out.push({ cuerpoKey: c.key, faceta: "casa", signo: null, casa, symbol: c.symbol, color: c.color });
  }
  return out;
}

export default function MetodoPsicologiaDonesEspejo() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [arquetipos, setArquetipos] = useState<ArqChip[]>([]);
  const [dones, setDones] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<string[] | null>(null);
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

        const [psiRes, astroRes] = await Promise.allSettled([
          axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (psiRes.status === "fulfilled") {
          const d: LineaDeVidaData = psiRes.value.data?.data || {};
          dataRef.current = d;
          setRespuestas({ ...(d.dones?.respuestas || {}) });
          setDones(Array.isArray(d.dones?.lista) ? [...(d.dones!.lista as string[])] : []);
        }
        if (astroRes.status === "fulfilled") {
          const carta: CartaData = astroRes.value.data?.data || {};
          setArquetipos(arquetiposDeCarta(carta));
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
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const donesData: DonesData = { ...(dataRef.current.dones || {}), lista: next };
      const data = { ...dataRef.current, dones: donesData };
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

  const commit = (next: string[]) => {
    setDones(next);
    setEstadoGuardado("guardando");
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 700);
  };

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const añadirDon = () => {
    const v = draft.trim();
    if (!v || dones.some((d) => d.toLowerCase() === v.toLowerCase())) { setDraft(""); return; }
    commit([...dones, v]);
    setDraft("");
  };
  const quitarDon = (i: number) => commit(dones.filter((_, idx) => idx !== i));

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const irARecuerdate = () => navigate(`/metodo/psicologia/${exp.id}/dones`);
  const irAIntegracion = () => navigate(`/metodo/psicologia/${exp.id}/mapa`);

  // Solo las preguntas que la persona respondió (el espejo refleja lo escrito).
  const respondidas = DONES_PREGUNTAS
    .map((p) => ({ pregunta: p.pregunta, respuesta: (respuestas[p.key] || "").trim() }))
    .filter((x) => x.respuesta.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="860px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Dones"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 11, total: 13 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Recuérdate", onClick: irARecuerdate }}
              next={{ label: "Integración →", onClick: irAIntegracion }}
            />

            {/* Intro */}
            <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.7" maxW="640px" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
              {DONES_INTRO.espejo}
            </Text>

            {/* ── Sección A · Tus respuestas ── */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                      textTransform="uppercase" textAlign="center" opacity={0.8} mb={{ base: 5, md: 6 }}
                      style={{ textShadow: INK_SHADOW }}>
                  Lo que escribiste
                </Text>
                {respondidas.length > 0 ? (
                  <Flex direction="column" gap={{ base: 4, md: 5 }}>
                    {respondidas.map((x, i) => (
                      <Box key={i} borderRadius="xl" bg="rgba(255,251,243,0.62)" border={`1px solid ${TINTA}26`}
                           px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="700" lineHeight="1.4" mb={1.5} opacity={0.82}>
                          {x.pregunta}
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65">
                          {x.respuesta}
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" gap={4} py={2} textAlign="center">
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.75}
                          style={{ textShadow: INK_SHADOW }}>
                      Aún no has respondido las preguntas. Vuelve a la página anterior para descubrir tus dones.
                    </Text>
                    <Box as="button" onClick={irARecuerdate} px={6} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                         fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                         boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                         _hover={{ transform: "translateY(-2px)" }}>
                      Ir a Recuérdate →
                    </Box>
                  </Flex>
                )}
              </Box>
            </Box>

            {/* ── Sección B · Tus arquetipos (carta astral) ── */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                <Flex align="center" justify="center" gap={2.5} mb={{ base: 5, md: 6 }}>
                  <AstrologiaIcon size={{ base: "20px", md: "22px" }} />
                  <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                        textTransform="uppercase" opacity={0.8} style={{ textShadow: INK_SHADOW }}>
                    Tus arquetipos
                  </Text>
                </Flex>
                {arquetipos.length > 0 ? (
                  <Flex wrap="wrap" gap={2.5} justify="center">
                    {arquetipos.map((a) => (
                      <Flex key={arquetipoKey(a)} align="center" gap={1.5} px={3} py={1.5} borderRadius="full"
                            bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}33`}>
                        <Glifo symbol={a.symbol} color={TINTA} size={14} />
                        <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="600" lineHeight="1.2" whiteSpace="nowrap">
                          {arquetipoLabel(a)}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" gap={4} textAlign="center">
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.75}
                          style={{ textShadow: INK_SHADOW }}>
                      Tus arquetipos aparecerán cuando completes tu carta astral.
                    </Text>
                    <Box as="button" onClick={() => navigate("/metodo/astrologia")} px={6} py={2.5} borderRadius="full"
                         bg={TINTA} color={PAPEL} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em"
                         cursor="pointer" boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                         _hover={{ transform: "translateY(-2px)" }}>
                      Ir a Astrología →
                    </Box>
                  </Flex>
                )}
              </Box>
            </Box>

            {/* ── Sección C · Tus dones (editable, luminosa) ── */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={`1px solid ${ORO}66`} boxShadow={`0 0 22px ${ORO}33, ${glowPanel}`}>
              <Box position="relative" overflow="hidden" bgGradient={`linear(135deg, ${PAPEL}, ${ORO}33)`}>
                <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                  <Flex direction="column" align="center" gap={2} mb={{ base: 6, md: 7 }} textAlign="center">
                    <Text color={ORO} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.22em"
                          textTransform="uppercase">✦ Tus dones</Text>
                    <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25">
                      Nombra lo que ves en ti
                    </Text>
                    <Box h="2px" w="72px" bg={`${ORO}88`} borderRadius="full" mt={1} />
                  </Flex>

                  {/* Dones reconocidos */}
                  {dones.length > 0 && (
                    <Flex wrap="wrap" gap={2.5} justify="center" mb={6}>
                      {dones.map((d, i) => (
                        <Flex key={`${d}-${i}`} align="center" gap={2} pl={4} pr={2} py={2} borderRadius="full"
                              bg={TINTA} color={PAPEL} boxShadow={`0 2px 12px ${TINTA}55`}>
                          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" lineHeight="1.2">{d}</Text>
                          <Box as="button" onClick={() => quitarDon(i)} w="20px" h="20px" borderRadius="full"
                               bg={`${PAPEL}33`} display="flex" alignItems="center" justifyContent="center"
                               fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ bg: `${PAPEL}55` }} title="Quitar">✕</Box>
                        </Flex>
                      ))}
                    </Flex>
                  )}

                  {/* Campo para añadir un don */}
                  <Flex align="center" gap={3} maxW="480px" mx="auto">
                    <Input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); añadirDon(); } }}
                      placeholder={dones.length ? "Añade otro don…" : "Escribe un don y pulsa Enter…"}
                      bg="rgba(255,255,255,0.75)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="full" px={5} py={2} fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "md", md: "lg" }} sx={{ caretColor: TINTA }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,255,255,0.9)" }}
                    />
                    <Box as="button" onClick={añadirDon} flexShrink={0} px={6} py={2.5} borderRadius="full"
                         bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                         fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                         boxShadow={`0 2px 14px rgba(0,0,0,0.22)`} transition="all 0.18s"
                         _hover={{ transform: "translateY(-2px)" }}>
                      Añadir
                    </Box>
                  </Flex>

                  <Flex justify="center" mt={5}>
                    <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                  </Flex>
                </Box>
              </Box>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="dones-espejo" />

      <SiteFooter />
    </Box>
  );
}
