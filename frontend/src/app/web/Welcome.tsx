import {
  Box,
  Flex,
  Image,
  VStack,
  Heading,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import { Header } from "../../components/global/Header";
import BadgeText from "../../components/welcome/BadgeText";
import Footer from "../../components/global/Footer";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt, ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt, biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt, cabalaBg, CabalaIcon, cabalaNom, cabalaTxt, fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt, nutricionBg, NutricionIcon, nutricionNom, nutricionTxt, tcmBg, TCMIcon, tcmNom, tcmTxt, turquesa } from "../../GlobalVariables";
import Card from "../../components/global/Card";
import { useNavigate } from "react-router-dom";
import BtnTurquesa from "../../components/global/BtnTurquesa";

const Welcome = () => {
    
    const navigate = useNavigate();
    
    return (
        <Box
            minH="100vh"
            display="flex"
            flexDirection="column"
        >
            <Header textRight={"Registrarse"} textLeft={"Iniciar sesión"} linkRight={"/signIn"} linkLeft={"/logIn"} linkHeader={"/"} />
            
            <Box
                flex="1"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                position="relative"
                mb="100px"
            >
                <Flex
                    align="center"
                    justify="center"
                    px={2}
                >
                    {/* BOX PRINCIPAL CON SOMBRA */}
                    <Card maxW="1500px">
                        {/* CONTENIDO PRINCIPAL */}
                        <Flex
                        direction={{ base: "column", md: "row" }}
                        gap={8}
                        justify="center"
                        >

                        {/* COLUMNA IZQUIERDA */}
                        <Flex flex="1" direction="column" gap={4} align={{ base: "center", md: "flex-start" }}>
                            {/* Imagen */}
                            <Box w={{ base: "80%", md: "100%" }}>
                            <Image
                                src="../public/img/life.png"
                                alt="Imagen"
                                borderRadius="xl"
                                objectFit="cover"
                                w="100%"
                            />
                            </Box>

                            {/* VStack */}
                            <Flex flex="1" justify="center" w="100%">
                                <VStack spacing={3} align="center">
                                    <Heading size="md">Cambia tu Vida integrando...</Heading>
                                    <Grid
                                        p={{ base: "10px", md: "10px" }}
                                        mb="20px"
                                        templateColumns="repeat(2, 1fr)" 
                                        gap="20px"
                                        maxW="800px"
                                    >
                                        <BadgeText text={fisiologiaNom} color={fisiologiaTxt} colorFondo={fisiologiaBg} icon={<FisiologiaIcon />} />
                                        <BadgeText text={neuropsicologiaNom} color={neuropsicologiaTxt} colorFondo={neuropsicologiaBg} icon={<NeuropsicologiaIcon />} />
                                        <BadgeText text={astrologiaNom} color={astrologiaTxt} colorFondo={astrologiaBg} icon={<AstrologiaIcon />} />
                                        <BadgeText text={tcmNom} color={tcmTxt} colorFondo={tcmBg} icon={<TCMIcon />} />
                                        <BadgeText text={nutricionNom} color={nutricionTxt} colorFondo={nutricionBg} icon={<NutricionIcon />} />
                                        <BadgeText text={ayurvedaNom} color={ayurvedaTxt} colorFondo={ayurvedaBg} icon={<AyurvedaIcon />} />
                                        <BadgeText text={biologiaNom} color={biologiaTxt} colorFondo={biologiaBg} icon={<BiologiaIcon />} />
                                        <BadgeText text={cabalaNom} color={cabalaTxt} colorFondo={cabalaBg} icon={<CabalaIcon />} />
                                    </Grid>
                                </VStack>
                            </Flex>
                        </Flex>

                        {/* COLUMNA DERECHA */}
                        <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                            <Image
                            src="../public/img/me.jpg"
                            alt="Imagen"
                            borderRadius="xl"
                            objectFit="cover"
                            h="100%"
                            w={{ base: "100%", md: "100%" }}
                            />
                        </Box>
                        </Flex>
                    </Card>
                </Flex>

                <Flex justify="center" mt={8}>
                    <BtnTurquesa text={"Entrar"} onClick={() => {window.scrollTo({ top: 0, behavior: 'auto' }); navigate("/logIn")}} />
                </Flex>
            </Box>

            <Footer mt="100px" />
        </Box>
    );
};

export default Welcome;
