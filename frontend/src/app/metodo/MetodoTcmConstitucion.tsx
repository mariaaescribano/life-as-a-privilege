import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem, Pop } from "../../components/global/Reveal";
import { FotoBox, glowHeader } from "../../components/metodo/FotoBox";
import { focoBlanco } from "../../components/global/foco";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { TestConstitucion } from "../../components/metodo/TestConstitucion";
import { ConstitucionComicModal } from "../../components/metodo/ConstitucionComicModal";
import { flushSaves } from "../../utils/flushSaves";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ORDEN_ELEMENTOS, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import {
  CONSTITUCIONES, FOTO_CONSTITUCION, FOTO_CONSTITUCION_RESERVA,
  constitucionCompleta, puntuacionesConstitucion, respuestasConstitucion,
} from "../../components/metodo/tcmConstitucion";
import { ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { useNombresElementos } from "../../components/metodo/tcmElementosEn";
import { verticePentagono, idxElemento } from "../../components/metodo/tcmCiclosVisual";
import { useIdioma, useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// PASO 3 · TU CONSTITUCIÓN
//
// SIN el test hecho, aquí solo está el test (una frase cada vez, ver
// TestConstitucion): las cinco constituciones NO se enseñan antes, para no
// condicionar las respuestas. Al terminar:
//
//   · Arriba, el RESULTADO: un box con la pintura de TCM, la frase «Has hecho
//     el test y este es tu resultado», en grande lo que te ha tocado (con el
//     pentágono de los cinco porcentajes) y abajo a la derecha «Repetir el
//     test», que vuelve a abrir las frases.
//   · Debajo, las CINCO CONSTITUCIONES como tarjetas (3+2 en ordenador, una
//     bajo otra en móvil): solo la foto y «EL PIONERO · LA MADERA». El
//     «Saber más» abre el cómic inmersivo del tipo (ConstitucionComicModal),
//     que lo cuenta punto por punto.
//
// Es el «quién eres», NO el «qué te pasa hoy»: ese es el Diagnóstico (paso 5).
// ─────────────────────────────────────────────────────────────────────────

// El velo de las cajas es fino (se quiere ver la pintura de TCM detrás), así
// que la letra se sostiene con halo de tinta, no tapando la foto.
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;

const R_PENT = 104;      // el mismo radio que la estrella de los ciclos
const FOTO_R = 24;

// El artículo de cada elemento, para el rótulo «EL PIONERO · LA MADERA».
const ARTICULO: Record<Elemento, string> = {
  madera: "la", fuego: "el", tierra: "la", metal: "el", agua: "el",
};

export default function MetodoTcmConstitucion() {
  const t = useT();
  const { idioma } = useIdioma();
  const navigate = useNavigate();
  const nombres = useNombresElementos();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  // Con el test hecho, «Repetir el test» vuelve a enseñar las frases (y
  // esconde el resultado y las tarjetas mientras tanto).
  const [repitiendo, setRepitiendo] = useState(false);
  // La constitución cuyo cómic está abierto (el «Saber más» de su tarjeta).
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  const fondosListos = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    // Las pinturas de los elementos son la reserva de tarjetas y cómic: están
    // seguro. Las ilustraciones propias, si aún no existen, fallan rápido y no
    // retienen nada (el onerror también cuenta como lista).
    ...ORDEN_ELEMENTOS.map((el) => FOTO_CONSTITUCION_RESERVA[el]),
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        // Las dos peticiones a la vez, no en cascada: la página suelta antes el loader.
        const [me, res] = await Promise.all([
          getUserMe(),
          axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        setData(res.data?.data ?? {});
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const respuestas = useMemo(() => respuestasConstitucion(data), [data]);
  const completo = constitucionCompleta(respuestas);
  const puntos = useMemo(() => puntuacionesConstitucion(respuestas), [respuestas]);
  const tuya: Elemento | null = completo ? puntos[0].elemento : null;
  const segunda: Elemento | null = completo ? puntos[1].elemento : null;

  // Mientras el test no está (o se está repitiendo), NO se enseñan ni el
  // resultado ni las cinco constituciones: leerlas antes condiciona el test.
  const mostrarTest = !completo || repitiendo;
  const mostrarResultado = completo && !repitiendo && !!tuya;

  // «EL PIONERO · LA MADERA» (en inglés sin artículo: «The Pioneer · Wood»).
  const rotuloDe = (el: Elemento) =>
    `${CONSTITUCIONES[el].arquetipo} · ${idioma === "en" ? nombres[el] : `${ARTICULO[el]} ${nombres[el]}`}`;

  // Los ciclos piden el test hecho: si el último «Sí/No» sigue viajando a la
  // BD, se espera a que llegue o la página de al lado rebotaría.
  const irAlSiguiente = async () => {
    await flushSaves();
    navigate("/metodo/tcm/ciclos");
  };

  if (loading || !fondosListos) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" alignItems="center" justifyContent="center">
        <TcmLoader color="#ffffff" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.tcm.paso.constitucion")}
            pageLabel="3/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: `← ${t("metodo.tcm.paso.elementos")}`, onClick: () => navigate("/metodo/tcm/elementos") }}
            extra={ilustracionesBtn}
            next={{
              label: `${t("metodo.tcm.paso.ciclos")} →`,
              // Sin el test hecho no se pasa: los ciclos y todo lo que viene
              // después se leen ya sabiendo cuál es tu elemento de fondo.
              onClick: () => { if (completo) void irAlSiguiente(); },
              disabled: !completo,
              disabledTooltip: t("metodo.tcm.constitucion.bloqueo"),
            }}
          />
          </Reveal>

          {/* Sobre el turquesa: blanco y sin sombra (regla de la casa). */}
          <Reveal direction="up" distance={20} delay={0.1} duration={0.65} display="flex" justifyContent="center">
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center" maxW="680px">
              {t("metodo.tcm.constitucion.intro")}
            </Text>
          </Reveal>

          {/* ── El resultado (solo con el test terminado) ───────────────── */}
          {mostrarResultado && tuya && (
            <Reveal direction="up" distance={24} duration={0.7} w="100%" display="flex">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tcmTxt)}>
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
                {/* Velos finos (hex-alpha): que la pintura se vea detrás. */}
                <Box position="absolute" inset={0} bg={`${tcmBg}66`} />
                <Box position="absolute" inset={0} bg="#00000040" />
                <Flex position="relative" direction="column" gap={{ base: 5, md: 6 }}
                      px={{ base: 5, md: 9 }} py={{ base: 6, md: 8 }}
                      style={{ textShadow: INK_SHADOW }}>

                  <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 6, md: 9 }}>
                    {/* El pentágono con los cinco porcentajes, SOLO, a la
                        izquierda (arriba en móvil): equilibra el rectángulo. */}
                    <Box flexShrink={0} w={{ base: "240px", md: "300px" }}>
                      <PentagonoConstitucion puntos={puntos} />
                    </Box>

                    {/* Cascada: el pentágono se dibuja y, a su lado, el rótulo,
                        el nombre, el lema y «y detrás» van entrando en orden.
                        `key={tuya}`: si al repetir el test cambia el resultado,
                        la cascada se vuelve a lanzar. */}
                    <RevealStagger key={tuya} stagger={0.16} delayChildren={0.7}
                                   display="flex" flexDirection="column" gap={2.5}
                                   textAlign={{ base: "center", md: "left" }} flex="1">
                      {/* El «has hecho el test…» abre la columna del resultado,
                          no el box entero. */}
                      <RevealItem direction="up" distance={12}>
                      <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em"
                            textTransform="uppercase" opacity={0.9} mb={1}>
                        {t("metodo.tcm.constitucion.resultado")}
                      </Text>
                      </RevealItem>
                      <RevealItem direction="up" distance={22} scaleFrom={0.96} blur>
                      <Text color={tcmTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="800"
                            lineHeight="1.1" textTransform="uppercase" letterSpacing="0.04em">
                        {rotuloDe(tuya)}
                      </Text>
                      </RevealItem>
                      <RevealItem direction="up" distance={14}>
                      <Text color={tcmTxt} fontSize={{ base: "lg", md: "2xl" }} fontStyle="italic">
                        {CONSTITUCIONES[tuya].lema}
                      </Text>
                      </RevealItem>
                      {segunda && (
                        <RevealItem direction="up" distance={12}>
                        <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} opacity={0.9} mt={1}>
                          {t("metodo.tcm.constitucion.segundo")}: {nombres[segunda]} ({CONSTITUCIONES[segunda].arquetipo}).
                        </Text>
                        </RevealItem>
                      )}
                    </RevealStagger>
                  </Flex>

                  {/* Repetir el test, abajo a la derecha. */}
                  <Flex justify="flex-end">
                    <Pop levanta={2}>
                    <Box as="button" onClick={() => setRepitiendo(true)}
                         px={{ base: 6, md: 8 }} py={{ base: 2, md: 2.5 }} borderRadius="full"
                         bg="transparent" color={tcmTxt} border={`1px solid ${tcmTxt}88`}
                         fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }}
                         fontWeight="700" fontStyle="italic" cursor="pointer"
                         transition="background-color 0.15s, transform 0.18s ease"
                         _hover={{ bg: `${tcmTxt}22`, transform: "translateY(-1px)" }}
                         _focusVisible={focoBlanco}
                         style={{ textShadow: "none" }}>
                      {t("metodo.tcm.constitucion.repetir")}
                    </Box>
                    </Pop>
                  </Flex>
                </Flex>
              </Box>
            </Reveal>
          )}

          {/* ── El test, en la propia página (solo mientras hace falta) ────
              El bloque de frases entra con un leve deslizamiento al montar. */}
          {mostrarTest && (
            <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%">
              <TestConstitucion
                data={data}
                onChangeData={setData}
                onCompletar={() => { setRepitiendo(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onTerminar={() => { setRepitiendo(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            </Reveal>
          )}

          {/* ── Las cinco constituciones: tarjetas 3+2 (columna en móvil) ── */}
          {mostrarResultado && (
            <>
              <Flex wrap="wrap" justify="center" gap={5} w="100%">
                {ORDEN_ELEMENTOS.map((el, i) => (
                  <Reveal key={el} inView direction="up" distance={26} duration={0.6}
                          delay={(i % 3) * 0.12} amount={0.2}
                          w={{ base: "100%", md: "calc(33.333% - 14px)" }} display="flex">
                    <FotoBox
                      foto={FOTO_CONSTITUCION[el]}
                      fotoReserva={FOTO_CONSTITUCION_RESERVA[el]}
                      nom={tcmNom}
                      tinta={tcmTxt}
                      bg={tcmBg}
                      vivo
                      glow={tuya === el ? glowHeader(tcmTxt) : undefined}
                      visto={tuya === el}
                      onClick={() => setComicEl(el)}
                      titulo={
                        <>
                          <Box as="span" display="block" textTransform="uppercase"
                               letterSpacing="0.06em" fontSize={{ base: "md", md: "lg" }}>
                            {rotuloDe(el)}
                          </Box>
                          <Box as="span" display="block" mt={0.5} fontStyle="italic"
                               fontWeight="600" fontSize={{ base: "sm", md: "sm" }} opacity={0.85}>
                            {t("metodo.tcm.constitucion.saberMas")}
                          </Box>
                        </>
                      }
                    />
                  </Reveal>
                ))}
              </Flex>

              <Reveal inView direction="up" distance={14} duration={0.6} amount={0.3} display="flex" justifyContent="center">
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center"
                      maxW="640px" lineHeight="1.6">
                  {t("metodo.tcm.constitucion.aviso")}
                </Text>
              </Reveal>
            </>
          )}

          {/* El paso siguiente solo se abre con el test hecho. */}
          {!completo && (
            <Text color="white" fontSize="sm" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.7">
              {t("metodo.tcm.constitucion.bloqueo")}
            </Text>
          )}
          {/* Sin botón de fin de página (decisión de María): a Los ciclos se
              pasa desde el botón del header. */}
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* El cómic de la constitución pulsada (Saber más). */}
      <ConstitucionComicModal elemento={comicEl} onClose={() => setComicEl(null)} />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// El pentágono del resultado: el contorno al 100% y, dentro, el polígono de
// tus cinco porcentajes. Cada vértice lleva el icono de su elemento y su %.
// (Es el Self-Assessment Profile del libro, dibujado a la manera de la casa.)
// ─────────────────────────────────────────────────────────────────────────
const MotionG = motion.g as any;
const MotionPolygon = motion.polygon as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;

/** Porcentaje que CUENTA hasta su valor (dentro de un <text> de SVG, donde el
 *  `Contador` de Reveal —que pinta un <span>— no vale). */
function PctSvg({ valor, activo, delay, x, y }: {
  valor: number; activo: boolean; delay: number; x: number; y: number;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) { setN(valor); return; }
    if (!activo) return;
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const paso = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1100));
      setN(Math.round(valor * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor, activo, delay, reduce]);
  return (
    <text x={x} y={y} textAnchor="middle" fill={tcmTxt}
          fontFamily="'EB Garamond', serif" fontSize="15" fontWeight="700">
      {n}%
    </text>
  );
}

function PentagonoConstitucion({ puntos }: {
  puntos: { elemento: Elemento; pct: number }[];
}) {
  // Los puntos vienen ordenados por puntuación; para dibujar hacen falta en el
  // orden del ciclo, que es el que fija la geometría del pentágono.
  const porElemento = new Map(puntos.map((p) => [p.elemento, p.pct]));

  const radar = ORDEN_ELEMENTOS.map((el) => {
    // Suelo del 12% para que un elemento con cero «sí» siga siendo un punto
    // visible y el polígono no se rompa hacia el centro.
    const pct = porElemento.get(el) ?? 0;
    const v = verticePentagono(idxElemento(el), R_PENT * (0.12 + 0.88 * pct));
    return `${v.x},${v.y}`;
  }).join(" ");

  // Coreografía (al asomar el pentágono): los anillos se DIBUJAN de fuera a
  // dentro, tu perfil BROTA desde el centro con rebote, los cinco iconos
  // florecen y los porcentajes cuentan. Después, el perfil respira despacio.
  const reduce = useReducedMotion();
  const ref = useRef<any>(null);
  const visto = useInView(ref, { once: true, amount: 0.3 });
  const enter = reduce || visto;

  return (
    <Box as="svg" ref={ref} viewBox="0 0 300 300" w="100%" h="auto">
      {/* Contorno (el 100%) y dos anillos de referencia */}
      {[1, 0.66, 0.33].map((f, k) => (
        <MotionPolygon key={f} points={ORDEN_ELEMENTOS.map((el) => {
          const v = verticePentagono(idxElemento(el), R_PENT * f);
          return `${v.x},${v.y}`;
        }).join(" ")}
          fill="none" stroke={`${tcmTxt}${f === 1 ? "88" : "33"}`} strokeWidth={f === 1 ? 1.4 : 1}
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={reduce ? {} : (enter ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 })}
          transition={{ duration: 0.9, delay: 0.1 + k * 0.14, ease: "easeInOut" }} />
      ))}

      {/* Tu perfil: brota desde el centro y luego respira */}
      <MotionG
        style={{ transformBox: "view-box", transformOrigin: "150px 150px" }}
        initial={reduce ? false : { opacity: 0, scale: 0.05 }}
        animate={reduce ? {} : (enter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.05 })}
        transition={{ delay: 0.75, duration: 0.9, ease: EASE_POP }}>
        <MotionG
          style={{ transformBox: "view-box", transformOrigin: "150px 150px" }}
          animate={reduce || !enter ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}>
          <polygon points={radar} fill={`${tcmTxt}3a`} stroke={tcmTxt} strokeWidth={2}
                   strokeLinejoin="round"
                   style={{ filter: `drop-shadow(0 0 6px ${tcmTxt}66)` }} />
        </MotionG>
      </MotionG>

      {/* Los cinco vértices: icono + porcentaje */}
      {ORDEN_ELEMENTOS.map((el, i) => {
        const v = verticePentagono(idxElemento(el), R_PENT);
        const pct = Math.round((porElemento.get(el) ?? 0) * 100);
        // La etiqueta, un poco más afuera que el icono, siguiendo el radio.
        const fuera = verticePentagono(idxElemento(el), R_PENT + 34);
        const delay = 0.5 + i * 0.12;
        return (
          <MotionG key={el}
            style={{ transformBox: "view-box", transformOrigin: `${v.x}px ${v.y}px` }}
            initial={reduce ? false : { opacity: 0, scale: 0.3 }}
            animate={reduce ? {} : (enter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 })}
            transition={{ delay, duration: 0.55, ease: EASE_POP }}>
            <clipPath id={`cons-clip-${el}`}>
              <circle cx={v.x} cy={v.y} r={FOTO_R} />
            </clipPath>
            <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} stroke={tcmTxt} strokeWidth={1.5} />
            <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                   width={FOTO_R * 2} height={FOTO_R * 2}
                   clipPath={`url(#cons-clip-${el})`} preserveAspectRatio="xMidYMid slice" />
            <PctSvg valor={pct} activo={enter} delay={delay + 0.3} x={fuera.x} y={fuera.y + 4} />
          </MotionG>
        );
      })}
    </Box>
  );
}
