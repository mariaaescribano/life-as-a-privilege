import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { CajaFisio } from "../../components/metodo/CajaFisio";
import { HiloCuerpo } from "../../components/metodo/HiloCuerpo";
import { VideoReelModal } from "../../components/metodo/VideoReelModal";
import { ClavesRapidas } from "../../components/metodo/ClavesRapidas";
import { ComicTemaModal } from "../../components/metodo/ComicTemaModal";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal, Breathe, Contador, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { PalabrasVivas } from "../../components/global/PalabrasVivas";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { focoBlanco } from "../../components/global/foco";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useCuerpoFisiologia } from "../../hooks/useCuerpoFisiologia";
import { flushSaves } from "../../utils/flushSaves";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx } from "../../GlobalVariables";
import {
  ESTACIONES, estacionAbierta, estacionLista, estacionPorKey, puntuarEstacion,
} from "../../hardCoded/espacio/EstacionesCuerpo";
import { useT } from "../../i18n";

const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);
/** Los cinco pasos de la escala (0–4): cada círculo un poco mayor que el anterior. */
const ESCALA = [0, 1, 2, 3, 4];
const TAM = [26, 30, 34, 38, 42];

/** Botón de píldora de la casa (borde y halo de la disciplina). */
const Pildora = ({ children, onClick, disabled, title }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string;
}) => (
  <Box as="button" onClick={disabled ? undefined : onClick} disabled={disabled} title={title}
       px={{ base: 5, md: 7 }} py={{ base: 2, md: 2.5 }} borderRadius="full" color={fisiologiaTxt}
       bg={`${fisiologiaTxt}1a`} border={`1.5px solid ${fisiologiaTxt}aa`}
       fontStyle="italic" letterSpacing="0.05em" fontSize={{ base: "md", md: "lg" }}
       opacity={disabled ? 0.45 : 1} cursor={disabled ? "not-allowed" : "pointer"}
       boxShadow={disabled ? "none" : `0 0 10px rgba(255,255,255,0.16), 0 0 22px ${fisiologiaTxt}44`}
       transition="all 0.15s ease"
       _hover={disabled ? undefined : { bg: `${fisiologiaTxt}2b`, transform: "translateY(-2px)" }}
       _active={disabled ? undefined : { transform: "scale(0.96)" }}
       _focusVisible={focoBlanco}>
    {children}
  </Box>
);

