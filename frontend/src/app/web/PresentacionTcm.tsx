import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  EstrellaCiclo,
  RelacionModal,
  FONDO_CICLO,
  type Relacion,
} from "../../components/metodo/tcmCiclosVisual";
import {
  CICLO_KE,
  CICLO_SHENG,
  ELEMENTOS,
  ORDEN_ELEMENTOS,
  type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { LENGUA_DIMENSIONES } from "../../components/metodo/tcmLenguaContenido";
import {
  BLANCO_GLOW,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { TCMIcon, tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/medicinachina — presentación de Medicina China.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. UN SOLO BOX con TODO el sistema: la estrella de los cinco elementos y,
//      debajo, las dos estrellas de los ciclos (generador y de control) con sus
//      flechas. Las flechas se pueden pulsar: abren la relación entera.
//   4. Aprende a leer tu lengua: las lenguas de verdad, con su lectura.
//   5. Las ilustraciones de la disciplina.
//   6. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

const MotionG = motion.g as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;

// Geometría de la estrella de los elementos (la misma que la del recorrido).
const CX = 160, CY = 170, R = 120, FOTO_R = 32;
const vertice = (i: number, radio: number) => {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
};

/**
 * Estrella de los cinco elementos, versión ESCAPARATE: sin candados, sin ✓ y sin
 * clic — aquí no hay progreso que mostrar, solo el sistema. Los cinco elementos
 * «florecen» uno a uno cuando la estrella asoma en pantalla, igual que en el
 * recorrido.
 */
function EstrellaElementos() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const enPantalla = useInView(ref, { once: true, amount: 0.3 });
  const entra = reduce || enPantalla;

  return (
    <Flex ref={ref} justify="center" w="100%">
      <Box as="svg" viewBox="0 0 320 312" w={{ base: "300px", md: "400px" }} h="auto" overflow="visible">
        <defs>
          {ORDEN_ELEMENTOS.map((el, i) => {
            const v = vertice(i, R);
            return (
              <clipPath id={`pres-elem-clip-${el}`} key={el}>
                <circle cx={v.x} cy={v.y} r={FOTO_R} />
              </clipPath>
            );
          })}
        </defs>

        {/* Pentágono de referencia */}
        <polygon
          points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R); return `${v.x},${v.y}`; }).join(" ")}
          fill="none"
          stroke={`${tcmTxt}44`}
          strokeWidth={1}
        />

        {ORDEN_ELEMENTOS.map((el: Elemento, i) => {
          const v = vertice(i, R);
          const label = vertice(i, R + 46);
          const color = ELEMENTOS[el].color;
          return (
            <MotionG
              key={el}
              style={{ transformBox: "view-box", transformOrigin: `${v.x}px ${v.y}px` }}
              initial={reduce ? false : { opacity: 0, scale: 0.3 }}
              animate={reduce ? {} : (entra ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 })}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.6, ease: EASE_POP }}
            >
              <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
              <image
                href={ICONO_ELEMENTO[el]}
                x={v.x - FOTO_R}
                y={v.y - FOTO_R}
                width={FOTO_R * 2}
                height={FOTO_R * 2}
                clipPath={`url(#pres-elem-clip-${el})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle
                cx={v.x}
                cy={v.y}
                r={FOTO_R}
                fill="none"
                stroke={color}
                strokeWidth={2}
                style={{ filter: `drop-shadow(0 0 5px ${color})` }}
              />
              <text
                x={label.x}
                y={label.y}
                fill="white"
                fontSize={14}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ textShadow: "0 1px 4px rgba(58,10,10,0.95)" }}
              >
                {ELEMENTOS[el].nombre}
              </text>
            </MotionG>
          );
        })}
      </Box>
    </Flex>
  );
}

export default function PresentacionTcm({ d }: { d: PresentacionDisciplina }) {
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  const [relacion, setRelacion] = useState<Relacion | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  // La capa de la lengua que se enseña: el COLOR del cuerpo, que es la más
  // importante de las seis. Se muestran sus variantes reales, con su lectura.
  const dimColor = useMemo(() => LENGUA_DIMENSIONES.find((x) => x.dim === "color"), []);
  const [lenguaSel, setLenguaSel] = useState(0);
  const lengua = dimColor?.opciones[lenguaSel];

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/tcm.webp",
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    FONDO_CICLO.sheng,
    FONDO_CICLO.ke,
    ...(dimColor?.opciones ?? []).map((o) => o.src),
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <TCMIcon size={{ base: size, md: size }} />;

  // La relación necesita su destino: lo da el mapa del ciclo.
  const abrirRelacion = (ciclo: "sheng" | "ke", origen: Elemento) =>
    setRelacion({ ciclo, origen, destino: (ciclo === "sheng" ? CICLO_SHENG : CICLO_KE)[origen] });

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
            icon={<TCMIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={tcmBg}
            color={d.txt}
            nom={tcmNom}
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
              nom={tcmNom}
              bg={tcmBg}
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

        {/* ══ 3. EL SISTEMA COMPLETO, EN UN SOLO BOX ══
            Arriba los cinco elementos; debajo, los dos ciclos que los relacionan.
            Todo dentro de la misma caja, porque es UNA sola idea: nada funciona
            por separado. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Los Cinco Elementos y sus ciclos</SeparadorSeccion>

          <Reveal inView direction="up" distance={24} scaleFrom={0.98} duration={0.75} w="100%">
            <Box
              position="relative"
              w="100%"
              borderRadius="3xl"
              overflow="hidden"
              border={`1.5px solid ${d.txt}66`}
              boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
            >
              <DisciplinaBgLayer nom={tcmNom} borderRadius="3xl" />

              <Flex
                direction="column"
                align="center"
                gap={{ base: 7, md: 9 }}
                position="relative"
                zIndex={1}
                px={{ base: 4, md: 8 }}
                py={{ base: 8, md: 11 }}
              >
                <Text
                  color={d.txt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight={{ base: "1.75", md: "1.8" }}
                  textAlign="center"
                  maxW="760px"
                  textShadow={sombra}
                >
                  Madera, Fuego, Tierra, Metal y Agua. Cinco energías que te habitan y que se
                  sostienen y se frenan entre ellas. Ningún síntoma aparece aislado: aparece en
                  un sistema.
                </Text>

                {/* La estrella de los elementos: florecen uno a uno */}
                <EstrellaElementos />

                <Box
                  w="100%"
                  maxW="420px"
                  h="1px"
                  bgGradient="linear(to-r, transparent, rgba(255,255,255,0.85), transparent)"
                />

                <Flex direction="column" align="center" gap={2}>
                  <Text
                    color="white"
                    fontSize={{ base: "sm", md: "md" }}
                    letterSpacing="0.28em"
                    textTransform="uppercase"
                    fontWeight="600"
                    textAlign="center"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                  >
                    Cómo se relacionan
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.85)"
                    fontSize={{ base: "xs", md: "sm" }}
                    fontStyle="italic"
                    textAlign="center"
                    maxW="560px"
                    lineHeight="1.6"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                  >
                    Pulsa cualquier flecha y verás qué hace un elemento sobre el siguiente.
                  </Text>
                </Flex>

                {/* Las dos estrellas de los ciclos, con sus flechas animadas.
                    Cada una trae su propia coreografía: primero florecen los
                    elementos y después brotan las flechas en el orden del ciclo. */}
                <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, md: 5 }} w="100%" align="stretch">
                  <Reveal inView direction="right" distance={30} scaleFrom={0.97} duration={0.65} amount={0.2} w="100%" display="flex">
                    <EstrellaCiclo
                      titulo="Ciclo generador"
                      pinyin="Sheng"
                      hanzi="生"
                      subtitulo="Cada elemento alimenta al siguiente"
                      ciclo="sheng"
                      onEdge={abrirRelacion}
                    />
                  </Reveal>
                  <Reveal inView direction="left" distance={30} scaleFrom={0.97} duration={0.65} amount={0.2} w="100%" display="flex">
                    <EstrellaCiclo
                      titulo="Ciclo de control"
                      pinyin="Ke"
                      hanzi="克"
                      subtitulo="Cada elemento pone límite a otro"
                      ciclo="ke"
                      onEdge={abrirRelacion}
                    />
                  </Reveal>
                </Flex>
              </Flex>
            </Box>
          </Reveal>
        </Flex>

        {/* ══ 4. APRENDE A LEER TU LENGUA ══
            Las lenguas de verdad del material, con su lectura. Es lo que hace
            que se vea que aquí hay un sistema de diagnóstico, no metáforas. */}
        {dimColor && lengua && (
          <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Aprende a leer tu lengua</SeparadorSeccion>

            <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.75} w="100%">
              <Box
                position="relative"
                w="100%"
                borderRadius="3xl"
                overflow="hidden"
                border={`1.5px solid ${d.txt}66`}
                boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
              >
                <DisciplinaBgLayer nom={tcmNom} borderRadius="3xl" />

                <Flex
                  direction="column"
                  align="center"
                  gap={{ base: 6, md: 7 }}
                  position="relative"
                  zIndex={1}
                  px={{ base: 5, md: 10 }}
                  py={{ base: 8, md: 11 }}
                >
                  <Text
                    color={d.txt}
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight={{ base: "1.75", md: "1.8" }}
                    textAlign="center"
                    maxW="760px"
                    textShadow={sombra}
                  >
                    {dimColor.subtitulo} Tu cuerpo lo deja escrito ahí todos los días; solo hay
                    que saber mirarlo.
                  </Text>

                  {/* Las variantes reales: se pulsan y abajo sale su lectura */}
                  <Grid
                    w="100%"
                    templateColumns={{ base: "repeat(3, 1fr)", md: `repeat(${dimColor.opciones.length}, 1fr)` }}
                    gap={{ base: 3, md: 4 }}
                  >
                    {dimColor.opciones.map((o, i) => {
                      const sel = i === lenguaSel;
                      return (
                        <Flex
                          key={o.key}
                          as="button"
                          onClick={() => setLenguaSel(i)}
                          direction="column"
                          align="center"
                          gap={2}
                          cursor="pointer"
                          sx={{
                            WebkitTapHighlightColor: "transparent",
                            transition: "transform 0.25s ease",
                            _hover: { transform: "translateY(-3px)" },
                          }}
                        >
                          <Box
                            position="relative"
                            w="100%"
                            borderRadius="xl"
                            overflow="hidden"
                            border={`2px solid ${sel ? d.txt : `${d.txt}44`}`}
                            boxShadow={sel ? `0 0 20px ${d.txt}88, 0 0 44px ${d.txt}44` : "none"}
                            sx={{ aspectRatio: "1 / 1", transition: "all 0.25s ease" }}
                          >
                            <Box
                              as="img"
                              src={o.src}
                              alt={o.nombre}
                              loading="lazy"
                              position="absolute"
                              inset="0"
                              w="100%"
                              h="100%"
                              style={{ objectFit: "cover", opacity: sel ? 1 : 0.75 }}
                            />
                          </Box>
                          <Text
                            color={d.txt}
                            fontSize={{ base: "2xs", md: "sm" }}
                            fontWeight={sel ? "700" : "600"}
                            letterSpacing="0.03em"
                            lineHeight="1.2"
                            textAlign="center"
                            opacity={sel ? 1 : 0.8}
                            textShadow={sombra}
                          >
                            {o.nombre}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Grid>

                  {/* La lectura de la variante elegida */}
                  <Flex
                    direction="column"
                    align="center"
                    gap={2}
                    w="100%"
                    maxW="720px"
                    px={{ base: 5, md: 7 }}
                    py={{ base: 5, md: 6 }}
                    borderRadius="xl"
                    bg="rgba(255,255,255,0.08)"
                    border="1px solid rgba(255,255,255,0.16)"
                    sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
                  >
                    <Text
                      color={d.txt}
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="700"
                      letterSpacing="0.04em"
                      textAlign="center"
                      textShadow={sombra}
                    >
                      {lengua.nombre}
                    </Text>
                    <Text
                      color={d.txt}
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight={{ base: "1.7", md: "1.75" }}
                      textAlign="center"
                      textShadow={sombra}
                    >
                      {lengua.lectura}
                    </Text>
                  </Flex>

                  <Text
                    color="rgba(255,255,255,0.85)"
                    fontSize={{ base: "xs", md: "sm" }}
                    fontStyle="italic"
                    textAlign="center"
                    maxW="640px"
                    lineHeight="1.6"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                  >
                    Y esto es solo el color. Dentro se observan {LENGUA_DIMENSIONES.length} capas
                    —color, forma, movimiento, saburra, humedad y puntos— y una herramienta que
                    reúne lo que ves para darte tu lectura.
                  </Text>
                </Flex>
              </Box>
            </Reveal>
          </Flex>
        )}

        {/* ══ 5. ILUSTRACIONES ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Medicina China</SeparadorSeccion>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 6, md: 6 }}
            >
              {comics.map((entry, i) => (
                <IlustracionCard
                  key={entry.id}
                  entry={entry}
                  i={i}
                  onOpen={() => setAbierta(entry)}
                />
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

      {/* Relación de un ciclo (al pulsar una flecha): el visor inmersivo con
          todas las relaciones de ese ciclo, empezando por la pulsada. */}
      <RelacionModal rel={relacion} onClose={() => setRelacion(null)} />

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
