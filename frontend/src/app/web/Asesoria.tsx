import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import BandaMarmol from "../../components/global/BandaMarmol";
import { LetrasVivas } from "../../components/global/LetrasVivas";
import FormularioAsesoria from "../../components/web/FormularioAsesoria";
import MapaDisciplinas from "../../components/web/MapaDisciplinas";
import BotonContactame from "../../components/global/BotonContactame";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { useT, type ClaveTexto } from "../../i18n";

/**
 * Asesoría 1:1. De arriba abajo:
 *   0. Abre con el mandala en medio, el titular «Asesorías 1:1» (misma entrada que
 *      la portada) y debajo «Te asesoro en mente, cuerpo y tradición…».
 *   1. Sobre el mármol: foto de María a la izquierda, texto a la derecha.
 *   2. Separación · «Al acabar mi asesoramiento sabrás...» y cuatro cajas con
 *      foto y frase.
 *   3. Separación · «¿Cómo trabajo?» y dos cajas, sobre el mármol.
 *   3b. Separación · el mapa de disciplinas desplegable (pendiente de textos; ver
 *      components/web/mapaDisciplinasData.tsx) · separación.
 *   4. Separación · el formulario, que es LO ÚLTIMO de la página; el pie va debajo.
 *
 * («Quién soy» y «La formación…» con los diplomas se quitaron de aquí a petición
 * de María; los diplomas siguen en `Certificaciones` y en «Sobre mí».)
 */

const FOTO_MARIA = "/img/me/asesoria.webp";
/** El mármol horizontal de María (`marmolfondo`, 1536 × 1024, a resolución completa). */

// Los colores del mármol, los mismos que LlamadaCta (el popup «Hablamos»).
const TINTA = "#004f4f";
const ORO = "#b08d3f";

/** Cuatro cajas con foto detrás: las mismas de la portada (Cuerpo, Mente, Tradición,
 *  Cultura), desenfocadas para que se lea la frase que va encima. */
const CAJAS: { foto: string; texto: ClaveTexto }[] = [
  { foto: "/img/welcome/cuerpo.webp", texto: "asesoria.logro.cuerpo" },
  { foto: "/img/welcome/mente.webp", texto: "asesoria.logro.mente" },
  { foto: "/img/welcome/tradicion.webp", texto: "asesoria.logro.tradicion" },
  { foto: "/img/welcome/cultura.webp", texto: "asesoria.logro.cultura" },
];
/** Las dos cajas de «¿Cómo trabajo?». */
const PASOS: { titulo: ClaveTexto; texto: ClaveTexto }[] = [
  { titulo: "asesoria.paso1.titulo", texto: "asesoria.paso1.texto" },
  { titulo: "asesoria.paso2.titulo", texto: "asesoria.paso2.texto" },
];

const HALO_CAJA = "0 0 16px rgba(255,255,255,0.14), 0 0 34px rgba(255,255,255,0.07), 0 0 60px rgba(180,255,245,0.08)";

/** Caja con la foto NÍTIDA de fondo y la frase encima, sobre un cristal esmerilado: es
 *  el texto el que desenfoca la foto que tiene detrás (`backdrop-filter`), no la
 *  foto entera. El cristal lleva un blanco muy ligero y ningún velo oscuro.
 *
 *  Dinamismo: las cajas llegan de una en una; luego el cristal se abre desde el
 *  centro y la frase se enciende letra a letra (`LetrasVivas`), sin ola después. */
const CajaFoto = ({ foto, texto, i }: { foto: string; texto: string; i: number }) => {
  const [on, setOn] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el) return;
    let id: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // La caja entra con su retraso (i × 0,4 s); la frase, justo después.
          id = setTimeout(() => setOn(true), (i * 0.4 + 0.7) * 1000);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(id); };
  }, [el, i]);

  return (
    <Reveal inView amount={0.25} direction="up" distance={34} scaleFrom={0.96} duration={0.9} delay={i * 0.4} w="100%" h="100%">
      <Box
        ref={setEl}
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        minH={{ base: "240px", md: "280px" }}
        h="100%"
        bg="rgba(255,255,255,0.08)"
        boxShadow={HALO_CAJA}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={{ base: 4, md: 6 }}
      >
        <Image src={foto} alt="" aria-hidden="true" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
        <Reveal activo={on} direction="none" scaleFrom={0.88} duration={0.8} position="relative" zIndex={1}>
          <Box
            borderRadius="xl"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            bg="rgba(255,255,255,0.12)"
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              lineHeight="1.45"
              textAlign="center"
              textShadow="0 0 12px rgba(0,0,0,0.45), 0 0 24px rgba(0,0,0,0.25)"
            >
              <LetrasVivas texto={texto} entrada activo={on} onda={false} pasoEntrada={0.018} />
            </Text>
          </Box>
        </Reveal>
      </Box>
    </Reveal>
  );
};

