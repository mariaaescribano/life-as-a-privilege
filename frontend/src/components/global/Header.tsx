import React from "react";
import { Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AprendizajeIcon, EspacioPersonalIcon, turquesa } from "../../GlobalVariables";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Header(props: {
  textRight?: string;
  textLeft?: string;
  linkRight?: string;
  linkLeft?: string;
  linkHeader?: string;
  dondeEstoy?:string;
  mb?: string;
}) {
  const navigate = useNavigate();

  return (
    <Box mb={props.mb ?? "20px"}>
      <Box
        position="relative"
        width="100%"
        height="130px"
        bg={turquesa}
        opacity={0.9}
        color="white"
        zIndex="1000"
      >
        <Flex
          height="100%"
          align="center"
          justify="center"
          position="relative"
          px={6}
        >
          {/* Link Derecho */}
          {!props.textRight && (
            <Link
              position="absolute"
              right="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate("/aprendizaje/aprendizajeHome")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <HStack spacing={2} justify="flex-end">
                <AprendizajeIcon color={props.dondeEstoy == "aprendizaje" ? "gray.300" : "white"} />
                {props.dondeEstoy != "aprendizaje" && <Box as={ArrowRight} w="24px" h="24px" />}
              </HStack>
            </Link>
          )}

          {props.textRight && (
            <Link
              position="absolute"
              right="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate(props.linkRight ?? "/")}
              color="white"
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <Text>{props.textRight}</Text>
            </Link>
          )}

          {/* Logo central */}
          <Box
            width="230px"
            height="130px"
            cursor="pointer"
            onClick={() => navigate(props.linkHeader ?? "/home")}
          >
            <Image
              src="/public/img/life.png"
              alt="Life"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>

          {/* Link Izquierdo */}
          {!props.textLeft &&(
            <Link
              position="absolute"
              left="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate("/espacio/espacioHome")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="start"
            >
              <HStack spacing={2} justify="flex-start">
                {props.dondeEstoy != "espacio" && <Box as={ArrowLeft} w="24px" h="24px" />}
                <EspacioPersonalIcon color={props.dondeEstoy == "espacio" ? "gray.300" : "white"} />
              </HStack>
            </Link>
          )}

          {props.textLeft && (
            <Link
              position="absolute"
              left="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate(props.linkLeft ?? "/")}
              color="white"
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <Text>{props.textLeft}</Text>
            </Link>
          )}

        </Flex>
      </Box>
    </Box>
  );
}
