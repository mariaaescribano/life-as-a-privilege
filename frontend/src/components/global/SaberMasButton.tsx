import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface SaberMasButtonProps {
  icon?: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
}

export function SaberMasButton({ onClick }: SaberMasButtonProps) {
  return (
    <Flex justify="center" w="100%" maxW="900px" mt={10}>
      <Box
        as="button"
        onClick={onClick}
        px={{ base: 10, md: 16 }}
        py={{ base: 4, md: 5 }}
        borderRadius="full"
        bg="transparent"
        border="2px solid white"
        color="white"
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="600"
        letterSpacing="0.07em"
        cursor="pointer"
        transition="all 0.22s"
        whiteSpace="nowrap"
        boxShadow="0 0 18px rgba(255,255,255,0.15)"
        _hover={{
          bg: "rgba(255,255,255,0.1)",
          boxShadow: "0 0 28px rgba(255,255,255,0.28)",
          transform: "translateY(-1px)",
        }}
      >
        <Flex align="center" justify="center" gap={3}>
          {/* <Box flexShrink={0}>{icon}</Box> */}
          <Text
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="600"
            letterSpacing="0.07em"
            lineHeight="1"
            color="white"
          >
            ¿Quieres saber más?
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
