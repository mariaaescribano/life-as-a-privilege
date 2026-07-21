import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { CabalaNotaModal } from "../../components/metodo/CabalaNotaModal";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import {
  cabalaSefirotMap,
  CABALA_SEFIROT_ORDEN,
  CABALA_TOTAL_PAGINAS,
  type SefiraContenido,
  type Ejercicio,
  type CabalaPageKey,
} from "../../components/metodo/cabalaSefirot";
import { CABALA_TEST, ESCALA, NUM_PREGUNTAS, type DimensionTest } from "../../components/metodo/cabalaTest";
import { sefirotContenidoCompleto } from "../../components/metodo/cabalaDiagnostico";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

const INK_SHADOW = `0 1px 3px ${cabalaBg}f5, 0 0 8px ${cabalaBg}cc, 0 2px 16px ${cabalaBg}88`;
const CAJA_GLOW = `0 4px 20px rgba(0,0,0,0.22), 0 0 22px ${cabalaTxt}44`;

// Puerta de progreso: si es true, no se puede pasar a la siguiente sefirá hasta
// completar TODO lo que se pide en la dimensión (preguntas de reflexión +
// autoevaluación + test). Activada: el recorrido de Cábala es secuencial, no se
// avanza sin rellenar la sefirá actual.
const SEFIROT_GATE = true;

/* ── Separador horizontal: línea completa, de la misma opacidad en todo el
   ancho (sin degradado que se desvanezca por los extremos) ── */
const Divisor = ({ mb = 4, mt = 0 }: { mb?: any; mt?: any }) => (
  <Box h="1px" w="100%" mb={mb} mt={mt} bg={`${cabalaTxt}55`} />
);

/* ── Box base: el fondo es la imagen de Cábala (cabala.png) a plena intensidad
   (sin velo que reduzca su opacidad) y SIN border line. TODOS los boxes del
   recorrido comparten esta caja. Acepta props extra (p.ej. h="100%"). ── */
const CAJA_OVERLAY = "transparent";
const Caja = ({ children, ...rest }: React.ComponentProps<typeof Box>) => (
  <Box
    position="relative"
    overflow="hidden"
    w="100%"
    borderRadius="2xl"
    boxShadow={CAJA_GLOW}
    {...rest}
  >
    <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" overlay={CAJA_OVERLAY} />
    <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }}>
      {children}
    </Box>
  </Box>
);

const TituloCaja = ({ children }: { children: React.ReactNode }) => (
  <Text
    color={cabalaTxt}
    fontSize={{ base: "lg", md: "xl" }}
    fontWeight="700"
    letterSpacing="0.14em"
    textTransform="uppercase"
    style={{ textShadow: `0 0 18px ${cabalaTxt}55` }}
  >
    {children}
  </Text>
);

/* ── Item de lista con marcador dorado. Es un RevealItem: dentro de un
   RevealStagger entra en cascada (uno a uno); suelto, se muestra sin animar. ── */
const ItemLista = ({ children }: { children: React.ReactNode }) => (
  <RevealItem>
    <Flex align="flex-start" gap={3}>
      <Box
        flexShrink={0}
        mt="10px"
        w="6px"
        h="6px"
        borderRadius="full"
        bg={cabalaTxt}
        boxShadow={`0 0 8px ${cabalaTxt}aa`}
      />
      <Text
        color={`${cabalaTxt}dd`}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.7"
        style={{ textShadow: INK_SHADOW }}
      >
        {children}
      </Text>
    </Flex>
  </RevealItem>
);

/* ── Autoevaluación (local, no se persiste): la frase y un único box lateral
   donde el usuario escribe su nota del 1 al 10 ── */
