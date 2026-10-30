import React, { useEffect, useState } from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BotonContactame from "../../components/global/BotonContactame";
import BandaMarmol from "../../components/global/BandaMarmol";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import WelcomeMandala from "../../components/welcome/WelcomeMandala";
import { MAPA } from "../../components/web/mapaDisciplinasData";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { focoBlanco } from "../../components/global/foco";
import { astrologiaNom } from "../../GlobalVariables";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import { useT } from "../../i18n";

/**
 * Disciplinas. De arriba abajo:
 *   0. Mandala, «DISCIPLINAS» y «8 perspectivas para comprender una misma realidad.».
 *   1. Sobre el mármol, el mandala con las ocho disciplinas (nombre y frase).
 *   2. «Pulsa y accede al material gratuito» y las ocho disciplinas una a una (icono,
 *      rayita y nombre sobre su foto); cada una lleva a su portada.
 *   3. Sobre el mármol: foto de María a la izquierda y «¿Cómo trabajo con cada
 *      disciplina?» a la derecha, con un «Saber más» (el texto de debajo está pendiente).
 *   Debajo, un espacio turquesa y el pie: la tercera sección es la última.
 */
/** Las ocho del mandala: las del mapa, con su portada (mismo orden que MAPA). */
const SLUGS = ["psicologia", "fisiologia", "nutricion", "cultura", "medicinachina", "astrologia", "cabala", "ayurveda"];
const DISCIPLINAS_MANDALA = MAPA.map((d, i) => ({ name: d.name, bg: d.bg, txt: d.txt, renderIcon: d.renderIcon, lemaKey: d.lemaKey, link: `/disciplina/${SLUGS[i]}` }));

const TINTA = "#004f4f";
const ORO = "#b08d3f";

/** Una disciplina como tarjeta con su foto: icono arriba, rayita fina y el nombre. */
const TarjetaDisciplina = ({ d }: { d: (typeof DISCIPLINAS_MANDALA)[number] }) => {
  const nombreDe = useNombreDisciplina();
  const conFondo = hasDisciplinaBg(d.name);
  const sombra = sombraTexto(d.name, d.bg);
  return (
    <Box
      as="a"
      href={d.link}
      // En una PESTAÑA NUEVA: Disciplinas se queda donde está.
      target="_blank"
      rel="noopener noreferrer"
      display="block"
      textDecoration="none"
      role="group"
      position="relative"
      overflow="hidden"
      w="100%"
      borderRadius="2xl"
      bg={d.bg}
      boxShadow={`0 0 18px ${d.txt}33, 0 0 40px ${d.txt}14`}
      cursor="pointer"
      _hover={{ textDecoration: "none" }}
      _focusVisible={focoBlanco}
      sx={{ aspectRatio: "1 / 1", WebkitTapHighlightColor: "transparent" }}
    >
      {/* La foto de la disciplina, a pantalla completa; se acerca al pasar el ratón. */}
      <Box position="absolute" inset={0} transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "scale(1.06)" }}>
        {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="2xl" />}
      </Box>
      <Flex position="relative" zIndex={1} h="100%" direction="column" align="center" justify="center" gap={{ base: 3, md: 4 }} px={3}>
        <Box display="flex" alignItems="center" justifyContent="center" filter={`drop-shadow(0 0 8px ${d.bg})`}>
          {d.renderIcon("44px")}
        </Box>
        {/* En Astrología (letra blanca sobre el cielo) la rayita parecía un subrayado: sin ella. */}
        {d.name !== astrologiaNom && (
          <Box h="1px" w={{ base: "40px", md: "56px" }} bg={`linear-gradient(to right, transparent, ${d.txt}, transparent)`} />
        )}
        <Text color={d.txt} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "xl" }} letterSpacing="0.05em" lineHeight="1.15" textAlign="center" noOfLines={1} textShadow={sombra}>
          {nombreDe(d.name)}
        </Text>
      </Flex>
    </Box>
  );
};

