import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import ArbolDeLaVida from "../../components/global/ArbolDeLaVida";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import {
  CABALA_ILUSTRACIONES_VINETAS,
  CABALA_ILUSTRACIONES_VINETA_KEYS,
} from "../../components/metodo/cabalaIlustraciones";
import type { CabalaPageKey } from "../../components/metodo/cabalaSefirot";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  CajaLisa,
  CierreCrearCuenta,
  IdeasConMuestra,
  SeparadorSeccion,
  VideoMuestra,
  type IdeaPresentacion,
} from "../../components/metodo/presentacionUi";
import { CabalaIcon, cabalaBg, cabalaNom } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/cabala — presentación de Cábala.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. EL ÁRBOL DE LA VIDA: el de verdad, con su animación, que NO arranca hasta
//      que el Árbol asoma en pantalla (`animarAlEntrar`) — queda muy por debajo
//      del pliegue y, si no, nadie la ve. Se pulsa una sefirá y se abre su
//      ilustración. Es la pieza que vende esta disciplina sola.
//   4. LO QUE HAY DENTRO: tres ideas y, al lado, el Árbol en pequeño (este NO se
//      pulsa: es una muestra). En móvil no sale: a una columna caería justo
//      debajo del Árbol grande, repetido.
//   5. Las ilustraciones de la disciplina.
//   6. Llamada a la acción.
//
// OJO con dos reglas de Cábala:
//   · Ningún box lleva sombra oscura ni filo de color: todos el halo del header
//     (CajaLisa / cabalaGlow), para que ninguno destaque más que él.
//   · El Árbol NO se envuelve en un Reveal con blur ni retrasos largos — su
//     dinamismo son sus propios keyframes SVG y taparlo lo estropea.
// ─────────────────────────────────────────────────────────────────────────────

/** Lo que hay dentro, en tres ideas. ✍️ Textos editables. */
const IDEAS: IdeaPresentacion[] = [
  {
    titulo: "Filosofía de la Cábala",
    parrafos: [
      "Descubrirás una forma nueva de comprender al ser humano, sus conflictos internos y su potencial de desarrollo.",
    ],
  },
  {
    titulo: "Las Sefirot como herramientas",
    parrafos: [
      "Aprenderás a desarrollar cualidades concretas que transforman la manera en que te relacionas contigo mismo y con los demás.",
    ],
  },
  {
    titulo: "Sesiones individuales",
    parrafos: [
      "Un espacio para aterrizar estos principios en situaciones reales de tu Vida y convertirlos en algo práctico.",
    ],
    nota: "Opcional. Se cobra aparte.",
  },
];

