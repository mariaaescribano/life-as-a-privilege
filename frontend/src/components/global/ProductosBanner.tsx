import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const FlowerIcon = ({ size = "28px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="rgba(255,255,255,0.92)">
    <path d="M480-200q0-100-70-170t-170-70q0 100 70 170t170 70Zm44-220q18-18 18-44v-6q8 6 16.5 9t19.5 3q26 0 44-18t18-44q0-20-9.5-35T604-576q17-6 26.5-21t9.5-35q0-26-18-44t-44-18q-11 0-19.5 3t-16.5 9v-6q0-26-18-44t-44-18q-26 0-44 18t-18 44v6q-8-6-16.5-9t-19.5-3q-26 0-44 18t-18 44q0 20 9.5 35t26.5 21q-17 6-26.5 21t-9.5 35q0 26 18 44t44 18q11 0 19.5-3t16.5-9v6q0 26 18 44t44 18q26 0 44-18Zm-88-111.5Q418-549 418-576q0-26 18-44t44-18q26 0 44 18t18 44q0 27-18 44.5T480-514q-26 0-44-17.5ZM480-200q100 0 170-70t70-170q-100 0-170 70t-70 170ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/>
  </svg>
);

interface ProductosBannerProps {
  maxW?: string | object;
  w?: string | object;
}

const ProductosBanner = ({ maxW = "900px", w = "100%" }: ProductosBannerProps) => {
  const navigate = useNavigate();

  return (
    <Box
      w={w}
      maxW={maxW}
      bg="rgba(255,255,255,0.13)"
      border="1px solid rgba(255,255,255,0.35)"
      sx={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      borderRadius="2xl"
      boxShadow="0 8px 40px rgba(107,196,200,0.4)"
      overflow="hidden"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      minH={{ base: "auto", md: "200px" }}
    >
      {/* ── Imagen jabones (izquierda) ── */}
      <Box
        flexShrink={0}
        w={{ base: "100%", md: "280px" }}
        h={{ base: "200px", md: "auto" }}
        position="relative"
        overflow="hidden"
      >
        <Image
          src="/img/jabones.png"
          alt="Productos naturales"
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
        />
        {/* Degradado derecho para fusionar con el contenido */}
        <Box
          position="absolute"
          bottom={{ base: "0", md: "unset" }}
          top={{ base: "unset", md: "0" }}
          right="0"
          w={{ base: "100%", md: "80px" }}
          h={{ base: "60px", md: "100%" }}
          bgGradient={{
            base: "linear(to-b, transparent, rgba(0,128,128,0.55))",
            md: "linear(to-l, rgba(0,128,128,0.55), transparent)",
          }}
          pointerEvents="none"
        />
      </Box>

      {/* ── Contenido derecho ── */}
      <Box
        flex="1"
        px={{ base: 7, md: 10 }}
        py={{ base: 8, md: 10 }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap={4}
      >
        {/* Título con icono */}
        <Flex align="center" gap={3}>
          <FlowerIcon size="26px" />
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.06em"
            textShadow="0 2px 12px rgba(0,90,80,0.5)"
            lineHeight="1.1"
          >
            Productos Naturales
          </Text>
        </Flex>

        {/* Descripción */}
        <Text
          color="rgba(255,255,255,0.82)"
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.85"
          letterSpacing="0.02em"
        >
          Descubre todos los productos hechos con ingredientes naturales y Amor.
          Cuídate con las herramientas que nos ha dado la madre tierra.
        </Text>

        {/* Botón */}
        <Flex justify="flex-end" mt={1}>
          <Box
            as="button"
            onClick={() => navigate("/productos")}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.08em"
            px={7}
            py="9px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.55)"
            bg="rgba(255,255,255,0.1)"
            cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.22)", borderColor: "white" }}
            transition="all 0.22s"
          >
            Ver más →
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductosBanner;