const Disciplinas = () => {
  const navigate = useNavigate();
  const t = useT();

  // La cabecera arranca un instante después de montar, para que se vea entrar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        {/* ── 0 · MANDALA + «DISCIPLINAS» + FRASE (la misma cabecera de la portada) ── */}
        <WelcomeCabecera activo={mounted} titulo={t("header.disciplinas")} subtitulo={t("disciplinasPagina.subtitulo")} mayusculas />

        {/* ── 1 · LAS OCHO DISCIPLINAS EN SU MANDALA, sobre el mármol ──
            Solo para mostrarlas: cada una con su nombre y su frase. */}
        <BandaMarmol mt={{ base: 2, md: 4 }} tapas pt={{ base: "170px", md: "110px" }} pb={{ base: "180px", md: "120px" }}>
          {(visible) => <WelcomeMandala disciplinas={DISCIPLINAS_MANDALA} activo={visible} />}
        </BandaMarmol>

        <SeparadorFlor />

        {/* ── 2 · LAS OCHO DISCIPLINAS, UNA A UNA ── */}
        <Box w="100%" maxW="1100px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
          <Reveal inView amount={0.5} direction="up" distance={18} duration={0.9}>
            <Text
              textAlign="center"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.02em"
              lineHeight="1.3"
              maxW="900px"
              mx="auto"
            >
              {t("disciplinasPagina.mensaje")}
            </Text>
          </Reveal>
          <Reveal inView amount={0.5} direction="up" distance={12} duration={0.9} delay={0.35}>
            <Text
              textAlign="center"
              color="rgba(255,255,255,0.85)"
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "sm", md: "lg" }}
              letterSpacing="0.04em"
              mt={{ base: 3, md: 4 }}
              mb={{ base: 8, md: 12 }}
            >
              {t("disciplinasPagina.intro")}
            </Text>
          </Reveal>
          <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={{ base: 3, md: 5 }} rowGap={{ base: 3, md: 5 }}>
            {DISCIPLINAS_MANDALA.map((d, i) => (
              <Reveal key={d.name} inView amount={0.3} direction="up" distance={26} scaleFrom={0.95} duration={0.8} delay={(i % 4) * 0.12}>
                <TarjetaDisciplina d={d} />
              </Reveal>
            ))}
          </SimpleGrid>
        </Box>

        <SeparadorFlor />

        {/* ── 3 · SOBRE EL MÁRMOL: FOTO A LA IZQUIERDA, «¿CÓMO TRABAJO…?» A LA DERECHA ── */}
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
              <Reveal activo={visible} direction="right" distance={36} scaleFrom={0.94} duration={1} w={{ base: "250px", md: "300px", lg: "340px" }} flexShrink={0}>
                {/* Doble borde: la foto y, por fuera, un filo fino turquesa oscuro desplazado. */}
                <Box position="relative">
                  <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${TINTA}66`} pointerEvents="none" />
                  <Box borderRadius="22px" overflow="hidden" border={`1.5px solid ${TINTA}`} boxShadow={`0 0 18px ${ORO}44, 0 0 40px ${ORO}22`}>
                    <Image src="/img/me/trajegrisconmapa.webp" alt="María Escribano" w="100%" h="auto" display="block" />
                  </Box>
                </Box>
              </Reveal>
              <Flex direction="column" gap={{ base: 5, md: 6 }} flex="1" minW={0} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
                <Reveal activo={visible} direction="left" distance={30} duration={0.9} delay={0.3}>
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} letterSpacing="0.03em" lineHeight="1.15">
                    {t("disciplinasPagina.como")}
                  </Text>
                </Reveal>
                <Reveal activo={visible} direction="up" distance={14} duration={0.9} delay={0.5}>
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.7">
                    {t("disciplinasPagina.comoTexto")}
                  </Text>
                </Reveal>
                <Reveal activo={visible} direction="up" distance={14} duration={0.9} delay={0.8}>
                  <Box
                    as="button"
                    type="button"
                    onClick={() => navigate("/asesoria")}
                    display="inline-flex"
                    alignItems="center"
                    gap={3}
                    px={{ base: 8, md: 10 }}
                    py="12px"
                    borderRadius="full"
                    bg="transparent"
                    border={`1.5px solid ${TINTA}`}
                    color={TINTA}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    whiteSpace="nowrap"
                    transition="background 0.3s ease"
                    _hover={{ bg: `${TINTA}14` }}
                    _focusVisible={focoBlanco}
                  >
                    {t("elMetodo.saberMas")}
                    <Box as="span" display="inline-block" transition="transform 0.3s ease" sx={{ "button:hover > &": { transform: "translateX(5px)" } }}>→</Box>
                  </Box>
                </Reveal>
              </Flex>
            </Flex>
          )}
        </BandaMarmol>

        {/* Aire turquesa antes del pie: la tercera sección es la última. */}
        <Box h={{ base: "72px", md: "110px" }} />
      </Box>

      <SiteFooter />
      <BotonContactame />
    </Box>
  );
};

export default Disciplinas;
