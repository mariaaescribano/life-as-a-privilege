import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface DisciplineHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  bgColor: string;
  color: string;
  maxW?: string;
  mb?:any;
  onIconClick?: () => void;
}

export function DisciplineHeader({ icon, title, subtitle, bgColor, color, maxW = "850px", mb={ base: 10, md: 12 }, onIconClick }: DisciplineHeaderProps) {

  return (
    <Box
      bg={bgColor}
      borderRadius="2xl"
      boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
      px={{ base: 8, md: 14 }}
      py={{ base: 8, md: 12 }}
      w="100%"
      maxW={maxW}
      mb= {mb}
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
          onClick={onIconClick}
          cursor={onIconClick ? "pointer" : "default"}
          _hover={onIconClick ? { opacity: 0.75, transform: "scale(1.05)" } : {}}
          transition="all 0.2s"
        >
          {icon}
        </Box>
        <Box>
          <Text
            color={color}
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
            lineHeight="1.15"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              color={color}
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="500"
              letterSpacing="0.03em"
              opacity={0.72}
              mt={1}
              filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.2))"
            >
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
