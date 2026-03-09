import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import {
  AprendizajeIcon,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";

export const AprendizajeHome = () => {
  const items = [
    { title: fisiologiaNom,       bgColor: fisiologiaBg,      color: fisiologiaTxt,      icon: <FisiologiaIcon size="70px" />,                             link: "",                                           cursor: "not-allowed" },
    { title: neuropsicologiaNom,  bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "70px" }} />, link: "/aprendizaje/modulosPage/" + neuropsicologiaNom, cursor: "pointer"     },
    { title: astrologiaNom,       bgColor: astrologiaBg,      color: astrologiaTxt,      icon: <AstrologiaIcon size="70px" />,                             link: "/aprendizaje/modulosPage/" +astrologiaNom,    cursor: "pointer" },
    { title: tcmNom,              bgColor: tcmBg,             color: tcmTxt,             icon: <TCMIcon size={{ base: "60px", md: "70px" }} />,            link: "/aprendizaje/modulosPage/" + tcmNomLink, cursor: "pointer" },
    { title: nutricionNom,        bgColor: nutricionBg,       color: nutricionTxt,       icon: <NutricionIcon size="70px" />,                              link: "",                                           cursor: "not-allowed" },
    { title: ayurvedaNom,         bgColor: ayurvedaBg,        color: ayurvedaTxt,        icon: <AyurvedaIcon size="70px" />,                               link: "",                                           cursor: "not-allowed" },
    { title: fitoterapiaNom,      bgColor: fitoterapiaBg,        color: fitoterapiaTxt,  icon: <FitoterapiaIcon size={{ base: "60px", md: "70px" }} />,                   link: "/aprendizaje/modulosPage/" + fitoterapiaNom,  cursor: "pointer" },
    { title: cabalaNom,           bgColor: cabalaBg,          color: cabalaTxt,          icon: <CabalaIcon size="70px" />,                                 link: "/aprendizaje/modulosPage/" + cabalaNom,      cursor: "pointer"  },
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
          <SimpleGrid w="100%" columns={{ base: 2, md: 4 }} spacing={{ base: 6, md: 8 }}>
            {items.map((item, i) => (
              <ThemeCard
                key={i}
                title={item.title}
                bgColor={item.bgColor}
                color={item.color}
                icon={item.icon}
                link={item.link}
                cursor={item.cursor}
              />
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
      </Box>
    </Box>
  );
};
