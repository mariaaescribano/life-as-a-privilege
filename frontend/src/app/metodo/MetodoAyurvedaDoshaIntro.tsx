import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { Brain, HeartPulse, Repeat, Salad, Scale, Sparkles } from "lucide-react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { DOSHA_INTRO, type DoshaKey, type DescubreIcon } from "../../hardCoded/metodo/doshaIntro";

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};

// Iconos (lucide) para «Lo que descubrirás», en lugar de emojis.
const DESCUBRE_ICON: Record<DescubreIcon, any> = {
  mente: Brain,
  cuerpo: HeartPulse,
  habitos: Repeat,
  alimentacion: Salad,
  equilibrio: Scale,
  dones: Sparkles,
};

// Mini-parser de **negrita** y *cursiva* dentro de un texto plano.
function parseRich(s: string): React.ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <Box as="span" key={i} fontWeight="700">{p.slice(2, -2)}</Box>;
    }
    if (p.startsWith("*") && p.endsWith("*")) {
      return <Box as="span" key={i} fontStyle="italic">{p.slice(1, -1)}</Box>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

// Separador horizontal elegante (rombo central + líneas degradadas), en marrón.
function Separador() {
  return (
    <Flex align="center" justify="center" gap={3} w="100%" my={1}>
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66)`} />
      <Box w="7px" h="7px" bg={`${ayurvedaTxt}99`} transform="rotate(45deg)" flexShrink={0} />
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-l, transparent, ${ayurvedaTxt}66)`} />
    </Flex>
  );
}

