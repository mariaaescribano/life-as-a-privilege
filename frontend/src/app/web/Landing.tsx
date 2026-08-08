import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SelectorIdioma from "../../components/global/SelectorIdioma";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import DisciplinasMirada from "../../components/landing/DisciplinasMirada";
import { Float, Reveal } from "../../components/global/Reveal";
import { useT } from "../../i18n";
import {
  ALTO_LOGO,
  LOGO_CASA,
  PROYECTOS,
  arenaBg,
  arenaLinea,
  arenaTinta,
  arenaTintaSuave,
  type ProyectoLanding,
} from "../../data/landingProyectos";

/**
 * Landing de bienvenida (`/`) — el recibidor de la casa.
 *
 * Aquí no se enseña nada ni se vende nada: solo se elige proyecto. Todo lo que
 * había antes en la raíz sigue intacto en /welcome (Welcome.tsx).
 *
 * ── El orden, y por qué ──────────────────────────────────────────────────────
 *   0. Header: el elefante + MARÍA ESCRIBANO (izquierda) · idioma + Materiales
 *   1. Intro corta (qué es esto)
 *   2. LAS DOS CAJAS — sin hacer scroll
 *   3. María (quién está detrás de los dos)
 *   4. «Desde dónde miro»: las ocho disciplinas, como prueba de lo anterior
 *   5. Las dos puertas OTRA VEZ, pequeñas
 *   6. Línea legal
 *
 * La elección va arriba porque quien ya sabe a qué viene no tiene que bajar por
 * la biografía para encontrar la puerta; y se repite abajo porque quien llega
 * frío baja leyendo y se la encuentra justo cuando ya está convencido. Cambiar
 * ese orden (relato primero, botones al final) castiga a quien vuelve.
 *
 * Es la ÚNICA página de la web con fondo claro (arena, #F2EAE0): al ser neutral,
 * ni el turquesa de El Mapa ni la terracota de Nace una madre se pelean con el
 * fondo. De ahí que a los componentes compartidos haya que pedirles
 * `fondo="claro"`.
 *
 * IMPORTANTE — cada símbolo es de quien es: el elefante es de LA CASA (header),
 * el mandala es de El Mapa y vive DENTRO de su caja. Ni la cabecera ni los
 * separadores usan el símbolo de un proyecto concreto.
 *
 * Los proyectos se definen en `data/landingProyectos.ts` — para añadir uno,
 * ponerle logo o encender el que está en «Muy pronto», se toca solo ese archivo.
 */

// ── Separador neutro ─────────────────────────────────────────────────────────
// Filete + punto. No puede llevar el mandala: es el logo de uno de los dos
// proyectos, no de la casa.
const Separador = () => (
  <Flex align="center" justify="center" gap={{ base: 4, md: 5 }} px={{ base: 6, md: 12 }}>
    <Box h="1px" w={{ base: "70px", md: "170px" }} bgGradient={`linear(to-r, transparent, ${arenaLinea})`} />
    <Box w="5px" h="5px" borderRadius="full" bg={arenaTintaSuave} opacity={0.45} flexShrink={0} />
    <Box h="1px" w={{ base: "70px", md: "170px" }} bgGradient={`linear(to-l, transparent, ${arenaLinea})`} />
  </Flex>
);

// Candado del proyecto que aún no existe: «Próximamente» a secas se puede leer
// como «hay algo, entra a verlo». Con el candado no hay duda de que está cerrado.
const IconoCandado = ({ color }: { color: string }) => (
  <Box as="svg" viewBox="0 0 24 24" w="13px" h="13px" fill="none" stroke={color} strokeWidth="2" flexShrink={0} aria-hidden>
    <Box as="rect" x="4" y="10.5" width="16" height="11" rx="2.5" />
    <Box as="path" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
  </Box>
);

