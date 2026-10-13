import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { CajaFisio } from "../../components/metodo/CajaFisio";
import { SiluetaAvance } from "../../components/metodo/SiluetaAvance";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { glowHeader } from "../../components/metodo/FotoBox";
import { SeparadorSeccion } from "../../components/metodo/presentacionUi";
import { Reveal, Breathe, Contador } from "../../components/global/Reveal";
import { PalabrasVivas } from "../../components/global/PalabrasVivas";
import { FlechaBonita } from "../../components/global/FlechaBonita";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { focoBlanco } from "../../components/global/foco";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useCuerpoFisiologia } from "../../hooks/useCuerpoFisiologia";
import { flushSaves } from "../../utils/flushSaves";
import {
  CandadoIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx,
} from "../../GlobalVariables";
import {
  ESTACIONES, TRAMOS, estacionAbierta, estacionActual, estacionLista, estacionesHechasSeguidas,
  type Estacion,
} from "../../hardCoded/espacio/EstacionesCuerpo";
import { useT } from "../../i18n";

const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);

/** Miniatura de la parte del cuerpo. Si su foto falla, se oculta (no deja hueco roto). */
function Miniatura({ e }: { e: Estacion }) {
  const [src, setSrc] = useState(e.foto);
  const [falla, setFalla] = useState(false);
  return (
    <Box flexShrink={0} w={{ base: "54px", md: "66px" }} h={{ base: "54px", md: "66px" }}
         borderRadius="xl" overflow="hidden" bg={`${fisiologiaTxt}1f`}>
      {!falla && (
        <Box as="img" src={encodeURI(src)} alt="" loading="lazy" w="100%" h="100%"
             style={{ objectFit: "cover" }}
             onError={() => {
               if (e.fotoReserva && src !== e.fotoReserva) setSrc(e.fotoReserva);
               else setFalla(true);
             }} />
      )}
    </Box>
  );
}

function FilaEstacion({
  e, hecha, abierta, actual, nivel, onClick,
}: {
  e: Estacion;
  hecha: boolean;
  abierta: boolean;
  actual: boolean;
  nivel?: string;
  onClick: () => void;
}) {
  const t = useT();
  const lista = estacionLista(e);
  const pulsable = abierta && lista;
  const sub = hecha ? nivel
    : !lista ? t("fisiologia.cuerpo.proximamente")
    : actual ? t("fisiologia.cuerpo.empezar")
    : undefined;

  const fila = (
    <Box
      as={pulsable ? "button" : "div"}
      onClick={pulsable ? onClick : undefined}
      role={pulsable ? "group" : undefined}
      textAlign="left"
      w="100%"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      opacity={abierta || hecha ? 1 : 0.55}
      cursor={pulsable ? "pointer" : "default"}
      boxShadow={actual ? `${glowHeader(fisiologiaTxt)}, 0 0 26px ${fisiologiaTxt}55` : glowHeader(fisiologiaTxt)}
      transition="transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, opacity 0.4s ease"
      _hover={pulsable ? { transform: "translateY(-3px)" } : undefined}
      _active={pulsable ? { transform: "scale(0.985)" } : undefined}
      _focusVisible={focoBlanco}
    >
      <CajaFisio glow="none" h="100%">
        <Flex align="center" gap={{ base: 3, md: 4 }} px={{ base: 3, md: 4 }} py={{ base: 3, md: 3.5 }}>
          <Miniatura e={e} />
          <Box flex={1} minW={0}>
            <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.2" letterSpacing="0.02em" textShadow={SOMBRA}>
              {e.label}
            </Text>
            {sub && (
              <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    opacity={0.85} textShadow={SOMBRA}>
                {sub}
              </Text>
            )}
          </Box>
          <Flex flexShrink={0} align="center" color={fisiologiaTxt}>
            {hecha ? <MarcaLeido tinta={fisiologiaTxt} bg={fisiologiaBg} inline />
              : abierta && lista ? <FlechaBonita dir="next" size="24px"
                  transition="transform 0.25s ease" _groupHover={{ transform: "translateX(4px)" }} />
              : <CandadoIcon size="18px" color={fisiologiaTxt} />}
          </Flex>
        </Flex>
      </CajaFisio>
    </Box>
  );

  return actual ? <Breathe scale={0.008} duration={4}>{fila}</Breathe> : fila;
}

