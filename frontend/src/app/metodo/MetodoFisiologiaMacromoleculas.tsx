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
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
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

// ── Definición de las 4 macromoléculas ──────────────────────────────────────
type MacroId = "proteina" | "adn" | "lipido" | "carbohidrato";
type Forma = "cadena" | "helice" | "membrana";

interface MacroDef {
  id: MacroId;
  nombre: string;
  monomero: string;       // singular
  monomeroPl: string;     // plural
  glow: string;           // color de acento
  glyph: string;          // símbolo de la perla dibujada
  n: number;              // cuántos monómeros hay que arrastrar
  forma: Forma;
  desc: string;           // frase de la tarjeta
  resultado: string[];    // párrafos al formarla
  monomeroImg: string;    // /recorrido/fisiologia/pre/aminoacido.png …
  resultadoImg: string;   // /recorrido/fisiologia/pre/proteina.png …
}

const PRE = "/recorrido/fisiologia/pre";

const MACROS: MacroDef[] = [
  {
    id: "proteina", nombre: "Enzimas", monomero: "aminoácido", monomeroPl: "aminoácidos",
    glow: "#7fd6c2", glyph: "A", n: 4, forma: "cadena",
    desc: "Realizan la mayoría de las funciones de la célula.",
    resultado: [
      "Una proteína es una larga cadena de aminoácidos que se pliega en una forma precisa.",
      "De esa forma depende su función: hay proteínas que transportan, defienden, construyen o aceleran reacciones. Son las obreras de la célula.",
    ],
    monomeroImg: `${PRE}/aminoacido.png`, resultadoImg: `${PRE}/proteina.png`,
  },
  {
    id: "adn", nombre: "ADN", monomero: "nucleótido", monomeroPl: "nucleótidos",
    glow: "#9ab6f0", glyph: "N", n: 4, forma: "helice",
    desc: "Contiene la información genética.",
    resultado: [
      "El ADN es una cadena de nucleótidos —las letras A, T, C y G— enrollada en una doble hélice.",
      "El orden de esas letras es el manual de instrucciones para fabricar todas tus proteínas: es tu información genética.",
    ],
    monomeroImg: `${PRE}/nucleotido.png`, resultadoImg: `${PRE}/adn.png`,
  },
  {
    id: "lipido", nombre: "Lípidos", monomero: "fosfolípido", monomeroPl: "fosfolípidos",
    glow: "#f2c86b", glyph: "L", n: 6, forma: "membrana",
    desc: "Forman las membranas celulares.",
    resultado: [
      "Los fosfolípidos tienen una cabeza que ama el agua y dos colas que la repelen.",
      "Por eso se ordenan solos en una doble capa: la membrana que envuelve y protege cada una de tus células.",
    ],
    monomeroImg: `${PRE}/fosfolipido.png`, resultadoImg: `${PRE}/membrana.png`,
  },
  {
    id: "carbohidrato", nombre: "Carbohidratos", monomero: "glucosa", monomeroPl: "glucosas",
    glow: "#e79ac0", glyph: "G", n: 4, forma: "cadena",
    desc: "Almacenan y proporcionan energía.",
    resultado: [
      "Uniendo muchas glucosas se forman los carbohidratos, como el glucógeno.",
      "Son la reserva de energía rápida del cuerpo: se guardan cuando sobra y se rompen cuando hace falta combustible.",
    ],
    monomeroImg: `${PRE}/glucosa.png`, resultadoImg: `${PRE}/carbohidrato.png`,
  },
];

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

