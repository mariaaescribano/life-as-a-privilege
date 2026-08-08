import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, SimpleGrid, Text, type BoxProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { sombraSoloContraste, sombraTexto } from "../global/disciplinaSombras";
import { Reveal } from "../global/Reveal";
import { BookCallModal } from "../global/BookCallModal";
import { ContactModal } from "../global/ContactModal";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import type { ContenidoSeccion } from "../../data/recorridoContenido";
import { TextoRico, useT, type ClaveTexto } from "../../i18n";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";

// ─────────────────────────────────────────────────────────────────────────────
// Piezas comunes a las páginas de presentación (/d/:disciplina).
//
// Cada disciplina puede tener su propio montaje de página (Astrología ya lo
// tiene), pero todas comparten estos ladrillos para que se reconozcan como la
// misma web: la caja con el estilo de la disciplina, los separadores en blanco
// sobre el turquesa, la caja de precio y el cierre de crear cuenta.
// ─────────────────────────────────────────────────────────────────────────────

/** Halo blanco fuerte. OJO: la frase que va bajo el header NO lo lleva (cae
 *  sobre el turquesa limpio y el brillo la ensucia), así que ahora mismo no lo
 *  usa ninguna presentación. Se queda por si algún titular lo necesita sobre
 *  una foto. */
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
  sinBorde = false,
  radio = "3xl",
  ...rest
}: {
  d: PresentacionDisciplina;
  /** Halo más presente: la caja final (crear cuenta), la de precio. */
  destacada?: boolean;
  /** Sin filo de color: se va el borde y también el aro de 1px del boxShadow
   *  (que es el que seguía dibujando la línea). Queda solo el halo suave. */
  sinBorde?: boolean;
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
      border={sinBorde ? undefined : `1.5px solid ${d.txt}${destacada ? "99" : "66"}`}
      boxShadow={
        sinBorde
          ? `0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`
          : destacada
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

/**
 * HALO DEL HEADER, tal cual (MetodoStepHeader con fondo de disciplina).
 *
 * Regla de las presentaciones: las cajas de contenido NO llevan filo de color ni
 * halo fuerte. Llevan este mismo halo y ningún borde, para que ninguna destaque
 * más que el header ni parezca un botón. Si hay que retocarlo, se retoca aquí.
 */
export const glowComoHeader = (txt: string): string =>
  `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${txt}1a, 0 0 48px ${txt}10`;

/** Caja lisa con el material de la disciplina: su foto de fondo, sin borde y con
 *  el halo del header. Es la base de las cajas de las presentaciones. */
export function CajaLisa({
  d,
  children,
  radio = "3xl",
  ...rest
}: {
  d: PresentacionDisciplina;
  radio?: string;
  children?: React.ReactNode;
} & BoxProps) {
  const hasBg = hasDisciplinaBg(d.nom);
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius={radio}
      overflow="hidden"
      bg={hasBg ? "transparent" : `${d.bg}f0`}
      boxShadow={glowComoHeader(d.txt)}
      {...rest}
    >
      {hasBg && <DisciplinaBgLayer nom={d.nom} borderRadius={radio} />}
      <Box position="relative" zIndex={1} h="100%">
        {children}
      </Box>
    </Box>
  );
}

/** Una idea de lo que hay dentro: su título y su texto. Con `nota` al pie para
 *  las advertencias («Opcional. Se cobra aparte»). */
export interface IdeaPresentacion {
  titulo: string;
  parrafos: string[];
  nota?: string;
}

/**
 * Convierte las cajas de «Qué incluye» de una disciplina (recorridoContenido,
 * el mismo sitio del que bebe /elMetodo) en ideas de presentación.
 *
 * Antes cada página se traía su propia copia del párrafo en un array `IDEAS`
 * local. Eran los MISMOS textos duplicados, y con dos idiomas eso serían cuatro
 * copias del mismo párrafo esperando a desincronizarse. Ahora hay una sola
 * fuente y esta función la adapta.
 */
export const ideasDesdeContenido = (secciones: ContenidoSeccion[]): IdeaPresentacion[] =>
  secciones.map((s) => ({ titulo: s.titulo, parrafos: s.items, nota: s.aviso }));

export function CajaIdea({ d, idea }: { d: PresentacionDisciplina; idea: IdeaPresentacion }) {
  const sombra = sombraTexto(d.nom, d.bg);
  return (
    <CajaLisa d={d} h="100%">
      <Flex direction="column" gap={{ base: 2.5, md: 3 }} px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }}>
        <Text
          color={d.txt}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          letterSpacing="0.03em"
          lineHeight="1.25"
          textShadow={sombra}
        >
          {idea.titulo}
        </Text>
        {idea.parrafos.map((p, i) => (
          <Text
            key={i}
            color={d.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight={{ base: "1.75", md: "1.8" }}
            textShadow={sombra}
          >
            {p}
          </Text>
        ))}
        {idea.nota && (
          <Text
            color={d.txt}
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            opacity={0.75}
            textShadow={sombra}
          >
            {idea.nota}
          </Text>
        )}
      </Flex>
    </CajaLisa>
  );
}