// ── Header de la landing ─────────────────────────────────────────────────────
// A la izquierda la marca de la casa: el elefante con MARÍA ESCRIBANO debajo. A
// la derecha, idioma y Materiales.
//
// Sin más navegación a propósito: el resto de la página son las dos puertas, y
// un menú largo aquí las convertiría en dos opciones entre muchas.
function HeaderLanding() {
  const navigate = useNavigate();
  const t = useT();
  // Si el PNG del elefante todavía no está en /public/img/icono/, el header se
  // pinta solo con el nombre en vez de dejar el icono roto del navegador.
  const [sinLogo, setSinLogo] = useState(false);

  return (
    <Flex
      as="header"
      align="flex-start"
      justify="space-between"
      gap={4}
      px={{ base: 6, md: 12 }}
      pt={{ base: 6, md: 8 }}
    >
      {/* ── Izquierda: la marca de la casa ── */}
      <Flex direction="column" align="center" gap={{ base: 2, md: 2.5 }} flexShrink={0}>
        {!sinLogo && (
          <Image
            src={LOGO_CASA}
            alt=""
            h={{ base: "52px", md: "68px" }}
            objectFit="contain"
            onError={() => setSinLogo(true)}
          />
        )}
        <Text
          color={arenaTinta}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "2xs", md: "sm" }}
          letterSpacing={{ base: "0.14em", md: "0.2em" }}
          textTransform="uppercase"
          whiteSpace="nowrap"
          lineHeight="1"
        >
          María Escribano
        </Text>
      </Flex>

      {/* ── Derecha: idioma y Materiales ──
          `pt` corto para que queden a la altura del elefante, no del nombre. */}
      <Flex align="center" gap={{ base: 4, md: 8 }} pt={{ base: 1, md: 3 }} flexShrink={0}>
        <SelectorIdioma fondo="claro" />

        <Text
          as="button"
          type="button"
          onClick={() => navigate("/materiales")}
          color={arenaTinta}
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "2xs", md: "sm" }}
          letterSpacing={{ base: "0.1em", md: "0.16em" }}
          textTransform="uppercase"
          whiteSpace="nowrap"
          bg="transparent"
          border="none"
          cursor="pointer"
          opacity={0.85}
          _hover={{ opacity: 1, textDecoration: "underline", textUnderlineOffset: "6px" }}
          transition="opacity 0.2s ease"
        >
          {t("header.materiales")}
        </Text>
      </Flex>
    </Flex>
  );
}

