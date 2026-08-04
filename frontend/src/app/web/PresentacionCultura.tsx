import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { HISTORIAS_CULTURA } from "../../components/metodo/culturaHistorias";
import { historiaVisual } from "../../components/metodo/culturaPortadas";
import type { HitoHistoria } from "../../components/metodo/culturaHistoriaUniversal";
import {
  BLANCO_GLOW_SUAVE,
  CajaLisa,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { CulturaIcon, culturaBg, culturaNom } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/cultura — presentación de Cultura, el cierre de El Mapa.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LAS SEIS HISTORIAS: su portada en un círculo y el título debajo.
//   4. SUS LÍNEAS DEL TIEMPO, como ejemplo: la línea principal de cada Historia
//      para que se vea cuál es cuál. NO se pulsan (aquí no se abre nada): al
//      tocarlas sale «Descúbrelo dentro».
//   5. Llamada a la acción.
//
// Cultura es la única disciplina SIN ilustraciones en la galería, así que aquí no
// hay bloque de cómics: no se enseña un hueco vacío.
// ─────────────────────────────────────────────────────────────────────────────

const CULTURA_IMG = "/img/fondos/cultura.webp";

/** Las seis Historias, en el orden en que se recorren. */
const ORDEN_HISTORIAS = ["universal", "religiones", "filosofia", "ciencia", "medicina", "arte"];

/** Lo que sale al tocar una línea del tiempo: aquí no se abre nada. */
const AVISO = "Descúbrelo dentro";

export default function PresentacionCultura({ d }: { d: PresentacionDisciplina }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const historias = useMemo(
    () => ORDEN_HISTORIAS
      .map((k) => ({ key: k, ...HISTORIAS_CULTURA[k], ...historiaVisual(k) }))
      .filter((h) => h.hitos?.length),
    [],
  );

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    CULTURA_IMG,
    ...historias.map((h) => h.portada).filter((p): p is string => !!p),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const renderIcon = (size: string) => <CulturaIcon size={{ base: size, md: size }} />;

  const verVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.scrollIntoView({ behavior: "smooth", block: "center" });
    void v.play().catch(() => { /* si el navegador lo bloquea, quedan los controles */ });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex
        flex="1"
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 6, md: 10 }}
        pb={{ base: 16, md: 24 }}
        gap={{ base: 12, md: 16 }}
      >
        {/* ══ 1. HEADER de la disciplina ══ */}
        <Reveal direction="down" distance={18} duration={0.8} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<CulturaIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={culturaBg}
            color={d.txt}
            nom={culturaNom}
            maxW="900px"
            mb={0}
          />
        </Reveal>

        {/* La frase del cartel */}
        <RevealStagger
          stagger={0.12}
          delayChildren={0.2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          w="100%"
          maxW="900px"
          textAlign="center"
          mt={{ base: -6, md: -8 }}
        >
          <RevealItem>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              lineHeight="1.15"
              letterSpacing="0.04em"
              maxW="760px"
            >
              {d.gancho}
            </Text>
          </RevealItem>
        </RevealStagger>

        {/* ══ 2. BOX DE LA DISCIPLINA (con su precio) + VÍDEO ══ */}
        <Grid
          w="100%"
          maxW="1180px"
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, md: 8 }}
          alignItems="stretch"
        >
          <Reveal inView direction="right" distance={26} duration={0.7} h="100%">
            <DisciplinaVideoBox
              nom={culturaNom}
              bg={culturaBg}
              txt={d.txt}
              videoIntro={d.videoIntro}
              paso={d.paso}
              renderIcon={renderIcon}
              tieneVideo={!!d.video}
              onVerVideo={verVideo}
              sinBoton
              textoGrande
              h="100%"
            />
          </Reveal>
          <Reveal inView direction="left" distance={26} duration={0.7} delay={0.1} h="100%">
            <VideoMuestra d={d} videoRef={videoRef} />
          </Reveal>
        </Grid>

        {/* ══ 3. LAS SEIS HISTORIAS ══
            Su portada en un círculo y el título debajo. Sin caja: los círculos se
            presentan solos sobre el turquesa. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Las seis Historias</SeparadorSeccion>

          <RevealStagger
            inView
            stagger={0.08}
            delayChildren={0.1}
            amount={0.1}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }}
            gap={{ base: 5, md: 6 }}
            justifyItems="center"
          >
            {historias.map((h) => (
              <RevealItem key={h.key} direction="up" distance={20} scaleFrom={0.96} duration={0.65}>
                <Flex direction="column" align="center" gap={{ base: 2.5, md: 3 }}>
                  <Circulo
                    foto={h.portada}
                    alt={h.titulo}
                    emoji={h.emoji}
                    d={d}
                    size={{ base: "108px", md: "124px", lg: "134px" }}
                  />
                  <Text
                    color="white"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="700"
                    lineHeight="1.25"
                    letterSpacing="0.02em"
                    textAlign="center"
                    maxW="150px"
                    textShadow={BLANCO_GLOW_SUAVE}
                  >
                    {h.titulo}
                  </Text>
                </Flex>
              </RevealItem>
            ))}
          </RevealStagger>
        </Flex>

        {/* ══ 4. SUS LÍNEAS DEL TIEMPO (como ejemplo) ══
            La línea principal de cada Historia, para que se vea cuál es cuál.
            Aquí NO se abre nada: al tocarla sale «Descúbrelo dentro». */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Sus líneas del tiempo</SeparadorSeccion>

          <Reveal inView direction="up" distance={16} duration={0.7}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="740px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Cada Historia se recorre por su línea del tiempo, era por era. Estas son, solo para
              que las veas.
            </Text>
          </Reveal>

          <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>
            {historias.map((h, i) => (
              <Reveal
                key={h.key}
                inView
                direction="up"
                distance={20}
                scaleFrom={0.98}
                duration={0.7}
                delay={Math.min(i, 3) * 0.06}
                w="100%"
              >
                <LineaEjemplo d={d} titulo={h.titulo} hitos={h.hitos} />
              </Reveal>
            ))}
          </Flex>
        </Flex>

        {/* ══ 5. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Círculo con foto (portada de una Historia o era de su línea). Si la foto aún
// no existe, se queda su emoji o su año: nunca un icono roto.
// ─────────────────────────────────────────────────────────────────────────────
function Circulo({
  foto,
  alt,
  emoji,
  texto,
  d,
  size,
  lazy = false,
}: {
  foto?: string;
  alt: string;
  /** Reserva si no hay foto (portadas de Historia). */
  emoji?: string;
  /** Reserva si no hay foto ni emoji (eras: se pinta su año). */
  texto?: string;
  d: PresentacionDisciplina;
  size: Record<string, string> | string;
  lazy?: boolean;
}) {
  const [falla, setFalla] = useState(false);
  const hayFoto = !!foto && !falla;
  return (
    <Box
      position="relative"
      flexShrink={0}
      w={size}
      h={size}
      borderRadius="full"
      overflow="hidden"
      bg={`${d.bg}cc`}
      boxShadow={`0 0 16px ${d.txt}4d, 0 0 40px ${d.txt}22`}
    >
      {hayFoto ? (
        <Box
          as="img"
          src={encodeURI(foto!)}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          w="100%"
          h="100%"
          style={{ objectFit: "cover", objectPosition: "center" }}
          onError={() => setFalla(true)}
        />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center" px={1.5}>
          <Text
            color={d.txt}
            fontSize={emoji ? { base: "3xl", md: "4xl" } : { base: "2xs", md: "xs" }}
            fontWeight="700"
            lineHeight="1.15"
            textAlign="center"
            noOfLines={3}
          >
            {emoji ?? texto ?? ""}
          </Text>
        </Flex>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LÍNEA DE EJEMPLO de una Historia: su título y sus eras en fila, con la línea
// que las une. Es una MUESTRA: no navega a ninguna parte. Al tocarla (o al pasar
// por encima) aparece «Descúbrelo dentro» y ya está.
//
// La fila se desplaza dentro de su caja cuando hay muchas eras — la página nunca
// hace scroll horizontal.
// ─────────────────────────────────────────────────────────────────────────────
function LineaEjemplo({
  d,
  titulo,
  hitos,
}: {
  d: PresentacionDisciplina;
  titulo: string;
  hitos: HitoHistoria[];
}) {
  const sombra = sombraTexto(d.nom, d.bg);
  const [aviso, setAviso] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // El aviso se va solo: es un recordatorio, no un cartel permanente.
  const mostrarAviso = () => {
    setAviso(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(false), 1800);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <CajaLisa d={d} radio="2xl" role="group" onClick={mostrarAviso} cursor="default">
      <Flex direction="column" gap={{ base: 4, md: 5 }} px={{ base: 4, md: 7 }} py={{ base: 5, md: 6 }}>
        <Flex align="baseline" justify="space-between" gap={3} wrap="wrap">
          <Text
            color={d.txt}
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="700"
            letterSpacing="0.03em"
            lineHeight="1.25"
            textShadow={sombra}
          >
            {titulo}
          </Text>
          <Text
            color={`${d.txt}b3`}
            fontSize={{ base: "2xs", md: "xs" }}
            fontWeight="700"
            letterSpacing="0.22em"
            textTransform="uppercase"
            textShadow={sombra}
          >
            {hitos.length} eras
          </Text>
        </Flex>

        {/* La línea: eras en fila, unidas. Se desplaza dentro de la caja. */}
        <Box position="relative">
          <Box
            overflowX="auto"
            overflowY="hidden"
            pb={1}
            sx={{
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-thumb": { background: `${d.txt}55`, borderRadius: "9999px" },
            }}
          >
            <Flex align="flex-start" gap={0} w="fit-content" px={0.5}>
              {hitos.map((h, i) => (
                <React.Fragment key={h.key}>
                  {i > 0 && (
                    <Box
                      flexShrink={0}
                      h="1.5px"
                      w={{ base: "16px", md: "26px" }}
                      bg={`${d.txt}66`}
                      mt={{ base: "28px", md: "36px" }}
                    />
                  )}
                  <Flex direction="column" align="center" gap={1.5} w={{ base: "72px", md: "92px" }} flexShrink={0}>
                    <Circulo
                      foto={h.foto}
                      alt={h.titulo}
                      texto={h.anio}
                      d={d}
                      size={{ base: "56px", md: "72px" }}
                      lazy
                    />
                    <Text
                      color={d.txt}
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight="700"
                      lineHeight="1.2"
                      textAlign="center"
                      noOfLines={2}
                      textShadow={sombra}
                    >
                      {h.titulo}
                    </Text>
                    {h.anio && (
                      <Text
                        color={`${d.txt}b3`}
                        fontSize="2xs"
                        fontStyle="italic"
                        lineHeight="1.15"
                        textAlign="center"
                        noOfLines={1}
                        textShadow={sombra}
                      >
                        {h.anio}
                      </Text>
                    )}
                  </Flex>
                </React.Fragment>
              ))}
            </Flex>
          </Box>

          {/* «Descúbrelo dentro»: al tocar la línea (o al pasar por encima en
              ordenador). No hay nada que abrir aquí. */}
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            pointerEvents="none"
            opacity={aviso ? 1 : 0}
            transition="opacity 0.25s ease"
            _groupHover={{ opacity: 1 }}
          >
            <Text
              px={{ base: 4, md: 5 }}
              py={{ base: 2, md: 2.5 }}
              borderRadius="full"
              bg={`${d.bg}f2`}
              color={d.txt}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              boxShadow={`0 0 18px ${d.txt}55, 0 6px 24px rgba(0,0,0,0.35)`}
            >
              {AVISO}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </CajaLisa>
  );
}
