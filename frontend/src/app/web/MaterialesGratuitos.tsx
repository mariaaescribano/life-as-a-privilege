import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LibrosIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { Float } from "../../components/global/Reveal";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";

const TINTA = "#004f4f";
const ORO = "#b08d3f";

/** La foto de la derecha: ocupa el alto de las cuatro cajas. Vacía = las cajas, centradas. */
const FOTO_AUDIOLIBROS = "/img/me/leyendocontraje.webp";

type Cajita = {
  titulo: string;
  delay: number;
  link: string;
  renderIcon: () => React.ReactNode;
};

export default function MaterialesGratuitos() {
  const t = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Orden: Ilustraciones · Cursos · Libros.
  const cajitas: Cajita[] = [
    // ── «Vídeos» comentado a petición: se oculta el box y su página (la ruta
    // /aprendizaje/todosVideos queda comentada en App.tsx). Se conserva por si
    // se quiere restaurar en el futuro.
    // {
    //   titulo: "Vídeos",
    //   delay: 0.15,
    //   link: "/aprendizaje/todosVideos",
    //   renderIcon: () => (
    //     <Box
    //       as="svg"
    //       xmlns="http://www.w3.org/2000/svg"
    //       viewBox="0 -960 960 960"
    //       width="52px"
    //       height="52px"
    //       fill="white"
    //     >
    //       <path d="M320-200v-560l440 280-440 280Z" />
    //     </Box>
    //   ),
    // },
    {
      titulo: t("materiales.ilustraciones"),
      delay: 0.15,
      link: "/ilustraciones",
      renderIcon: () => (
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={TINTA}>
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
        </Box>
      ),
    },
    {
      titulo: t("header.cursos"),
      delay: 0.3,
      link: "/aprendizaje/aprendizajeHome",
      renderIcon: () => (
        // La flor de la casa teñida de turquesa oscuro con una máscara.
        <Box
          aria-hidden="true"
          w="54px"
          h="54px"
          sx={{
            backgroundColor: TINTA,
            WebkitMaskImage: "url('/img/icono/life.webp')",
            maskImage: "url('/img/icono/life.webp')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ),
    },
    {
      titulo: t("materiales.libros"),
      delay: 0.45,
      link: "/libros",
      renderIcon: () => <LibrosIcon color={TINTA} size="52px" shadow={false} />,
    },
    {
      // Audiolibros: la sección está por hacer, el enlace queda preparado.
      titulo: t("materiales.audiolibros"),
      delay: 0.6,
      link: "/audiolibros",
      renderIcon: () => (
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="52px" height="52px" fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16v-3a8 8 0 0 1 16 0v3" />
          <rect x="3" y="14" width="4" height="6" rx="1.4" />
          <rect x="17" y="14" width="4" height="6" rx="1.4" />
        </Box>
      ),
    },
    // ── «Programas» comentado: la sección se aparca. Lo que ofrecía —una
    // charla con diapositivas y su podcast— ya cabe en un curso (una lección
    // «video» es un enlace de YouTube pegado tal cual), y de 43 programas del
    // índice solo 7 llegaron a publicarse. Se conserva entero, igual que
    // «Vídeos», por si se quiere restaurar: aquí y las rutas de App.tsx.
    // {
    // // Programas: la diapositiva y su podcast. Icono = el atril con la
    // // presentación y el play al lado: lo que se mira y lo que se escucha.
    // titulo: t("materiales.programas"),
    // delay: 0.6,
    // link: "/programas",
    // renderIcon: () => (
    // <Box
    // as="svg"
    // xmlns="http://www.w3.org/2000/svg"
    // viewBox="0 -960 960 960"
    // width="52px"
    // height="52px"
    // fill="white"
    // >
    // <path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62Zm178.5 581.5Q480-197 480-280t58.5-141.5Q597-480 680-480t141.5 58.5Q880-363 880-280t-58.5 141.5Q763-80 680-80t-141.5-58.5ZM630-180l160-100-160-100v200Zm-430 20v-480 480Z" />
    // </Box>
    // ),
    // },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA + TÍTULO + FRASE (la misma cabecera de la portada) ── */}
      <WelcomeCabecera activo={mounted} titulo={t("header.materiales")} subtitulo={t("materiales.subtitulo")} mayusculas />

      {/* ── LAS CUATRO CAJAS, sobre el mármol, de dos en dos; a la derecha, una foto ── */}
      <Box flex="1">
        <BandaMarmol mt={{ base: 2, md: 4 }} pt={{ base: "104px", md: "140px" }} pb={{ base: "116px", md: "150px" }}>
          {(visible) => (
            <Flex
              w="100%"
              maxW="1100px"
              mx="auto"
              px={{ base: 5, md: 10, lg: 16 }}
              direction={{ base: "column", lg: "row" }}
              align={{ base: "center", lg: "stretch" }}
              justify="center"
              gap={{ base: 8, lg: 14 }}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }} w="100%" maxW={{ base: "420px", md: "640px" }} flex={FOTO_AUDIOLIBROS ? 1 : undefined}>
                {cajitas.map((c, i) => (
                  <Reveal key={c.link} activo={visible} direction="up" distance={30} scaleFrom={0.96} duration={0.9} delay={c.delay} h="100%" display="flex">
                    <Flex
                      as="a"
                      href={c.link}
                      // Cada recurso se abre en una PESTAÑA NUEVA: Materiales se queda donde está
                      // y la persona no se pierde entre páginas.
                      target="_blank"
                      rel="noopener noreferrer"
                      textDecoration="none"
                      direction="column"
                      align="center"
                      justify="center"
                      flex="1"
                      w="100%"
                      gap={{ base: 3, md: 4 }}
                      bg="transparent"
                      border={`1.5px solid ${TINTA}55`}
                      borderRadius="2xl"
                      px={{ base: 5, md: 6 }}
                      py={{ base: 7, md: 9 }}
                      minH={{ base: "170px", md: "210px" }}
                      boxShadow={`0 0 16px ${ORO}22, 0 0 36px ${ORO}12`}
                      cursor="pointer"
                      transition="background 0.25s ease, border-color 0.25s ease, transform 0.28s ease"
                      _hover={{ bg: `${TINTA}12`, borderColor: `${TINTA}aa`, transform: "translateY(-5px)", textDecoration: "none" }}
                      _focusVisible={focoBlanco}
                    >
                      <Float amplitude={5} duration={5 + i * 0.6} delay={i * 0.5}>
                        <Flex w={{ base: "72px", md: "84px" }} h={{ base: "72px", md: "84px" }} borderRadius="full" border={`1px solid ${TINTA}66`} align="center" justify="center">
                          {c.renderIcon()}
                        </Flex>
                      </Float>
                      <Box w="40px" h="1px" bg={`linear-gradient(to right, transparent, ${TINTA}, transparent)`} />
                      <Text color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "xl" }} letterSpacing="0.16em" textTransform="uppercase" textAlign="center" lineHeight="1.2">
                        {c.titulo}
                      </Text>
                    </Flex>
                  </Reveal>
                ))}
              </SimpleGrid>

              {FOTO_AUDIOLIBROS && (
                <Reveal activo={visible} direction="left" distance={36} scaleFrom={0.94} duration={1} delay={0.4} w={{ base: "260px", md: "320px", lg: "340px" }} h={{ base: "auto", lg: "auto" }} flexShrink={0} display="flex">
                  {/* En escritorio la foto ocupa EXACTAMENTE el alto de las cuatro cajas (se recorta con
                      encuadre); en móvil, debajo, con su proporción. */}
                  <Box position="relative" w="100%" borderRadius="22px" overflow="hidden" boxShadow={`0 0 18px ${ORO}44, 0 0 40px ${ORO}22`}>
                    <Image
                      src={FOTO_AUDIOLIBROS}
                      alt=""
                      display="block"
                      w="100%"
                      h={{ base: "auto", lg: "100%" }}
                      position={{ base: "static", lg: "absolute" }}
                      inset={{ lg: 0 }}
                      objectFit="cover"
                      objectPosition="center 25%"
                    />
                  </Box>
                </Reveal>
              )}
            </Flex>
          )}
        </BandaMarmol>
      </Box>

      <SiteFooter />
    </Box>
  );
}
