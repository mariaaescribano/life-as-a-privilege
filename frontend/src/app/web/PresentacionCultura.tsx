import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { useVideoLargo } from "../../components/global/VideoLargo";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { HISTORIAS_CULTURA, tituloHistoria } from "../../components/metodo/culturaHistorias";
import { historiaTraducida } from "../../components/metodo/culturaHistorias.en";
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
import { useIdioma, useT } from "../../i18n";
import { useRecorridoContenido } from "../../data/useRecorridoContenido";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";

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
const AVISO = "presentacion.cultura.aviso" as const;

export default function PresentacionCultura({ d }: { d: PresentacionDisciplina }) {
  const { segunIdioma, idioma } = useIdioma();
  // El nombre visible; `d.titulo` solo vale para casar la URL.
  const disciplina = useNombreDisciplinaEnMapa()(d.nom);
  const t = useT();
  // El contenido de la disciplina, ya en el idioma activo.
  const cont = useRecorridoContenido()[d.clave];
  // El vídeo completo pesa entre 8 y 27 MB, así que en la caja de arriba va el
  // clip corto y el original no se baja hasta que alguien pulsa — y aun pulsando,
  // se pregunta si la conexión parece de pago. Ver global/VideoLargo.tsx.
  const { abrir: verVideo, modal: videoLargo } = useVideoLargo({ src: d.video, accent: d.txt });

  // Las seis Historias en el idioma activo. El título sale del diccionario
  // (`tituloHistoria`), que es el mismo que se lee dentro del recorrido; las
  // eras salen del texto traducido, y lo que no esté traducido se queda en
  // español (ver `culturaHistorias.en.ts`).
  const historias = useMemo(
    () => ORDEN_HISTORIAS
      .map((k) => ({
        key: k,
        ...HISTORIAS_CULTURA[k],
        ...historiaTraducida(HISTORIAS_CULTURA[k], k, idioma),
        titulo: tituloHistoria(k),
        ...historiaVisual(k),
      }))
      .filter((h) => h.hitos?.length),
    [idioma],
  );

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    CULTURA_IMG,
    ...historias.map((h) => h.portada).filter((p): p is string => !!p),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const renderIcon = (size: string) => <CulturaIcon size={{ base: size, md: size }} />;

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
            title={disciplina}
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
              fontSize={{ base: "lg", md: "2xl" }}
              fontStyle="italic"
              fontWeight="700"
              lineHeight="1.15"
              letterSpacing="0.04em"
              maxW="760px"
            >
              {segunIdioma(d.gancho)}
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
          // `1fr` es en realidad `minmax(auto, 1fr)`: un item de rejilla NO se
          // encoge por debajo del mínimo de su contenido. El <video> de la
          // muestra mide 1080×1080 de verdad, así que reclamaba 784px y dejaba
          // la columna del box en 364; con esa anchura el texto del box pedía
          // 1147px de alto, se salía de la rejilla y la sección de abajo se
          // pintaba encima. Con `minWidth: 0` las dos columnas son de verdad
          // 1fr, iguales, y de ahí salen las cajas cuadradas.
          //
          // Quién manda el alto: el CUADRADO, no el contenido. El box no cambia
          // de tamaño; lo que se estira es la letra, hasta llenarlo. El vídeo
          // sigue al box (`h="100%"` y recorta con `object-fit: cover`).
          sx={{
            "& > *": { minWidth: 0 },
            // El box va CUADRADO y no cambia de tamaño: su alto sale de la
            // anchura de la columna, no del contenido. Es lo que le da al texto
            // un hueco fijo que llenar (ver el autoajuste de
            // DisciplinaVideoBox) y lo que mantiene las dos cajas iguales.
            // Hace falta ponerlo AQUÍ y no dentro del vídeo: el suyo lo anula
            // su propio `h="100%"`.
            // Solo de `lg` para arriba; en móvil se apilan y crecen a lo alto.
            "@media (min-width: 62em)": { "& > *": { aspectRatio: "1 / 1" } },
          }}
        >
          <Reveal inView direction="right" distance={26} duration={0.7} h="100%">
            <DisciplinaVideoBox
              nom={culturaNom}
              bg={culturaBg}
              txt={d.txt}
              videoIntro={cont.videoIntro}
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
            <VideoMuestra d={d} onAbrir={verVideo} />
          </Reveal>
        </Grid>

        {/* ══ 3. LAS SEIS HISTORIAS ══
            Su portada en un círculo y el título debajo. Sin caja: los círculos se
            presentan solos sobre el turquesa. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">{t("presentacion.cultura.seisHistorias")}</SeparadorSeccion>

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
          <SeparadorSeccion maxW="1180px">{t("presentacion.cultura.lineasTiempo")}</SeparadorSeccion>

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
              {t("presentacion.cultura.lineasTexto")}
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

        {/* ══ QUIÉN LO HA HECHO ══
            Antes de pedir la cuenta: quién está detrás. La MISMA tarjeta de
            /welcome y /elMetodo (components/welcome/CreadoraCard), con
            `sinMargenes` porque esta página ya pone los suyos. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1100px">{t("presentacion.sec.laCreadora")}</SeparadorSeccion>
          <CreadoraCard sinMargenes />
        </Flex>

        {/* ══ 5. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>{t("presentacion.sec.empiezaPorAqui")}</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

      {videoLargo}
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Círculo con foto (portada de una Historia o era de su línea).
//
// Luz: aro fino del color de la disciplina + sombra OSCURA de apoyo. Antes
// llevaba un halo turquesa ancho que, sobre el fondo de acuarela de Cultura, se
// mezclaba con él y dejaba los círculos lavados y sin profundidad.
// Si la foto aún no existe, se queda su emoji o su número: nunca un icono roto
// ni un párrafo apretado dentro del círculo.
// ─────────────────────────────────────────────────────────────────────────────
function Circulo({
  foto,
  alt,
  emoji,
  numero,
  d,
  size,
  lazy = false,
}: {
  foto?: string;
  alt: string;
  /** Reserva si no hay foto (portadas de Historia). */
  emoji?: string;
  /** Reserva si no hay foto ni emoji (eras: su número en la línea). */
  numero?: number;
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
      bg="rgba(4,26,26,0.72)"
      border={`1px solid ${d.txt}59`}
      boxShadow="0 6px 18px rgba(0,0,0,0.45), 0 0 0 4px rgba(4,26,26,0.35)"
    >
      {hayFoto ? (
        <Box
          as="img"
          src={encodeURI(foto!)}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          w="100%"
          h="100%"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            // Un punto de saturación y contraste: las fotos de época son
            // apagadas y sobre el fondo oscuro se veían grises.
            filter: "saturate(1.08) contrast(1.06)",
          }}
          onError={() => setFalla(true)}
        />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text
            color={d.txt}
            fontSize={emoji ? { base: "3xl", md: "4xl" } : { base: "xl", md: "2xl" }}
            fontWeight="700"
            lineHeight="1"
            opacity={emoji ? 1 : 0.85}
            textAlign="center"
          >
            {emoji ?? (numero != null ? String(numero).padStart(2, "0") : "")}
          </Text>
        </Flex>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LÍNEA DE EJEMPLO de una Historia: su nombre y sus primeras eras en fila, con
// la línea que las une y, al final, un círculo punteado con las que faltan.
//
// Es una MUESTRA: no navega a ninguna parte. Al pasar por encima (o al tocarla)
// la fila se atenúa y aparece «Descúbrelo dentro».
//
// DECISIONES DE CALIDAD (venían de que se veía apretado y lavado):
//   · Solo ERAS_MUESTRA eras, grandes y legibles, en vez de las 6-13 de la
//     Historia en miniatura con el título cortado y una barra de scroll a la
//     vista. Las que faltan se resumen en el círculo «+N».
//   · Velo oscuro propio de la caja: unifica el fondo de acuarela y hace que
//     salten las fotos y la letra.
//   · Letra blanca con sombra NEGRA (no el halo blanco de la disciplina, que
//     sobre esta foto ensucia) y tamaños de leer, no de adivinar.
// ─────────────────────────────────────────────────────────────────────────────
const ERAS_MUESTRA = 5;

/** Sombra de contraste, sin nada de luz: la letra va sobre foto oscura. */
const SOMBRA_NEGRA = "0 1px 3px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)";

const CIRCULO = { base: "84px", md: "112px" };
const COLUMNA = { base: "96px", md: "132px" };
const UNION = { base: "16px", md: "26px" };

function LineaEjemplo({
  d,
  titulo,
  hitos,
}: {
  d: PresentacionDisciplina;
  titulo: string;
  hitos: HitoHistoria[];
}) {
  const t = useT();
  const [aviso, setAviso] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // El aviso se va solo: es un recordatorio, no un cartel permanente.
  const mostrarAviso = () => {
    setAviso(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(false), 1800);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const visibles = hitos.slice(0, ERAS_MUESTRA);
  const restantes = hitos.length - visibles.length;

  return (
    <CajaLisa d={d} radio="2xl" role="group" onClick={mostrarAviso} cursor="default">
      {/* Velo de la caja: el fondo de acuarela de Cultura tiene zonas claras y
          zonas oscuras; con este velo todas las líneas parten del mismo tono. */}
      <Box position="absolute" inset={0} bg="rgba(4,26,26,0.46)" pointerEvents="none" />

      <Flex position="relative" direction="column" gap={{ base: 4, md: 5 }}
            px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }}>
        {/* Cabecera de la línea: la Historia y cuántas eras tiene */}
        <Flex align="center" justify="space-between" gap={3}>
          <Text
            color="white"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            letterSpacing="0.02em"
            lineHeight="1.2"
            style={{ textShadow: SOMBRA_NEGRA }}
          >
            {titulo}
          </Text>
          <Flex
            flexShrink={0}
            px={{ base: 2.5, md: 3 }}
            py={1}
            borderRadius="full"
            border={`1px solid ${d.txt}4d`}
            bg="rgba(4,26,26,0.5)"
          >
            <Text
              color={d.txt}
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="700"
              letterSpacing="0.18em"
              textTransform="uppercase"
              whiteSpace="nowrap"
            >
              {t("presentacion.cultura.eras", { n: hitos.length })}
            </Text>
          </Flex>
        </Flex>

        {/* La línea. Sin barra de scroll a la vista: si en móvil no cabe, se
            arrastra con el dedo. */}
        <Box position="relative">
          <Box
            overflowX="auto"
            overflowY="hidden"
            sx={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Flex align="flex-start" gap={0} w="fit-content" mx="auto" px={0.5}>
              {visibles.map((h, i) => (
                <React.Fragment key={h.key}>
                  {i > 0 && <Union d={d} />}
                  <Flex direction="column" align="center" gap={2} w={COLUMNA} flexShrink={0}>
                    <Circulo foto={h.foto} alt={h.titulo} numero={i + 1} d={d} size={CIRCULO} lazy />
                    <Text
                      color="white"
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="700"
                      lineHeight="1.25"
                      textAlign="center"
                      noOfLines={2}
                      style={{ textShadow: SOMBRA_NEGRA }}
                    >
                      {h.titulo}
                    </Text>
                    {h.anio && (
                      <Text
                        color={d.txt}
                        fontSize="2xs"
                        fontWeight="600"
                        letterSpacing="0.1em"
                        lineHeight="1.2"
                        textAlign="center"
                        noOfLines={1}
                        opacity={0.95}
                        style={{ textShadow: SOMBRA_NEGRA }}
                      >
                        {h.anio}
                      </Text>
                    )}
                  </Flex>
                </React.Fragment>
              ))}

              {/* Las eras que no se enseñan: un círculo punteado con el resto.
                  Es lo que dice «esto sigue dentro» sin cortar la línea de golpe. */}
              {restantes > 0 && (
                <>
                  <Union d={d} punteada />
                  <Flex direction="column" align="center" gap={2} w={COLUMNA} flexShrink={0}>
                    <Flex
                      w={CIRCULO}
                      h={CIRCULO}
                      flexShrink={0}
                      borderRadius="full"
                      align="center"
                      justify="center"
                      bg="rgba(4,26,26,0.45)"
                      border={`1px dashed ${d.txt}80`}
                    >
                      <Text
                        color={d.txt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        lineHeight="1"
                        style={{ textShadow: SOMBRA_NEGRA }}
                      >
                        +{restantes}
                      </Text>
                    </Flex>
                    <Text
                      color={d.txt}
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="600"
                      fontStyle="italic"
                      lineHeight="1.25"
                      textAlign="center"
                      style={{ textShadow: SOMBRA_NEGRA }}
                    >
                      {t("presentacion.masDentro")}
                    </Text>
                  </Flex>
                </>
              )}
            </Flex>
          </Box>

          {/* «Descúbrelo dentro»: la fila se atenúa un poco y sale el mensaje.
              Aquí no hay nada que abrir. */}
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            pointerEvents="none"
            borderRadius="xl"
            bg="rgba(4,26,26,0.55)"
            sx={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
            opacity={aviso ? 1 : 0}
            transition="opacity 0.28s ease"
            _groupHover={{ opacity: 1 }}
          >
            <Text
              px={{ base: 4, md: 6 }}
              py={{ base: 2, md: 2.5 }}
              borderRadius="full"
              bg="rgba(4,26,26,0.92)"
              border={`1px solid ${d.txt}66`}
              color={d.txt}
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              boxShadow="0 8px 26px rgba(0,0,0,0.5)"
            >
              {t(AVISO)}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </CajaLisa>
  );
}

/** El tramo de línea que une dos eras, a la altura del centro del círculo. */
function Union({ d, punteada = false }: { d: PresentacionDisciplina; punteada?: boolean }) {
  return (
    <Box
      flexShrink={0}
      w={UNION}
      h="2px"
      mt={{ base: `calc(${CIRCULO.base} / 2)`, md: `calc(${CIRCULO.md} / 2)` }}
      bg={punteada ? "transparent" : `${d.txt}80`}
      borderTop={punteada ? `2px dashed ${d.txt}80` : undefined}
    />
  );
}
