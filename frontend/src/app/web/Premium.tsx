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
/** El móvil con el aviso «¡Nuevo reel!», recortado del fondo negro. */
const FOTO_AVISO = "/img/premium/telefono-aviso.webp";

/** Iconos de las afirmaciones (Material Symbols, trazo blanco). Se dibujan a la altura del
 *  mandala. El de «Por solo 5 € al mes.» llega después. */
const ICONOS: Record<string, string> = {
  video: "M12,13.5l6-4l-6-4v8ZM12.7,19h5.6q-0.18,0.65-0.6,1.05q-0.42,0.4-1.1,0.5L5.7,21.88Q4.88,22 4.21,21.49T3.45,20.15L2.13,9.23Q2.03,8.4 2.53,7.75T3.85,7L5,6.85v2L4.1,8.98L5.45,19.9L12.7,19ZM9,17q-0.82,0-1.41-0.59T7,15V4Q7,3.17 7.59,2.59T9,2H20q0.83,0 1.41,0.59T22,4V15q0,0.82-0.59,1.41T20,17H9Zm0-2H20V4H9V15Zm5.5-5.5ZM5.45,19.9Z",
  correo: "M4,20q-0.82,0-1.41-0.59T2,18V6Q2,5.18 2.59,4.59T4,4H20q0.83,0 1.41,0.59Q22,5.18 22,6V18q0,0.82-0.59,1.41T20,20H4Zm8-7L4,8V18H20V8l-8,5Zm0-2l8-5H4l8,5ZM4,8V6V8V18V8Z",
};

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
    { texto: t("premium.acceso.videos"), mandala: false, icono: "video" },
    { texto: t("premium.acceso.plataforma"), mandala: true, icono: undefined },
    { texto: t("premium.acceso.precio"), mandala: false, icono: undefined },
    { texto: t("premium.acceso.aviso"), mandala: false, icono: "correo" },
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
              <Reveal activo={visible} direction="right" distance={36} scaleFrom={0.94} duration={1} w={{ base: "170px", md: "230px", lg: "280px" }} flexShrink={0}>
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

          {/* Las cuatro afirmaciones de dos en dos, con hilos de luz en cruz, y a la derecha
              el móvil con el aviso (debajo en móvil). */}
          <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 10, lg: 14 }}>
            <Grid
              flex="1"
              w="100%"
              templateColumns={{ base: "1fr", md: "1fr 1px 1fr" }}
              alignItems="stretch"
              rowGap={{ base: 8, md: 0 }}
            >
              {afirmaciones.map((a, i) => {
                const col = i % 2;
                const fila = (i - col) / 2;
                return (
                  <React.Fragment key={i}>
                    {(i === 1 || i === 3) && (
                      // Raya horizontal entre afirmaciones: solo en móvil, donde van una bajo otra.
                      <Reveal inView amount={0.5} direction="none" scaleFrom={0.4} duration={0.9} delay={0.2} display={{ base: "flex", md: "none" }} justifyContent="center">
                        <Box w="60%" h="1px" bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)" boxShadow="0 0 8px rgba(255,255,255,0.3)" />
                      </Reveal>
                    )}
                    {i === 2 && (
                      // Hilo horizontal entre las dos filas.
                      <Reveal inView amount={0.5} direction="none" scaleFrom={0.4} duration={0.9} delay={0.35} display="flex" justifyContent="center" gridColumn="1 / -1" py={{ base: 0, md: 2 }}>
                        <Box w={{ base: "60%", md: "70%" }} h="1px" bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)" boxShadow="0 0 8px rgba(255,255,255,0.3)" />
                      </Reveal>
                    )}
                    {col === 1 && (
                      // Hilo vertical entre las dos columnas (solo en escritorio).
                      <Reveal inView amount={0.5} direction="none" scaleFrom={0.4} duration={0.9} delay={fila * 0.5 + 0.15} display={{ base: "none", md: "flex" }} justifyContent="center">
                        <Box w="1px" h="100%" bg="linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)" boxShadow="0 0 8px rgba(255,255,255,0.3)" />
                      </Reveal>
                    )}
                    <Reveal inView amount={0.35} direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={fila * 0.5 + col * 0.25}>
                      <Flex direction="column" align="center" justify="center" textAlign="center" gap={4} px={{ base: 2, md: 6 }} py={{ base: 2, md: 6 }} h="100%">
                        {a.mandala && (
                          <Image
                            src="/img/icono/life.webp"
                            alt=""
                            aria-hidden="true"
                            h={{ base: "44px", md: "54px" }}
                            objectFit="contain"
                            style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.5)) drop-shadow(0 0 22px rgba(255,255,255,0.28))" }}
                          />
                        )}
                        {a.icono && (
                          <Box
                            as="svg"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="#FFFFFF"
                            h={{ base: "44px", md: "54px" }}
                            w={{ base: "44px", md: "54px" }}
                            style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.5)) drop-shadow(0 0 22px rgba(255,255,255,0.28))" }}
                          >
                            <path d={ICONOS[a.icono]} />
                          </Box>
                        )}
                        <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.4" letterSpacing="0.02em" sx={{ textWrap: "balance" }}>
                          <ConNumero texto={a.texto} />
                        </Text>
                      </Flex>
                    </Reveal>
                  </React.Fragment>
                );
              })}
            </Grid>

            <Reveal inView amount={0.25} direction="left" distance={36} scaleFrom={0.95} duration={1} delay={0.3} w={{ base: "250px", md: "300px", lg: "340px" }} flexShrink={0}>
              <Image src={FOTO_AVISO} alt="" w="100%" h="auto" display="block" style={{ filter: "drop-shadow(0 0 22px rgba(255,255,255,0.22)) drop-shadow(0 0 48px rgba(180,255,245,0.18))" }} />
            </Reveal>
          </Flex>
        </Box>

        <SeparadorFlor />

        {/* ── 4 · LLAMADA A LA ACCIÓN, SOBRE EL MÁRMOL ──
            El mármol sale primero; luego el título, el botón y el pensamiento. */}
        <BandaMarmol pt={{ base: "104px", md: "136px" }} pb={{ base: "116px", md: "148px" }}>
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
                  {t("comun.empezar")}
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