/**
 * MOSAICO DE MUESTRA: unas fotos de lo que hay dentro, con su título debajo.
 *
 * NO se abre nada a propósito: no es un menú, es una ventana. Está para que se
 * vea que dentro hay mucho más de lo que cabe en la página. Por eso ignora el
 * ratón por completo (`pointerEvents: none`): nada de cursores de mano ni de
 * hovers que prometan un clic que no existe.
 */
export function MosaicoMuestra({
  d,
  fotos,
  columnas = 2,
}: {
  d: PresentacionDisciplina;
  /** El pie de cada foto: texto ya resuelto, o su clave si viene de un array
   *  de nivel de módulo (que no puede traer texto ya traducido). */
  fotos: { foto: string; titulo?: string; tituloKey?: ClaveTexto }[];
  columnas?: number;
}) {
  const t = useT();
  const sombra = sombraTexto(d.nom, d.bg);
  return (
    <CajaLisa d={d} h="100%" sx={{ pointerEvents: "none" }}>
      <Flex direction="column" h="100%" justify="center" px={{ base: 5, md: 7 }} py={{ base: 6, md: 8 }}>
        <SimpleGrid columns={{ base: 2, md: columnas }} spacing={{ base: 4, md: 5 }}>
          {fotos.map((f) => (
            <Flex key={f.foto} direction="column" align="center" gap={2}>
              <Box
                w="100%"
                borderRadius="2xl"
                overflow="hidden"
                bg={`${d.bg}55`}
                sx={{ aspectRatio: "1 / 1" }}
                boxShadow={`0 0 14px ${d.txt}2b, 0 0 32px ${d.txt}17`}
              >
                <Box
                  as="img"
                  src={encodeURI(f.foto)}
                  alt={f.titulo ?? (f.tituloKey ? t(f.tituloKey) : "")}
                  loading="lazy"
                  w="100%"
                  h="100%"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
              <Text
                color={d.txt}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="700"
                lineHeight="1.25"
                textAlign="center"
                textShadow={sombra}
              >
                {f.titulo ?? (f.tituloKey ? t(f.tituloKey) : "")}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    </CajaLisa>
  );
}

/**
 * SECCIÓN «lo que hay dentro»: a la izquierda las ideas en su caja, y al lado
 * una muestra (el mosaico de fotos, el Árbol pequeño…) que se pasa como hijo.
 */
export function IdeasConMuestra({
  d,
  ideas,
  children,
}: {
  d: PresentacionDisciplina;
  ideas: IdeaPresentacion[];
  children?: React.ReactNode;
}) {
  return (
    <Grid
      w="100%"
      maxW="1180px"
      templateColumns={{ base: "1fr", lg: "1.05fr 0.95fr" }}
      gap={{ base: 6, md: 8 }}
      alignItems="stretch"
    >
      <Flex direction="column" gap={{ base: 6, md: 7 }}>
        {ideas.map((idea, i) => (
          <Reveal
            key={idea.titulo}
            inView
            direction="right"
            distance={22}
            scaleFrom={0.98}
            duration={0.7}
            delay={i * 0.08}
            w="100%"
            flex="1"
            display="flex"
          >
            <CajaIdea d={d} idea={idea} />
          </Reveal>
        ))}
      </Flex>
      {children && (
        <Reveal inView direction="left" distance={22} scaleFrom={0.98} duration={0.7} delay={0.1} h="100%" display="flex">
          {children}
        </Reveal>
      )}
    </Grid>
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
      textShadow={sombraSoloContraste(d.nom)}
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
      // Sin borde ni aro de la disciplina: el vídeo se presenta limpio, solo con
      // el halo suave alrededor. Una línea de color encima del vídeo lo enmarcaba
      // como si fuera una caja más, y no lo es.
      boxShadow={`0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
      sx={{ aspectRatio: "1 / 1" }}
    >
      <Box
        as="video"
        ref={videoRef as any}
        key={d.video}
        src={d.video}
        // Arranca solo y se repite en bucle: quien llega de un cartel ve el
        // recorrido en marcha sin tener que pulsar nada.
        autoPlay
        loop
        // `muted` es OBLIGATORIO para que arranque solo: los vídeos son mudos,
        // pero llevan pista de audio en silencio y sin esto Chrome y Safari
        // bloquean el autoplay (se quedarían parados en el primer fotograma).
        muted
        // En iOS, sin `playsInline` el vídeo se abriría a pantalla completa.
        playsInline
        preload="auto"
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
/** Botón SECUNDARIO del cierre: la llamada y las dudas. Mismo lenguaje que el
 *  principal —redondo, filo y letra de la disciplina— pero sin relleno ni halo
 *  y un punto más pequeño. Tiene que verse, no ganar: quien ya lo tiene claro
 *  va a «Crear mi cuenta», y quien no, tiene aquí las dos salidas. */
function BotonSecundario({
  d,
  children,
  onClick,
}: {
  d: PresentacionDisciplina;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      px={{ base: 6, md: 8 }}
      py={{ base: 2.5, md: 3 }}
      borderRadius="full"
      bg="transparent"
      border={`1.5px solid ${d.txt}88`}
      color={d.txt}
      fontSize={{ base: "sm", md: "md" }}
      fontWeight="600"
      letterSpacing="0.08em"
      whiteSpace="nowrap"
      cursor="pointer"
      textShadow={sombraSoloContraste(d.nom)}
      transition="all 0.25s ease"
      _hover={{
        bg: `${d.txt}1a`,
        borderColor: d.txt,
        transform: "translateY(-2px)",
      }}
      _active={{ transform: "translateY(0)" }}
    >
      {children}
    </Box>
  );
}

export function CierreCrearCuenta({ d }: { d: PresentacionDisciplina }) {
  const t = useT();
  const navigate = useNavigate();
  // El nombre que se ve: `d.titulo` no vale, ese solo sirve para casar la URL.
  const disciplina = useNombreDisciplinaEnMapa()(d.nom);
  // Los dos modales que ya usa /elMetodo: la llamada de 20 min sin coste
  // (BookCallModal) y el formulario de consulta (ContactModal). Se montan aquí
  // dentro para que las nueve presentaciones los tengan sin repetir nada.
  const [llamadaOpen, setLlamadaOpen] = useState(false);
  const [dudasOpen, setDudasOpen] = useState(false);
  // Sin luz detras de la letra: solo la sombra de contraste en las disciplinas
  // cuya foto de fondo la necesita (undefined en el resto).
  const sombra = sombraSoloContraste(d.nom);
  return (
    <>
    <Reveal inView direction="up" distance={24} scaleFrom={0.97} duration={0.75} w="100%">
      <CajaDisciplina d={d} destacada sinBorde>
        <Flex direction="column" align="center" gap={{ base: 5, md: 7 }} textAlign="center">
          <Text
            color={d.txt}
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="700"
            lineHeight="1.15"
            letterSpacing="0.04em"
            textShadow={sombra}
          >
            {t("presentacion.empiezaPor", { disciplina })}
          </Text>

          <Box h="1px" w="100px" bgGradient={`linear(to-r, transparent, ${d.txt}, transparent)`} />

          <Text
            color={d.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight={{ base: "1.75", md: "1.85" }}
            maxW="660px"
            textShadow={sombra}
          >
            <TextoRico>{t("presentacion.soloUna", { disciplina })}</TextoRico>
          </Text>

          <Text
            color={d.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight={{ base: "1.75", md: "1.85" }}
            maxW="660px"
            textShadow={sombra}
          >
            <TextoRico>{t("presentacion.ochoMiradas", { disciplina })}</TextoRico>
          </Text>

          <BotonDisciplina d={d} onClick={() => navigate("/signIn")} mt={{ base: 1, md: 2 }}>
            {t("presentacion.crearCuenta")}
          </BotonDisciplina>

          {/* Las dos salidas para quien todavía no lo tiene decidido. En móvil
              una debajo de otra (los rótulos son largos y no se parten). */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align="center"
            justify="center"
            gap={{ base: 3, md: 4 }}
            wrap="wrap"
          >
            <BotonSecundario d={d} onClick={() => setLlamadaOpen(true)}>
              {t("presentacion.llamada")}
            </BotonSecundario>
            <BotonSecundario d={d} onClick={() => setDudasOpen(true)}>
              {t("elMetodo.dudas")}
            </BotonSecundario>
          </Flex>

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
            <Text as="span">{t("presentacion.verOcho")}</Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        </Flex>
      </CajaDisciplina>
    </Reveal>

    {/* Misma configuración que en /elMetodo, para que la consulta llegue igual
        y con el mismo asunto de correo. */}
    <ContactModal
      isOpen={dudasOpen}
      onClose={() => setDudasOpen(false)}
      title={t("elMetodo.dudas")}
      bgColor="#008080"
      color="#ffffff"
      emailSubject={t("elMetodo.dudas.asunto")}
      showCheckboxes={false}
      showDescription={true}
      textareaPlaceholder={t("elMetodo.dudas.placeholder")}
    />

    <BookCallModal isOpen={llamadaOpen} onClose={() => setLlamadaOpen(false)} />
    </>
  );
}

/**
 * TARJETA DE CURSO para las presentaciones. La foto 16:9 del curso ya lleva su
 * título impreso, así que aquí no se repite: solo se enmarca con el color de la
 * disciplina y, al pie, un «Ver el curso ›» discreto sobre un velo.
 *
 * No usa la tarjeta del popup de cursos del recorrido a propósito: aquélla lleva
 * un círculo grande con la flecha dentro de la foto, que en una fila de cuatro
 * pesa demasiado y tapa la ilustración.
 */
export function CursoMiniCard({
  foto,
  titulo,
  d,
  onOpen,
}: {
  foto: string;
  /** Solo para el `alt` y para lectores de pantalla: no se pinta. */
  titulo: string;
  d: PresentacionDisciplina;
  onOpen: () => void;
}) {
  const t = useT();
  const [falla, setFalla] = useState(false);
  return (
    <Box
      as="button"
      onClick={onOpen}
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      bg={`${d.bg}cc`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      sx={{
        aspectRatio: "16 / 9",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: `0 0 16px ${d.txt}2e, 0 0 40px ${d.txt}1a`,
        _hover: {
          transform: "translateY(-5px)",
          boxShadow: `0 0 26px ${d.txt}88, 0 0 64px ${d.txt}44`,
          "& .curso-foto": { transform: "scale(1.05)" },
          "& .curso-pie": { opacity: 1 },
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {!falla ? (
        <Box
          as="img"
          className="curso-foto"
          src={encodeURI(foto)}
          alt={titulo}
          loading="lazy"
          position="absolute"
          inset="0"
          w="100%"
          h="100%"
          style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.45s ease" }}
          onError={() => setFalla(true)}
        />
      ) : (
        <Flex position="absolute" inset="0" align="center" justify="center" px={4}>
          <Text color={d.txt} fontSize={{ base: "sm", md: "md" }} fontWeight="700" textAlign="center">
            {titulo}
          </Text>
        </Flex>
      )}

      {/* Pie: velo suave y «Ver el curso ›». Se enciende del todo al pasar por
          encima, pero se lee siempre (en táctil no hay hover). */}
      <Flex
        className="curso-pie"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        align="center"
        justify="flex-end"
        gap={1.5}
        px={{ base: 3, md: 4 }}
        pt={{ base: 6, md: 8 }}
        pb={{ base: 2.5, md: 3 }}
        color="white"
        opacity={0.88}
        bgGradient="linear(to-t, #000000d9, #00000073, transparent)"
        sx={{ transition: "opacity 0.3s ease" }}
      >
        <Text
          fontSize={{ base: "2xs", md: "xs" }}
          letterSpacing="0.16em"
          textTransform="uppercase"
          fontWeight="600"
        >
          {t("presentacion.verCurso")}
        </Text>
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="12px" h="12px" fill="currentColor">
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </Box>
      </Flex>
    </Box>
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