export default function MetodoFisiologiaCuerpoEstacion() {
  const { key } = useParams<{ key: string }>();
  const t = useT();
  const navigate = useNavigate();
  const estacion = estacionPorKey(key);
  // `?libre=1`: se llega desde «Tu recorrido», sin el orden de estaciones.
  const [params] = useSearchParams();
  const libre = params.has("libre");
  const { cuerpo, cargar, guardar } = useCuerpoFisiologia();

  const [loading, setLoading] = useState(true);
  // El vídeo de entrada: sale solo la primera vez, ANTES de enseñar la página.
  const [video, setVideo] = useState(false);
  const [comicAbierto, setComicAbierto] = useState(false);
  const [respuestas, setRespuestas] = useState<(number | null)[]>([]);
  const [repitiendo, setRepitiendo] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setRespuestas([]);
    setRepitiendo(false);
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!estacion) { navigate("/metodo/fisiologia/cuerpo", { replace: true }); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        const c = await cargar();
        // Solo se entra en una estación cuando la anterior está hecha.
        if (!libre && !estacionAbierta(c, estacion.key)) { navigate("/metodo/fisiologia/cuerpo", { replace: true }); return; }
        await precargarImagenes([estacion.foto]);
        setRespuestas(estacion.test.map(() => null));
        setVideo(estacionLista(estacion) && !c.videos.includes(estacion.key));
      } catch { navigate("/metodo/fisiologia/cuerpo", { replace: true }); return; }
      finally { setLoading(false); }
    })();
  }, [key, navigate, cargar, libre]);

  if (!estacion) return null;
  if (loading) return <FisiologiaLoading />;

  const i = ESTACIONES.findIndex((e) => e.key === estacion.key);
  const total = ESTACIONES.length;
  const anterior = i > 0 ? ESTACIONES[i - 1] : null;
  const siguiente = i < total - 1 ? ESTACIONES[i + 1] : null;
  const lista = estacionLista(estacion);
  const resultado = cuerpo.resultados[estacion.key];
  const hecha = cuerpo.hechas.includes(estacion.key);
  const respondidas = respuestas.filter((r) => r !== null).length;
  const testCompleto = lista && respondidas === estacion.test.length;
  const mostrandoResultado = hecha && !!resultado && !repitiendo;

  const ir = async (ruta: string) => { await flushSaves(); navigate(ruta); };

  const alCerrarVideo = (como: "visto" | "error") => {
    setVideo(false);
    // Solo se da por visto si de verdad se vio (o se saltó): si el fichero aún
    // no existe, volverá a salir cuando exista.
    if (como === "visto") {
      guardar((c) => (c.videos.includes(estacion.key) ? c : { ...c, videos: [...c.videos, estacion.key] }));
    }
  };

  const enviar = () => {
    if (!testCompleto) return;
    const res = puntuarEstacion(estacion, respuestas.map((r) => r ?? 0));
    guardar((c) => ({
      ...c,
      hechas: c.hechas.includes(estacion.key) ? c.hechas : [...c.hechas, estacion.key],
      resultados: { ...c.resultados, [estacion.key]: res },
    }));
    setRepitiendo(false);
  };

  const repetir = () => {
    setRespuestas(estacion.test.map(() => null));
    setRepitiendo(true);
  };

  const irSiguiente = () => ir(siguiente ? `/metodo/fisiologia/cuerpo/${siguiente.key}` : "/metodo/fisiologia/organismo");
  const etiquetaSiguiente = siguiente ? siguiente.label : t("fisiologia.organismo.titulo");

  // Mientras el vídeo de entrada está en marcha, la página espera detrás: sale
  // (con su entrada) cuando se cierra.
  if (video) {
    return (
      <>
        <FisiologiaLoading />
        <VideoReelModal src={estacion.video} onClose={alCerrarVideo} />
      </>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={estacion.label}
              pageLabel={`${i + 1}/${total}`}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{
                label: `← ${anterior ? anterior.label : t("fisiologia.cuerpo.titulo")}`,
                onClick: () => ir(anterior ? `/metodo/fisiologia/cuerpo/${anterior.key}` : "/metodo/fisiologia/cuerpo"),
              }}
              extra={{ label: t("fisiologia.cuerpo.titulo"), onClick: () => ir("/metodo/fisiologia/cuerpo") }}
              next={{
                label: `${etiquetaSiguiente} →`,
                onClick: irSiguiente,
                disabled: !hecha,
                disabledTooltip: t("fisiologia.cuerpo.test.faltan"),
              }}
            />
          </Reveal>

          {/* El camino entero, con la parte de hoy marcada. */}
          <Reveal direction="up" distance={16} delay={0.08} duration={0.6} w="100%">
            <HiloCuerpo
              hechas={cuerpo.hechas}
              actual={estacion.key}
              abiertas={ESTACIONES.filter((e) => estacionAbierta(cuerpo, e.key)).map((e) => e.key)}
              onSelect={(k) => ir(`/metodo/fisiologia/cuerpo/${k}`)}
            />
          </Reveal>

          {/* ── LA PARTE: foto grande + claves + texto ── */}
          <Reveal direction="up" distance={30} scaleFrom={0.97} delay={0.14} duration={0.8} w="100%">
            <CajaFisio>
              <Grid templateColumns={{ base: "1fr", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" }}
                    gap={{ base: 5, md: 9 }} alignItems="center"
                    px={{ base: 5, md: 9 }} py={{ base: 6, md: 9 }}>
                <Breathe scale={0.01} duration={7}>
                  <Box borderRadius="2xl" overflow="hidden" bg={`${fisiologiaTxt}1f`}
                       boxShadow={glowHeader(fisiologiaTxt)} sx={{ aspectRatio: "1 / 1" }}>
                    <Box as="img" src={encodeURI(estacion.foto)} alt={estacion.label} w="100%" h="100%"
                         style={{ objectFit: "cover" }}
                         onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                           if (estacion.fotoReserva && !e.currentTarget.src.endsWith(estacion.fotoReserva)) {
                             e.currentTarget.src = estacion.fotoReserva;
                           } else { e.currentTarget.style.visibility = "hidden"; }
                         }} />
                  </Box>
                </Breathe>

                <Flex direction="column" gap={{ base: 4, md: 5 }}>
                  {lista ? (
                    <>
                      <ClavesRapidas claves={estacion.claves} accent={fisiologiaTxt} mb={0} />
                      <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }}
                            lineHeight={{ base: "1.75", md: "1.8" }} textShadow={SOMBRA}>
                        <PalabrasVivas texto={estacion.descripcion} retraso={0.4} />
                      </Text>
                      <Flex gap={3} wrap="wrap">
                        <Pildora onClick={() => setVideo(true)}>{t("fisiologia.cuerpo.verVideo")}</Pildora>
                        {estacion.comic.length > 0 && (
                          <Pildora onClick={() => setComicAbierto(true)}>{t("fisiologia.cuerpo.comic")}</Pildora>
                        )}
                      </Flex>
                    </>
                  ) : (
                    <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic"
                          lineHeight="1.7" textShadow={SOMBRA}>
                      {t("fisiologia.cuerpo.enPreparacion")}
                    </Text>
                  )}
                </Flex>
              </Grid>
            </CajaFisio>
          </Reveal>

          {/* ── EL TEST: «¿cómo te sientes?» ── */}
          {lista && !mostrandoResultado && (
            <Reveal inView once direction="up" distance={30} scaleFrom={0.97} duration={0.8} w="100%">
              <CajaFisio>
                <Flex direction="column" gap={{ base: 6, md: 7 }} px={{ base: 5, md: 9 }} py={{ base: 6, md: 9 }}>
                  <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "2xl", md: "3xl" }}
                        letterSpacing="0.03em" textShadow={SOMBRA}>
                    {t("fisiologia.cuerpo.test.titulo")}
                  </Text>

                  {estacion.test.map((p, n) => (
                    <Reveal key={`${estacion.key}-${n}`} inView once direction="up" distance={18} duration={0.6} amount={0.4}>
                      <Flex direction="column" gap={3}>
                        <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.5" textShadow={SOMBRA}>
                          {p.texto}
                        </Text>
                        <Flex align="center" gap={{ base: 2.5, md: 4 }}>
                          <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                                opacity={0.8} w={{ base: "44px", md: "58px" }} flexShrink={0} textShadow={SOMBRA}>
                            {t("fisiologia.cuerpo.test.nunca")}
                          </Text>
                          <Flex align="center" justify="space-between" flex={1} maxW="340px">
                            {ESCALA.map((v) => {
                              const elegido = respuestas[n] === v;
                              return (
                                <Box key={v} as="button" aria-label={String(v)}
                                     onClick={() => setRespuestas((r) => r.map((x, k) => (k === n ? v : x)))}
                                     w={{ base: `${TAM[v] - 6}px`, md: `${TAM[v]}px` }}
                                     h={{ base: `${TAM[v] - 6}px`, md: `${TAM[v]}px` }}
                                     borderRadius="full" cursor="pointer"
                                     bg={elegido ? fisiologiaTxt : `${fisiologiaTxt}14`}
                                     border={`1.5px solid ${elegido ? fisiologiaTxt : `${fisiologiaTxt}88`}`}
                                     boxShadow={elegido ? `0 0 16px ${fisiologiaTxt}aa` : "none"}
                                     transition="all 0.2s cubic-bezier(0.22,1,0.36,1)"
                                     _hover={{ borderColor: fisiologiaTxt, transform: "scale(1.1)" }}
                                     _active={{ transform: "scale(0.94)" }}
                                     _focusVisible={focoBlanco} />
                              );
                            })}
                          </Flex>
                          <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                                opacity={0.8} w={{ base: "44px", md: "58px" }} flexShrink={0} textAlign="right"
                                textShadow={SOMBRA}>
                            {t("fisiologia.cuerpo.test.siempre")}
                          </Text>
                        </Flex>
                      </Flex>
                    </Reveal>
                  ))}

                  <Flex align="center" gap={4} wrap="wrap">
                    <Pildora onClick={enviar} disabled={!testCompleto} title={testCompleto ? undefined : t("fisiologia.cuerpo.test.faltan")}>
                      {t("fisiologia.cuerpo.test.ver")}
                    </Pildora>
                    <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.8} textShadow={SOMBRA}>
                      {respondidas}/{estacion.test.length}
                    </Text>
                  </Flex>
                </Flex>
              </CajaFisio>
            </Reveal>
          )}

          {/* ── EL RESULTADO ── */}
          {lista && mostrandoResultado && resultado && (
            <Reveal direction="up" distance={30} scaleFrom={0.96} duration={0.8} w="100%">
              <CajaFisio glow={`${glowHeader(fisiologiaTxt)}, 0 0 30px ${fisiologiaTxt}44`}>
                <RevealStagger stagger={0.14} delayChildren={0.3}
                               display="flex" flexDirection="column" alignItems="center" textAlign="center"
                               gap={{ base: 4, md: 5 }} px={{ base: 5, md: 9 }} py={{ base: 8, md: 11 }}>
                  <RevealItem direction="up" distance={14}>
                    <MarcaLeido tinta={fisiologiaTxt} bg={fisiologiaBg} inline size="38px" iconSize="22px" />
                  </RevealItem>
                  <RevealItem direction="up" distance={16}>
                    <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "2xl", md: "4xl" }}
                          lineHeight="1.25" letterSpacing="0.02em" textShadow={SOMBRA}>
                      {t(`fisiologia.cuerpo.nivel.${resultado.nivel}` as any)}
                    </Text>
                  </RevealItem>
                  <RevealItem direction="up" distance={14} w="100%" maxW="420px">
                    <Flex align="baseline" justify="center" gap={1} color={fisiologiaTxt} textShadow={SOMBRA}>
                      <Contador valor={resultado.puntos} duracion={1.3} fontSize={{ base: "5xl", md: "6xl" }}
                                fontWeight="700" lineHeight="1" />
                      <Text fontSize={{ base: "2xl", md: "3xl" }}>%</Text>
                    </Flex>
                    <Box mt={3} h="8px" borderRadius="full" bg={`${fisiologiaTxt}26`} overflow="hidden">
                      <Box h="100%" borderRadius="full" bg={fisiologiaTxt}
                           boxShadow={`0 0 12px ${fisiologiaTxt}aa`}
                           style={{ width: `${resultado.puntos}%`, transition: "width 1.3s cubic-bezier(0.22,1,0.36,1)" }} />
                    </Box>
                  </RevealItem>
                  <RevealItem direction="up" distance={12}>
                    <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                          opacity={0.85} maxW="460px" textShadow={SOMBRA}>
                      {t("fisiologia.cuerpo.test.aviso")}
                    </Text>
                  </RevealItem>
                  <RevealItem direction="up" distance={12}>
                    <Pildora onClick={repetir}>{t("fisiologia.cuerpo.test.repetir")}</Pildora>
                  </RevealItem>
                </RevealStagger>
              </CajaFisio>
            </Reveal>
          )}

          {/* Lo que sigue, abajo a la derecha, en cuanto la parte está hecha. */}
          {hecha && (
            <Flex w="100%" direction="column">
              <BotonPaso label={etiquetaSiguiente} onClick={irSiguiente} nom={fisiologiaNom}
                         color={fisiologiaTxt} bg={fisiologiaBg} direction="next" />
            </Flex>
          )}
        </Flex>
      </Flex>

      {comicAbierto && estacion.comic.length > 0 && (
        <ComicTemaModal isOpen vinetas={estacion.comic} onClose={() => setComicAbierto(false)} />
      )}

      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
