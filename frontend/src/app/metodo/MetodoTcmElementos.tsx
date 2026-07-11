import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent, IconButton } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { ComicViewer } from "../../components/metodo/ComicViewer";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoDesbloqueado, elementoLeido,
  viajeCompleto, testsDeElemento, testCompleto, puntosElemento,
  type DatosTcm, type Elemento, type PreguntaTest, type TestElemento,
} from "../../components/metodo/tcmRecorrido";
import { tieneContenido, COMIC_INTRO_ELEMENTOS, FOTO_ELEMENTO, ICONO_ELEMENTO, COMIC_ELEMENTO } from "../../components/metodo/tcmElementosContenido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
// Preposición del título del test según el género del elemento ("de la Madera",
// "del Fuego"…), para que quede "TEST DE LA MADERA".
const TEST_PREP: Record<Elemento, string> = {
  madera: "de la", fuego: "del", tierra: "de la", metal: "del", agua: "del",
};
// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

const CX = 160, CY = 170, R = 120, FOTO_R = 24;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export default function MetodoTcmElementos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const [introIdx, setIntroIdx] = useState(0);
  // Respuestas del mini-test embebido en el cómic del elemento abierto.
  const [respuestasTest, setRespuestasTest] = useState<Record<string, string>>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: DatosTcm = res.data?.data ?? {};
        setData(d);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const estados = useMemo(() => ORDEN_ELEMENTOS.map((el) => ({
    el,
    desbloqueado: elementoDesbloqueado(data, el),
    leido: elementoLeido(data, el),
    disponible: tieneContenido(el),
  })), [data]);

  // Pinchar un elemento abre su cómic (no navega a otra página). Prerrellenamos
  // el mini-test con lo que ya se hubiese respondido, para que no se repita.
  const abrir = (el: Elemento, desbloqueado: boolean, disponible: boolean) => {
    if (!desbloqueado || !disponible) return;
    setRespuestasTest(data.elementos?.[el]?.miniTest?.respuestas ?? {});
    setComicEl(el);
  };

  // Persiste el estado del elemento (respuestas + puntos, y opcionalmente leído).
  // Se llama en CADA respuesta (autoguardado) y al terminar el cómic. Los puntos
  // salen de los tests de balance del elemento (o del mini-test antiguo si aún no
  // están migrados) y alimentan el radar/perfil.
  const persistir = async (el: Elemento, respuestas: Record<string, string>, leido?: boolean) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const puntos = puntosElemento(el, respuestas);
    const next: DatosTcm = {
      ...data,
      elementos: {
        ...data.elementos,
        [el]: {
          ...data.elementos?.[el],
          ...(leido ? { leido: true } : {}),
          miniTest: { respuestas, puntos },
        },
      },
    };
    setData(next);
    if (userId && token) {
      try {
        await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
          { headers: { Authorization: `Bearer ${token}` } });
      } catch { /* el estado local ya refleja el cambio */ }
    }
  };

  // Autoguardado: cada vez que el usuario marca una opción, se guarda al instante.
  const elegirTest = (preguntaKey: string, opcionKey: string) => {
    if (!comicEl) return;
    const next = { ...respuestasTest, [preguntaKey]: opcionKey };
    setRespuestasTest(next);
    void persistir(comicEl, next);
  };

  // Al terminar el cómic, marcamos el elemento como leído (✓ + desbloquea el
  // siguiente). Las respuestas ya se fueron guardando en cada paso.
  const marcarLeido = async (el: Elemento) => {
    await persistir(el, respuestasTest, true);
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Los Cinco Elementos"
            pageLabel="2/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Medicina China", onClick: () => navigate("/metodo/tcm") }}
            extra={ilustracionesBtn}
            next={{
              label: "Tu perfil →",
              onClick: () => navigate("/metodo/tcm/perfil"),
              disabled: !viajeCompleto(data),
              disabledTooltip: "Recorre los cinco elementos para ver tu perfil completo",
            }}
          />

          {/* La estrella interactiva */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 6 }} py={{ base: 7, md: 9 }}>
              <Box as="svg" viewBox="0 0 320 312" w={{ base: "300px", md: "380px" }} h="auto" overflow="visible">
                <defs>
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const v = vertice(i, R);
                    return (
                      <clipPath id={`hub-clip-${el}`} key={el}>
                        <circle cx={v.x} cy={v.y} r={FOTO_R} />
                      </clipPath>
                    );
                  })}
                </defs>
                {/* pentágono de referencia */}
                <polygon
                  points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R); return `${v.x},${v.y}`; }).join(" ")}
                  fill="none" stroke={`${tcmTxt}33`} strokeWidth={1}
                />
                {estados.map(({ el, desbloqueado, leido, disponible }, i) => {
                  const v = vertice(i, R);
                  const label = vertice(i, R + 46);
                  const activo = desbloqueado && disponible;
                  const color = ELEMENTOS[el].color;
                  return (
                    <g key={el} style={{ cursor: activo ? "pointer" : "not-allowed" }}
                       onClick={() => abrir(el, desbloqueado, disponible)}>
                      {/* base + icono del elemento */}
                      <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                      <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                             width={FOTO_R * 2} height={FOTO_R * 2}
                             clipPath={`url(#hub-clip-${el})`} preserveAspectRatio="xMidYMid slice"
                             opacity={activo ? 1 : 0.35} />
                      {/* velo si está bloqueado */}
                      {!activo && <circle cx={v.x} cy={v.y} r={FOTO_R} fill={tcmBg} opacity={0.45} />}
                      {/* aro */}
                      <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none"
                              stroke={leido ? "white" : activo ? color : `${tcmTxt}55`}
                              strokeWidth={leido ? 3 : 2}
                              style={activo ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined} />
                      {/* candado si bloqueado (icono blanco, no emoji) */}
                      {!activo && (
                        <path fill="white"
                              transform={`translate(${v.x} ${v.y}) scale(0.021) translate(-480 500)`}
                              d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                      )}
                      {/* insignia ✓ si leído */}
                      {leido && (
                        <>
                          <circle cx={v.x + FOTO_R * 0.72} cy={v.y - FOTO_R * 0.72} r={9} fill="white" />
                          <text x={v.x + FOTO_R * 0.72} y={v.y - FOTO_R * 0.72} fill={color} fontSize={12}
                                fontWeight={700} textAnchor="middle" dominantBaseline="central">✓</text>
                        </>
                      )}
                      <text x={label.x} y={label.y} fill="white" fontSize={14} fontWeight={700}
                            textAnchor="middle" dominantBaseline="middle"
                            style={{ textShadow: "0 1px 4px rgba(58,10,10,0.95)" }}>
                        {ELEMENTOS[el].nombre}
                      </text>
                    </g>
                  );
                })}
              </Box>
            </Flex>
          </Box>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.6">
            Los elementos se abren en orden (Madera → Fuego → Tierra → Metal → Agua). Al leer cada uno, se marca con ✓.
          </Text>

          {/* Intro (Módulo 1) · cómic de 4 viñetas: foto a la izquierda, texto
              a la derecha, navegable con flechas. Mismo estilo que las
              Ilustraciones pero inline (sin popup y sobre el fondo actual). */}
          {(() => {
            const total = COMIC_INTRO_ELEMENTOS.length;
            const vin = COMIC_INTRO_ELEMENTOS[introIdx];
            const isFirst = introIdx === 0;
            const isLast = introIdx === total - 1;
            return (
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

                {/* Línea de luz superior */}
                <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
                     bgGradient={`linear(to-r, transparent, ${tcmTxt}aa, transparent)`} />

                <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                      align="center" justify="center" gap={{ base: 5, md: 10 }}
                      px={{ base: 6, md: 12 }} py={{ base: 7, md: 9 }}>

                  {/* Foto (viñeta) */}
                  <Box key={`foto-${introIdx}`} w={{ base: "80%", md: "300px" }} maxW={{ base: "260px", md: "300px" }}
                       aspectRatio={1} flexShrink={0} position="relative"
                       sx={{ filter: `drop-shadow(0 0 20px rgba(255,255,255,0.25)) drop-shadow(0 0 60px ${tcmTxt}44)` }}>
                    <Box as="img" src={encodeURI(vin.src)} alt={`Los Cinco Elementos (${introIdx + 1}/${total})`}
                         w="100%" h="100%" borderRadius="lg" style={{ objectFit: "contain" }} />
                  </Box>

                  {/* Separador elegante: rayita horizontal en móvil, vertical en escritorio */}
                  <Box flexShrink={0} alignSelf="center" borderRadius="full"
                       w={{ base: "52px", md: "1px" }} h={{ base: "1px", md: "150px" }}
                       bgGradient={{
                         base: `linear(to-r, transparent, ${tcmTxt}aa, transparent)`,
                         md: `linear(to-b, transparent, ${tcmTxt}aa, transparent)`,
                       }} />

                  {/* Texto — misma tipografía que el cómic de Astrología
                      (ComicViewer): grande, ligero, con aire entre líneas. */}
                  <Flex direction="column" gap={3} flex="1" minW={0} w={{ base: "100%", md: "auto" }}>
                    <Text key={`txt-${introIdx}`} color={TINTA} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9"
                          letterSpacing="0.02em" fontWeight="400" textAlign={{ base: "center", md: "left" }}
                          style={{ textShadow: INK_SHADOW }}>
                      {vin.texto}
                    </Text>
                  </Flex>
                </Flex>

                {/* Controles de navegación — flechas redondas con glow, como
                    las del ComicViewer de Astrología. */}
                <Flex position="relative" zIndex={1} align="center" justify="center" gap={6}
                      pb={{ base: 5, md: 6 }} mt={{ base: -1, md: -2 }}>
                  <IconButton aria-label="Anterior" onClick={() => setIntroIdx((i) => Math.max(i - 1, 0))}
                    isDisabled={isFirst} variant="ghost" color={tcmTxt} opacity={isFirst ? 0.25 : 1}
                    borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                    minW={{ base: "42px", md: "48px" }}
                    bg={`${tcmTxt}10`} border={`1px solid ${tcmTxt}33`}
                    boxShadow={isFirst ? "none" : `0 0 14px ${tcmTxt}44, 0 0 32px ${tcmTxt}22`}
                    _hover={isFirst ? {} : { bg: `${tcmTxt}22`, borderColor: `${tcmTxt}88`, boxShadow: `0 0 22px ${tcmTxt}66, 0 0 50px ${tcmTxt}33` }}
                    icon={
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={tcmTxt}
                        style={{ filter: isFirst ? "none" : `drop-shadow(0 0 6px ${tcmTxt}cc) drop-shadow(0 0 14px ${tcmTxt}77)` }}>
                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                      </Box>
                    } />
                  {/* Puntitos de paso — el activo se alarga en píldora, como el
                      carrusel del inicio; clicables para saltar de viñeta. */}
                  <Flex align="center" justify="center" gap={2}>
                    {COMIC_INTRO_ELEMENTOS.map((_, i) => {
                      const activo = i === introIdx;
                      return (
                        <Box
                          key={i}
                          as="button"
                          aria-label={`Viñeta ${i + 1}`}
                          onClick={() => setIntroIdx(i)}
                          w={activo ? "22px" : "8px"}
                          h="8px"
                          borderRadius="full"
                          bg={activo ? tcmTxt : `${tcmTxt}44`}
                          cursor="pointer"
                          transition="all 0.25s ease"
                          boxShadow={activo ? `0 0 8px ${tcmTxt}aa, 0 0 16px ${tcmTxt}66` : "none"}
                          _hover={{ bg: activo ? tcmTxt : `${tcmTxt}88` }}
                        />
                      );
                    })}
                  </Flex>
                  <IconButton aria-label="Siguiente" onClick={() => setIntroIdx((i) => Math.min(i + 1, total - 1))}
                    isDisabled={isLast} variant="ghost" color={tcmTxt} opacity={isLast ? 0.25 : 1}
                    borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                    minW={{ base: "42px", md: "48px" }}
                    bg={`${tcmTxt}10`} border={`1px solid ${tcmTxt}33`}
                    boxShadow={isLast ? "none" : `0 0 14px ${tcmTxt}44, 0 0 32px ${tcmTxt}22`}
                    _hover={isLast ? {} : { bg: `${tcmTxt}22`, borderColor: `${tcmTxt}88`, boxShadow: `0 0 22px ${tcmTxt}66, 0 0 50px ${tcmTxt}33` }}
                    icon={
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={tcmTxt}
                        style={{ filter: isLast ? "none" : `drop-shadow(0 0 6px ${tcmTxt}cc) drop-shadow(0 0 14px ${tcmTxt}77)` }}>
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </Box>
                    } />
                </Flex>

                {/* Línea de luz inferior */}
                <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
                     bgGradient={`linear(to-r, transparent, ${tcmTxt}aa, transparent)`} />
              </Box>
            );
          })()}
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Cómic del elemento: fondo y box con la foto del elemento; cerrable en cualquier momento. */}
      <Modal isOpen={!!comicEl} onClose={() => setComicEl(null)} size="full" scrollBehavior="outside">
        <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
        <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} minH="100vh" position="relative">
          {comicEl && (() => {
            const pasos = COMIC_ELEMENTO[comicEl];
            const tests = testsDeElemento(comicEl);
            const miniTest = ELEMENTOS[comicEl].miniTest; // legacy (elementos sin migrar)
            const vinetas = pasos.map((p) => ({
              src: p.src,
              paragraphs: p.tipo === "vineta" ? p.paragraphs : (p.intro ?? []),
            }));
            const legacyRespondido = miniTest.every((q) => !!respuestasTest[q.key]);
            // Test (de balance) que corresponde a una página de test concreta.
            const testDePaso = (i: number): TestElemento | null => {
              const p = pasos[i];
              if (p?.tipo !== "test" || !p.testKey) return null;
              return tests.find((t) => t.key === p.testKey) ?? null;
            };
            const cabecera = `Test ${TEST_PREP[comicEl]} ${ELEMENTOS[comicEl].nombre}`;
            return (
              <ComicViewer
                key={comicEl}
                vinetas={vinetas}
                themeColor={ELEMENTOS[comicEl].color}
                textColor="#ffffff"
                disciplinaBgImage={FOTO_ELEMENTO[comicEl]}
                disciplinaBgColor={ELEMENTOS[comicEl].color}
                fondoNitido
                bloqueado={(i) => {
                  if (pasos[i]?.tipo !== "test") return false;
                  const t = testDePaso(i);
                  return t ? !testCompleto(t, respuestasTest) : !legacyRespondido;
                }}
                sinFoto={(i) => pasos[i]?.tipo === "test"}
                separarFrases
                pageExtra={(i, api) => {
                  if (pasos[i]?.tipo !== "test") return null;
                  const t = testDePaso(i);
                  if (t) {
                    const idx = tests.findIndex((x) => x.key === t.key);
                    return (
                      <TestBalanceComic
                        key={t.key}
                        test={t}
                        testNum={idx + 1}
                        testTotal={tests.length}
                        cabecera={cabecera}
                        respuestas={respuestasTest}
                        onElegir={elegirTest}
                        color={ELEMENTOS[comicEl].color}
                        completo={testCompleto(t, respuestasTest)}
                        onContinuar={api.goNext}
                      />
                    );
                  }
                  // Fallback: mini-test antiguo (elementos aún sin migrar).
                  return (
                    <MiniTestComic
                      titulo={cabecera}
                      preguntas={miniTest}
                      respuestas={respuestasTest}
                      onElegir={elegirTest}
                      color={ELEMENTOS[comicEl].color}
                    />
                  );
                }}
                onClose={() => setComicEl(null)}
                onComplete={() => { const el = comicEl; setComicEl(null); if (el) void marcarLeido(el); }}
              />
            );
          })()}
        </ModalContent>
      </Modal>

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Mini-test embebido en el cómic del elemento ────────────────────────────
// Se pinta bajo el texto de la viñeta de test. Mientras falte alguna respuesta,
// ComicViewer bloquea el avance (ver `bloqueado`). Al terminar el cómic, las
// respuestas se guardan y sus puntos se suman a la puntuación del recorrido.
function MiniTestComic({
  titulo,
  preguntas,
  respuestas,
  onElegir,
  color,
}: {
  titulo: string;
  preguntas: PreguntaTest[];
  respuestas: Record<string, string>;
  onElegir: (preguntaKey: string, opcionKey: string) => void;
  color: string;
}) {
  const faltan = preguntas.some((q) => !respuestas[q.key]);
  return (
    <Flex direction="column" gap={5} textAlign="left">
      {/* Título del test + separación horizontal */}
      <Box>
        <Text
          color="white"
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="800"
          letterSpacing="0.14em"
          textAlign="center"
          textTransform="uppercase"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
        >
          {titulo}
        </Text>
        <Box
          mt={3}
          h="1px"
          w="100%"
          bgGradient={`linear(to-r, transparent, ${color}cc, transparent)`}
        />
      </Box>

      {preguntas.map((q, i) => (
        <Box key={q.key}>
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={2.5}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
            {i + 1}. {q.pregunta}
          </Text>
          <Flex direction="column" gap={2}>
            {q.opciones.map((op) => {
              const sel = respuestas[q.key] === op.key;
              return (
                <Box
                  key={op.key}
                  as="button"
                  onClick={() => onElegir(q.key, op.key)}
                  textAlign="left"
                  px={{ base: 3.5, md: 4 }}
                  py={{ base: 2, md: 2.5 }}
                  borderRadius="lg"
                  bg={sel ? `${color}44` : "rgba(255,255,255,0.08)"}
                  border={`1px solid ${sel ? color : "rgba(255,255,255,0.15)"}`}
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.5"
                  cursor="pointer"
                  transition="all 0.15s"
                  boxShadow={sel ? `0 0 14px ${color}88` : "none"}
                  _hover={{ bg: sel ? `${color}55` : "rgba(255,255,255,0.14)" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
                >
                  {op.texto}
                </Box>
              );
            })}
          </Flex>
        </Box>
      ))}
      <Text color="rgba(255,255,255,0.75)" fontSize="xs" fontStyle="italic"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
        {faltan ? "Responde para continuar →" : "¡Listo! Ya puedes continuar →"}
      </Text>

    </Flex>
  );
}

// ── Test de balance (A/B/C = equilibrio/exceso/deficiencia) ─────────────────
// Cabecera + subtítulo + separador + preguntas. El botón va abajo a la derecha:
// "Guardar" → muestra "Guardado ✓" y pasa a "Continuar →" (avanza el cómic). Las
// respuestas se autoguardan en cada clic (ver elegirTest), así que Guardar es
// solo la confirmación visual antes de continuar.
function TestBalanceComic({
  test, testNum, testTotal, cabecera, respuestas, onElegir, color, completo, onContinuar,
}: {
  test: TestElemento;
  testNum: number;
  testTotal: number;
  cabecera: string;
  respuestas: Record<string, string>;
  onElegir: (preguntaKey: string, opcionKey: string) => void;
  color: string;
  completo: boolean;
  onContinuar: () => void;
}) {
  const [guardado, setGuardado] = useState(false);
  return (
    <Flex direction="column" gap={5} textAlign="left">
      {/* Cabecera + subtítulo + separación horizontal */}
      <Box>
        <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="800"
              letterSpacing="0.14em" textAlign="center" textTransform="uppercase"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
          {cabecera}{testTotal > 1 ? ` · ${testNum} de ${testTotal}` : ""}
        </Text>
        {test.titulo && (
          <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" mt={1.5} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
            {test.titulo}
          </Text>
        )}
        <Box mt={3} h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${color}cc, transparent)`} />
      </Box>

      {test.preguntas.map((q, i) => (
        <Box key={q.key}>
          <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" mb={3}
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}>
            {i + 1}. {q.pregunta}{q.opcional ? " (opcional)" : ""}
          </Text>
          <Flex direction="column" gap={2}>
            {q.opciones.map((op) => {
              const sel = respuestas[q.key] === op.key;
              return (
                <Box
                  key={op.key}
                  as="button"
                  onClick={() => { setGuardado(false); onElegir(q.key, op.key); }}
                  textAlign="left"
                  px={{ base: 4, md: 5 }}
                  py={{ base: 2.5, md: 3 }}
                  borderRadius="lg"
                  bg={sel ? `${color}66` : "rgba(0,0,0,0.42)"}
                  border={`1px solid ${sel ? color : "rgba(255,255,255,0.22)"}`}
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.55"
                  cursor="pointer"
                  transition="all 0.15s"
                  boxShadow={sel ? `0 0 14px ${color}88` : "none"}
                  _hover={{ bg: sel ? `${color}77` : "rgba(0,0,0,0.55)" }}
                  // Blur del fondo tras la opción → la letra se lee mucho mejor
                  // sobre la foto del elemento.
                  sx={{ backdropFilter: "blur(8px)" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                  {op.texto}
                </Box>
              );
            })}
          </Flex>
        </Box>
      ))}

      {/* Botón abajo a la derecha: Guardar → Guardado ✓ → Continuar → */}
      <Flex justify="flex-end" align="center" gap={3} mt={1}>
        {guardado && (
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" fontStyle="italic"
                style={{ textShadow: `0 1px 4px rgba(0,0,0,0.85), 0 0 12px ${color}` }}>
            Guardado ✓
          </Text>
        )}
        <Box
          as="button"
          onClick={() => { if (guardado) { onContinuar(); } else if (completo) { setGuardado(true); } }}
          opacity={!guardado && !completo ? 0.45 : 1}
          cursor={!guardado && !completo ? "not-allowed" : "pointer"}
          px={8}
          py={3}
          borderRadius="full"
          bg={`${color}33`}
          border={`1px solid ${color}`}
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.08em"
          transition="all 0.18s ease"
          boxShadow={`0 0 16px ${color}55`}
          _hover={!guardado && !completo ? {} : { bg: `${color}55`, boxShadow: `0 0 26px ${color}88` }}
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
        >
          {guardado ? "Continuar →" : "Guardar"}
        </Box>
      </Flex>
    </Flex>
  );
}
