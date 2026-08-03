import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { Reveal } from "../../components/global/Reveal";
import {
  rangoDe, TODOS_MARCADORES, type Marcador, type Sexo,
} from "../../components/metodo/analiticaMarcadores";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
// Sin luces de colores en esta página: TODOS los glows son blancos (sobrio y elegante).
const GLOW_BOX = `0 0 16px rgba(255,255,255,0.16), 0 0 40px rgba(255,255,255,0.08)`;
const GLOW_BTN = `0 0 16px rgba(255,255,255,0.28), 0 0 34px rgba(255,255,255,0.12)`;

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

// ── Barra de niveles (solo en el popup): banda "normal" + tu valor, en blanco ─
function RangoBar({ min, max, value }: { min: number; max: number; value: number | null }) {
  const span = max - min || 1;
  const lo = min - span * 0.6;
  const hi = max + span * 0.6;
  const dom = hi - lo || 1;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - lo) / dom) * 100));
  const bandL = pct(min);
  const bandW = pct(max) - bandL;
  const mark = value == null ? null : pct(value);

  return (
    <Box position="relative" h="8px" borderRadius="full" bg="rgba(255,255,255,0.14)">
      {/* banda "normal" */}
      <Box position="absolute" left={`${bandL}%`} w={`${bandW}%`} top="0" bottom="0"
           borderRadius="full" bg="rgba(255,255,255,0.18)" border="1px solid rgba(255,255,255,0.5)" />
      {/* tu valor */}
      {mark != null && (
        <Box position="absolute" left={`${mark}%`} top="50%" transform="translate(-50%,-50%)"
             w="16px" h="16px" borderRadius="full" bg="white" border="2px solid rgba(255,255,255,0.9)"
             boxShadow="0 0 8px rgba(255,255,255,0.85), 0 1px 3px rgba(0,0,0,0.6)" />
      )}
    </Box>
  );
}

// ── Tick de progreso (aparece al anotar un valor) ────────────────────────────
function Tick() {
  return (
    <Flex as="span" align="center" justify="center" flexShrink={0}
          w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} borderRadius="full"
          bg="rgba(255,255,255,0.18)" border="1px solid rgba(255,255,255,0.65)"
          sx={{ boxShadow: "0 0 10px rgba(255,255,255,0.4)" }}>
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="12px" h="12px" fill="white">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </Box>
    </Flex>
  );
}

// ── Estrella «se sale de lo normal» (blanca) ─────────────────────────────────
function Estrella({ size = "lg" }: { size?: any }) {
  return (
    <Text as="span" color="white" fontSize={size} lineHeight="1" flexShrink={0}
          style={{ textShadow: "0 0 10px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.5)" }}>
      ★
    </Text>
  );
}

