import React, { useEffect } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SelectorIdioma from "../../components/global/SelectorIdioma";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { Float, Reveal } from "../../components/global/Reveal";
import { useT } from "../../i18n";
import {
  ALTO_LOGO,
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
 * Aquí no se enseña nada ni se vende nada: solo se elige proyecto. Por eso NO
 * lleva header de navegación, ni disciplinas, ni opiniones, ni newsletter — solo
 * las cajas de los proyectos, el box de María y la línea legal. Todo lo que
 * había antes en la raíz sigue intacto en /welcome (Welcome.tsx).
 *
 * Es la ÚNICA página de la web con fondo claro (arena, #F2EAE0): al ser neutral,
 * ni el turquesa de Vida como Privilegio ni la terracota de Nace una madre se
 * pelean con el fondo, y las dos cajas son las únicas manchas de color. De ahí
 * que a los componentes compartidos haya que pedirles `fondo="claro"`.
 *
 * IMPORTANTE — la landing no tiene logo propio: el mandala es el logo de Vida
 * como Privilegio, así que va DENTRO de su caja. Nada de la casa (cabecera,
 * separadores) usa el símbolo de un proyecto concreto.
 *
 * Los proyectos se definen en `data/landingProyectos.ts` — para añadir uno,
 * ponerle logo o encender el que está en «Muy pronto», se toca solo ese archivo.
 */

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

// ── Página ───────────────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const t = useT();
  const intro = t("landing.intro");

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
      {/* ── Barra mínima: solo el idioma ──
          Sin navegación a propósito: desde aquí solo se entra a un proyecto. */}
      <Flex justify="flex-end" px={{ base: 6, md: 12 }} pt={{ base: 6, md: 8 }}>
        <SelectorIdioma fondo="claro" />
      </Flex>

      <Box flex="1">
        {/* ── Frase de orientación ──
            Es la única cabecera de la página: aquí no va ningún símbolo, porque
            el mandala pertenece a Vida como Privilegio y vive en su caja.
            Si `landing.intro` se deja vacía, no se pinta nada (sin hueco muerto). */}
        {intro && (
          <Reveal direction="up" distance={22} duration={0.9} delay={0.1}>
            <Text
              pt={{ base: 12, md: 20 }}
              px={{ base: 8, md: 12 }}
              mx="auto"
              maxW="720px"
              textAlign="center"
              color={arenaTintaSuave}
              fontStyle="italic"
              fontSize={{ base: "lg", md: "2xl" }}
              letterSpacing="0.04em"
              lineHeight="1.65"
            >
              {intro}
            </Text>
          </Reveal>
        )}

        {/* ── Las dos cajas ──
            `alignItems="stretch"`: las dos miden lo mismo de alto aunque una
            tenga más texto que la otra. */}
        <Box px={{ base: 6, md: 12, lg: 20 }} pt={{ base: 12, md: 20 }}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 8, md: 10, lg: 14 }}
            alignItems="stretch"
            maxW="1240px"
            mx="auto"
          >
            {PROYECTOS.map((p, i) => (
              <CajaProyecto key={p.key} p={p} delay={0.25 + i * 0.18} />
            ))}
          </Grid>
        </Box>

        {/* ── Separador ──
            Neutro (filete + punto): no puede llevar el mandala, que es el logo
            de uno de los dos proyectos, no de la casa. */}
        <Flex align="center" justify="center" gap={{ base: 4, md: 5 }} px={{ base: 6, md: 12 }} pt={{ base: 20, md: 28 }}>
          <Box h="1px" w={{ base: "70px", md: "170px" }} bgGradient={`linear(to-r, transparent, ${arenaLinea})`} />
          <Box w="5px" h="5px" borderRadius="full" bg={arenaTintaSuave} opacity={0.45} flexShrink={0} />
          <Box h="1px" w={{ base: "70px", md: "170px" }} bgGradient={`linear(to-l, transparent, ${arenaLinea})`} />
        </Flex>

        {/* ── Box de María ── */}
        <CreadoraCard fondo="claro" />
      </Box>

      {/* ── Línea legal ──
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
