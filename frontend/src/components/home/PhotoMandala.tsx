import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, ayurvedaBg, AyurvedaIcon, ayurvedaNom, biologiaBg, BiologiaIcon, biologiaNom, cabalaBg, CabalaIcon, cabalaNom, fisiologiaBg, FisiologiaIcon, fisiologiaNom, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, nutricionBg, NutricionIcon, nutricionNom, tcmBg, TCMIcon, tcmNom } from "../../GlobalVariables";
import { useNavigate } from "react-router-dom";

const PhotoMandala = (props:{fotoCentro?:string}) => {
  const navigate = useNavigate();
  const photos = [ 
    { bg: fisiologiaBg, icon: <FisiologiaIcon size="35px"/>, link: "/espacio/questions/"+ fisiologiaNom, cursor: "not-allowed" },
    { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size={{base:"30px", md:"35px"}} />, link: "/espacio/questions/" + neuropsicologiaNom, cursor: "pointer" } ,
    { bg: astrologiaBg, icon: <AstrologiaIcon size="35px" />, link: "/espacio/questions/" + astrologiaNom, cursor: "not-allowed" } ,
    { bg: tcmBg, icon: <TCMIcon size="35px" />, link: "/espacio/questions/" + tcmNom, cursor: "not-allowed" } ,
    { bg: nutricionBg, icon: <NutricionIcon size="35px" />, link: "/espacio/questions/" + nutricionNom, cursor: "not-allowed"} ,
    { bg: ayurvedaBg, icon: <AyurvedaIcon size="35px" />, link: "/espacio/questions/" + ayurvedaNom, cursor: "not-allowed"} ,
    { bg: biologiaBg, icon: <BiologiaIcon size="35px" />, link: "/espacio/questions/" + biologiaNom, cursor: "not-allowed"},
    { bg: cabalaBg, icon: <CabalaIcon size="35px" />, link: "/espacio/questions/" + cabalaNom, cursor: "not-allowed" } 
  ];

  const radius = { base: 100, sm: 120, md: 150, lg: 160, xl: 150 }; // radios más grandes para PC
  const angleStep = (2 * Math.PI) / photos.length;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
      p={4}
      position="relative"  
      display="flex"
      w="100%"
      justifyContent="center"
      h={{ base: "350px", sm: "400px", md: "500px", lg: "500px", xl: "500px" }} // alturas grandes
    >
      <Box
        position="relative"
        w={{ base: "250px", sm: "320px", md: "400px", lg: "500px", xl: "500px" }}
        h={{ base: "250px", sm: "320px", md: "400px", lg: "500px", xl: "500px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Centro */}
        <Box
          position="absolute"
          w={{ base: "120px", md: "128px", lg: "150px", xl: "180px" }}
          h={{ base: "120px", md: "128px", lg: "150px", xl: "180px" }}
          borderRadius="full"
          overflow="hidden"
          cursor="pointer"
          boxShadow="xl"
          border="4px solid white"
          zIndex={10}
          transition="transform 0.3s"
          onClick={()=> navigate("/espacio/espacioHome")}
        >
          <Image src={props.fotoCentro ?? "/img/noImg.png"} alt="Centro" w="100%" h="100%" objectFit="cover" /> 
        </Box>

        {photos.map((photo, index) => {
          const angle = angleStep * index - Math.PI / 2;

          const r = radius.base; // base
          const rSm = radius.sm;
          const rMd = radius.md;
          const rLg = radius.lg;
          const rXl = radius.xl;

          let rFinal = r;
          if (typeof window !== "undefined") {
            const width = window.innerWidth;
            if (width >= 1280) rFinal = rXl;       // xl
            else if (width >= 1024) rFinal = rLg;  // lg
            else if (width >= 768) rFinal = rMd;   // md
            else if (width >= 480) rFinal = rSm;   // sm
          }

          const x = Math.cos(angle) * rFinal;
          const y = Math.sin(angle) * rFinal;

          return (
            <Box
              key={index}
              position="absolute"
              cursor={photo.cursor}
              w={{ base: "58px", sm: "64px", md: "66px", lg: "80px", xl: "96px" }}
              h={{ base: "58px", sm: "64px", md: "66px", lg: "80px", xl: "96px" }}
              borderRadius="full"
              overflow="hidden"
              onClick={()=> navigate(photo.link)}
              boxShadow="lg"
              border="4px solid white"
              transform={`translate(${x}px, ${y}px)`}
              transition="transform 0.3s"
              _hover={{ transform: `translate(${x}px, ${y}px) scale(1.1)` }}
            >
              <Box
                w="100%"
                h="100%"
                bg={photo.bg}
                justifyContent="center"
                display="flex"
                alignItems="center"
              >
                {photo.icon}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};


export default PhotoMandala;