// ── Tarjeta de un marcador ──────────────────────────────────────────────────
// Cada tarjeta lleva la imagen de Fisiología de fondo (inmersiva). El texto de
// qué significa ya NO va inline: al escribir un valor aparece el botón «Leer lo
// que significa» que abre un popup hablándole de SU caso (bajo/normal/alto).
function MarcadorCard({
  m, sexo, valor, onChange, onBlur, onLeer,
}: {
  m: Marcador; sexo: Sexo; valor: string;
  onChange: (v: string) => void; onBlur: () => void; onLeer: () => void;
}) {
  const [min, max] = rangoDe(m.rango, sexo);
  const n = parse(valor);
  const relleno = n != null;

  return (
    <Box position="relative" borderRadius="xl" overflow="hidden" transition="all 0.25s"
         border={`1px solid ${relleno ? "rgba(255,255,255,0.55)" : `${fisiologiaTxt}33`}`}
         boxShadow={relleno
           ? "0 0 16px rgba(255,255,255,0.14), inset 0 0 46px rgba(0,0,0,0.4)"
           : "0 0 12px rgba(255,255,255,0.06), inset 0 0 46px rgba(0,0,0,0.45)"}>
      {/* Fondo inmersivo: la misma imagen de Fisiología en cada tarjeta */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="xl" overlay="rgba(16,9,26,0.62)" />

      <Box position="relative" zIndex={1} p={{ base: 4, md: 5 }}>
        <Flex justify="space-between" align="center" gap={4} wrap="wrap">
          {/* IZQUIERDA · tick de progreso + nombre + rango normal */}
          <Box flex="1" minW="150px">
            <Flex align="center" gap={2}>
              {relleno && <Tick />}
              <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "md", md: "lg" }} lineHeight="1.25"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.75)" }}>
                {m.nombre}
              </Text>
            </Flex>
            <Text color={`${fisiologiaTxt}dd`} fontSize="xs" fontStyle="italic" mt={0.5}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
              Normal: {min}–{max} {m.unidad}
            </Text>
          </Box>

          {/* DERECHA · el VALOR es el protagonista, con el botón a su lado */}
          <Flex direction="column" align="flex-end" gap={2.5} flexShrink={0}>
            <Flex align="baseline" gap={1.5}>
              <Input
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder="—"
                inputMode="decimal"
                w={{ base: "104px", md: "120px" }}
                h={{ base: "48px", md: "54px" }}
                textAlign="center"
                color={fisiologiaTxt}
                fontWeight="800"
                fontSize={{ base: "xl", md: "2xl" }}
                bg="rgba(0,0,0,0.4)"
                border="1.5px solid rgba(255,255,255,0.5)"
                borderRadius="lg"
                _hover={{ borderColor: "rgba(255,255,255,0.8)" }}
                _focus={{ borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.9)" }}
                _placeholder={{ color: "rgba(255,255,255,0.4)" }}
              />
              <Text color={`${fisiologiaTxt}dd`} fontSize={{ base: "xs", md: "sm" }}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>{m.unidad}</Text>
            </Flex>

            {relleno && (
              <Box as="button" onClick={onLeer}
                   px={4} py={1.5} borderRadius="full"
                   bg="rgba(255,255,255,0.1)" color={fisiologiaTxt}
                   border="1.5px solid rgba(255,255,255,0.55)"
                   fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "2xs", md: "xs" }}
                   letterSpacing="0.03em" cursor="pointer" transition="all 0.2s" whiteSpace="nowrap"
                   _hover={{ bg: "rgba(255,255,255,0.2)", borderColor: "white" }}>
                Leer lo que significa en mí →
              </Box>
            )}
          </Flex>
        </Flex>

        {!relleno && (
          <Text color={fisiologiaTxt} fontSize="xs" fontStyle="italic" mt={3}
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
            Escribe tu valor para leer qué significa en ti.
          </Text>
        )}
      </Box>
    </Box>
  );
}

