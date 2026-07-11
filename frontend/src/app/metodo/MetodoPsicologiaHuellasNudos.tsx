// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · HERIDAS (construir)  ·  9/16
//
//   Huella + Nudo + Necesidad no cubierta = Herida
//
// Tres columnas (huellas, nudos, necesidades no cubiertas): la persona toca las
// piezas que forman una misma herida. Al pulsar «He terminado esta herida» se
// abre un popup para ponerle nombre (con una raya y, debajo, lo seleccionado).
// Al guardar, la herida aparece —bajo un separador de mandala— como un box
// CUADRADO de su propio color, en una rejilla de 3 columnas.
//
// Persistencia: data.heridas = RelacionHuellaNudo[] (con `necesidades`).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { NudoEspiralIcon } from "../../components/metodo/NudoEspiralIcon";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import { HeridaGrid, MandalaDivider, colorHeridaIdx } from "../../components/metodo/HeridaGrid";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import {
  experienciaById,
  necesidadesNoCubiertas,
  type LineaDeVidaData,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const COL_H = { base: "340px", md: "430px", lg: "500px" } as const;
const SCROLL_SX = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${TINTA}66 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${TINTA}66`, borderRadius: "8px" },
};

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `h-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

/** Todas las huellas marcadas (ítems), aplanadas de todos los años. */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const out: string[] = [];
  const anos = d?.anos || {};
  for (const k of Object.keys(anos)) {
    const h = anos[k]?.huellas;
    if (Array.isArray(h)) for (const t of h) { const s = (t || "").trim(); if (s) out.push(s); }
  }
  return out;
}

// ◈ huella · ◇ necesidad · espiral nudo — todos en marrón.
const HuellaIcon = ({ size = 16, color = TINTA }: { size?: number; color?: string }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color }}>◈</Box>
);
const NecesidadIcon = ({ size = 16, color = TINTA }: { size?: number; color?: string }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color }}>◇</Box>
);

