import { Box, Flex, Image, Text, Link, Heading, AspectRatio, HStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import React from "react";
import { fisiologiaBg, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt } from "../../GlobalVariables";

interface FeatureCardProps {
  imagePosition: "left" | "right";
  imageSrc: string;
  title: string;
  description: string;
}

const FeatureCard = ({ imagePosition, imageSrc, title, description }: FeatureCardProps) => {
  return (
  <Box
    bg={neuropsicologiaBg}
    w="100%"
    mt={{ base: "-150px", md: "0px" }}
    borderRadius="2xl"
    boxShadow="lg"
    overflow="hidden"
  >
    <Flex
      direction={{ base: "column", lg: imagePosition === "right" ? "row-reverse" : "row" }}
      gap={6}
      p={{ base: 6, lg: 8 }}
      align="center" 
    >
      <Box w={{ lg: "33%" }} display="flex" justifyContent="center">
        <Box borderRadius="xl" overflow="hidden" boxShadow="md">
          <Image
            src={"../public/img/life.png"}
            alt={title}
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
          <NeuropsicologiaIcon size="50px"/>
          <Text
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold" color={neuropsicologiaTxt}
          >
            Neuropsicología
          </Text>
        </HStack>

        <Text
          color={neuropsicologiaTxt}
          lineHeight="tall"
          fontSize={{ base: "md", md: "lg" }}
          maxW={{ base: "90%", md: "70%" }}
        >
          {description}
        </Text>


        <Flex
          align="center"
          justify="center"
          mt={6}
          pt={6}
          borderTop="1px solid"
          borderColor="gray.100"
          gap={6}
        >
          {["Buscar más", "Explorar"].map((label) => (
            <Link
              key={label}
              href="https://google.com"
              isExternal
              display="flex"
              alignItems="center"
              gap={2}
              color="gray.700"
              _hover={{ color: "orange.500" }}
              role="group"
            >
              <Text fontWeight="medium">{label}</Text>
              <Box
                as={ArrowRight}
                w="20px"
                h="20px"
                transition="transform 0.2s"
                _groupHover={{ transform: "translateX(4px)" }}
              />
            </Link>
          ))}
        </Flex>
      </Flex>
    </Flex>
  </Box>

  );
};

export default FeatureCard;
