import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import { LibrosIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";

const TINTA = "#004f4f";

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
    // ── «Audiolibros» comentado: la caja sobra (la sección está por hacer). Se conserva por si vuelve.
    // {
    //   // Audiolibros: la sección está por hacer, el enlace queda preparado.
    //   titulo: t("materiales.audiolibros"),
    //   delay: 0.6,
    //   link: "/audiolibros",
    //   renderIcon: () => (
    //     <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="52px" height="52px" fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    //       <path d="M4 16v-3a8 8 0 0 1 16 0v3" />
    //       <rect x="3" y="14" width="4" height="6" rx="1.4" />
    //       <rect x="17" y="14" width="4" height="6" rx="1.4" />
    //     </Box>
    //   ),
    // },
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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA + TÍTULO + FRASE (la misma cabecera de la portada) ── */}
      <WelcomeCabecera activo={mounted} titulo={t("header.materiales")} subtitulo={t("materiales.subtitulo")} mayusculas sinSeparador />

      {/* ── LAS CAJAS, en horizontal (en una fila en escritorio), sobre el beige de la página ── */}
      <TrasCabecera flex="1">
        <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: cajitas.length }} gap={{ base: 5, md: 6 }} justifyItems="center">
            {cajitas.map((c, i) => (
              <Reveal key={c.link} inView direction="up" distance={30} scaleFrom={0.96} duration={0.9} delay={(i % 4) * 0.12} w="100%" maxW={{ base: "420px", md: "none" }} h="100%" display="flex">
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
                  cursor="pointer"
                  transition="background 0.25s ease, border-color 0.25s ease, transform 0.28s ease"
                  _hover={{ bg: `${TINTA}12`, borderColor: `${TINTA}aa`, transform: "translateY(-5px)", textDecoration: "none" }}
                  _focusVisible={focoBlanco}
                >
                  <Flex w={{ base: "72px", md: "84px" }} h={{ base: "72px", md: "84px" }} borderRadius="full" border={`1px solid ${TINTA}66`} align="center" justify="center">
                    {c.renderIcon()}
                  </Flex>
                  <Box w="40px" h="1px" bg={`linear-gradient(to right, transparent, ${TINTA}, transparent)`} />
                  <Text color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg", lg: "md", xl: "lg" }} letterSpacing="0.14em" textTransform="uppercase" textAlign="center" lineHeight="1.2">
                    {c.titulo}
                  </Text>
                </Flex>
              </Reveal>
            ))}
          </SimpleGrid>
        </Box>
        {/* Hueco entre las cajas y el pie. */}
        <Box h={{ base: "56px", md: "88px" }} />
      </TrasCabecera>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
}