// Cabecera DENTRO del box (imagen propia + raya inferior).
function ColumnaHeaderBox({ icono, titulo, apoyo }: { icono: React.ReactNode; titulo: string; apoyo?: string }) {
  return (
    <Box flexShrink={0} position="relative" overflow="hidden" borderBottom={`1px solid ${TINTA}55`}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
      <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 3, md: 3.5 }}>
        <Flex direction="column" align="center" gap={1} textAlign="center">
          <Flex align="center" gap={2.5}>
            <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                 style={{ filter: `drop-shadow(0 1px 2px ${PAPEL})` }}>{icono}</Box>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.03em"
                  style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{titulo}</Text>
          </Flex>
          {apoyo && (
            <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.8} maxW="300px"
                  style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{apoyo}</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default function MetodoPsicologiaHuellasNudos() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");

  // Fuentes disponibles.
  const [huellas, setHuellas] = useState<string[]>([]);
  const [nudos, setNudos] = useState<string[]>([]);
  const [necesidades, setNecesidades] = useState<string[]>([]);

  // Herida en curso (selección) + heridas guardadas.
  const [selHuellas, setSelHuellas] = useState<string[]>([]);
  const [selNudos, setSelNudos] = useState<string[]>([]);
  const [selNec, setSelNec] = useState<string[]>([]);
  const [heridas, setHeridas] = useState<RelacionHuellaNudo[]>([]);

  const [nombreOpen, setNombreOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [guardadaFlash, setGuardadaFlash] = useState<string | null>(null);

  const dataRef = useRef<LineaDeVidaData>({});
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heridasRef = useRef<HTMLDivElement>(null);
  const montado = useRef(true);
  useLockBodyScroll(nombreOpen);

  useEffect(() => () => {
    montado.current = false;
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setHuellas(todasLasHuellas(d));
        setNudos(Array.isArray(d.nudos) ? d.nudos : []);
        setNecesidades(necesidadesNoCubiertas(d));
        setHeridas(Array.isArray(d.heridas) ? d.heridas.map((h) => ({ ...h, titulo: h.titulo ?? "" })) : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: RelacionHuellaNudo[]): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const data = { ...dataRef.current, heridas: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
      if (montado.current) setEstadoGuardado("ok");
      return true;
    } catch {
      if (montado.current) setEstadoGuardado("idle");
      return false;
    }
  };

  const toggle = (lista: string[], set: React.Dispatch<React.SetStateAction<string[]>>, t: string) =>
    set(lista.includes(t) ? lista.filter((x) => x !== t) : [...lista, t]);

  const totalSel = selHuellas.length + selNudos.length + selNec.length;
  // Color de la herida en curso = el que le tocará al guardarla (siguiente índice).
  const colorEnCurso = colorHeridaIdx(heridas.length);

  const guardarHerida = async () => {
    if (totalSel === 0) return;
    const titulo = nombre.trim() || "Herida sin título";
    const nueva: RelacionHuellaNudo = {
      id: nuevoId(), titulo, huellas: selHuellas, nudos: selNudos, necesidades: selNec, texto: "",
    };
    const next = [...heridas, nueva];
    setHeridas(next);
    setSelHuellas([]); setSelNudos([]); setSelNec([]);
    setNombre(""); setNombreOpen(false);
    setGuardadaFlash(titulo);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => { if (montado.current) setGuardadaFlash(null); }, 2800);
    // La rejilla está abajo del todo: baja hasta ella para que la nueva herida
    // se vea aparecer, sin tener que recargar ni buscarla a mano. Esperamos a que
    // la Reveal (delay 0.42s) haya montado la rejilla antes de hacer scroll.
    setTimeout(() => { if (montado.current) heridasRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, 500);
    await persistir(next);
  };

  const borrarHerida = async (id: string) => {
    const next = heridas.filter((h) => h.id !== id);
    setHeridas(next);
    await persistir(next);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const columnas: {
    key: "huella" | "nudo" | "nec";
    titulo: string; apoyo: string;
    icono: React.ReactNode; piezaIcono: React.ReactNode;
    items: string[]; sel: string[]; set: React.Dispatch<React.SetStateAction<string[]>>;
    vacio: { texto: string; accion: string; ruta: string };
  }[] = [
    {
      key: "huella", titulo: "Tus huellas", apoyo: "Las experiencias que marcaste.",
      icono: <HuellaIcon size={20} color={TINTA} />, piezaIcono: <HuellaIcon size={18} color={TINTA} />,
      items: huellas, sel: selHuellas, set: setSelHuellas,
      vacio: { texto: "Aún no has marcado huellas en tu línea de vida.", accion: "Ir a Huellas →", ruta: `/metodo/psicologia/${exp.id}/huellas` },
    },
    {
      key: "nec", titulo: "Necesidades no cubiertas", apoyo: "Lo que necesitabas y no recibiste.",
      icono: <NecesidadIcon size={20} color={TINTA} />, piezaIcono: <NecesidadIcon size={18} color={TINTA} />,
      items: necesidades, sel: selNec, set: setSelNec,
      vacio: { texto: "Aún no has marcado necesidades no cubiertas.", accion: "Ir a Necesidades →", ruta: `/metodo/psicologia/${exp.id}/necesidades` },
    },
    {
      key: "nudo", titulo: "Tus nudos", apoyo: "La creencia o conflicto que dejó.",
      icono: <NudoEspiralIcon size={20} color={TINTA} strokeWidth={1.7} opacity={0.9} />,
      piezaIcono: <NudoEspiralIcon size={18} color={TINTA} strokeWidth={1.7} opacity={0.9} />,
      items: nudos, sel: selNudos, set: setSelNudos,
      vacio: { texto: "Aún no has nombrado tus nudos.", accion: "Ir a Nudos →", ruta: `/metodo/psicologia/${exp.id}/nudos` },
    },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Heridas"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 9, total: 20 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Necesidades", onClick: () => navigate(`/metodo/psicologia/${exp.id}/necesidades`) }}
              next={{ label: "Tus heridas →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/heridas-lista`) }}
            />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
            <IntroRecorrido>
             Una experiencia que deja Huella puede dejar una necesidad emocional sin cubrir. Para dar sentido a ese dolor y evitar que vuelva a repetirse, la mente crea un Nudo: una creencia protectora que, aunque nace para ayudarnos, acaba limitando nuestra forma de vivir. La unión de la experiencia, la necesidad no cubierta y ese nudo constituye una Herida emocional.
            </IntroRecorrido>
            </Reveal>

            {/* ════════ TRES COLUMNAS DE FUENTES · aparecen de izquierda a derecha ════════ */}
            <RevealStagger w="100%" display="flex" flexDirection={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 6 }} alignItems="stretch" stagger={0.16} delayChildren={0.15}>
              {columnas.map((col) => (
                <RevealItem key={col.key} direction="up" distance={30} scaleFrom={0.96} duration={0.6} display="flex" flexDirection="column" flex="1" minW={0}>
                  <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
                    <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" h="100%">
                      <ColumnaHeaderBox icono={col.icono} titulo={col.titulo} apoyo={col.apoyo} />
                      <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX}>
                        {col.items.length === 0 ? (
                          <EstadoVacio texto={col.vacio.texto} accion={col.vacio.accion} onClick={() => navigate(col.vacio.ruta)} />
                        ) : (
                          <Flex direction="column" gap={2.5}>
                            {col.items.map((t, i) => (
                              <PiezaRect key={`${t}-${i}`} texto={t} activo={col.sel.includes(t)} colorSel={colorEnCurso}
                                         icono={col.piezaIcono} onTap={() => toggle(col.sel, col.set, t)} />
                            ))}
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </RevealItem>
              ))}
            </RevealStagger>

            {/* ════════ HERIDA EN CURSO + botón terminar ════════ */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={3} w="100%" maxW="920px">
              {totalSel === 0 ? (
                <Text color={PAPEL} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85} textAlign="center"
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
                  Toca huellas, nudos y necesidades para reunir una herida.
                </Text>
              ) : (
                <Flex wrap="wrap" gap={2} justify="center">
                  {selHuellas.map((t) => (
                    <Chip key={`sh-${t}`} tint={colorEnCurso} icon={<HuellaIcon size={13} color={TINTA} />} label={t}
                          onRemove={() => toggle(selHuellas, setSelHuellas, t)} />
                  ))}
                  {selNec.map((t) => (
                    <Chip key={`sq-${t}`} tint={colorEnCurso} icon={<NecesidadIcon size={13} color={TINTA} />} label={t}
                          onRemove={() => toggle(selNec, setSelNec, t)} />
                  ))}
                  {selNudos.map((t) => (
                    <Chip key={`sn-${t}`} tint={colorEnCurso} icon={<NudoEspiralIcon size={13} color={TINTA} strokeWidth={2} />} label={t}
                          onRemove={() => toggle(selNudos, setSelNudos, t)} />
                  ))}
                </Flex>
              )}

              <Flex align="center" justify="center" gap={3} wrap="wrap">
                <Box as="button" onClick={totalSel > 0 ? () => setNombreOpen(true) : undefined}
                     aria-disabled={totalSel === 0}
                     px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
                     bg={totalSel > 0 ? TINTA : `${TINTA}55`} border={`1.5px solid ${TINTA}`}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.04em" cursor={totalSel > 0 ? "pointer" : "not-allowed"} opacity={totalSel > 0 ? 1 : 0.7}
                     boxShadow={totalSel > 0 ? `0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a` : "none"} transition="all 0.18s"
                     _hover={totalSel > 0 ? { transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` } : {}}>
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>He terminado esta herida</Box>
                </Box>
                <AutoguardadoIndicador estado={estadoGuardado} color={PAPEL} />
              </Flex>

              {guardadaFlash && (
                <Flex align="center" justify="center" gap={2} px={4} py={2.5} borderRadius="full"
                      bg="rgba(63,157,107,0.16)" border="1px solid rgba(63,157,107,0.5)">
                  <Box as="span" color="#2f7d54" fontWeight="700">✓</Box>
                  <Text color={PAPEL} fontSize={{ base: "sm", md: "md" }} fontWeight="600"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
                    Herida «{guardadaFlash}» guardada
                  </Text>
                </Flex>
              )}
            </Flex>
            </Reveal>

            {/* ════════ SEPARADOR MANDALA + REJILLA DE HERIDAS ════════ */}
            {heridas.length > 0 && (
              <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.42} duration={0.75} w="100%">
              <>
                <MandalaDivider />
                <Flex ref={heridasRef} direction="column" align="center" gap={4} w="100%" scrollMarginTop="90px">
                  <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
                    Tus heridas
                  </Text>
                  <HeridaGrid heridas={heridas} onBorrar={(id) => void borrarHerida(id)} />
                </Flex>
              </>
              </Reveal>
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ════════ POPUP · «Ponle nombre a tu herida» ════════ */}
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
                <HeridaIcon size={22} color={TINTA} />
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                      style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}` }}>
                  Ponle nombre a tu herida
                </Text>
              </Flex>

              {/* Raya horizontal de separación */}
              <Box h="1px" w="70%" maxW="240px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              {/* Lo que has seleccionado */}
              <Flex wrap="wrap" gap={2} justify="center" my={6}>
                {selHuellas.map((t) => (
                  <Chip key={`ph-${t}`} tint={colorEnCurso} icon={<HuellaIcon size={13} color={TINTA} />} label={t}
                        onRemove={() => toggle(selHuellas, setSelHuellas, t)} />
                ))}
                {selNec.map((t) => (
                  <Chip key={`pq-${t}`} tint={colorEnCurso} icon={<NecesidadIcon size={13} color={TINTA} />} label={t}
                        onRemove={() => toggle(selNec, setSelNec, t)} />
                ))}
                {selNudos.map((t) => (
                  <Chip key={`pn-${t}`} tint={colorEnCurso} icon={<NudoEspiralIcon size={13} color={TINTA} strokeWidth={2} />} label={t}
                        onRemove={() => toggle(selNudos, setSelNudos, t)} />
                ))}
              </Flex>

              <Input
                autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && totalSel > 0) void guardarHerida(); }}
                placeholder="Ej.: La herida del abandono…"
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
                     _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>
                  Seguir eligiendo
                </Box>
                <Box as="button" onClick={() => void guardarHerida()} px={8} py={2.5} borderRadius="full"
                     bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                     boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>Guardar herida</Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <AyudaRecorrido pagina="heridas" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────────────────

function EstadoVacio({ texto, accion, onClick }: { texto: string; accion: string; onClick: () => void }) {
  return (
    <Flex direction="column" align="center" gap={3} px={4} py={8} w="100%">
      <Text color={TINTA} fontStyle="italic" textAlign="center" opacity={0.85} fontSize="sm"
            style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{texto}</Text>
      <Box as="button" onClick={onClick} px={5} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
           fontWeight="700" fontSize="sm" cursor="pointer">{accion}</Box>
    </Flex>
  );
}

// Pieza seleccionable: al seleccionar se tiñe con el color de la herida en curso.
function PiezaRect({ texto, activo, colorSel, icono, onTap }: {
  texto: string; activo: boolean; colorSel: string; icono: React.ReactNode; onTap: () => void;
}) {
  return (
    <Flex as="button" onClick={onTap} align="center" gap={3} px={4} py={3} borderRadius="lg" textAlign="left" w="100%"
          bg={activo ? colorSel : `${PAPEL}d9`} color={TINTA}
          border={`1.5px solid ${activo ? `${TINTA}66` : `${TINTA}33`}`}
          boxShadow={activo ? `0 0 14px ${AZUL}55` : "none"} cursor="pointer" transition="all 0.16s"
          _hover={{ transform: "translateY(-1px)", boxShadow: activo ? `0 0 18px ${AZUL}77` : `0 0 10px ${AZUL}33` }}>
      {icono}
      <Text flex="1" fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.3">{texto}</Text>
      {activo && <Box as="span" color={TINTA} fontWeight="700" flexShrink={0}>✓</Box>}
    </Flex>
  );
}

function Chip({ icon, label, onRemove, tint }: {
  icon: React.ReactNode; label: string; onRemove: () => void; tint?: string;
}) {
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={tint || `${TINTA}12`} color={TINTA} border={`1px solid ${TINTA}40`} boxShadow="none">
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={`${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title="Quitar">✕</Box>
    </Flex>
  );
}
