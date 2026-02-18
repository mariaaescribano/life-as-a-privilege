import { Box, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, ayurvedaBg, AyurvedaIcon, ayurvedaNom, biologiaBg, BiologiaIcon, biologiaNom, cabalaBg, CabalaIcon, cabalaNom, EspacioPersonalIcon, fisiologiaBg, FisiologiaIcon, fisiologiaNom, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, nutricionBg, NutricionIcon, nutricionNom, tcmBg, TCMIcon, tcmNom } from "../../GlobalVariables";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import Title from "../../components/global/Title";
import { useNavigate } from "react-router-dom";

const Mandala = () => {
    const navigate = useNavigate();
    const photos = [ 
        { bg: fisiologiaBg, icon: <FisiologiaIcon size="35px"/>, link: "/espacio/questions/"+ fisiologiaNom },
        { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size="35px" />, link: "/espacio/questions/" + neuropsicologiaNom } ,
        { bg: astrologiaBg, icon: <AstrologiaIcon size="35px" />, link: "/espacio/questions/" + astrologiaNom } ,
        { bg: tcmBg, icon: <TCMIcon size="35px" />, link: "/espacio/questions/" + tcmNom } ,
        { bg: nutricionBg, icon: <NutricionIcon size="35px" />, link: "/espacio/questions/" + nutricionNom} ,
        { bg: ayurvedaBg, icon: <AyurvedaIcon size="35px" />, link: "/espacio/questions/" + ayurvedaNom} ,
        { bg: biologiaBg, icon: <BiologiaIcon size="35px" />, link: "/espacio/questions/" + biologiaNom},
        { bg: cabalaBg, icon: <CabalaIcon size="35px" />, link: "/espacio/questions/" + cabalaNom } 
    ];

  const angleStep = (2 * Math.PI) / photos.length;

  const radius = useBreakpointValue({
    base: 120,
    sm: 150,
    md: 200,
    lg: 250,
    xl: 280
  });

  const containerSize = useBreakpointValue({
    base: "320px",
    sm: "400px",
    md: "520px",
    lg: "650px",
    xl: "750px"
  });

  const centerSize = useBreakpointValue({
    base: "140px",
    md: "180px",
    lg: "220px",
    xl: "260px"
  });

  return (
    <Box>
        <Header />
    
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="relative"
            mb="100px"
        >

            <Title icon={<EspacioPersonalIcon color="black" size="60px" />} title={"Mi Espacio"} />
        
            <Box
                position="relative"
                w={containerSize}
                h={containerSize}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {/* Centro */}
                <Box
                    position="absolute"
                    w={centerSize}
                    h={centerSize}
                    borderRadius="full"
                    overflow="hidden"
                    boxShadow="2xl"
                    border="6px solid white"
                    zIndex={10}
                >
                    <Image alt="Centro" w="100%" h="100%" objectFit="cover" />
                    </Box>

                    {/* Elementos alrededor */}
                    {photos.map((photo, index) => {
                    const angle = angleStep * index - Math.PI / 2;
                    const x = Math.cos(angle) * (radius ?? 150);
                    const y = Math.sin(angle) * (radius ?? 150);

                    return (
                        <Box
                            key={index}
                            cursor="pointer"
                            position="absolute"
                            w={{ base: "70px", md: "90px", lg: "110px" }}
                            h={{ base: "70px", md: "90px", lg: "110px" }}
                            borderRadius="full"
                            overflow="hidden"
                            boxShadow="xl"
                            onClick={()=> navigate(photo.link)}
                            border="5px solid white"
                            transform={`translate(${x}px, ${y}px)`}
                            transition="all 0.3s ease"
                            _hover={{
                                transform: `translate(${x}px, ${y}px) scale(1.15)`
                            }}
                        >
                            <Box
                                w="100%"
                                h="100%"
                                bg={photo.bg}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {photo.icon}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>

        <Footer />
    </Box>
  );
};

export default Mandala;
