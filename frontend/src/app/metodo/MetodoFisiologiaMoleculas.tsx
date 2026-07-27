import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useReservarAltura } from "../../hooks/useReservarAltura";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

const MBox = motion(Box);

// Halo oscuro para leer el texto claro sobre el fondo morado de Fisiología.
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;

// ── Átomos ────────────────────────────────────────────────────────────────
type Tipo = "oxigeno" | "hidrogeno" | "carbono";

const GLOW: Record<Tipo, string> = { oxigeno: "#e08a8a", hidrogeno: "#8ab6e6", carbono: "#a9a2b3" };
const LABEL: Record<Tipo, string> = { oxigeno: "oxígeno", hidrogeno: "hidrógeno", carbono: "carbono" };
const GLYPH: Record<Tipo, string> = { oxigeno: "O", hidrogeno: "H", carbono: "C" };
const IMG: Record<Tipo, string> = {
  oxigeno: "/recorrido/fisiologia/pre/oxigeno.png",
  hidrogeno: "/recorrido/fisiologia/pre/hidrogeno.png",
  carbono: "/recorrido/fisiologia/pre/carbono.png",
};

// Tamaños del átomo según contexto.
const S_DRAG: Record<Tipo, any> = {
  oxigeno: { base: "96px", md: "128px" }, hidrogeno: { base: "60px", md: "80px" }, carbono: { base: "84px", md: "112px" },
};
const S_ZONA: Record<Tipo, any> = {
  oxigeno: { base: "84px", md: "104px" }, hidrogeno: { base: "50px", md: "62px" }, carbono: { base: "74px", md: "92px" },
};
const S_BIG: Record<Tipo, any> = {
  oxigeno: { base: "96px", md: "116px" }, hidrogeno: { base: "54px", md: "66px" }, carbono: { base: "82px", md: "102px" },
};
const S_MINI: Record<Tipo, any> = {
  oxigeno: { base: "40px", md: "83px" },
  hidrogeno: { base: "24px", md: "50px" },
  carbono: { base: "34px", md: "73px" },
};

// ── Moléculas del recorrido (en orden) ──────────────────────────────────────
// slots[0] = átomo central (al que se enlazan los demás). x/y en % del panel.
interface Slot { tipo: Tipo; x: number; y: number; }
interface Mol {
  key: string;
  nombre: string;
  formula: string;
  instruccion: string;
  slots: Slot[];
  titulo: string;
  parrafos: React.ReactNode[];
  /** Foto de la molécula ya formada (celebración/resumen). Fallback: los átomos. */
  resultadoImg?: string;
}

const MOLS: Mol[] = [
  {
    key: "agua",
    nombre: "agua",
    formula: "H₂O",
    instruccion: "Une un oxígeno y dos hidrógenos dentro de la zona de enlace.",
    slots: [
      { tipo: "oxigeno", x: 50, y: 55 },
      { tipo: "hidrogeno", x: 34, y: 44 },
      { tipo: "hidrogeno", x: 66, y: 44 },
    ],
    titulo: "¡Has formado una molécula de agua!",
    parrafos: [
      <>Una <b>molécula</b> nace cuando varios átomos se unen <b>compartiendo electrones</b>: esa unión es un <b>enlace</b>. Aquí, un oxígeno se une a dos hidrógenos y forman el <b>agua</b>, H₂O.</>,
      <>El agua es la <b>molécula de la Vida</b>: disuelve, transporta y hace posible casi todo lo que ocurre dentro de tus células. Alrededor del <b>60% de tu cuerpo es agua</b>. En buena parte, eres agua.</>,
    ],
    resultadoImg: "/recorrido/fisiologia/pre/h2o.png",
  },
  {
    key: "co2",
    nombre: "dióxido de carbono",
    formula: "CO₂",
    instruccion: "Une un carbono y dos oxígenos dentro de la zona de enlace.",
    slots: [
      { tipo: "carbono", x: 50, y: 50 },
      { tipo: "oxigeno", x: 28, y: 50 },
      { tipo: "oxigeno", x: 72, y: 50 },
    ],
    titulo: "¡Has formado dióxido de carbono!",
    parrafos: [
      <>Un átomo de <b>carbono</b> se une a dos de <b>oxígeno</b>: es el <b>CO₂</b>, el gas que exhalas en cada respiración.</>,
      <>Tus células lo liberan al obtener energía, y las plantas lo capturan para crecer. Es una pieza clave del <b>ciclo de la Vida</b>.</>,
    ],
    resultadoImg: "/recorrido/fisiologia/pre/co2.png",
  },
  {
    key: "o2",
    nombre: "oxígeno",
    formula: "O₂",
    instruccion: "Une dos oxígenos dentro de la zona de enlace.",
    slots: [
      { tipo: "oxigeno", x: 37, y: 50 },
      { tipo: "oxigeno", x: 63, y: 50 },
    ],
    titulo: "¡Has formado una molécula de oxígeno!",
    parrafos: [
      <>Dos átomos de oxígeno se unen y forman el <b>O₂</b>: el oxígeno que respiras.</>,
      <>Cada célula lo necesita para <b>transformar los alimentos en energía</b>. Sin él, la Vida tal como la conoces no existiría.</>,
    ],
    resultadoImg: "/recorrido/fisiologia/pre/o2.png",
  },
];

