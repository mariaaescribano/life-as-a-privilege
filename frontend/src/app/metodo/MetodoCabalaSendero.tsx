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
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CabalaFotoIlustracion } from "../../components/metodo/CabalaFotoIlustracion";
import {
  CABALA_SENDERO_VINETAS,
  fotoSenderoIlustracion,
  indiceIlustracionSendero,
} from "../../components/metodo/cabalaSenderoIlustraciones";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { ESCALA } from "../../components/metodo/cabalaTest";
import { CABALA_TOTAL_PAGINAS, paginaSendero } from "../../components/metodo/cabalaSefirot";
import {
  CABALA_SENDEROS,
  senderoPorNum,
  NOMBRE_SEFIRA,
  puntuacionSendero,
  senderoCompleto,
  senderosContenidoCompleto,
  interpretacionSendero,
  type SenderoContenido,
} from "../../components/metodo/cabalaSenderos";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";
import { flushSaves } from "../../utils/flushSaves";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";
// El glow vive en cabalaGlow.ts: TODO el recorrido comparte el halo del header.

// Separación bajo el título de cada apartado: una rayita corta que se desvanece
// hacia la derecha (no una línea de lado a lado, que parecería el borde del box)
// y, sobre todo, aire arriba y abajo para que el título respire y no se pegue al
// texto. Aparece en TODOS los senderos, que comparten esta página.
const Divisor = ({ mt = 4, mb = 6 }: { mt?: any; mb?: any } = {}) => (
  <Box mt={mt} mb={mb} h="1px" w={{ base: "120px", md: "160px" }}
       bgGradient={`linear(to-r, ${cabalaTxt}88, ${cabalaTxt}33, transparent)`} />
);

// Todos los boxes llevan de fondo la imagen de Cábala (cabala.png) con EL MISMO
// velo que el header (el de DisciplinaBgLayer para Cábala: un negro al 40 %), no
// un velo marrón casi opaco: así la acuarela se ve igual de nítida en el header
// y en las cajas, en vez de quedar lavada. El contraste del texto ámbar lo pone
// INK_SHADOW, no el velo.
const Caja = ({ children }: { children: React.ReactNode }) => (
  <Box position="relative" overflow="hidden" w="100%"
       borderRadius="2xl" boxShadow={CAJA_GLOW}>
    <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
    <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }}>
      {children}
    </Box>
  </Box>
);

const TituloCaja = ({ children }: { children: React.ReactNode }) => (
  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.14em"
        textTransform="uppercase" style={{ textShadow: `0 0 18px ${cabalaTxt}55` }}>
    {children}
  </Text>
);