export default function MetodoFisiologiaCuerpo() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { cuerpo, cargar } = useCuerpoFisiologia();
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Cada fila entra con su hueco en la cascada del tramo.
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        await cargar();
        await precargarImagenes(["/recorrido/fisiologia/organos/anatomia.webp"]);
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate, cargar]);

  const total = ESTACIONES.length;
  const nHechas = cuerpo.hechas.length;
  const seguidas = estacionesHechasSeguidas(cuerpo);
  const hasta = seguidas > 0 ? ESTACIONES[seguidas - 1].y : 0;
  const actual = estacionActual(cuerpo);
  const terminado = nHechas >= total;

  // Las partes que más puntúan, de más a menos (solo las que ya piden algo).
  const destacadas = useMemo(
    () => ESTACIONES
      .filter((e) => cuerpo.resultados[e.key] && cuerpo.resultados[e.key].nivel !== "tranquilo")
      .sort((a, b) => cuerpo.resultados[b.key].puntos - cuerpo.resultados[a.key].puntos)
      .slice(0, 3),
    [cuerpo],
  );

  const ir = async (ruta: string) => { await flushSaves(); navigate(ruta); };

  if (loading) return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={{ base: 6, md: 8 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.cuerpo.titulo")}
              pageLabel={t("fisiologia.cuerpo.progreso", { n: nHechas, total })}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.lasCelulas.corto")}`, onClick: () => ir("/metodo/fisiologia/todas-tus-celulas") }}
              extra={celulasBtn}
              next={{
                label: `${t("fisiologia.organismo.titulo")} →`,
                onClick: () => ir("/metodo/fisiologia/organismo"),
                disabled: !terminado,
                disabledTooltip: t("fisiologia.cuerpo.bloqueo"),
              }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              <PalabrasVivas texto={t("fisiologia.cuerpo.intro")} />
            </Text>
          </Reveal>

          <Grid w="100%" gap={{ base: 8, md: 10 }} alignItems="start"
                templateColumns={{ base: "1fr", lg: "minmax(0, 330px) 1fr" }}>

            {/* ── IZQUIERDA · el cuerpo que se enciende ── */}
            <Reveal inView once direction="up" distance={26} scaleFrom={0.97} duration={0.8}
                    position={{ base: "static", lg: "sticky" }} top="24px">
              <Flex direction="column" align="center" gap={4}>
                <SiluetaAvance hasta={hasta} maxW={{ base: "250px", lg: "330px" }} />
                <Flex align="baseline" gap={2} color="white">
                  <Contador valor={nHechas} duracion={1.2}
                            fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" lineHeight="1" />
                  <Text fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" opacity={0.9}>
                    {t("fisiologia.cuerpo.progreso", { n: "", total }).trim()}
                  </Text>
                </Flex>
              </Flex>
            </Reveal>

            {/* ── DERECHA · el camino, tramo a tramo ── */}
            <Flex direction="column" gap={{ base: 7, md: 9 }} minW={0}>
              {TRAMOS.map((tramo) => {
                const partes = ESTACIONES.filter((e) => e.tramo === tramo);
                return (
                  <Flex key={tramo} direction="column" gap={4}>
                    <SeparadorSeccion maxW="100%">
                      {t(`fisiologia.cuerpo.tramo.${tramo}` as any)}
                    </SeparadorSeccion>
                    <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                      {partes.map((e, i) => (
                        <Reveal key={e.key} inView once direction="up" distance={24} scaleFrom={0.97}
                                duration={0.7} amount={0.3} delay={esMovil ? 0.05 : 0.05 + i * 0.07}>
                          <FilaEstacion
                            e={e}
                            hecha={cuerpo.hechas.includes(e.key)}
                            abierta={estacionAbierta(cuerpo, e.key)}
                            actual={actual?.key === e.key}
                            nivel={cuerpo.resultados[e.key]
                              ? t(`fisiologia.cuerpo.nivel.${cuerpo.resultados[e.key].nivel}` as any)
                              : undefined}
                            onClick={() => ir(`/metodo/fisiologia/cuerpo/${e.key}`)}
                          />
                        </Reveal>
                      ))}
                    </Flex>
                  </Flex>
                );
              })}

              {/* Lo que más te habla, en cuanto hay algo que contar. */}
              {destacadas.length > 0 && (
                <Reveal inView once direction="up" distance={24} scaleFrom={0.97} duration={0.8}>
                  <CajaFisio>
                    <Flex direction="column" gap={4} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
                      <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }}
                            letterSpacing="0.03em" textShadow={SOMBRA}>
                        {t("fisiologia.cuerpo.destacan")}
                      </Text>
                      <Flex gap={3} wrap="wrap">
                        {destacadas.map((e) => (
                          <Box key={e.key} as="button" onClick={() => ir(`/metodo/fisiologia/cuerpo/${e.key}`)}
                               px={5} py={2} borderRadius="full" color={fisiologiaTxt}
                               bg={`${fisiologiaTxt}1a`} border={`1.5px solid ${fisiologiaTxt}aa`}
                               fontStyle="italic" letterSpacing="0.04em" cursor="pointer"
                               boxShadow={`0 0 10px rgba(255,255,255,0.16), 0 0 22px ${fisiologiaTxt}44`}
                               transition="all 0.15s ease"
                               _hover={{ bg: `${fisiologiaTxt}2b`, transform: "translateY(-2px)" }}
                               _active={{ transform: "scale(0.96)" }}
                               _focusVisible={focoBlanco}>
                            {e.label} · {cuerpo.resultados[e.key].puntos}%
                          </Box>
                        ))}
                      </Flex>
                    </Flex>
                  </CajaFisio>
                </Reveal>
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
