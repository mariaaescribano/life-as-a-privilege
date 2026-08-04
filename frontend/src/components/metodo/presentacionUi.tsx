import React, { useEffect, useState } from "react";
import { Box, Flex, Text, type BoxProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import { Reveal } from "../global/Reveal";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// Piezas comunes a las páginas de presentación (/d/:disciplina).
//
// Cada disciplina puede tener su propio montaje de página (Astrología ya lo
// tiene), pero todas comparten estos ladrillos para que se reconozcan como la
// misma web: la caja con el estilo de la disciplina, los separadores en blanco
// sobre el turquesa, la caja de precio y el cierre de crear cuenta.
// ─────────────────────────────────────────────────────────────────────────────

export const BLANCO_GLOW =
  "0 0 14px rgba(255,255,255,0.6), 0 0 32px rgba(255,255,255,0.34), 0 0 60px rgba(180,255,245,0.26)";
export const BLANCO_GLOW_SUAVE =
  "0 0 10px rgba(255,255,255,0.41), 0 0 21px rgba(255,255,255,0.22)";

/** Caja con el estilo de la disciplina: su foto de fondo, su borde y su halo.
 *  Todo el texto de dentro va en el color `txt` de la disciplina. */
export function CajaDisciplina({
  d,
  children,
  destacada = false,
  compacta = false,
  radio = "3xl",
  ...rest
}: {
  d: PresentacionDisciplina;
  /** Halo más presente: la caja final (crear cuenta), la de precio. */
  destacada?: boolean;
  /** Menos aire por dentro: cajas que van en rejilla. */
  compacta?: boolean;
  /** Radio del borde. La capa de fondo tiene que recortarse con el MISMO, si no
   *  asoma la foto por las esquinas. */
  radio?: string;
  children?: React.ReactNode;
} & BoxProps) {
  const hasBg = hasDisciplinaBg(d.nom);
  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius={radio}
      w="100%"
      bg={hasBg ? "transparent" : d.bg + "f0"}
      border={`1.5px solid ${d.txt}${destacada ? "99" : "66"}`}
      boxShadow={
        destacada
          ? `0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`
          : `0 0 0 1px ${d.txt}44, 0 0 30px ${d.txt}3d, 0 0 64px ${d.txt}1f`
      }
      {...rest}
    >
      {hasBg && <DisciplinaBgLayer nom={d.nom} borderRadius={radio} />}
      <Box
        position="relative"
        zIndex={1}
        h="100%"
        px={compacta ? { base: 5, md: 7 } : { base: 6, md: 12 }}
        py={compacta ? { base: 6, md: 8 } : { base: 8, md: 12 }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** Título de sección sobre el turquesa: rayitas a los lados, en blanco. */
export function SeparadorSeccion({
  children,
  maxW = "900px",
}: {
  children: React.ReactNode;
  maxW?: string;
}) {
  return (
    <Reveal inView direction="none" scaleFrom={0.94} duration={0.7} w="100%" maxW={maxW}>
      <Flex align="center" gap={{ base: 3, md: 5 }}>
        <Box flex="1" h="1px" bgGradient="linear(to-r, transparent, #ffffff8c)" />
        <Text
          color="white"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.3em"
          textTransform="uppercase"
          fontWeight="600"
          textAlign="center"
          textShadow={BLANCO_GLOW_SUAVE}
        >
          {children}
        </Text>
        <Box flex="1" h="1px" bgGradient="linear(to-l, transparent, #ffffff8c)" />
      </Flex>
    </Reveal>
  );
}

/** Botón principal con el color de la disciplina. */
export function BotonDisciplina({
  d,
  children,
  onClick,
  ...rest
}: {
  d: PresentacionDisciplina;
  children?: React.ReactNode;
  onClick?: () => void;
} & BoxProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      px={{ base: 8, md: 12 }}
      py={{ base: 3.5, md: 4 }}
      borderRadius="full"
      bg={`${d.txt}1f`}
      border={`2px solid ${d.txt}`}
      color={d.txt}
      fontSize={{ base: "md", md: "xl" }}
      fontWeight="700"
      letterSpacing="0.14em"
      textTransform="uppercase"
      cursor="pointer"
      textShadow={sombraTexto(d.nom, d.bg)}
      boxShadow={`0 0 20px ${d.txt}55, 0 0 44px ${d.txt}2e`}
      transition="all 0.25s ease"
      _hover={{
        bg: `${d.txt}33`,
        transform: "translateY(-2px)",
        boxShadow: `0 0 28px ${d.txt}88, 0 0 60px ${d.txt}44`,
      }}
      _active={{ transform: "translateY(0)" }}
      {...rest}
    >
      {children}
    </Box>
  );
}

/**
 * VÍDEO DE MUESTRA, en caja cuadrada.
 *
 * La caja es 1:1 porque es la proporción en la que se graban los vídeos nuevos.
 * Los antiguos (astro, psico, hinduismo) son verticales 1080×1920, así que se
 * mide el vídeo al cargar: cuadrado → `cover` (encaje exacto); vertical →
 * `contain`, para verlo entero en lugar de perderle el 44% del alto.
 */
export function VideoMuestra({
  d,
  videoRef,
}: {
  d: PresentacionDisciplina;
  /** Para que el botón «Ver por dentro» del box de al lado lo ponga en marcha. */
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) {
  const [cuadrado, setCuadrado] = useState<boolean | null>(null);
  useEffect(() => { setCuadrado(null); }, [d.video]);

  return (
    <Box
      position="relative"
      w="100%"
      h="100%"
      borderRadius="3xl"
      overflow="hidden"
      bg="#000"
      border={`1.5px solid ${d.txt}66`}
      boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
      sx={{ aspectRatio: "1 / 1" }}
    >
      <Box
        as="video"
        ref={videoRef as any}
        key={d.video}
        src={d.video}
        // Sin autoPlay: en una página pública un vídeo que arranca solo molesta
        // (y en móvil se come los datos). Lo pone en marcha quien quiera verlo.
        controls
        muted
        playsInline
        preload="metadata"
        w="100%"
        h="100%"
        onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          const v = e.currentTarget;
          if (!v.videoWidth || !v.videoHeight) return;
          // Margen del 2% para no descartar un 1080×1081 por un píxel.
          setCuadrado(Math.abs(v.videoWidth / v.videoHeight - 1) < 0.02);
        }}
        sx={{ objectFit: cuadrado ? "cover" : "contain" }}
      />
    </Box>
  );
}

/**
 * CIERRE. Dos ideas y en este orden: puedes hacer SOLO esta disciplina (no hay
 * camino obligatorio), y esta disciplina es una de las ocho miradas de un camino
 * para entender al ser humano. Termina en el botón de crear la cuenta.
 */
export function CierreCrearCuenta({ d }: { d: PresentacionDisciplina }) {
  const navigate = useNavigate();
  const sombra = sombraTexto(d.nom, d.bg);
  return (
    <Reveal inView direction="up" distance={24} scaleFrom={0.97} duration={0.75} w="100%">
      <CajaDisciplina d={d} destacada>
        <Flex direction="column" align="center" gap={{ base: 5, md: 7 }} textAlign="center">
          <Text
            color={d.txt}
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="700"
            lineHeight="1.15"
            letterSpacing="0.04em"
            textShadow={sombra}
          >
            Empieza por {d.titulo}
          </Text>

          <Box h="1px" w="100px" bgGradient={`linear(to-r, transparent, ${d.txt}, transparent)`} />

          <Text
            color={d.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight={{ base: "1.75", md: "1.85" }}
            maxW="660px"
            textShadow={sombra}
          >
            Puedes recorrer <b>solo {d.titulo}</b>. Es un recorrido completo en sí mismo,
            con sus ilustraciones, sus ejercicios y su acompañamiento, y no hay ningún
            orden obligatorio: se empieza por donde tenga sentido para ti.
          </Text>

          <Text
            color={d.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight={{ base: "1.75", md: "1.85" }}
            maxW="660px"
            textShadow={sombra}
          >
            Pero {d.titulo} es una de las <b>ocho miradas</b> de El Mapa. Cada una explica
            una parte del ser humano —tu carácter, tu historia, tu cuerpo, tu alimentación,
            tu alma, tus ideas— y el propósito de recorrerlas es uno solo:
            <b> entenderte del todo</b>. Ninguna disciplina sola contesta la pregunta;
            juntas son un camino.
          </Text>

          <BotonDisciplina d={d} onClick={() => navigate("/signIn")} mt={{ base: 1, md: 2 }}>
            Crear mi cuenta
          </BotonDisciplina>

          <Flex
            as="button"
            onClick={() => navigate("/elMetodo")}
            align="center"
            gap={2}
            color={d.txt}
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.1em"
            textTransform="uppercase"
            opacity={0.9}
            cursor="pointer"
            textShadow={sombra}
            transition="opacity 0.2s ease"
            _hover={{ opacity: 1, textDecoration: "underline" }}
          >
            <Text as="span">Ver las ocho disciplinas</Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        </Flex>
      </CajaDisciplina>
    </Reveal>
  );
}

/**
 * TARJETA MINI de una serie de ilustraciones: portada cuadrada y el título
 * dentro, abajo, sobre un velo. Pensada para poner tres en la MISMA fila sin que
 * dejen de leerse (la tarjeta grande de la galería no cabría).
 */
export function ComicMiniCard({
  titulo,
  cover,
  color,
  onOpen,
}: {
  titulo: string;
  cover: string;
  /** Acento: borde, halo y color del título. */
  color: string;
  onOpen: () => void;
}) {
  const [falla, setFalla] = useState(false);
  return (
    <Box
      as="button"
      onClick={onOpen}
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${color}55`}
      bg="rgba(0,0,0,0.35)"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      sx={{
        aspectRatio: "1 / 1",
        transition: "all 0.25s ease",
        boxShadow: `0 0 16px ${color}2e, 0 0 40px ${color}1a`,
        _hover: {
          transform: "translateY(-4px)",
          borderColor: color,
          boxShadow: `0 0 26px ${color}99, 0 0 64px ${color}4d`,
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {!falla ? (
        <Box
          as="img"
          src={encodeURI(cover)}
          alt={titulo}
          loading="lazy"
          position="absolute"
          inset="0"
          w="100%"
          h="100%"
          style={{ objectFit: "cover", objectPosition: "top" }}
          onError={() => setFalla(true)}
        />
      ) : (
        <Flex position="absolute" inset="0" align="center" justify="center">
          <Text fontSize="3xl" opacity={0.6}>✨</Text>
        </Flex>
      )}

      {/* Velo inferior + título dentro de la propia foto: así la tarjeta se
          queda pequeña y elegante, sin el pie de la tarjeta de la galería. */}
      <Flex
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        direction="column"
        align="center"
        gap={1}
        px={{ base: 2, md: 3 }}
        pt={{ base: 6, md: 8 }}
        pb={{ base: 2.5, md: 3.5 }}
        bgGradient="linear(to-t, #000000e6, #00000099, transparent)"
      >
        {/* Sin textShadow: el título va sobre el velo oscuro y el brillo solo lo
            ensuciaba. */}
        <Text
          color={color}
          fontSize={{ base: "2xs", sm: "xs", md: "md" }}
          fontWeight="700"
          letterSpacing="0.03em"
          lineHeight="1.2"
          textAlign="center"
        >
          {titulo}
        </Text>
        <Flex align="center" gap={1} color={color} fontSize="2xs" letterSpacing="0.16em" textTransform="uppercase" opacity={0.9}>
          <Text as="span">Ver</Text>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="11px" h="11px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
