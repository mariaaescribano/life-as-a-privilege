
import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt
} from "../../GlobalVariables";

const MotionBox = motion(Box);

const PhotoMandala = (props:{fotoCentro?:string}) => {

  const navigate = useNavigate();

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const size = isMobile ? 280 : 460;
  const radius = isMobile ? 150 : 170;

  const photos = [
    { bg: fisiologiaBg, txt: fisiologiaTxt, icon: <FisiologiaIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/"+ fisiologiaNom },
    { bg: neuropsicologiaBg, txt: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={isMobile ? {base:"46px", md:"46px"} : {base:"38px", md:"38px"}} />, link: "/espacio/questions/" + neuropsicologiaNom },
    { bg: astrologiaBg, txt: astrologiaTxt, icon: <AstrologiaIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + astrologiaNom },
    { bg: tcmBg, txt: tcmTxt, icon: <TCMIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + tcmNom },
    { bg: nutricionBg, txt: nutricionTxt, icon: <NutricionIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + nutricionNom },
    { bg: ayurvedaBg, txt: ayurvedaTxt, icon: <AyurvedaIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + ayurvedaNom },
    { bg: biologiaBg, txt: biologiaTxt, icon: <BiologiaIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + biologiaNom },
    { bg: cabalaBg, txt: cabalaTxt, icon: <CabalaIcon size={isMobile ? "46px" : "38px"} />, link: "/espacio/questions/" + cabalaNom }
  ];

  const angleStep = (2 * Math.PI) / photos.length;

  return (
    <Box
      bg="transparent"
      borderRadius="2xl"
      p={6}
      w="100%"
      h={isMobile ? "500px" : "500px"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >

      {/* Mandala Container */}
      <Box
        position="relative"
        w={`${size}px`}
        h={`${size}px`}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >

        {/* Centro */}
        <MotionBox
          position="absolute"
          w={isMobile ? "150px" : "180px"}
          h={isMobile ? "150px" : "180px"}
          borderRadius="full"
          overflow="hidden"
          boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 45px rgba(107,196,200,1), 0 0 90px rgba(107,196,200,0.55), 0 0 140px rgba(107,196,200,0.25)"
          border="4px solid rgba(255,255,255,0.85)"
          zIndex={10}
          cursor="pointer"
          onClick={()=> navigate("/espacio/espacioHome")}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src={props.fotoCentro ?? "/img/noImg.png"}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </MotionBox>

        {/* Círculos del mandala */}
        {photos.map((photo, index) => {

          const angle = angleStep * index - Math.PI / 2;

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <MotionBox
              key={index}
              position="absolute"
              cursor="pointer"
              w={isMobile ? "78px" : "96px"}
              h={isMobile ? "78px" : "96px"}
              borderRadius="full"
              overflow="hidden"
              onClick={()=> navigate(photo.link)}
              boxShadow="0 4px 20px rgba(0,0,0,0.35), 0 0 32px rgba(107,196,200,0.95), 0 0 65px rgba(107,196,200,0.5), 0 0 100px rgba(107,196,200,0.2)"
              border={`5px solid ${photo.txt}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x,
                y
              }}
              whileHover={{ scale: 1.22 }}
              transition={{
                duration: 0.7,
                delay: index * 0.06
              }}
            >
              <Box
                w="100%"
                h="100%"
                bg={photo.bg}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {photo.icon}
              </Box>
            </MotionBox>
          );
        })}
      </Box>
    </Box>
  );
};

export default PhotoMandala;
