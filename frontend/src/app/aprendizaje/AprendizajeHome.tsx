import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import {
  AprendizajeIcon, EspacioPersonalIcon,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";

export const AprendizajeHome = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState<string | null>(null);

  const items = [
    { title: fisiologiaNom,       bgColor: fisiologiaBg,      color: fisiologiaTxt,      icon: <FisiologiaIcon size="70px" />,                             link: "",                                           cursor: "not-allowed" },
    { title: neuropsicologiaNom,  bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "70px" }} />, link: "/aprendizaje/modulosPage/" + neuropsicologiaNom, cursor: "pointer"     },
    { title: astrologiaNom,       bgColor: astrologiaBg,      color: astrologiaTxt,      icon: <AstrologiaIcon size="70px" />,                             link: "",                                           cursor: "not-allowed" },
    { title: tcmNom,              bgColor: tcmBg,             color: tcmTxt,             icon: <TCMIcon size="70px" />,                                    link: "",                                           cursor: "not-allowed" },
    { title: nutricionNom,        bgColor: nutricionBg,       color: nutricionTxt,       icon: <NutricionIcon size="70px" />,                              link: "",                                           cursor: "not-allowed" },
    { title: ayurvedaNom,         bgColor: ayurvedaBg,        color: ayurvedaTxt,        icon: <AyurvedaIcon size="70px" />,                               link: "",                                           cursor: "not-allowed" },
    { title: biologiaNom,         bgColor: biologiaBg,        color: biologiaTxt,        icon: <BiologiaIcon size="70px" />,                               link: "",                                           cursor: "not-allowed" },
    { title: cabalaNom,           bgColor: cabalaBg,          color: cabalaTxt,          icon: <CabalaIcon size="70px" />,                                 link: "",                                           cursor: "not-allowed" },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setImg(sessionStorage.getItem("img"));
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 5, md: 12 }}
        py={{ base: 3, md: 4 }}
        bg="#008080"
        position="sticky"
        top="0"
        zIndex="100"
        borderBottom="1px solid rgba(255,255,255,0.12)"
      >
        <Image
          src="/img/life.png"
          h={{ base: "56px", md: "70px" }}
          objectFit="contain"
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        />

        <Flex align="center" gap={{ base: 4, md: 6 }}>
          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/espacio/espacioHome")}
            color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
          >
            <EspacioPersonalIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
            <Text display={{ base: "none", md: "block" }} fontSize={{ base: "sm", md: "md" }} fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
              Mi Espacio
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/aprendizaje/aprendizajeHome")}
            color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
          >
            <AprendizajeIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
            <Text display={{ base: "none", md: "block" }} fontSize={{ base: "sm", md: "md" }} fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
              Aprendizajes
            </Text>
          </Flex>

          {img && (
            <Box
              w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }}
              borderRadius="full" overflow="hidden"
              border="2px solid rgba(255,255,255,0.55)" flexShrink={0}
              cursor="pointer" onClick={() => navigate("/espacio/espacioHome")}
              _hover={{ border: "2px solid white" }} transition="border 0.2s"
            >
              <Image src={img} w="100%" h="100%" objectFit="cover" />
            </Box>
          )}
        </Flex>
      </Flex>

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
            <AprendizajeIcon color="rgba(255,255,255,0.9)" size="34px" />
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700"
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
      </Box>
    </Box>
  );
};
