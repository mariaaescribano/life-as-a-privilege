import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import { AprendizajeIcon, astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt, ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt, biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt, cabalaBg, CabalaIcon, cabalaNom, cabalaTxt, fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt, nutricionBg, NutricionIcon, nutricionNom, nutricionTxt, tcmBg, TCMIcon, tcmNom, tcmTxt, turquesa } from "../../GlobalVariables";

export const AprendizajeHome = () => {
  const items = [
    { 
      title: fisiologiaNom, 
      bgColor: fisiologiaBg, 
      color: fisiologiaTxt, 
      icon: <FisiologiaIcon size="70px" />, 
      link: "" 
    },
    { 
      title: neuropsicologiaNom, 
      bgColor: neuropsicologiaBg, 
      color: neuropsicologiaTxt, 
      icon: <NeuropsicologiaIcon size="70px" />, 
      link: ""  
    },
    { 
      title: astrologiaNom, 
      bgColor: astrologiaBg, 
      color: astrologiaTxt, 
      icon: <AstrologiaIcon size="70px" />, 
      link: ""  
    },
    { 
      title: tcmNom, 
      bgColor: tcmBg, 
      color: tcmTxt, 
      icon: <TCMIcon size="70px" />, 
      link: ""  
    },
    { 
      title: nutricionNom, 
      bgColor: nutricionBg, 
      color: nutricionTxt, 
      icon: <NutricionIcon size="70px" />, 
      link: ""  
    },
    { 
      title: ayurvedaNom, 
      bgColor: ayurvedaBg, 
      color: ayurvedaTxt, 
      icon: <AyurvedaIcon size="70px" />, 
      link: ""  
    },
    { 
      title: biologiaNom, 
      bgColor: biologiaBg, 
      color: biologiaTxt, 
      icon: <BiologiaIcon size="70px" />, 
      link: ""  
    },
    { 
      title: cabalaNom, 
      bgColor: cabalaBg, 
      color: cabalaTxt, 
      icon: <CabalaIcon size="70px" />, 
      link: ""  
    },
  ];


  return (
    <Box>
      <Header></Header>

      <Flex
        align="center"
        justify="center"
        gap={3}
        mb={10}
      >
        {/* Icono */}
        <AprendizajeIcon color="black" size="60px" />

        {/* Título */}
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="800"
          color="gray.900"
          letterSpacing="-0.02em"
          textShadow="0 2px 8px rgba(0,0,0,0.15)"
        >
          Aprendizajes
        </Text>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={6}
        p="30px"
      >
        {items.map((item, i) => (
          <ThemeCard key={i} title={item.title} bgColor={item.bgColor} 
          color={item.color} icon={item.icon} link={item.link} />
        ))}
      </SimpleGrid>

      <Footer></Footer>
    </Box>
  );
};