// Box de panel con el fondo de acuarela de Hinduismo y glow discreto (como el header).
function Panel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`}
    >
      <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
        {children}
      </Box>
    </Box>
  );
}

function CheckRow({ label, checked, onToggle, color }: { label: string; checked: boolean; onToggle: () => void; color: string }) {
  return (
    <Flex
      as="button"
      onClick={onToggle}
      align="center"
      gap={3}
      w="100%"
      textAlign="left"
      px={{ base: 4, md: 5 }}
      py={{ base: 3, md: 3.5 }}
      borderRadius="xl"
      bg={checked ? `${color}24` : "rgba(255,251,243,0.4)"}
      border={`1.5px solid ${checked ? color : `${TINTA}2a`}`}
      cursor="pointer"
      transition="all 0.16s"
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={{ bg: checked ? `${color}30` : "rgba(255,251,243,0.6)", borderColor: `${color}99` }}
    >
      <Box
        w="22px" h="22px"
        flexShrink={0}
        borderRadius="6px"
        border={`2px solid ${checked ? color : `${TINTA}66`}`}
        bg={checked ? color : "transparent"}
        display="flex" alignItems="center" justifyContent="center"
        transition="all 0.16s"
      >
        {checked && (
          <Box as="svg" viewBox="0 0 24 24" w="14px" h="14px" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </Box>
        )}
      </Box>
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.5">{label}</Text>
    </Flex>
  );
}

export default function MetodoAyurvedaDoshaIntro() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  // «¿Te reconoces?» es local: NO se guarda en BD.
  const [reconoces, setReconoces] = useState<string[]>([]);
  // La pregunta final SÍ se guarda. `guardado` desbloquea el botón de continuar.
  const [cambio, setCambio] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const dataRef = useRef<Record<string, any>>({});
  const finalRef = useRef<HTMLDivElement>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        // Prerrelleno: trae lo ya guardado (solo la pregunta final) para este dosha.
        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const slice = d?.doshaIntro?.[doshaKey] || {};
        const prev = typeof slice.cambio === "string" ? slice.cambio : "";
        setCambio(prev);
        setGuardado(prev.trim().length > 0); // si ya respondió antes, queda desbloqueado
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  // Guarda SOLO la pregunta final dentro de data.doshaIntro[dosha].cambio.
  const persist = async (cambioVal: string) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = {
        ...dataRef.current,
        doshaIntro: {
          ...(dataRef.current.doshaIntro || {}),
          [doshaKey]: { ...(dataRef.current.doshaIntro?.[doshaKey] || {}), cambio: cambioVal },
        },
      };
      await axios.patch(
        `${API_URL}/metodo-ayurveda/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = next;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const toggleReconoce = (op: string) => {
    setReconoces((prev) => (prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]));
  };

  const guardarFinal = async () => {
    await persist(cambio);
    setGuardado(true);
  };

  // Botón "Comenzar →": bloqueado hasta guardar. Si lo pulsan sin guardar, la
  // página baja hasta la pregunta final como indicación de que la rellenen.
  const irSiguiente = () => {
    if (!guardado) {
      finalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    navigate(`/metodo/ayurveda/dosha/${doshaKey}/comenzar`);
  };

  if (loading || !doshaKey) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const c = DOSHA_INTRO[doshaKey];

  // Dosha aún sin contenido: página de cortesía.
  if (!c) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" justify="center" align="center" px={6} py={20}>
          <Flex direction="column" align="center" w="100%" maxW="640px" gap={6}>
            <MetodoStepHeader
              icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
              title={<>Doṣha: <Box as="span" color={meta.color}>{meta.label}</Box></>}
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={0}
              prev={{ label: "← Energías", onClick: () => navigate("/metodo/ayurveda/tarjetas") }}
              extra={ilustracionesBtn}
            />
            <Panel color={meta.color}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={3} style={{ textShadow: INK_SHADOW }}>
                Estamos preparando esta sección
              </Text>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} textAlign="center" lineHeight="1.8">
                La introducción a {meta.label} estará disponible muy pronto.
              </Text>
            </Panel>
          </Flex>
        </Flex>
        {ilustracionesModal}
        <SiteFooter />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 7 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title={<>Doṣha: <Box as="span" color={meta.color}>{meta.label}</Box></>}
            pageLabel="1/7"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Energías", onClick: () => { void persist(cambio); navigate("/metodo/ayurveda/tarjetas"); } }}
            extra={ilustracionesBtn}
            next={{
              label: "Descúbrete →",
              onClick: irSiguiente,
              disabled: !guardado,
              disabledTooltip: "Guarda tu respuesta para continuar.",
            }}
          />
          </Reveal>

          {/* ── HERO (primer box: entra al montar, siempre visible) ── */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                Bienvenido a tu naturaleza
              </Text>
              <Separador />
              <Flex direction="column" gap={3.5} maxW="640px">
                {c.intro.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">
                    {parseRich(p)}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Panel>
          </Reveal>

          {/* ── PRINCIPIO DEL DOSHA ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" gap={3.5}>
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" textAlign="center"
                    style={{ textShadow: INK_SHADOW }}>
                {parseRich(c.principio[0])}
              </Text>
              <Separador />
              {c.principio.slice(1).map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">
                  {parseRich(p)}
                </Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── ¿TE RECONOCES? (casillas — NO se guardan) ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
              {c.reconoces.titulo}
            </Text>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} mb={5}>
              {c.reconoces.intro}
            </Text>
            <RevealStagger inView display="flex" flexDirection="column" gap={3} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.reconoces.opciones.map((op) => (
                <RevealItem key={op} direction="up" distance={14} duration={0.45} w="100%">
                  <CheckRow
                    label={op}
                    color={meta.color}
                    checked={reconoces.includes(op)}
                    onToggle={() => toggleReconoce(op)}
                  />
                </RevealItem>
              ))}
            </RevealStagger>
            <Flex direction="column" gap={2.5} mt={5}>
              {c.reconoces.cierre.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">
                  {parseRich(p)}
                </Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── LO QUE DESCUBRIRÁS ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center" mb={2} style={{ textShadow: INK_SHADOW }}>
              {c.descubriras.titulo}
            </Text>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} textAlign="center" mb={6}>
              {c.descubriras.intro}
            </Text>
            <RevealStagger inView display="flex" flexDirection="column" gap={3.5} stagger={0.08} delayChildren={0.05} amount={0.1}>
              {c.descubriras.items.map((it, i) => {
                const ItemIcon = DESCUBRE_ICON[it.icon];
                return (
                  <RevealItem key={i} direction="up" distance={16} duration={0.5} w="100%">
                  <Flex
                    align="center"
                    gap={4}
                    px={{ base: 4, md: 5 }}
                    py={{ base: 3.5, md: 4 }}
                    borderRadius="xl"
                    bg={`${meta.color}0e`}
                    border={`1px solid ${meta.color}33`}
                    sx={{ backdropFilter: "blur(4px)" }}
                  >
                    <Flex
                      align="center" justify="center" flexShrink={0}
                      w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                      borderRadius="full"
                      bg={`${meta.color}1c`}
                      border={`1px solid ${meta.color}66`}
                    >
                      <ItemIcon size={22} color={ayurvedaTxt} strokeWidth={1.8} />
                    </Flex>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(it.texto)}</Text>
                  </Flex>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* ── PREGUNTA FINAL (texto libre · SE GUARDA) ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Box ref={finalRef} w="100%">
            <Panel color={meta.color}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                {c.preguntaFinal.titulo}
              </Text>
              <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={4}>
                {c.preguntaFinal.pregunta}
              </Text>
              <Textarea
                value={cambio}
                onChange={(e) => { setCambio(e.target.value); setGuardado(false); }}
                placeholder="Escríbela aquí…"
                w="100%"
                minH={{ base: "120px", md: "150px" }}
                bg="rgba(255,251,243,0.45)"
                border={`1px solid ${meta.color}55`}
                color={TINTA}
                borderRadius="xl"
                px={{ base: 5, md: 6 }}
                py={{ base: 4, md: 5 }}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.8"
                sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                _hover={{ borderColor: `${meta.color}88` }}
                _focus={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}44`, bg: "rgba(255,251,243,0.6)" }}
              />
              <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={3}>
                {c.preguntaFinal.nota}
              </Text>

              <Flex justify="flex-end" mt={6}>
                <Box
                  as="button"
                  onClick={guardando ? undefined : guardarFinal}
                  minW="180px"
                  px={9}
                  py={3}
                  borderRadius="full"
                  bg={meta.color}
                  color="#fff"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.05em"
                  cursor={guardando ? "wait" : "pointer"}
                  boxShadow={`0 0 18px ${meta.color}55`}
                  transition="all 0.2s"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 28px ${meta.color}88` }}
                >
                  {guardando ? "Guardando…" : guardado ? "Guardado ✓" : "Guardar"}
                </Box>
              </Flex>
            </Panel>
          </Box>
          </Reveal>

          {/* ── CIERRE ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={5}>
              {c.cierre.slice(0, -1).map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
                  {parseRich(p)}
                </Text>
              ))}

              {/* "Comencemos." como botón: bloqueado hasta guardar la pregunta final.
                  Si lo pulsan sin guardar, baja hasta la pregunta (sin subir al header). */}
              <Box
                as="button"
                onClick={irSiguiente}
                mt={1}
                px={{ base: 10, md: 14 }}
                py={{ base: 3, md: 3.5 }}
                borderRadius="full"
                bg={guardado ? meta.color : `${meta.color}55`}
                color="#fff"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.06em"
                cursor={guardado ? "pointer" : "not-allowed"}
                opacity={guardado ? 1 : 0.55}
                boxShadow={guardado ? `0 0 26px ${meta.color}88` : "none"}
                transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                _hover={{ transform: "translateY(-2px)", boxShadow: guardado ? `0 0 34px ${meta.color}aa` : `0 0 18px ${meta.color}55` }}
              >
                Descúbrete →
              </Box>

              {!guardado && (
                <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                  Guarda tu respuesta de arriba para continuar.
                </Text>
              )}
            </Flex>
          </Panel>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />

      <SiteFooter />
    </Box>
  );
}
