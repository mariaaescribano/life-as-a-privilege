import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { DisciplinaFichaBox } from "../../components/metodo/DisciplinaFicha";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import { ComicModal } from "../../components/metodo/ComicModal";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  BLANCO_GLOW,
  CierreCrearCuenta,
  ComicMiniCard,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { AstrologiaIcon, astrologiaBg, astrologiaNom } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/astrologia — presentación de Astrología (destino del QR de su cartel).
//
// Montaje propio (no el genérico), en este orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio (el mismo del mandala de /elMetodo)
//      y, a su derecha en ordenador, el vídeo grande. Los dos cuadrados.
//   3. La ficha que en /elMetodo es un popup, aquí desplegada en la página, y al
//      lado una carta natal de muestra que se dibuja sola.
//   4. Tres cómics en la misma fila: historia, planetas y signos.
//   5. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Las tres series que se enseñan aquí, en este orden. */
const COMICS = ["astro-historia", "astro-planetas", "astro-signos"];

export default function PresentacionAstrologia({ d }: { d: PresentacionDisciplina }) {
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  // El vídeo grande de al lado del box. El botón «Ver por dentro» del box lo pone
  // en marcha aquí mismo, en vez de abrir el popup: el vídeo ya está a la vista.
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => COMICS.map((id) => ILUSTRACIONES.find((i) => i.id === id)).filter(Boolean) as IlustracionEntry[],
    [],
  );

  // Astrología no tiene foto de fondo (usa el cielo estrellado), así que solo
  // hay que esperar al mandala y a las portadas de los tres cómics.
  const fotosListas = useImagesReady(["/img/icono/life.png", ...comics.map((c) => c.cover)]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const renderIcon = (size: string) => <AstrologiaIcon size={{ base: size, md: size }} />;

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
        {/* ══ 1. HEADER de la disciplina ══
            El mismo del recorrido, pero sin prev/next/extra: aquí no hay a dónde
            navegar, solo anuncia dónde has llegado. */}
        <Reveal direction="down" distance={18} duration={0.8} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={astrologiaNom}
            bgColor={astrologiaBg}
            color={d.txt}
            nom={astrologiaNom}
            maxW="900px"
            mb={0}
          />
        </Reveal>

        {/* La frase del cartel, justo debajo del header. */}
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
              textShadow={BLANCO_GLOW}
            >
              {d.gancho}
            </Text>
          </RevealItem>
          <RevealItem w="100%" maxW="420px">
            <Box h="1px" bgGradient="linear(to-r, transparent, #ffffff8c, transparent)" />
          </RevealItem>
        </RevealStagger>

        {/* ══ 2. BOX DE LA DISCIPLINA (con su precio) + VÍDEO ══
            El box es el mismo que va al lado del mandala en /elMetodo. En móvil,
            uno debajo del otro (el box primero: es lo que se ha venido a saber). */}
        <Grid
          w="100%"
          maxW="1180px"
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, md: 8 }}
          alignItems="stretch"
        >
          <Reveal inView direction="right" distance={26} duration={0.7} h="100%">
            <DisciplinaVideoBox
              nom={astrologiaNom}
              bg={astrologiaBg}
              txt={d.txt}
              videoIntro={d.videoIntro}
              paso={d.paso}
              renderIcon={renderIcon}
              tieneVideo={!!d.video}
              onVerVideo={verVideo}
              // El vídeo está justo al lado: el botón de muestra sobra, y la
              // letra va más grande porque aquí el box ocupa media página.
              sinBoton
              textoGrande
              h="100%"
            />
          </Reveal>
          <Reveal inView direction="left" distance={26} duration={0.7} delay={0.1} h="100%">
            <VideoMuestra d={d} videoRef={videoRef} />
          </Reveal>
        </Grid>

        {/* ══ 3. LA FICHA (el popup de /elMetodo, aquí desplegado) + CARTA ══ */}
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1100px">De qué trata</SeparadorSeccion>

          <Grid
            w="100%"
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 10, md: 10 }}
            alignItems="stretch"
          >
            <Reveal inView direction="right" distance={26} duration={0.75} h="100%">
              <DisciplinaFichaBox
                nom={astrologiaNom}
                bg={astrologiaBg}
                txt={d.txt}
                desc={d.desc}
                contenido={d.contenido}
                renderIcon={renderIcon}
                // Solo las tres cajas: el nombre, el icono y la frase ya están
                // arriba, y así esta columna casa de altura con la carta.
                soloContenido
                alto
              />
            </Reveal>

            {/* Carta de muestra: se dibuja sola (los planetas brotan uno a uno y
                después se trazan los aspectos). El montaje se retrasa hasta que
                asoma con `inView`, si no la animación pasa fuera de pantalla.
                Va dentro de un box con el cielo estrellado, del mismo material
                que la ficha de al lado, para que pesen igual. */}
            <Reveal inView direction="left" distance={26} duration={0.8} delay={0.1} h="100%">
              <Box
                position="relative"
                w="100%"
                h="100%"
                borderRadius="3xl"
                overflow="hidden"
                border={`1.5px solid ${d.txt}66`}
                boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
              >
                <DisciplinaBgLayer nom={astrologiaNom} borderRadius="3xl" />
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="100%"
                  gap={{ base: 5, md: 7 }}
                  position="relative"
                  zIndex={1}
                  px={{ base: 5, md: 8 }}
                  py={{ base: 8, md: 12 }}
                >
                  <CartaAstral3D color={d.txt} />
                  <Text
                    color={d.txt}
                    fontSize={{ base: "md", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.24em"
                    textTransform="uppercase"
                    textAlign="center"
                    textShadow={`0 0 14px ${d.txt}66, 0 0 34px ${d.txt}33`}
                  >
                    Carta de muestra
                  </Text>
                </Flex>
              </Box>
            </Reveal>
          </Grid>
        </Flex>

        {/* ══ 4. LOS TRES CÓMICS, en la misma fila ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Astrología</SeparadorSeccion>
            <Grid w="100%" templateColumns="repeat(3, 1fr)" gap={{ base: 3, sm: 5, md: 6 }}>
              {comics.map((entry, i) => (
                <Reveal key={entry.id} inView direction="up" distance={18} duration={0.65} delay={i * 0.1}>
                  <ComicMiniCard
                    titulo={entry.titulo}
                    cover={entry.cover}
                    color={entry.cardColor ?? entry.themeColor}
                    onOpen={() => setAbierta(entry)}
                  />
                </Reveal>
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ 5. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

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
