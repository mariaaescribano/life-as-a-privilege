import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
} from "../../GlobalVariables";

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

// Posiciones (en %) donde se JUNTAN las piezas dentro del núcleo: un racimo
// apretado en el centro (2 quarks arriba, 1 abajo, gluones intercalados).
const CLUSTER: { x: number; y: number }[] = [
  { x: 41, y: 43 }, { x: 59, y: 43 }, { x: 50, y: 60 },
  { x: 50, y: 34 }, { x: 37, y: 55 }, { x: 63, y: 55 },
];

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
  pieza, onSoltar, disabled,
}: {
  pieza: Pieza;
  onSoltar: (pieza: Pieza, rect: DOMRect) => void;
  disabled: boolean;
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const glow = GLOW[pieza.tipo];

  return (
    <MBox
      ref={ref}
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => {
        setArrastrando(false);
        // Usamos el rect real de la ficha (viewport), no info.point, para que la
        // detección funcione aunque la página tenga scroll y en táctil.
        if (ref.current) onSoltar(pieza, ref.current.getBoundingClientRect());
      }}
      whileDrag={{ scale: 1.18, zIndex: 60 }}
      whileHover={disabled ? undefined : { scale: 1.07, y: -2 }}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor={disabled ? "default" : "grab"}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      flexShrink={0}
      style={{ touchAction: "none" }}
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
          fallback={<Box w="100%" h="100%" bg={glow} />}
        />
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
function PiezaInterna({ tipo, x, y }: { tipo: Tipo; x: number; y: number }) {
  const glow = GLOW[tipo];
  return (
    <MBox
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      w={{ base: "34px", md: "44px" }}
      h={{ base: "34px", md: "44px" }}
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
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

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

  // ¿La ficha soltada se solapa con el círculo del núcleo?
  const soltarEnNucleo = (pieza: Pieza, rect: DOMRect) => {
    const el = nucleoRef.current;
    if (!el) return;
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
    }
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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Partículas"
            pageLabel="2/"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Fisiología", onClick: () => navigate("/metodo/fisiologia") }}
            extra={celulasBtn}
            next={{ label: "Construye un átomo →", onClick: () => navigate("/metodo/fisiologia/atomos") }}
          />

          {/* Instrucción (solo mientras construye) */}
          <AnimatePresence>
            {!completo && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                      letterSpacing="0.02em" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Construye una partícula
                </Text>
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Arrastra cada pieza dentro del núcleo para unirlas.
                </Text>
              </MBox>
            )}
          </AnimatePresence>

          {/* ── BOX RECTANGULAR ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
            <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

            <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }} py={{ base: 7, md: 9 }} minH={{ md: "360px" }}>
              <AnimatePresence mode="wait">

                {/* ───────── FASE A · construir ───────── */}
                {!completo && (
                  <MBox key="construir"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}>
                    <Flex direction={{ base: "column", md: "row" }} align="center"
                          gap={{ base: 8, md: 10 }} pl={{ md: 4 }}>

                      {/* Núcleo (izquierda, con aire) */}
                      <Flex flexShrink={0} justify="center" align="center"
                            w={{ base: "100%", md: "auto" }} pl={{ md: 2 }}>
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
                          {colocadas.map((p, i) => (
                            <PiezaInterna key={p.id} tipo={p.tipo} x={CLUSTER[i].x} y={CLUSTER[i].y} />
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

                      {/* Piezas a arrastrar (derecha) */}
                      <Flex flex="1" direction="column" align="center" gap={4} w="100%">
                        <Flex wrap="wrap" justify="center" gap={{ base: 4, md: 5 }} maxW="360px">
                          <AnimatePresence>
                            {pendientes.map((p) => (
                              <FichaArrastrable key={p.id} pieza={p} onSoltar={soltarEnNucleo} disabled={false} />
                            ))}
                          </AnimatePresence>
                          {pendientes.length === 0 && (
                            <Text color={`${fisiologiaTxt}bb`} fontSize="md" fontStyle="italic">…uniéndose…</Text>
                          )}
                        </Flex>

                        {/* progreso */}
                        <Flex justify="center" gap={2} mt={2}>
                          {Array.from({ length: total }).map((_, i) => (
                            <Box key={i} w="9px" h="9px" borderRadius="full"
                                 bg={i < hechas ? fisiologiaTxt : "rgba(255,255,255,0.22)"}
                                 boxShadow={i < hechas ? `0 0 10px ${fisiologiaTxt}` : "none"}
                                 transition="all 0.3s" />
                          ))}
                        </Flex>
                      </Flex>
                    </Flex>
                  </MBox>
                )}

                {/* ───────── FASE B · protón + texto ───────── */}
                {completo && (
                  <MBox key="resultado"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>
                    <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 7, md: 12 }}>

                      {/* Protón (izquierda) */}
                      <Flex flexShrink={0} justify="center" align="center" position="relative"
                            w={{ base: "260px", md: "320px" }} h={{ base: "260px", md: "320px" }}>
                        <Box position="absolute" inset="-6%" borderRadius="full"
                             animation={`${shimmer} 3.6s ease-in-out infinite`} pointerEvents="none"
                             sx={{ boxShadow: `0 0 50px ${fisiologiaTxt}55, 0 0 90px ${GLOW.down}33` }} />
                        <Image src={PROTON_IMG} alt="Protón: dos quarks up y un quark down unidos por gluones"
                               w="100%" h="100%" objectFit="contain"
                               style={{ filter: `drop-shadow(0 0 18px ${fisiologiaTxt}44)` }}
                               fallback={<Box w="100%" h="100%" borderRadius="full" bg={fisiologiaBg} />} />
                      </Flex>

                      {/* Texto (derecha) */}
                      <Flex flex="1" direction="column" gap={4} textAlign={{ base: "center", md: "left" }}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }}>🎉</Text>
                        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                              letterSpacing="0.02em" lineHeight="1.25" style={{ textShadow: INK }}>
                          ¡Enhorabuena! Has construido una partícula.
                        </Text>
                        <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                             bgGradient={`linear(to-r, ${fisiologiaTxt}88, transparent)`} />
                        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" style={{ textShadow: INK }}>
                          Las partículas están formadas por <b>quarks</b>, unas partículas fundamentales, y por
                          <b> gluones</b>, que mantienen unidos a los quarks mediante la <b>interacción fuerte</b>.
                        </Text>
                        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" style={{ textShadow: INK }}>
                          A nivel cuántico, este interior es extraordinariamente dinámico: los campos cuánticos generan
                          continuamente partículas virtuales que aparecen y desaparecen durante tiempos brevísimos.
                        </Text>
                        <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" fontWeight="600" style={{ textShadow: INK }}>
                          Todo lo que existe, incluido tu cuerpo, está construido a partir de estas partículas.
                        </Text>

                        <Flex gap={4} mt={3} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                          <Box as="button" onClick={reiniciar}
                               px={6} py={2.5} borderRadius="full" bg="transparent"
                               color="rgba(255,255,255,0.85)" border="1px solid rgba(255,255,255,0.45)"
                               fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                               letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                               _hover={{ borderColor: "white", color: "white" }}>
                            ↺ Construir de nuevo
                          </Box>
                          <Box as="button" onClick={() => navigate("/metodo/fisiologia/atomos")}
                               px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                               fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                               letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                               boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                               _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}>
                            Continuar el recorrido →
                          </Box>
                        </Flex>
                      </Flex>
                    </Flex>
                  </MBox>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Flex>
      </Flex>

      {celulasModal}
      <SiteFooter />
    </Box>
  );
}
