import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { ComicEstrellaModal } from "../../components/metodo/ComicEstrellaModal";
import { useReservarAltura } from "../../hooks/useReservarAltura";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

const MBox = motion(Box);
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const GLOW_BOX = `0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`;

// ── Partículas del átomo ────────────────────────────────────────────────────
type Tipo = "proton" | "neutron" | "electron";
const GLOW: Record<Tipo, string> = { proton: "#e08a8a", neutron: "#b7b3c9", electron: "#8ab6e6" };
const LABEL: Record<Tipo, string> = { proton: "protón", neutron: "neutrón", electron: "electrón" };
const GLYPH: Record<Tipo, string> = { proton: "+", neutron: "0", electron: "–" };
const IMG: Record<Tipo, string> = {
  proton: "/recorrido/fisiologia/pre/proton.png",
  neutron: "/recorrido/fisiologia/pre/neutron.png",
  electron: "/recorrido/fisiologia/pre/electron.png",
};
const esfera = (c: Tipo): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${GLOW[c]} 34%, ${GLOW[c]}dd 62%, ${GLOW[c]}77 100%)`;

// ── Los dos átomos del recorrido (en orden) ──────────────────────────────────
interface AtomoDef {
  key: string;
  nombre: string;
  piezas: Tipo[];              // en el orden en que aparecen para arrastrar
  nucleoCluster: { x: number; y: number }[]; // posiciones de protones/neutrones (% del núcleo)
  orbitaPos: { x: number; y: number }[];      // posiciones de electrones (% de la órbita)
  img: string;
  instruccion: string;
  titulo: string;
  parrafos: React.ReactNode[];
}

const ATOMOS: AtomoDef[] = [
  {
    key: "hidrogeno",
    nombre: "Hidrógeno",
    piezas: ["proton", "electron"],
    nucleoCluster: [{ x: 50, y: 50 }],
    orbitaPos: [{ x: 14, y: 50 }],
    img: "/recorrido/fisiologia/pre/hidrogeno.png",
    instruccion: "Lleva el protón al núcleo y el electrón a su órbita.",
    titulo: "¡Has construido un átomo de Hidrógeno!",
    parrafos: [
      <>El <b>hidrógeno</b> es el átomo más simple y abundante del universo: un solo <b>protón</b> en el núcleo y un <b>electrón</b> orbitando a su alrededor. Fue el primer elemento en existir tras el Big Bang.</>,
    ],
  },
  {
    key: "helio",
    nombre: "Helio",
    piezas: ["proton", "proton", "neutron", "neutron", "electron", "electron"],
    nucleoCluster: [{ x: 39, y: 41 }, { x: 61, y: 41 }, { x: 39, y: 61 }, { x: 61, y: 61 }],
    orbitaPos: [{ x: 14, y: 50 }, { x: 86, y: 50 }],
    img: "/recorrido/fisiologia/pre/helio.png",
    instruccion: "Lleva los 2 protones y 2 neutrones al núcleo, y los 2 electrones a su órbita.",
    titulo: "¡Has construido un átomo de Helio!",
    parrafos: [
      <>El <b>helio</b> fue el segundo elemento del universo en ser creado.</>,
      <>Cambiando el número de protones se obtienen todos los elementos: tu cuerpo es, sobre todo, hidrógeno, oxígeno, carbono y nitrógeno, los mismos átomos que forman las estrellas.</>,
    ],
  },
];

interface Pieza { id: string; tipo: Tipo; }
const piezasDe = (i: number): Pieza[] =>
  ATOMOS[i].piezas.map((tipo, k) => ({ id: `${ATOMOS[i].key}-${k}`, tipo }));

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

// ── Esfera reutilizable (protón / neutrón / electrón) ───────────────────────
function Esfera({ tipo, size, glow = true }: { tipo: Tipo; size: any; glow?: boolean }) {
  const c = GLOW[tipo];
  return (
    <Box w={size} h={size} pointerEvents="none"
         sx={{ filter: glow ? `drop-shadow(0 0 8px ${c}aa) drop-shadow(0 0 18px ${c}55)` : "none" }}>
      <Image src={IMG[tipo]} alt={LABEL[tipo]} w="100%" h="100%" objectFit="contain" draggable={false}
             fallback={
               <Box w="100%" h="100%" borderRadius="full" display="flex" alignItems="center" justifyContent="center" sx={{ background: esfera(tipo) }}>
                 <Text color="rgba(0,0,0,0.5)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{GLYPH[tipo]}</Text>
               </Box>
             } />
    </Box>
  );
}

// ── Ficha arrastrable ───────────────────────────────────────────────────────
function FichaArrastrable({ pieza, onSoltar, enterDelay = 0, colocada = false }: { pieza: Pieza; onSoltar: (pieza: Pieza, rect: DOMRect) => boolean; enterDelay?: number; colocada?: boolean }) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const glow = GLOW[pieza.tipo];
  // Entrada: cada ficha aparece con su pequeño retraso.
  useEffect(() => {
    controls.start({ opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 26, delay: enterDelay } });
  }, [controls, enterDelay]);
  // Hueco invisible: mantiene el sitio de la pieza ya colocada (las hermanas no se mueven).
  if (colocada) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexShrink={0} visibility="hidden" aria-hidden>
        <Esfera tipo={pieza.tipo} size={{ base: "48px", md: "58px" }} />
        <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
              letterSpacing="0.06em" textTransform="uppercase">{LABEL[pieza.tipo]}</Text>
      </Box>
    );
  }
  return (
    <MBox
      ref={ref}
      drag dragElastic={0.12} dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => {
        setArrastrando(false);
        if (!ref.current) return;
        const aceptada = onSoltar(pieza, ref.current.getBoundingClientRect());
        // Si acierta (núcleo u órbita), NO vuelve: desaparece donde está.
        // Si falla, regresa a su sitio.
        if (!aceptada) controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } });
      }}
      whileDrag={{ scale: 1.18, zIndex: 60 }}
      whileHover={{ scale: 1.07, y: -2 }}
      initial={{ opacity: 0, x: 16 }} animate={controls} exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor="grab" position="relative" display="flex" flexDirection="column" alignItems="center" gap={1}
      flexShrink={0} style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}>
        <Esfera tipo={pieza.tipo} size={{ base: "48px", md: "58px" }} />
      </Box>
      <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
            letterSpacing="0.06em" textTransform="uppercase" pointerEvents="none"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
        {LABEL[pieza.tipo]}
      </Text>
    </MBox>
  );
}

function PiezaPosada({ tipo, x, y, size }: { tipo: Tipo; x: number; y: number; size: any }) {
  return (
    <MBox position="absolute" left={`${x}%`} top={`${y}%`} transform="translate(-50%, -50%)"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 20 }}>
      <Esfera tipo={tipo} size={size} />
    </MBox>
  );
}

// ── Átomo completo dibujado (reserva de la imagen del resultado) ────────────
function AtomoDibujado({ def }: { def: AtomoDef }) {
  const nucleones = def.piezas.filter((t) => t !== "electron");
  const electrones = def.piezas.filter((t) => t === "electron");
  return (
    <Box position="relative" w="100%" h="100%" borderRadius="full"
         display="flex" alignItems="center" justifyContent="center">
      <Box position="absolute" inset="14%" borderRadius="full" border={`1.5px solid ${GLOW.electron}55`} pointerEvents="none" />
      {electrones.map((t, i) => (
        <Box key={`e${i}`} position="absolute" left={`${def.orbitaPos[i].x}%`} top={`${def.orbitaPos[i].y}%`} transform="translate(-50%,-50%)">
          <Esfera tipo={t} size={{ base: "26px", md: "32px" }} />
        </Box>
      ))}
      <Box position="relative" w={{ base: "46%", md: "46%" }} h={{ base: "46%", md: "46%" }} borderRadius="full"
           sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                 boxShadow: `inset 0 0 30px rgba(0,0,0,0.9), 0 0 20px ${fisiologiaTxt}22` }}>
        {nucleones.map((t, i) => (
          <Box key={`n${i}`} position="absolute" left={`${def.nucleoCluster[i].x}%`} top={`${def.nucleoCluster[i].y}%`} transform="translate(-50%,-50%)">
            <Esfera tipo={t} size={{ base: "26px", md: "34px" }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaAtomos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [pendientes, setPendientes] = useState<Pieza[]>(() => piezasDe(0));
  const [colocadas, setColocadas] = useState<Pieza[]>([]);
  const [completo, setCompleto] = useState(false);
  const [imgOk, setImgOk] = useState(false); // foto del átomo del resultado ya cargada
  const [particulasOk, setParticulasOk] = useState(false); // fotos de protón/electrón precargadas
  const [comicOpen, setComicOpen] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Reserva la altura del box de piezas para que no encoja al arrastrarlas fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();

  const nucleoRef = useRef<HTMLDivElement>(null);
  const orbitaRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, any>>({});

  const def = ATOMOS[idx];
  const esUltimo = idx === ATOMOS.length - 1;
  const todoHecho = completo && esUltimo;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          if (dataRef.current?.atomos_hecho) {
            const last = ATOMOS.length - 1;
            setIdx(last); setPendientes([]); setColocadas(piezasDe(last)); setCompleto(true);
          }
        } catch { /* sin fila todavía */ }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Precarga de las fotos de protón y electrón: la página no se muestra hasta
  // que ambas estén ya cargadas (si alguna falla, se desbloquea igualmente para
  // no quedarse en el spinner para siempre; entra el fallback dibujado).
  useEffect(() => {
    const fotos = [IMG.proton, IMG.electron];
    let cargadas = 0;
    let cancelado = false;
    const marcar = () => { cargadas += 1; if (!cancelado && cargadas >= fotos.length) setParticulasOk(true); };
    fotos.forEach((src) => {
      const img = new window.Image();
      img.onload = marcar;
      img.onerror = marcar;
      img.src = src;
    });
    return () => { cancelado = true; };
  }, []);

  const guardarHecho = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`,
        { data: { ...dataRef.current, atomos_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = { ...dataRef.current, atomos_hecho: true };
    } catch { /* se reintenta */ }
  };

  // «Continuar» tras el último átomo: SIEMPRE abre el cómic de la estrella.
  const continuar = () => setComicOpen(true);
  const comicContinuar = () => { setComicOpen(false); navigate("/metodo/fisiologia/moleculas"); };
  const comicCerrar = () => setComicOpen(false);

  const dentroDe = (el: HTMLDivElement | null, rect: DOMRect): boolean => {
    if (!el) return false;
    const c = el.getBoundingClientRect();
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2, radio = c.width / 2;
    const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
    return Math.hypot(px - cx, py - cy) <= radio + rect.width / 2;
  };

  const soltar = (pieza: Pieza, rect: DOMRect): boolean => {
    const acierta = pieza.tipo === "electron" ? dentroDe(orbitaRef.current, rect) : dentroDe(nucleoRef.current, rect);
    if (!acierta) return false;
    setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
    setColocadas((prev) => {
      const next = [...prev, pieza];
      if (next.length === def.piezas.length) {
        setTimeout(() => {
          setCompleto(true);
          if (idx === ATOMOS.length - 1) void guardarHecho();
        }, 700);
      }
      return next;
    });
    return true;
  };

  const reiniciar = () => { setColocadas([]); setPendientes(piezasDe(idx)); setCompleto(false); };
  const siguienteAtomo = () => {
    const ni = idx + 1;
    setIdx(ni); setPendientes(piezasDe(ni)); setColocadas([]); setCompleto(false); setImgOk(false);
  };

  if (loading || !particulasOk) return <FisiologiaLoading />;

  const total = def.piezas.length;
  const hechas = colocadas.length;
  const nucleares = colocadas.filter((p) => p.tipo !== "electron");
  const electrones = colocadas.filter((p) => p.tipo === "electron");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Átomos"
            pageLabel="2/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Partículas", onClick: () => navigate("/metodo/fisiologia/particulas") }}
            extra={celulasBtn}
            next={{ label: "Moléculas →", onClick: continuar, disabled: !todoHecho, disabledTooltip: "Primero construye los dos átomos" }}
          />
          </Reveal>

          {/* Instrucción (solo mientras construye) */}
          <AnimatePresence>
            {!completo && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                  <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                    Construye un átomo de {def.nombre}.
                </Text>
              </MBox>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ───────── FASE A · construir (dos boxes: átomo | piezas) ───────── */}
            {!completo && (
              <MBox key={`construir-${def.key}`} w="100%"
                    initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box izquierda · átomo (aquí se llevan las piezas) · entra primero ── */}
                  <Reveal direction="up" distance={22} duration={0.5} delay={0}
                          position="relative" flex={{ base: "1 1 auto", md: "0 0 46%" }} borderRadius="2xl" overflow="hidden" boxShadow={GLOW_BOX}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} justify="center" align="center"
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "280px", md: "340px" }}>
                      <Box ref={orbitaRef} position="relative"
                           w={{ base: "250px", md: "300px" }} h={{ base: "250px", md: "300px" }}
                           borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                        <Box position="absolute" inset="14%" borderRadius="full"
                             border={`1.5px dashed ${GLOW.electron}66`}
                             animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                        {electrones.map((p, i) => (
                          <PiezaPosada key={p.id} tipo={p.tipo} x={def.orbitaPos[i].x} y={def.orbitaPos[i].y}
                                       size={{ base: "26px", md: "32px" }} />
                        ))}
                        <Box ref={nucleoRef} position="relative"
                             w={{ base: "120px", md: "148px" }} h={{ base: "120px", md: "148px" }}
                             borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                          <Box position="absolute" inset="-8px" borderRadius="full"
                               border={`1.5px dashed ${GLOW.proton}66`}
                               animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                          <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                               sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                     boxShadow: `inset 0 0 34px rgba(0,0,0,0.92), 0 0 20px ${fisiologiaTxt}22` }} />
                          {nucleares.map((p, i) => (
                            <PiezaPosada key={p.id} tipo={p.tipo} x={def.nucleoCluster[i].x} y={def.nucleoCluster[i].y}
                                         size={{ base: "30px", md: "38px" }} />
                          ))}
                          {nucleares.length === 0 && (
                            <Text position="relative" zIndex={2} color={`${fisiologiaTxt}cc`}
                                  fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" pointerEvents="none"
                                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                              el núcleo
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Flex>
                  </Reveal>

                  {/* ── Box derecha · piezas a arrastrar (2 por fila) · entra después ── */}
                  {/* Sin overflow:hidden para que la ficha no se recorte al arrastrarla al otro box. */}
                  <Reveal direction="up" distance={22} duration={0.5} delay={0.18}
                          position="relative" flex="1" borderRadius="2xl" boxShadow={GLOW_BOX}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" align="center" gap={5}
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "auto", md: "340px" }}>
                      <Box ref={piezasRef} display="grid" gridTemplateColumns="repeat(2, auto)"
                           justifyContent="center" justifyItems="center" alignContent="center"
                           minH={piezasMinH ? `${piezasMinH}px` : undefined}
                           columnGap={{ base: 5, md: 7 }} rowGap={{ base: 5, md: 6 }}>
                        <AnimatePresence>
                          {piezasDe(idx).map((p, i) => (<FichaArrastrable key={p.id} pieza={p} onSoltar={soltar}
                                                                       enterDelay={0.45 + i * 0.1}
                                                                       colocada={colocadas.some((c) => c.id === p.id)} />))}
                        </AnimatePresence>
                      </Box>
                      {pendientes.length === 0 && (<Text color={`${fisiologiaTxt}bb`} fontSize="md" fontStyle="italic">…formándose…</Text>)}
                      <Flex justify="center" gap={2} wrap="wrap" maxW="320px">
                        {Array.from({ length: total }).map((_, i) => (
                          <Box key={i} w="9px" h="9px" borderRadius="full"
                               bg={i < hechas ? fisiologiaTxt : "rgba(255,255,255,0.22)"}
                               boxShadow={i < hechas ? `0 0 10px ${fisiologiaTxt}` : "none"} transition="all 0.3s" />
                        ))}
                      </Flex>
                    </Flex>
                  </Reveal>
                </Flex>
              </MBox>
            )}

            {/* ───────── FASE B · dos boxes: átomo | texto ───────── */}
            {completo && (
              <MBox key={`resultado-${def.key}`} w="100%"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box izquierda · átomo ── */}
                  <Box position="relative" flex={{ base: "1 1 auto", md: "0 0 42%" }} borderRadius="2xl" overflow="hidden" boxShadow={GLOW_BOX}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" align="center"
                          px={{ base: 6, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "300px", md: "360px" }} gap={4}>
                      <Box position="relative" w={{ base: "230px", md: "290px" }} h={{ base: "230px", md: "290px" }}>
                        <Box position="absolute" inset="-6%" borderRadius="full"
                             animation={`${shimmer} 3.6s ease-in-out infinite`} pointerEvents="none"
                             sx={{ boxShadow: `0 0 50px ${GLOW.electron}44, 0 0 90px ${GLOW.proton}33` }} />
                        <Image src={def.img} alt={`Átomo de ${def.nombre}`} w="100%" h="100%" objectFit="contain"
                               fallbackStrategy="onError"
                               onLoad={() => setImgOk(true)}
                               opacity={imgOk ? 1 : 0} transition="opacity 0.5s ease"
                               style={{ filter: `drop-shadow(0 0 18px ${fisiologiaTxt}44)` }}
                               fallback={<AtomoDibujado def={def} />} />
                        {!imgOk && (
                          <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                            <SpinnerTurquesa fullScreen={false} />
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  {/* ── Box derecha · texto ── */}
                  <Box position="relative" flex="1" borderRadius="2xl" overflow="hidden" boxShadow={GLOW_BOX}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" gap={4}
                          px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }} h="100%" textAlign={{ base: "center", md: "left" }}>
                      <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                            letterSpacing="0.02em" lineHeight="1.25" style={{ textShadow: INK }}>
                        {def.titulo}
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                           bgGradient={`linear(to-r, ${fisiologiaTxt}88, transparent)`} />
                      {def.parrafos.map((p, i) => (
                        <Text key={i} color={i === def.parrafos.length - 1 ? fisiologiaTxt : fisiologiaTxt}
                              fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                              fontWeight={i === def.parrafos.length - 1 ? "600" : "400"} style={{ textShadow: INK }}>
                          {p}
                        </Text>
                      ))}

                      {/* Paso interno: ir al siguiente átomo. En el último NO hay
                          botón aquí: el avance es «Moléculas →» de la cabecera. */}
                      {!esUltimo && (
                        <Box as="button" onClick={siguienteAtomo} alignSelf={{ base: "center", md: "flex-start" }} mt={2}
                             px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                             letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                             boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                             _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                          Ahora, el Helio →
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>

                {/* Volver a hacer — fuera del box, abajo a la derecha del todo */}
                <Flex justify="flex-end" w="100%" mt={{ base: 5, md: 6 }}>
                  <Box as="button" onClick={reiniciar}
                       display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                       bg="rgba(255,255,255,0.08)" color={fisiologiaTxt} border="1px solid rgba(255,255,255,0.28)"
                       fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                       letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                       _hover={{ bg: "rgba(255,255,255,0.16)", color: "white", borderColor: `${fisiologiaTxt}aa` }}>
                    ↺ Volver a hacer
                  </Box>
                </Flex>
              </MBox>
            )}
          </AnimatePresence>
        </Flex>
      </Flex>

      {celulasModal}

      {/* Cómic «Cómo una estrella forma los átomos», entre átomos y moléculas. */}
      <ComicEstrellaModal isOpen={comicOpen} onContinue={comicContinuar} onClose={comicCerrar} />

      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
