import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface DisciplineHeaderProps {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  color: string;
  maxW?: string;
}

export function DisciplineHeader({ icon, title, bgColor, color, maxW = "850px" }: DisciplineHeaderProps) {

  return (
    <Box
      bg={bgColor}
      borderRadius="2xl"
      boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
      px={{ base: 8, md: 14 }}
      py={{ base: 8, md: 12 }}
      w="100%"
      maxW={maxW}
      mb={{ base: 10, md: 12 }}
    >
      <Flex direction="row" align="center" justify="center" gap={5}>
        <Box
          borderRadius="full"
          bg={bgColor}
          border={`5px solid ${color}`}
          boxShadow={`0 0 22px ${color}77, 0 0 55px ${color}28`}
          w={{ base: "60px", md: "72px" }}
          h={{ base: "60px", md: "72px" }}
          display="flex"
          p="5px"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {icon}
        </Box>
        <Text
          color={color}
          fontSize={{ base: "2xl", md: "5xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
         // textShadow="0 2px 12px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        >
          {title}
        </Text>
      </Flex>
    </Box>
  );
}
