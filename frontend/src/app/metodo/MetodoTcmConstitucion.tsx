import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { glowHeader } from "../../components/metodo/FotoBox";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { TestConstitucionModal } from "../../components/metodo/TestConstitucionModal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import {
  CONSTITUCIONES, constitucionCompleta, puntuacionesConstitucion, respuestasConstitucion,
} from "../../components/metodo/tcmConstitucion";
import { ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { useNombresElementos } from "../../components/metodo/tcmElementosEn";
import { verticePentagono, idxElemento } from "../../components/metodo/tcmCiclosVisual";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// PASO 3 · TU CONSTITUCIÓN
//
// Cinco tarjetas (una por constitución) y, arriba, el botón del test. Al
// terminarlo aparece el resultado aquí mismo —el pentágono con los cinco
// porcentajes y tu elemento— y la tarjeta que te toca se enciende.
//
// Es el «quién eres», NO el «qué te pasa hoy»: ese es el Diagnóstico (paso 5).
// El texto lo dice en voz alta porque, si no, se confunden.
// ─────────────────────────────────────────────────────────────────────────

// El velo de las cajas es fino (se quiere ver la pintura de TCM detrás), así
// que la letra se sostiene con halo de tinta, no tapando la foto.
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;

const R_PENT = 104;      // el mismo radio que la estrella de los ciclos
const FOTO_R = 24;

export default function MetodoTcmConstitucion() {
  const t = useT();
  const navigate = useNavigate();
  const nombres = useNombresElementos();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [testAbierto, setTestAbierto] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  const fondosListos = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    ...ORDEN_ELEMENTOS.map((el) => CONSTITUCIONES[el].foto),
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
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

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
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
              onClick: () => { if (completo) navigate("/metodo/tcm/ciclos"); else setTestAbierto(true); },
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

          {/* El botón del test, arriba del todo */}
          <Reveal direction="up" distance={14} delay={0.16} duration={0.6} display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={2}>
              <Box as="button" onClick={() => setTestAbierto(true)}
                   position="relative" overflow="hidden"
                   px={{ base: 8, md: 12 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                   border={`1px solid ${tcmTxt}99`} boxShadow={glowHeader(tcmTxt)}
                   transition="transform 0.18s ease" _hover={{ transform: "translateY(-2px)" }}>
                <DisciplinaBgLayer nom={tcmNom} borderRadius="full" />
                <Box position="absolute" inset={0} bg={`${tcmBg}cc`} />
                <Text position="relative" color={tcmTxt} fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="800" letterSpacing="0.08em">
                  {completo
                    ? t("metodo.tcm.constitucion.repetir")
                    : t("metodo.tcm.constitucion.hacer")}
                </Text>
              </Box>
              {/* Fuera del botón, ni cuentas ni números: solo si está hecho o
                  el aviso de que el test se hace de una sentada. */}
              <Text color="white" fontSize="sm" opacity={0.9} textAlign="center" maxW="560px" lineHeight="1.6">
                {completo
                  ? t("metodo.tcm.constitucion.hecho")
                  : t("metodo.tcm.constitucion.deUnaSentada")}
              </Text>
            </Flex>
          </Reveal>

          {/* ── El resultado (solo con el test terminado) ───────────────── */}
          {completo && tuya && (
            <Reveal inView direction="up" distance={24} duration={0.7} amount={0.2} w="100%" display="flex">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tcmTxt)}>
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
                <Box position="absolute" inset={0} bg={`${tcmBg}9e`} />
                <Flex position="relative" direction={{ base: "column", md: "row" }}
                      align="center" gap={{ base: 6, md: 9 }}
                      px={{ base: 5, md: 9 }} py={{ base: 6, md: 8 }}
                      style={{ textShadow: INK_SHADOW }}>

                  {/* El pentágono con los cinco porcentajes */}
                  <Box flexShrink={0} w={{ base: "240px", md: "300px" }}>
                    <PentagonoConstitucion puntos={puntos} />
                  </Box>

                  <Flex direction="column" gap={2.5} textAlign={{ base: "center", md: "left" }}>
                    <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.18em"
                          textTransform="uppercase" opacity={0.85}>
                      {t("metodo.tcm.constitucion.tuElemento")}
                    </Text>
                    <Text color={tcmTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="800" lineHeight="1.1">
                      {nombres[tuya]}
                    </Text>
                    <Text color={tcmTxt} fontSize={{ base: "lg", md: "2xl" }} fontStyle="italic">
                      {CONSTITUCIONES[tuya].arquetipo} · {CONSTITUCIONES[tuya].lema}
                    </Text>
                    {segunda && (
                      <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} opacity={0.9} mt={1}>
                        {t("metodo.tcm.constitucion.segundo")}: {nombres[segunda]} ({CONSTITUCIONES[segunda].arquetipo}).
                      </Text>
                    )}
                    <Box h="1px" w="100%" bg={`${tcmTxt}44`} my={1.5} />
                    <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.92}>
                      {t("metodo.tcm.constitucion.noEsDiagnostico")}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Reveal>
          )}

          {/* ── Las cinco constituciones ─────────────────────────────────── */}
          <Flex direction="column" gap={5} w="100%">
            {ORDEN_ELEMENTOS.map((el, i) => (
              <Reveal key={el} inView direction={i % 2 === 0 ? "right" : "left"} distance={26}
                      duration={0.6} amount={0.18} w="100%" display="flex">
                <TarjetaConstitucion elemento={el} nombre={nombres[el]} esLaTuya={tuya === el} />
              </Reveal>
            ))}
          </Flex>

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.3} display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center"
                  maxW="640px" lineHeight="1.6">
              {t("metodo.tcm.constitucion.aviso")}
            </Text>
          </Reveal>

          {/* El paso siguiente solo se abre con el test hecho. */}
          {!completo && (
            <Text color="white" fontSize="sm" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.7">
              {t("metodo.tcm.constitucion.bloqueo")}
            </Text>
          )}
          <Flex w="100%" justify="flex-end">
            <BotonPaso label={t("metodo.tcm.paso.ciclos")} nom={tcmNom} color={tcmTxt} bg={tcmBg}
                       disabled={!completo} title={t("metodo.tcm.constitucion.bloqueo")}
                       onClick={() => navigate("/metodo/tcm/ciclos")} />
          </Flex>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <TestConstitucionModal
        abierto={testAbierto}
        data={data}
        onChangeData={setData}
        onClose={() => setTestAbierto(false)}
        onCompletar={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

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

  return (
    <Box as="svg" viewBox="0 0 300 300" w="100%" h="auto">
      {/* Contorno (el 100%) y dos anillos de referencia */}
      {[1, 0.66, 0.33].map((f) => (
        <polygon key={f} points={ORDEN_ELEMENTOS.map((el) => {
          const v = verticePentagono(idxElemento(el), R_PENT * f);
          return `${v.x},${v.y}`;
        }).join(" ")}
          fill="none" stroke={`${tcmTxt}${f === 1 ? "88" : "33"}`} strokeWidth={f === 1 ? 1.4 : 1} />
      ))}

      {/* Tu perfil */}
      <polygon points={radar} fill={`${tcmTxt}3a`} stroke={tcmTxt} strokeWidth={2}
               strokeLinejoin="round" />

      {/* Los cinco vértices: icono + porcentaje */}
      {ORDEN_ELEMENTOS.map((el) => {
        const v = verticePentagono(idxElemento(el), R_PENT);
        const pct = Math.round((porElemento.get(el) ?? 0) * 100);
        // La etiqueta, un poco más afuera que el icono, siguiendo el radio.
        const fuera = verticePentagono(idxElemento(el), R_PENT + 34);
        return (
          <g key={el}>
            <clipPath id={`cons-clip-${el}`}>
              <circle cx={v.x} cy={v.y} r={FOTO_R} />
            </clipPath>
            <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} stroke={tcmTxt} strokeWidth={1.5} />
            <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                   width={FOTO_R * 2} height={FOTO_R * 2}
                   clipPath={`url(#cons-clip-${el})`} preserveAspectRatio="xMidYMid slice" />
            <text x={fuera.x} y={fuera.y + 4} textAnchor="middle" fill={tcmTxt}
                  fontFamily="'EB Garamond', serif" fontSize="15" fontWeight="700">
              {pct}%
            </text>
          </g>
        );
      })}
    </Box>
  );
}

