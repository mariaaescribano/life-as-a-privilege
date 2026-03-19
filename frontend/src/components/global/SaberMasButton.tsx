import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface SaberMasButtonProps {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
}

export function SaberMasButton({ icon, color, bgColor, onClick }: SaberMasButtonProps) {
  return (
    <Flex justify="center" w="100%" maxW="900px" mt={16}>
      <Box
        as="button"
        onClick={onClick}
        px={{ base: 10, md: 16 }}
        py={{ base: 4, md: 5 }}
        borderRadius="full"
        bg={bgColor}
        border={`2px solid ${color}`}
        color={`${color}cc`}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="600"
        letterSpacing="0.07em"
        cursor="pointer"
        transition="all 0.22s"
        whiteSpace="nowrap"
        boxShadow={`0 0 18px ${color}33`}
        _hover={{
          bg: bgColor,
          borderColor: color,
          color: color,
          boxShadow: `0 0 28px ${color}55`,
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
          >
            ¿Quieres saber más?
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