interface Pieza { id: string; tipo: Tipo; slot: number; }
const piezasDe = (i: number): Pieza[] =>
  MOLS[i].slots.map((s, idx) => ({ id: `${MOLS[i].key}-${idx}`, tipo: s.tipo, slot: idx }));

const esfera = (t: Tipo): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${GLOW[t]} 34%, ${GLOW[t]}dd 62%, ${GLOW[t]}77 100%)`;

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;
const sway = keyframes`
  0%, 100% { transform: rotate(-2.2deg); }
  50%      { transform: rotate(2.2deg); }
`;

// ── Átomo (imagen con reserva a esfera dibujada) ────────────────────────────
function Atomo({ tipo, size }: { tipo: Tipo; size: any }) {
  const c = GLOW[tipo];
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" pointerEvents="none"
         sx={{ boxShadow: `0 0 12px ${c}aa, 0 0 26px ${c}55` }}>
      <Image src={IMG[tipo]} alt={LABEL[tipo]} w="100%" h="100%" objectFit="cover" draggable={false}
             fallback={
               <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" sx={{ background: esfera(tipo) }}>
                 <Text color="rgba(0,0,0,0.5)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{GLYPH[tipo]}</Text>
               </Box>
             } />
    </Box>
  );
}

// ── Ficha arrastrable ───────────────────────────────────────────────────────
function FichaArrastrable({ pieza, onSoltar, colocada = false }: { pieza: Pieza; onSoltar: (p: Pieza, r: DOMRect) => void; colocada?: boolean }) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const glow = GLOW[pieza.tipo];

  // Hueco invisible: mantiene el sitio de la pieza ya colocada (las hermanas no se mueven).
  if (colocada) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexShrink={0} visibility="hidden" aria-hidden>
        <Atomo tipo={pieza.tipo} size={S_DRAG[pieza.tipo]} />
        <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
              letterSpacing="0.06em" textTransform="uppercase">{LABEL[pieza.tipo]}</Text>
      </Box>
    );
  }

  return (
    <MBox
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => { setArrastrando(false); if (ref.current) onSoltar(pieza, ref.current.getBoundingClientRect()); }}
      whileDrag={{ scale: 1.16, zIndex: 60 }}
      whileHover={{ scale: 1.07, y: -2 }}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor="grab"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      flexShrink={0}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}>
        <Atomo tipo={pieza.tipo} size={S_DRAG[pieza.tipo]} />
      </Box>
      <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
            letterSpacing="0.06em" textTransform="uppercase" pointerEvents="none"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
        {LABEL[pieza.tipo]}
      </Text>
    </MBox>
  );
}

// ── Molécula ya formada (celebración / resumen) ─────────────────────────────
// Sin líneas de enlace: los átomos se colocan solapados y se leen como una
// molécula por su propia proximidad.
function MoleculaFormada({ mol, tam }: { mol: Mol; tam: Record<Tipo, any> }) {
  return (
    <Box position="relative" w="100%" h="100%">
      {mol.slots.map((s, i) => (
        <Box key={i} position="absolute" left={`${s.x}%`} top={`${s.y}%`} transform="translate(-50%,-50%)">
          <Atomo tipo={s.tipo} size={tam[s.tipo]} />
        </Box>
      ))}
    </Box>
  );
}

// ── Molécula formada VISUAL: usa la foto de la molécula si existe; si falta o
// falla, cae a los átomos ensamblados (MoleculaFormada). ─────────────────────
function MoleculaVisual({ mol, tam }: { mol: Mol; tam: Record<Tipo, any> }) {
  const [err, setErr] = useState(false);
  if (!mol.resultadoImg || err) return <MoleculaFormada mol={mol} tam={tam} />;
  return (
    <Image src={encodeURI(mol.resultadoImg)} alt={mol.nombre} w="100%" h="100%" objectFit="contain"
           draggable={false} onError={() => setErr(true)}
           style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.18))" }} />
  );
}

// ── Panel con fondo de disciplina (caja del recorrido) ──────────────────────
function PanelBox({ children, minH, px, py, ...rest }: any) {
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden"
         boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}
         {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%"
           px={px ?? { base: 5, md: 10 }} py={py ?? { base: 7, md: 9 }} minH={minH}>
        {children}
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaMoleculas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [indice, setIndice] = useState(0);
  const [pendientes, setPendientes] = useState<Pieza[]>(() => piezasDe(0));
  const [colocadas, setColocadas] = useState<Pieza[]>([]);
  const [completo, setCompleto] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Reserva la altura del box de piezas para que no encoja al arrastrarlas fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();

  const zonaRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          if (dataRef.current?.moleculas_hecho) setTerminado(true);
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardarHecho = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(
        `${API_URL}/metodo-fisiologia/${userId}`,
        { data: { ...dataRef.current, moleculas_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = { ...dataRef.current, moleculas_hecho: true };
    } catch { /* se reintenta la próxima vez */ }
  };

  const mol = MOLS[indice];

  // ¿El centro de la ficha soltada cae dentro de la zona de enlace?
  const soltar = (pieza: Pieza, rect: DOMRect) => {
    const el = zonaRef.current;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2, radio = c.width / 2;
    const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
    if (Math.hypot(px - cx, py - cy) > radio + rect.width / 2) return;

    setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
    setColocadas((prev) => {
      const next = [...prev, pieza];
      if (next.length === mol.slots.length) setTimeout(() => setCompleto(true), 800);
      return next;
    });
  };

  // Reiniciar la molécula ACTUAL (volver a colocar sus átomos).
  const reiniciar = () => { setPendientes(piezasDe(indice)); setColocadas([]); setCompleto(false); };

  // Tras la mini celebración: crear la siguiente molécula, o terminar.
  const siguiente = () => {
    if (indice < MOLS.length - 1) {
      const ni = indice + 1;
      setIndice(ni);
      setPendientes(piezasDe(ni));
      setColocadas([]);
      setCompleto(false);
    } else {
      setTerminado(true);
      void guardarHecho();
    }
  };

  // Desde el resumen final: rehacer todo desde la primera molécula.
  const empezarDeCero = () => {
    setIndice(0);
    setPendientes(piezasDe(0));
    setColocadas([]);
    setCompleto(false);
    setTerminado(false);
  };

  // No quitamos el spinner hasta que las fotos de los átomos (y de las moléculas
  // ya formadas) estén descargadas, para que nada aparezca con la reserva.
  const imgsListas = usePrecargarImagenes([
    ...Object.values(IMG),
    ...MOLS.map((m) => m.resultadoImg),
  ]);

  if (loading || !imgsListas) {
    return <FisiologiaLoading />;
  }

  const total = mol.slots.length;
  const hechas = colocadas.length;
  const esUltima = indice === MOLS.length - 1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Moléculas"
            pageLabel="3/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Átomos", onClick: () => navigate("/metodo/fisiologia/atomos") }}
            extra={celulasBtn}
            next={{ label: "Macromoléculas →", onClick: () => navigate("/metodo/fisiologia/macromoleculas"), disabled: !terminado, disabledTooltip: "Primero forma las tres moléculas de la Vida" }}
          />
          </Reveal>

          {/* Instrucción (solo mientras forma una molécula) */}
          <AnimatePresence>
            {!completo && !terminado && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="400" fontStyle="italic"
                      letterSpacing="0.02em" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Una molécula es la unión de átomos. Forma una molécula de {mol.nombre}.
                </Text>
              </MBox>
            )}
            {terminado && (
              <MBox key="cierre" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    textAlign="center" maxW="640px">
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="400" fontStyle="italic"
                      letterSpacing="0.02em" lineHeight="1.35" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Las moléculas son la unión de varios átomos. Son el fundamento de la Vida y forman parte de ti.
                </Text>
              </MBox>
            )}
          </AnimatePresence>

          {/* ── PANELES DEL RECORRIDO ── */}
          <Box position="relative" w="100%">
              <AnimatePresence mode="wait">

                {/* ───────── FASE A · enlazar (dos boxes: zona | piezas) ───────── */}
                {!completo && !terminado && (
                  <MBox key={`construir-${mol.key}`} w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                   <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                      {/* Box izquierda · zona de enlace (aquí se llevan las piezas) */}
                      <PanelBox flex={{ base: "1 1 auto", md: "0 0 46%" }} minH={{ base: "280px", md: "340px" }}>
                        <Flex h="100%" justify="center" align="center">
                          <Box ref={zonaRef} position="relative"
                               w={{ base: "250px", md: "300px" }} h={{ base: "250px", md: "300px" }}
                               borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                            <Box position="absolute" inset="-12px" borderRadius="full"
                                 border={`1.5px dashed ${fisiologiaTxt}55`}
                                 animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                            <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                                 sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                       boxShadow: `inset 0 0 40px rgba(0,0,0,0.9), 0 0 24px ${fisiologiaTxt}22` }} />

                            {/* átomos colocados (solapados, sin líneas de enlace) */}
                            {colocadas.map((p) => {
                              const pos = mol.slots[p.slot];
                              return (
                                <MBox key={p.id} position="absolute" left={`${pos.x}%`} top={`${pos.y}%`}
                                      transform="translate(-50%, -50%)"
                                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                      transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                                  <Atomo tipo={p.tipo} size={S_ZONA[p.tipo]} />
                                </MBox>
                              );
                            })}

                            {hechas === 0 && (
                              <Text position="relative" zIndex={2} color={`${fisiologiaTxt}cc`}
                                    fontSize={{ base: "sm", md: "md" }} fontStyle="italic" pointerEvents="none"
                                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                                zona de enlace
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      </PanelBox>

                      {/* Box derecha · piezas a arrastrar (2 por fila) */}
                      {/* overflow:visible para que la ficha no se recorte al arrastrarla al otro box. */}
                      <PanelBox flex="1" overflow="visible" minH={{ base: "auto", md: "340px" }}>
                        <Flex direction="column" align="center" justify="center" gap={5} h="100%">
                          <Box ref={piezasRef} display="grid" gridTemplateColumns="repeat(2, auto)"
                               justifyContent="center" justifyItems="center" alignContent="center"
                               minH={piezasMinH ? `${piezasMinH}px` : undefined}
                               columnGap={{ base: 5, md: 7 }} rowGap={{ base: 5, md: 6 }}>
                            <AnimatePresence>
                              {piezasDe(indice).map((p) => (
                                <FichaArrastrable key={p.id} pieza={p} onSoltar={soltar}
                                                  colocada={colocadas.some((c) => c.id === p.id)} />
                              ))}
                            </AnimatePresence>
                          </Box>
                          {pendientes.length === 0 && (
                            <Text color={`${fisiologiaTxt}bb`} fontSize="md" fontStyle="italic">…enlazando…</Text>
                          )}

                          <Flex justify="center" gap={2}>
                            {Array.from({ length: total }).map((_, i) => (
                              <Box key={i} w="9px" h="9px" borderRadius="full"
                                   bg={i < hechas ? fisiologiaTxt : "rgba(255,255,255,0.22)"}
                                   boxShadow={i < hechas ? `0 0 10px ${fisiologiaTxt}` : "none"}
                                   transition="all 0.3s" />
                            ))}
                          </Flex>
                        </Flex>
                      </PanelBox>
                   </Flex>
                  </MBox>
                )}

                {/* ───────── FASE B · molécula formada + texto (2 cajas) ───────── */}
                {completo && !terminado && (
                  <MBox key={`resultado-${mol.key}`} w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>
                    <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                      {/* Caja 1 · molécula ya formada */}
                      <PanelBox flexShrink={0} w={{ base: "100%", md: "auto" }}>
                        <Flex h="100%" justify="center" align="center">
                          <Flex flexShrink={0} justify="center" align="center" position="relative"
                                w={{ base: "260px", md: "320px" }} h={{ base: "260px", md: "320px" }}>
                            <Box position="absolute" inset="-4%" borderRadius="full"
                                 animation={`${shimmer} 3.6s ease-in-out infinite`} pointerEvents="none"
                                 sx={{ boxShadow: `0 0 50px ${fisiologiaTxt}55, 0 0 90px ${GLOW.oxigeno}33` }} />
                            <Box position="relative" w="100%" h="100%"
                                 sx={{ animation: `${sway} 6s ease-in-out infinite`, transformOrigin: "50% 55%" }}>
                              <MoleculaVisual mol={mol} tam={S_BIG} />
                            </Box>
                          </Flex>
                        </Flex>
                      </PanelBox>

                      {/* Caja 2 · comentario */}
                      <PanelBox flex="1">
                        <Flex direction="column" gap={4} h="100%" justify="center" textAlign={{ base: "center", md: "left" }}>
                          <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                                letterSpacing="0.02em" lineHeight="1.25" style={{ textShadow: INK }}>
                            {mol.titulo}
                          </Text>
                          <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                               bgGradient={`linear(to-r, ${fisiologiaTxt}88, transparent)`} />
                          {mol.parrafos.map((p, i) => (
                            <Text key={i} color={i === mol.parrafos.length - 1 ? fisiologiaTxt : fisiologiaTxt}
                                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                                  fontWeight={i === mol.parrafos.length - 1 ? "600" : "400"} style={{ textShadow: INK }}>
                              {p}
                            </Text>
                          ))}

                          <Flex gap={4} mt="auto" pt={3} wrap="wrap" justify={{ base: "center", md: "flex-end" }}>
                            <Box as="button" onClick={siguiente}
                                 display="inline-flex" alignItems="center" gap={1.5}
                                 bg="transparent" border="none" color={fisiologiaTxt}
                                 fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                                 letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                                 style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                                 _hover={{ color: "white", transform: "translateX(3px)" }}>
                              {esUltima ? "Ver las moléculas de la Vida →" : "Siguiente →"}
                            </Box>
                          </Flex>
                        </Flex>
                      </PanelBox>
                    </Flex>
                  </MBox>
                )}

                {/* ───────── FASE C · las 3 moléculas de la Vida ───────── */}
                {terminado && (
                  <MBox key="final" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>
                   <PanelBox w="100%" minH={{ md: "360px" }}>
                    <Flex direction="column" align="center" gap={{ base: 7, md: 9 }} py={{ base: 2, md: 4 }}>

                      <Flex wrap="nowrap" justify="center" align="flex-start" gap={{ base: 1.5, md: 5 }} w="100%">
                        {MOLS.map((m, i) => (
                          <MBox key={m.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 * i, duration: 0.6, ease: "easeOut" }}
                                flexShrink={0}
                                display="flex" flexDirection="column" alignItems="center" gap={{ base: 1, md: 2 }}>
                            <Box position="relative" w={{ base: "92px", md: "236px" }} h={{ base: "92px", md: "236px" }}>
                              <Box position="absolute" inset="0"
                                   sx={{ animation: `${sway} 6s ease-in-out infinite`, transformOrigin: "50% 55%" }}>
                                <MoleculaVisual mol={m} tam={S_MINI} />
                              </Box>
                            </Box>
                            <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "sm", md: "xl" }}
                                  style={{ textShadow: INK }}>{m.formula}</Text>
                            <Text color={`${fisiologiaTxt}dd`} fontSize={{ base: "2xs", md: "md" }} fontStyle="italic"
                                  textAlign="center" lineHeight="1.2">{m.nombre}</Text>
                          </MBox>
                        ))}
                      </Flex>
                    </Flex>
                   </PanelBox>
                  </MBox>
                )}
              </AnimatePresence>
          </Box>

          {/* Volver a hacer — fuera del box, abajo a la derecha del todo */}
          {(completo || terminado) && (
            <Flex justify="flex-end" w="100%">
              <Box as="button" onClick={terminado ? empezarDeCero : reiniciar}
                   display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                   bg="rgba(255,255,255,0.08)" color={fisiologiaTxt} border="1px solid rgba(255,255,255,0.28)"
                   fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                   letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "rgba(255,255,255,0.16)", color: fisiologiaTxt, borderColor: `${fisiologiaTxt}aa` }}>
                ↺ Volver a hacer
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
