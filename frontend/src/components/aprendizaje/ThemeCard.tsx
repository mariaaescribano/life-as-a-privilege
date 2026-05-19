import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ThemeCard = (props:{
  title:string, bgColor:string, color:string, icon:any, link:string, cursor:string
}) => {
  const navigate = useNavigate();

  return (
    <Box
      bg={props.bgColor}
      borderRadius="2xl"
      px={{ base: 3, md: 5 }}
      py={{ base: 6, md: 7 }}
      cursor="pointer"
      minH={{ base: "176px", md: "208px" }}
      onClick={() => {window.scrollTo({ top: 0, behavior: "auto" }); navigate(props.link);}}
      border={`1px solid ${props.color}55`}
      position="relative"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        gap={{ base: 2.5, md: 3 }}
      >
        {/* Icono en círculo con halo */}
        <Box
          w={{ base: "62px", md: "74px" }}
          h={{ base: "62px", md: "74px" }}
          borderRadius="full"
          bg={`${props.color}1c`}
          border={`1.5px solid ${props.color}aa`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={`0 0 13px ${props.color}99, 0 0 29px ${props.color}66, 0 0 48px ${props.color}33`}
          flexShrink={0}
        >
          {props.icon}
        </Box>

        {/* Línea decorativa */}
        <Box
          w="27px"
          h="1px"
          bg={`${props.color}cc`}
          boxShadow={`0 0 8px ${props.color}cc, 0 0 18px ${props.color}66`}
        />

        {/* Título */}
        <Text
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "md", md: "xl" }}
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={props.color}
          textAlign="center"
          lineHeight="1.2"
          textShadow={`0 0 10px ${props.color}cc, 0 0 21px ${props.color}88, 0 0 40px ${props.color}55`}
        >
          {props.title}
        </Text>
      </Flex>
    </Box>
  );
};
