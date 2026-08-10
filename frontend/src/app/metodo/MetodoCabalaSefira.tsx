import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CabalaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { CabalaNotaModal } from "../../components/metodo/CabalaNotaModal";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CabalaFotoIlustracion } from "../../components/metodo/CabalaFotoIlustracion";
import {
  CABALA_ILUSTRACIONES_VINETAS,
  fotoSefira,
  indiceIlustracionSefira,
} from "../../components/metodo/cabalaIlustraciones";
import {
  cabalaSefirotMap,
  CABALA_SEFIROT_ORDEN,
  CABALA_TOTAL_PAGINAS,
  type SefiraContenido,
  type CabalaPageKey,
} from "../../components/metodo/cabalaSefirot";
import { CABALA_TEST, NUM_PREGUNTAS, TEST_MAX, normalizarEscalaTest, type DimensionTest } from "../../components/metodo/cabalaTest";
import { sefirotContenidoCompleto } from "../../components/metodo/cabalaDiagnostico";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";
// El glow vive en cabalaGlow.ts: TODO el recorrido comparte el halo del header.

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

/* ── Box base: el fondo es la imagen de Cábala (cabala.png) con un velo oscuro
   MUY suave (transparente, sin tinte marrón) para que la acuarela se vea bien y
   solo suba lo justo el contraste del texto ámbar (que además lleva su propia
   sombra, INK_SHADOW), y SIN border line. TODOS los boxes del recorrido
   comparten esta caja. Acepta props extra (p.ej. h="100%"). ── */
