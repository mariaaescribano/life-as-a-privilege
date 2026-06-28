import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { DOSHA_INTRO, type DoshaKey } from "../../hardCoded/metodo/doshaIntro";

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaTxt}`;
const GLOW = `0 6px 26px rgba(0,0,0,0.22), 0 0 18px ${ayurvedaTxt}1a`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
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

// Box de panel con el fondo de acuarela de Hinduismo.
function Panel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${color}33`}
      boxShadow={GLOW}
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
  const [expectativas, setExpectativas] = useState<string[]>([]);
  const [reconoces, setReconoces] = useState<string[]>([]);
  const [cambio, setCambio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);
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
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        // Prerrelleno: trae lo ya guardado para este dosha.
        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const slice = d?.doshaIntro?.[doshaKey] || {};
        setExpectativas(Array.isArray(slice.expectativas) ? slice.expectativas : []);
        setReconoces(Array.isArray(slice.reconoces) ? slice.reconoces : []);
        setCambio(typeof slice.cambio === "string" ? slice.cambio : "");
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  // Guarda el estado de este dosha dentro de data.doshaIntro[dosha].
  const persist = async (snap: { expectativas: string[]; reconoces: string[]; cambio: string }) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = {
        ...dataRef.current,
        doshaIntro: {
          ...(dataRef.current.doshaIntro || {}),
          [doshaKey]: { ...snap },
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

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    otros: { expectativas?: string[]; reconoces?: string[] },
  ) => {
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
    setList(next);
    setGuardadoOk(false);
    void persist({
      expectativas: otros.expectativas ?? next,
      reconoces: otros.reconoces ?? next,
      cambio,
    });
  };

  const guardarTodo = async () => {
    await persist({ expectativas, reconoces, cambio });
    setGuardadoOk(true);
  };

  if (loading || !doshaKey) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const c = DOSHA_INTRO[doshaKey];

  // Dosha aún sin contenido (Pitta / Kapha): página de cortesía.
  if (!c) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" justify="center" align="center" px={6} py={20}>
          <Flex direction="column" align="center" w="100%" maxW="640px" gap={6}>
            <MetodoStepHeader
              icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
              title={meta.label}
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={0}
              prev={{ label: "← Volver a las tarjetas", onClick: () => navigate("/metodo/ayurveda/tarjetas") }}
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

          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title="Tu naturaleza"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Volver a las tarjetas", onClick: () => { void persist({ expectativas, reconoces, cambio }); navigate("/metodo/ayurveda/tarjetas"); } }}
            extra={ilustracionesBtn}
          />

          {/* ── HERO ── */}
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Flex
                align="center" justify="center"
                w={{ base: "78px", md: "92px" }} h={{ base: "78px", md: "92px" }}
                borderRadius="full"
                bg={`${meta.color}1f`}
                border={`2px solid ${meta.color}`}
                boxShadow={`0 0 20px ${meta.color}66`}
              >
                <Icon size="52px" color={meta.color} />
              </Flex>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                Bienvenido a tu naturaleza
              </Text>
              <Text color={meta.color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em">
                Tu resultado: {meta.label} {c.emoji}
              </Text>
              <Box h="1px" w="60%" maxW="240px" bgGradient={`linear(to-r, transparent, ${meta.color}88, transparent)`} my={1} />
              <Flex direction="column" gap={3.5} maxW="640px">
                {c.intro.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">
                    {parseRich(p)}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Panel>

          {/* ── EXPECTATIVAS (casillas) ── */}
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={1.5} style={{ textShadow: INK_SHADOW }}>
              {c.expectativas.titulo}
            </Text>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={5}>
              {c.expectativas.pregunta}
            </Text>
            <Flex direction="column" gap={3}>
              {c.expectativas.opciones.map((op) => (
                <CheckRow
                  key={op}
                  label={op}
                  color={meta.color}
                  checked={expectativas.includes(op)}
                  onToggle={() => toggle(op, expectativas, setExpectativas, { reconoces })}
                />
              ))}
            </Flex>
            <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={4}>
              {c.expectativas.nota}
            </Text>
          </Panel>

          {/* ── PRINCIPIO DEL DOSHA ── */}
          <Panel color={meta.color}>
            <Flex direction="column" gap={3.5}>
              {c.principio.map((p, i) => (
                <Text
                  key={i}
                  color={TINTA}
                  fontSize={i === 0 ? { base: "2xl", md: "3xl" } : { base: "md", md: "lg" }}
                  fontWeight={i === 0 ? "700" : "400"}
                  lineHeight={i === 0 ? "1.3" : "1.85"}
                  textAlign={i === 0 ? "center" : "left"}
                  style={i === 0 ? { textShadow: INK_SHADOW } : undefined}
                >
                  {parseRich(p)}
                </Text>
              ))}
            </Flex>
          </Panel>

          {/* ── ¿TE RECONOCES? (casillas) ── */}
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
              {c.reconoces.titulo}
            </Text>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} mb={5}>
              {c.reconoces.intro}
            </Text>
            <Flex direction="column" gap={3}>
              {c.reconoces.opciones.map((op) => (
                <CheckRow
                  key={op}
                  label={op}
                  color={meta.color}
                  checked={reconoces.includes(op)}
                  onToggle={() => toggle(op, reconoces, setReconoces, { expectativas })}
                />
              ))}
            </Flex>
            <Flex direction="column" gap={2.5} mt={5}>
              {c.reconoces.cierre.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">
                  {parseRich(p)}
                </Text>
              ))}
            </Flex>
          </Panel>

          {/* ── LO QUE DESCUBRIRÁS ── */}
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center" mb={2} style={{ textShadow: INK_SHADOW }}>
              {c.descubriras.titulo}
            </Text>
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} textAlign="center" mb={6}>
              {c.descubriras.intro}
            </Text>
            <Flex direction="column" gap={3.5}>
              {c.descubriras.items.map((it, i) => (
                <Flex
                  key={i}
                  align="flex-start"
                  gap={4}
                  px={{ base: 4, md: 5 }}
                  py={{ base: 3.5, md: 4 }}
                  borderRadius="xl"
                  bg="rgba(255,251,243,0.4)"
                  border={`1px solid ${TINTA}22`}
                  sx={{ backdropFilter: "blur(4px)" }}
                >
                  <Text fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1" flexShrink={0}>{it.emoji}</Text>
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(it.texto)}</Text>
                </Flex>
              ))}
            </Flex>
          </Panel>

          {/* ── PREGUNTA FINAL (texto libre) ── */}
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
              {c.preguntaFinal.titulo}
            </Text>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={4}>
              {c.preguntaFinal.pregunta}
            </Text>
            <Textarea
              value={cambio}
              onChange={(e) => { setCambio(e.target.value); setGuardadoOk(false); }}
              onBlur={() => { void persist({ expectativas, reconoces, cambio }); }}
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
          </Panel>

          {/* ── CIERRE ── */}
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={3}>
              {c.cierre.map((p, i) => (
                <Text
                  key={i}
                  color={TINTA}
                  fontSize={i === c.cierre.length - 1 ? { base: "2xl", md: "3xl" } : { base: "md", md: "lg" }}
                  fontWeight={i === c.cierre.length - 1 ? "700" : "400"}
                  lineHeight="1.7"
                  style={i === c.cierre.length - 1 ? { textShadow: INK_SHADOW } : undefined}
                >
                  {parseRich(p)}
                </Text>
              ))}
            </Flex>
          </Panel>

          {/* ── Guardar ── */}
          <Box
            as="button"
            onClick={guardando ? undefined : guardarTodo}
            minW="200px"
            px={10}
            py={3.5}
            borderRadius="full"
            bg={meta.color}
            color="#fff"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "lg", md: "xl" }}
            letterSpacing="0.05em"
            cursor={guardando ? "wait" : "pointer"}
            boxShadow={`0 4px 18px rgba(0,0,0,0.25), 0 0 20px ${meta.color}66`}
            transition="all 0.2s"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
            _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 6px 24px rgba(0,0,0,0.3), 0 0 28px ${meta.color}88` }}
          >
            {guardando ? "Guardando…" : guardadoOk ? "Guardado ✓" : "Guardar"}
          </Box>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <SiteFooter />
    </Box>
  );
}
