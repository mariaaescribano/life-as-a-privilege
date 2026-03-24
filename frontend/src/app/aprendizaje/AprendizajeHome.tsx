import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import {
  AprendizajeIcon,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
  nutricionNomLink,
} from "../../GlobalVariables";

export const AprendizajeHome = () => {
  const items = [
    { title: fisiologiaNom,       bgColor: fisiologiaBg,      color: fisiologiaTxt,      icon: <FisiologiaIcon size={{ base: "60px", md: "70px" }}/>,     link:  "/aprendizaje/cursosModalidad/" + fisiologiaNom,  cursor: "pointer" },
    { title: neuropsicologiaNom,  bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "70px" }} />, link: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom, cursor: "pointer"},
    { title: astrologiaNom,       bgColor: astrologiaBg,      color: astrologiaTxt,      icon: <AstrologiaIcon size="70px" />,                             link: "/aprendizaje/cursosModalidad/" + astrologiaNom,    cursor: "pointer" },
    { title: tcmNom,              bgColor: tcmBg,             color: tcmTxt,             icon: <TCMIcon size={{ base: "60px", md: "70px" }} />,            link: "/aprendizaje/cursosModalidad/" + tcmNomLink, cursor: "pointer" },
    { title: nutricionNom,        bgColor: nutricionBg,       color: nutricionTxt,       icon: <NutricionIcon size={{ base: "60px", md: "70px" }}  />,   link: "/aprendizaje/cursosModalidad/" + nutricionNomLink, cursor: "pointer" },
    { title: ayurvedaNom,         bgColor: ayurvedaBg,        color: ayurvedaTxt,        icon: <AyurvedaIcon size={{ base: "60px", md: "70px" }}  />,      link: "/aprendizaje/cursosModalidad/" + ayurvedaNomLink,  cursor: "pointer" },
    { title: fitoterapiaNom,      bgColor: fitoterapiaBg,     color: fitoterapiaTxt,  icon: <FitoterapiaIcon size={{ base: "60px", md: "70px" }} />,   link: "/aprendizaje/cursosModalidad/" + fitoterapiaNom,  cursor: "pointer" },
    { title: cabalaNom,           bgColor: cabalaBg,          color: cabalaTxt,          icon: <CabalaIcon size="70px" />,                                 link: "/aprendizaje/cursosModalidad/" + cabalaNom,      cursor: "pointer"  },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="private" />

      {/* ── MAIN ── */}
      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          {/* Título */}
          <Flex align="center" gap={3} mb={{ base: 8, md: 10 }}>
            <AprendizajeIcon color="rgba(255,255,255,0.9)" size="47px" />
            <Text
              color="white"
              fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
              fontWeight="700"
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
              letterSpacing="0.05em"
              textShadow="0 2px 10px rgba(0,100,90,0.4)"
            >
              Aprendizajes
            </Text>
          </Flex>

          {/* Tarjetas directas — sin card contenedor */}
          <SimpleGrid
            w="100%"
            columns={{ base: 2, md: 4 }}
            spacing={{ base: 6, md: 8 }}
            sx={{
              "@keyframes cardFadeUp": {
                from: { opacity: 0, transform: "translateY(32px) scale(0.96)" },
                to:   { opacity: 1, transform: "translateY(0)   scale(1)"    },
              },
            }}
          >
            {items.map((item, i) => (
              <Box
                key={i}
                style={{
                  opacity: 0,
                  animation: `cardFadeUp 0.52s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s forwards`,
                }}
              >
                <ThemeCard
                  title={item.title}
                  bgColor={item.bgColor}
                  color={item.color}
                  icon={item.icon}
                  link={item.link}
                  cursor={item.cursor}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};