// ── Caja de un proyecto ──────────────────────────────────────────────────────
function CajaProyecto({ p, delay }: { p: ProyectoLanding; delay: number }) {
  const navigate = useNavigate();
  const t = useT();
  const abrir = () => { if (p.disponible) navigate(p.ruta); };

  return (
    <Reveal
      direction="up"
      distance={30}
      scaleFrom={0.97}
      duration={0.85}
      delay={delay}
      h="100%"
    >
      <Box
        role="group"
        onClick={abrir}
        // Accesible con teclado: la caja ENTERA es el botón (no solo el «Entrar»),
        // así que tiene que poder recibir foco y responder a Enter/Espacio.
        // La del proyecto que aún no existe va `disabled`: se lee, pero no navega
        // ni entra en el orden de tabulación.
        as="button"
        type="button"
        disabled={!p.disponible}
        textAlign="left"
        display="flex"
        flexDirection="column"
        w="100%"
        h="100%"
        position="relative"
        overflow="hidden"
        borderRadius="3xl"
        bg={p.bg}
        // Padding generoso: la caja es lo único que hay en la página, así que se
        // puede permitir respirar. Con menos, el texto se pegaba a los bordes y
        // el conjunto se leía apretado.
        px={{ base: 8, md: 12, lg: 16 }}
        py={{ base: 10, md: 14, lg: 16 }}
        cursor={p.disponible ? "pointer" : "default"}
        // La caja apagada no desaparece: se lee igual de bien, solo pierde fuerza.
        opacity={p.disponible ? 1 : 0.78}
        // Sombra teñida con el color del propio proyecto: sobre crema una sombra
        // gris ensucia, y en cambio su propio color la asienta en la página.
        boxShadow={`0 16px 42px ${p.bg}45, 0 3px 12px #2A26221A`}
        transition="transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease"
        _groupHover={p.disponible ? {
          transform: "translateY(-7px)",
          boxShadow: `0 26px 60px ${p.bg}59, 0 6px 18px #2A26221F`,
        } : {}}
        _focusVisible={{ outline: `2px solid ${arenaTinta}`, outlineOffset: "4px" }}
      >
        {/* Luz de esquina: le da volumen a un color plano. Hex-alpha, no rgba()
            — en bgGradient las comas del rgba() rompen el valor. */}
        <Box
          position="absolute"
          inset={0}
          bgGradient={`linear(to-br, ${p.txt}1F, transparent 55%)`}
          pointerEvents="none"
        />

        <Box position="relative" zIndex={1} display="flex" flexDirection="column" h="100%">
          {/* ── Logo del proyecto ──
              El hueco se reserva SIEMPRE (aunque el proyecto no tenga logo
              todavía): así los dos títulos quedan a la misma altura y las cajas
              no se descuadran la una respecto a la otra. */}
          <Flex h={ALTO_LOGO} align="center" justify="flex-start" flexShrink={0}>
            {p.logo && (
              <Float amplitude={5} duration={5.5}>
                <Image
                  src={p.logo}
                  alt=""
                  h={ALTO_LOGO}
                  objectFit="contain"
                  filter={`drop-shadow(0 0 12px ${p.txt}59) drop-shadow(0 0 26px ${p.txt}2B)`}
                  transition="transform 0.3s ease"
                  _groupHover={{ transform: "scale(1.06)" }}
                />
              </Float>
            )}
          </Flex>

          {/* Nombre del proyecto — traducido, y en mayúsculas igual que en la
              portada del propio proyecto. */}
          <Text
            mt={{ base: 6, md: 8 }}
            color={p.txt}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
            letterSpacing="0.1em"
            textTransform="uppercase"
            lineHeight="1.25"
          >
            {t(p.nombreKey)}
          </Text>

          {/* Filete acento */}
          <Box
            mt={{ base: 5, md: 6 }}
            h="2px"
            w={{ base: "60px", md: "80px" }}
            borderRadius="full"
            bgGradient={`linear(to-r, ${p.txt}99, transparent)`}
          />

          {/* Lema */}
          <Text
            mt={{ base: 5, md: 6 }}
            color={p.txt}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "lg", md: "xl" }}
            letterSpacing="0.02em"
            lineHeight="1.5"
          >
            {t(p.lemaKey)}
          </Text>

          {/* Descripción */}
          <Text
            mt={{ base: 4, md: 5 }}
            color={p.txt}
            opacity={0.9}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            lineHeight="1.85"
            letterSpacing="0.01em"
          >
            {t(p.descKey)}
          </Text>

          {/* Pie de la caja — `mt="auto"` lo pega abajo, así las dos cajas tienen
              su botón a la misma altura aunque las descripciones midan distinto.
              Las dos etiquetas («Entrar» y «Muy pronto») son la MISMA píldora
              para que los dos pies queden alineados; la del proyecto que aún no
              existe va sin relleno y con el borde a medio gas. */}
          <Flex mt="auto" pt={{ base: 9, md: 12 }} align="center">
            <Flex
              as="span"
              align="center"
              gap={2}
              px={{ base: 7, md: 9 }}
              py={{ base: "11px", md: "14px" }}
              borderRadius="full"
              color={p.txt}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "xs", md: "sm" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              border={`1px solid ${p.disponible ? `${p.txt}66` : `${p.txt}40`}`}
              bg={p.disponible ? `${p.txt}1A` : "transparent"}
              opacity={p.disponible ? 1 : 0.8}
              transition="background 0.25s ease, border-color 0.25s ease"
              _groupHover={p.disponible ? { bg: `${p.txt}33`, borderColor: p.txt } : {}}
            >
              {!p.disponible && <IconoCandado color={p.txt} />}
              {p.disponible ? t("landing.entrar") : t("landing.muyPronto")}
              {p.disponible && (
                <Box
                  as="span"
                  display="inline-block"
                  transition="transform 0.25s ease"
                  _groupHover={{ transform: "translateX(4px)" }}
                >
                  →
                </Box>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Reveal>
  );
}

