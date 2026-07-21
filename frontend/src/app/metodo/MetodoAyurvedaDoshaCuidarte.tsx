import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Check, AlertTriangle } from "lucide-react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { AyurvedaPanel as Panel } from "../../components/metodo/AyurvedaPanel";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { DOSHA_CUIDARTE } from "../../hardCoded/metodo/doshaCuidarte";
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
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(texto)}</Text>
    </Flex>
  );
}

function SaborRow({ texto, tipo, color }: { texto: string; tipo: "favorable" | "moderar"; color: string }) {
  const tono = tipo === "favorable" ? color : "#b9770e";
  return (
    <Flex align="center" gap={3}>
      <Flex align="center" justify="center" flexShrink={0} w="26px" h="26px" borderRadius="full"
            bg={`${tono}1f`} border={`1px solid ${tono}66`}>
        {tipo === "favorable" ? <Check size={15} color={tono} strokeWidth={2.6} /> : <AlertTriangle size={14} color={tono} strokeWidth={2.2} />}
      </Flex>
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6">{texto}</Text>
    </Flex>
  );
}

// Casilla interactiva (local). `tono` controla el color del marcado.
function CheckRow({ label, checked, onToggle, tono }: { label: string; checked: boolean; onToggle: () => void; tono: string }) {
  return (
    <Flex
      as="button"
      onClick={onToggle}
      align="center"
      gap={3}
      w="100%"
      textAlign="left"
      px={{ base: 4, md: 5 }}
      py={{ base: 2.5, md: 3 }}
      borderRadius="xl"
      bg={checked ? `${tono}24` : "rgba(255,251,243,0.4)"}
      border={`1.5px solid ${checked ? tono : `${TINTA}2a`}`}
      cursor="pointer"
      transition="all 0.16s"
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={{ bg: checked ? `${tono}30` : "rgba(255,251,243,0.6)", borderColor: `${tono}99` }}
    >
      <Box
        w="22px" h="22px" flexShrink={0} borderRadius="6px"
        border={`2px solid ${checked ? tono : `${TINTA}66`}`}
        bg={checked ? tono : "transparent"}
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

export default function MetodoAyurvedaDoshaCuidarte() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  // Cajas interactivas: se guardan en BD (autoguardado al marcar).
  const [desequilibranSel, setDesequilibranSel] = useState<string[]>([]);
  const [equilibranSel, setEquilibranSel] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const dataRef = useRef<Record<string, any>>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }
        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const slice = d?.doshaCuidarte?.[doshaKey] || {};
        if (Array.isArray(slice.desequilibranSel)) setDesequilibranSel(slice.desequilibranSel);
        if (Array.isArray(slice.equilibranSel)) setEquilibranSel(slice.equilibranSel);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, doshaKey]);

  // Autoguardado: persiste ambas listas dentro de doshaCuidarte[dosha], sin pisar
  // la reflexión/compromiso que guarda la página de Estilo de Vida.
  const persist = async (deseq: string[], equil: string[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = {
        ...dataRef.current,
        doshaCuidarte: {
          ...(dataRef.current.doshaCuidarte || {}),
          [doshaKey]: { ...(dataRef.current.doshaCuidarte?.[doshaKey] || {}), desequilibranSel: deseq, equilibranSel: equil },
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

  const toggleDeseq = (op: string) => {
    const next = desequilibranSel.includes(op) ? desequilibranSel.filter((x) => x !== op) : [...desequilibranSel, op];
    setDesequilibranSel(next);
    void persist(next, equilibranSel);
  };
  const toggleEquil = (op: string) => {
    const next = equilibranSel.includes(op) ? equilibranSel.filter((x) => x !== op) : [...equilibranSel, op];
    setEquilibranSel(next);
    void persist(desequilibranSel, next);
  };

  if (loading || !doshaKey) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const c = DOSHA_CUIDARTE[doshaKey];

  const irEstilo = () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/estilo`);

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
              prev={{ label: "← Equilibrio", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/desequilibrio`) }}
              extra={ilustracionesBtn}
            />
            <Panel color={meta.color}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={3} style={{ textShadow: INK_SHADOW }}>
                Estamos preparando esta sección
              </Text>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} textAlign="center" lineHeight="1.8">
                Tu alimentación ideal para {meta.label} estará disponible muy pronto.
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
            pageLabel="5/7"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Equilibrio", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/desequilibrio`) }}
            extra={ilustracionesBtn}
            next={{ label: "Estilo de Vida →", onClick: irEstilo }}
          />
          </Reveal>

          {/* HERO · Alimentación (primer box: entra al montar, siempre visible) */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                {c.alimTitulo}
              </Text>
              <Separador />
              <Flex direction="column" gap={3.5} maxW="640px">
                {c.alimIntro.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">{parseRich(p)}</Text>
                ))}
              </Flex>
            </Flex>
          </Panel>
          </Reveal>

          {/* Sabores */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.sabores.titulo}</SeccionTitulo>
            <Flex direction="column" gap={2} mb={5}>
              {c.sabores.intro.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">{parseRich(p)}</Text>
              ))}
            </Flex>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} mb={5} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.sabores.favorables.map((s, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><SaborRow texto={s} tipo="favorable" color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} mb={3}>{c.sabores.moderarIntro}</Text>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.sabores.moderar.map((s, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><SaborRow texto={s} tipo="moderar" color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* Caja interactiva · comidas de hoy que te desequilibran */}
          {c.desequilibran && (
            <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
            <Panel color={meta.color}>
              <SeccionTitulo color={meta.color}>{c.desequilibran.titulo}</SeccionTitulo>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={5}>
                {c.desequilibran.intro}
              </Text>
              <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
                {c.desequilibran.opciones.map((op) => (
                  <RevealItem key={op} direction="up" distance={14} duration={0.45} w="100%">
                    <CheckRow label={op} tono="#b9770e" checked={desequilibranSel.includes(op)} onToggle={() => toggleDeseq(op)} />
                  </RevealItem>
                ))}
              </RevealStagger>
              <Text color={`${TINTA}99`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" mt={4}>
                {guardando ? "Guardando…" : "Tus selecciones se guardan automáticamente."}
              </Text>
            </Panel>
            </Reveal>
          )}

          {/* Lo que aumenta */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.alimentosAumentan.titulo}</SeccionTitulo>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.alimentosAumentan.items.map((it, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><ListItem texto={it} color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* Cómo comes */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.comoComes.titulo}</SeccionTitulo>
            <Flex direction="column" gap={2} mb={4}>
              {c.comoComes.intro.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">{parseRich(p)}</Text>
              ))}
            </Flex>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} mb={4} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.comoComes.items.map((it, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><ListItem texto={it} color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">{parseRich(c.comoComes.cierre)}</Text>
          </Panel>
          </Reveal>

          {/* Alimentos que sientan mejor */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.alimentosBuenos.titulo}</SeccionTitulo>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.alimentosBuenos.items.map((it, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><ListItem texto={it} color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* Día de ejemplo */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{c.diaEjemplo.titulo}</SeccionTitulo>
            <RevealStagger inView display="flex" flexDirection="column" gap={4} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {c.diaEjemplo.comidas.map((m, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%">
                <Box px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} borderRadius="xl"
                     bg="rgba(255,251,243,0.4)" border={`1px solid ${meta.color}2a`} sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color={meta.color} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.1em" textTransform="uppercase" mb={1.5}>
                    {m.momento}
                  </Text>
                  {m.texto.map((t, j) => (
                    <Text key={j} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{t}</Text>
                  ))}
                </Box>
                </RevealItem>
              ))}
            </RevealStagger>
          </Panel>
          </Reveal>

          {/* Caja interactiva · alimentos que te equilibran y puedes tomar hoy */}
          {c.equilibran && (
            <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
            <Panel color={meta.color}>
              <SeccionTitulo color={meta.color}>{c.equilibran.titulo}</SeccionTitulo>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={5}>
                {c.equilibran.intro}
              </Text>
              <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
                {c.equilibran.opciones.map((op) => (
                  <RevealItem key={op} direction="up" distance={14} duration={0.45} w="100%">
                    <CheckRow label={op} tono={meta.color} checked={equilibranSel.includes(op)} onToggle={() => toggleEquil(op)} />
                  </RevealItem>
                ))}
              </RevealStagger>
              <Text color={`${TINTA}99`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" mt={4}>
                {guardando ? "Guardando…" : "Tus selecciones se guardan automáticamente."}
              </Text>
            </Panel>
            </Reveal>
          )}

          {/* Cierre alimentación */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={2}>
              {c.alimCierre.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.6">{parseRich(p)}</Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* Continuar → Estilo de Vida */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%" display="flex" justifyContent="center">
          <Box
            as="button"
            onClick={irEstilo}
            mt={1}
            px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
            bg={meta.color} color="#fff"
            fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
            cursor="pointer"
            boxShadow={`0 0 26px ${meta.color}88`} transition="all 0.2s"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 34px ${meta.color}aa` }}
          >
            Estilo de Vida →
          </Box>
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
