
import { Box, Image } from "@chakra-ui/react";
import React, { useState } from "react";
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

type CirclePhoto = {
  name: string;
  bg: string;
  txt: string;
  icon: React.ReactNode;
  link: string;
};

// Subcomponente para cada círculo — así cada uno tiene su propio estado `entered`
// y puede separar la transición de entrada (lenta) de la de hover (rápida).
const MandalaCircle = ({
  photo, index, x, y, circleSize, isAvailable, onNavigate,
}: {
  photo: CirclePhoto;
  index: number;
  x: number;
  y: number;
  circleSize: string;
  isAvailable: boolean;
  onNavigate: () => void;
}) => {
  const [entered, setEntered] = useState(false);

  return (
    <MotionBox
      position="absolute"
      cursor={isAvailable ? "pointer" : "not-allowed"}
      w={circleSize}
      h={circleSize}
      borderRadius="full"
      overflow="hidden"
      onClick={isAvailable ? onNavigate : undefined}
      boxShadow="0 4px 16px rgba(0,0,0,0.28), 0 0 20px rgba(107,196,200,0.5), 0 0 45px rgba(107,196,200,0.2)"
      border={`5px solid ${photo.txt}`}
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ scale: 1, opacity: isAvailable ? 1 : 0.5, x, y }}
      // Tras la entrada (entered=true) la transition se vuelve rápida,
      // por eso el return del hover también es instantáneo.
      transition={entered
        ? { duration: 0.15 }
        : { duration: 0.7, delay: index * 0.06 }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={isAvailable ? { scale: 1.22 } : {}}
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
};

const PhotoMandala = (props: { fotoCentro?: string }) => {
  const navigate = useNavigate();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const size    = isMobile ? 280 : 460;
  const radius  = isMobile ? 150 : 170;
  const circleSize = isMobile ? "78px" : "96px";

  const photos: CirclePhoto[] = [
    { name: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      icon: <FisiologiaIcon      size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + fisiologiaNom },
    { name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={isMobile ? { base: "46px", md: "46px" } : { base: "38px", md: "38px" }} />, link: "/espacio/questions/" + neuropsicologiaNom },
    { name: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      icon: <AstrologiaIcon      size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + astrologiaNom },
    { name: tcmNom,             bg: tcmBg,             txt: tcmTxt,             icon: <TCMIcon             size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + tcmNom },
    { name: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       icon: <NutricionIcon       size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + nutricionNom },
    { name: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        icon: <AyurvedaIcon        size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + ayurvedaNom },
    { name: biologiaNom,        bg: biologiaBg,        txt: biologiaTxt,        icon: <BiologiaIcon        size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + biologiaNom },
    { name: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          icon: <CabalaIcon          size={isMobile ? "46px" : "38px"} />,                                    link: "/espacio/questions/" + cabalaNom },
  ];

  const angleStep = (2 * Math.PI) / photos.length;

  return (
    <Box
      bg="transparent"
      borderRadius="2xl"
      p={6}
      w="100%"
      h="500px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
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
          boxShadow="0 8px 32px rgba(0,0,0,0.35), 0 0 28px rgba(107,196,200,0.55), 0 0 60px rgba(107,196,200,0.25)"
          border="4px solid rgba(255,255,255,0.75)"
          zIndex={10}
          cursor="pointer"
          onClick={() => navigate("/espacio/espacioHome")}
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
          const isAvailable = photo.name === neuropsicologiaNom;

          return (
            <MandalaCircle
              key={index}
              photo={photo}
              index={index}
              x={x}
              y={y}
              circleSize={circleSize}
              isAvailable={isAvailable}
              onNavigate={() => navigate(photo.link)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default PhotoMandala;
