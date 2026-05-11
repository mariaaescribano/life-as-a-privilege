import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import {
  AprendizajeIcon,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
  nutricionNomLink,
} from "../../GlobalVariables";

export const AprendizajeHome = () => {
  // Orden del Método: Astrología → Psicología → Hinduismo → TCM →
  // Fisiología → Nutrición → Cultura → Cábala
  const items = [
    { title: astrologiaNom,       bgColor: astrologiaBg,      color: astrologiaTxt,      icon: <AstrologiaIcon size="70px" />,                             link: "/aprendizaje/cursosModalidad/" + astrologiaNom,    cursor: "pointer" },
    { title: neuropsicologiaNom,  bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "70px" }} />, link: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom, cursor: "pointer"},
    { title: ayurvedaNom,         bgColor: ayurvedaBg,        color: ayurvedaTxt,        icon: <AyurvedaIcon size={{ base: "60px", md: "70px" }}  />,      link: "/aprendizaje/cursosModalidad/" + ayurvedaNomLink,  cursor: "pointer" },
    { title: tcmNom,              bgColor: tcmBg,             color: tcmTxt,             icon: <TCMIcon size={{ base: "60px", md: "70px" }} />,            link: "/aprendizaje/cursosModalidad/" + tcmNomLink, cursor: "pointer" },
    { title: fisiologiaNom,       bgColor: fisiologiaBg,      color: fisiologiaTxt,      icon: <FisiologiaIcon size={{ base: "60px", md: "70px" }}/>,     link:  "/aprendizaje/cursosModalidad/" + fisiologiaNom,  cursor: "pointer" },
    { title: nutricionNom,        bgColor: nutricionBg,       color: nutricionTxt,       icon: <NutricionIcon size={{ base: "60px", md: "70px" }}  />,   link: "/aprendizaje/cursosModalidad/" + nutricionNomLink, cursor: "pointer" },
    { title: culturaNom,           bgColor: culturaBg,         color: culturaTxt,      icon: <CulturaIcon size={{ base: "60px", md: "70px" }} />,       link: "/aprendizaje/cursosModalidad/" + culturaNom,      cursor: "pointer" },
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
          <Box
            bg="rgba(255,255,255,0.22)"
            border="1px solid rgba(255,255,255,0.45)"
            sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
            borderRadius="2xl"
            boxShadow="0 8px 36px rgba(107,196,200,0.45)"
            px={{ base: 6, md: 10 }}
            py={{ base: 5, md: 7 }}
            w="100%"
            maxW="850px"
            mb={{ base: 10, md: 12 }}
          >
            <Flex direction="row" align="center" justify="center" gap={5}>
              <Box
                borderRadius="full"
                bg="rgba(255,255,255,0.18)"
                border="5px solid rgba(255,255,255,0.7)"
                boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 55px rgba(107,196,200,0.25)"
                w={{ base: "60px", md: "72px" }}
                h={{ base: "60px", md: "72px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                overflow="hidden"
                p="6px"
              >
                <AprendizajeIcon color="white" size="44px" shadow={false} />
              </Box>
              <Text
                color="white"
                fontSize={{ base: "2xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
                lineHeight="1.15"
              >
                Cursos
              </Text>
            </Flex>
          </Box>

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
