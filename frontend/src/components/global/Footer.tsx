import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { turquesa } from "../../Global";

const Footer = () => {
  return (
    <Box
        mt={"100px"}
        py={10}
        textAlign="center"
        color="white"
        bg={turquesa}
    >
      <Text>© 2026 Life as a Privilege - Todos los derechos reservados</Text>
    </Box>
  );
};

export default Footer;