const CAJA_OVERLAY = "rgba(0,0,0,0.35)";
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
        fontSize={{ base: "lg", md: "xl" }}
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
  const puesta = value >= 1;
  return (
    <Flex align="center" gap={{ base: 3, md: 5 }}>
      <Box flex="1" minW={0}>
        <Text color={`${cabalaTxt}dd`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
          {statement}
        </Text>
        {/* La nota se VE, no solo se lee en la casilla: la barra crece hasta la
            puntuación dada. Es el feedback que faltaba al responder (antes se
            escribía un número y no pasaba nada). */}
        <Box mt={2} h="3px" w="100%" borderRadius="full" bg={`${cabalaTxt}1f`} overflow="hidden">
          <Box
            h="100%" borderRadius="full" bg={cabalaTxt}
            w={`${Math.min(100, (value / max) * 100)}%`}
            transition="width 0.45s cubic-bezier(0.22,1,0.36,1)"
            boxShadow={puesta ? `0 0 10px ${cabalaTxt}` : "none"}
          />
        </Box>
      </Box>
      {/* type="text" + filtro de dígitos, NO type="number": el input numérico del
          navegador deja teclear «e», «+», «-» o «,», y esas letras se quedan
          pintadas en la caja aunque el valor que llega al onChange sea vacío. */}
      <Box
        as="input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={String(max).length}
        value={value ? String(value) : ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const digitos = e.target.value.replace(/\D/g, "");
          if (!digitos) { onChange(0); return; }
          onChange(Math.max(1, Math.min(max, parseInt(digitos, 10))));
        }}
        placeholder="—"
        flexShrink={0}
        w={{ base: "50px", md: "58px" }}
        h={{ base: "42px", md: "46px" }}
        textAlign="center"
        borderRadius="lg"
        bg={`${cabalaBg}e6`}
        color={cabalaTxt}
        // Respondida: el borde se cierra en ámbar pleno y la casilla se enciende.
        border={`1px solid ${puesta ? cabalaTxt : `${cabalaTxt}44`}`}
        boxShadow={puesta ? `0 0 12px ${cabalaTxt}55` : "none"}
        transition="border-color 0.25s, box-shadow 0.25s"
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="700"
        sx={{
          "::placeholder": { color: `${cabalaTxt}44` },
          ":focus": { outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 0 1px ${cabalaTxt}66` },
        }}
      />
    </Flex>
  );
}

/* ── Test de la sefirá (Escala de Equilibrio, 1-10 como la autoevaluación) ── */
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

      {/* Con diez notas, la lista de etiquetas no cabe: se dicen los extremos. */}
      <Text color={`${cabalaTxt}bb`} fontSize="sm" mb={5} style={{ textShadow: INK_SHADOW }}>
        Puntúa cada frase del <Box as="span" fontWeight="800" color={cabalaTxt}>1</Box> (nunca) al{" "}
        <Box as="span" fontWeight="800" color={cabalaTxt}>10</Box> (siempre).
      </Text>

      <RevealStagger inView display="flex" flexDirection="column" gap={5}>
        {dim.preguntas.map((p, qi) => (
          <RevealItem key={qi}>
            <EscalaAutoeval
              statement={p.texto}
              value={answers[qi] ?? 0}
              max={TEST_MAX}
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
    w={{ base: "34px", md: "38px" }}
    h={{ base: "34px", md: "38px" }}
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
  // Visor abierto por la FOTO de esta sefirá (la del box de intro): entra
  // directamente por su ilustración y desde ahí se puede seguir con las flechas.
  const [fotoOpen, setFotoOpen] = useState(false);
  const [carruselIdx, setCarruselIdx] = useState(0);
  // Hacia dónde se ha movido el carrusel: la frase nueva entra por el lado del
  // que viene (antes todas entraban igual y no se sentía el movimiento).
  const [carruselDir, setCarruselDir] = useState<1 | -1>(1);
  const [autoeval, setAutoeval] = useState<number[]>([]);
  const [notaOpen, setNotaOpen] = useState(false);
  // Estado del guardado: solo se enseña si algo falla (el "se guarda solo" ya no
  // se pinta, el cierre de la página va limpio).
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
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
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
          const bruto = res.data?.data ?? {};
          // Migración de escala ANTES de nada: si el test venía en 1-5, se pasa
          // ENTERO a 1-10 (todas las sefirot) y se guarda ya marcado. Si se
          // dejara para el primer guardado, ese guardado marcaría el blob como
          // 1-10 habiendo convertido solo esta sefirá, y las demás se leerían
          // como respuestas bajísimas.
          const prevData = normalizarEscalaTest(bruto);
          const migrado = prevData !== bruto;
          dataRef.current = prevData;

          // Respuestas del test ya guardadas para esta dimensión (ya en 1-10).
          const saved = prevData?.test?.[sefira.key];
          if (Array.isArray(saved) && saved.length === NUM_PREGUNTAS) setTestAnswers(saved.map((n: any) => Number(n) || 0));

          // Autoevaluación guardada.
          const savedAuto = prevData?.autoeval?.[sefira.key];
          if (Array.isArray(savedAuto) && savedAuto.length === sefira.autoevaluacion.items.length) {
            setAutoeval(savedAuto.map((n: any) => Number(n) || 0));
          }

          const vistas: string[] = Array.isArray(prevData.sefirotVistas) ? prevData.sefirotVistas : [];
          const marcarVista = !vistas.includes(sefira.key);
          if (migrado || marcarVista) {
            const next = marcarVista ? { ...prevData, sefirotVistas: [...vistas, sefira.key] } : prevData;
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

  /* ── Carrusel de la intro: flechas, teclado y swipe ──
     Antes solo se podía pasar con las dos flechas. Ahora se pasa como se espera
     de un carrusel: con ← →, arrastrando con el dedo, o con las flechas y los
     puntos de siempre. */
  const nIntroTotal = sefira?.intro.length ?? 0;
  const pasarIntro = (delta: 1 | -1) => {
    if (nIntroTotal < 2) return;
    setCarruselDir(delta);
    setCarruselIdx((i) => (i + delta + nIntroTotal) % nIntroTotal);
  };
  const irAIntro = (i: number) => {
    setCarruselDir(i >= carruselIdx ? 1 : -1);
    setCarruselIdx(i);
  };
  const touchIntro = useRef<{ x: number; y: number } | null>(null);
  const onIntroTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchIntro.current = { x: t.clientX, y: t.clientY };
  };
  const onIntroTouchEnd = (e: React.TouchEvent) => {
    if (!touchIntro.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchIntro.current.x;
    const dy = t.clientY - touchIntro.current.y;
    touchIntro.current = null;
    // Solo cuenta como swipe si el gesto es claramente horizontal: si no, se
    // robaría el scroll vertical de la página.
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) pasarIntro(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (nIntroTotal < 2) return;
    const onKey = (e: KeyboardEvent) => {
      // Con un modal abierto (ilustraciones, foto, nota) las flechas no son nuestras.
      if (ilusOpen || fotoOpen || notaOpen) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") pasarIntro(1);
      else if (e.key === "ArrowLeft") pasarIntro(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nIntroTotal, ilusOpen, fotoOpen, notaOpen]);

  // Guarda una respuesta del test en BD (merge dentro de data.test[key]).
  /**
   * ÚNICO sitio por el que pasan los guardados de esta página. Antes cada uno
   * lanzaba su PATCH por su cuenta y se comía el error; ahora todos pasan por
   * aquí, que es lo que permite decir abajo si está guardado de verdad — si no,
   * el mensaje mentiría en cuanto un guardado fallara.
   */
  const persistir = async (nextData: Record<string, any>) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    setErrorGuardado(false);
    try {
      await axios.patch(
        `${API_URL}/metodo-cabala/${userId}`,
        // `escalaTest` marca que lo guardado va en 1-10. Sin esa marca, al leer
        // se entiende que son respuestas viejas (1-5) y se reescalan.
        { data: { ...nextData, escalaTest: TEST_MAX } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      setErrorGuardado(true);
    } finally {
      setGuardando(false);
    }
  };

  const guardarTest = (idx: number, valor: number) => {
    if (!key) return;
    const nuevas = [...testAnswers];
    nuevas[idx] = valor;
    setTestAnswers(nuevas);
    const prev = dataRef.current ?? {};
    const nextData = { ...prev, test: { ...(prev.test ?? {}), [key]: nuevas } };
    dataRef.current = nextData;
    void persistir(nextData);
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
      void persistir(nextData);
      return nuevas;
    });
  };

  if (loading || !sefira) {
    return <CabalaLoading />;
  }

  const tieneContenido = sefira.intro.length > 0;
  const nIntro = sefira.intro.length;

  // ¿Está relleno todo lo que se pide en la dimensión? (autoevaluación + escala).
  const autoevalCompleta = sefira.autoevaluacion.items.length === 0
    || (autoeval.length === sefira.autoevaluacion.items.length && autoeval.every((v) => v >= 1));
  const testDim = CABALA_TEST[sefira.key];
  const testCompletado = !testDim || (testAnswers.length === NUM_PREGUNTAS && testAnswers.every((v) => v >= 1 && v <= TEST_MAX));
  const dimensionCompleta = autoevalCompleta && testCompletado;
  const bloquearSiguiente = SEFIROT_GATE && !dimensionCompleta;

  // En la última sefirá (malkuth) el botón «Diagnóstico →» sólo se habilita
  // cuando TODO el contenido de las sefirot está relleno (test/autoevaluación de
  // cada dimensión). Se combina el progreso ya guardado (dataRef) con lo que la
  // usuaria acaba de responder en esta dimensión (estado en vivo).
  const contenidoSefirot = sefirotContenidoCompleto(
    { ...(dataRef.current?.test ?? {}), ...(key ? { [key]: testAnswers } : {}) },
    { ...(dataRef.current?.autoeval ?? {}), ...(key ? { [key]: autoeval } : {}) },
  );

  // El «siguiente» vive en un solo sitio: lo usan la cabecera y el pie de la
  // página, así no pueden acabar llevando a destinos distintos.
  const siguiente = nextKey
    ? {
        label: `${cabalaSefirotMap[nextKey].titulo} →`,
        onClick: () => navigate(`/metodo/cabala/sefira/${nextKey}`),
        disabled: bloquearSiguiente,
        disabledTooltip: "Completa todo lo que se pide en esta dimensión para continuar",
      }
    : {
        label: "Diagnóstico →",
        onClick: () => navigate("/metodo/cabala/diagnostico"),
        disabled: bloquearSiguiente || !contenidoSefirot,
        disabledTooltip: !contenidoSefirot
          ? "Rellena el contenido de todas las sefirot para ver tu Diagnóstico"
          : "Completa todo lo que se pide en esta dimensión para continuar",
      };

  /** Lo que falta para poder seguir, dicho con nombres, no con un «completa todo». */
  const queFalta = [
    !autoevalCompleta && "la autoevaluación",
    !testCompletado && "la escala de equilibrio",
  ].filter(Boolean) as string[];

  /** Progreso de la dimensión, en números: se pinta al pie con sus barras para
   *  que en todo momento se vea cuánto queda (antes solo se decía «te falta X»). */
  const progresoDimension = [
    sefira.autoevaluacion.items.length > 0 && {
      etiqueta: "Autoevaluación",
      hechas: sefira.autoevaluacion.items.filter((_, i) => (autoeval[i] ?? 0) >= 1).length,
      total: sefira.autoevaluacion.items.length,
    },
    testDim && {
      etiqueta: "Escala de equilibrio",
      hechas: testAnswers.filter((v) => v >= 1).length,
      total: NUM_PREGUNTAS,
    },
  ].filter(Boolean) as { etiqueta: string; hechas: number; total: number }[];

  /** Guarda lo que quede pendiente y solo entonces navega (ver flushSaves). */
  const seguir = async () => {
    if (siguiente.disabled) return;
    siguiente.onClick();
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif"
         bg="#008080">
      <SiteHeader variant="private" />

      {/* Animaciones de la página, en un solo sitio (antes el keyframe del
          carrusel vivía dentro de su propio box y solo existía si había intro). */}
      <style>{`
        @keyframes cabalaEntraDer {
          from { opacity: 0; transform: translateX(26px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes cabalaEntraIzq {
          from { opacity: 0; transform: translateX(-26px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        /* El botón «siguiente» respira en cuanto la dimensión queda completa:
           es el premio, y de paso dice sin palabras que ya se puede pasar. */
        @keyframes cabalaListo {
          0%,100% { box-shadow: 0 0 14px ${cabalaTxt}44, 0 0 30px ${cabalaTxt}22; }
          50%     { box-shadow: 0 0 22px ${cabalaTxt}88, 0 0 48px ${cabalaTxt}44; }
        }
      `}</style>

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
                next={siguiente}
              />
            </Box>
          </Reveal>

          {/* Frase bajo el header — SIN sombra: va sobre el turquesa limpio. */}
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
                   boxShadow={CAJA_GLOW}
                   onTouchStart={onIntroTouchStart} onTouchEnd={onIntroTouchEnd}
                   sx={{ touchAction: "pan-y" }}>
                <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
                {/* Foto de la sefirá a la IZQUIERDA y el carrusel de intro a la
                    derecha: la estructura de siempre para un box con ilustración
                    (la del cómic). Al pincharla se abre a pantalla completa. */}
                <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                      align="center" gap={{ base: 5, md: 8 }}
                      px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }} minH={{ base: "220px", md: "260px" }}>
                  {fotoSefira(sefira.key) && (
                    <CabalaFotoIlustracion
                      src={fotoSefira(sefira.key)!}
                      alt={sefira.titulo}
                      onClick={() => setFotoOpen(true)}
                      size={{ base: "100%", md: "210px", lg: "240px" }}
                      maxW={{ base: "280px", md: "210px", lg: "240px" }}
                    />
                  )}
                  <Flex align="center" flex="1" minW={0} w="100%">
                    {/* Las flechas van ABAJO, a los lados de los puntos: deja el
                        texto a todo el ancho y en el móvil queda más limpio. */}
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
                        style={{
                          textShadow: INK_SHADOW,
                          // Entra por el lado del que viene: hacia delante, desde la
                          // derecha; hacia atrás, desde la izquierda.
                          animation: `${carruselDir === 1 ? "cabalaEntraDer" : "cabalaEntraIzq"} 0.42s cubic-bezier(0.22,1,0.36,1)`,
                        }}
                      >
                        {sefira.intro[carruselIdx]}
                      </Text>
                      <Flex align="center" gap={{ base: 4, md: 5 }}>
                        <FlechaCarrusel dir="left" onClick={() => pasarIntro(-1)} />
                        <Flex gap={2}>
                          {sefira.intro.map((_, i) => (
                            <Box
                              key={i}
                              as="button"
                              onClick={() => irAIntro(i)}
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
                        <FlechaCarrusel dir="right" onClick={() => pasarIntro(1)} />
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
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
                        <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
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
                            <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
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
                        <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
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
                            <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" mb={3.5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
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

          {/* Aquí iban «Preguntas para la reflexión» y «Ejercicio». Se han
              quitado del recorrido: la dimensión se cierra con la
              autoevaluación y la escala. El contenido sigue en cabalaSefirot.ts
              porque de él vive la página «Diez días» (una jornada por sefirá). */}
          {/* Autoevaluación (1-10) */}
          {sefira.autoevaluacion.items.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.24} duration={0.65} w="100%">
              <Caja>
                <TituloCaja>Autoevaluación (1–10)</TituloCaja>
                <Divisor mt={3} mb={4} />
                {sefira.autoevaluacion.intro && (
                  <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" mb={5} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
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
                {/* Cascada corta y que arranca en cuanto asoma el box: si no,
                    el párrafo largo reserva su alto pero se queda invisible y
                    la caja parece medio vacía. */}
                <RevealStagger inView amount={0.05} stagger={0.06} delayChildren={0}
                               display="flex" flexDirection="column" gap={3}>
                  {sefira.clave.map((p, i) => (
                    <RevealItem key={i}>
                      <Text color={`${cabalaTxt}dd`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.75" style={{ textShadow: INK_SHADOW }}>
                        {p}
                      </Text>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}

          {/* ── Cierre de la página: si está guardado y por dónde seguir ──
                Las respuestas se guardan solas al salir de cada campo, pero eso
                no se veía en ninguna parte y había que subir hasta la cabecera
                para pasar a la sefirá siguiente. */}
          <Reveal direction="up" distance={18} delay={0.38} duration={0.6} w="100%">
            <Caja>
              {/* Progreso de la dimensión: cuánto llevas de cada bloque. Las
                  barras crecen a la vez que se responde, así que la página
                  responde a cada nota que se escribe. */}
              {progresoDimension.length > 0 && (
                <Flex direction={{ base: "column", md: "row" }} gap={{ base: 3, md: 8 }}>
                  {progresoDimension.map((p) => {
                    const completo = p.hechas >= p.total;
                    return (
                      <Box key={p.etiqueta} flex="1" minW={0}>
                        <Flex align="baseline" justify="space-between" gap={2}>
                          <Text color={`${cabalaTxt}bb`} fontSize={{ base: "xs", md: "sm" }}
                                letterSpacing="0.12em" textTransform="uppercase"
                                style={{ textShadow: INK_SHADOW }}>
                            {p.etiqueta}
                          </Text>
                          <Text color={completo ? cabalaTxt : `${cabalaTxt}aa`}
                                fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                                style={{ textShadow: INK_SHADOW }}>
                            {completo ? `${p.total}/${p.total} ✓` : `${p.hechas}/${p.total}`}
                          </Text>
                        </Flex>
                        <Box mt={1.5} h="4px" w="100%" borderRadius="full" bg={`${cabalaTxt}1f`} overflow="hidden">
                          <Box
                            h="100%" borderRadius="full" bg={cabalaTxt}
                            w={`${(p.hechas / p.total) * 100}%`}
                            transition="width 0.5s cubic-bezier(0.22,1,0.36,1)"
                            boxShadow={p.hechas > 0 ? `0 0 10px ${cabalaTxt}aa` : "none"}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Flex>
              )}

            </Caja>
          </Reveal>

          {/* El botón de seguir vive FUERA del box, abajo a la derecha; a su
              izquierda, solo los avisos (qué falta o un fallo al guardar). */}
          <Reveal direction="up" distance={14} delay={0.42} duration={0.55} w="100%">
            <Flex align="center" justify="space-between" gap={4} wrap="wrap" w="100%">
              <Flex direction="column" gap={1.5} minW={0} flex="1">
                {errorGuardado && (
                  <Text color="#ffb3b3" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                    No se ha podido guardar. Revisa tu conexión y vuelve a intentarlo.
                  </Text>
                )}
                {/* Si el paso está bloqueado, se dice QUÉ falta por nombre. */}
                {siguiente.disabled && queFalta.length > 0 && (
                  <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                    Para seguir te queda por completar {queFalta.join(", ")}.
                  </Text>
                )}
                {siguiente.disabled && queFalta.length === 0 && !contenidoSefirot && (
                  <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                    Para ver tu Diagnóstico falta el contenido de alguna otra sefirá.
                  </Text>
                )}
              </Flex>

              <Flex gap={3} wrap="wrap" ml="auto">
                {errorGuardado && (
                  <Box as="button"
                       onClick={guardando ? undefined : () => void persistir(dataRef.current ?? {})}
                       px={6} py={2.5} borderRadius="full"
                       border={`1.5px solid ${cabalaTxt}88`} color={cabalaTxt}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em"
                       cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.6 : 1}
                       boxShadow={CAJA_GLOW} transition="all 0.2s"
                       _hover={{ bg: `${cabalaTxt}1a`, borderColor: cabalaTxt }}
                       style={{ textShadow: INK_SHADOW }}>
                    Reintentar
                  </Box>
                )}
                <Box as="button"
                     onClick={siguiente.disabled ? undefined : () => void seguir()}
                     title={siguiente.disabled ? siguiente.disabledTooltip : undefined}
                     px={7} py={2.5} borderRadius="full"
                     bg={siguiente.disabled ? "transparent" : `${cabalaTxt}1f`}
                     border={`1.5px solid ${siguiente.disabled ? `${cabalaTxt}44` : cabalaTxt}`}
                     color={siguiente.disabled ? `${cabalaTxt}66` : cabalaTxt}
                     fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em"
                     cursor={siguiente.disabled ? "not-allowed" : "pointer"}
                     boxShadow={siguiente.disabled ? "none" : CAJA_GLOW} transition="all 0.2s"
                     _hover={siguiente.disabled ? {} : { bg: `${cabalaTxt}33`, transform: "translateY(-1px)", boxShadow: `0 0 26px ${cabalaTxt}88` }}
                     _active={siguiente.disabled ? {} : { transform: "scale(0.97)" }}
                     // Al quedar la dimensión completa, el botón late: se ve que
                     // se acaba de desbloquear sin tener que leer nada.
                     style={{
                       textShadow: INK_SHADOW,
                       ...(siguiente.disabled ? {} : { animation: "cabalaListo 2.4s ease-in-out infinite" }),
                     }}>
                  {siguiente.label}
                </Box>
              </Flex>
            </Flex>
          </Reveal>
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilusOpen} onClose={() => setIlusOpen(false)} />

      {/* Ilustración de ESTA sefirá, abierta desde su foto. Se le pasa la
          secuencia completa para poder seguir con las flechas a las demás. */}
      <CabalaSefiraIlustracionModal
        isOpen={fotoOpen}
        vinetas={CABALA_ILUSTRACIONES_VINETAS}
        initialIndex={indiceIlustracionSefira(sefira.key)}
        onClose={() => setFotoOpen(false)}
      />

      {sefira.nota && (
        <CabalaNotaModal nota={sefira.nota} isOpen={notaOpen} onClose={() => setNotaOpen(false)} />
      )}

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />

      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
