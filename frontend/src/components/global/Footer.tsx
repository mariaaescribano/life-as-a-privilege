import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

const SiteFooter = () => {
  const navigate = useNavigate();
  return (
    <Box
      as="footer"
      borderTop="1px solid rgba(255,255,255,0.15)"
      px={{ base: 6, md: 16 }}
      py={{ base: 8, md: 10 }}
    >
      <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
        © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
      </Text>
      <Flex justify="center" gap={6} mt={3} flexWrap="wrap" alignItems="center">
        <Text
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          textDecoration="underline"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
          onClick={() => navigate("/contacto")}
        >
          Contactar
        </Text>
        <Text
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          textDecoration="underline"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
          onClick={() => navigate("/quienSoy")}
        >
          Quién soy
        </Text>
        <Box
          as="a"
          href={DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap="6px"
          px={4}
          py="5px"
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.35)"
          color="rgba(255,255,255,0.80)"
          fontSize="sm"
          letterSpacing="0.05em"
          fontFamily="'EB Garamond', serif"
          cursor="pointer"
          textDecoration="none"
          transition="all 0.2s"
          _hover={{ bg: "rgba(255,255,255,0.10)", color: "white", borderColor: "rgba(255,255,255,0.6)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
          </svg>
          Donar
        </Box>
      </Flex>
    </Box>
  );
};

export default SiteFooter;
