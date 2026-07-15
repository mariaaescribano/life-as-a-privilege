import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
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

// ── Piezas (con las ilustraciones que dejó María) ───────────────────────────
type Tipo = "up" | "down" | "gluon";
interface Pieza { id: string; tipo: Tipo; }

// Un protón = 2 quarks up + 1 quark down, unidos por 3 gluones.
const PIEZAS_INICIALES: Pieza[] = [
  { id: "u1", tipo: "up" },
  { id: "u2", tipo: "up" },
  { id: "d1", tipo: "down" },
  { id: "g1", tipo: "gluon" },
  { id: "g2", tipo: "gluon" },
  { id: "g3", tipo: "gluon" },
];

const IMG: Record<Tipo, string> = {
  up: "/recorrido/fisiologia/pre/upquark.png",
  down: "/recorrido/fisiologia/pre/downquark.png",
  gluon: "/recorrido/fisiologia/pre/gluon.png",
};
const PROTON_IMG = "/recorrido/fisiologia/pre/protonpordentro.png";
const GLOW: Record<Tipo, string> = { up: "#8ab6e6", down: "#e08a8a", gluon: "#f2c86b" };
const LABEL: Record<Tipo, string> = { up: "up quark", down: "down quark", gluon: "gluón" };

// Posiciones (en %) FIJAS por pieza dentro del núcleo, para reproducir el
// esquema clásico del protón: los 3 quarks en los vértices de un triángulo y
// cada gluón en el punto medio de la arista que une dos quarks (o sea, "entre"
// ellos). Se indexa por id de la pieza (no por orden de colocación) para que
// cada quark/gluón caiga siempre en su sitio.
const CLUSTER: Record<string, { x: number; y: number }> = {
  // Quarks → vértices del triángulo
  u1: { x: 50, y: 32 }, // arriba
  u2: { x: 34, y: 63 }, // abajo-izquierda
  d1: { x: 66, y: 63 }, // abajo-derecha
  // Gluones → en medio de cada arista (entre dos quarks)
  g1: { x: 42, y: 47 }, // entre u1 y u2
  g2: { x: 58, y: 47 }, // entre u1 y d1
  g3: { x: 50, y: 63 }, // entre u2 y d1
};

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

// ─────────────────────────────────────────────────────────────────────────
// Ficha arrastrable (columna derecha)
// ─────────────────────────────────────────────────────────────────────────
function FichaArrastrable({
  pieza, onSoltar, disabled, enterDelay = 0,
}: {
  pieza: Pieza;
  /** Devuelve true si la ficha ha caído dentro del núcleo (acierto). */
  onSoltar: (pieza: Pieza, rect: DOMRect) => boolean;
  disabled: boolean;
  /** Retraso de entrada, para que las fichas salgan una a una. */
  enterDelay?: number;
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const [imgOk, setImgOk] = useState(false); // foto de la ficha ya cargada
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const glow = GLOW[pieza.tipo];

  // Entrada: cada ficha aparece con su pequeño retraso.
  useEffect(() => {
    controls.start({
      opacity: 1, x: 0,
      transition: { type: "spring", stiffness: 320, damping: 26, delay: enterDelay },
    });
  }, [controls, enterDelay]);

  return (
    <MBox
      ref={ref}
      drag={!disabled}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => {
        setArrastrando(false);
        // Usamos el rect real de la ficha (viewport), no info.point, para que la
        // detección funcione aunque la página tenga scroll y en táctil.
        if (!ref.current) return;
        const aceptada = onSoltar(pieza, ref.current.getBoundingClientRect());
        // Si acierta en el núcleo, NO volvemos: la ficha desaparece donde está
        // (fade de AnimatePresence). Si falla, regresa a su sitio.
        if (!aceptada) {
          controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } });
        }
      }}
      whileDrag={{ scale: 1.18, zIndex: 60 }}
      whileHover={disabled ? undefined : { scale: 1.07, y: -2 }}
      initial={{ opacity: 0, x: 16 }}
      animate={controls}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor={disabled ? "default" : "grab"}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      flexShrink={0}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box
        position="relative"
        w={{ base: "58px", md: "72px" }}
        h={{ base: "58px", md: "72px" }}
        borderRadius="full"
        overflow="hidden"
        border={`1.5px solid ${glow}aa`}
        sx={{
          boxShadow: arrastrando
            ? `0 0 24px ${glow}, 0 0 54px ${glow}aa, 0 10px 28px rgba(0,0,0,0.5)`
            : `0 0 12px ${glow}77, 0 0 26px ${glow}44`,
        }}
      >
        <Image
          src={IMG[pieza.tipo]}
          alt={LABEL[pieza.tipo]}
          w="100%" h="100%" objectFit="cover"
          draggable={false}
          pointerEvents="none"
          fallbackStrategy="onError"
          onLoad={() => setImgOk(true)}
          opacity={imgOk ? 1 : 0}
          transition="opacity 0.4s ease"
          fallback={<Box w="100%" h="100%" bg={glow} />}
        />
        {!imgOk && (
          <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
            <SpinnerTurquesa fullScreen={false} size={22} thickness={2} />
          </Box>
        )}
      </Box>
      <Text
        color={fisiologiaTxt}
        fontSize={{ base: "3xs", md: "2xs" }}
        fontWeight="700"
        letterSpacing="0.06em"
        textTransform="uppercase"
        pointerEvents="none"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
      >
        {LABEL[pieza.tipo]}
      </Text>
    </MBox>
  );
}

