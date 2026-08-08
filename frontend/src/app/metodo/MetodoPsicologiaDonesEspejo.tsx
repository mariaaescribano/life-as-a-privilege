// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · DONES (el espejo)  ·  11/13
//
// El reverso de «Recuérdate»: aquí se COSECHA. Funciona como «Relación»:
//   · Columna «Lo que escribiste» — solo las respuestas (más impactante).
//   · Columna «Tus arquetipos» — la carta astral, igual que en Relación.
//   · «Tus dones» — la persona nombra cada don y le UNE arquetipos de su carta,
//     quedando juntos en una etiqueta. La plataforma nunca interpreta.
//
// Datos: lee data.dones.respuestas + la carta astral (metodo-astrologia).
//        escribe data.dones.lista = DonReconocido[]  (don + arquetipos unidos).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { Glifo } from "../../components/metodo/Glifo";
import { SaberMasModal } from "../../components/metodo/Planetas/SaberMasModal";
import { ArquetiposBloqueados } from "../../components/metodo/ArquetiposBloqueados";
import { CUERPOS, cuerpoByKey, type Cuerpo } from "../../components/metodo/astrologiaData";
import { type CartaData } from "../../components/metodo/Planetas/useCartaPlanetas";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  experienciaById,
  DONES_PREGUNTAS,
  DONES_INTRO,
  arquetipoKey,
  type LineaDeVidaData,
  type DonesData,
  type DonReconocido,
  type ArquetipoRef,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
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
const ORO = "#caa24a";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;
const COL_H = { base: "440px", md: "520px", lg: "600px" } as const;
const SCROLL_SX_CLARO = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${PAPEL}55 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${PAPEL}55`, borderRadius: "8px" },
};
const SCROLL_SX_TINTA = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${TINTA}66 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${TINTA}66`, borderRadius: "8px" },
};
// Margen inferior permanente dentro de las columnas con scroll: deja siempre
// un respiro entre el final visible del scroll y el borde del panel (más limpio,
// aunque no se haya llegado al final del scroll).
const COL_PB = { base: 3, md: 4 } as const;

// ── Arquetipos de la carta, agrupados por cuerpo (como en Relación) ──
interface ArqPlaneta { cuerpoKey: string; symbol: string; color: string; signo: string | null; casa: number | null }
interface ArqItem extends ArquetipoRef { symbol: string }

function arquetiposDeCarta(carta: CartaData): ArqPlaneta[] {
  const out: ArqPlaneta[] = [];
  for (const c of CUERPOS) {
    const v = carta[c.key];
    if (!v) continue;
    const signo = v.signo || null;
    const casa = c.conCasa && v.casa != null ? v.casa : null;
    if (signo || casa != null) out.push({ cuerpoKey: c.key, symbol: c.symbol, color: c.color, signo, casa });
  }
  return out;
}

