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
  compact?: boolean;
}

export function DisciplineHeader({ icon, title, subtitle, bgColor, color, maxW = "850px", mb={ base: 10, md: 12 }, onIconClick, compact = false }: DisciplineHeaderProps) {

  return (
    <Box
      bg={bgColor}
      border={`1px solid ${color}44`}
      borderRadius="2xl"
      boxShadow={`0 0 22px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.15), 0 0 90px rgba(180,255,245,0.16), 0 0 40px ${color}55, 0 4px 22px rgba(0,0,0,0.22)`}
      px={compact ? { base: 6, md: 10 } : { base: 8, md: 14 }}
      py={compact ? { base: 2.5, md: 3 } : { base: 3.5, md: 4 }}
      w="100%"
      maxW={maxW}
      mb={mb}
    >
      <Flex direction="row" align="center" justify="center" gap={compact ? 4 : 6}>
        <Box
          borderRadius="full"
          bg={bgColor}
          border={`${compact ? 3 : 4}px solid ${color}`}
          boxShadow={`0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(255,255,255,0.25), 0 0 22px ${color}99, 0 0 55px ${color}44`}
          w={compact ? { base: "34px", md: "40px" } : { base: "44px", md: "52px" }}
          h={compact ? { base: "34px", md: "40px" } : { base: "44px", md: "52px" }}
          display="flex"
          p={compact ? "4px" : "5px"}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          onClick={onIconClick}
          cursor={onIconClick ? "pointer" : "default"}
          _hover={onIconClick ? { opacity: 0.85 } : {}}
          transition="opacity 0.2s ease"
        >
          {icon}
        </Box>
        <Box>
          <Text
            color={color}
            fontSize={compact ? { base: "lg", md: "2xl" } : { base: "xl", md: "4xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.15"
            style={{ textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${color}66` }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              color={color}
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="500"
              letterSpacing="0.03em"
              opacity={0.88}
              mt={1}
              style={{ textShadow: `0 0 10px rgba(255,255,255,0.4), 0 0 22px ${color}55` }}
            >
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