// ── Puerta del cierre ────────────────────────────────────────────────────────
// La misma decisión que arriba, en pequeño: quien ha bajado leyendo el relato se
// encuentra la puerta sin tener que volver al principio. Aquí el color del
// proyecto va RELLENO (no hay descripción que sostener), para que se lean como
// dos botones y no como dos cajas más.
function PuertaCierre({ p }: { p: ProyectoLanding }) {
  const navigate = useNavigate();
  const t = useT();

  return (
    <Flex
      as="button"
      type="button"
      disabled={!p.disponible}
      onClick={() => { if (p.disponible) navigate(p.ruta); }}
      role="group"
      align="center"
      justify="center"
      gap={2.5}
      px={{ base: 8, md: 11 }}
      py={{ base: "14px", md: "17px" }}
      borderRadius="full"
      bg={p.bg}
      color={p.txt}
      fontFamily="'EB Garamond', serif"
      fontWeight="700"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.14em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      border="none"
      cursor={p.disponible ? "pointer" : "default"}
      opacity={p.disponible ? 1 : 0.62}
      boxShadow={`0 8px 24px ${p.bg}45`}
      transition="transform 0.28s ease, box-shadow 0.28s ease"
      _hover={p.disponible ? { transform: "translateY(-3px)", boxShadow: `0 14px 34px ${p.bg}5E` } : {}}
      _focusVisible={{ outline: `2px solid ${arenaTinta}`, outlineOffset: "4px" }}
    >
      {!p.disponible && <IconoCandado color={p.txt} />}
      {t(p.nombreKey)}
      <Box
        as="span"
        display="inline-block"
        fontSize={{ base: "xs", md: "sm" }}
        transition="transform 0.28s ease"
        _groupHover={p.disponible ? { transform: "translateX(4px)" } : {}}
      >
        {p.disponible ? "→" : `· ${t("landing.muyPronto")}`}
      </Box>
    </Flex>
  );
}

