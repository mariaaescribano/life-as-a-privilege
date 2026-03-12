import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const FlowerIcon = ({ size = "28px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="#008080">
    <path d="M480-200q0-100-70-170t-170-70q0 100 70 170t170 70Zm44-220q18-18 18-44v-6q8 6 16.5 9t19.5 3q26 0 44-18t18-44q0-20-9.5-35T604-576q17-6 26.5-21t9.5-35q0-26-18-44t-44-18q-11 0-19.5 3t-16.5 9v-6q0-26-18-44t-44-18q-26 0-44 18t-18 44v6q-8-6-16.5-9t-19.5-3q-26 0-44 18t-18 44q0 20 9.5 35t26.5 21q-17 6-26.5 21t-9.5 35q0 26 18 44t44 18q11 0 19.5-3t16.5-9v6q0 26 18 44t44 18q26 0 44-18Zm-88-111.5Q418-549 418-576q0-26 18-44t44-18q26 0 44 18t18 44q0 27-18 44.5T480-514q-26 0-44-17.5ZM480-200q100 0 170-70t70-170q-100 0-170 70t-70 170ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/>
  </svg>
);

const glassCard = {
  bg: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.45)",
  sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 36px rgba(107,196,200,0.45)",
};

interface ProductosBannerProps {
  maxW?: string | object;
  w?: string | object;
  compact?: boolean;
}

const ProductosBanner = ({ maxW = "900px", w = "100%", compact = false }: ProductosBannerProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <Box
        w={w} maxW={maxW}
        {...glassCard}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Imagen */}
        <Box h="150px" position="relative" overflow="hidden" flexShrink={0}>
          <Image
            src="/img/jabones.png"
            alt="Productos naturales"
            w="100%" h="100%"
            objectFit="cover" objectPosition="center"
          />
          <Box
            position="absolute" bottom={0} left={0} right={0} h="70px"
            bgGradient="linear(to-b, transparent, rgba(0,100,90,0.7))"
            pointerEvents="none"
          />
        </Box>

        {/* Contenido */}
        <Box
          px={6} py={5}
          display="flex" flexDirection="column"
          alignItems="center" gap={3}
          textAlign="center"
          flex="1"
        >
          <Flex align="center" gap={2}>
            <Box bg="white" borderRadius="full" p="7px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} boxShadow="0 2px 10px rgba(0,0,0,0.12)">
              <FlowerIcon size="34px" />
            </Box>
            <Text
              color="white"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.04em"
              textShadow="0 2px 8px rgba(0,100,90,0.4)"
              lineHeight="1.2"
            >
              Productos Naturales
            </Text>
          </Flex>

          <Text
            color="rgba(255,255,255,0.78)"
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="'EB Garamond', serif"
            lineHeight="1.7"
            letterSpacing="0.01em"
          >
            Cuídate con ingredientes naturales y el Amor de la madre tierra.
          </Text>

          <Box
            as="button"
            onClick={() => navigate("/productos")}
            cursor="pointer"
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize="sm"
            letterSpacing="0.07em"
            px={5} py="6px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.1)"
            mt="auto"
            _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
            transition="all 0.2s"
          >
            Ver más →
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      w={w} maxW={maxW}
      {...glassCard}
      overflow="hidden"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "stretch" }}
    >
      {/* ── Imagen jabones (izquierda) ── */}
      <Box
        flexShrink={0}
        w={{ base: "100%", md: "260px" }}
        h={{ base: "220px", md: "auto" }}
        position="relative"
        overflow="hidden"
      >
        <Image
          src="/img/jabones.png"
          alt="Productos naturales"
          w="100%" h="100%"
          objectFit="cover" objectPosition="center"
        />
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

      {/* ── Contenido ── */}
      <Box
        flex="1"
        px={{ base: 8, md: 14 }}
        py={{ base: 8, md: 10 }}
        display="flex" flexDirection="column"
        justifyContent="space-between"
        gap={4}
        textAlign={{ base: "center", md: "left" }}
      >
        <Flex align="center" gap={3} justify={{ base: "center", md: "flex-start" }}>
          <Box bg="white" borderRadius="full" p="9px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} boxShadow="0 2px 14px rgba(0,0,0,0.14)">
            <FlowerIcon size="48px" />
          </Box>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.05em"
            textShadow="0 2px 10px rgba(0,100,90,0.35)"
            lineHeight="1.2"
          >
            Productos Naturales
          </Text>
        </Flex>

        <Text
          color="rgba(255,255,255,0.85)"
          fontSize={{ base: "md", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.9" letterSpacing="0.02em"
          textShadow="0 1px 5px rgba(0,100,90,0.25)"
        >
          Descubre todos los productos hechos con ingredientes naturales y Amor.
          Cuídate con las herramientas que nos ha dado la madre tierra.
        </Text>

        <Flex justify={{ base: "center", md: "flex-end" }} mt={1}>
          <Box
            as="button"
            onClick={() => navigate("/productos")}
            color="white" fontFamily="'EB Garamond', serif"
            fontWeight="600" fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.08em" px={7} py="9px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.6)"
            bg="rgba(255,255,255,0.12)" cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
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
