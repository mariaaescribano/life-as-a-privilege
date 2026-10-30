import {
  Box, Flex, Image, Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import Certificaciones from "../../components/web/Certificaciones";
import { GlifoSigno } from "../../components/metodo/Glifo";
import { focoBlanco } from "../../components/global/foco";
import { Link } from "react-router-dom";
import { useT, type ClaveTexto } from "../../i18n";

const heartbeat = keyframes`
  0%   { transform: scale(1); }
  14%  { transform: scale(1.28); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.18); }
  60%  { transform: scale(1); }
  100% { transform: scale(1); }
`;

const useReveal = (threshold = 0.15) => {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return { ref: setEl, visible };
};

const ORO = "#b08d3f";

/** Las tres fotos de «Mi propósito» (las de la web) y su frase. */
const PROPOSITO: { foto: string; texto: ClaveTexto; posicion?: string }[] = [
  { foto: "/img/me/leyendocontraje.webp", texto: "quienSoy.proposito.1" },
  { foto: "/img/me/contrajenegro.webp", texto: "quienSoy.proposito.2" },
  { foto: "/img/me/trajegrisconmapa.webp", texto: "quienSoy.proposito.3" },
];

const TINTA = "#004f4f";

const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";


const QuienSoy = () => {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const cierreReveal = useReveal(0.2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);


  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      <Box flex="1">
      {/* ── MANDALA + «MARÍA ESCRIBANO» + FRASE (la misma cabecera de la portada) ── */}
      <WelcomeCabecera activo={mounted} titulo="María Escribano" subtitulo={t("quienSoy.subtitulo")} mayusculas />



      {/* ── 2 · PRESENTACIÓN, SOBRE EL MÁRMOL: foto a la izquierda, mi texto a la derecha ──
          El mármol sale primero al hacer scroll y la foto y el texto después.
          Letra turquesa oscuro, sin caja. */}
      <BandaMarmol mt={{ base: 2, md: 4 }}>
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
              {/* Doble marco: la foto con su borde y, por fuera, un filo fino turquesa oscuro desplazado. */}
              <Box position="relative">
                <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${TINTA}66`} pointerEvents="none" />
                <Box borderRadius="22px" overflow="hidden" border={`1.5px solid ${TINTA}`} boxShadow={`0 0 18px ${ORO}44, 0 0 40px ${ORO}22`}>
                  <Image src="/img/me/fotoclasica.webp" alt="María Escribano" w="100%" h="auto" display="block" />
                </Box>
              </Box>
            </Reveal>

            <Flex direction="column" flex="1" minW={0} gap={{ base: 5, md: 6 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              <Reveal activo={visible} direction="left" distance={36} duration={1} delay={0.35}>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontFamily="'EB Garamond', serif" lineHeight="1.75" letterSpacing="0.01em">
                  {t("creadora.bio")}
                  <Box as="span" display="block" mt={{ base: 3, md: 4 }}>{t("creadora.bio2")}</Box>
                </Text>
              </Reveal>
              <Reveal activo={visible} direction="left" distance={36} duration={1} delay={0.6}>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontFamily="'EB Garamond', serif" lineHeight="1.75" letterSpacing="0.01em">
                  {t("quienSoy.mision")}
                </Text>
              </Reveal>
              {/* Botón Contactar */}
              <Reveal activo={visible} direction="up" distance={14} duration={0.9} delay={0.85}>
                <Flex
                  as={Link}
                  to="/contacto"
                  align="center"
                  color={TINTA}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  px={{ base: 8, md: 10 }}
                  py="12px"
                  borderRadius="full"
                  border={`1.5px solid ${TINTA}`}
                  bg="transparent"
                  transition="background 0.3s ease"
                  _hover={{ bg: `${TINTA}14`, textDecoration: "none" }}
                  _focusVisible={focoBlanco}
                  textDecoration="none"
                >
                  {t("contacto.titulo")}
                </Flex>
              </Reveal>
            </Flex>
          </Flex>
        )}
      </BandaMarmol>

      {/* ── SEPARACIÓN ── */}
      <SeparadorFlor />

      {/* ── 3 · MI PROPÓSITO, sobre el turquesa, sin mármol: tres fotos mías, cada una con su frase ──
          Las tres cajas entran una tras otra al asomar. */}
      <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
            <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6, md: 7 }}>
              {PROPOSITO.map((p, i) => (
                <Reveal key={p.texto} inView amount={0.2} direction="up" distance={36} scaleFrom={0.95} duration={1} delay={0.2 + i * 0.35} flex="1" minW={0}>
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="2xl"
                    boxShadow="0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09)"
                    sx={{ aspectRatio: "3 / 4" }}
                  >
                    <Image src={p.foto} alt="" aria-hidden="true" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" objectPosition={p.posicion ?? "center"} />
                    {/* La frase, en un cristal esmerilado abajo: es el cristal el que
                        desenfoca la foto que tiene detrás, la foto va nítida. */}
                    <Box
                      position="absolute"
                      left={{ base: 3, md: 4 }}
                      right={{ base: 3, md: 4 }}
                      bottom={{ base: 3, md: 4 }}
                      borderRadius="xl"
                      px={{ base: 4, md: 5 }}
                      py={{ base: 4, md: 5 }}
                      bg="rgba(255,255,255,0.14)"
                      border="1px solid rgba(255,255,255,0.3)"
                      sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                    >
                      <Text
                        color="white"
                        fontFamily="'EB Garamond', serif"
                        fontWeight="700"
                        fontSize={{ base: "lg", md: "xl" }}
                        lineHeight="1.35"
                        textAlign="center"
                        textShadow="0 0 12px rgba(0,0,0,0.45), 0 0 24px rgba(0,0,0,0.25)"
                      >
                        {t(p.texto)}
                      </Text>
                    </Box>
                  </Box>
                </Reveal>
              ))}
            </Flex>
      </Box>

      {/* ── SEPARACIÓN ── */}
      <SeparadorFlor />

      {/* ── DIPLOMAS ── */}
      <Certificaciones />

      {/* ── SEPARACIÓN ── */}
      <SeparadorFlor />

      {/* ── DONACIÓN + TESTIMONIO, SOBRE EL MÁRMOL ──
          Dos cajas en la misma fila (en móvil, una bajo la otra), del mismo
          alto. Sin sombra ni filo: se definen por el halo, como el resto de
          cajas de la casa. */}
      <BandaMarmol>
        {(visible) => (
      <Flex
        direction={{ base: "column", md: "row" }}
        align="stretch"
        justify="center"
        gap={{ base: 6, md: 8 }}
        maxW="1100px"
        w="100%"
        mx="auto"
        px={{ base: 5, md: 10, lg: 16 }}
      >
        {/* ── DONACIÓN ── */}
        <Flex
                    flex="1"
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          gap={{ base: 5, md: 6 }}
          px={{ base: 6, md: 8 }}
          py={{ base: 9, md: 12 }}
          borderRadius="3xl"
          bg="transparent"
          border={`1.5px solid ${TINTA}55`}
          boxShadow={`0 0 16px ${ORO}22, 0 0 36px ${ORO}12`}
        >
          <Box
            w={{ base: "62px", md: "72px" }}
            h={{ base: "62px", md: "72px" }}
            borderRadius="full"
            bg="transparent"
            border={`1.5px solid ${TINTA}77`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 0 18px ${ORO}44, 0 0 38px ${ORO}22`}
            sx={{ animation: `${heartbeat} 1.6s ease-in-out infinite` }}
            opacity={visible ? 1 : 0}
            transform={visible ? "scale(1)" : "scale(0.8)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={{ base: "30px", md: "36px" }} w={{ base: "30px", md: "36px" }} viewBox="0 -960 960 960" fill={TINTA}>
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
            </Box>
          </Box>

          <Text
            color={TINTA}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.75s ease 0.25s, transform 0.75s ease 0.25s"
          >
            {t("quienSoy.apoya")}
          </Text>

          <Box
            as="a"
            href={DONATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            display="inline-flex"
            alignItems="center"
            gap={3}
            px={{ base: 8, md: 9 }}
            py={{ base: "12px", md: "14px" }}
            borderRadius="full"
            border={`1.5px solid ${TINTA}`}
            color={TINTA}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            bg="transparent"
            letterSpacing="0.18em"
            textTransform="uppercase"
            cursor="pointer"
            textDecoration="none"
            
            _hover={{ bg: `${TINTA}14` }}
            _focusVisible={focoBlanco}
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
          >
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" h="18px" w="18px" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
            </Box>
            {t("quienSoy.donar")}
          </Box>

          <Text
            color={TINTA}
            fontSize="xs"
            letterSpacing="0.06em"
            fontStyle="italic"
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.75s ease 0.7s, transform 0.75s ease 0.7s"
          >
            {t("quienSoy.pagoSeguro")}
          </Text>
        </Flex>

        {/* ── TESTIMONIO ── */}
        <Flex
                    flex="1"
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          gap={{ base: 5, md: 6 }}
          px={{ base: 6, md: 8 }}
          py={{ base: 9, md: 12 }}
          borderRadius="3xl"
          bg="transparent"
          border={`1.5px solid ${TINTA}55`}
          boxShadow={`0 0 16px ${ORO}22, 0 0 36px ${ORO}12`}
        >
          <Text
            color={TINTA}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.6"
            letterSpacing="0.02em"
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
          >
            {t("quienSoy.testimonio")}
          </Text>

          <Flex
            direction="column"
            align="center"
            gap={1}
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(14px)"}
            transition="opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s"
          >
            <Text
              color={TINTA}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              Drea Burbank
            </Text>
            <Text
              color={TINTA}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "xs", md: "sm" }}
              letterSpacing="0.04em"
            >
              {t("quienSoy.testimonioCargo")}
            </Text>
          </Flex>

          <Flex
            as="a"
            href="https://www.linkedin.com/in/mar%C3%ADa-escribano-arce-b58a56385/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            align="center"
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            border={`1px solid ${TINTA}77`}
            bg="transparent"
            color={TINTA}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.05em"
            textDecoration="none"
            opacity={visible ? 1 : 0}
            transform={visible ? "translateY(0)" : "translateY(14px)"}
            transition="opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease"
            _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}
            _focusVisible={focoBlanco}
          >
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="14px" h="14px" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </Box>
            {t("quienSoy.linkedin")}
          </Flex>
        </Flex>
      </Flex>
        )}
      </BandaMarmol>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" mb="10px" pt={{ base: 16, md: 20 }}>
        {/* <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
       */}
      </Flex>

      {/* ── CIERRE ── */}
      <Flex
        ref={cierreReveal.ref}
        justify="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 18, md: 22 }}
        pb={{ base: 16, md: 20 }}
      >
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="600"
          letterSpacing="0.08em"
          fontStyle="italic"
          textAlign="center"
          textShadow="0 0 14px rgba(255,255,255,0.45), 0 0 30px rgba(255,255,255,0.22), 0 0 60px rgba(180,255,245,0.19)"
          opacity={cierreReveal.visible ? 1 : 0}
          transform={cierreReveal.visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)"}
          transition="opacity 0.9s ease, transform 0.9s ease"
        >
          {/* El glifo acompaña a la frase, así que va a la altura de la letra:
              el tamaño se fija desde aquí (el `size` del componente se queda
              corto) para que crezca con el breakpoint igual que el texto. */}
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            verticalAlign="-6px"
            mr={{ base: 2.5, md: 3 }}
            sx={{
              "& svg": {
                width: { base: "34px", md: "50px" },
                height: { base: "34px", md: "50px" },
              },
            }}
          >
            <GlifoSigno nombre="Géminis" color="currentColor" size={22} glow={false} />
          </Box>
          {t("quienSoy.cierre")}
        </Text>
      </Flex>
      </Box>


      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default QuienSoy;
