import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import {
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import {
  AyurvedaIcon, ayurvedaBg, ayurvedaNom,
  KaphaIcon, kaphaColor,
  PittaIcon, pittaColor,
  VataIcon, vataColor,
} from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { TextoRico, useIdioma, useT } from "../../i18n";
import { useRecorridoContenido } from "../../data/useRecorridoContenido";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";

// ─────────────────────────────────────────────────────────────────────────────
// /d/ayurveda — presentación de Ayurveda (destino del QR de su cartel).
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LOS TRES DOṢHAS: la pieza central. Cada uno con su color, sus elementos y
//      su descripción, sobre el fondo común de la disciplina. Se colocan en escena al asomar y reaccionan al
//      ratón: es lo que tiene que hacer pensar «esto está cuidado».
//   4. Las ilustraciones de la disciplina.
//   5. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Los tres doṣhas. Colores, iconos y textos son los que ya usa la web en la
 *  sección de recursos de Ayurveda: aquí no se inventa nada, se presenta. */
const DOSHAS: {
  key: string;
  nombre: string;
  color: string;
  elementos: string;
  descripcion: string;
  Icon: (p: { size?: string; color?: string }) => React.ReactElement;
}[] = [
  {
    key: "vata",
    nombre: "Vata",
    color: vataColor,
    elementos: "Aire · Éter",
    descripcion:
      "La energía del movimiento: ligera, rápida, creativa e intuitiva. Entusiasta e imaginativa, tiende a la dispersión y la irregularidad. Se equilibra con rutina, calor y alimentos que anclen.",
    Icon: VataIcon,
  },
  {
    key: "pitta",
    nombre: "Pitta",
    color: pittaColor,
    elementos: "Fuego · Agua",
    descripcion:
      "La energía de la transformación: intensa, decidida y precisa. Con gran capacidad de ejecución, puede caer en la irritabilidad y el exceso de calor. Se equilibra con frescor, moderación y calma.",
    Icon: PittaIcon,
  },
  {
    key: "kapha",
    nombre: "Kapha",
    color: kaphaColor,
    elementos: "Tierra · Agua",
    descripcion:
      "La energía de la estructura: estable, resistente y profundamente afectuosa. Constante y paciente, tiende al apego y a la resistencia al cambio. Se equilibra con movimiento, estímulo y ligereza.",
    Icon: KaphaIcon,
  },
];

/** Tarjeta de un doṣha: el fondo de la disciplina, su color en el borde, el
 *  halo, la letra y el icono, que flota dentro de un círculo. */
function DoshaCard({
  dosha,
  sombra,
}: {
  dosha: (typeof DOSHAS)[number];
  sombra: string;
}) {
  const c = dosha.color;
  return (
    <RevealItem
      direction="up"
      distance={26}
      scaleFrom={0.94}
      blur
      duration={0.8}
      position="relative"
      overflow="hidden"
      borderRadius="3xl"
      h="100%"
      border={`1.5px solid ${c}88`}
      sx={{
        boxShadow: `0 0 0 1px ${c}33, 0 0 28px ${c}3d, 0 0 70px ${c}1f`,
        transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
        _hover: {
          transform: "translateY(-6px)",
          borderColor: c,
          boxShadow: `0 0 0 1px ${c}66, 0 0 40px ${c}88, 0 0 92px ${c}44`,
        },
      }}
    >
      {/* Los tres llevan el MISMO fondo, el de la disciplina: la acuarela propia
          de cada doṣha era del mismo color que su letra y el texto se perdía
          dentro. Lo que distingue a cada uno es el color, no el fondo. */}
      <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="3xl" />

      <Flex
        direction="column"
        align="center"
        textAlign="center"
        gap={{ base: 3, md: 4 }}
        position="relative"
        zIndex={1}
        px={{ base: 6, md: 7 }}
        py={{ base: 8, md: 10 }}
        h="100%"
      >
        {/* Icono: flota despacio, cada doṣha con su propio ritmo */}
        <Float amplitude={6} duration={dosha.key === "pitta" ? 5.5 : dosha.key === "kapha" ? 6.5 : 5}>
          <Flex
            align="center"
            justify="center"
            w={{ base: "76px", md: "88px" }}
            h={{ base: "76px", md: "88px" }}
            borderRadius="full"
            bg="rgba(255,255,255,0.55)"
            border={`2.5px solid ${c}`}
            boxShadow={`0 0 22px ${c}66, inset 0 0 20px rgba(255,255,255,0.6)`}
          >
            <dosha.Icon size="46px" color={c} />
          </Flex>
        </Float>

        <Text
          color={c}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textShadow="0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.75)"
        >
          {dosha.nombre}
        </Text>

        <Text
          color={c}
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="600"
          letterSpacing="0.26em"
          textTransform="uppercase"
          opacity={0.95}
          textShadow="0 1px 2px rgba(255,255,255,0.9)"
        >
          {dosha.elementos}
        </Text>

        <Box w="54px" h="2px" bgGradient={`linear(to-r, transparent, ${c}, transparent)`} opacity={0.8} />

        <Text
          color={c}
          fontSize={{ base: "sm", md: "md" }}
          lineHeight={{ base: "1.7", md: "1.75" }}
          textShadow={sombra}
        >
          {dosha.descripcion}
        </Text>
      </Flex>
    </RevealItem>
  );
}

export default function PresentacionAyurveda({ d }: { d: PresentacionDisciplina }) {
  const { segunIdioma } = useIdioma();
  const t = useT();
  // El nombre visible; `d.titulo` solo vale para casar la URL.
  const disciplina = useNombreDisciplinaEnMapa()(d.nom);
  // El contenido de la disciplina, ya en el idioma activo.
  const cont = useRecorridoContenido()[d.clave];
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  // La página espera al mandala, al fondo de la disciplina y a las portadas de
  // los cómics: entra de una pieza.
  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/hinduismo.webp",
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <AyurvedaIcon size={{ base: size, md: size }} />;

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
            icon={<AyurvedaIcon size={{ base: "38px", md: "52px" }} />}
            title={disciplina}
            bgColor={ayurvedaBg}
            color={d.txt}
            nom={ayurvedaNom}
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
              nom={ayurvedaNom}
              bg={ayurvedaBg}
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
            <VideoMuestra d={d} videoRef={videoRef} />
          </Reveal>
        </Grid>

        {/* ══ 3. LOS TRES DOṢHAS ══ la pieza central de la página ══ */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">{t("presentacion.ayurveda.tresDoshas")}</SeparadorSeccion>

          <Reveal inView direction="up" distance={16} duration={0.7}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="720px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              <TextoRico>{t("presentacion.ayurveda.prakriti")}</TextoRico>
            </Text>
          </Reveal>

          {/* Los tres, uno al lado del otro. Se colocan en escena en cascada
              cuando la fila asoma en pantalla, y se levantan al pasar el ratón. */}
          <RevealStagger
            inView
            stagger={0.14}
            delayChildren={0.1}
            amount={0.15}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 6, md: 7 }}
            alignItems="stretch"
          >
            {DOSHAS.map((dosha) => (
              <DoshaCard key={dosha.key} dosha={dosha} sombra={sombra} />
            ))}
          </RevealStagger>

          <Reveal inView direction="up" distance={14} duration={0.65}>
            <Text
              color="rgba(255,255,255,0.85)"
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.6"
              maxW="640px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              {t("presentacion.ayurveda.cualPredomina")}
            </Text>
          </Reveal>
        </Flex>

        {/* ══ 4. ILUSTRACIONES ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>{t("presentacion.sec.ilustraciones", { disciplina })}</SeparadorSeccion>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", md: `repeat(${Math.min(comics.length, 3)}, 1fr)` }}
              gap={{ base: 6, md: 7 }}
            >
              {comics.map((entry, i) => (
                <IlustracionCard
                  key={entry.id}
                  entry={entry}
                  i={i}
                  columnas={3}
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
