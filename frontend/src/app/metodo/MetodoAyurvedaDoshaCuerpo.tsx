import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { AyurvedaPanel as Panel } from "../../components/metodo/AyurvedaPanel";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { useT } from "../../i18n";
import { useDoshaCuerpo } from "../../hardCoded/metodo/useDoshaContenido";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};

function parseRich(s: string): React.ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <Box as="span" key={i} fontWeight="700">{p.slice(2, -2)}</Box>;
    if (p.startsWith("*") && p.endsWith("*")) return <Box as="span" key={i} fontStyle="italic">{p.slice(1, -1)}</Box>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Separador() {
  return (
    <Flex align="center" justify="center" gap={3} w="100%" my={1}>
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66)`} />
      <Box w="7px" h="7px" bg={`${ayurvedaTxt}99`} transform="rotate(45deg)" flexShrink={0} />
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-l, transparent, ${ayurvedaTxt}66)`} />
    </Flex>
  );
}

// El panel común (ahora animado y «vivo») vive en components/metodo/AyurvedaPanel.tsx
// y se importa arriba como `Panel`.

// Título de sección con marcador-rombo (color del dosha) y subrayado fino (marrón).
function SeccionTitulo({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box mb={4}>
      <Flex align="center" gap={3} mb={2.5}>
        <Box w="9px" h="9px" bg={color} transform="rotate(45deg)" flexShrink={0} boxShadow={`0 0 10px ${color}88`} />
        <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
          {children}
        </Text>
      </Flex>
      <Box h="1px" w="100%" bgGradient={`linear(to-r, ${ayurvedaTxt}aa, ${ayurvedaTxt}33, transparent)`} />
    </Box>
  );
}

