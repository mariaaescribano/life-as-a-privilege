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
import { BotonCompania } from "../../components/global/BotonCompania";
import {
  API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon,
} from "../../GlobalVariables";
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

// ── Ficha del sistema en la bandeja (foto circular + nombre; se toca para colocar) ──
function SistemaFicha({ sistema, colocado, onColocar }: {
  sistema: Sistema; colocado: boolean; onColocar: () => void;
}) {
  return (
    <MBox
      as="button"
      onClick={colocado ? undefined : onColocar}
      whileHover={colocado ? undefined : { y: -3, scale: 1.04 }}
      whileTap={colocado ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      display="flex" flexDirection="column" alignItems="center" gap={1.5}
      cursor={colocado ? "default" : "pointer"}
      opacity={colocado ? 0.4 : 1}
      w={{ base: "72px", md: "92px" }}
      flexShrink={0}
      style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <Box position="relative">
        <SistemaFoto sistema={sistema} size={{ base: "58px", md: "74px" }} />
        {colocado && (
          <Flex position="absolute" inset={0} align="center" justify="center" borderRadius="full"
                bg="rgba(0,0,0,0.45)">
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w={{ base: "22px", md: "26px" }} h={{ base: "22px", md: "26px" }} fill={fisiologiaTxt}
                 style={{ filter: `drop-shadow(0 0 6px ${fisiologiaTxt})` }}>
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </Box>
          </Flex>
        )}
      </Box>
      <Text color="white" fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700" lineHeight="1.15"
            textAlign="center" letterSpacing="0.02em" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
        {sistema.label}
      </Text>
    </MBox>
  );
}

// ── Posición (en %) de un sistema en el anillo del círculo ───────────────────
function posEnAnillo(i: number, total: number): { x: number; y: number } {
  const ang = (i / total) * Math.PI * 2 - Math.PI / 2; // empieza arriba
  return { x: 50 + Math.cos(ang) * 37, y: 50 + Math.sin(ang) * 37 };
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaOrganismo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [colocados, setColocados] = useState<string[]>([]); // keys en orden de colocación
  const [completo, setCompleto] = useState(false);
  const [frase, setFrase] = useState<string | null>(null);
  const [cuerpoOk, setCuerpoOk] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  const total = SISTEMAS.length;

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
          if (dataRef.current?.organismo_hecho) { setColocados(SISTEMAS.map((s) => s.key)); setCompleto(true); }
        } catch { /* sin fila todavía */ }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const guardarHecho = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
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

  const reiniciar = () => { setColocados([]); setCompleto(false); setFrase(null); };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const colocadosSet = new Set(colocados);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

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
            next={{ label: "Niveles →", onClick: () => navigate("/metodo/fisiologia/niveles") }}
          />

          {!completo && (
            <MBox initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} textAlign="center">
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Construye un ser humano
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                    maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Ve dándole su lugar a cada sistema. Uno a uno, irás formando un cuerpo entero.
              </Text>
            </MBox>
          )}

          <AnimatePresence mode="wait">
            {!completo ? (
              // ── FASE A · dos boxes: bandeja de sistemas (izq) + círculo (der) ──
              <MBox key="montaje" w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}>
                <Flex direction={{ base: "column-reverse", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* IZQUIERDA · todos los sistemas */}
                  <PanelBox flex={{ base: "1 1 auto", md: "0 0 44%" }}>
                    <Box px={{ base: 4, md: 6 }} py={{ base: 5, md: 7 }}>
                      <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                            letterSpacing="0.12em" textTransform="uppercase" textAlign="center" mb={4}
                            style={{ textShadow: INK }}>
                        Los sistemas · {colocados.length}/{total}
                      </Text>
                      <Flex wrap="wrap" justify="center" gap={{ base: 3, md: 4 }}>
                        {SISTEMAS.map((s) => (
                          <SistemaFicha key={s.key} sistema={s} colocado={colocadosSet.has(s.key)}
                                        onColocar={() => colocar(s)} />
                        ))}
                      </Flex>
                    </Box>
                  </PanelBox>

                  {/* DERECHA · el círculo donde se van manifestando */}
                  <PanelBox flex="1">
                    <Flex direction="column" align="center" justify="center" h="100%"
                          px={{ base: 5, md: 7 }} py={{ base: 7, md: 8 }} gap={5}>
                      {/* Círculo de ensamblaje */}
                      <Box position="relative" w={{ base: "260px", md: "320px" }} h={{ base: "260px", md: "320px" }}
                           flexShrink={0}>
                        <Box position="absolute" inset="0" borderRadius="full" pointerEvents="none"
                             border={`1.5px dashed ${fisiologiaTxt}55`}
                             animation={`${pulse} 3.4s ease-in-out infinite`} />
                        <Box position="absolute" inset="12%" borderRadius="full" pointerEvents="none"
                             sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 48%, #05040a 100%)",
                                   boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 26px ${fisiologiaTxt}22` }} />

                        {/* sistemas colocados, en anillo */}
                        {colocados.map((key, i) => {
                          const s = SISTEMAS.find((x) => x.key === key)!;
                          const p = posEnAnillo(i, total);
                          return (
                            <MBox key={key} position="absolute" left={`${p.x}%`} top={`${p.y}%`}
                                  transform="translate(-50%,-50%)"
                                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                              <SistemaFoto sistema={s} size={{ base: "40px", md: "52px" }} />
                            </MBox>
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

                      {/* Frase «memorable» del último sistema colocado */}
                      <Box minH={{ base: "64px", md: "72px" }} display="flex" alignItems="center" justifyContent="center">
                        <AnimatePresence mode="wait">
                          {frase && (
                            <MBox key={frase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }}>
                              <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                                    textAlign="center" lineHeight="1.6" maxW="440px"
                                    style={{ textShadow: `0 1px 8px rgba(0,0,0,0.6), 0 0 18px ${fisiologiaTxt}44` }}>
                                «{frase}»
                              </Text>
                            </MBox>
                          )}
                        </AnimatePresence>
                      </Box>
                    </Flex>
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
                      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                            style={{ textShadow: INK }}>
                        Has construido un ser humano.
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                           bgGradient={`linear(to-r, ${fisiologiaTxt}aa, transparent)`} />
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                            style={{ textShadow: INK }}>
                        Todos los <b>sistemas</b>, funcionando en armonía, forman un <b>organismo</b> completo.
                      </Text>
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                            style={{ textShadow: INK }}>
                        Has subido desde una sola partícula: átomos, moléculas, células, tejidos, órganos y sistemas.
                      </Text>
                      <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="600" lineHeight="1.7"
                            style={{ textShadow: INK }}>
                        Y ese organismo entero, vivo y en marcha en este mismo instante, <b>eres tú</b>.
                      </Text>

                      <Flex gap={4} mt={3} wrap="wrap" justify={{ base: "center", md: "flex-start" }} align="center">
                        <Box as="button" onClick={() => navigate("/metodo/fisiologia/niveles")}
                             px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                             letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                             boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                             _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                          Volver a los niveles →
                        </Box>
                        <Box as="button" onClick={reiniciar}
                             display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                             bg="rgba(255,255,255,0.08)" color="rgba(255,255,255,0.8)" border="1px solid rgba(255,255,255,0.28)"
                             fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                             letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                             _hover={{ bg: "rgba(255,255,255,0.16)", color: "white", borderColor: `${fisiologiaTxt}aa` }}>
                          ↺ Volver a hacer
                        </Box>
                      </Flex>
                    </Flex>
                  </PanelBox>
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
