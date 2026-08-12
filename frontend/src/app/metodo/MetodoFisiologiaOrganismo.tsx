import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { RECONSTRUCCION } from "../../components/metodo/comicReconstruccion";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import { BotonCompania } from "../../components/global/BotonCompania";
import { useReservarAltura } from "../../hooks/useReservarAltura";
import {
  API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { SISTEMAS, FRASE_ORGANISMO, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

const MBox = motion(Box);
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const GLOW_BOX = `0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`;
const PRE = "/recorrido/fisiologia/pre";

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
`;

// ── Foto circular de un sistema (cuadrada adaptada a círculo con cover) ──────
function SistemaFoto({ sistema, size }: { sistema: Sistema; size: any }) {
  const [err, setErr] = useState(false);
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" flexShrink={0}
         bg={`${sistema.color}22`} border={`1px solid ${sistema.color}77`}
         sx={{ boxShadow: `0 0 12px ${sistema.color}66, 0 0 26px ${sistema.color}33` }}
         display="flex" alignItems="center" justifyContent="center">
      {!err ? (
        <Image src={encodeURI(sistema.foto)} alt={sistema.label} w="100%" h="100%" objectFit="cover"
               draggable={false} onError={() => setErr(true)} />
      ) : (
        <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "lg", md: "2xl" }}
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
          {sistema.label.charAt(0)}
        </Text>
      )}
    </Box>
  );
}

// ── Caja con fondo/brillo de Fisiología (reutilizable) ───────────────────────
function PanelBox({ children, ...rest }: any) {
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={GLOW_BOX} {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%">{children}</Box>
    </Box>
  );
}

// ── Ficha del sistema en la bandeja (foto circular + nombre; se ARRASTRA al círculo) ──
// La bandeja solo muestra 6 a la vez: al soltar una en el círculo desaparece
// (no vuelve atrás) y entra la siguiente, manteniendo la actividad compacta.
function SistemaFicha({ sistema, onSoltar }: {
  sistema: Sistema;
  /** Devuelve true si la ficha ha caído dentro del círculo (acierto). */
  onSoltar: (rect: DOMRect) => boolean;
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  // Entrada al montarse (cada nueva ficha aparece con un pequeño fundido).
  // Solo opacidad: NO tocamos `scale` en la entrada para que whileHover/whileDrag
  // partan siempre de scale=1 y no reviertan a un valor pequeño (bug de encoger
  // al pasar el ratón por encima).
  useEffect(() => {
    controls.start({ opacity: 1, transition: { type: "spring", stiffness: 320, damping: 24 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MBox
      ref={ref}
      drag
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => {
        setArrastrando(false);
        if (!ref.current) return;
        const aceptado = onSoltar(ref.current.getBoundingClientRect());
        // Si acierta en el círculo, NO vuelve: desaparece (exit). Si falla, regresa.
        if (!aceptado) controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } });
      }}
      whileDrag={{ scale: 1.14, zIndex: 60 }}
      whileHover={{ y: -3, scale: 1.04 }}
      initial={{ opacity: 0 }}
      animate={controls}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      display="flex" flexDirection="column" alignItems="center" gap={2}
      cursor="grab"
      w={{ base: "92px", md: "116px" }}
      flexShrink={0}
      sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${sistema.color}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box position="relative" pointerEvents="none">
        <SistemaFoto sistema={sistema} size={{ base: "76px", md: "96px" }} />
      </Box>
      <Text color={fisiologiaTxt} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700" lineHeight="1.15"
            textAlign="center" letterSpacing="0.02em" pointerEvents="none"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
        {sistema.label}
      </Text>
    </MBox>
  );
}

// ── Posición (en %) de un sistema en el anillo del círculo ───────────────────
// `radio` es el radio del anillo en % del contenedor. Debe ser menor que el
// radio del disco negro (menos la mitad de la foto) para que las fotos queden
// DENTRO del disco: en Fase A el disco está a `inset 12%` (radio 38%), así que
// el anillo va a 26%; en el AnilloFinal el disco ocupa todo (radio 50%) y cabe a 37%.
function posEnAnillo(i: number, total: number, radio = 37): { x: number; y: number } {
  const ang = (i / total) * Math.PI * 2 - Math.PI / 2; // empieza arriba
  return { x: 50 + Math.cos(ang) * radio, y: 50 + Math.sin(ang) * radio };
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaOrganismo() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [colocados, setColocados] = useState<string[]>([]); // keys en orden de colocación
  const [completo, setCompleto] = useState(false);
  const [frase, setFrase] = useState<string | null>(null);
  const [cuerpoOk, setCuerpoOk] = useState(false);
  // Cómic de cierre: «te reconstruyes cada día». Se intercala al pulsar
  // «Niveles →», como puente hacia lo que viene (hábitos, nutrición…).
  const [comicOpen, setComicOpen] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Las viñetas de «Te reconstruyes cada día», en el idioma activo.
  const reconstruccionVinetas = useComic("fisiologia-reconstruccion", RECONSTRUCCION);
  // Reserva la altura del box de sistemas para que no encoja al arrastrarlos fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();
  const dataRef = useRef<Record<string, any>>({});
  const circuloRef = useRef<HTMLDivElement>(null);

  const total = SISTEMAS.length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          if (dataRef.current?.organismo_hecho) { setColocados(SISTEMAS.map((s) => s.key)); setCompleto(true); }
        } catch { /* sin fila todavía */ }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const guardarHecho = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`,
        { data: { ...dataRef.current, organismo_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = { ...dataRef.current, organismo_hecho: true };
    } catch { /* se reintenta */ }
  };

  const colocar = (s: Sistema) => {
    setColocados((prev) => {
      if (prev.includes(s.key)) return prev;
      const next = [...prev, s.key];
      setFrase(FRASE_ORGANISMO[s.key] ?? null);
      if (next.length >= total) {
        setTimeout(() => { setCompleto(true); void guardarHecho(); }, 1400);
      }
      return next;
    });
  };

  // ¿La ficha soltada cae dentro del círculo de ensamblaje? (viewport-based,
  // funciona con scroll y en táctil, igual que en el resto de páginas).
  // Devuelve true si acierta (para que la ficha no vuelva atrás y desaparezca).
  const soltarEnCirculo = (s: Sistema, rect: DOMRect): boolean => {
    const el = circuloRef.current;
    if (!el) return false;
    const c = el.getBoundingClientRect();
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2, radio = c.width / 2;
    const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
    if (Math.hypot(px - cx, py - cy) <= radio + rect.width / 2) { colocar(s); return true; }
    return false;
  };

  const reiniciar = () => { setColocados([]); setCompleto(false); setFrase(null); };

  // Bandeja de 6 HUECOS FIJOS. Cada hueco guarda un sistema; al colocar uno, su
  // hueco se rellena con el SIGUIENTE de la cola (sustitución EN EL MISMO SITIO),
  // sin que las demás piezas se recoloquen. Los huecos vacíos del final se pintan
  // como placeholders invisibles → la caja mantiene su alto y nunca cae una fila.
  const slots = useMemo<(string | null)[]>(() => {
    const inSlot: (string | null)[] = SISTEMAS.slice(0, 6).map((x) => x.key);
    let queuePtr = 6;
    const yaColocados = new Set<string>();
    for (const key of colocados) {
      yaColocados.add(key);
      const idx = inSlot.indexOf(key);
      if (idx < 0) continue; // (por seguridad; no debería pasar)
      let repl: string | null = null;
      while (queuePtr < SISTEMAS.length) {
        const cand = SISTEMAS[queuePtr++].key;
        if (!yaColocados.has(cand) && !inSlot.includes(cand)) { repl = cand; break; }
      }
      inSlot[idx] = repl;
    }
    return inSlot;
  }, [colocados]);

  if (loading) return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 4, md: 6 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 4, md: 5 }}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="El cuerpo"
            pageLabel="4/4"
            compact
            maxW="1000px"
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Sistemas", onClick: () => navigate("/metodo/fisiologia/sistemas") }}
            extra={celulasBtn}
            next={{ label: "Niveles →", onClick: () => setComicOpen(true),
                    disabled: !completo, disabledTooltip: "Primero crea al ser humano" }}
          />

          {/* Instrucción inicial que, al colocar un sistema, se sustituye por su
              frase «memorable» en grande y bien visible. */}
          {!completo && (
            <Flex w="100%" justify="center" align="center" minH={{ base: "64px", md: "84px" }} px={2}>
              <AnimatePresence mode="wait">
                {frase ? (
                  <MBox key={frase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} textAlign="center">
                    <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" fontStyle="italic"
                          lineHeight="1.4" maxW="760px"
                          style={{ textShadow: `0 1px 10px rgba(0,0,0,0.6), 0 0 22px ${fisiologiaTxt}66` }}>
                      «{frase}»
                    </Text>
                  </MBox>
                ) : (
                  <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        textAlign="center">
                    <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                          maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                      Construye un ser humano.
                    </Text>
                  </MBox>
                )}
              </AnimatePresence>
            </Flex>
          )}

          <AnimatePresence mode="wait">
            {!completo ? (
              // ── FASE A · dos boxes: bandeja de sistemas (izq) + círculo (der) ──
              <MBox key="montaje" w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* IZQUIERDA · el círculo donde se van manifestando */}
                  <PanelBox flex={{ base: "1 1 auto", md: "0 0 42%" }}>
                    <Flex direction="column" align="center" justify="center" h="100%"
                          px={{ base: 5, md: 7 }} py={{ base: 7, md: 8 }} gap={5}>
                      {/* Círculo de ensamblaje (zona donde se sueltan los sistemas) */}
                      <Box ref={circuloRef} position="relative" w={{ base: "260px", md: "320px" }} h={{ base: "260px", md: "320px" }}
                           flexShrink={0}>
                        <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                             border={`1.5px dashed ${fisiologiaTxt}55`}
                             animation={`${pulse} 3.4s ease-in-out infinite`} />
                        <Box position="absolute" inset="6%" borderRadius="full" pointerEvents="none"
                             sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 48%, #05040a 100%)",
                                   boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 26px ${fisiologiaTxt}22` }} />

                        {/* sistemas colocados: anillo compacto CENTRADO en el disco
                            (radio 26% → agrupados en el medio, con buen margen negro
                            alrededor, sin pegarse al borde ni solaparse). */}
                        {colocados.map((key, i) => {
                          const s = SISTEMAS.find((x) => x.key === key)!;
                          const p = posEnAnillo(i, total, 26);
                          // El translate(-50%,-50%) va en un Box normal (CSS): si lo
                          // pusiéramos en el MBox, la animación de `scale` de framer
                          // pisaría ese transform y el anillo saldría descentrado.
                          return (
                            <Box key={key} position="absolute" left={`${p.x}%`} top={`${p.y}%`}
                                 transform="translate(-50%,-50%)">
                              <MBox initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                                <SistemaFoto sistema={s} size={{ base: "38px", md: "48px" }} />
                              </MBox>
                            </Box>
                          );
                        })}

                        {colocados.length === 0 && (
                          <Flex position="absolute" inset="0" align="center" justify="center" pointerEvents="none">
                            <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                                  textAlign="center" px={6} style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                              su lugar en el cuerpo
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </PanelBox>

                  {/* DERECHA · todos los sistemas (se arrastran al círculo) */}
                  {/* overflow:visible para que la ficha no se recorte al arrastrarla al otro box. */}
                  <PanelBox flex="1" overflow="visible">
                    <Box px={{ base: 4, md: 6 }} py={{ base: 5, md: 7 }}>
                      <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                            letterSpacing="0.12em" textTransform="uppercase" textAlign="center" mb={4}
                            style={{ textShadow: INK }}>
                        Los sistemas · {colocados.length}/{total}
                      </Text>
                      {/* 6 HUECOS FIJOS en un grid de 3 columnas (2 filas). Cada
                          pieza tiene su celda: al soltar una en el círculo, en SU
                          MISMA celda entra la siguiente de la cola (las demás NO se
                          mueven). Los huecos vacíos del final son placeholders
                          invisibles → el nº de filas y el alto de la caja no cambian
                          nunca, y jamás cae una pieza «suelta» debajo. */}
                      <Box ref={piezasRef} display="grid" gridTemplateColumns="repeat(3, auto)"
                           justifyContent="center" justifyItems="center" alignContent="center"
                           columnGap={{ base: 3, md: 5 }} rowGap={{ base: 4, md: 5 }}
                           minH={piezasMinH ? `${piezasMinH}px` : { base: "200px", md: "240px" }}>
                        {slots.map((key, i) => {
                          if (!key) {
                            // Hueco vacío (final): reserva la celda, invisible.
                            return <Box key={`hueco-${i}`} w={{ base: "92px", md: "116px" }}
                                        h={{ base: "104px", md: "128px" }} aria-hidden pointerEvents="none" />;
                          }
                          const s = SISTEMAS.find((x) => x.key === key)!;
                          return (
                            <SistemaFicha key={key} sistema={s}
                                          onSoltar={(rect) => soltarEnCirculo(s, rect)} />
                          );
                        })}
                      </Box>
                    </Box>
                  </PanelBox>
                </Flex>
              </MBox>
            ) : (
              // ── FASE B · el cuerpo completo ──
              <MBox key="final" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* Imagen del cuerpo (fallback: anillo de sistemas iluminado) */}
                  <PanelBox flexShrink={0} w={{ base: "100%", md: "auto" }}>
                    <Flex justify="center" align="center" px={{ base: 6, md: 8 }} py={{ base: 8, md: 9 }} h="100%">
                      <Box position="relative" w={{ base: "230px", md: "300px" }} h={{ base: "230px", md: "300px" }}>
                        <Box position="absolute" inset="-4%" borderRadius="full" pointerEvents="none"
                             animation={`${shimmer} 3.6s ease-in-out infinite`}
                             sx={{ boxShadow: `0 0 50px ${fisiologiaTxt}55, 0 0 90px ${fisiologiaTxt}33` }} />
                        <Image src={`${PRE}/cuerpo.png`} alt="Un ser humano" w="100%" h="100%" objectFit="contain"
                               fallbackStrategy="onError"
                               onLoad={() => setCuerpoOk(true)}
                               opacity={cuerpoOk ? 1 : 0} transition="opacity 0.5s ease"
                               style={{ filter: `drop-shadow(0 0 18px ${fisiologiaTxt}55)` }}
                               fallback={<AnilloFinal />} />
                        {!cuerpoOk && <AnilloFinal />}
                      </Box>
                    </Flex>
                  </PanelBox>

                  {/* Texto de cierre */}
                  <PanelBox flex="1">
                    <Flex direction="column" justify="center" gap={4} h="100%"
                          px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }} textAlign={{ base: "center", md: "left" }}>
                      <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                            style={{ textShadow: INK }}>
                        Has construido un ser humano.
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                           bgGradient={`linear(to-r, ${fisiologiaTxt}aa, transparent)`} />
                      <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                            style={{ textShadow: INK }}>
                        Todos los <b>sistemas</b>, funcionando en armonía, forman un <b>organismo</b> completo.
                      </Text>
                      <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                            style={{ textShadow: INK }}>
                        Has subido desde una sola partícula: átomos, moléculas, células, tejidos, órganos y sistemas.
                      </Text>
                      <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.7"
                            style={{ textShadow: INK }}>
                        Ese organismo entero, vivo y en marcha en este mismo instante, <b>eres tú</b>.
                      </Text>
                    </Flex>
                  </PanelBox>
                </Flex>

                {/* Volver a hacer — fuera del box, abajo a la derecha del todo
                    («Volver a los niveles» ya está en el header como «Niveles →»). */}
                <Flex justify="flex-end" w="100%" mt={{ base: 5, md: 6 }}>
                  <Box as="button" onClick={reiniciar}
                       display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                       bg="rgba(255,255,255,0.08)" color={fisiologiaTxt} border="1px solid rgba(255,255,255,0.28)"
                       fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                       letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                       _hover={{ bg: "rgba(255,255,255,0.16)", color: fisiologiaTxt, borderColor: `${fisiologiaTxt}aa` }}>
                    ↺ Volver a hacer
                  </Box>
                </Flex>
              </MBox>
            )}
          </AnimatePresence>
        </Flex>
      </Flex>

      {celulasModal}

      {/* Cómic de cierre: «te reconstruyes cada día». Se intercala antes de
          volver a Niveles, como puente hacia lo que viene. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate("/metodo/fisiologia/niveles")}
        vinetas={reconstruccionVinetas}
        continueLabel={t("fisiologia.niveles.titulo")}
        themeColor={fisiologiaTxt}
        textColor={fisiologiaTxt}
        disciplinaBgImage="/img/fondos/fisio.webp"
        disciplinaBgColor={fisiologiaBg}
      />

      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}

// ── Reserva del cuerpo: anillo de TODOS los sistemas iluminado (si falta cuerpo.png) ──
function AnilloFinal() {
  const total = SISTEMAS.length;
  return (
    <Box position="absolute" inset="0" borderRadius="full"
         sx={{ background: "radial-gradient(circle at 46% 38%, #2a2440 0%, #171226 52%, #05040a 100%)",
               boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 30px ${fisiologiaTxt}33` }}>
      {SISTEMAS.map((s, i) => {
        const p = posEnAnillo(i, total);
        return (
          <Box key={s.key} position="absolute" left={`${p.x}%`} top={`${p.y}%`} transform="translate(-50%,-50%)">
            <SistemaFoto sistema={s} size={{ base: "34px", md: "44px" }} />
          </Box>
        );
      })}
      <Flex position="absolute" inset="0" align="center" justify="center" pointerEvents="none">
        <Text color={fisiologiaTxt} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800"
              style={{ textShadow: `0 0 18px ${fisiologiaTxt}, 0 1px 4px rgba(0,0,0,0.7)` }}>
          Tú
        </Text>
      </Flex>
    </Box>
  );
}