// ── Popup: le habla de SU caso según su valor (bajo / normal / alto) ─────────
function MarcadorModal({
  m, sexo, valor, onClose,
}: {
  m: Marcador; sexo: Sexo; valor: number; onClose: () => void;
}) {
  const [min, max] = rangoDe(m.rango, sexo);
  const estado = estadoDe(valor, min, max);
  const fuera = estado !== "normal";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [onClose]);

  const nom = m.nombre.toLowerCase();
  const intro =
    estado === "normal" ? `Tu ${nom} está dentro del rango normal.`
    : estado === "bajo" ? `Tu ${nom} está por debajo del rango normal.`
    : `Tu ${nom} está por encima del rango normal.`;
  const cierre =
    estado === "normal"
      ? "En tu caso, este valor está en equilibrio: tu cuerpo lo mantiene justo donde debe."
      : estado === "bajo"
      ? "Que esté bajo no es un diagnóstico, pero sí una señal que merece una conversación con tu médico."
      : "Que esté alto no significa enfermedad por sí solo; llévalo a tu médico para ponerlo en contexto.";

  // Separador horizontal reutilizable (línea blanca degradada).
  const Divisor = ({ my }: { my: any }) => (
    <Box h="1px" w="100%" my={my}
         bgGradient="linear(to-r, transparent, rgba(255,255,255,0.5), transparent)" />
  );

  return (
    <Box position="fixed" inset={0} zIndex={1100} bg="rgba(10,7,20,0.66)"
         sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
         display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} onClick={onClose}>
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" overflow="hidden"
           w={{ base: "95%", md: "560px" }} maxH={{ base: "calc(100dvh - 32px)", md: "88vh" }}
           borderRadius="24px" border="1px solid rgba(255,255,255,0.3)"
           boxShadow="0 32px 80px rgba(0,0,0,0.55), 0 0 30px rgba(255,255,255,0.16)">
        {/* Fondo inmersivo de Fisiología */}
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="24px" overlay="rgba(20,12,30,0.58)" />

        <Box as="button" position="absolute" top="14px" right="14px" w="34px" h="34px" borderRadius="full"
             bg="rgba(255,255,255,0.14)" border="1px solid rgba(255,255,255,0.35)" color="white"
             display="flex" alignItems="center" justifyContent="center" fontSize="16px" fontWeight="700"
             cursor="pointer" zIndex={2} transition="all 0.18s" _hover={{ bg: "rgba(255,255,255,0.28)" }}
             onClick={onClose}>
          ✕
        </Box>

        <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}
             overflowY="auto" maxH={{ base: "calc(100dvh - 32px)", md: "88vh" }}
             sx={{
               "&::-webkit-scrollbar": { width: "5px" },
               "&::-webkit-scrollbar-track": { bg: "transparent" },
               "&::-webkit-scrollbar-thumb": { bg: "rgba(255,255,255,0.4)", borderRadius: "full" },
               // Lo que se LEE se puede seleccionar con el ratón: la página pone
               // `noSelectSx` en su raíz y este popup, al pintarse dentro de
               // ella, lo heredaba.
               userSelect: "text",
               WebkitUserSelect: "text",
             }}>

          {/* ── Título ── */}
          <Flex align="center" justify="center" gap={2.5}>
            {fuera && <Estrella size={{ base: "2xl", md: "3xl" }} />}
            <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center"
                  fontFamily="'EB Garamond', serif"
                  style={{ textShadow: "0 0 16px rgba(255,255,255,0.35), 0 1px 4px rgba(0,0,0,0.6)" }}>
              {m.nombre}
            </Text>
          </Flex>

          {/* ── Separación horizontal ── */}
          <Divisor my={{ base: 5, md: 6 }} />

          {/* ── Niveles ── */}
          <Text color={fisiologiaTxt} fontSize="xs" fontWeight="700" letterSpacing="0.14em"
                textTransform="uppercase" textAlign="center" mb={4}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            Niveles
          </Text>
          <Flex justify="center" align="flex-start" gap={{ base: 8, md: 12 }} mb={5} wrap="wrap">
            <Box textAlign="center">
              <Text color={fisiologiaTxt} fontSize="2xs" textTransform="uppercase" letterSpacing="0.1em" mb={1}>
                Tu valor
              </Text>
              <Text color={fisiologiaTxt} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" lineHeight="1"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                {valor}
                <Text as="span" fontSize="md" fontWeight="600" color={fisiologiaTxt}> {m.unidad}</Text>
              </Text>
            </Box>
            <Box textAlign="center">
              <Text color={fisiologiaTxt} fontSize="2xs" textTransform="uppercase" letterSpacing="0.1em" mb={1}>
                Lo ideal
              </Text>
              <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                {min}–{max}
                <Text as="span" fontSize="md" fontWeight="600"> {m.unidad}</Text>
              </Text>
            </Box>
          </Flex>
          <Box maxW="380px" mx="auto"><RangoBar min={min} max={max} value={valor} /></Box>

          {/* ── Separación horizontal ── */}
          <Divisor my={{ base: 5, md: 6 }} />

          {/* ── Explicación ── */}
          <Text color={fisiologiaTxt} fontSize="xs" fontWeight="700" letterSpacing="0.14em"
                textTransform="uppercase" textAlign="center" mb={3}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            Qué significa en ti
          </Text>
          <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" textAlign="center" mb={3}
                style={{ textShadow: INK }}>
            {intro} {m.explica}
          </Text>
          <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" textAlign="center"
                style={{ textShadow: INK }}>
            {cierre}
          </Text>

          <Box mt={6} mx="auto" maxW="440px" borderRadius="xl" px={4} py={3}
               bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.28)">
            <Text color={fisiologiaTxt} fontSize="xs" lineHeight="1.7" textAlign="center"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              Esto es educativo, no un diagnóstico. Los rangos son orientativos; coméntalo siempre con tu médico.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaAnalitica() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sexo, setSexo] = useState<Sexo>("mujer");
  const [valores, setValores] = useState<Record<string, string>>({});
  const [abierto, setAbierto] = useState<Marcador | null>(null); // marcador cuyo popup está abierto
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
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
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
    return <FisiologiaLoading />;
  }

  // Mini-resumen: cuántos has anotado y cuántos caen dentro de rango.
  const rellenados = TODOS_MARCADORES.filter((m) => parse(valores[m.id]) != null);
  const dentro = rellenados.filter((m) => {
    const [min, max] = rangoDe(m.rango, sexo);
    return estadoDe(parse(valores[m.id])!, min, max) === "normal";
  }).length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
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
          </Reveal>

          {/* Intro + aviso */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={GLOW_BOX}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }} textAlign="center">
                <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" maxW="620px" mx="auto"
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
                  <Text color={fisiologiaTxt} fontSize="sm" fontStyle="italic">Ajustar rangos para:</Text>
                  <Flex gap={2}>
                    {(["mujer", "hombre"] as Sexo[]).map((s) => {
                      const activo = sexo === s;
                      return (
                        <Box key={s} as="button" onClick={() => cambiarSexo(s)}
                             px={5} py={1.5} borderRadius="full" cursor="pointer"
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="sm"
                             textTransform="capitalize" transition="all 0.2s"
                             bg={activo ? fisiologiaTxt : "transparent"}
                             color={activo ? fisiologiaBg : fisiologiaTxt}
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

          {/* Marcadores (sin títulos de grupo ni iconos): lista limpia de tarjetas.
              Cada tarjeta entra al asomar en pantalla (fundido + subida + enfoque). */}
          <Flex direction="column" gap={{ base: 3, md: 4 }} w="100%">
            {TODOS_MARCADORES.map((m) => (
              <Reveal key={m.id} inView direction="up" distance={44} scaleFrom={0.94} blur duration={0.6} amount={0.3} w="100%">
                <MarcadorCard m={m} sexo={sexo}
                              valor={valores[m.id] ?? ""}
                              onChange={(v) => cambiarValor(m.id, v)}
                              onBlur={guardarValores}
                              onLeer={() => setAbierto(m)} />
              </Reveal>
            ))}
          </Flex>

          {/* Cierre */}
          <Reveal inView direction="up" distance={18} duration={0.6} amount={0.2} w="100%">
            <Box w="100%" borderRadius="2xl" overflow="hidden" position="relative" boxShadow={GLOW_BOX}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }} textAlign="center">
                {rellenados.length > 0 && (
                  <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={3}
                        style={{ textShadow: INK }}>
                    Has anotado {rellenados.length} {rellenados.length === 1 ? "valor" : "valores"} · {dentro} dentro de rango.
                  </Text>
                )}
                <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" maxW="620px" mx="auto"
                      style={{ textShadow: INK }}>
                  La mayor parte de ti está, casi siempre, en equilibrio: millones de procesos ajustándose solos para
                  mantenerte. Lo que quede fuera de rango no es un veredicto, es una conversación pendiente con tu médico.
                </Text>
                <Box as="button" onClick={() => navigate("/metodo/fisiologia/niveles")}
                     mt={6} px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                     boxShadow={GLOW_BTN}
                     _hover={{ transform: "translateY(-2px)", boxShadow: "0 0 26px rgba(255,255,255,0.4), 0 0 52px rgba(255,255,255,0.18)" }}>
                  ← Volver a los niveles
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Popup con la explicación del caso del usuario (solo si tiene valor) */}
      {abierto && parse(valores[abierto.id]) != null && (
        <MarcadorModal
          m={abierto}
          sexo={sexo}
          valor={parse(valores[abierto.id])!}
          onClose={() => setAbierto(null)}
        />
      )}

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
