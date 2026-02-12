import React from "react";
import { Box, Flex, Image, Link } from "@chakra-ui/react";

export function Header() {
  return (
    <Box mb="150px">
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="130px"
        bg="#40E0D0"
        color="white"
        zIndex="1000"
      >
        <Flex
          height="100%"
          align="center"
          justify="center"
          position="relative"
          px={6}
        >
          {/* LEFT LINK */}
          <Link
            position="absolute"
            left="40px"
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
          >
            Registrarse
          </Link>

          {/* CENTER LOGO */}
          <Box width="230px" height="130px">
            <Image
              src="/img/life.png"
              alt="Life"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>

          {/* RIGHT LINK */}
          <Link
            position="absolute"
            right="40px"
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
          >
            Iniciar sesión
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}
