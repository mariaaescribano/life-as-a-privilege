import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const SiteFooter = () => {
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
      <Flex justify="center" gap={6} mt={3}>
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          textDecoration="underline"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
        >
          Contactar
        </Text>
        <Text
          as="a"
          href="/quienSoy"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          textDecoration="underline"
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.2s"
        >
          Quién soy
        </Text>
      </Flex>
    </Box>
  );
};

export default SiteFooter;
