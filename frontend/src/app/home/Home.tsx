import React from "react";
import { Box, Container, Flex, SimpleGrid, VStack , Text, Image, Grid} from "@chakra-ui/react";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import PhotoMandala from "../../components/home/PhotoMandala";
import FeatureCard from "../../components/home/FeatureCard";
import BgImageCard from "../../components/home/BgImageCard";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt } from "../../GlobalVariables";

const Home = () => {

  return (
     <Box>
      <Header textRight={""} textLeft={""} linkRight={"/signIn"} linkLeft={"/logIn"} />
      
      <Grid
        templateRows="auto auto" // dos filas: la de arriba y la de abajo
        rowGap={{ base: 6, md: 16 }}// control del espacio entre los grids
        w="100%"
      >
        
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={8}
          w="100%"
          maxH={{ base: "auto", md: "500px" }}
          px={{ base: 4, md: 8 }}
          py={10}
          mb={{ base: "100px", sm: "20px" }}
        >
          <Box w={{ sd:"80%", md: "100%" }} display="flex" justifyContent="center">
            <PhotoMandala />
          </Box>

          <Box w="100%" display="flex" justifyContent="center">
            <BgImageCard
              h="500px"
              w="100%"
              backgroundImage="../public/img/flor.png"
              children={
                <>
                  <Text color="black" fontWeight="bold" fontSize={{ base: "3xl", md: "5xl" }} textAlign="center">
                    Bienvenido
                  </Text>
                  <Text color="black" fontSize={{ base: "md", md: "xl" }} textAlign="center">
                    Este es tu espacio para aprender e integrar distintas modalidades en las que serás capaz de identificar tus bloqueos y tus trampas.
                  </Text>
                  <Text color="black" fontSize={{ base: "md", md: "xl" }} textAlign="center">
                    Recuerda tratarte con paciencia y con Amor, este camino no es fácil pero merece la pena.
                  </Text>
                </>
              }
            />
          </Box>

          <Box w="100%" display="flex" justifyContent="center">
            <Card
              w="100%"
              h="500px"
              children={
                <VStack>
                  <Box w={{ base: "80%", md: "80%" }} borderRadius="xl" overflow="hidden">
                    <Box aspectRatio={1} w="100%">
                      <Image
                        alt="Imagen"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                      />
                    </Box>
                  </Box>
                  <Text color="black" fontWeight="bold" fontSize={{ base: "md", md: "xl" }} textAlign="center" mb="20px">
                    ¿Quieres que te acompañe?
                  </Text>
                  <BtnTurquesa text={"Saber más"} onClick={undefined} />
                </VStack>
              }
            />
          </Box>
        </SimpleGrid>

        {/* Grid inferior: FeatureCard */}
        <SimpleGrid
          columns={{ base: 1, md: 1 }}
          spacing={8}
          mt={{ base: "-150px", md: "0px" }}
          w="100%"
          overflow={{ base: "visible", md: "hidden" }}
          px={{ base: 4, md: 8 }}
        >
          <FeatureCard imagePosition={"left"} bgColor={neuropsicologiaBg} foto={""} 
          color={neuropsicologiaTxt} title={"Neuropsicología"} icon={NeuropsicologiaIcon} description={"deeefefw"} />

          <FeatureCard imagePosition={"left"} bgColor={neuropsicologiaBg} foto={""} 
          color={neuropsicologiaTxt} title={"Neuropsicología"} icon={NeuropsicologiaIcon} description={"deeefefw"} />
          
          <FeatureCard imagePosition={"left"} bgColor={neuropsicologiaBg} foto={""} 
          color={neuropsicologiaTxt} title={"Neuropsicología"} icon={NeuropsicologiaIcon} description={"deeefefw"} />

        </SimpleGrid>
      </Grid>

      <Footer></Footer>    
    </Box>
  );
};

export default Home;
