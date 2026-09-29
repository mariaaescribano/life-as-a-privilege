// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · DONES (el espejo)  ·  20/29
//
// El reverso de «Recuérdate»: aquí se COSECHA. Funciona como «Heridas»:
//   · Columna «Lo que escribiste» — solo las respuestas (más impactante).
//   · Columna «Tus arquetipos» — la carta astral, igual que en Relación.
//   · Debajo, «Tu don en curso»: la persona toca recuerdos y arquetipos para
//     reunirlos y, al pulsar «He terminado este don», le pone nombre en un
//     popup. Al guardar, el don aparece —bajo un separador de mandala— como un
//     box CUADRADO de su propio color, en la misma rejilla que verá en
//     «Tus dones». La plataforma nunca interpreta.
//
// Datos: lee data.dones.respuestas + la carta astral (metodo-astrologia).
//        escribe data.dones.lista = DonReconocido[]  (don + piezas unidas).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
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
import { MandalaDivider } from "../../components/metodo/HeridaGrid";
import { DonGrid, DonIcon, RecuerdoGlyph, colorDonIdx } from "../../components/metodo/DonGrid";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  arquetipoKey,
  type LineaDeVidaData,
  type DonesData,
  type DonReconocido,
  type ArquetipoRef,
} from "../../components/metodo/psicologiaRecorrido";
import { useDonesIntro, useDonesPreguntas } from "../../components/metodo/psicologiaRecorrido.en";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  astrologiaTxt,
  AstrologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const ARQUETIPOS_IMG = "/img/astrologia/space.webp";
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
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const donesPreguntas = useDonesPreguntas();
  const donesIntro = useDonesIntro();

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [arquetipos, setArquetipos] = useState<ArqPlaneta[]>([]);
  // ¿Ha pasado ya por Astrología? Sin carta, el espejo se queda tras el cristal.
  const [astroHecha, setAstroHecha] = useState(false);

  // Don en curso (selección) + dones guardados.
  const [selRecuerdos, setSelRecuerdos] = useState<string[]>([]);
  const [selArqs, setSelArqs] = useState<ArquetipoRef[]>([]);
  const [dones, setDones] = useState<DonReconocido[]>([]);

  const [nombreOpen, setNombreOpen] = useState(false);
  const [nombre, setNombre] = useState("");

  const [saberMas, setSaberMas] = useState<{ cuerpo: Cuerpo; signo?: string; casa?: number; facet: "signo" | "casa" } | null>(null);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});
  const donesRef = useRef<HTMLDivElement>(null);

  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useLockBodyScroll(nombreOpen);
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
        const me = await getUserMe();
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const [psiRes, astroRes] = await Promise.allSettled([
          axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (psiRes.status === "fulfilled") {
          const d: LineaDeVidaData = psiRes.value.data?.data || {};
          dataRef.current = d;
          setRespuestas({ ...(d.dones?.respuestas || {}) });
          setDones(coercionarDones(d.dones?.lista));
        }
        if (astroRes.status === "fulfilled") {
          // Se da por hecha en cuanto envió sus datos de nacimiento, que es
          // cuando el servidor le calcula la carta.
          const lista = arquetiposDeCarta(astroRes.value.data?.data || {});
          setAstroHecha(!!astroRes.value.data?.solicitud_enviada_at || lista.length > 0);
          setArquetipos(lista);
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

  // ── El don en curso: tocar piezas lo reúne ──
  const toggleRecuerdo = (texto: string) =>
    setSelRecuerdos((sel) => (sel.includes(texto) ? sel.filter((x) => x !== texto) : [...sel, texto]));
  const toggleArq = (a: ArqItem) =>
    setSelArqs((sel) => (sel.some((x) => arquetipoKey(x) === arquetipoKey(a))
      ? sel.filter((x) => arquetipoKey(x) !== arquetipoKey(a))
      : [...sel, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }]));

  const totalSel = selRecuerdos.length + selArqs.length;
  // Color del don en curso = el que le tocará al guardarlo (siguiente índice).
  const colorEnCurso = colorDonIdx(dones.length);

  const guardarDon = async () => {
    if (totalSel === 0) return;
    const nuevo: DonReconocido = {
      id: nuevoId(),
      texto: nombre.trim() || t("metodo.psico.donSinNombre"),
      arquetipos: selArqs,
      recuerdos: selRecuerdos,
    };
    const next = [...dones, nuevo];
    setDones(next);
    setSelRecuerdos([]); setSelArqs([]);
    setNombre(""); setNombreOpen(false);
    // La rejilla está abajo del todo: bajamos hasta ella para ver aparecer el
    // don nuevo (la Reveal tarda 0.42s en montarla).
    setTimeout(() => { if (montado.current) donesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, 500);
    await persistir(next);
  };

  const borrarDon = async (id: string) => {
    const next = dones.filter((d) => d.id !== id);
    setDones(next);
    await persistir(next);
  };

  const abrirSaberMas = (a: ArqItem) => {
    const c = cuerpoByKey(a.cuerpoKey);
    if (!c) return;
    if (a.faceta === "signo") setSaberMas({ cuerpo: c, signo: a.signo || undefined, facet: "signo" });
    else setSaberMas({ cuerpo: c, casa: a.casa ?? undefined, facet: "casa" });
  };

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  const irARecuerdate = async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/dones`); };
  const irATusDones = async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/dones-lista`); };

  // Hay que guardar al menos un don (con nombre) para poder continuar.
  const hayDon = dones.some((d) => (d.texto || "").trim() !== "");
  const recuerdoEnCurso = (texto: string) => selRecuerdos.includes(texto);
  const arqEnCurso = (a: ArqItem) => selArqs.some((x) => arquetipoKey(x) === arquetipoKey(a));

  // Solo las RESPUESTAS (sin la pregunta) — más impactante.
  const respondidas = donesPreguntas
    .map((p) => (respuestas[p.key] || "").trim())
    .filter((x) => x.length > 0);

  // Los chips de la selección, tanto en el box «en curso» como en el popup.
  const chipsSeleccion = (
    <Flex wrap="wrap" gap={2} justify="center">
      {selRecuerdos.map((r) => (
        <Chip key={`sr-${r}`} tint={`${colorEnCurso}2e`} icon={<RecuerdoGlyph />} label={r} maxLabelW="150px"
              onRemove={() => toggleRecuerdo(r)} />
      ))}
      {selArqs.map((a) => (
        <Chip key={`sa-${arquetipoKey(a)}`} tint={`${colorEnCurso}2e`}
              icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
              label={arquetipoLabel(a)}
              onRemove={() => setSelArqs((sel) => sel.filter((x) => arquetipoKey(x) !== arquetipoKey(a)))} />
      ))}
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* El cuerpo de la página. Sin carta astral se ve DETRÁS de un cristal:
          desenfocado y sin poder tocar nada (el popup de abajo explica por
          qué). El header de la web se queda nítido y usable, para poder irse a
          otro sitio sin pelearse con el popup. */}
      <Box position="relative" flex="1"
           filter={astroHecha ? undefined : "blur(7px)"}
           pointerEvents={astroHecha ? undefined : "none"}
           userSelect={astroHecha ? undefined : "none"}
           aria-hidden={astroHecha ? undefined : true}
           transition="filter 0.4s ease">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.dones")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 20, total: 29 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.recuerdate")}`, onClick: irARecuerdate }}
              next={{
                label: `${t("metodo.psico.tusDones")} →`,
                onClick: irATusDones,
                disabled: !hayDon,
                disabledTooltip: t("metodo.psico.faltaDon"),
              }}
            />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <IntroRecorrido>{donesIntro.espejo}</IntroRecorrido>
            </Reveal>

            {/* ════════ DOS COLUMNAS: lo que escribiste · arquetipos ════════ */}
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
                            letterSpacing="0.03em" style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.loQueRecordaste")}</Text>
                      <Text color={TINTA} fontSize="xs" fontStyle="italic" textAlign="center" opacity={0.82} mt={1.5}
                            style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.tocaParaUnir")}</Text>
                      <Box mt={3} h="1px" w="82%" maxW="260px" mx="auto"
                           bgGradient={`linear(to-r, transparent, ${TINTA}88, transparent)`} />
                    </Box>
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX_TINTA}>
                      {respondidas.length > 0 ? (
                        <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                          {respondidas.map((r, i) => {
                            const on = recuerdoEnCurso(r);
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
                                style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.sinRecuerdate")}</Text>
                          <Box as="button" onClick={irARecuerdate} px={6} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                               fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                               boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                               _hover={{ transform: "translateY(-2px)" }}>{t("metodo.psico.irARecuerdate")}</Box>
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
                  <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.webp')"
                       bgSize="cover" bgPosition="center" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%" pb={COL_PB}>
                    <ColumnaHeaderBox dark icono={<AstrologiaIcon size={{ base: "24px", md: "24px" }} />}
                                      titulo={t("metodo.psico.tusArquetipos")}
                                      apoyo={arquetipos.length === 0
                                        ? t("metodo.psico.arquetiposSinCarta")
                                        : t("metodo.psico.arquetiposUnirDon")} />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX_CLARO}>
                      {arquetipos.length === 0 ? (
                        // Sin carta astral la columna va BLOQUEADA: se explica qué
                        // se hace aquí y que para completarlo hace falta la carta.
                        <ArquetiposBloqueados
                          onIr={() => navigate("/metodo/astrologia")}
                          texto={[
                            t("metodo.psico.bloqEspejo1"),
                            t("metodo.psico.bloqEspejo2"),
                          ]}
                        />
                      ) : (
                        <Flex direction="column" gap={{ base: 4, md: 5 }}>
                          {arquetipos.map((p) => (
                            <Flex key={p.cuerpoKey} gap={{ base: 3, md: 3.5 }}>
                              {facetasDe(p).map((it) => (
                                <MiniCard key={arquetipoKey(it)} item={it} color={p.color} symbol={p.symbol}
                                          activo={arqEnCurso(it)} onTap={() => toggleArq(it)} onLeer={() => abrirSaberMas(it)} />
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
            </RevealStagger>

            {/* ════════ DON EN CURSO · box elegante (con el botón dentro) ════════ */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Box position="relative" w="100%" maxW="920px" borderRadius="2xl" overflow="hidden"
                 border={`1px solid ${ORO}66`} boxShadow={`0 0 22px ${ORO}2e, ${glowPanel}`}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                    px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }}>
                {/* Título del box */}
                <Flex align="center" gap={2.5}>
                  <DonIcon color={TINTA} size={20} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.03em"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.donEnCurso")}</Text>
                </Flex>
                <Box h="1px" w="60%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

                {totalSel === 0 ? (
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85} textAlign="center"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.tocaParaReunirDon")}</Text>
                ) : chipsSeleccion}

                <Flex align="center" justify="center" gap={3} wrap="wrap">
                  <Box as="button" onClick={totalSel > 0 ? () => setNombreOpen(true) : undefined}
                       aria-disabled={totalSel === 0}
                       px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
                       bg={totalSel > 0 ? TINTA : `${TINTA}55`} border={`1.5px solid ${TINTA}`}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.04em" cursor={totalSel > 0 ? "pointer" : "not-allowed"} opacity={totalSel > 0 ? 1 : 0.7}
                       boxShadow={totalSel > 0 ? `0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a` : "none"} transition="all 0.18s"
                       _hover={totalSel > 0 ? { transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` } : {}}>
                    <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.heTerminadoDon")}</Box>
                  </Box>
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                </Flex>
              </Flex>
            </Box>
            </Reveal>

            {/* ════════ SEPARADOR MANDALA + REJILLA DE DONES ════════ */}
            {dones.length > 0 && (
              <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.42} duration={0.75} w="100%">
              <>
                <MandalaDivider />
                <Flex ref={donesRef} direction="column" align="center" gap={4} w="100%" scrollMarginTop="90px">
                  <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>{t("metodo.psico.tusDones")}</Text>
                  <DonGrid dones={dones} onBorrar={(id) => void borrarDon(id)} />
                </Flex>
              </>
              </Reveal>
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ════════ POPUP · «Ponle nombre a tu don» ════════ */}
      {nombreOpen && (
        <Box position="fixed" inset={0} zIndex={2400} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setNombreOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="480px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 9 }} py={{ base: 9, md: 10 }} textAlign="center"
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto">
              <Flex align="center" justify="center" gap={2.5} mb={4}>
                <DonIcon color={TINTA} size={22} />
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                      style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.ponleNombreDon")}</Text>
              </Flex>

              {/* Raya horizontal de separación */}
              <Box h="1px" w="70%" maxW="240px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              {/* Lo que has seleccionado */}
              <Box my={6}>{chipsSeleccion}</Box>

              <Input
                autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && totalSel > 0) void guardarDon(); }}
                placeholder={t("metodo.psico.nombraTuDon")}
                bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}44`} color={TINTA} borderRadius="xl"
                size="lg" textAlign="center" fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl" }}
                fontWeight="600" sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
                _hover={{ borderColor: `${TINTA}66` }}
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.7)" }}
              />
              <Flex align="center" justify="center" gap={3} mt={8}>
                <Box as="button" onClick={() => setNombreOpen(false)} px={6} py={2.5} borderRadius="full"
                     bg="transparent" color={TINTA} border={`1.5px solid ${TINTA}66`} fontFamily="'EB Garamond', serif"
                     fontWeight="600" fontSize={{ base: "sm", md: "md" }} cursor="pointer" transition="all 0.18s"
                     _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>{t("metodo.psico.seguirEligiendo")}</Box>
                <Box as="button" onClick={() => void guardarDon()} px={8} py={2.5} borderRadius="full"
                     bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                     boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.guardarDon")}</Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <SaberMasModal isOpen={!!saberMas} onClose={() => setSaberMas(null)}
                     cuerpo={saberMas?.cuerpo || null} signo={saberMas?.signo} casa={saberMas?.casa} facet={saberMas?.facet} />


      {/* ── Sin carta astral: la página se queda detrás de un cristal ──
          Aquí los dones se ponen frente a los arquetipos de la carta, así que
          sin Astrología falta la mitad del espejo. Se ve el fondo desenfocado
          (para saber qué hay) pero no se puede tocar, y el popup explica qué se
          gana con la carta. Astrología no es obligatoria en el Mapa: por eso el
          popup lo dice con todas las letras en vez de dar un portazo. */}
      {!astroHecha && (
        <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.55)"
             fontFamily="'EB Garamond', serif">
          <Box position="relative" w="100%" maxW={{ base: "420px", md: "520px" }}
               borderRadius="2xl" overflow="hidden"
               bgImage={`url('${ARQUETIPOS_IMG}')`} bgSize="cover" bgPosition="center"
               boxShadow={`0 0 40px ${astrologiaTxt}44, 0 24px 70px rgba(0,0,0,0.6)`}
               border={`1px solid ${astrologiaTxt}55`}>
            {/* Velo: la foto sola no da contraste para la letra clara. */}
            <Box position="absolute" inset={0} bg="rgba(8,13,30,0.38)" pointerEvents="none" />

            <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                  px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }} textAlign="center">
              {/* Chapa del candado */}
              <Flex align="center" justify="center" w="62px" h="62px" borderRadius="full" flexShrink={0}
                    bg="rgba(0,0,0,0.42)" border={`1.5px solid ${astrologiaTxt}66`}
                    boxShadow={`0 0 20px ${astrologiaTxt}44, inset 0 0 18px rgba(0,0,0,0.5)`}>
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="30px" h="30px"
                     fill={astrologiaTxt} flexShrink={0}
                     style={{ filter: `drop-shadow(0 0 10px ${astrologiaTxt}77) drop-shadow(0 2px 4px rgba(0,0,0,0.6))` }}>
                  <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                </Box>
              </Flex>

              <Text color={PAPEL} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.03em"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}>
                {t("metodo.psico.espejoBloqTitulo")}
              </Text>

              <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" opacity={0.95}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}>
                {t("metodo.psico.bloqEspejo1")}
              </Text>
              <Text color={PAPEL} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.9} fontStyle="italic"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}>
                {t("metodo.psico.espejoBloqNoHaceFalta")}
              </Text>

              <Flex gap={3} mt={2} wrap="wrap" justify="center">
                <Box as="button" onClick={() => navigate("/metodo/astrologia")}
                     px={6} py={2.5} borderRadius="full" bg={PAPEL} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                     cursor="pointer" boxShadow={`0 0 18px ${astrologiaTxt}44`} transition="all 0.18s"
                     _hover={{ boxShadow: `0 0 26px ${astrologiaTxt}77`, transform: "translateY(-1px)" }}>
                  {t("metodo.psico.espejoBloqIr")}
                </Box>
                <Box as="button" onClick={irARecuerdate}
                     px={6} py={2.5} borderRadius="full" bg="transparent" color={PAPEL}
                     border={`1.5px solid ${PAPEL}88`}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                     cursor="pointer" transition="all 0.18s"
                     _hover={{ borderColor: PAPEL, bg: "rgba(255,255,255,0.12)" }}>
                  {t("comun.volver")}
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}

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
        <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.webp')"
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

// Tarjeta de UNA faceta del arquetipo (signo o casa). Idéntica a la de Relación:
// fondo de estrellas, ojo (lectura), tocar = unir al don en curso (se ilumina).
function MiniCard({ item, color, symbol, activo, onTap, onLeer }: {
  item: ArqItem; color: string; symbol: string; activo: boolean; onTap: () => void; onLeer: () => void;
}) {
  const t = useT();
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
        <Box position="absolute" inset="0" bgImage="url('/img/astrologia/space.webp')" bgSize="cover" bgPosition="center" />
        <Box position="absolute" inset="0" bg="rgba(8,13,30,0.28)" />
      </Box>
      {/* Ojo: abre la lectura de esta faceta */}
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onLeer(); }}
           position="absolute" top="6px" right="6px" zIndex={2} w="24px" h="24px" borderRadius="full"
           bg="rgba(0,0,0,0.5)" border={`1px solid ${color}66`} display="flex" alignItems="center" justifyContent="center"
           cursor="pointer" title={t("metodo.psico.leer")} _hover={{ bg: "rgba(0,0,0,0.78)", borderColor: color }}>
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

function Chip({ icon, label, onRemove, tint, maxLabelW }: {
  icon: React.ReactNode; label: string; onRemove: () => void; tint?: string; maxLabelW?: string;
}) {
  const t = useT();
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={tint || `${TINTA}12`} color={TINTA} border={`1px solid ${TINTA}44`} maxW="100%">
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2" maxW={maxLabelW} noOfLines={maxLabelW ? 1 : undefined}>
        {label}
      </Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={`${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title={t("metodo.psico.quitar")}>✕</Box>
    </Flex>
  );
}