const Parrafos = ({ items }: { items: string[] }) => (
  <RevealStagger inView display="flex" flexDirection="column" gap={3.5}>
    {items.map((p, i) => (
      <RevealItem key={i}>
        <Text color={`${cabalaTxt}f2`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85"
              style={{ textShadow: INK_SHADOW }}>{p}</Text>
      </RevealItem>
    ))}
  </RevealStagger>
);

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto). El mismo
export default function MetodoCabalaSendero() {
  const navigate = useNavigate();
  const { num } = useParams<{ num: string }>();
  const sendero: SenderoContenido | undefined = num ? senderoPorNum[Number(num)] : undefined;

  const [loading, setLoading] = useState(true);
  const [ilusOpen, setIlusOpen] = useState(false);
  // Visor abierto por la FOTO de este sendero (la de su cabecera).
  const [fotoOpen, setFotoOpen] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const dataRef = useRef<any>({});

  const { prevNum, nextNum } = useMemo(() => {
    const i = sendero ? CABALA_SENDEROS.findIndex((s) => s.num === sendero.num) : -1;
    return {
      prevNum: i > 0 ? CABALA_SENDEROS[i - 1].num : null,
      nextNum: i >= 0 && i < CABALA_SENDEROS.length - 1 ? CABALA_SENDEROS[i + 1].num : null,
    };
  }, [sendero]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (sendero) setAnswers(new Array(sendero.test.length).fill(0));

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!sendero) { navigate("/metodo/cabala/senderos"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const prevData = res.data?.data ?? {};
          dataRef.current = prevData;
          const saved = prevData?.senderos?.[sendero.num];
          if (Array.isArray(saved) && saved.length === sendero.test.length) setAnswers(saved.map((n: any) => Number(n) || 0));
        } catch { /* sin progreso */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [num, navigate, sendero]);

  const guardar = (idx: number, valor: number) => {
    if (!sendero) return;
    const nuevas = [...answers];
    nuevas[idx] = valor;
    setAnswers(nuevas);
    const prev = dataRef.current ?? {};
    const nextData = { ...prev, senderos: { ...(prev.senderos ?? {}), [sendero.num]: nuevas } };
    dataRef.current = nextData;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data: nextData }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  };

  /**
   * Navegar SIEMPRE por aquí, nunca con `navigate` a pelo.
   *
   * Cada respuesta del test dispara un PATCH que reescribe el blob `data`
   * entero. Si se cambia de sendero antes de que ese guardado llegue, la página
   * siguiente lee datos viejos y su primer guardado revierte la última respuesta
   * escrita: el test se queda con un 0 y la puerta del Diagnóstico no se abre
   * aunque la persona lo haya rellenado todo. `flushSaves` espera a que no quede
   * ningún guardado en vuelo.
   */
  const ir = async (ruta: string) => {
    await flushSaves();
    navigate(ruta);
  };

  if (loading || !sendero) {
    return <CabalaLoading />;
  }

  const tieneContenido = sendero.une.length > 0 || sendero.test.length > 0;
  const completo = senderoCompleto(sendero, answers);
  const total = puntuacionSendero(sendero, answers);
  const banda = completo ? interpretacionSendero(sendero, total) : null;

  // El botón «Diagnóstico →» del último sendero sólo se habilita cuando LOS 22
  // senderos están rellenos. Se combina lo ya guardado con lo respondido en vivo
  // en este sendero.
  const contenidoSenderos = senderosContenidoCompleto({
    ...(dataRef.current?.senderos ?? {}),
    [sendero.num]: answers,
  });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title={`${sendero.letra} (${sendero.hebreo})`}
              pageLabel={`${paginaSendero(sendero.orden)}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={prevNum
                ? { label: `← ${senderoPorNum[prevNum]?.letra ?? "Anterior"}`, onClick: () => void ir(`/metodo/cabala/sendero/${prevNum}`) }
                : { label: "← Los senderos", onClick: () => void ir("/metodo/cabala/senderos") }}
              extra={{ label: "Ilustraciones", onClick: () => setIlusOpen(true)}}
              next={nextNum
                ? { label: `${senderoPorNum[nextNum]?.letra ?? "Siguiente"} →`, onClick: () => void ir(`/metodo/cabala/sendero/${nextNum}`), disabled: !completo, disabledTooltip: "Completa el test de este sendero para pasar a la siguiente letra" }
                : { label: "Diagnóstico →", onClick: () => void ir("/metodo/cabala/senderos/diagnostico"), disabled: !contenidoSenderos, disabledTooltip: "Completa el test de los 22 senderos para ver tu Diagnóstico" }}
            />
          </Reveal>

          {/* ── Cabecera del sendero ── */}
          <Reveal direction="up" distance={18} delay={0.08} duration={0.65} w="100%">
            <Box w="100%" position="relative" overflow="hidden"
                 borderRadius="3xl" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={cabalaNom} borderRadius="3xl" />
              <Flex position="relative" zIndex={1} align="center" gap={{ base: 5, md: 7 }} direction={{ base: "column", sm: "row" }}
                    textAlign={{ base: "center", sm: "left" }} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                {/* La foto del sendero abre la cabecera: es lo primero que se ve
                    y deja identificada la letra de un vistazo. Pinchándola se
                    abre su ilustración a pantalla completa. */}
                {fotoSenderoIlustracion(sendero.num) && (
                  <CabalaFotoIlustracion
                    src={fotoSenderoIlustracion(sendero.num)!}
                    alt={`${sendero.letra} (${sendero.hebreo})`}
                    onClick={() => setFotoOpen(true)}
                    size={{ base: "100%", sm: "150px", md: "180px", lg: "200px" }}
                    maxW={{ base: "260px", sm: "150px", md: "180px", lg: "200px" }}
                  />
                )}
                {/* La letra hebrea baja de tamaño ahora que comparte fila con la
                    foto: sigue siendo el emblema, pero sin comerse la cabecera. */}
                <Text fontSize={{ base: "64px", md: "84px" }} lineHeight="1" color={cabalaTxt} flexShrink={0}
                      style={{ textShadow: `0 0 26px ${cabalaTxt}88, 0 0 60px ${cabalaTxt}44` }}>
                  {sendero.hebreo}
                </Text>
                <Box>
                  <Text color={`${cabalaTxt}cc`} fontSize="sm" letterSpacing="0.18em" textTransform="uppercase"
                        style={{ textShadow: INK_SHADOW }}>
                    Sendero {sendero.letra}
                  </Text>
                  <Text color={cabalaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.15" mt={1}
                        style={{ textShadow: `0 0 20px ${cabalaTxt}55` }}>
                    {sendero.titulo || `De ${NOMBRE_SEFIRA[sendero.from]} a ${NOMBRE_SEFIRA[sendero.to]}`}
                  </Text>
                  <Flex align="center" gap={3} mt={3} justify={{ base: "center", sm: "flex-start" }} wrap="wrap">
                    <Text color={`${cabalaTxt}ee`} fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
                          style={{ textShadow: INK_SHADOW }}>
                      {NOMBRE_SEFIRA[sendero.from]} → {NOMBRE_SEFIRA[sendero.to]}
                    </Text>
                    {sendero.palabraClave && (
                      <Text color={cabalaTxt} fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase"
                            bg={`${cabalaTxt}18`} border={`1.5px solid ${cabalaTxt}55`} borderRadius="full" px={3} py={1}>
                        {sendero.palabraClave}
                      </Text>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Reveal>

          {!tieneContenido && (
            <Text color="rgba(255,255,255,0.85)" fontStyle="italic" textAlign="center" style={{ textShadow: INK_SHADOW }}>
              Contenido próximamente.
            </Text>
          )}

          {/* ── Significado tradicional ── */}
          {sendero.significadoTradicional && (
            <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
              <Caja>
                <TituloCaja>Significado tradicional</TituloCaja>
                <Divisor />
                <Text color={`${cabalaTxt}f2`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85" whiteSpace="pre-line"
                      style={{ textShadow: INK_SHADOW }}>
                  {sendero.significadoTradicional}
                </Text>
              </Caja>
            </Reveal>
          )}

          {/* ── Traducción psicológica ── */}
          {sendero.traduccionPsicologica && (
            <Reveal direction="up" distance={20} delay={0.14} duration={0.6} w="100%">
              <Caja>
                <TituloCaja>Traducción psicológica</TituloCaja>
                <Divisor />
                <Text color={`${cabalaTxt}f2`} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85" whiteSpace="pre-line"
                      style={{ textShadow: INK_SHADOW }}>
                  {sendero.traduccionPsicologica}
                </Text>
              </Caja>
            </Reveal>
          )}

          {/* ── Pregunta de reflexión ── */}
          {sendero.pregunta && (
            <Reveal direction="up" distance={16} delay={0.16} duration={0.6} display="flex" justifyContent="center">
              <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontStyle="italic" fontWeight="600"
                    textAlign="center" maxW="640px" lineHeight="1.5" style={{ textShadow: INK_SHADOW }}>
                {sendero.pregunta}
              </Text>
            </Reveal>
          )}

          {/* ── ¿Qué une este sendero? ── */}
          {sendero.une.length > 0 && (
            <Reveal direction="up" distance={20} delay={0.18} duration={0.6} w="100%">
              <Caja>
                <TituloCaja>¿Qué une este sendero?</TituloCaja>
                <Divisor />
                <Parrafos items={sendero.une} />
              </Caja>
            </Reveal>
          )}

          {/* ── Test ── */}
          {sendero.test.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.2} duration={0.65} w="100%">
              <Caja>
                <TituloCaja>Test</TituloCaja>
                <Divisor />
                {sendero.testTitulo && (
                  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.5" mb={2} style={{ textShadow: INK_SHADOW }}>
                    {sendero.testTitulo}
                  </Text>
                )}
                {/* Leyenda de la escala (qué significa cada número 1–5) */}
                <Flex gap={{ base: 2, md: 4 }} mb={5} wrap="wrap">
                  {ESCALA.map((op) => (
                    <Text key={op.valor} color={`${cabalaTxt}cc`} fontSize="xs" style={{ textShadow: INK_SHADOW }}>
                      <Box as="span" fontWeight="800" color={cabalaTxt}>{op.valor}</Box> {op.label}
                    </Text>
                  ))}
                </Flex>

                {/* Cada pregunta a la izquierda y, a la derecha, un box para poner
                    el número (1–5). */}
                <RevealStagger inView display="flex" flexDirection="column" gap={{ base: 3.5, md: 4 }}>
                  {sendero.test.map((preg, qi) => {
                    const val = answers[qi];
                    const relleno = val >= 1 && val <= 5;
                    return (
                      <RevealItem key={qi}>
                        <Flex align="center" gap={{ base: 3, md: 5 }}>
                          <Text flex="1" color={`${cabalaTxt}f0`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.55"
                                style={{ textShadow: INK_SHADOW }}>
                            <Box as="span" color={cabalaTxt} fontWeight="700" mr={1.5}>{qi + 1}.</Box>
                            {preg.texto}
                          </Text>
                          <Box
                            as="input"
                            // type="text" + filtro de dígitos, NO type="number":
                            // el input numérico deja teclear «e», «+», «-» o «,»
                            // y la letra se queda pintada en la caja.
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            aria-label={`Respuesta pregunta ${qi + 1} (1 a 5)`}
                            placeholder="—"
                            value={relleno ? String(val) : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const digitos = e.target.value.replace(/\D/g, "");
                              if (!digitos) { guardar(qi, 0); return; }
                              guardar(qi, Math.max(1, Math.min(5, parseInt(digitos, 10))));
                            }}
                            flexShrink={0}
                            w={{ base: "56px", md: "64px" }}
                            h={{ base: "48px", md: "52px" }}
                            textAlign="center"
                            borderRadius="xl"
                            bg={relleno ? `${cabalaTxt}22` : `${cabalaTxt}10`}
                            color={cabalaTxt}
                            border={`1.5px solid ${relleno ? cabalaTxt : `${cabalaTxt}44`}`}
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight="800"
                            boxShadow={relleno ? `0 0 14px ${cabalaTxt}66` : "none"}
                            transition="all 0.14s"
                            sx={{
                              caretColor: cabalaTxt,
                              "::placeholder": { color: `${cabalaTxt}55`, fontWeight: 400 },
                            }}
                            _hover={{ borderColor: `${cabalaTxt}88` }}
                            _focus={{ outline: "none", borderColor: cabalaTxt, boxShadow: `0 0 16px ${cabalaTxt}88` }}
                          />
                        </Flex>
                      </RevealItem>
                    );
                  })}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}

          {/* ── Interpretación ── */}
          {sendero.interpretaciones.length > 0 && (
            <Reveal direction="up" distance={22} delay={0.24} duration={0.65} w="100%">
              <Caja>
                <Flex align="baseline" justify="space-between" gap={3} wrap="wrap">
                  <TituloCaja>Interpretación</TituloCaja>
                  {completo && (
                    <Text color={cabalaTxt} fontSize="sm" fontWeight="700">Tu puntuación: {total}</Text>
                  )}
                </Flex>
                <Divisor />
                {!completo && (
                  <Text color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={4}
                        style={{ textShadow: INK_SHADOW }}>
                    Responde las 5 preguntas para ver tu interpretación.
                  </Text>
                )}
                <RevealStagger inView display="flex" flexDirection="column" gap={3}>
                  {sendero.interpretaciones.map((b, i) => {
                    const activa = !!banda && banda.min === b.min && banda.max === b.max;
                    return (
                      <RevealItem key={i}>
                      <Box borderRadius="xl" px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}
                           bg={activa ? `${cabalaTxt}1e` : `${cabalaTxt}08`}
                           border={`1px solid ${activa ? cabalaTxt : `${cabalaTxt}22`}`}
                           boxShadow={activa ? `0 0 18px ${cabalaTxt}55` : "none"}
                           opacity={completo && !activa ? 0.55 : 1} transition="all 0.2s">
                        <Flex align="baseline" gap={2} mb={1} wrap="wrap">
                          <Text color={`${cabalaTxt}88`} fontSize="xs" fontWeight="700" letterSpacing="0.08em">{b.min}–{b.max}</Text>
                          <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>{b.titulo}</Text>
                        </Flex>
                        <Text color={`${cabalaTxt}e8`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                              style={{ textShadow: INK_SHADOW }}>{b.texto}</Text>
                      </Box>
                      </RevealItem>
                    );
                  })}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}

          {/* ── Señales de práctica ── */}
          {sendero.senales.length > 0 && (
            <Reveal direction="up" distance={20} delay={0.28} duration={0.6} w="100%">
              <Caja>
                <TituloCaja>Señales de desequilibrio</TituloCaja>
                <Divisor />
                <Text color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mb={3.5}
                      style={{ textShadow: INK_SHADOW }}>
                  Durante esta semana observa si…
                </Text>
                <RevealStagger inView display="flex" flexDirection="column" gap={2.5}>
                  {sendero.senales.map((s, i) => (
                    <RevealItem key={i}>
                    <Flex align="flex-start" gap={3}>
                      <Box flexShrink={0} mt="10px" w="6px" h="6px" borderRadius="full" bg={cabalaTxt}
                           boxShadow={`0 0 8px ${cabalaTxt}aa`} />
                      <Text color={`${cabalaTxt}f2`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                            style={{ textShadow: INK_SHADOW }}>{s}</Text>
                    </Flex>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Caja>
            </Reveal>
          )}

          {/* ── Has cruzado este umbral cuando… ── */}
          {sendero.umbral && (
            <Reveal direction="up" distance={20} delay={0.3} duration={0.6} w="100%">
              <Caja>
                <TituloCaja>Has cruzado este umbral cuando…</TituloCaja>
                <Divisor />
                <Text color={`${cabalaTxt}ff`} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.8"
                      style={{ textShadow: INK_SHADOW }}>
                  {sendero.umbral}
                </Text>
              </Caja>
            </Reveal>
          )}

          {/* ── Frase de integración: directamente sobre el fondo (turquesa), sin box ── */}
          {sendero.integracion && (
            <Reveal direction="up" distance={18} delay={0.32} duration={0.7} w="100%" display="flex" justifyContent="center">
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic" fontWeight="600" textAlign="center"
                    maxW="680px" lineHeight="1.7" px={{ base: 2, md: 0 }} mt={{ base: 2, md: 4 }}
                    style={{ textShadow: INK_SHADOW }}>
                “{sendero.integracion}”
              </Text>
            </Reveal>
          )}

          {/* ── Botón «Siguiente» discreto, al final del todo ── */}
          {/* En el último sendero, «Ver diagnóstico» sólo se habilita cuando los
              22 senderos están rellenos (misma puerta que el botón del header). */}
          {(() => {
            // No se puede pasar a la siguiente letra sin completar el test de
            // este sendero; en el último, se exige tener los 22 completos.
            const bloqueado = nextNum ? !completo : !contenidoSenderos;
            const tooltip = nextNum
              ? "Completa el test de este sendero para pasar a la siguiente letra"
              : "Completa el test de los 22 senderos para ver tu Diagnóstico";
            return (
              <Reveal direction="up" distance={14} delay={0.4} duration={0.6} display="flex" justifyContent="center">
                <Box as="button"
                     onClick={bloqueado ? undefined : () => void ir(nextNum ? `/metodo/cabala/sendero/${nextNum}` : "/metodo/cabala/senderos/diagnostico")}
                     disabled={bloqueado}
                     title={bloqueado ? tooltip : undefined}
                     mt={{ base: 2, md: 4 }}
                     display="inline-flex" alignItems="center" gap={2.5}
                     // Es el botón que lleva al siguiente sendero: tiene que
                     // CANTAR sobre el turquesa. Relleno oscuro de la disciplina,
                     // contorno ámbar entero y halo, en vez del contorno fino que
                     // casi no se veía. Bloqueado sí va apagado: es una puerta.
                     px={{ base: 8, md: 10 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                     bg={bloqueado ? "transparent" : `${cabalaBg}ee`}
                     border={`2px solid ${bloqueado ? `${cabalaTxt}33` : cabalaTxt}`}
                     color={bloqueado ? `${cabalaTxt}55` : cabalaTxt}
                     fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.06em"
                     boxShadow={bloqueado ? "none" : `0 0 18px ${cabalaTxt}55, 0 0 44px ${cabalaTxt}26, 0 6px 22px rgba(0,0,0,0.35)`}
                     style={bloqueado ? undefined : { textShadow: `0 0 14px ${cabalaTxt}66` }}
                     cursor={bloqueado ? "not-allowed" : "pointer"} transition="all 0.18s" sx={{ backdropFilter: "blur(2px)" }}
                     _hover={bloqueado ? undefined : { bg: `${cabalaTxt}2e`, transform: "translateY(-2px)", boxShadow: `0 0 26px ${cabalaTxt}88, 0 0 60px ${cabalaTxt}3a, 0 8px 26px rgba(0,0,0,0.4)` }}>
                  {nextNum ? "Siguiente sendero" : "Ver diagnóstico"}
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                </Box>
              </Reveal>
            );
          })()}
        </Flex>
      </Flex>

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />

      {/* Galería de ilustraciones de Cábala (Origen · Sefirot · Senderos). */}
      <CabalaIlustracionesModal isOpen={ilusOpen} onClose={() => setIlusOpen(false)} />

      {/* Ilustración de ESTE sendero, abierta desde su foto. Se le pasa la
          secuencia de los 22 para poder seguir con las flechas. */}
      <CabalaSefiraIlustracionModal
        isOpen={fotoOpen}
        vinetas={CABALA_SENDERO_VINETAS}
        initialIndex={indiceIlustracionSendero(sendero.num)}
        onClose={() => setFotoOpen(false)}
      />
    </Box>
  );
}
