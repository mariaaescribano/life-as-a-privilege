
import { Box, Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt
} from "../../GlobalVariables";

const MotionBox = motion(Box);

type CirclePhoto = {
  name: string;
  available:boolean;
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
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="4px"
      onClick={isAvailable ? onNavigate : undefined}
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1, x, y }}
      transition={entered
        ? { duration: 0.15 }
        : { duration: 0.7, delay: index * 0.06 }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={isAvailable ? { scale: 1.22 } : {}}
    >
      {/* Círculo */}
    <Box
      w={circleSize}
      h={circleSize}
      borderRadius="full"
      overflow="hidden"
      border={`3px solid ${photo.txt}`}
      boxShadow={`
        0 0 20px ${photo.txt}bb,
        0 2px 14px ${photo.txt}97
      `}
    >
      <Box
        w="100%"
        h="100%"
        bg={photo.bg}
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow={`
          0 0 20px ${photo.txt}bb,
          0 2px 14px ${photo.txt}77
        `}
      >
        {photo.icon}
      </Box>
    </Box>

      {/* Nombre del módulo */}
      {/* <Text
        color={photo.txt}
        fontSize="xs"
        fontWeight="700"
        textAlign="center"
        textShadow="0 2px 8px rgba(0,0,0,0.5)"
        letterSpacing="0.03em"
        lineHeight="1.2"
        maxW={circleSize}
        noOfLines={2}
      >
        {photo.name}
      </Text> */}
    </MotionBox>
  );
};

const PhotoMandala = (props: { fotoCentro?: string }) => {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Breakpoints responsive
  const isXs  = windowWidth < 380;
  const isSm  = windowWidth < 480;
  const isMd  = windowWidth < 768;

  const size        = isXs ? 220 : isSm ? 260 : isMd ? 290 : 460;
  const radius      = isXs ?  96 : isSm ? 116 : isMd ? 134 : 170;
  const circleSize  = isXs ? "58px" : isSm ? "64px" : isMd ? "72px" : "96px";
  const centerSize  = isXs ? "110px" : isSm ? "120px" : isMd ? "135px" : "180px";
  const containerH  = isXs ? "360px" : isSm ? "410px" : isMd ? "450px" : "500px";
  const iconSize    = isXs ? "34px"  : isSm ? "42px"  : isMd ? "48px"  : "48px";

  const photos: CirclePhoto[] = [
    { name: fisiologiaNom,    available:false,  bg: fisiologiaBg,      txt: fisiologiaTxt,      icon: <FisiologiaIcon      size={iconSize} />,                                    link: "/espacio/questions/" + fisiologiaNom },
    { name: neuropsicologiaNom, available:true,  bg: neuropsicologiaBg, txt: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: iconSize, md: iconSize }} />,            link: "/espacio/questions/" + neuropsicologiaNom },
    { name: astrologiaNom,  available:true,     bg: astrologiaBg,      txt: astrologiaTxt,      icon: <AstrologiaIcon      size={iconSize} />,                                    link: "/espacio/questions/" + astrologiaNom },
    { name: tcmNom,  available:true, bg: tcmBg,  txt: tcmTxt,             icon: <TCMIcon             size={{ base: iconSize, md: iconSize }} />,   link: "/espacio/questions/" + tcmNomLink },
    { name: nutricionNom,  available:false,      bg: nutricionBg,       txt: nutricionTxt,       icon: <NutricionIcon       size={{ base: iconSize, md: iconSize }}  />,                                    link: "/espacio/questions/" + nutricionNom },
    { name: ayurvedaNom,  available:false,       bg: ayurvedaBg,        txt: ayurvedaTxt,        icon: <AyurvedaIcon        size={iconSize} />,                                    link: "/espacio/questions/" + ayurvedaNom },
    { name: fitoterapiaNom,  available:true,    bg: fitoterapiaBg,        txt: fitoterapiaTxt,        icon: <FitoterapiaIcon        size={{ base: iconSize, md: iconSize }} />,  link: "/espacio/questions/" + fitoterapiaNom },
    { name: cabalaNom,     available:true,      bg: cabalaBg,          txt: cabalaTxt,          icon: <CabalaIcon          size={iconSize} />,                                    link: "/espacio/questions/" + cabalaNom },
  ];

  const angleStep = (2 * Math.PI) / photos.length;

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      p={6}
      w="100%"
      h={containerH}
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
        {/* Life.png de fondo del mandala */}
        <Box
          position="absolute"
          w="100%"
          h="100%"
          backgroundImage="url('/img/icono/life.png')"
          backgroundSize="90%"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          opacity={0.13}
          zIndex={0}
          pointerEvents="none"
        />

        {/* Centro */}
        <MotionBox
          position="absolute"
          w={centerSize}
          h={centerSize}
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
            src={props.fotoCentro ?? "/img/icono/noImg.png"}
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
          const isAvailable = photo.available === true;

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
