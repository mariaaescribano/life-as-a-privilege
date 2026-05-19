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
        <Flex align="center" gap={6} flexWrap="wrap" justify="center">
        <Flex
          align="center"
          gap="6px"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
          onClick={() => navigate("/contacto")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="currentColor">
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
          </svg>
          Contactar
        </Flex>
        <Flex
          align="center"
          gap="6px"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
          onClick={() => navigate("/quienSoy")}
        >
          <Text fontSize="15px" lineHeight="1" color="white">♊︎</Text>
          Quién soy
        </Flex>
        <Box
          as="a"
          href="https://www.tiktok.com/@lifeasaprivilege"
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap="6px"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          cursor="pointer"
          textDecoration="none"
          transition="color 0.2s"
          _hover={{ color: "white" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
          </svg>
          TikTok
        </Box>
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
      </Flex>

    </Box>
  );
};

export default SiteFooter;
