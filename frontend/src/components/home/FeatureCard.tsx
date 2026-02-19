import { Box, Flex, Image, Text, HStack } from "@chakra-ui/react";
import React from "react";
import UnderBtnFeatureCard from "./UnderBtnFeatureCard";

const FeatureCard = (props:{
  imagePosition:string, bgColor:string, foto:string, color:string, title:string, 
  icon:any, description: string, linkEspacio:string, linkAprendizaje:string
}) => {
  return (
  <Box
    bg={props.bgColor}
    w="100%"
    borderRadius="2xl"
    boxShadow="lg"
    overflow="hidden"
  >
    <Flex
      direction={{ base: "column", lg: props.imagePosition === "right" ? "row-reverse" : "row" }}
      gap={6}
      p={{ base: 6, lg: 8 }}
      align="center" 
    >
      <Box w={{ lg: "33%" }} display="flex" justifyContent="center">
        <Box borderRadius="xl" overflow="hidden" boxShadow="md">
          <Image
            src={props.foto}
            alt={"Img"}
            boxSize={{ base: "230px", md: "300px" }} 
            objectFit="cover"
            transition="transform 0.5s"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>
      </Box>
      
      <Flex
        w={{ lg: "67%" }}
        direction="column"
        justify="center"
        align="center" // centrado horizontal
        textAlign="center" // texto centrado
        gap={4}
      >
        <HStack spacing={3} justify="center">
          {props.icon}
          <Text
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold" color={props.color}
          >
            {props.title}
          </Text>
        </HStack>

        <Text
          color={props.color}
          lineHeight="tall"
          fontSize={{ base: "md", md: "lg" }}
          maxW={{ base: "90%", md: "70%" }}
        >
          {props.description}
        </Text>

        <UnderBtnFeatureCard color={props.color} linkAprendizaje={props.linkAprendizaje} 
        linkEspacio={props.linkEspacio} />

      </Flex>
    </Flex>
  </Box>

  );
};

export default FeatureCard;
