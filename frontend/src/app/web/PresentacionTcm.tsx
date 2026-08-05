import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
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
import {
  CajaDisciplina,
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
//   3. Los Cinco Elementos: los tres boxes de «qué te llevas» (los de /elMetodo)
//      y, al lado, el box con la estrella de los cinco elementos.
//   4. Los dos ciclos (generador y de control), cada uno en su caja y uno al
//      lado del otro — FUERA de cualquier box grande. La caja entera se pulsa y
//      abre el cómic del ciclo, con el cuerpo del texto difuminado (los títulos
//      se leen): el escaparate enseña que hay lectura, no la regala.
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

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/tcm.webp",
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    FONDO_CICLO.sheng,
    FONDO_CICLO.ke,
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

        {/* ══ 3. LOS CINCO ELEMENTOS ══
            A la izquierda, los tres boxes de «qué te llevas» (los mismos que en
            /elMetodo, salen de recorridoContenido). A su lado, la estrella de
            los cinco elementos. Los ciclos ya NO viven aquí dentro: van en su
            propia sección, uno al lado del otro. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Los Cinco Elementos</SeparadorSeccion>

          <Grid
            w="100%"
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 6, md: 6 }}
            alignItems="stretch"
          >
            {/* Los tres boxes, uno debajo de otro */}
            <Flex direction="column" gap={{ base: 6, md: 6 }}>
              {d.contenido.map((seccion, i) => (
                <Reveal
                  key={i}
                  inView
                  direction="right"
                  distance={22}
                  scaleFrom={0.97}
                  duration={0.65}
                  delay={i * 0.1}
                  flex="1"
                  display="flex"
                >
                  <CajaDisciplina d={d} compacta radio="2xl" h="100%">
                    <Flex direction="column" gap={{ base: 3, md: 4 }} h="100%" justify="center">
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
                    </Flex>
                  </CajaDisciplina>
                </Reveal>
              ))}
            </Flex>

            {/* La estrella de los cinco elementos, al lado */}
            <Reveal inView direction="left" distance={24} scaleFrom={0.98} duration={0.75} delay={0.1} display="flex">
              <CajaDisciplina d={d} destacada radio="3xl" h="100%">
                <Flex direction="column" align="center" justify="center" gap={{ base: 6, md: 8 }} h="100%">
                  <Text
                    color={d.txt}
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight={{ base: "1.75", md: "1.8" }}
                    textAlign="center"
                    maxW="520px"
                    textShadow={sombra}
                  >
                    Madera, Fuego, Tierra, Metal y Agua. Cinco energías que te habitan y que se
                    sostienen y se frenan entre ellas. Ningún síntoma aparece aislado: aparece en
                    un sistema.
                  </Text>

                  {/* La estrella de los elementos: florecen uno a uno */}
                  <EstrellaElementos />
                </Flex>
              </CajaDisciplina>
            </Reveal>
          </Grid>
        </Flex>

        {/* ══ 4. LOS DOS CICLOS ══
            Fuera del box grande y juntos, uno al lado del otro: cada estrella
            trae su propia caja (foto del ciclo + halo) y su coreografía —
            primero florecen los elementos y después brotan las flechas en el
            orden del ciclo. Las flechas se pulsan: abren la relación entera. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 5, md: 7 }}>
          <SeparadorSeccion maxW="1180px">Cómo se relacionan</SeparadorSeccion>

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

          <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, md: 6 }} w="100%" align="stretch">
            <Reveal inView direction="right" distance={30} scaleFrom={0.97} duration={0.65} amount={0.2} w="100%" display="flex">
              <EstrellaCiclo
                titulo="Ciclo generador"
                pinyin="Sheng"
                hanzi="生"
                subtitulo="Cada elemento alimenta al siguiente"
                ciclo="sheng"
                onEdge={abrirRelacion}
                cajaPulsable
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
                cajaPulsable
              />
            </Reveal>
          </Flex>
        </Flex>

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

      {/* Relación de un ciclo (al pulsar una flecha): el visor inmersivo con
          todas las relaciones de ese ciclo, empezando por la pulsada. */}
      {/* El cómic de los ciclos, con el cuerpo del texto difuminado: se leen los
          títulos (qué genera o controla qué) pero la lectura entera se queda
          dentro del recorrido. */}
      <RelacionModal rel={relacion} onClose={() => setRelacion(null)} textoBorroso />

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
