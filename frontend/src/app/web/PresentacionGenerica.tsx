import React, { useMemo, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Breathe, Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer, hasDisciplinaBg, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  BLANCO_GLOW,
  BLANCO_GLOW_SUAVE,
  CajaDisciplina,
  CierreCrearCuenta,
  SeparadorSeccion,
} from "../../components/metodo/presentacionUi";
import type { PresentacionDisciplina as Presentacion } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// Presentación GENÉRICA de una disciplina (/d/:disciplina).
//
// Es el montaje por defecto: sirve a cualquier disciplina que todavía no tenga
// una página propia (Astrología ya la tiene, en PresentacionAstrologia.tsx).
// El fondo es SIEMPRE el turquesa de la casa; son las CAJAS las que llevan el
// estilo (foto de fondo + colores) de la disciplina.
//
// Nada del contenido se escribe aquí:
//   · textos  → data/recorridoContenido.ts (los mismos de /elMetodo)
//   · frase del cartel → data/presentacionDisciplinas.ts
//   · ilustraciones → components/metodo/ilustracionesGaleria.ts (filtradas)
// ─────────────────────────────────────────────────────────────────────────────

export default function PresentacionGenerica({ d }: { d: Presentacion }) {
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);

  // Las series de ilustraciones de ESTA disciplina, tal cual están en la galería
  // (misma portada, mismo popup inmersivo). Cultura todavía no tiene ninguna:
  // la sección entera se oculta si el filtro sale vacío.
  const ilustraciones = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  // La página no se pinta hasta que están el mandala, la foto de fondo de la
  // disciplina y las portadas de sus ilustraciones: así entra de una pieza.
  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    disciplinaBgImg(d.nom),
    ...ilustraciones.map((i) => i.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const hasBg = hasDisciplinaBg(d.nom);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex
        flex="1"
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 16, md: 24 }}
        gap={{ base: 12, md: 16 }}
      >
        {/* ══ HERO ══ icono de la disciplina + frase del cartel ══ */}
        <RevealStagger
          stagger={0.13}
          delayChildren={0.1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={{ base: 5, md: 7 }}
          w="100%"
          maxW="900px"
          textAlign="center"
        >
          {/* Icono dentro de un círculo con la foto de la disciplina */}
          <RevealItem direction="down" distance={18} scaleFrom={0.9}>
            <Float amplitude={7} duration={6}>
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Box
                  position="absolute"
                  w={{ base: "170px", md: "210px" }}
                  h={{ base: "170px", md: "210px" }}
                  borderRadius="full"
                  bg={`radial-gradient(circle, ${d.txt}33 0%, ${d.txt}00 70%)`}
                />
                <Breathe scale={0.02} duration={5}>
                  <Box
                    bg={hasBg ? "transparent" : d.bg}
                    borderRadius="full"
                    w={{ base: "112px", md: "136px" }}
                    h={{ base: "112px", md: "136px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border={`3px solid ${d.txt}`}
                    boxShadow={`0 0 28px ${d.txt}cc, 0 4px 20px ${d.txt}77`}
                    position="relative"
                    overflow={hasBg ? "hidden" : undefined}
                  >
                    {hasBg && <DisciplinaBgLayer nom={d.nom} borderRadius="full" />}
                    <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                      <d.Icon size={{ base: "60px", md: "70px" }} />
                    </Box>
                  </Box>
                </Breathe>
              </Box>
            </Float>
          </RevealItem>

          {/* Nombre de la disciplina */}
          <RevealItem direction="up" distance={14}>
            <Text
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.34em"
              textTransform="uppercase"
              fontWeight="600"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              {d.titulo}
            </Text>
          </RevealItem>

          {/* LA FRASE DEL CARTEL — la misma que va impresa, para que quien
              escanea reconozca al instante que ha llegado bien. */}
          <RevealItem direction="up" distance={16}>
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              lineHeight="1.14"
              letterSpacing="0.04em"
              maxW="760px"
              textShadow={BLANCO_GLOW}
            >
              {d.gancho}
            </Text>
          </RevealItem>

          <RevealItem direction="none" scaleFrom={0.3} w="100%" maxW="420px">
            <Box h="1px" bgGradient="linear(to-r, transparent, #ffffff8c, transparent)" />
          </RevealItem>

          {/* Frase de una línea de /elMetodo */}
          <RevealItem direction="up" distance={14}>
            <Text
              color="rgba(255,255,255,0.92)"
              fontSize={{ base: "lg", md: "2xl" }}
              fontStyle="italic"
              lineHeight="1.6"
              letterSpacing="0.02em"
              maxW="680px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              {d.desc}
            </Text>
          </RevealItem>
        </RevealStagger>

        {/* ══ DE QUÉ TRATA ══ el párrafo largo de /elMetodo ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>De qué trata</SeparadorSeccion>
          <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.7} w="100%">
            <CajaDisciplina d={d}>
              <Text
                color={d.txt}
                fontSize={{ base: "md", md: "xl" }}
                lineHeight={{ base: "1.75", md: "1.85" }}
                letterSpacing="0.01em"
                textAlign="center"
                textShadow={sombra}
              >
                {d.modalDesc}
              </Text>
            </CajaDisciplina>
          </Reveal>
        </Flex>

        {/* ══ QUÉ VAS A COMPRENDER ══ los 4 puntos con ✓ ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Qué vas a comprender</SeparadorSeccion>
          <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.7} w="100%">
            <CajaDisciplina d={d}>
              <Flex direction="column" gap={{ base: 5, md: 7 }}>
                <Text
                  color={d.txt}
                  fontSize={{ base: "lg", md: "2xl" }}
                  fontWeight="700"
                  lineHeight="1.3"
                  letterSpacing="0.03em"
                  textAlign="center"
                  textShadow={sombra}
                >
                  {d.videoIntro.titulo}
                </Text>

                <Box h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${d.txt}66, transparent)`} />

                <Flex direction="column" gap={{ base: 3.5, md: 4 }}>
                  {d.videoIntro.puntos.map((punto, i) => (
                    <Flex key={i} align="flex-start" gap={{ base: 3, md: 4 }}>
                      {/* Tick en el color de la disciplina */}
                      <Box
                        as="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        w={{ base: "18px", md: "21px" }}
                        h={{ base: "18px", md: "21px" }}
                        fill={d.txt}
                        flexShrink={0}
                        mt={{ base: "3px", md: "4px" }}
                        style={{ filter: `drop-shadow(0 0 6px ${d.txt}66)` }}
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </Box>
                      <Text
                        color={d.txt}
                        fontSize={{ base: "15px", md: "lg" }}
                        lineHeight={{ base: "1.65", md: "1.75" }}
                        textShadow={sombra}
                      >
                        {punto}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </CajaDisciplina>
          </Reveal>
        </Flex>

        {/* ══ ILUSTRACIONES ══ el momento en que se sumerge ══
            Las mismas tarjetas y el mismo visor inmersivo de /ilustraciones. */}
        {ilustraciones.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Míralo con tus ojos</SeparadorSeccion>
            <Reveal inView direction="up" distance={16} duration={0.7}>
              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={{ base: "md", md: "lg" }}
                fontStyle="italic"
                textAlign="center"
                lineHeight="1.6"
                maxW="640px"
                textShadow={BLANCO_GLOW_SUAVE}
              >
                {ilustraciones.length === 1
                  ? "Una de las ilustraciones del recorrido. Pulsa para leerla entera."
                  : `${ilustraciones.length} de las ilustraciones del recorrido. Pulsa cualquiera para leerla entera.`}
              </Text>
            </Reveal>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 6, md: 6 }}
            >
              {ilustraciones.map((entry, i) => (
                <IlustracionCard key={entry.id} entry={entry} i={i} onOpen={() => setAbierta(entry)} />
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ QUÉ INCLUYE ══ las cajas de contenido de /elMetodo ══ */}
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Qué incluye</SeparadorSeccion>
          <Grid
            w="100%"
            templateColumns={{ base: "1fr", lg: `repeat(${Math.min(d.contenido.length, 3)}, 1fr)` }}
            gap={{ base: 6, md: 6 }}
          >
            {d.contenido.map((seccion, i) => (
              <Reveal
                key={i}
                inView
                direction="up"
                distance={20}
                scaleFrom={0.97}
                duration={0.65}
                delay={i * 0.1}
                h="100%"
              >
                <CajaDisciplina d={d} compacta radio="2xl" h="100%">
                  <Flex direction="column" gap={{ base: 3, md: 4 }} h="100%">
                    <Text
                      color={d.txt}
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="700"
                      letterSpacing="0.03em"
                      lineHeight="1.25"
                      textAlign="center"
                      textShadow={sombra}
                    >
                      {seccion.titulo}
                    </Text>
                    <Box h="1px" w="60px" alignSelf="center" bg={`${d.txt}77`} />
                    {seccion.items.map((item, j) => (
                      <Text
                        key={j}
                        color={d.txt}
                        fontSize={{ base: "15px", md: "md" }}
                        lineHeight={{ base: "1.65", md: "1.75" }}
                        textAlign="center"
                        textShadow={sombra}
                      >
                        {item}
                      </Text>
                    ))}
                    {seccion.aviso && (
                      <Flex align="center" justify="center" gap={2} mt="auto" pt={2}>
                        <Box
                          as="svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          w="13px"
                          h="13px"
                          fill={d.txt}
                          flexShrink={0}
                        >
                          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                        </Box>
                        <Text
                          color={d.txt}
                          fontSize={{ base: "xs", md: "sm" }}
                          fontStyle="italic"
                          letterSpacing="0.05em"
                          textShadow={sombra}
                        >
                          {seccion.aviso}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </CajaDisciplina>
              </Reveal>
            ))}
          </Grid>
        </Flex>

        {/* ══ CIERRE ══ crear la cuenta ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        {/* Mandala de cierre: recuerda que esto es parte de algo mayor */}
        <Reveal inView direction="none" scaleFrom={0.7} duration={1}>
          <Float amplitude={6} duration={7}>
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "52px", md: "68px" }}
              objectFit="contain"
              style={{
                filter:
                  "drop-shadow(0 0 12px rgba(255,255,255,0.62)) drop-shadow(0 0 26px rgba(255,255,255,0.34)) drop-shadow(0 0 54px rgba(180,255,245,0.26))",
              }}
            />
          </Float>
        </Reveal>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

      {/* Visor inmersivo de ilustraciones, con el estilo de la disciplina */}
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