// ── Página ───────────────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const t = useT();
  const introTitulo = t("landing.intro.titulo");
  const introSub = t("landing.intro.sub");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const enlaceLegal = (clave: "footer.avisoLegal" | "footer.privacidad" | "footer.cookies", ruta: string) => (
    <Text
      as="button"
      type="button"
      onClick={() => navigate(ruta)}
      color={arenaTintaSuave}
      fontFamily="'EB Garamond', serif"
      fontSize={{ base: "2xs", md: "xs" }}
      letterSpacing="0.06em"
      bg="transparent"
      border="none"
      cursor="pointer"
      _hover={{ color: arenaTinta, textDecoration: "underline" }}
      transition="color 0.2s ease"
    >
      {t(clave)}
    </Text>
  );

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg={arenaBg}
      fontFamily="'EB Garamond', serif"
    >
      {/* ── 0 · HEADER ── */}
      <HeaderLanding />

      <Box flex="1">
        {/* ── 1 · INTRO ──
            La única cabecera de la página, y sin ningún símbolo: el mandala
            pertenece a El Mapa y vive en su caja. Las dos frases se pueden dejar
            vacías en los textos y no dejan hueco muerto. */}
        {(introTitulo || introSub) && (
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={{ base: 5, md: 6 }}
            pt={{ base: 12, md: 20 }}
            px={{ base: 8, md: 12 }}
          >
            {introTitulo && (
              <Reveal direction="up" distance={24} duration={0.95} delay={0.05}>
                <Text
                  color={arenaTinta}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  letterSpacing="0.04em"
                  lineHeight="1.2"
                  maxW="820px"
                >
                  {introTitulo}
                </Text>
              </Reveal>
            )}

            {introSub && (
              <Reveal direction="up" distance={20} duration={0.9} delay={0.2}>
                <Text
                  color={arenaTintaSuave}
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing="0.03em"
                  lineHeight="1.7"
                  maxW="680px"
                >
                  {introSub}
                </Text>
              </Reveal>
            )}
          </Flex>
        )}

        {/* ── 2 · LAS DOS CAJAS ──
            Lo primero que se ve, sin scroll: es para lo que existe la página.
            `alignItems="stretch"`: las dos miden lo mismo de alto aunque una
            tenga más texto que la otra. */}
        <Box px={{ base: 6, md: 12, lg: 20 }} pt={{ base: 11, md: 16 }}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 8, md: 10, lg: 14 }}
            alignItems="stretch"
            maxW="1240px"
            mx="auto"
          >
            {PROYECTOS.map((p, i) => (
              <CajaProyecto key={p.key} p={p} delay={0.3 + i * 0.18} />
            ))}
          </Grid>
        </Box>

        <Box pt={{ base: 20, md: 28 }}><Separador /></Box>

        {/* ── 3 · YO ── */}
        <CreadoraCard fondo="claro" />

        <Box pt={{ base: 20, md: 28 }}><Separador /></Box>

        {/* ── 4 · DESDE DÓNDE MIRO ──
            Las ocho disciplinas como PRUEBA de lo que dice el box de María, no
            como menú: los círculos no son enlaces (ver DisciplinasMirada). */}
        <Box pt={{ base: 16, md: 24 }}>
          <DisciplinasMirada />
        </Box>

        <Box pt={{ base: 20, md: 28 }}><Separador /></Box>

        {/* ── 5 · LAS DOS PUERTAS OTRA VEZ ──
            Para quien ha bajado leyendo y ya está convencido: la puerta está
            aquí, no hay que volver arriba. */}
        <Reveal inView amount={0.15} direction="up" distance={22} duration={0.85}>
          <Flex
            direction="column"
            align="center"
            gap={{ base: 7, md: 9 }}
            px={{ base: 6, md: 12 }}
            pt={{ base: 16, md: 24 }}
          >
            <Text
              color={arenaTinta}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textAlign="center"
            >
              {t("landing.cierre")}
            </Text>

            <Flex gap={{ base: 4, md: 6 }} wrap="wrap" justify="center">
              {PROYECTOS.map((p) => (
                <PuertaCierre key={p.key} p={p} />
              ))}
            </Flex>
          </Flex>
        </Reveal>
      </Box>

      {/* ── 6 · LÍNEA LEGAL ──
          Lo mínimo imprescindible: la raíz es la puerta de entrada de la web y
          los avisos legales tienen que estar alcanzables desde aquí. */}
      <Flex
        direction="column"
        align="center"
        gap={2}
        px={{ base: 6, md: 12 }}
        pt={{ base: 20, md: 28 }}
        pb={{ base: 10, md: 12 }}
      >
        <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} wrap="wrap">
          {enlaceLegal("footer.avisoLegal", "/aviso-legal")}
          <Box as="span" color={arenaLinea} aria-hidden>·</Box>
          {enlaceLegal("footer.privacidad", "/privacidad")}
          <Box as="span" color={arenaLinea} aria-hidden>·</Box>
          {enlaceLegal("footer.cookies", "/cookies")}
        </Flex>
        <Text
          color={arenaTintaSuave}
          opacity={0.75}
          fontSize={{ base: "2xs", md: "xs" }}
          letterSpacing="0.06em"
          textAlign="center"
        >
          {t("landing.derechos")}
        </Text>
      </Flex>
    </Box>
  );
};

export default Landing;
