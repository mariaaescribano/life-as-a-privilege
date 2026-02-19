import React, { useEffect, useState } from "react";
import {
  Box,
  VStack
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

import ThemeSection from "../../components/espacio/ThemeSection";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import Title from "../../components/global/Title";
import type { Bloque, ThemeTitleObject, } from "../../dtos/espacio.type";

import { preguntasNeuroPsicologia } from "../../hardCoded/espacio/PreguntasNeuroPsicologia";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";


const ThemePreguntas = () => {

  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [theme, settheme] = useState<ThemeTitleObject>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const getThemeData = () =>
  {
    if(themeId == neuropsicologiaNom)
    {
      settheme({
        title: neuropsicologiaNom,
        icon: <NeuropsicologiaIcon size={{base:"40px", md:"60px"}} />,
        color: neuropsicologiaTxt,
        bgColor:neuropsicologiaBg
      });
      return preguntasNeuroPsicologia;
    }
  }

  useEffect(() => {
    if (!themeId) return;

    const data = getThemeData();
    if(data)
    {
      setBloques(data);
    }

  }, [themeId]);



  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header dondeEstoy="espacio" />
       <Box flex="1">
          {theme && 
          <>
            <Title
              icon={theme.icon}
              title={theme.title}
              color={theme.color}
            /> 

            <Box
              p={{ base: 4, md: 8 }}
              display="flex"
              mb="100px"
              alignItems={"center"}
              justifyContent="center" 
            >
              <Box w="100%" maxW="850px">
                <VStack spacing={8}>
                  {bloques.map((bloque, index) => (
                    <ThemeSection
                      key={index+"preg"}
                      title={bloque.title}
                      icon={bloque.icon}
                      subPreguntas={bloque.subPreguntas} 
                      color={theme.color} bgColor={theme.bgColor}                
                    />
                  ))}
                </VStack>
              </Box>
            </Box>
          </>}
        </Box>
      <Footer />
    </Box>
  );
};

export default ThemePreguntas;
