import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { Reveal } from "../../components/global/Reveal";
import {
  ANALITICA, rangoDe, TODOS_MARCADORES, type Marcador, type Sexo,
} from "../../components/metodo/analiticaMarcadores";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
} from "../../GlobalVariables";

const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const OK = "#8fd6b4";   // dentro de rango
const OUT = "#e6b566";  // fuera de rango (bajo o alto)

// coma decimal → punto; devuelve número o null si vacío/ inválido.
const parse = (v: string | undefined): number | null => {
  if (v == null) return null;
  const s = v.trim().replace(",", ".");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

type Estado = "bajo" | "normal" | "alto";
const estadoDe = (n: number, min: number, max: number): Estado =>
  n < min ? "bajo" : n > max ? "alto" : "normal";

// ── Barra de rango: banda "normal" + marcador de tu valor ───────────────────
function RangoBar({ min, max, value }: { min: number; max: number; value: number | null }) {
  const span = max - min || 1;
  const lo = min - span * 0.6;
  const hi = max + span * 0.6;
  const dom = hi - lo || 1;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - lo) / dom) * 100));
  const bandL = pct(min);
  const bandW = pct(max) - bandL;
  const estado = value == null ? null : estadoDe(value, min, max);
  const mark = value == null ? null : pct(value);

  return (
    <Box position="relative" h="9px" borderRadius="full" bg="rgba(255,255,255,0.14)">
      {/* banda normal */}
      <Box position="absolute" left={`${bandL}%`} w={`${bandW}%`} top="0" bottom="0"
           borderRadius="full" bg={`${OK}44`} border={`1px solid ${OK}aa`} />
      {/* tu valor */}
      {mark != null && (
        <Box position="absolute" left={`${mark}%`} top="50%" transform="translate(-50%,-50%)"
             w="15px" h="15px" borderRadius="full" bg="white"
             border={`2px solid ${estado === "normal" ? OK : OUT}`}
             boxShadow={`0 0 8px ${estado === "normal" ? OK : OUT}, 0 1px 3px rgba(0,0,0,0.6)`} />
      )}
    </Box>
  );
}