const perla = (c: string): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${c} 36%, ${c}dd 64%, ${c}77 100%)`;

// ── Perla del monómero (imagen con reserva a esfera dibujada) ───────────────
function Perla({ def, size }: { def: MacroDef; size: any }) {
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" pointerEvents="none"
         sx={{ boxShadow: `0 0 12px ${def.glow}aa, 0 0 24px ${def.glow}55` }}>
      <Image src={def.monomeroImg} alt={def.monomero} w="100%" h="100%" objectFit="cover" draggable={false}
             fallback={
               <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" sx={{ background: perla(def.glow) }}>
                 <Text color="rgba(0,0,0,0.55)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{def.glyph}</Text>
               </Box>
             } />
    </Box>
  );
}

// ── Ficha arrastrable (un monómero) ─────────────────────────────────────────
function MonomeroFicha({ def, onSoltar }: { def: MacroDef; onSoltar: (rect: DOMRect) => void }) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <MBox
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => { setArrastrando(false); if (ref.current) onSoltar(ref.current.getBoundingClientRect()); }}
      whileDrag={{ scale: 1.18, zIndex: 60 }}
      whileHover={{ scale: 1.08, y: -2 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor="grab"
      flexShrink={0}
      style={{ touchAction: "none" }}
      sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${def.glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}
    >
      <Perla def={def} size={{ base: "44px", md: "54px" }} />
    </MBox>
  );
}

// ── Posición (en %) de cada monómero dentro de la bandeja, según la forma ────
function posEnBandeja(forma: Forma, i: number, n: number): { x: number; y: number } {
  const x = ((i + 0.5) / n) * 100;
  if (forma === "helice") return { x, y: i % 2 === 0 ? 34 : 66 };      // zig-zag (hélice)
  if (forma === "membrana") return { x, y: i % 2 === 0 ? 30 : 70 };    // dos capas
  return { x, y: 50 + (i % 2 === 0 ? -6 : 6) };                        // cadena suave
}

// ── Caja rectangular con el fondo/brillo de Fisiología (reutilizable) ────────
function PanelBox({ children, minH, px, py, ...rest }: any) {
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden"
         boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}
         {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%"
           px={px ?? { base: 5, md: 9 }} py={py ?? { base: 7, md: 9 }} minH={minH}>
        {children}
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Estación de una macromolécula (se remonta al cambiar de estación).
// ═════════════════════════════════════════════════════════════════════════
function Estacion({
  def, yaFormada, onFormar, onVolver,
}: {
  def: MacroDef;
  yaFormada: boolean;
  onFormar: () => void;
  onVolver: () => void;
}) {
  const [puestos, setPuestos] = useState(0);
  const [completo, setCompleto] = useState(yaFormada);
  const bandejaRef = useRef<HTMLDivElement>(null);

  const soltar = (rect: DOMRect) => {
    const el = bandejaRef.current;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const m = rect.width / 2;
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const dentro = px >= c.left - m && px <= c.right + m && py >= c.top - m && py <= c.bottom + m;
    if (!dentro) return;
    setPuestos((prev) => {
      const next = prev + 1;
      if (next >= def.n) {
        setTimeout(() => { setCompleto(true); onFormar(); }, 500);
      }
      return Math.min(next, def.n);
    });
  };

  const restantes = def.n - puestos;

  return (
    <MBox key={def.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} w="100%">
      {/* Volver */}
      <Flex mb={4}>
        <Box as="button" onClick={onVolver}
             display="inline-flex" alignItems="center" gap={2} px={4} py={1.5} borderRadius="full"
             bg="rgba(255,255,255,0.1)" color="rgba(255,255,255,0.9)"
             fontFamily="'EB Garamond', serif" fontWeight="600" fontSize="sm" cursor="pointer"
             transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.18)" }}>
          ← Las 4 macromoléculas
        </Box>
      </Flex>

      <AnimatePresence mode="wait">
        {!completo ? (
          // ── FASE A · encadenar ──
          <MBox key="a" w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PanelBox minH={{ md: "360px" }}>
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center"
                  style={{ textShadow: INK }}>{def.nombre}</Text>
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" mt={1} mb={6} style={{ textShadow: INK }}>
              Arrastra {def.n} {def.monomeroPl} a la bandeja para encadenarlos.
            </Text>

            {/* Bandeja de ensamblaje */}
            <Box ref={bandejaRef} position="relative" w="100%" h={{ base: "130px", md: "150px" }}
                 borderRadius="2xl" overflow="hidden" mb={6}
                 sx={{ background: "radial-gradient(ellipse at 50% 40%, #241d3c 0%, #150f26 55%, #060410 100%)",
                       boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 20px ${def.glow}22` }}>
              <Box position="absolute" inset="8px" borderRadius="xl" pointerEvents="none"
                   border={`1.5px dashed ${def.glow}55`} animation={`${pulse} 3.4s ease-in-out infinite`} />
              {/* monómeros ya colocados */}
              {Array.from({ length: puestos }).map((_, i) => {
                const p = posEnBandeja(def.forma, i, def.n);
                return (
                  <MBox key={i} position="absolute" left={`${p.x}%`} top={`${p.y}%`} transform="translate(-50%,-50%)"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                    <Perla def={def} size={{ base: "34px", md: "42px" }} />
                  </MBox>
                );
              })}
              {puestos === 0 && (
                <Flex position="absolute" inset="0" align="center" justify="center" pointerEvents="none">
                  <Text color={`${def.glow}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>bandeja de ensamblaje</Text>
                </Flex>
              )}
            </Box>

            {/* Monómeros a arrastrar */}
            <Flex wrap="wrap" justify="center" align="center" gap={{ base: 3, md: 4 }} minH="60px">
              <AnimatePresence>
                {Array.from({ length: restantes }).map((_, i) => (
                  <MonomeroFicha key={i} def={def} onSoltar={soltar} />
                ))}
              </AnimatePresence>
              {restantes === 0 && (
                <Text color={`${def.glow}bb`} fontSize="md" fontStyle="italic">…plegándose…</Text>
              )}
            </Flex>

            {/* progreso */}
            <Flex justify="center" gap={2} mt={5}>
              {Array.from({ length: def.n }).map((_, i) => (
                <Box key={i} w="9px" h="9px" borderRadius="full"
                     bg={i < puestos ? def.glow : "rgba(255,255,255,0.22)"}
                     boxShadow={i < puestos ? `0 0 10px ${def.glow}` : "none"} transition="all 0.3s" />
              ))}
            </Flex>
            </PanelBox>
          </MBox>
        ) : (
          // ── FASE B · resultado (2 cajas: foto | texto) ──
          <MBox key="b" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}>
            <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

              {/* Caja 1 · imagen de la macromolécula */}
              <PanelBox flexShrink={0} w={{ base: "100%", md: "auto" }}>
                <Flex h="100%" justify="center" align="center">
                  <Flex flexShrink={0} justify="center" align="center" position="relative"
                        w={{ base: "220px", md: "280px" }} h={{ base: "220px", md: "280px" }}>
                    <Box position="absolute" inset="-4%" borderRadius="full" pointerEvents="none"
                         animation={`${shimmer} 3.6s ease-in-out infinite`}
                         sx={{ boxShadow: `0 0 46px ${def.glow}55, 0 0 88px ${def.glow}33` }} />
                    <Image src={def.resultadoImg} alt={def.nombre} w="100%" h="100%" objectFit="contain"
                           style={{ filter: `drop-shadow(0 0 16px ${def.glow}55)` }}
                           fallback={<MacroDibujada def={def} />} />
                  </Flex>
                </Flex>
              </PanelBox>

              {/* Caja 2 · texto */}
              <PanelBox flex="1">
                <Flex direction="column" gap={3.5} h="100%" justify="center" textAlign={{ base: "center", md: "left" }}>
                  <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                        style={{ textShadow: INK }}>¡Has formado {def.nombre.toLowerCase()}!</Text>
                  <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                       bgGradient={`linear(to-r, ${def.glow}aa, transparent)`} />
                  {def.resultado.map((p, i) => (
                    <Text key={i} color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }}
                          lineHeight="1.9" style={{ textShadow: INK }}>{p}</Text>
                  ))}
                  <Box as="button" onClick={onVolver} alignSelf={{ base: "center", md: "flex-start" }} mt={2}
                       px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                       boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                    Volver a las macromoléculas →
                  </Box>
                </Flex>
              </PanelBox>
            </Flex>
          </MBox>
        )}
      </AnimatePresence>
    </MBox>
  );
}

// ── Reserva dibujada de la macromolécula formada (mientras no haya PNG) ──────
function MacroDibujada({ def }: { def: MacroDef }) {
  const beads = Array.from({ length: def.n });
  return (
    <Box position="relative" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
      <Box position="relative" w="86%" h="60%">
        {beads.map((_, i) => {
          const p = posEnBandeja(def.forma, i, def.n);
          return (
            <Box key={i} position="absolute" left={`${p.x}%`} top={`${p.y}%`} transform="translate(-50%,-50%)"
                 w={{ base: "30px", md: "38px" }} h={{ base: "30px", md: "38px" }} borderRadius="full"
                 sx={{ background: perla(def.glow), boxShadow: `0 0 10px ${def.glow}aa` }} />
          );
        })}
      </Box>
    </Box>
  );
}

// ── Box rectangular de una macromolécula ────────────────────────────────────
// Foto a la izquierda: se ve si ya está formada; si no, un «?». El resto (nombre,
// descripción, acción) siempre visible. Al formarla aparece la foto + un tick y
// el borde se ilumina → sensación de recorrido.
function MacroCard({ m, hecha, onClick }: { m: MacroDef; hecha: boolean; onClick: () => void }) {
  return (
    <MBox whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} w="100%">
      <Box
        as="button"
        onClick={onClick}
        w="100%"
        textAlign="left"
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        cursor="pointer"
        border={`1px solid ${hecha ? m.glow : "rgba(255,255,255,0.16)"}`}
        boxShadow={hecha
          ? `0 0 20px ${m.glow}44, 0 4px 18px rgba(0,0,0,0.22), inset 0 0 24px ${m.glow}12`
          : "0 4px 18px rgba(0,0,0,0.22)"}
        transition="all 0.25s ease"
        _hover={{ borderColor: m.glow, boxShadow: `0 0 24px ${m.glow}55, 0 8px 26px rgba(0,0,0,0.3)` }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

        <Flex position="relative" zIndex={1} align="center" gap={{ base: 4, md: 6 }} p={{ base: 4, md: 5 }}>
          {/* Foto (o «?» si aún no está hecha) */}
          <Box
            flexShrink={0}
            w={{ base: "96px", md: "128px" }}
            h={{ base: "96px", md: "128px" }}
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            bg="rgba(10,7,20,0.5)"
            border={`1px solid ${hecha ? `${m.glow}77` : "rgba(255,255,255,0.14)"}`}
            boxShadow={hecha ? `0 0 16px ${m.glow}55, inset 0 0 18px ${m.glow}14` : "none"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {hecha ? (
              <Image src={m.resultadoImg} alt={m.nombre} w="100%" h="100%" objectFit="contain"
                     fallback={<MacroDibujada def={m} />} />
            ) : (
              <Text color="rgba(255,255,255,0.5)" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="800"
                    style={{ textShadow: INK }}>?</Text>
            )}
          </Box>

          {/* Texto */}
          <Box flex="1" minW={0}>
            <Flex align="center" gap={2.5}>
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                    style={{ textShadow: INK }}>{m.nombre}</Text>
              {hecha && (
                <Flex as="span" align="center" justify="center" flexShrink={0}
                      w={{ base: "22px", md: "24px" }} h={{ base: "22px", md: "24px" }} borderRadius="full"
                      bg={m.glow} color={fisiologiaBg} fontSize={{ base: "xs", md: "sm" }} fontWeight="900"
                      boxShadow={`0 0 10px ${m.glow}aa`}>✓</Flex>
              )}
            </Flex>
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" mt={1}
                  style={{ textShadow: INK }}>{m.desc}</Text>
            <Text color={hecha ? m.glow : `${fisiologiaTxt}cc`} fontSize="xs" fontWeight="700"
                  letterSpacing="0.05em" textTransform="uppercase" mt={2.5}>
              {hecha ? "Formada · ver de nuevo" : `Construir · ${m.n} ${m.monomeroPl}`}
            </Text>
          </Box>
        </Flex>
      </Box>
    </MBox>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaMacromoleculas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formadas, setFormadas] = useState<MacroId[]>([]);
  const [activa, setActiva] = useState<MacroId | null>(null);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardadas = dataRef.current?.macromoleculas_hechas;
          if (Array.isArray(guardadas)) setFormadas(guardadas.filter((x: any): x is MacroId => MACROS.some((m) => m.id === x)));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardar = async (nuevas: MacroId[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = {
      ...dataRef.current,
      macromoleculas_hechas: nuevas,
      macromoleculas_hecho: nuevas.length === MACROS.length,
    };
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* se reintenta la próxima vez */ }
  };

  const formar = (id: MacroId) => {
    setFormadas((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      void guardar(next);
      return next;
    });
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const defActiva = MACROS.find((m) => m.id === activa) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Macromoléculas"
            pageLabel="4/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Moléculas", onClick: () => navigate("/metodo/fisiologia/moleculas") }}
            extra={celulasBtn}
            next={{ label: "Estructuras →", onClick: () => navigate("/metodo/fisiologia/estructuras") }}
          />

          {!activa && (
            <MBox initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} textAlign="center">
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Las grandes moléculas de la vida
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                    maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Encadenando moléculas pequeñas se forman las macromoléculas. Construye las cuatro que sostienen tu Vida.
              </Text>
            </MBox>
          )}

          {defActiva ? (
            /* ── Estación (cada fase trae sus propias cajas) ── */
            <Estacion
              key={defActiva.id}
              def={defActiva}
              yaFormada={formadas.includes(defActiva.id)}
              onFormar={() => formar(defActiva.id)}
              onVolver={() => setActiva(null)}
            />
          ) : (
            /* ── 4 boxes en rejilla 2×2 ── */
            <Flex wrap="wrap" justify="center" w="100%" maxW="880px" gap={{ base: 4, md: 5 }}>
              {MACROS.map((m) => (
                <Box key={m.id} flex={{ base: "1 1 100%", md: "0 1 calc(50% - 10px)" }} minW={0} display="flex">
                  <MacroCard m={m} hecha={formadas.includes(m.id)} onClick={() => setActiva(m.id)} />
                </Box>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>

      {celulasModal}
      <IndiceFisiologia />
      <SiteFooter />
    </Box>
  );
}
