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
      p={6}
      cursor={props.cursor}
      minH="180px"
      boxShadow="lg"
      onClick={() => {window.scrollTo({ top: 0, behavior: 'auto' }); navigate(props.link)}}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
      }}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        gap={4}
      >
        <Box fontSize="48px">
          {props.icon}
        </Box>

        <Text
          fontWeight="600"
          fontSize="xl"
          color={props.color}
          textAlign="center"
        >
          {props.title}
        </Text>
      </Flex>
    </Box>
  );
};
