import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { astrologiaBg, AstrologiaIcon, ayurvedaBg, AyurvedaIcon, biologiaBg, BiologiaIcon, cabalaBg, CabalaIcon, fisiologiaBg, FisiologiaIcon, neuropsicologiaBg, NeuropsicologiaIcon, nutricionBg, NutricionIcon, tcmBg, TCMIcon } from "../../GlobalVariables";

const PhotoMandala = () => {
  const photos = [ 
    { bg: fisiologiaBg, icon: <FisiologiaIcon size="35px"/> },
    { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size="35px" /> } ,
    { bg: astrologiaBg, icon: <AstrologiaIcon size="35px" /> } ,
    { bg: tcmBg, icon: <TCMIcon size="35px" /> } ,
    { bg: nutricionBg, icon: <NutricionIcon size="35px" /> } ,
    { bg: ayurvedaBg, icon: <AyurvedaIcon size="35px" /> } ,
    { bg: biologiaBg, icon: <BiologiaIcon size="35px" /> },
    { bg: cabalaBg, icon: <CabalaIcon size="35px" /> } 
  ];

  const radius = { base: 100, sm: 120, md: 150, lg: 160, xl: 150 }; // radios más grandes para PC
  const angleStep = (2 * Math.PI) / photos.length;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
      p={4}
      display="flex"
      w="100%"
      justifyContent="center"
      h={{ base: "350px", sm: "420px", md: "500px", lg: "500px", xl: "500px" }} // alturas grandes
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
          boxShadow="xl"
          border="4px solid white"
          zIndex={10}
        >
          <Image alt="Centro" w="100%" h="100%" objectFit="cover" /> 
        </Box>

        {/* Alrededor */}
        {photos.map((photo, index) => {
          const angle = angleStep * index - Math.PI / 2;

          // Radio dinámico según breakpoint
          const r = radius.base; // base
          const rSm = radius.sm;
          const rMd = radius.md;
          const rLg = radius.lg;
          const rXl = radius.xl;

          // Aquí aplicamos breakpoints usando window.innerWidth o useBreakpointValue sería ideal
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
              w={{ base: "58px", sm: "64px", md: "66px", lg: "80px", xl: "96px" }}
              h={{ base: "58px", sm: "64px", md: "66px", lg: "80px", xl: "96px" }}
              borderRadius="full"
              overflow="hidden"
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
