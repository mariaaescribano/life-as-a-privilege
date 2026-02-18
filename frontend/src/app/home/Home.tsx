import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, VStack , Text, Image, Grid} from "@chakra-ui/react";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import PhotoMandala from "../../components/home/PhotoMandala";
import FeatureCard from "../../components/home/FeatureCard";
import BgImageCard from "../../components/home/BgImageCard";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt, ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt, biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt, cabalaBg, CabalaIcon, cabalaNom, cabalaTxt, fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt, nutricionBg, NutricionIcon, nutricionNom, nutricionTxt, tcmBg, TCMIcon, tcmNom, tcmTxt, turquesa } from "../../GlobalVariables";
import type { SessionStorageUser, User } from "../../dtos/user.types";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/global/Spinner";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionStorageUser | null>(null);

  useEffect(() => {
    if (user == null) {
      let userId = sessionStorage.getItem("userId");
      let img = sessionStorage.getItem("img");
      let name = sessionStorage.getItem("name");

      if(userId && img && name)
      { 
        let obj: SessionStorageUser = {
          userId: userId,
          name: name,
          img: img
        };
        setUser(obj);
      }
      else
      {
        navigate("/");
      }
    }
  }, [user]); 

  const aprendizajes = [
    // {
    //   title: fisiologiaNom,
    //   bgColor: fisiologiaBg,
    //   color: fisiologiaTxt,
    //   icon: <FisiologiaIcon size="60px"/>,
    //   description: "Explora los sistemas del cuerpo humano y su funcionamiento.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/fisiologia",
    //   linkEspacio: "/aprendizaje/videoLessonPage/fisiologia"
    // },
    {
      title: neuropsicologiaNom,
      bgColor: neuropsicologiaBg,
      color: neuropsicologiaTxt,
      icon: <NeuropsicologiaIcon size="60px"/>,
      description: "Aprende sobre el sistema nervioso y las funciones cognitivas.",
      linkAprendizaje: "/aprendizaje/modulosPage/" + neuropsicologiaNom,
      linkEspacio: "/espacio/questions/" + neuropsicologiaNom
    },
    // {
    //   title: astrologiaNom,
    //   bgColor: astrologiaBg,
    //   color: astrologiaTxt,
    //   icon: <AstrologiaIcon size="60px"/>,
    //   description: "Conoce los signos y su influencia en la personalidad.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/astrologia",
    //   linkEspacio: "/aprendizaje/videoLessonPage/astrologia"
    // },
    // {
    //   title: tcmNom,
    //   bgColor: tcmBg,
    //   color: tcmTxt,
    //   icon: <TCMIcon size="60px"/>,
    //   description: "Aprende sobre la medicina tradicional china y sus prácticas.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/tcm",
    //   linkEspacio: "/aprendizaje/videoLessonPage/tcm"
    // },
    // {
    //   title: nutricionNom,
    //   bgColor: nutricionBg,
    //   color: nutricionTxt,
    //   icon: <NutricionIcon size="60px"/>,
    //   description: "Descubre cómo la alimentación impacta en tu salud.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/nutricion",
    //   linkEspacio: "/aprendizaje/videoLessonPage/nutricion"
    // },
    // {
    //   title: ayurvedaNom,
    //   bgColor: ayurvedaBg,
    //   color: ayurvedaTxt,
    //   icon: <AyurvedaIcon size="60px"/>,
    //   description: "Explora la medicina tradicional ayurvédica.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/ayurveda",
    //   linkEspacio: "/aprendizaje/videoLessonPage/ayurveda"
    // },
    // {
    //   title: biologiaNom,
    //   bgColor: biologiaBg,
    //   color: biologiaTxt,
    //   icon: <BiologiaIcon size="60px"/>,
    //   description: "Conoce la biología humana y animal en profundidad.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/biologia",
    //   linkEspacio: "/aprendizaje/videoLessonPage/biologia"
    // },
    // {
    //   title: cabalaNom,
    //   bgColor: cabalaBg,
    //   color: cabalaTxt,
    //   icon: <CabalaIcon size="60px"/>,
    //   description: "Estudia la filosofía y enseñanzas de la Cábala.",
    //   linkAprendizaje: "/aprendizaje/modulosPage/cabala",
    //   linkEspacio: "/aprendizaje/videoLessonPage/cabala"
    // },
  ];

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header/>
        <Box flex="1">
          {user && <Grid
            templateRows="auto auto" // dos filas: la de arriba y la de abajo
            rowGap={{ base: 6, sm:10, md: 16 }}// control del espacio entre los grids
            w="100%" mb="50px"
          >
            
            <SimpleGrid
              columns={{ base: 1, sm:1, md: 3 }}
              spacing={8}
              w="100%"
              maxH={{ base: "auto", md: "500px" }}
              px={{ base: 4, md: 8 }}
              py={10}
              mb={{ base: "100px", sm: "20px", md:"20px" }}
            >
              <Box w="100%" display="flex" justifyContent="center">
                <PhotoMandala fotoCentro={user.img} />
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

            <SimpleGrid
              columns={{ base: 1, md: 1 }}
              spacing={8}
              mt={{ base: "-150px", md: "0px" }}
              w="100%" mb="50px"
              overflow={{ base: "visible", md: "hidden" }}
              px={{ base: 4, md: 8 }}
            >
              {aprendizajes.map((aprendizaje, i) => (
                <FeatureCard
                  key={i}
                  imagePosition="left"
                  bgColor={aprendizaje.bgColor}
                  color={aprendizaje.color}
                  title={aprendizaje.title}
                  icon={aprendizaje.icon}
                  description={aprendizaje.description}
                  linkAprendizaje={aprendizaje.linkAprendizaje}
                  linkEspacio={aprendizaje.linkEspacio} 
                  foto={" "}            
                />
              ))}
            </SimpleGrid>
          </Grid>}

          {!user && <Spinner />}
        </Box>
      <Footer />    
    </Box>
  );
};

export default Home;
