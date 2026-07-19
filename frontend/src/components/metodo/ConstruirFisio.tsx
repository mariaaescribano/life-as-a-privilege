import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../global/SiteHeader";
import SiteFooter from "../global/Footer";
import SpinnerTurquesa from "../global/Spinner";
import { MetodoStepHeader } from "./MetodoStepHeader";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { useTusCelulas } from "./TusCelulasModal";
import { IndiceFisiologia } from "./IndiceFisiologia";
import { BotonCompania } from "../global/BotonCompania";
import { Reveal } from "../global/Reveal";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Componente reutilizable de "ensamblar el siguiente nivel": arrastras unas
// piezas a la zona y, al colocarlas todas, se forma el resultado (imagen con
// reserva a figura dibujada) + texto. Guarda un flag en metodo_fisiologia.data.
// Todas las páginas de niveles de Fisiología lo usan con distinta configuración.
// ─────────────────────────────────────────────────────────────────────────
const MBox = motion(Box);
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;

export type FormaFisio = "cluster" | "row" | "membrana";

export interface PiezaDef {
  tipo: string;
  color: string;
  glyph: string;
  label: string;
  n: number;
  img?: string;
}

export interface ConstruirFisioProps {
  title: string;
  pageLabel: string;
  prev: { label: string; ruta: string };
  introTitulo: string;
  instruccion: string;
  piezas: PiezaDef[];
  zonaLabel: string;
  forma: FormaFisio;
  resultTitulo: string;
  resultParrafos: React.ReactNode[];
  resultImg?: string;
  glow: string;
  dataKey: string;
  /** Botón «Continuar» dentro del box de resultado. Opcional: si no se pasa, no
   *  se pinta (p.ej. Célula, que avanza solo desde el header). */
  next?: { label: string; ruta: string };
  /** Botón derecho del header (opcional). Independiente del «Continuar» del box
   *  de resultado. P.ej. Célula → «Todas tus células →». */
  headerNext?: { label: string; ruta: string };
  /** Si true, el botón «next» del header queda BLOQUEADO hasta completar el
   *  ensamblaje (p.ej. Célula: no se avanza sin haber creado la célula). */
  lockNextUntilComplete?: boolean;
  /** Tooltip del botón bloqueado (cuando lockNextUntilComplete y aún no está hecho). */
  lockNextTooltip?: string;
  /** Nota discreta al pie de la página (blanco, cursiva, pequeña). */
  notaPie?: React.ReactNode;
}

interface Pieza { id: string; def: PiezaDef; }

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

