import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import ArbolDeLaVida from "../../components/global/ArbolDeLaVida";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CAJA_GLOW, CAJA_GLOW_FUERTE, CAJA_GLOW_HOVER } from "../../components/metodo/cabalaGlow";
import {
  CABALA_ILUSTRACIONES_VINETAS,
  CABALA_ILUSTRACIONES_VINETA_KEYS,
} from "../../components/metodo/cabalaIlustraciones";
import { CABALA_SEFIROT } from "../../components/metodo/cabalaSefirot";
import type { CabalaPageKey } from "../../components/metodo/cabalaSefirot";
import { POLARIDAD_LABEL } from "../../components/metodo/cabalaDiagnostico";
import { NUM_PREGUNTAS } from "../../components/metodo/cabalaTest";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  BLANCO_GLOW,
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { CabalaIcon, cabalaBg, cabalaNom } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/cabala — presentación de Cábala.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. EL ÁRBOL DE LA VIDA: el de verdad, con su animación. Se pulsa una sefirá
//      y se abre su ilustración. Es la pieza que vende esta disciplina sola.
//   4. LAS ONCE DIMENSIONES: cada una con la pregunta que la abre, y cómo se
//      diagnostican (poco desarrollada / integrada / sobreexpresada).
//   5. Las ilustraciones de la disciplina.
//   6. Llamada a la acción.
//
// OJO con dos reglas de Cábala:
//   · Ningún box lleva sombra oscura: todos el halo de cabalaGlow.
//   · El Árbol NO se envuelve en un Reveal con blur ni retrasos largos — su
//     dinamismo son sus propios keyframes SVG y taparlo lo estropea.
// ─────────────────────────────────────────────────────────────────────────────

export default function PresentacionCabala({ d }: { d: PresentacionDisciplina }) {
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

          <Box
            position="relative"
            w="100%"
            borderRadius="3xl"
            overflow="hidden"
            border={`1.5px solid ${d.txt}66`}
            boxShadow={CAJA_GLOW_FUERTE}
          >
            <DisciplinaBgLayer nom={cabalaNom} borderRadius="3xl" />

            <Flex
              direction="column"
              align="center"
              gap={{ base: 5, md: 7 }}
              position="relative"
              zIndex={1}
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
                onSefiraClick={(s) => abrirSefira(s.key as CabalaPageKey)}
                onDaatClick={() => abrirSefira("daat")}
              />
            </Flex>
          </Box>
        </Flex>

        {/* ══ 4. LAS ONCE DIMENSIONES ══
            Cada una con la pregunta que la abre. Es lo que hace entender que esto
            no es teoría: son once preguntas sobre tu propia Vida. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Las once dimensiones</SeparadorSeccion>

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
              Cada dimensión se abre con una pregunta. Y cada una se puede medir: ninguna es buena
              ni mala, pero puede estar {POLARIDAD_LABEL.deficit.toLowerCase()},{" "}
              {POLARIDAD_LABEL.equilibrio.toLowerCase()} o {POLARIDAD_LABEL.exceso.toLowerCase()}.
            </Text>
          </Reveal>

          <RevealStagger
            inView
            stagger={0.07}
            delayChildren={0.1}
            amount={0.1}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={{ base: 4, md: 5 }}
          >
            {CABALA_SEFIROT.map((s) => (
              <RevealItem
                key={s.key}
                direction="up"
                distance={18}
                scaleFrom={0.96}
                duration={0.65}
                position="relative"
                overflow="hidden"
                borderRadius="2xl"
                h="100%"
                border={`1px solid ${d.txt}55`}
                cursor="pointer"
                onClick={() => abrirSefira(s.key)}
                sx={{
                  boxShadow: CAJA_GLOW,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  _hover: {
                    transform: "translateY(-4px)",
                    borderColor: d.txt,
                    boxShadow: CAJA_GLOW_HOVER,
                  },
                }}
              >
                <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
                <Flex
                  direction="column"
                  gap={2}
                  position="relative"
                  zIndex={1}
                  px={{ base: 5, md: 6 }}
                  py={{ base: 5, md: 6 }}
                  h="100%"
                >
                  <Flex align="baseline" gap={2.5}>
                    <Text
                      color={`${d.txt}aa`}
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="700"
                      letterSpacing="0.1em"
                      textShadow={sombra}
                    >
                      {String(s.numero).padStart(2, "0")}
                    </Text>
                    <Text
                      color={d.txt}
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="700"
                      letterSpacing="0.04em"
                      lineHeight="1.2"
                      textShadow={sombra}
                    >
                      {s.titulo}
                    </Text>
                  </Flex>
                  <Text
                    color={d.txt}
                    fontSize={{ base: "md", md: "lg" }}
                    fontStyle="italic"
                    lineHeight={{ base: "1.7", md: "1.75" }}
                    textShadow={sombra}
                  >
                    {s.frase}
                  </Text>
                </Flex>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal inView direction="up" distance={14} duration={0.65}>
            <Text
              color="rgba(255,255,255,0.85)"
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="700px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Dentro respondes {NUM_PREGUNTAS} preguntas por dimensión y sale tu Mapa Evolutivo:
              qué energías te sostienen, cuáles te desbordan y por dónde empezar. Con su
              diagnóstico en PDF.
            </Text>
          </Reveal>
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