function EscalaAutoeval({ statement, value, onChange, max = 10 }: { statement: string; value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <Flex align="center" gap={{ base: 3, md: 5 }}>
      <Text flex="1" color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
        {statement}
      </Text>
      <Box
        as="input"
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value ? String(value) : ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = Number(e.target.value);
          onChange(Number.isFinite(raw) ? Math.max(0, Math.min(max, Math.round(raw))) : 0);
        }}
        placeholder="—"
        flexShrink={0}
        w={{ base: "50px", md: "58px" }}
        h={{ base: "42px", md: "46px" }}
        textAlign="center"
        borderRadius="lg"
        bg={`${cabalaBg}e6`}
        color={cabalaTxt}
        border={`1px solid ${cabalaTxt}44`}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="700"
        sx={{
          "::placeholder": { color: `${cabalaTxt}44` },
          ":focus": { outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 0 1px ${cabalaTxt}66` },
          "::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
          "::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
          MozAppearance: "textfield",
        }}
      />
    </Flex>
  );
}

/* ── Box "Ejercicio": interactivo — columnas editables y/o prompts con respuesta ── */
function EjercicioBox({ ejercicio }: { ejercicio: Ejercicio }) {
  const columnas = ejercicio.columnas ?? [];
  const prompts = ejercicio.prompts ?? [];
  const cierre = ejercicio.cierrePreguntas ?? [];

  // Modo columnas: una lista de filas editables por columna (empieza con una vacía).
  const [cols, setCols] = useState<string[][]>(() => columnas.map(() => [""]));
  // Modo prompts: una respuesta por prompt.
  const [answers, setAnswers] = useState<string[]>(() => prompts.map(() => ""));

  const setCell = (ci: number, ri: number, v: string) =>
    setCols((prev) => prev.map((c, i) => (i === ci ? c.map((x, j) => (j === ri ? v : x)) : c)));
  const addRow = (ci: number) =>
    setCols((prev) => prev.map((c, i) => (i === ci ? [...c, ""] : c)));
  const removeRow = (ci: number, ri: number) =>
    setCols((prev) => prev.map((c, i) => (i === ci ? (c.length > 1 ? c.filter((_, j) => j !== ri) : c) : c)));

  return (
    <Caja>
      <TituloCaja>Ejercicio</TituloCaja>
      <Divisor mt={3} mb={4} />

      <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
        {ejercicio.titulo}
      </Text>
      <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" mb={5} style={{ textShadow: INK_SHADOW }}>
        {ejercicio.intro}
      </Text>

      {columnas.length > 0 && (
      <RevealStagger inView display="flex" flexDirection={{ base: "column", md: "row" }} gap={{ base: 4, md: 5 }}>
        {columnas.map((col, ci) => (
          <RevealItem key={ci} flex="1" minW={0}>
          <Box flex="1" minW={0}
               bg={`${cabalaTxt}0a`} border={`1px solid ${cabalaTxt}2a`} borderRadius="xl"
               p={{ base: 4, md: 5 }}>
            <Text color={cabalaTxt} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                  letterSpacing="0.08em" textTransform="uppercase" mb={1} style={{ textShadow: INK_SHADOW }}>
              {col.titulo}
            </Text>
            <Text color={`${cabalaTxt}99`} fontSize="xs" fontStyle="italic" lineHeight="1.55" mb={3.5} style={{ textShadow: INK_SHADOW }}>
              {col.descripcion}
            </Text>

            <Flex direction="column" gap={2}>
              {cols[ci].map((val, ri) => (
                <Flex key={ri} align="center" gap={2}>
                  <Box
                    as="input"
                    value={val}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCell(ci, ri, e.target.value)}
                    placeholder="Escribe aquí…"
                    flex="1"
                    minW={0}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    bg={cabalaBg}
                    color={cabalaTxt}
                    border={`1px solid ${cabalaTxt}33`}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "sm", md: "md" }}
                    sx={{
                      "::placeholder": { color: `${cabalaTxt}55` },
                      ":focus": { outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 0 1px ${cabalaTxt}66` },
                    }}
                  />
                  <Box
                    as="button"
                    onClick={() => removeRow(ci, ri)}
                    flexShrink={0}
                    w="28px"
                    h="28px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color={`${cabalaTxt}88`}
                    bg={`${cabalaTxt}10`}
                    border={`1px solid ${cabalaTxt}22`}
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{ color: cabalaTxt, bg: `${cabalaTxt}22` }}
                    aria-label="Quitar fila"
                  >
                    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
                      <path d="M280-440v-80h400v80H280Z" />
                    </Box>
                  </Box>
                </Flex>
              ))}
            </Flex>

            <Box
              as="button"
              onClick={() => addRow(ci)}
              mt={3}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              px={3.5}
              py={1.5}
              borderRadius="full"
              bg={`${cabalaTxt}14`}
              border={`1px solid ${cabalaTxt}44`}
              color={cabalaTxt}
              fontSize="sm"
              fontWeight="600"
              cursor="pointer"
              transition="all 0.15s"
              _hover={{ bg: `${cabalaTxt}26`, borderColor: cabalaTxt }}
            >
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </Box>
              Añadir
            </Box>
          </Box>
          </RevealItem>
        ))}
      </RevealStagger>
      )}

      {/* Modo B — prompts con campo de respuesta */}
      {prompts.length > 0 && (
        <>
          {ejercicio.promptsIntro && (
            <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
              {ejercicio.promptsIntro}
            </Text>
          )}
          <RevealStagger inView display="flex" flexDirection="column" gap={4}>
            {prompts.map((p, i) => (
              <RevealItem key={i}>
                <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} fontWeight="600" lineHeight="1.55" mb={2} style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
                <Box
                  as="textarea"
                  value={answers[i] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setAnswers((prev) => { const n = [...prev]; n[i] = e.target.value; return n; })}
                  placeholder="Escribe tu respuesta…"
                  rows={2}
                  w="100%"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  bg={`${cabalaTxt}0a`}
                  color={cabalaTxt}
                  border={`1px solid ${cabalaTxt}33`}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.6"
                  sx={{
                    resize: "vertical",
                    "::placeholder": { color: `${cabalaTxt}55` },
                    ":focus": { outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 0 1px ${cabalaTxt}66` },
                  }}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        </>
      )}

      {(cierre.length > 0 || ejercicio.footer) && <Divisor mt={6} mb={4} />}

      {ejercicio.cierreIntro && (
        <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
          {ejercicio.cierreIntro}
        </Text>
      )}
      {cierre.length > 0 && (
        <RevealStagger inView display="flex" flexDirection="column" gap={2.5} mb={ejercicio.footer ? 5 : 0}>
          {cierre.map((q, i) => <ItemLista key={i}>{q}</ItemLista>)}
        </RevealStagger>
      )}
      {ejercicio.footer && (
        <Flex direction="column" gap={2.5}>
          {(Array.isArray(ejercicio.footer) ? ejercicio.footer : [ejercicio.footer]).map((f, i) => (
            <Text key={i} color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>
              {f}
            </Text>
          ))}
        </Flex>
      )}
    </Caja>
  );
}

/* ── Test de la sefirá (Escala de Equilibrio, 1-5) ── */
function TestBox({ dim, answers, onAnswer }: { dim: DimensionTest; answers: number[]; onAnswer: (idx: number, valor: number) => void }) {
  return (
    <Caja>
      <Flex align="baseline" justify="space-between" gap={3} wrap="wrap">
        <TituloCaja>Escala de equilibrio</TituloCaja>
        <Text color={`${cabalaTxt}88`} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" style={{ textShadow: INK_SHADOW }}>
          {dim.etiqueta}
        </Text>
      </Flex>
      <Divisor mt={3} mb={4} />

      {/* Leyenda 1-5 */}
      <Flex gap={2} mb={5} wrap="wrap">
        {ESCALA.map((op) => (
          <Text key={op.valor} color={`${cabalaTxt}99`} fontSize="xs" style={{ textShadow: INK_SHADOW }}>
            <Box as="span" fontWeight="800" color={cabalaTxt}>{op.valor}</Box> {op.label}
          </Text>
        ))}
      </Flex>

      <RevealStagger inView display="flex" flexDirection="column" gap={5}>
        {dim.preguntas.map((p, qi) => (
          <RevealItem key={qi}>
            <EscalaAutoeval
              statement={p.texto}
              value={answers[qi] ?? 0}
              max={5}
              onChange={(v) => onAnswer(qi, v)}
            />
          </RevealItem>
        ))}
      </RevealStagger>
    </Caja>
  );
}

/* ── Flecha del carrusel ── */
const FlechaCarrusel = ({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) => (
  <Box
    as="button"
    onClick={onClick}
    flexShrink={0}
    w={{ base: "36px", md: "44px" }}
    h={{ base: "36px", md: "44px" }}
    borderRadius="full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="rgba(255,255,255,0.12)"
    border={`1.5px solid ${cabalaTxt}88`}
    color="white"
    cursor="pointer"
    transition="all 0.18s"
    sx={{ backdropFilter: "blur(4px)", WebkitTapHighlightColor: "transparent" }}
    _hover={{ bg: "rgba(255,255,255,0.2)", borderColor: cabalaTxt, transform: "scale(1.08)" }}
    _active={{ transform: "scale(0.94)" }}
  >
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="20px" h="20px" fill="currentColor"
         style={{ transform: dir === "left" ? "scaleX(-1)" : undefined, filter: `drop-shadow(0 0 4px ${cabalaBg})` }}>
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </Box>
  </Box>
);

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

export default function MetodoCabalaSefira() {
  const navigate = useNavigate();
  const { key } = useParams<{ key: CabalaPageKey }>();
  const sefira: SefiraContenido | undefined = key ? cabalaSefirotMap[key] : undefined;

  const [loading, setLoading] = useState(true);
  const [ilusOpen, setIlusOpen] = useState(false);
  const [carruselIdx, setCarruselIdx] = useState(0);
  const [autoeval, setAutoeval] = useState<number[]>([]);
  const [preguntasResp, setPreguntasResp] = useState<string[]>([]); // respuestas locales a las preguntas de reflexión
  const [notaOpen, setNotaOpen] = useState(false);
  const [testAnswers, setTestAnswers] = useState<number[]>(() => new Array(NUM_PREGUNTAS).fill(0));
  // Copia local del `data` de metodo_cabala para poder mergear al guardar el test.
  const dataRef = useRef<any>({});

  // Navegación prev/next dentro del recorrido de sefirot.
  const { prevKey, nextKey } = useMemo(() => {
    const i = key ? CABALA_SEFIROT_ORDEN.indexOf(key) : -1;
    return {
      prevKey: i > 0 ? CABALA_SEFIROT_ORDEN[i - 1] : null,
      nextKey: i >= 0 && i < CABALA_SEFIROT_ORDEN.length - 1 ? CABALA_SEFIROT_ORDEN[i + 1] : null,
    };
  }, [key]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setCarruselIdx(0);
    setTestAnswers(new Array(NUM_PREGUNTAS).fill(0));
    if (sefira) {
      setAutoeval(new Array(sefira.autoevaluacion.items.length).fill(0));
      setPreguntasResp(new Array(sefira.preguntas.items.length).fill(""));
    }

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!sefira) { navigate("/metodo/cabala/arbol"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }

        // Cargamos el progreso guardado (sefirot vistas + respuestas del test) y
        // marcamos esta sefirá como vista.
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const prevData = res.data?.data ?? {};
          dataRef.current = prevData;

          // Respuestas del test ya guardadas para esta dimensión.
          const saved = prevData?.test?.[sefira.key];
          if (Array.isArray(saved) && saved.length === NUM_PREGUNTAS) setTestAnswers(saved.map((n: any) => Number(n) || 0));

          // Autoevaluación y respuestas de reflexión guardadas.
          const savedAuto = prevData?.autoeval?.[sefira.key];
          if (Array.isArray(savedAuto) && savedAuto.length === sefira.autoevaluacion.items.length) {
            setAutoeval(savedAuto.map((n: any) => Number(n) || 0));
          }
          const savedPreg = prevData?.preguntas?.[sefira.key];
          if (Array.isArray(savedPreg) && savedPreg.length === sefira.preguntas.items.length) {
            setPreguntasResp(savedPreg.map((s: any) => (typeof s === "string" ? s : "")));
          }

          const vistas: string[] = Array.isArray(prevData.sefirotVistas) ? prevData.sefirotVistas : [];
          if (!vistas.includes(sefira.key)) {
            const next = { ...prevData, sefirotVistas: [...vistas, sefira.key] };
            dataRef.current = next;
            await axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data: next }, { headers: { Authorization: `Bearer ${token}` } });
          }
        } catch { /* si falla el guardado, no bloqueamos la lectura */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [key, navigate, sefira]);

  // Guarda una respuesta del test en BD (merge dentro de data.test[key]).
  const guardarTest = (idx: number, valor: number) => {
    if (!key) return;
    const nuevas = [...testAnswers];
    nuevas[idx] = valor;
    setTestAnswers(nuevas);
    const prev = dataRef.current ?? {};
    const nextData = { ...prev, test: { ...(prev.test ?? {}), [key]: nuevas } };
    dataRef.current = nextData;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (userId && token) {
      axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data: nextData }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  };

  // Guarda la autoevaluación en BD (merge en data.autoeval[key]). Cuenta también
  // para el Diagnóstico final, igual que el test.
  const guardarAutoeval = (idx: number, valor: number) => {
    if (!key) return;
    setAutoeval((prev) => {
      const nuevas = [...prev];
      nuevas[idx] = valor;
      const prevData = dataRef.current ?? {};
      const nextData = { ...prevData, autoeval: { ...(prevData.autoeval ?? {}), [key]: nuevas } };
      dataRef.current = nextData;
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (userId && token) {
        axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data: nextData }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
      return nuevas;
    });
  };

  // Guarda las respuestas de reflexión (merge en data.preguntas[key]). Se llama
  // al salir del campo (onBlur) para no lanzar una petición por cada tecla.
  const guardarPreguntas = () => {
    if (!key) return;
    const prevData = dataRef.current ?? {};
    const nextData = { ...prevData, preguntas: { ...(prevData.preguntas ?? {}), [key]: preguntasResp } };
    dataRef.current = nextData;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (userId && token) {
      axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data: nextData }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  };

  if (loading || !sefira) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const tieneContenido = sefira.intro.length > 0;
  const nIntro = sefira.intro.length;

  // ¿Está TODO lo que se pide en la dimensión relleno? (preguntas de reflexión +
  // autoevaluación + test). El Ejercicio no entra (su estado vive dentro de su
  // propio componente EjercicioBox).
  const preguntasCompletas = sefira.preguntas.items.length === 0
    || (preguntasResp.length === sefira.preguntas.items.length && preguntasResp.every((r) => r.trim().length > 0));
  const autoevalCompleta = sefira.autoevaluacion.items.length === 0
    || (autoeval.length === sefira.autoevaluacion.items.length && autoeval.every((v) => v >= 1));
  const testDim = CABALA_TEST[sefira.key];
  const testCompletado = !testDim || (testAnswers.length === NUM_PREGUNTAS && testAnswers.every((v) => v >= 1 && v <= 5));
  const dimensionCompleta = preguntasCompletas && autoevalCompleta && testCompletado;
  const bloquearSiguiente = SEFIROT_GATE && !dimensionCompleta;

  // En la última sefirá (malkuth) el botón «Diagnóstico →» sólo se habilita
  // cuando TODO el contenido de las sefirot está relleno (test/autoevaluación de
  // cada dimensión). Se combina el progreso ya guardado (dataRef) con lo que la
  // usuaria acaba de responder en esta dimensión (estado en vivo).
  const contenidoSefirot = sefirotContenidoCompleto(
    { ...(dataRef.current?.test ?? {}), ...(key ? { [key]: testAnswers } : {}) },
    { ...(dataRef.current?.autoeval ?? {}), ...(key ? { [key]: autoeval } : {}) },
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif"
         bg="#008080">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          {/* Header con botón "Ilustraciones" en el medio */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <Box position="relative" w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
                title={`${sefira.numero}. ${sefira.titulo}`}
                pageLabel={`${sefira.numero + 2}/${CABALA_TOTAL_PAGINAS}`}
                compact
                bgColor={`${cabalaBg}dd`}
                color={cabalaTxt}
                nom={cabalaNom}
                mb={0}
                prev={prevKey
                  ? { label: `← ${cabalaSefirotMap[prevKey].titulo}`, onClick: () => navigate(`/metodo/cabala/sefira/${prevKey}`) }
                  : { label: "← El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
                extra={{ label: "Ilustraciones", onClick: () => setIlusOpen(true), icon: <EyeIcon /> }}
                next={nextKey
                  ? { label: `${cabalaSefirotMap[nextKey].titulo} →`, onClick: () => navigate(`/metodo/cabala/sefira/${nextKey}`), disabled: bloquearSiguiente, disabledTooltip: "Completa todo lo que se pide en esta dimensión para continuar" }
                  : { label: "Diagnóstico →", onClick: () => navigate("/metodo/cabala/diagnostico"), disabled: bloquearSiguiente || !contenidoSefirot, disabledTooltip: !contenidoSefirot ? "Rellena el contenido de todas las sefirot para ver tu Diagnóstico" : "Completa todo lo que se pide en esta dimensión para continuar" }}
              />
            </Box>
          </Reveal>

          {/* Frase bajo el header */}
          {sefira.frase && (
            <Reveal direction="up" distance={14} delay={0.08} duration={0.6} display="flex" justifyContent="center">
              <Text
                color={cabalaTxt}
                fontSize={{ base: "lg", md: "2xl" }}
                fontStyle="italic"
                fontWeight="600"
                textAlign="center"
                maxW="640px"
                lineHeight="1.5"
                style={{ textShadow: INK_SHADOW }}
              >
                {sefira.frase}
                {sefira.nota && (
                  <Box
                    as="button"
                    onClick={() => setNotaOpen(true)}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    verticalAlign="super"
                    ml={1.5}
                    w={{ base: "22px", md: "24px" }}
                    h={{ base: "22px", md: "24px" }}
                    borderRadius="full"
                    bg={`${cabalaTxt}22`}
                    border={`1.5px solid ${cabalaTxt}`}
                    color={cabalaTxt}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="800"
                    lineHeight="1"
                    cursor="pointer"
                    transition="all 0.18s"
                    boxShadow={`0 0 10px ${cabalaTxt}88`}
                    aria-label={sefira.nota.titulo}
                    sx={{ WebkitTapHighlightColor: "transparent" }}
                    _hover={{ bg: cabalaTxt, color: cabalaBg, transform: "scale(1.1)" }}
                  >
                    *
                  </Box>
                )}
              </Text>
            </Reveal>
          )}

          {!tieneContenido && (
            <Text color={cabalaTxt} fontStyle="italic" textAlign="center" style={{ textShadow: INK_SHADOW }}>
              Contenido próximamente.
            </Text>
          )}

          {/* Box 1 — carrusel sobre imagen de Cábala */}
          {nIntro > 0 && (
            <Reveal direction="up" distance={24} scaleFrom={0.97} delay={0.12} duration={0.7} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   boxShadow={`0 0 16px rgba(255,255,255,0.12), 0 0 20px ${cabalaTxt}22`}>
                <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} align="center" gap={{ base: 3, md: 5 }}
                      px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }} minH={{ base: "220px", md: "260px" }}>
                  <FlechaCarrusel dir="left" onClick={() => setCarruselIdx((i) => (i - 1 + nIntro) % nIntro)} />
                  <Flex direction="column" align="center" flex="1" minW={0} gap={5}>
                    <Text
                      key={carruselIdx}
                      color={cabalaTxt}
                      fontSize={{ base: "lg", md: "2xl" }}
                      lineHeight="1.9"
                      textAlign="center"
                      maxW="620px"
                      minH={{ base: "120px", md: "110px" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      style={{ textShadow: INK_SHADOW, animation: "cabalaFade 0.4s ease" }}
                    >
                      {sefira.intro[carruselIdx]}
                    </Text>
                    <Flex gap={2}>
                      {sefira.intro.map((_, i) => (
                        <Box
                          key={i}
                          as="button"
                          onClick={() => setCarruselIdx(i)}
                          w={i === carruselIdx ? "22px" : "8px"}
                          h="8px"
                          borderRadius="full"
                          bg={i === carruselIdx ? cabalaTxt : "rgba(255,255,255,0.45)"}
                          transition="all 0.25s"
                          cursor="pointer"
                          boxShadow={i === carruselIdx ? `0 0 10px ${cabalaTxt}` : "none"}
                        />
                      ))}
                    </Flex>
                  </Flex>
                  <FlechaCarrusel dir="right" onClick={() => setCarruselIdx((i) => (i + 1) % nIntro)} />
                </Flex>
                <style>{`@keyframes cabalaFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              </Box>
            </Reveal>
          )}

          {/* Fila EQUILIBRADO / DESEQUILIBRADO */}
          {(sefira.equilibrado.items.length > 0 || sefira.desequilibrado.items.length > 0) && (
            <Reveal direction="up" distance={22} delay={0.16} duration={0.65} w="100%">
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 6 }} w="100%" align="stretch">
                {sefira.equilibrado.items.length > 0 && (
                  <Box flex="1" display="flex">
                    <Caja h="100%">
                      <TituloCaja>Equilibrado</TituloCaja>
                      <Divisor mt={3} mb={4} />
                      {sefira.equilibrado.intro && (
                        <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                          {sefira.equilibrado.intro}
                        </Text>
                      )}
                      <RevealStagger inView display="flex" flexDirection="column" gap={2.5}>
                        {sefira.equilibrado.items.map((it, i) => <ItemLista key={i}>{it}</ItemLista>)}
                      </RevealStagger>
                      {sefira.equilibrado.extra && (
                        <>
                          <Divisor mt={5} mb={4} />
                          {sefira.equilibrado.extra.intro && (
                            <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                              {sefira.equilibrado.extra.intro}
                            </Text>
                          )}
                          <RevealStagger inView display="flex" flexDirection="column" gap={2.5}>
                            {sefira.equilibrado.extra.items.map((it, i) => <ItemLista key={i}>{it}</ItemLista>)}
                          </RevealStagger>
                        </>
                      )}
                    </Caja>
                  </Box>
                )}
                {sefira.desequilibrado.items.length > 0 && (
                  <Box flex="1" display="flex">
                    <Caja h="100%">
                      <TituloCaja>Desequilibrado</TituloCaja>
                      <Divisor mt={3} mb={4} />
                      {sefira.desequilibrado.intro && (
                        <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                          {sefira.desequilibrado.intro}
                        </Text>
                      )}
                      <RevealStagger inView display="flex" flexDirection="column" gap={2.5}>
                        {sefira.desequilibrado.items.map((it, i) => <ItemLista key={i}>{it}</ItemLista>)}
                      </RevealStagger>
                      {sefira.desequilibrado.extra && (
                        <>
                          <Divisor mt={5} mb={4} />
                          {sefira.desequilibrado.extra.intro && (
                            <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                              {sefira.desequilibrado.extra.intro}
                            </Text>
                          )}
                          <RevealStagger inView display="flex" flexDirection="column" gap={2.5}>
                            {sefira.desequilibrado.extra.items.map((it, i) => <ItemLista key={i}>{it}</ItemLista>)}
                          </RevealStagger>
                        </>
                      )}
                    </Caja>
                  </Box>
                )}
              </Flex>
            </Reveal>
          )}

          {/* Preguntas para la reflexión */}
          {sefira.preguntas.items.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.2} duration={0.65} w="100%">
              <Caja>
                <TituloCaja>Preguntas para la reflexión</TituloCaja>
                <Divisor mt={3} mb={4} />
                {sefira.preguntas.intro && (
                  <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                    {sefira.preguntas.intro}
                  </Text>
                )}
                {/* El box mantiene una altura acotada: la lista de preguntas
                    (cada una con su campo de respuesta) tiene scroll vertical. */}
                <Box
                  maxH={{ base: "360px", md: "420px" }}
                  overflowY="auto"
                  pr={{ base: 1, md: 3 }}
                  sx={{
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": { background: `${cabalaTxt}55`, borderRadius: "3px" },
                    scrollbarWidth: "thin",
                    scrollbarColor: `${cabalaTxt}55 transparent`,
                  }}
                >
                  <RevealStagger inView display="flex" flexDirection="column" gap={5}>
                    {sefira.preguntas.items.map((q, i) => (
                      <RevealItem key={i}>
                        <Text color={`${cabalaTxt}dd`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" fontStyle="italic" mb={2.5} style={{ textShadow: INK_SHADOW }}>
                          {q}
                        </Text>
                        <Box
                          as="textarea"
                          value={preguntasResp[i] ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setPreguntasResp((prev) => { const n = [...prev]; n[i] = e.target.value; return n; })}
                          onBlur={guardarPreguntas}
                          placeholder="Escribe tu respuesta…"
                          rows={2}
                          w="100%"
                          px={3}
                          py={2}
                          borderRadius="lg"
                          bg={`${cabalaBg}e6`}
                          color={cabalaTxt}
                          border={`1px solid ${cabalaTxt}33`}
                          fontFamily="'EB Garamond', serif"
                          fontSize={{ base: "sm", md: "md" }}
                          lineHeight="1.6"
                          sx={{
                            resize: "vertical",
                            "::placeholder": { color: `${cabalaTxt}55` },
                            ":focus": { outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 0 1px ${cabalaTxt}66` },
                          }}
                        />
                      </RevealItem>
                    ))}
                  </RevealStagger>
                </Box>
              </Caja>
            </Reveal>
          )}

          {/* Ejercicio interactivo */}
          {sefira.ejercicio && (
            <Reveal direction="up" distance={22} delay={0.24} duration={0.65} w="100%">
              <EjercicioBox ejercicio={sefira.ejercicio} />
            </Reveal>
          )}

          {/* Autoevaluación (1-10) */}
          {sefira.autoevaluacion.items.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.24} duration={0.65} w="100%">
              <Caja>
                <TituloCaja>Autoevaluación (1–10)</TituloCaja>
                <Divisor mt={3} mb={4} />
                {sefira.autoevaluacion.intro && (
                  <Text color={`${cabalaTxt}aa`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                    {sefira.autoevaluacion.intro}
                  </Text>
                )}
                <RevealStagger inView display="flex" flexDirection="column" gap={5}>
                  {sefira.autoevaluacion.items.map((st, i) => (
                    <RevealItem key={i}>
                      <EscalaAutoeval
                        statement={st}
                        value={autoeval[i] ?? 0}
                        onChange={(v) => guardarAutoeval(i, v)}
                      />
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}

          {/* Test de la dimensión (Escala de Equilibrio) */}
          {CABALA_TEST[sefira.key] && (
            <Reveal direction="up" distance={22} delay={0.3} duration={0.65} w="100%">
              <TestBox dim={CABALA_TEST[sefira.key]} answers={testAnswers} onAnswer={guardarTest} />
            </Reveal>
          )}

          {/* Clave de desarrollo — SIEMPRE lo último del recorrido de la sefirá */}
          {sefira.clave.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.34} duration={0.65} w="100%">
              <Caja>
                <TituloCaja>Clave de desarrollo</TituloCaja>
                <Divisor mt={3} mb={4} />
                <RevealStagger inView display="flex" flexDirection="column" gap={3.5}>
                  {sefira.clave.map((p, i) => (
                    <RevealItem key={i}>
                      <Text color={`${cabalaTxt}dd`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85" style={{ textShadow: INK_SHADOW }}>
                        {p}
                      </Text>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilusOpen} onClose={() => setIlusOpen(false)} />

      {sefira.nota && (
        <CabalaNotaModal nota={sefira.nota} isOpen={notaOpen} onClose={() => setNotaOpen(false)} />
      )}

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />

      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