const perlaBg = (c: string): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${c} 36%, ${c}dd 64%, ${c}77 100%)`;

function pos(forma: FormaFisio, i: number, n: number): { x: number; y: number } {
  if (forma === "row") return { x: ((i + 0.5) / n) * 100, y: 50 + (i % 2 === 0 ? -7 : 7) };
  if (forma === "membrana") return { x: ((i + 0.5) / n) * 100, y: i % 2 === 0 ? 30 : 70 };
  // Cluster: círculo REAL (mismo radio en x/y) centrado en el centro del círculo
  // negro (50%, 50%), para que el anillo de piezas quede concéntrico con él.
  const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(ang) * 25, y: 50 + Math.sin(ang) * 25 };
}

function Perla({ def, size }: { def: PiezaDef; size: any }) {
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" pointerEvents="none"
         sx={{ boxShadow: `0 0 12px ${def.color}aa, 0 0 24px ${def.color}55` }}>
      <Image src={def.img ?? ""} alt="" w="100%" h="100%" objectFit="cover" draggable={false}
             fallback={
               <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" sx={{ background: perlaBg(def.color) }}>
                 <Text color="rgba(0,0,0,0.55)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{def.glyph}</Text>
               </Box>
             } />
    </Box>
  );
}

// Hueco invisible que ocupa EXACTAMENTE el sitio de una pieza ya colocada, para
// que las piezas que aún quedan no se recoloquen al arrastrar a sus hermanas.
// Misma estructura (perla + etiqueta) que <Ficha> → mismo tamaño de celda.
function GhostPieza({ def }: { def: PiezaDef }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexShrink={0}
         visibility="hidden" aria-hidden style={{ pointerEvents: "none" }}>
      <Perla def={def} size={{ base: "80px", md: "104px" }} />
      <Text fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700" letterSpacing="0.05em" textTransform="uppercase">
        {def.label}
      </Text>
    </Box>
  );
}

function Ficha({ pieza, onSoltar }: { pieza: Pieza; onSoltar: (r: DOMRect) => void }) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <MBox
      ref={ref}
      drag dragSnapToOrigin dragElastic={0.12} dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => { setArrastrando(false); if (ref.current) onSoltar(ref.current.getBoundingClientRect()); }}
      whileDrag={{ scale: 1.16, zIndex: 60 }}
      whileHover={{ scale: 1.08, y: -2 }}
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor="grab" position="relative" display="flex" flexDirection="column" alignItems="center" gap={1}
      flexShrink={0} style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${pieza.def.color}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}>
        <Perla def={pieza.def} size={{ base: "80px", md: "104px" }} />
      </Box>
      <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
            letterSpacing="0.05em" textTransform="uppercase" pointerEvents="none"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
        {pieza.def.label}
      </Text>
    </MBox>
  );
}

function Dibujada({ piezas, forma }: { piezas: Pieza[]; forma: FormaFisio }) {
  return (
    <Box position="relative" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
      <Box position="relative" w="82%" h={forma === "cluster" ? "82%" : "60%"}>
        {piezas.map((p, i) => {
          const q = pos(forma, i, piezas.length);
          return (
            <Box key={p.id} position="absolute" left={`${q.x}%`} top={`${q.y}%`} transform="translate(-50%,-50%)"
                 w={{ base: "30px", md: "38px" }} h={{ base: "30px", md: "38px" }} borderRadius="full"
                 sx={{ background: perlaBg(p.def.color), boxShadow: `0 0 10px ${p.def.color}aa` }} />
          );
        })}
      </Box>
    </Box>
  );
}

export default function ConstruirFisio(props: ConstruirFisioProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const flat = (): Pieza[] =>
    props.piezas.flatMap((d) => Array.from({ length: d.n }, (_, i) => ({ id: `${d.tipo}-${i}`, def: d })));
  const [pendientes, setPendientes] = useState<Pieza[]>(flat);
  const [puestas, setPuestas] = useState<Pieza[]>([]);
  const [completo, setCompleto] = useState(false);
  const [imgOk, setImgOk] = useState(false); // foto del resultado ya cargada
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const zonaRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, any>>({});
  const total = props.piezas.reduce((s, d) => s + d.n, 0);
  // Lista COMPLETA y estable de piezas (orden fijo). Se renderizan todas siempre:
  // cada una ocupa su celda fija y, al colocarla, deja un hueco invisible en su
  // sitio → las demás no se mueven ni el box cambia de tamaño.
  const todas = useMemo(
    () => props.piezas.flatMap((d) => Array.from({ length: d.n }, (_, i) => ({ id: `${d.tipo}-${i}`, def: d }))),
    [props.piezas],
  );
  const puestasIds = new Set(puestas.map((p) => p.id));

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
          if (dataRef.current?.[props.dataKey]) { setPendientes([]); setPuestas(flat()); setCompleto(true); }
        } catch { /* sin fila */ }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, props.dataKey]);

  const guardar = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [props.dataKey]: true };
    dataRef.current = data;
    try { await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }); }
    catch { /* se reintenta */ }
  };

  const soltar = (pieza: Pieza, rect: DOMRect) => {
    const el = zonaRef.current;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const m = rect.width / 2;
    const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
    if (!(px >= c.left - m && px <= c.right + m && py >= c.top - m && py <= c.bottom + m)) return;
    setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
    setPuestas((prev) => {
      const next = [...prev, pieza];
      if (next.length >= total) setTimeout(() => { setCompleto(true); void guardar(); }, 650);
      return next;
    });
  };

  const reiniciar = () => { setPuestas([]); setPendientes(flat()); setCompleto(false); };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title={props.title}
            pageLabel={props.pageLabel}
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: props.prev.label, onClick: () => navigate(props.prev.ruta) }}
            extra={celulasBtn}
            next={props.headerNext ? {
              label: props.headerNext.label,
              onClick: () => navigate(props.headerNext!.ruta),
              disabled: props.lockNextUntilComplete ? !completo : false,
              disabledTooltip: props.lockNextTooltip ?? "Termina de construirlo primero",
            } : undefined}
          />
          </Reveal>

          <AnimatePresence>
            {!completo && (
              <MBox key="instr" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} textAlign="center">
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>{props.introTitulo}</Text>
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                      maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>{props.instruccion}</Text>
              </MBox>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!completo ? (
              <MBox key="a" w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box izquierda · zona de ensamblaje (aquí se llevan las piezas) ── */}
                  <Box position="relative" flex={{ base: "1 1 auto", md: "0 0 46%" }} borderRadius="2xl" overflow="hidden"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} justify="center" align="center"
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "280px", md: "340px" }}>
                      <Box ref={zonaRef} position="relative"
                           w={{ base: "250px", md: "300px" }} h={{ base: "250px", md: "300px" }}
                           borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                        <Box position="absolute" inset="-12px" borderRadius="full"
                             border={`1.5px dashed ${props.glow}55`} animation={`${pulse} 3.4s ease-in-out infinite`} pointerEvents="none" />
                        <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                             sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                                   boxShadow: `inset 0 0 40px rgba(0,0,0,0.9), 0 0 24px ${props.glow}22` }} />
                        {puestas.map((p, i) => {
                          const q = pos(props.forma, i, total);
                          return (
                            <MBox key={p.id} position="absolute" left={`${q.x}%`} top={`${q.y}%`} transform="translate(-50%,-50%)"
                                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                              <Perla def={p.def} size={{ base: "54px", md: "70px" }} />
                            </MBox>
                          );
                        })}
                        {puestas.length === 0 && (
                          <Text position="relative" zIndex={2} color={`${props.glow}cc`} fontSize={{ base: "sm", md: "md" }}
                                fontStyle="italic" pointerEvents="none" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                            {props.zonaLabel}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  {/* ── Box derecha · piezas a arrastrar (2 por fila) ── */}
                  {/* Sin overflow:hidden para que la ficha no se recorte al arrastrarla al otro box. */}
                  <Box position="relative" flex="1" borderRadius="2xl"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" align="center" justify="center" gap={5}
                          px={{ base: 5, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "auto", md: "340px" }}>
                      <Box display="grid" gridTemplateColumns="repeat(2, auto)"
                           justifyContent="center" justifyItems="center" alignContent="center"
                           columnGap={{ base: 4, md: 6 }} rowGap={{ base: 4, md: 5 }}>
                        {/* Todas las piezas SIEMPRE presentes: la colocada se vuelve
                            un hueco invisible en su celda, así las que faltan no se
                            recolocan (donde empiezan, ahí se quedan). */}
                        {todas.map((p) => (
                          puestasIds.has(p.id)
                            ? <GhostPieza key={p.id} def={p.def} />
                            : <Ficha key={p.id} pieza={p} onSoltar={(r) => soltar(p, r)} />
                        ))}
                      </Box>
                      {pendientes.length === 0 && (<Text color={`${props.glow}bb`} fontSize="md" fontStyle="italic">…uniéndose…</Text>)}
                      <Flex justify="center" gap={2} wrap="wrap" maxW="320px">
                        {Array.from({ length: total }).map((_, i) => (
                          <Box key={i} w="9px" h="9px" borderRadius="full"
                               bg={i < puestas.length ? props.glow : "rgba(255,255,255,0.22)"}
                               boxShadow={i < puestas.length ? `0 0 10px ${props.glow}` : "none"} transition="all 0.3s" />
                        ))}
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>
              </MBox>
            ) : (
              <MBox key="b" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── Box foto ── */}
                  <Box position="relative" flex={{ base: "1 1 auto", md: "0 0 42%" }} borderRadius="2xl" overflow="hidden"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" align="center"
                          px={{ base: 6, md: 8 }} py={{ base: 8, md: 9 }} h="100%" minH={{ base: "280px", md: "360px" }}>
                      <Box position="relative" w={{ base: "230px", md: "290px" }} h={{ base: "230px", md: "290px" }}>
                        <Box position="absolute" inset="-4%" borderRadius="full" pointerEvents="none"
                             animation={`${shimmer} 3.6s ease-in-out infinite`}
                             sx={{ boxShadow: `0 0 48px ${props.glow}55, 0 0 90px ${props.glow}33` }} />
                        <Image src={props.resultImg ?? ""} alt={props.resultTitulo} w="100%" h="100%" objectFit="contain"
                               fallbackStrategy="onError"
                               onLoad={() => setImgOk(true)}
                               opacity={imgOk ? 1 : 0} transition="opacity 0.5s ease"
                               style={{ filter: `drop-shadow(0 0 16px ${props.glow}55)` }}
                               fallback={<Dibujada piezas={puestas.length ? puestas : flat()} forma={props.forma} />} />
                        {props.resultImg && !imgOk && (
                          <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                            <SpinnerTurquesa fullScreen={false} />
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  {/* ── Box texto ── */}
                  <Box position="relative" flex="1" borderRadius="2xl" overflow="hidden"
                       boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" justify="center" gap={4}
                          px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }} h="100%" textAlign={{ base: "center", md: "left" }}>
                      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25" style={{ textShadow: INK }}>
                        {props.resultTitulo}
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                           bgGradient={`linear(to-r, ${props.glow}aa, transparent)`} />
                      {props.resultParrafos.map((p, i) => (
                        <Text key={i} color={i === props.resultParrafos.length - 1 ? "white" : "rgba(255,255,255,0.94)"}
                              fontSize={{ base: "sm", md: "md" }} lineHeight="1.9"
                              fontWeight={i === props.resultParrafos.length - 1 ? "600" : "400"} style={{ textShadow: INK }}>
                          {p}
                        </Text>
                      ))}
                      {props.next && (
                      <Flex gap={4} mt={3} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                        <Box as="button" onClick={() => navigate(props.next!.ruta)}
                             px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                             letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                             boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                             _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                          {props.next.label}
                        </Box>
                      </Flex>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </MBox>
            )}
          </AnimatePresence>

          {/* Volver a hacer — fuera del box, abajo a la derecha del todo */}
          {completo && (
            <Flex justify="flex-end" w="100%">
              <Box as="button" onClick={reiniciar}
                   display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                   bg="rgba(255,255,255,0.08)" color="rgba(255,255,255,0.8)" border="1px solid rgba(255,255,255,0.28)"
                   fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                   letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "rgba(255,255,255,0.16)", color: "white", borderColor: `${fisiologiaTxt}aa` }}>
                ↺ Volver a hacer
              </Box>
            </Flex>
          )}

          {/* Nota discreta al pie (aclaración didáctica) */}
          {props.notaPie && (
            <Text color="white" fontStyle="italic" textAlign="center" opacity={0.72}
                  fontSize={{ base: "2xs", md: "xs" }} maxW="600px" lineHeight="1.6" mt={2}
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.45)" }}>
              {props.notaPie}
            </Text>
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
