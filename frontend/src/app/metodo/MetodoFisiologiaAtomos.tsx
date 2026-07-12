import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
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

// ── Piezas del átomo ────────────────────────────────────────────────────────
// El átomo más simple del universo — Hidrógeno = 1 protón (núcleo) y 1 electrón
// (órbita). No tiene neutrones.
type Tipo = "proton" | "neutron" | "electron";
interface Pieza { id: string; tipo: Tipo; }

const PIEZAS_INICIALES: Pieza[] = [
  { id: "p1", tipo: "proton" },
  { id: "e1", tipo: "electron" },
];

const GLOW: Record<Tipo, string> = { proton: "#e08a8a", neutron: "#b7b3c9", electron: "#8ab6e6" };
const LABEL: Record<Tipo, string> = { proton: "protón", neutron: "neutrón", electron: "electrón" };
const GLYPH: Record<Tipo, string> = { proton: "+", neutron: "0", electron: "–" };

// Gradiente de "esferita" para cada tipo (dibujada, no hay imágenes).
const esfera = (c: Tipo): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${GLOW[c]} 34%, ${GLOW[c]}dd 62%, ${GLOW[c]}77 100%)`;

// Dónde se agrupa el protón dentro del núcleo (centrado).
const NUCLEO_CLUSTER: { x: number; y: number }[] = [
  { x: 50, y: 50 },
];
// Dónde se posa el electrón sobre la órbita (en % del círculo grande).
const ORBITA_POS: { x: number; y: number }[] = [
  { x: 4, y: 50 },
];

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

// ─────────────────────────────────────────────────────────────────────────
// Esfera reutilizable (protón / neutrón / electrón)
// ─────────────────────────────────────────────────────────────────────────
function Esfera({ tipo, size, glow = true }: { tipo: Tipo; size: any; glow?: boolean }) {
  const c = GLOW[tipo];
  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
      sx={{
        background: esfera(tipo),
        boxShadow: glow ? `0 0 10px ${c}aa, 0 0 22px ${c}55` : "none",
      }}
    >
      <Text color="rgba(0,0,0,0.5)" fontWeight="900" lineHeight="1"
            fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>
        {GLYPH[tipo]}
      </Text>
    </Box>
  );
}

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
        sx={{
          filter: arrastrando
            ? `drop-shadow(0 0 16px ${glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))`
            : "none",
        }}
      >
        <Esfera tipo={pieza.tipo} size={{ base: "50px", md: "62px" }} />
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

// ── Pieza ya posada (dentro del núcleo o sobre la órbita) ───────────────────
function PiezaPosada({ tipo, x, y, size }: { tipo: Tipo; x: number; y: number; size: any }) {
  return (
    <MBox
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      transform="translate(-50%, -50%)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
    >
      <Esfera tipo={tipo} size={size} />
    </MBox>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaAtomos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendientes, setPendientes] = useState<Pieza[]>(PIEZAS_INICIALES);
  const [colocadas, setColocadas] = useState<Pieza[]>([]);
  const [completo, setCompleto] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  const nucleoRef = useRef<HTMLDivElement>(null);
  const orbitaRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        // ¿Modo test de pagos? Nos deja entrar aunque la columna fisiologia_suscrito
        // aún no exista en la BD (ALTER TABLE pendiente) — como en el resto de páginas.
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
          if (dataRef.current?.atomos_hecho) {
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
        { data: { ...dataRef.current, atomos_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = { ...dataRef.current, atomos_hecho: true };
    } catch { /* se reintenta la próxima vez */ }
  };

  // ¿El centro de la ficha soltada cae dentro de un círculo (con margen generoso)?
  const dentroDe = (el: HTMLDivElement | null, rect: DOMRect): boolean => {
    if (!el) return false;
    const c = el.getBoundingClientRect();
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    const radio = c.width / 2;
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    return Math.hypot(px - cx, py - cy) <= radio + rect.width / 2;
  };

  const soltar = (pieza: Pieza, rect: DOMRect) => {
    // Protones/neutrones → núcleo. Electrones → órbita (círculo grande).
    const acierta = pieza.tipo === "electron"
      ? dentroDe(orbitaRef.current, rect)
      : dentroDe(nucleoRef.current, rect);
    if (!acierta) return;

    setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
    setColocadas((prev) => {
      const next = [...prev, pieza];
      if (next.length === PIEZAS_INICIALES.length) {
        setTimeout(() => { setCompleto(true); void guardarHecho(); }, 750);
      }
      return next;
    });
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
  const nucleares = colocadas.filter((p) => p.tipo !== "electron");
  const electrones = colocadas.filter((p) => p.tipo === "electron");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Átomos"
            pageLabel="3/"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Partículas", onClick: () => navigate("/metodo/fisiologia/particulas") }}
            extra={celulasBtn}
            next={{ label: "Moléculas →", onClick: () => navigate("/metodo/fisiologia/moleculas") }}
          />

          {/* Instrucción (solo mientras construye) */}
          <AnimatePresence>
            {!completo && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                      letterSpacing="0.02em" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Construye un átomo
                </Text>
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  Lleva el protón al núcleo y el electrón a su órbita.
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

                      {/* Átomo (izquierda): órbita grande + núcleo dentro */}
                      <Flex flexShrink={0} justify="center" align="center"
                            w={{ base: "100%", md: "auto" }} pl={{ md: 2 }}>
                        <Box ref={orbitaRef} position="relative"
                             w={{ base: "250px", md: "300px" }} h={{ base: "250px", md: "300px" }}
                             borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                          {/* anillo de órbita (guía electrones) */}
                          <Box position="absolute" inset="0" borderRadius="full"
                               border={`1.5px dashed ${GLOW.electron}66`}
                               animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                          {/* electrones posados sobre la órbita */}
                          {electrones.map((p, i) => (
                            <PiezaPosada key={p.id} tipo={p.tipo}
                                         x={ORBITA_POS[i].x} y={ORBITA_POS[i].y}
                                         size={{ base: "26px", md: "32px" }} />
                          ))}

                          {/* Núcleo (centro) */}
                          <Box ref={nucleoRef} position="relative"
                               w={{ base: "120px", md: "148px" }} h={{ base: "120px", md: "148px" }}
                               borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                            <Box position="absolute" inset="-8px" borderRadius="full"
                                 border={`1.5px dashed ${GLOW.proton}66`}
                                 animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                            <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                                 sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                       boxShadow: `inset 0 0 34px rgba(0,0,0,0.92), 0 0 20px ${fisiologiaTxt}22` }} />
                            {/* protones/neutrones dentro (juntándose) */}
                            {nucleares.map((p, i) => (
                              <PiezaPosada key={p.id} tipo={p.tipo}
                                           x={NUCLEO_CLUSTER[i].x} y={NUCLEO_CLUSTER[i].y}
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

                      {/* Piezas a arrastrar (derecha) */}
                      <Flex flex="1" direction="column" align="center" gap={4} w="100%">
                        <Flex wrap="wrap" justify="center" gap={{ base: 4, md: 5 }} maxW="360px">
                          <AnimatePresence>
                            {pendientes.map((p) => (
                              <FichaArrastrable key={p.id} pieza={p} onSoltar={soltar} disabled={false} />
                            ))}
                          </AnimatePresence>
                          {pendientes.length === 0 && (
                            <Text color={`${fisiologiaTxt}bb`} fontSize="md" fontStyle="italic">…formándose…</Text>
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

                {/* ───────── FASE B · átomo + texto ───────── */}
                {completo && (
                  <MBox key="resultado"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>
                    <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 7, md: 12 }}>

                      {/* Átomo de Hidrógeno (izquierda): 1 electrón orbitando 1 protón */}
                      <Flex flexShrink={0} justify="center" align="center" position="relative"
                            w={{ base: "250px", md: "300px" }} h={{ base: "250px", md: "300px" }}>
                        <Box position="absolute" inset="-6%" borderRadius="full"
                             animation={`${shimmer} 3.6s ease-in-out infinite`} pointerEvents="none"
                             sx={{ boxShadow: `0 0 50px ${GLOW.electron}44, 0 0 90px ${GLOW.proton}33` }} />
                        {/* anillo de órbita */}
                        <Box position="absolute" inset="4%" borderRadius="full"
                             border={`1.5px solid ${GLOW.electron}55`} pointerEvents="none" />
                        {/* el electrón girando */}
                        <Box position="absolute" inset="4%" animation={`${spin} 6s linear infinite`} pointerEvents="none">
                          <Box position="absolute" left="0%" top="50%" transform="translate(-50%,-50%)">
                            <Esfera tipo="electron" size={{ base: "24px", md: "30px" }} />
                          </Box>
                        </Box>
                        {/* núcleo con 1 protón */}
                        <Box position="relative" w={{ base: "110px", md: "132px" }} h={{ base: "110px", md: "132px" }}
                             borderRadius="full" display="flex" alignItems="center" justifyContent="center"
                             sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                   boxShadow: `inset 0 0 34px rgba(0,0,0,0.92), 0 0 20px ${fisiologiaTxt}22` }}>
                          <Esfera tipo="proton" size={{ base: "40px", md: "50px" }} />
                        </Box>
                      </Flex>

                      {/* Texto (derecha) */}
                      <Flex flex="1" direction="column" gap={4} textAlign={{ base: "center", md: "left" }}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }}>🎉</Text>
                        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                              letterSpacing="0.02em" lineHeight="1.25" style={{ textShadow: INK }}>
                          ¡Has construido un átomo de Hidrógeno!
                        </Text>
                        <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                             bgGradient={`linear(to-r, ${fisiologiaTxt}88, transparent)`} />
                        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" style={{ textShadow: INK }}>
                          El <b>hidrógeno</b> es el átomo más simple y más abundante del universo: un solo <b>protón</b>
                          en el núcleo y un <b>electrón</b> orbitando a su alrededor. Fue el primer elemento en existir
                          tras el Big Bang.
                        </Text>
                        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" style={{ textShadow: INK }}>
                          El número de protones define de qué <b>elemento</b> se trata: 1 protón es hidrógeno, 2 es
                          helio, 6 es carbono… Cambiar ese número cambia por completo la sustancia.
                        </Text>
                        <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" fontWeight="600" style={{ textShadow: INK }}>
                          Tu cuerpo es, sobre todo, hidrógeno, oxígeno, carbono y nitrógeno: los mismos átomos que
                          forman las estrellas.
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
                          <Box as="button" onClick={() => navigate("/metodo/fisiologia/moleculas")}
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