export default function PresentacionCabala({ d }: { d: PresentacionDisciplina }) {
  // El Árbol de muestra (bloque 4) solo existe donde hay dos columnas: en móvil se
  // repetiría el mismo dibujo debajo del grande. `ssr: false` para que resuelva
  // ya en el primer render y no se monte para desmontarse acto seguido.
  const esMovil = useBreakpointValue({ base: true, lg: false }, { ssr: false });
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  // Índice dentro de CABALA_ILUSTRACIONES_VINETAS de la sefirá abierta.
  const [sefiraIdx, setSefiraIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  /** Abre la ilustración de una sefirá (o de Da'at) por su clave. */
  const abrirSefira = (key: CabalaPageKey) => {
    const i = CABALA_ILUSTRACIONES_VINETA_KEYS.indexOf(key);
    if (i >= 0) setSefiraIdx(i);
  };

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/cabala.webp",
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <CabalaIcon size={{ base: size, md: size }} />;

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
            icon={<CabalaIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={cabalaBg}
            color={d.txt}
            nom={cabalaNom}
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
              nom={cabalaNom}
              bg={cabalaBg}
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

        {/* ══ 3. EL ÁRBOL DE LA VIDA ══
            El Árbol de verdad, con su propia animación (los senderos se dibujan y
            las sefirot irrumpen una a una). NO va envuelto en un Reveal: su
            dinamismo es suyo y taparlo lo estropea. */}
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>El Árbol de la Vida</SeparadorSeccion>

          {/* Sin filo de color y con el halo del header: la caja no debe destacar
              más que él (regla de las presentaciones y del recorrido de Cábala). */}
          <CajaLisa d={d}>
            <Flex
              direction="column"
              align="center"
              gap={{ base: 5, md: 7 }}
              px={{ base: 4, md: 10 }}
              py={{ base: 8, md: 11 }}
            >
              <Text
                color={d.txt}
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight={{ base: "1.8", md: "1.85" }}
                textAlign="center"
                maxW="720px"
                textShadow={sombra}
              >
                Diez dimensiones y una más oculta —Da'at— unidas por veintidós senderos. No es un
                adorno: es un mapa del alma humana con más de mil años de estudio.
                <b> Pulsa cualquiera y la lees.</b>
              </Text>

              <ArbolDeLaVida
                maxWidth="520px"
                showDaat
                suppressInternalModal
                animarAlEntrar
                onSefiraClick={(s) => abrirSefira(s.key as CabalaPageKey)}
                onDaatClick={() => abrirSefira("daat")}
              />
            </Flex>
          </CajaLisa>
        </Flex>

        {/* ══ 4. LO QUE HAY DENTRO ══
            Tres ideas y, al lado, el Árbol en pequeño. Ese Árbol NO se pulsa: es
            una muestra, no un menú (el de arriba sí se abre). */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Lo que hay dentro</SeparadorSeccion>
          <IdeasConMuestra d={d} ideas={IDEAS}>
            {/* En móvil NO va: el Árbol de arriba ya se ha visto entero y aquí,
                a una columna, sería el mismo dibujo dos veces seguidas. */}
            {!esMovil && (
              <CajaLisa d={d} h="100%" sx={{ pointerEvents: "none" }}>
                <Flex h="100%" align="center" justify="center" px={{ base: 5, md: 8 }} py={{ base: 7, md: 9 }}>
                  <ArbolDeLaVida maxWidth="340px" showDaat suppressInternalModal animarAlEntrar />
                </Flex>
              </CajaLisa>
            )}
          </IdeasConMuestra>
        </Flex>

        {/* ══ 5. ILUSTRACIONES ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Cábala</SeparadorSeccion>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", md: `repeat(${Math.min(comics.length, 3)}, 1fr)` }}
              gap={{ base: 6, md: 6 }}
            >
              {comics.map((entry, i) => (
                <IlustracionCard key={entry.id} entry={entry} i={i} columnas={3} onOpen={() => setAbierta(entry)} />
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ QUIÉN LO HA HECHO ══
            Antes de pedir la cuenta: quién está detrás. La MISMA tarjeta de
            /welcome y /elMetodo (components/welcome/CreadoraCard), con
            `sinMargenes` porque esta página ya pone los suyos. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1100px">Quién está detrás</SeparadorSeccion>
          <CreadoraCard sinMargenes />
        </Flex>

        {/* ══ 6. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

      {/* Ilustración de la sefirá pulsada (el visor de Cábala, ámbar sobre la
          nebulosa). Se puede pasar de una dimensión a otra con las flechas. */}
      <CabalaSefiraIlustracionModal
        isOpen={sefiraIdx != null}
        vinetas={CABALA_ILUSTRACIONES_VINETAS}
        initialIndex={sefiraIdx ?? 0}
        onClose={() => setSefiraIdx(null)}
      />

      <ComicModal
        isOpen={!!abierta}
        onClose={() => setAbierta(null)}
        vinetas={abierta?.vinetas ?? []}
        themeColor={abierta?.themeColor}
        disciplinaBgImage={abierta?.disciplinaBgImage}
        disciplinaBgColor={abierta?.disciplinaBgColor}
        textShadow={abierta?.textShadow}
        textColor={abierta?.textColor}
      />
    </Box>
  );
}
