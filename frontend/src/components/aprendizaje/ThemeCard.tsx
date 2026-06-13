import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

export const ThemeCard = (props:{
  title:string, bgColor:string, color:string, icon:any, link:string, cursor:string
}) => {
  const navigate = useNavigate();
  const hasBg = hasDisciplinaBg(props.title);

  return (
    <Box
      bg={hasBg ? "transparent" : props.bgColor}
      borderRadius="2xl"
      px={{ base: 3, md: 5 }}
      py={{ base: 6, md: 7 }}
      cursor="pointer"
      minH={{ base: "176px", md: "208px" }}
      onClick={() => {window.scrollTo({ top: 0, behavior: "auto" }); navigate(props.link);}}
      position="relative"
      overflow={hasBg ? "hidden" : undefined}
      transition="transform 0.25s ease"
      _hover={{ transform: "translateY(-4px)" }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {hasBg && <DisciplinaBgLayer nom={props.title} borderRadius="2xl" />}
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        gap={{ base: 2.5, md: 3 }}
        position="relative"
        zIndex={1}
      >
        {/* Icono en círculo con halo */}
        <Box
          w={{ base: "62px", md: "74px" }}
          h={{ base: "62px", md: "74px" }}
          borderRadius="full"
          bg={`${props.color}1c`}
          border={`3px solid ${props.color}`}
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
          fontSize={{ base: "lg", md: "2xl" }}
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={props.color}
          textAlign="center"
          lineHeight="1.2"
          textShadow={hasBg
            ? `0 1px 3px ${props.bgColor}f5, 0 0 6px ${props.bgColor}cc, 0 2px 14px ${props.bgColor}88`
            : `0 0 10px ${props.color}cc, 0 0 21px ${props.color}88, 0 0 40px ${props.color}55`}
        >
          {props.title}
        </Text>
      </Flex>
    </Box>
  );
};