const Asesoria = () => {
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
        {/* ── 0 · MANDALA + TITULAR + FRASE ── */}
        <WelcomeCabecera activo={mounted} titulo={t("asesoria.titulo")} subtitulo={t("asesoria.subtitulo")} mayusculas />

        {/* ── 1 · SOBRE EL MÁRMOL: FOTO A LA IZQUIERDA, TEXTO A LA DERECHA ──
            El mármol sale primero al hacer scroll y la foto y el texto después
            (BandaMarmol). Letra turquesa oscuro, sin caja. */}
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
              <Reveal activo={visible} direction="right" distance={36} scaleFrom={0.94} duration={1} w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0}>
                <Box borderRadius="22px" overflow="hidden" boxShadow={`0 0 18px ${ORO}44, 0 0 40px ${ORO}22`} sx={{ aspectRatio: "1 / 1" }}>
                  <Image src={FOTO_MARIA} alt="María Escribano" w="100%" h="100%" objectFit="cover" objectPosition="center 18%" display="block" />
                </Box>
              </Reveal>
              <Reveal activo={visible} direction="left" distance={36} duration={1} delay={0.35} flex="1" minW={0}>
                <Text
                  color={TINTA}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                  lineHeight="1.75"
                  letterSpacing="0.01em"
                  textAlign={{ base: "center", md: "left" }}
                  // Respeta el salto de línea del texto.
                  whiteSpace="pre-line"
                >
                  {t("asesoria.intro")}
                </Text>
              </Reveal>
            </Flex>
          )}
        </BandaMarmol>

        <SeparadorFlor />

        {/* ── 2 · CUATRO CAJAS CON FOTO DETRÁS ── */}
        <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
          {/* La frase que las cuatro cajas completan. */}
          <Reveal inView amount={0.5} direction="up" distance={20} duration={0.8}>
            <Text
              textAlign="center"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.03em"
              lineHeight="1.25"
              mb={{ base: 8, md: 12 }}
            >
              {t("asesoria.logros.intro")}
            </Text>
          </Reveal>
          <Flex wrap="wrap" gap={{ base: 6, md: 10 }} sx={{ "& > *": { flex: "1 1 calc(50% - 20px)", minWidth: { base: "100%", md: "calc(50% - 20px)" } } }}>
            {CAJAS.map((c, i) => (
              <Box key={i}>
                <CajaFoto foto={c.foto} texto={t(c.texto)} i={i} />
              </Box>
            ))}
          </Flex>
        </Box>

        <SeparadorFlor />

        {/* ── 3 · ¿CÓMO TRABAJO? sobre el mármol ──
            Banda con los bordes desvanecidos (arriba y abajo), entre dos
            separaciones con el mandala. El mármol sale primero al hacer scroll;
            después entra el título y las dos cajas, una detrás de otra. */}
        <BandaMarmol>
          {(visible) => (
            <Box w="100%" maxW="1100px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
              <Reveal activo={visible} direction="up" distance={20} duration={0.8}>
                <Text
                  textAlign="center"
                  color={TINTA}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  letterSpacing="0.06em"
                  lineHeight="1.15"
                  mb={{ base: 8, md: 12 }}
                >
                  {t("asesoria.comoTrabajo")}
                </Text>
              </Reveal>
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 8 }}>
                {PASOS.map((p, i) => {
                  const B = 0.5 + i * 0.6;
                  return (
                    <Reveal key={p.titulo} activo={visible} direction="up" distance={40} scaleFrom={0.96} duration={1} delay={B} flex="1" display="flex">
                      <Flex
                        position="relative"
                        overflow="hidden"
                        flex="1"
                        direction="column"
                        justify="center"
                        gap={{ base: 2, md: 3 }}
                        px={{ base: 6, md: 8 }}
                        py={{ base: 7, md: 9 }}
                        borderRadius="2xl"
                        bg="transparent"
                        border={`1.5px solid ${TINTA}55`}
                        boxShadow={`0 0 16px ${ORO}22, 0 0 36px ${ORO}12`}
                      >
                        {/* Barra de luz dorada: crece de arriba abajo por el lado izquierdo. */}
                        <Box
                          position="absolute"
                          left={0}
                          top="14%"
                          bottom="14%"
                          w="3px"
                          borderRadius="full"
                          bgGradient="linear(to-b, #b08d3f00, #b08d3fcc, #b08d3f00)"
                          pointerEvents="none"
                          sx={{
                            transformOrigin: "center top",
                            transform: visible ? undefined : "scaleY(0)",
                            "@keyframes barraPaso": { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
                            animation: visible ? `barraPaso 0.9s cubic-bezier(0.22,1,0.36,1) ${B + 0.5}s both` : "none",
                            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                          }}
                        />
                        {/* Destello: una pasada de luz que cruza la caja al llegar. */}
                        <Box
                          position="absolute"
                          top={0}
                          bottom={0}
                          left={0}
                          w="38%"
                          pointerEvents="none"
                          bgGradient="linear(to-r, #ffffff00, #ffffff80, #ffffff00)"
                          sx={{
                            transform: "translateX(-130%) skewX(-18deg)",
                            opacity: 0,
                            "@keyframes destelloPaso": {
                              "0%": { transform: "translateX(-130%) skewX(-18deg)", opacity: 0 },
                              "15%": { opacity: 1 },
                              "100%": { transform: "translateX(330%) skewX(-18deg)", opacity: 0 },
                            },
                            animation: visible ? `destelloPaso 1.4s ease-out ${B + 0.7}s 1 both` : "none",
                            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                          }}
                        />
                        <Reveal activo={visible} direction="right" distance={22} duration={0.8} delay={B + 0.35}>
                          <Text color={TINTA} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.03em" lineHeight="1.2">
                            {t(p.titulo)}
                          </Text>
                        </Reveal>
                        {/* La rayita se dibuja de izquierda a derecha. */}
                        <Box
                          h="2px"
                          w={{ base: "64px", md: "90px" }}
                          borderRadius="full"
                          bgGradient={`linear(to-r, ${TINTA}cc, ${TINTA}00)`}
                          sx={{
                            transformOrigin: "left center",
                            transform: visible ? undefined : "scaleX(0)",
                            "@keyframes rayaPaso": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
                            animation: visible ? `rayaPaso 0.9s cubic-bezier(0.22,1,0.36,1) ${B + 0.75}s both` : "none",
                            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                          }}
                        />
                        <Reveal activo={visible} direction="up" distance={14} duration={0.8} delay={B + 0.7}>
                          <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" letterSpacing="0.01em">
                            {t(p.texto)}
                          </Text>
                        </Reveal>
                      </Flex>
                    </Reveal>
                  );
                })}
              </Flex>
            </Box>
          )}
        </BandaMarmol>

        <SeparadorFlor />

        {/* ── 3b · MAPA DE DISCIPLINAS (se despliegan al pulsar). Mientras María no pase
            los textos (mapaDisciplinasData.tsx) no se pinta; `?mapaDemo` lo enseña. ── */}
        <MapaDisciplinas />

        <SeparadorFlor />

        {/* ── 4 · FORMULARIO: lo último de la página; el pie va debajo, en segundo plano ── */}
        {/* El mármol sale PRIMERO al hacer scroll; después entran el título y el
            formulario. Los campos van enmarcados en turquesa oscuro. */}
        <BandaMarmol>
          {(visible) => (
            <Box w="100%" maxW="900px" mx="auto" px={{ base: 5, md: 10 }}>
              <Reveal activo={visible} direction="up" distance={20} duration={0.8}>
                <Text
                  textAlign="center"
                  color="#004f4f"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  letterSpacing="0.05em"
                  lineHeight="1.15"
                >
                  {t("asesoria.contacto.titulo")}
                </Text>
              </Reveal>
              <Reveal activo={visible} direction="up" distance={16} duration={0.8} delay={0.2}>
                <Text
                  textAlign="center"
                  color="#004f4f"
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                  fontSize={{ base: "lg", md: "2xl" }}
                  lineHeight="1.5"
                  mt={{ base: 2, md: 3 }}
                  mb={{ base: 8, md: 12 }}
                >
                  {t("asesoria.contacto.subtitulo")}
                </Text>
              </Reveal>
              <FormularioAsesoria marmol activo={visible} asunto={t("asesoria.titulo")} />
            </Box>
          )}
        </BandaMarmol>
      </Box>

      <SiteFooter />

      {/* Botón flotante «Contáctame», abajo a la derecha, como en la portada. */}
      <BotonContactame />
    </Box>
  );
};

export default Asesoria;
