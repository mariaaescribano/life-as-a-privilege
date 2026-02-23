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
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 28px rgba(107,196,200,0.75), 0 0 55px rgba(107,196,200,0.35)"
      onClick={() => {window.scrollTo({ top: 0, behavior: 'auto' }); navigate(props.link)}}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 0 38px rgba(107,196,200,0.95), 0 0 70px rgba(107,196,200,0.45)",
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