// ── Tarjeta de un marcador ──────────────────────────────────────────────────
function MarcadorCard({
  m, sexo, valor, onChange, onBlur,
}: {
  m: Marcador; sexo: Sexo; valor: string; onChange: (v: string) => void; onBlur: () => void;
}) {
  const [min, max] = rangoDe(m.rango, sexo);
  const n = parse(valor);
  const estado = n == null ? null : estadoDe(n, min, max);
  const chipColor = estado === "normal" ? OK : OUT;
  const chipTxt = estado === "bajo" ? "bajo" : estado === "alto" ? "alto" : "normal";

  return (
    <Box borderRadius="xl" p={{ base: 4, md: 5 }} bg="rgba(255,255,255,0.06)"
         border={`1px solid ${estado ? `${chipColor}66` : `${fisiologiaTxt}33`}`}
         transition="border-color 0.2s">
      <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
        <Box flex="1" minW="140px">
          <Text color="white" fontWeight="700" fontSize={{ base: "sm", md: "md" }} lineHeight="1.25"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            {m.nombre}
          </Text>
          <Text color={`${fisiologiaTxt}cc`} fontSize="xs" fontStyle="italic">
            Normal: {min}–{max} {m.unidad}
          </Text>
        </Box>

        <Flex align="center" gap={2} flexShrink={0}>
          <Input
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="—"
            inputMode="decimal"
            w={{ base: "84px", md: "96px" }}
            h="40px"
            textAlign="center"
            color="white"
            fontWeight="700"
            bg="rgba(255,255,255,0.1)"
            border={`1.5px solid ${fisiologiaTxt}66`}
            borderRadius="lg"
            _hover={{ borderColor: `${fisiologiaTxt}aa` }}
            _focus={{ borderColor: fisiologiaTxt, boxShadow: `0 0 0 1px ${fisiologiaTxt}` }}
            _placeholder={{ color: "rgba(255,255,255,0.4)" }}
          />
          <Text color={`${fisiologiaTxt}dd`} fontSize="xs" w="44px">{m.unidad}</Text>
          {estado && (
            <Box px={2} py={0.5} borderRadius="full" bg={`${chipColor}22`} border={`1px solid ${chipColor}`}
                 minW="52px" textAlign="center">
              <Text color={chipColor} fontSize="2xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.06em">
                {chipTxt}
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>

      <Box mt={4}><RangoBar min={min} max={max} value={n} /></Box>

      <Text color="rgba(255,255,255,0.86)" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.7" mt={3}
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
        {m.explica}
      </Text>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaAnalitica() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sexo, setSexo] = useState<Sexo>("mujer");
  const [valores, setValores] = useState<Record<string, string>>({});
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

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          const a = dataRef.current?.analitica;
          if (a?.sexo === "mujer" || a?.sexo === "hombre") setSexo(a.sexo);
          if (a?.valores && typeof a.valores === "object") {
            // guardamos números; los pasamos a string para los inputs.
            const v: Record<string, string> = {};
            for (const [k, val] of Object.entries(a.valores)) {
              if (val != null) v[k] = String(val);
            }
            setValores(v);
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

  // Guarda sexo + valores (solo los rellenados, como números) en data.analitica.
  const guardar = async (sexoN: Sexo, valoresN: Record<string, string>) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const valoresNum: Record<string, number> = {};
    for (const [k, v] of Object.entries(valoresN)) {
      const n = parse(v);
      if (n != null) valoresNum[k] = n;
    }
    const analitica = { sexo: sexoN, valores: valoresNum };
    try {
      await axios.patch(
        `${API_URL}/metodo-fisiologia/${userId}`,
        { data: { ...dataRef.current, analitica } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = { ...dataRef.current, analitica };
    } catch { /* se reintenta al próximo blur */ }
  };

  const cambiarSexo = (s: Sexo) => { setSexo(s); void guardar(s, valores); };
  const cambiarValor = (id: string, v: string) => setValores((prev) => ({ ...prev, [id]: v }));
  const guardarValores = () => { void guardar(sexo, valores); };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  // Mini-resumen: cuántos has anotado y cuántos caen dentro de rango.
  const rellenados = TODOS_MARCADORES.filter((m) => parse(valores[m.id]) != null);
  const dentro = rellenados.filter((m) => {
    const [min, max] = rangoDe(m.rango, sexo);
    return estadoDe(parse(valores[m.id])!, min, max) === "normal";
  }).length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={6}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu analítica"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Niveles", onClick: () => navigate("/metodo/fisiologia/niveles") }}
            extra={celulasBtn}
          />

          {/* Intro + aviso */}
          <Reveal w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 boxShadow={`0 0 16px rgba(255,255,255,0.12), 0 0 40px ${fisiologiaTxt}16`}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }} textAlign="center">
                <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" maxW="620px" mx="auto"
                      style={{ textShadow: INK }}>
                  Ya sabes cómo funciona un cuerpo por dentro. Ahora vamos a leer el tuyo: escribe los valores de tu
                  último análisis de sangre y te iré explicando qué significa cada uno.
                </Text>

                <Box mt={5} mx="auto" maxW="620px" borderRadius="xl" px={{ base: 4, md: 5 }} py={3}
                     bg="rgba(0,0,0,0.28)" border={`1px solid ${fisiologiaTxt}55`}>
                  <Text color={`${fisiologiaTxt}`} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.7"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    <b>Esto es educativo, no un diagnóstico.</b> Los rangos son orientativos y cambian según el
                    laboratorio, tu edad y tu situación. Un valor fuera de rango no significa enfermedad: coméntalo
                    siempre con tu médico.
                  </Text>
                </Box>

                {/* Selector de sexo (ajusta los rangos) */}
                <Flex mt={5} justify="center" align="center" gap={3} wrap="wrap">
                  <Text color="rgba(255,255,255,0.85)" fontSize="sm" fontStyle="italic">Ajustar rangos para:</Text>
                  <Flex gap={2}>
                    {(["mujer", "hombre"] as Sexo[]).map((s) => {
                      const activo = sexo === s;
                      return (
                        <Box key={s} as="button" onClick={() => cambiarSexo(s)}
                             px={5} py={1.5} borderRadius="full" cursor="pointer"
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="sm"
                             textTransform="capitalize" transition="all 0.2s"
                             bg={activo ? fisiologiaTxt : "transparent"}
                             color={activo ? fisiologiaBg : "rgba(255,255,255,0.85)"}
                             border={`1.5px solid ${activo ? fisiologiaTxt : "rgba(255,255,255,0.4)"}`}
                             _hover={{ borderColor: fisiologiaTxt }}>
                          {s}
                        </Box>
                      );
                    })}
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Reveal>

          {/* Grupos de marcadores */}
          {ANALITICA.map((g, gi) => (
            <Reveal key={g.grupo} inView direction="up" distance={18} delay={0.04 * gi} duration={0.55} amount={0.1} w="100%">
              <Box w="100%">
                <Flex align="center" gap={2} mb={3} mt={2}>
                  <Text fontSize={{ base: "lg", md: "xl" }}>{g.emoji}</Text>
                  <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: `0 1px 6px ${fisiologiaBg}` }}>
                    {g.grupo}
                  </Text>
                </Flex>
                <Flex direction="column" gap={3}>
                  {g.marcadores.map((m) => (
                    <MarcadorCard key={m.id} m={m} sexo={sexo}
                                  valor={valores[m.id] ?? ""}
                                  onChange={(v) => cambiarValor(m.id, v)}
                                  onBlur={guardarValores} />
                  ))}
                </Flex>
              </Box>
            </Reveal>
          ))}

          {/* Cierre */}
          <Reveal inView direction="up" distance={18} duration={0.6} amount={0.2} w="100%">
            <Box w="100%" borderRadius="2xl" overflow="hidden" position="relative"
                 boxShadow={`0 0 16px rgba(255,255,255,0.12), 0 0 40px ${fisiologiaTxt}16`}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }} textAlign="center">
                {rellenados.length > 0 && (
                  <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={3}
                        style={{ textShadow: INK }}>
                    Has anotado {rellenados.length} {rellenados.length === 1 ? "valor" : "valores"} · {dentro} dentro de rango.
                  </Text>
                )}
                <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" maxW="620px" mx="auto"
                      style={{ textShadow: INK }}>
                  La mayor parte de ti está, casi siempre, en equilibrio: millones de procesos ajustándose solos para
                  mantenerte. Lo que quede fuera de rango no es un veredicto, es una conversación pendiente con tu médico.
                </Text>
                <Box as="button" onClick={() => navigate("/metodo/fisiologia/niveles")}
                     mt={6} px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                     boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}>
                  ← Volver a los niveles
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {celulasModal}
      <SiteFooter />
    </Box>
  );
}