// El rotulillo de cada apartado dentro de la tarjeta.
function Rotulo({ texto, acento, mt }: { texto: string; acento: string; mt?: number }) {
  return (
    <Text color={acento} fontSize="xs" fontWeight="800" letterSpacing="0.16em"
          textTransform="uppercase" mt={mt}>
      {texto}
    </Text>
  );
}

// Una columna de palabras sueltas (afinidades / aversiones), en fichas.
function ListaFichas({ titulo, palabras, acento }: {
  titulo: string; palabras: string[]; acento: string;
}) {
  return (
    <Flex direction="column" gap={2} flex="1" minW={0}>
      <Rotulo texto={titulo} acento={acento} />
      <Flex wrap="wrap" gap={1.5}>
        {palabras.map((p) => (
          <Text key={p} color={tcmTxt} fontSize="xs" lineHeight="1.4"
                px={2.5} py={1} borderRadius="full"
                border={`1px solid ${acento}55`} bg={`${acento}1f`}>
            {p}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Una de las cinco tarjetas: foto a la izquierda, texto a la derecha (la
// estructura del cómic). La que te ha salido se enciende con el acento del
// elemento y lleva su marca.
// ─────────────────────────────────────────────────────────────────────────
function TarjetaConstitucion({ elemento, nombre, esLaTuya }: {
  elemento: Elemento;
  nombre: string;
  esLaTuya: boolean;
}) {
  const t = useT();
  const c = CONSTITUCIONES[elemento];
  const acento = ELEMENTOS[elemento].color;

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         border={esLaTuya ? `2px solid ${acento}` : `1px solid ${tcmTxt}44`}
         boxShadow={esLaTuya ? glowHeader(acento) : glowHeader(tcmTxt)}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="absolute" inset={0} bg={`${tcmBg}9e`} />

      <Flex position="relative" direction={{ base: "column", sm: "row" }} align="stretch">
        <Box position="relative" flexShrink={0}
             w={{ base: "100%", sm: "180px", md: "230px" }}
             h={{ base: "190px", sm: "auto" }} minH={{ sm: "200px" }} bg={`${acento}22`}>
          <Image src={c.foto} alt={nombre} w="100%" h="100%" objectFit="cover" />
        </Box>

        <Flex direction="column" gap={2} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }} flex="1"
              style={{ textShadow: INK_SHADOW }}>
          <Flex align="baseline" gap={3} wrap="wrap">
            <Text color={tcmTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" lineHeight="1.15">
              {c.arquetipo}
            </Text>
            <Text color={acento} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                  letterSpacing="0.14em" textTransform="uppercase">
              {nombre}
            </Text>
            {esLaTuya && (
              <Text color={tcmBg} bg={acento} borderRadius="full" px={3} py={0.5}
                    fontSize="xs" fontWeight="800" letterSpacing="0.12em" textTransform="uppercase">
                {t("metodo.tcm.constitucion.laTuya")}
              </Text>
            )}
          </Flex>

          <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.9}>
            {c.lema}
          </Text>

          {c.texto.map((p, i) => (
            <Text key={i} color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75" mt={i === 0 ? 1.5 : 0}>
              {p}
            </Text>
          ))}

          <Box h="1px" w="100%" bg={`${tcmTxt}33`} my={2} />

          {/* Lo que le atrae y lo que le incomoda: las dos listas del libro,
              en fichas para que se lean de un vistazo. */}
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 3, md: 6 }}>
            <ListaFichas titulo={t("metodo.tcm.constitucion.leAtrae")} palabras={c.afinidades} acento={acento} />
            <ListaFichas titulo={t("metodo.tcm.constitucion.leIncomoda")} palabras={c.aversiones} acento={acento} />
          </Flex>

          {/* Los nudos: las dos mitades son verdad a la vez. */}
          <Rotulo texto={t("metodo.tcm.constitucion.nudos")} acento={acento} mt={3} />
          <Text color={tcmTxt} fontSize="xs" opacity={0.75} fontStyle="italic" mb={1}>
            {t("metodo.tcm.constitucion.nudosPie")}
          </Text>
          <Flex direction="column" gap={1.5} borderLeft={`2px solid ${acento}55`} pl={{ base: 3, md: 4 }}>
            {c.nudos.map((n, i) => (
              <Text key={i} color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                <Box as="span" fontWeight="700">{n.quiere}</Box>, {n.pero}
              </Text>
            ))}
          </Flex>

          {/* Por dónde avisa el cuerpo de este tipo. */}
          <Rotulo texto={t("metodo.tcm.constitucion.cuerpo")} acento={acento} mt={3} />
          <Flex direction="column" gap={1.5} borderLeft={`2px solid ${acento}55`} pl={{ base: 3, md: 4 }}>
            {c.cuerpo.map((p, i) => (
              <Text key={i} color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                {p}
              </Text>
            ))}
          </Flex>

          <Box h="1px" w="100%" bg={`${tcmTxt}33`} my={2} />

          <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
            <Box as="span" fontWeight="800" color={acento}>{t("metodo.tcm.constitucion.enSuLuz")}: </Box>
            {c.luz}
          </Text>
          <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
            <Box as="span" fontWeight="800" color={acento}>{t("metodo.tcm.constitucion.enSuSombra")}: </Box>
            {c.sombra}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