function ListItem({ texto, color }: { texto: string; color: string }) {
  return (
    <Flex align="flex-start" gap={3}>
      <Box flexShrink={0} mt="9px" w="7px" h="7px" borderRadius="full" bg={color} />
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{texto}</Text>
    </Flex>
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
        w="22px" h="22px" flexShrink={0} borderRadius="6px"
        border={`2px solid ${checked ? color : `${TINTA}66`}`}
        bg={checked ? color : "transparent"}
        display="flex" alignItems="center" justifyContent="center" transition="all 0.16s"
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

export default function MetodoAyurvedaDoshaCuerpo() {
  const t = useT();
  const DOSHA_CUERPO = useDoshaCuerpo();
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  const [reconoces, setReconoces] = useState<string[]>([]); // local, no se guarda
  const [reflexion, setReflexion] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const dataRef = useRef<Record<string, any>>({});
  const reflexionRef = useRef<HTMLDivElement>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const slice = d?.doshaCuerpo?.[doshaKey] || {};
        const prev = typeof slice.reflexion === "string" ? slice.reflexion : "";
        setReflexion(prev);
        setGuardado(prev.trim().length > 0);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  const persist = async (val: string) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = {
        ...dataRef.current,
        doshaCuerpo: {
          ...(dataRef.current.doshaCuerpo || {}),
          [doshaKey]: { ...(dataRef.current.doshaCuerpo?.[doshaKey] || {}), reflexion: val },
        },
      };
      await axios.patch(`${API_URL}/metodo-ayurveda/${userId}`, { data: next }, { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = next;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const toggleReconoce = (op: string) =>
    setReconoces((prev) => (prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]));

  const guardarReflexion = async () => {
    await persist(reflexion);
    // Guardar vacío no desbloquea (el Índice exige contenido).
    setGuardado(reflexion.trim().length > 0);
  };

  const irSiguiente = () => {
    if (!guardado) {
      reflexionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    navigate(`/metodo/ayurveda/dosha/${doshaKey}/desequilibrio`);
  };

  if (loading || !doshaKey) {
    return <AyurvedaLoading />;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const c = DOSHA_CUERPO[doshaKey];

  if (!c) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" justify="center" align="center" px={6} py={20}>
          <Flex direction="column" align="center" w="100%" maxW="640px" gap={6}>
            <MetodoStepHeader
              icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
              title={<>{t("metodo.ayur.doshaRotulo")} <Box as="span" color={meta.color}>{meta.label}</Box></>}
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={0}
              prev={{ label: `← ${t("metodo.ayur.paso.descubrete")}`, onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/comenzar`) }}
              extra={ilustracionesBtn}
            />
            <Panel color={meta.color}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={3} style={{ textShadow: INK_SHADOW }}>
                {t("metodo.ayur.preparando")}
              </Text>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} textAlign="center" lineHeight="1.8">
                «Así funciona tu cuerpo» para {meta.label} estará disponible muy pronto.
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
            title={<>{t("metodo.ayur.doshaRotulo")} <Box as="span" color={meta.color}>{meta.label}</Box></>}
            pageLabel="3/7"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: `← ${t("metodo.ayur.paso.descubrete")}`, onClick: () => { void persist(reflexion); navigate(`/metodo/ayurveda/dosha/${doshaKey}/comenzar`); } }}
            extra={ilustracionesBtn}
            next={{ label: `${t("metodo.ayur.paso.equilibrio")} →`, onClick: irSiguiente, disabled: !guardado, disabledTooltip: t("metodo.ayur.guardaReflexionCorto") }}
          />
          </Reveal>

          {/* ── HERO (primer box: entra al montar, siempre visible) ── */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                {c.titulo}
              </Text>
              <Separador />
              <Flex direction="column" gap={3.5} maxW="640px">
                {c.intro.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">{parseRich(p)}</Text>
                ))}
              </Flex>
            </Flex>
          </Panel>
          </Reveal>

          {/* ── SECCIONES (Tu energía, Tu digestión, Tu descanso…) ── */}
          {c.secciones.map((sec, si) => (
            <Reveal inView key={si} direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
            <Panel key={si} color={meta.color}>
              <SeccionTitulo color={meta.color}>{sec.titulo}</SeccionTitulo>
              <Flex direction="column" gap={3}>
                {sec.parrafos.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">{parseRich(p)}</Text>
                ))}
              </Flex>
            </Panel>
            </Reveal>
          ))}

          {/* ── TU CUERPO (lista) ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.cuerpo.titulo}</SeccionTitulo>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} mb={4}>{c.cuerpo.intro}</Text>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} mb={4} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.cuerpo.items.map((it, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><ListItem texto={it} color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">{parseRich(c.cuerpo.cierre)}</Text>
          </Panel>
          </Reveal>

          {/* ── ¿TE RECONOCES? (local) ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.reconoces.titulo}</SeccionTitulo>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} mb={5}>{c.reconoces.intro}</Text>
            <RevealStagger inView display="flex" flexDirection="column" gap={3} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.reconoces.opciones.map((op) => (
                <RevealItem key={op} direction="up" distance={14} duration={0.45} w="100%">
                  <CheckRow label={op} color={meta.color} checked={reconoces.includes(op)} onToggle={() => toggleReconoce(op)} />
                </RevealItem>
              ))}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* ── LO QUE EL AYURVEDA QUIERE QUE RECUERDES ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.recuerda.titulo}</SeccionTitulo>
            <Flex direction="column" gap={3}>
              {c.recuerda.parrafos.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">{parseRich(p)}</Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── REFLEXIÓN (texto libre · SE GUARDA) ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Box ref={reflexionRef} w="100%">
            <Panel color={meta.color}>
              <SeccionTitulo color={meta.color}>{c.reflexion.titulo}</SeccionTitulo>
              <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={4}>{c.reflexion.pregunta}</Text>
              <Textarea
                value={reflexion}
                onChange={(e) => { setReflexion(e.target.value); setGuardado(false); }}
                placeholder={t("metodo.ayur.escribela")}
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
              <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={3}>{c.reflexion.nota}</Text>
              <Flex justify="flex-end" mt={6}>
                <Box
                  as="button"
                  onClick={guardando ? undefined : guardarReflexion}
                  minW="180px" px={9} py={3} borderRadius="full"
                  bg={meta.color} color="#fff"
                  fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
                  cursor={guardando ? "wait" : "pointer"}
                  boxShadow={`0 0 18px ${meta.color}55`} transition="all 0.2s"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 28px ${meta.color}88` }}
                >
                  {guardando ? "Guardando…" : guardado ? "Guardado ✓" : "Guardar"}
                </Box>
              </Flex>
            </Panel>
          </Box>
          </Reveal>

          {/* ── CIERRE + Continuar ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={5}>
              {c.cierre.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(p)}</Text>
              ))}
              <Box
                as="button"
                onClick={irSiguiente}
                mt={1}
                px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                bg={guardado ? meta.color : `${meta.color}55`} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
                cursor={guardado ? "pointer" : "not-allowed"} opacity={guardado ? 1 : 0.55}
                boxShadow={guardado ? `0 0 26px ${meta.color}88` : "none"} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                display="inline-flex" alignItems="center" gap={2.5}
                _hover={{ transform: "translateY(-2px)", boxShadow: guardado ? `0 0 34px ${meta.color}aa` : `0 0 18px ${meta.color}55` }}
              >
                {`${t("metodo.ayur.paso.equilibrio")} →`}
              </Box>
              {!guardado && (
                <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                  {t("metodo.ayur.guardaReflexion")}
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