function facetasDe(p: ArqPlaneta): ArqItem[] {
  const out: ArqItem[] = [];
  if (p.signo) out.push({ cuerpoKey: p.cuerpoKey, faceta: "signo", signo: p.signo, casa: null, symbol: p.symbol });
  if (p.casa != null) out.push({ cuerpoKey: p.cuerpoKey, faceta: "casa", signo: null, casa: p.casa, symbol: p.symbol });
  return out;
}

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `d-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

// Cada don toma un color propio (tonos medios que destacan sobre el crema).
const PALETA_DON = [
  "#caa24a", // oro
  "#c67b5c", // terracota
  "#7ba17d", // verde salvia
  "#8f7bb0", // lavanda
  "#5c93b0", // azul sereno
  "#c77b98", // rosa palo
  "#9aae6a", // oliva
  "#b0885c", // ámbar tostado
];
function colorDon(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETA_DON[h % PALETA_DON.length];
}

// Coerciona la lista guardada (admite el formato antiguo: string[]).
function coercionarDones(raw: unknown): DonReconocido[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x: any) =>
    typeof x === "string"
      ? { id: nuevoId(), texto: x, arquetipos: [], recuerdos: [] }
      : {
          id: x?.id || nuevoId(),
          texto: typeof x?.texto === "string" ? x.texto : "",
          arquetipos: Array.isArray(x?.arquetipos) ? x.arquetipos : [],
          recuerdos: Array.isArray(x?.recuerdos) ? x.recuerdos : [],
        },
  );
}

export default function MetodoPsicologiaDonesEspejo() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [arquetipos, setArquetipos] = useState<ArqPlaneta[]>([]);
  const [dones, setDones] = useState<DonReconocido[]>([]);
  const [activaId, setActivaId] = useState<string | null>(null);
  const [saberMas, setSaberMas] = useState<{ cuerpo: Cuerpo; signo?: string; casa?: number; facet: "signo" | "casa" } | null>(null);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<DonReconocido[] | null>(null);
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
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
          const lista = coercionarDones(d.dones?.lista);
          setDones(lista);
          if (lista.length > 0) setActivaId(lista[lista.length - 1].id);
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

  const persistir = async (next: DonReconocido[]): Promise<boolean> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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

  const commit = (next: DonReconocido[]) => {
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

  // Aplica una mutación al don activo (creándolo si no hay ninguno).
  const conActiva = (mut: (d: DonReconocido) => DonReconocido) => {
    let id = activaId;
    let base = dones;
    if (!id || !base.some((x) => x.id === id)) {
      const nueva: DonReconocido = { id: nuevoId(), texto: "", arquetipos: [], recuerdos: [] };
      base = [...base, nueva]; id = nueva.id; setActivaId(id);
    }
    commit(base.map((x) => (x.id === id ? mut(x) : x)));
  };

  const toggleArq = (a: ArqItem) =>
    conActiva((d) => ({
      ...d,
      arquetipos: d.arquetipos.some((x) => arquetipoKey(x) === arquetipoKey(a))
        ? d.arquetipos.filter((x) => arquetipoKey(x) !== arquetipoKey(a))
        : [...d.arquetipos, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }],
    }));

  const toggleRecuerdo = (texto: string) =>
    conActiva((d) => ({
      ...d,
      recuerdos: (d.recuerdos || []).includes(texto)
        ? (d.recuerdos || []).filter((x) => x !== texto)
        : [...(d.recuerdos || []), texto],
    }));

  const updateTexto = (id: string, texto: string) =>
    commit(dones.map((d) => (d.id === id ? { ...d, texto } : d)));
  const removeArq = (id: string, a: ArquetipoRef) =>
    commit(dones.map((d) => (d.id === id ? { ...d, arquetipos: d.arquetipos.filter((x) => arquetipoKey(x) !== arquetipoKey(a)) } : d)));
  const removeRecuerdo = (id: string, texto: string) =>
    commit(dones.map((d) => (d.id === id ? { ...d, recuerdos: (d.recuerdos || []).filter((x) => x !== texto) } : d)));
  const borrarDon = (id: string) => {
    const next = dones.filter((d) => d.id !== id);
    commit(next);
    if (activaId === id) setActivaId(next.length ? next[next.length - 1].id : null);
  };
  const añadirDon = () => {
    const nueva: DonReconocido = { id: nuevoId(), texto: "", arquetipos: [] };
    commit([...dones, nueva]);
    setActivaId(nueva.id);
  };

  const abrirSaberMas = (a: ArqItem) => {
    const c = cuerpoByKey(a.cuerpoKey);
    if (!c) return;
    if (a.faceta === "signo") setSaberMas({ cuerpo: c, signo: a.signo || undefined, facet: "signo" });
    else setSaberMas({ cuerpo: c, casa: a.casa ?? undefined, facet: "casa" });
  };

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  // Antes de navegar: dispara el guardado pendiente (debounce) y espera a que no
  // quede ninguno en vuelo, para que la página destino lea datos ya escritos.
  const flushPendiente = () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
  };
  const irARecuerdate = async () => { flushPendiente(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/dones`); };
  const irAMiedos = async () => { flushPendiente(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/miedos`); };

  const activa = dones.find((d) => d.id === activaId) || null;
  // Hay que escribir al menos un don (con nombre) para poder continuar a Miedos.
  const hayDon = dones.some((d) => (d.texto || "").trim() !== "");
  const arqEnActiva = (a: ArqItem) => !!activa?.arquetipos.some((x) => arquetipoKey(x) === arquetipoKey(a));
  const recuerdoEnActiva = (texto: string) => !!activa?.recuerdos?.includes(texto);

  // Solo las RESPUESTAS (sin la pregunta) — más impactante.
  const respondidas = DONES_PREGUNTAS
    .map((p) => (respuestas[p.key] || "").trim())
    .filter((x) => x.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Dones"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 16, total: 23 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Recuérdate", onClick: irARecuerdate }}
              next={{
                label: "Miedos →",
                onClick: irAMiedos,
                disabled: !hayDon,
                disabledTooltip: "Escribe al menos un don para continuar.",
              }}
            />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <IntroRecorrido>{DONES_INTRO.espejo}</IntroRecorrido>
            </Reveal>

            {/* ════════ TRES COLUMNAS: lo que escribiste · arquetipos · unir ════════ */}
            <RevealStagger w="100%" display="flex" flexDirection={{ base: "column", lg: "row" }} gap={{ base: 7, lg: 6 }} alignItems="stretch" stagger={0.16} delayChildren={0.15}>

              {/* ── COLUMNA 1 · LO QUE ESCRIBISTE (solo respuestas) ── */}
              <RevealItem direction="up" distance={30} scaleFrom={0.96} duration={0.6} flex="1" minW={0}>
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%" pb={COL_PB}>
                    <Box flexShrink={0} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={3}>
                      <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center"
                            letterSpacing="0.03em" style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                        Lo que recordaste de ti
                      </Text>
                      <Text color={TINTA} fontSize="xs" fontStyle="italic" textAlign="center" opacity={0.82} mt={1.5}
                            style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                        Toca lo que quieras unir al don activo.
                      </Text>
                      <Box mt={3} h="1px" w="82%" maxW="260px" mx="auto"
                           bgGradient={`linear(to-r, transparent, ${TINTA}88, transparent)`} />
                    </Box>
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX_TINTA}>
                      {respondidas.length > 0 ? (
                        <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                          {respondidas.map((r, i) => {
                            const on = recuerdoEnActiva(r);
                            return (
                              <Flex as="button" key={i} onClick={() => toggleRecuerdo(r)} textAlign="left" w="100%"
                                    align="flex-start" gap={2.5} borderRadius="xl"
                                    bg={on ? `${ORO}2e` : "rgba(255,251,243,0.66)"}
                                    border={`1.5px solid ${on ? ORO : `${TINTA}26`}`}
                                    boxShadow={on ? `0 0 14px ${ORO}55` : "none"}
                                    px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }} cursor="pointer" transition="all 0.16s"
                                    _hover={{ transform: "translateY(-1px)", boxShadow: on ? `0 0 18px ${ORO}77` : `0 0 10px ${TINTA}22` }}>
                                <Text flex="1" color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65">
                                  {r}
                                </Text>
                                {on && <Box as="span" color={TINTA} fontWeight="700" flexShrink={0} mt="2px">✓</Box>}
                              </Flex>
                            );
                          })}
                        </Flex>
                      ) : (
                        <Flex direction="column" align="center" justify="center" h="100%" gap={4} textAlign="center" px={4}>
                          <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.75}
                                style={{ textShadow: INK_SHADOW }}>
                            Aún no has respondido las preguntas de «Recuérdate».
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
                  </Flex>
                </Box>
              </Flex>
              </RevealItem>

              {/* ── COLUMNA 2 · TUS ARQUETIPOS (fondo de estrellas, como en Relación) ── */}
              <RevealItem direction="up" distance={30} scaleFrom={0.96} duration={0.6} flex="1" minW={0}>
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.jpg')"
                       bgSize="cover" bgPosition="center" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%" pb={COL_PB}>
                    <ColumnaHeaderBox dark icono={<AstrologiaIcon size={{ base: "24px", md: "24px" }} />}
                                      titulo="Tus arquetipos"
                                      apoyo={arquetipos.length === 0
                                        ? "Se abren cuando tengas hecha tu carta astral."
                                        : "Toca una carta para unirla al don activo; el ojo abre su lectura."} />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX_CLARO}>
                      {arquetipos.length === 0 ? (
                        // Sin carta astral la columna va BLOQUEADA: se explica qué
                        // se hace aquí y que para completarlo hace falta la carta.
                        <ArquetiposBloqueados
                          onIr={() => navigate("/metodo/astrologia")}
                          texto={[
                            "En esta página pones frente a frente lo que reconoces de ti y los arquetipos de tu carta: el espejo te devuelve tus dones con nombre propio.",
                            "Puedes escribir tus dones igualmente, pero para hacerlo completo necesitas tu carta astrológica.",
                          ]}
                        />
                      ) : (
                        <Flex direction="column" gap={{ base: 4, md: 5 }}>
                          {arquetipos.map((p) => (
                            <Flex key={p.cuerpoKey} gap={{ base: 3, md: 3.5 }}>
                              {facetasDe(p).map((it) => (
                                <MiniCard key={arquetipoKey(it)} item={it} color={p.color} symbol={p.symbol}
                                          activo={arqEnActiva(it)} onTap={() => toggleArq(it)} onLeer={() => abrirSaberMas(it)} />
                              ))}
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              </RevealItem>

              {/* ── COLUMNA 3 · TUS DONES (unir arquetipos → etiqueta) ── */}
              <RevealItem direction="up" distance={30} scaleFrom={0.96} duration={0.6} flex="1" minW={0}>
              <Flex direction="column" flex="1.05" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={`1px solid ${ORO}66`} boxShadow={`0 0 22px ${ORO}2e, ${glowPanel}`}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox
                      icono={<DonIcon color={TINTA} size={22} />}
                      titulo="Tus dones" apoyo="Nombra tu don y une tus arquetipos." />
                    <Box flex="1" overflowY="auto" px={{ base: 3.5, md: 4 }} pt={{ base: 4, md: 5 }} pb={{ base: 4, md: 5 }} sx={SCROLL_SX_TINTA}>
                      {dones.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="100%" gap={2.5} textAlign="center" px={4}>
                          <DonIcon color={ORO} size={30} glow={`${ORO}66`} />
                          <Text color={TINTA} opacity={0.75} fontStyle="italic" fontSize={{ base: "sm", md: "md" }}
                                style={{ textShadow: INK_SHADOW }}>
                            Pulsa «Añadir don», ponle nombre y toca las cartas de «Tus arquetipos» para unirlas.
                          </Text>
                        </Flex>
                      ) : (
                        <Flex direction="column" gap={{ base: 4, md: 5 }}>
                          {dones.map((d) => (
                            <DonCard key={d.id} d={d} activa={d.id === activaId} color={colorDon(d.id)}
                                     onActivar={() => setActivaId(d.id)}
                                     onTexto={(v) => updateTexto(d.id, v)}
                                     onQuitarArq={(a) => removeArq(d.id, a)}
                                     onQuitarRecuerdo={(t) => removeRecuerdo(d.id, t)}
                                     onBorrar={() => borrarDon(d.id)} />
                          ))}
                        </Flex>
                      )}
                    </Box>
                    {/* Barra inferior: añadir + autoguardado */}
                    <Flex flexShrink={0} align="center" justify="center" gap={3}
                          px={{ base: 3.5, md: 4 }} pt={5} pb={{ base: 3, md: 4 }}>
                      <Box as="button" onClick={añadirDon} px={{ base: 5, md: 6 }} py={2.5} borderRadius="full"
                           bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                           fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                           boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                        + Añadir don
                      </Box>
                      <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
              </RevealItem>
            </RevealStagger>

          </Flex>
        </Flex>
      </Box>

      <SaberMasModal isOpen={!!saberMas} onClose={() => setSaberMas(null)}
                     cuerpo={saberMas?.cuerpo || null} signo={saberMas?.signo} casa={saberMas?.casa} facet={saberMas?.facet} />

      <AyudaRecorrido pagina="dones-espejo" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────────────────

// Cabecera de columna (variante `dark` para la columna con fondo de estrellas).
function ColumnaHeaderBox({ icono, titulo, apoyo, dark }: { icono: React.ReactNode; titulo: string; apoyo?: string; dark?: boolean }) {
  const tinta = dark ? PAPEL : TINTA;
  const shadow = dark ? `0 1px 6px rgba(0,0,0,0.5)` : `0 1px 2px ${PAPEL}`;
  return (
    <Box flexShrink={0} position="relative" overflow="hidden" borderBottom={`1px solid ${tinta}55`}>
      {/* Imagen propia de la cabecera (independiente del cuerpo → menos distorsión) */}
      {dark ? (
        <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.jpg')"
             bgSize="cover" bgPosition="center" />
      ) : (
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
      )}
      <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={3}>
        <Flex direction="column" align="center" gap={1} textAlign="center">
          <Flex align="center" gap={2.5}>
            <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                 style={{ filter: `drop-shadow(${shadow})` }}>{icono}</Box>
            <Text color={tinta} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.03em"
                  style={{ textShadow: shadow }}>{titulo}</Text>
          </Flex>
          {apoyo && (
            <Text color={tinta} fontSize="xs" fontStyle="italic" opacity={0.85} maxW="300px"
                  style={{ textShadow: shadow }}>{apoyo}</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

const EyeIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill={color}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Icono de «don»: manos ofreciendo. Toma el color del txt que se le pase.
const DonIcon = ({ color, size = 20, glow }: { color: string; size?: number; glow?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={`${size}px`} h={`${size}px`} fill={color} flexShrink={0} display="inline-block"
       style={glow ? { filter: `drop-shadow(0 0 8px ${glow})` } : undefined}>
    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 19-16.5 39.5T472-358q0 30 10.5 59.5T519-243l84 83H160Zm556 0L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z" />
  </Box>
);

// Tarjeta de UNA faceta del arquetipo (signo o casa). Idéntica a la de Relación:
// fondo de estrellas, ojo (lectura), tocar = unir al don activo (se ilumina).
function MiniCard({ item, color, symbol, activo, onTap, onLeer }: {
  item: ArqItem; color: string; symbol: string; activo: boolean; onTap: () => void; onLeer: () => void;
}) {
  return (
    <Box position="relative" flex="1" minW={0} borderRadius="14px" overflow="hidden"
         border={`1.5px solid ${activo ? color : `${color}77`}`}
         boxShadow={activo
           ? `0 0 0 2px ${color}, 0 0 30px ${color}aa, 0 0 60px ${color}55, 0 10px 26px rgba(0,0,0,0.5)`
           : `0 0 18px ${color}55, 0 8px 22px rgba(0,0,0,0.45)`}
         transition="box-shadow 0.16s, border-color 0.16s">
      {/* Fondo: la misma imagen de astrología que la columna, a opacidad completa.
          Un velo muy suave mantiene legible la letra blanca sin tapar la imagen. */}
      <Box position="absolute" inset="0" zIndex={0} borderRadius="14px" overflow="hidden">
        <Box position="absolute" inset="0" bgImage="url('/img/astrologia/space.jpg')" bgSize="cover" bgPosition="center" />
        <Box position="absolute" inset="0" bg="rgba(8,13,30,0.28)" />
      </Box>
      {/* Ojo: abre la lectura de esta faceta */}
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onLeer(); }}
           position="absolute" top="6px" right="6px" zIndex={2} w="24px" h="24px" borderRadius="full"
           bg="rgba(0,0,0,0.5)" border={`1px solid ${color}66`} display="flex" alignItems="center" justifyContent="center"
           cursor="pointer" title="Leer" _hover={{ bg: "rgba(0,0,0,0.78)", borderColor: color }}>
        <EyeIcon color={color} />
      </Box>

      <Flex as="button" onClick={onTap} position="relative" zIndex={1} direction="column" align="center" justify="center" gap={1.5}
            w="100%" px={2} py={4} minH={{ base: "108px", md: "118px" }}
            bg={activo ? `${color}26` : "transparent"} cursor="pointer"
            transition="background 0.16s" _hover={{ bg: activo ? `${color}33` : "rgba(255,255,255,0.06)" }}>
        <Box sx={{ filter: `drop-shadow(0 0 9px ${color}cc)` }}>
          <Glifo symbol={symbol} color={color} size={34} />
        </Box>
        <Text color="#fff" fontWeight="700" fontSize={{ base: "xs", md: "sm" }} textAlign="center" lineHeight="1.2"
              style={{ textShadow: `0 0 10px ${color}aa` }}>
          {arquetipoLabel(item)}
        </Text>
      </Flex>
    </Box>
  );
}

// Una etiqueta de don: su nombre + los recuerdos y arquetipos unidos. Editable.
// Cada don recibe su propio `color`, que tiñe el marco, el icono y el acento.
function DonCard({ d, activa, color, onActivar, onTexto, onQuitarArq, onQuitarRecuerdo, onBorrar }: {
  d: DonReconocido; activa: boolean; color: string;
  onActivar: () => void; onTexto: (v: string) => void;
  onQuitarArq: (a: ArquetipoRef) => void; onQuitarRecuerdo: (t: string) => void; onBorrar: () => void;
}) {
  const recuerdos = d.recuerdos || [];
  const vacio = d.arquetipos.length === 0 && recuerdos.length === 0;
  return (
    <Box onClick={onActivar} position="relative" borderRadius="xl" overflow="hidden" cursor="pointer"
         bg="rgba(255,251,243,0.88)"
         border={`1px solid ${activa ? color : `${TINTA}33`}`}
         borderLeftWidth="5px" borderLeftColor={color}
         boxShadow={activa ? `0 0 0 2px ${color}, 0 0 22px ${color}66` : `0 2px 12px ${TINTA}1f`}
         opacity={activa ? 1 : 0.92} transition="all 0.16s">
      <Box px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
        {/* Nombre del don */}
        <Flex align="center" gap={2.5} mb={3}>
          <DonIcon color={color} size={20} glow={`${color}66`} />
          <Input value={d.texto} onChange={(e) => onTexto(e.target.value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}
                 placeholder="Nombra tu don…" variant="unstyled" flex="1"
                 color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700"
                 fontSize={{ base: "lg", md: "xl" }} sx={{ caretColor: TINTA }}
                 _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 600 }} />
          <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onBorrar(); }}
               w="24px" h="24px" borderRadius="full" bg={`${TINTA}14`} color={TINTA} flexShrink={0}
               display="flex" alignItems="center" justifyContent="center" fontSize="11px" cursor="pointer"
               _hover={{ bg: `${TINTA}26` }} title="Borrar don">✕</Box>
        </Flex>

        {/* Recuerdos + arquetipos unidos */}
        <Box borderRadius="lg" border={`1.5px dashed ${activa ? `${color}aa` : `${TINTA}33`}`}
             bg={`${color}0f`} px={3} py={2.5} minH="46px">
          {vacio ? (
            <Flex align="center" justify="center" minH="30px" textAlign="center">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize="sm">
                {activa ? "Toca arriba lo que recordaste o una carta de «Tus arquetipos» para unirlo." : "Pulsa este don para activarlo."}
              </Text>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {recuerdos.map((r) => (
                <Chip key={`r-${r}`} onRemove={() => onQuitarRecuerdo(r)}
                      icon={<RecuerdoGlyph />} label={r} maxLabelW="150px" />
              ))}
              {d.arquetipos.map((a) => (
                <Chip key={arquetipoKey(a)} onRemove={() => onQuitarArq(a)}
                      icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
                      label={arquetipoLabel(a)} />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// Glifo de «recuerdo» (lo que la persona recordó de sí): una cita/comilla.
const RecuerdoGlyph = () => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: "14px", color: TINTA }}>❝</Box>
);

function Chip({ icon, label, onRemove, maxLabelW }: {
  icon: React.ReactNode; label: string; onRemove: () => void; maxLabelW?: string;
}) {
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={`${TINTA}12`} color={TINTA} border={`1px solid ${TINTA}44`} maxW="100%">
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2" maxW={maxLabelW} noOfLines={maxLabelW ? 1 : undefined}>
        {label}
      </Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={`${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title="Quitar">✕</Box>
    </Flex>
  );
}
