import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BotonContactame from "../../components/global/BotonContactame";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { useNavigate } from "react-router-dom";
import { focoBlanco } from "../../components/global/foco";
import { useT } from "../../i18n";

/**
 * Contenido premium. De arriba abajo:
 *   1. Mandala, «CONTENIDO PREMIUM» y «Entretenimiento de calidad, fiable y
 *      educativo.» (la misma entrada que la portada: mandala → titular → frase →
 *      separación; después se queda quieto y solo lo repasa la luz).
 *   2. SOBRE EL MÁRMOL: foto a la izquierda y «Da sentido a tu tiempo» a la derecha.
 *   3. Separación con el mandala · sobre el turquesa: «Accede a contenido exclusivo»
 *      (blanca y en cursiva) y tres afirmaciones en tres columnas, con los números
 *      grandes y hilos de luz entre ellas.
 *   4. SOBRE EL MÁRMOL otra vez: la llamada a la acción: «Empieza a descubrir hoy»,
 *      el botón «Iniciar sesión» y, debajo, en cursiva, lo que piensa quien llega:
 *      «Quiero conocerme más, conociendo más».
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";
/** El móvil con el reel de María, recortado del fondo negro (transparente). */
const FOTO = "/img/premium/telefono.webp";

/** Texto con el número (20, 5 €) más grande y con luz; el resto, normal. No toca el texto. */
const ConNumero = ({ texto }: { texto: string }) => (
  <>
    {texto.split(/(\d+(?:\s?€)?)/).map((trozo, i) =>
      /^\d/.test(trozo) ? (
        <Box
          key={i}
          as="span"
          display="inline-block"
          fontSize={{ base: "5xl", md: "6xl" }}
          fontWeight="700"
          lineHeight="1"
          letterSpacing="0.02em"
          mx={1}
          textShadow="0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(180,255,245,0.3)"
        >
          {trozo}
        </Box>
      ) : (
        <React.Fragment key={i}>{trozo}</React.Fragment>
      ),
    )}
  </>
);