// ── Pieza ya posada dentro del núcleo (se junta con las demás) ──────────────
// Los gluones son algo más pequeños y quedan por detrás, de modo que parecen
// el "muelle" que conecta dos quarks en la arista del triángulo.
function PiezaInterna({ tipo, x, y }: { tipo: Tipo; x: number; y: number }) {
  const glow = GLOW[tipo];
  const esGluon = tipo === "gluon";
  const size = esGluon ? { base: "38px", md: "48px" } : { base: "50px", md: "64px" };
  return (
    <MBox
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      w={size}
      h={size}
      zIndex={esGluon ? 1 : 2}
      borderRadius="full"
      overflow="hidden"
      transform="translate(-50%, -50%)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
      sx={{ boxShadow: `0 0 12px ${glow}bb, 0 0 26px ${glow}66` }}
    >
      <Image src={IMG[tipo]} alt="" w="100%" h="100%" objectFit="cover"
             draggable={false} fallback={<Box w="100%" h="100%" bg={glow} />} />
    </MBox>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaParticulas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendientes, setPendientes] = useState<Pieza[]>(PIEZAS_INICIALES);
  const [colocadas, setColocadas] = useState<Pieza[]>([]);
  const [completo, setCompleto] = useState(false);
  const [protonImgOk, setProtonImgOk] = useState(false); // foto del protón ya cargada
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Reserva la altura del box de piezas para que no encoja al arrastrarlas fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();

  const nucleoRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        // ¿Modo test de pagos? Nos deja entrar aunque la columna fisiologia_suscrito
        // aún no exista en la BD (ALTER TABLE pendiente) — como en la página de entrada.
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          if (dataRef.current?.particulas_hecho) {
            setPendientes([]);
            setColocadas(PIEZAS_INICIALES);
            setCompleto(true);
          }
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
        { data: { ...dataRef.current, particulas_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = { ...dataRef.current, particulas_hecho: true };
    } catch { /* se reintenta la próxima vez */ }
  };

  // ¿La ficha soltada se solapa con el círculo del núcleo? Devuelve true si acierta.
  const soltarEnNucleo = (pieza: Pieza, rect: DOMRect): boolean => {
    const el = nucleoRef.current;
    if (!el) return false;
    const c = el.getBoundingClientRect();
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    const radio = c.width / 2;
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const dist = Math.hypot(px - cx, py - cy);
    // Cuenta como dentro si el centro de la ficha entra en el círculo (con un
    // margen del radio de la propia ficha para que sea generoso).
    if (dist <= radio + rect.width / 2) {
      setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
      setColocadas((prev) => {
        const next = [...prev, pieza];
        if (next.length === PIEZAS_INICIALES.length) {
          // Todas dentro y juntas → cambiamos de box (protón + texto).
          setTimeout(() => { setCompleto(true); void guardarHecho(); }, 750);
        }
        return next;
      });
      return true;
    }
    return false;
  };

  const reiniciar = () => {
    setColocadas([]);
    setPendientes(PIEZAS_INICIALES);
    setCompleto(false);
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const total = PIEZAS_INICIALES.length;
  const hechas = colocadas.length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Partículas"
            pageLabel="1/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Niveles", onClick: () => navigate("/metodo/fisiologia/niveles") }}
            extra={celulasBtn}
            next={{ label: "Átomo →", onClick: () => navigate("/metodo/fisiologia/atomos"), disabled: !completo, disabledTooltip: "Primero construye la partícula" }}
          />
          </Reveal>

          {/* Instrucción (solo mientras construye) */}
          <AnimatePresence>
            {!completo && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Construye una partícula.
                </Text>
              </MBox>
            )}
          </AnimatePresence>

          {/* ── FASE A (box de construir) / FASE B (dos boxes) ── */}
          <AnimatePresence mode="wait">

            {/* ───────── FASE A · construir (dos boxes: núcleo | piezas) ───────── */}
            {!completo && (
              <MBox key="construir" w="100%"
                    initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box izquierda · núcleo (aquí se llevan las piezas) · entra primero ── */}
                  <Reveal direction="up" distance={22} duration={0.5} delay={0}
                          position="relative" flex={{ base: "1 1 auto", md: "0 0 46%" }} borderRadius="2xl" overflow="hidden"
                          boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} justify="center" align="center"
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "260px", md: "320px" }}>
                      <Box ref={nucleoRef} position="relative"
                           w={{ base: "220px", md: "260px" }} h={{ base: "220px", md: "260px" }}
                           borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                        {/* anillo guía */}
                        <Box position="absolute" inset="-12px" borderRadius="full"
                             border={`1.5px dashed ${fisiologiaTxt}55`}
                             animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                        {/* núcleo negro */}
                        <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                             sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                   boxShadow: `inset 0 0 44px rgba(0,0,0,0.92), 0 0 24px ${fisiologiaTxt}22` }} />
                        {/* piezas dentro (juntándose) */}
                        {colocadas.map((p) => (
                          <PiezaInterna key={p.id} tipo={p.tipo} x={CLUSTER[p.id].x} y={CLUSTER[p.id].y} />
                        ))}
                        {hechas === 0 && (
                          <Text position="relative" zIndex={2} color={`${fisiologiaTxt}cc`}
                                fontSize={{ base: "sm", md: "md" }} fontStyle="italic" pointerEvents="none"
                                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                            el núcleo
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Reveal>

                  {/* ── Box derecha · piezas a arrastrar (2 por fila) · entra después ── */}
                  {/* Sin overflow:hidden para que la ficha no se recorte al arrastrarla al otro box. */}
                  <Reveal direction="up" distance={22} duration={0.5} delay={0.18}
                          position="relative" flex="1" borderRadius="2xl"
                          boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" align="center" gap={5}
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "auto", md: "320px" }}>
                      <Box ref={piezasRef} display="grid" gridTemplateColumns="repeat(2, auto)"
                           justifyContent="center" justifyItems="center" alignContent="center"
                           minH={piezasMinH ? `${piezasMinH}px` : undefined}
                           columnGap={{ base: 5, md: 7 }} rowGap={{ base: 5, md: 6 }}>
                        <AnimatePresence>
                          {pendientes.map((p, i) => (
                            <FichaArrastrable key={p.id} pieza={p} onSoltar={soltarEnNucleo} disabled={false}
                                              enterDelay={0.45 + i * 0.1} />
                          ))}
                        </AnimatePresence>
                      </Box>
                      {pendientes.length === 0 && (
                        <Text color={`${fisiologiaTxt}bb`} fontSize="md" fontStyle="italic">…uniéndose…</Text>
                      )}

                      {/* progreso */}
                      <Flex justify="center" gap={2}>
                        {Array.from({ length: total }).map((_, i) => (
                          <Box key={i} w="9px" h="9px" borderRadius="full"
                               bg={i < hechas ? fisiologiaTxt : "rgba(255,255,255,0.22)"}
                               boxShadow={i < hechas ? `0 0 10px ${fisiologiaTxt}` : "none"}
                               transition="all 0.3s" />
                        ))}
                      </Flex>
                    </Flex>
                  </Reveal>
                </Flex>
              </MBox>
            )}

            {/* ───────── FASE B · dos boxes: protón | texto ───────── */}
            {completo && (
              <MBox key="resultado" w="100%"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box izquierda · protón ── */}
                  <Box position="relative" flex={{ base: "1 1 auto", md: "0 0 42%" }} borderRadius="2xl" overflow="hidden"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" align="center"
                          px={{ base: 6, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "300px", md: "360px" }} gap={4}>
                      <Box position="relative" w={{ base: "230px", md: "300px" }} h={{ base: "230px", md: "300px" }}>
                        <Box position="absolute" inset="-6%" borderRadius="full"
                             animation={`${shimmer} 3.6s ease-in-out infinite`} pointerEvents="none"
                             sx={{ boxShadow: `0 0 50px ${fisiologiaTxt}55, 0 0 90px ${GLOW.down}33` }} />
                        <Image src={PROTON_IMG} alt="Protón: dos quarks up y un quark down unidos por gluones"
                               w="100%" h="100%" objectFit="contain"
                               fallbackStrategy="onError"
                               onLoad={() => setProtonImgOk(true)}
                               opacity={protonImgOk ? 1 : 0} transition="opacity 0.5s ease"
                               style={{ filter: `drop-shadow(0 0 18px ${fisiologiaTxt}44)` }}
                               fallback={<Box w="100%" h="100%" borderRadius="full" bg={fisiologiaBg} />} />
                        {!protonImgOk && (
                          <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                            <SpinnerTurquesa fullScreen={false} />
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  {/* ── Box derecha · texto ── */}
                  <Box position="relative" flex="1" borderRadius="2xl" overflow="hidden"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" gap={4}
                          px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }} h="100%" textAlign={{ base: "center", md: "left" }}>
                      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                            letterSpacing="0.02em" lineHeight="1.25" style={{ textShadow: INK }}>
                        ¡Enhorabuena! Has construido una partícula.
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                           bgGradient={`linear(to-r, ${fisiologiaTxt}88, transparent)`} />
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" style={{ textShadow: INK }}>
                        Las partículas están formadas por <b>quarks</b>, unas partículas fundamentales que aparecen y desaparecen constantemente, y por
                        <b> gluones</b>, que los mantienen unidos.
                      </Text>
                      <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" fontWeight="600" style={{ textShadow: INK }}>
                        Todo lo que existe, incluido tu cuerpo, está construido a partir de estas partículas.
                      </Text>
                    </Flex>
                  </Box>
                </Flex>

                {/* Volver a hacer — fuera del box, abajo a la derecha del todo */}
                <Flex justify="flex-end" w="100%" mt={{ base: 5, md: 6 }}>
                  <Box as="button" onClick={reiniciar}
                       display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                       bg="rgba(255,255,255,0.08)" color="rgba(255,255,255,0.8)" border="1px solid rgba(255,255,255,0.28)"
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
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
