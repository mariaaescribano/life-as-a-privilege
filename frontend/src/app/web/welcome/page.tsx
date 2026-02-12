import {
  Box,
  Flex,
  Image,
  VStack,
  Text,
  Heading,
  Button,
  Badge,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import { Header } from "../../../components/global/Header";
import BadgeText from "../../../components/global/BadgeText";
import Footer from "../../../components/global/Footer";
import { astrologiaBg, astrologiaTxt, fisiologiaBg, fisiologiaTxt, neuropsicologiaBg, neuropsicologiaTxt, nutricionBg, nutricionTxt, tcmBg, tcmTxt, turquesa } from "../../../Global";

const MainSection = () => {
  return (
    <Box>
        <Header></Header>
        
        <Flex
            align="center"
            justify="center"
            px={4}
            >
            {/* BOX PRINCIPAL CON SOMBRA */}
            <Box
                w={{ base: "100%", md: "90%", lg: "800px" }}
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="xl"
            >
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
                            <Heading size="md">Conviértete en tu propia autoridad integrando...</Heading>
                            <Grid
                                p={{ base: "10px", md: "10px" }}
                                mb="20px"
                                templateColumns="repeat(2, 1fr)" // 2 badges per row
                                gap="20px"
                                maxW="400px"
                            >
                                <BadgeText text={"Fisiología"} color={"#34106d"} colorFondo={"#e6d7ff"} />
                                <BadgeText text={"Neuropsicología"} color={neuropsicologiaTxt} colorFondo={neuropsicologiaBg} />
                                <BadgeText text={"Astrología"} color={astrologiaTxt} colorFondo={astrologiaBg} />
                                <BadgeText text={"Medicina China"} color={tcmTxt} colorFondo={tcmBg} />
                                <BadgeText text={"Nutrición"} color={nutricionTxt} colorFondo={nutricionBg} />
                                <BadgeText text={"Ayúrveda"} color={"#cb8e59"} colorFondo={"#593d25"} />
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
                    w={{ base: "80%", md: "100%" }}
                    />
                </Box>
                </Flex>
            </Box>
        </Flex>

        <Flex justify="center" mt={8}>
            <Button
                size="lg"
                px={10}
                minW="200px"
                maxW="300px"
                bg={turquesa}
                borderRadius="20px"
            >
                Empezar
            </Button>
        </Flex>

       <Footer />
     </Box>
  );
};

export default MainSection;