const Premium = () => {
  const t = useT();
  const navigate = useNavigate();

  // La cabecera arranca un instante después de montar, para que se vea entrar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const afirmaciones = [
    { texto: t("premium.acceso.videos"), mandala: false },
    { texto: t("premium.acceso.plataforma"), mandala: true },
    { texto: t("premium.acceso.precio"), mandala: false },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        {/* ── 1 · MANDALA + TITULAR + FRASE ── */}
        <WelcomeCabecera activo={mounted} titulo={t("premium.titulo")} subtitulo={t("premium.subtitulo")} mayusculas />

        {/* ── 2 · SOBRE EL MÁRMOL: FOTO A LA IZQUIERDA, TEXTO A LA DERECHA ──
            El mármol sale primero al hacer scroll; la foto y el texto, después. */}
        <BandaMarmol>
          {(visible) => (
            <Flex
              w="100%"
              maxW="1180px"
              mx="auto"
              px={{ base: 5, md: 10, lg: 16 }}
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={{ base: 8, md: 12, lg: 16 }}
            >
              <Reveal activo={visible} direction="right" distance={36} scaleFrom={0.94} duration={1} w={{ base: "260px", md: "360px", lg: "440px" }} flexShrink={0}>
                {/* Sin marco: el móvil ya es la forma. Un halo dorado suave lo despega del mármol. */}
                <Image src={FOTO} alt="" w="100%" h="auto" display="block" style={{ filter: "drop-shadow(0 0 22px #b08d3f66) drop-shadow(0 0 48px #b08d3f33)" }} />
              </Reveal>
              <Flex direction="column" gap={{ base: 3, md: 4 }} flex="1" minW={0} textAlign={{ base: "center", md: "left" }}>
                <Reveal activo={visible} direction="left" distance={30} duration={0.9} delay={0.3}>
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} letterSpacing="0.03em" lineHeight="1.15">
                    {t("premium.sentido.titulo")}
                  </Text>
                </Reveal>
                <Reveal activo={visible} direction="left" distance={30} duration={0.9} delay={0.55}>
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.7">
                    {t("premium.sentido.p1")}
                  </Text>
                </Reveal>
                <Reveal activo={visible} direction="left" distance={30} duration={0.9} delay={0.8}>
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.7">
                    {t("premium.sentido.p2")}
                  </Text>
                </Reveal>
              </Flex>
            </Flex>
          )}
        </BandaMarmol>

        <SeparadorFlor />

        {/* ── 3 · SOBRE EL TURQUESA: ACCEDE A CONTENIDO EXCLUSIVO ── */}
        <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }} pb={{ base: 16, md: 24 }}>
          <Reveal inView amount={0.5} direction="up" distance={20} duration={0.9}>
            <Text
              textAlign="center"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.03em"
              lineHeight="1.3"
              mb={{ base: 10, md: 14 }}
            >
              {t("premium.acceso.intro")}
            </Text>
          </Reveal>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1px 1fr 1px 1fr" }} alignItems="stretch" rowGap={{ base: 8, md: 0 }}>
            {afirmaciones.map((a, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  // El hilo de luz entre afirmaciones: vertical en escritorio, horizontal en móvil.
                  <Reveal inView amount={0.5} direction="none" scaleFrom={0.4} duration={0.9} delay={i * 0.25 - 0.1} display="flex" justifyContent="center">
                    <Box
                      w={{ base: "60%", md: "1px" }}
                      h={{ base: "1px", md: "100%" }}
                      bg={{ base: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)", md: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)" }}
                      boxShadow="0 0 8px rgba(255,255,255,0.3)"
                    />
                  </Reveal>
                )}
                <Reveal inView amount={0.35} direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={i * 0.25}>
                  <Flex direction="column" align="center" justify="center" textAlign="center" gap={4} px={{ base: 2, md: 8 }} py={{ base: 2, md: 6 }} h="100%">
                    {a.mandala && (
                      <Image
                        src="/img/icono/life.webp"
                        alt=""
                        aria-hidden="true"
                        h={{ base: "56px", md: "68px" }}
                        objectFit="contain"
                        style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.5)) drop-shadow(0 0 22px rgba(255,255,255,0.28))" }}
                      />
                    )}
                    <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.4" letterSpacing="0.02em" sx={{ textWrap: "balance" }}>
                      <ConNumero texto={a.texto} />
                    </Text>
                  </Flex>
                </Reveal>
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        <SeparadorFlor />

        {/* ── 4 · LLAMADA A LA ACCIÓN, SOBRE EL MÁRMOL ──
            El mármol sale primero; luego el título, el botón y el pensamiento. */}
        <BandaMarmol>
          {(visible) => (
            <Flex direction="column" align="center" textAlign="center" w="100%" maxW="900px" mx="auto" px={{ base: 5, md: 10 }} gap={{ base: 6, md: 8 }}>
              <Reveal activo={visible} direction="up" distance={22} duration={0.9}>
                <Text color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }} letterSpacing="0.03em" lineHeight="1.15">
                  {t("premium.cta.titulo")}
                </Text>
              </Reveal>
              <Reveal activo={visible} direction="up" distance={18} scaleFrom={0.95} duration={0.8} delay={0.35}>
                <Box
                  as="button"
                  type="button"
                  onClick={() => navigate("/logIn")}
                  px={{ base: 10, md: 16 }}
                  py={{ base: "16px", md: "20px" }}
                  borderRadius="full"
                  bg={TINTA}
                  border={`1.5px solid ${TINTA}`}
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "2xl" }}
                  letterSpacing="0.16em"
                  textTransform="uppercase"
                  boxShadow={`0 0 16px ${ORO}44, 0 0 36px ${ORO}22`}
                  cursor="pointer"
                  transition="background 0.25s ease"
                  _hover={{ bg: "#006b6b" }}
                  _focusVisible={focoBlanco}
                >
                  {t("header.iniciarSesion")}
                </Box>
              </Reveal>
              <Reveal activo={visible} direction="up" distance={14} duration={0.9} delay={0.7}>
                <Text color={TINTA} fontFamily="'EB Garamond', serif" fontStyle="italic" fontSize={{ base: "lg", md: "2xl" }} lineHeight="1.5">
                  {t("premium.cta.pensamiento")}
                </Text>
              </Reveal>
            </Flex>
          )}
        </BandaMarmol>
      </Box>

      <SiteFooter />
      <BotonContactame />
    </Box>
  );
};

export default Premium;
